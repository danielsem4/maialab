// Mirrors the lab content (media, lab info, members, projects, publications, news) from the local
// database and uploads folder onto another deployment: its database and its Vercel Blob store.
// Usage: npm run db:mirror-content -- --target-env ../.vercel/.env.production.local,../.env.local [--apply]
// Dry run unless --apply is passed. Users, OTP codes and audit logs on the target are never touched.
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { BlobNotFoundError, head, put } from "@vercel/blob";
import dotenv from "dotenv";
import { createReadStream, readFileSync } from "fs";
import fs from "fs/promises";
import path from "path";
import pg from "pg";
import "dotenv/config";
import { UPLOAD_DIR } from "../src/shared/storage/localStorage";

// Insert order (parents first); deletes run in reverse.
const TABLES = ["media", "labInfo", "member", "project", "projectImage", "projectMember", "publication", "newsPost"] as const;
const SEQUENCED = ["Media", "Member", "Project", "ProjectImage", "Publication", "NewsPost"];
const APPLY = process.argv.includes("--apply");

type Table = (typeof TABLES)[number];
type Row = Record<string, unknown>;
interface Delegate {
  findMany(): Promise<Row[]>;
  count(): Promise<number>;
  deleteMany(): Promise<unknown>;
  createMany(args: { data: Row[] }): Promise<unknown>;
}
type Db = Pick<PrismaClient, Table>;

const delegate = (db: Db, table: Table) => db[table] as unknown as Delegate;
const connect = (url: string) => new PrismaClient({ adapter: new PrismaPg(new pg.Pool({ connectionString: url })) });

function readTarget() {
  const file = process.argv[process.argv.indexOf("--target-env") + 1];
  if (!process.argv.includes("--target-env") || !file) throw new Error("Pass --target-env <env file of the target deployment>");
  // Several comma-separated files are merged, later ones winning (Vercel redacts secrets in pulled production files).
  const env = Object.assign({}, ...file.split(",").map((name) => dotenv.parse(readFileSync(name))));
  const url = env["DATABASE_URL_UNPOOLED"] || env["DATABASE_URL"];
  const blobBaseUrl = env["BLOB_BASE_URL"];
  const blobToken = env["BLOB_READ_WRITE_TOKEN"];
  if (!url || !blobBaseUrl || !blobToken) throw new Error(`${file} must define DATABASE_URL, BLOB_BASE_URL and BLOB_READ_WRITE_TOKEN`);
  return { url, blobBaseUrl: blobBaseUrl.replace(/\/+$/, ""), blobToken };
}

async function snapshot(db: Db): Promise<Record<Table, Row[]>> {
  const data = {} as Record<Table, Row[]>;
  for (const table of TABLES) data[table] = await delegate(db, table).findMany();
  return data;
}

function onlyIn(a: Row[], b: Row[], key: string): string[] {
  const other = new Set(b.map((row) => row[key]));
  return a.filter((row) => !other.has(row[key])).map((row) => String(row[key]));
}

async function missingBlobs(media: Row[], baseUrl: string, token: string): Promise<Row[]> {
  const missing: Row[] = [];
  for (let i = 0; i < media.length; i += 8) {
    await Promise.all(media.slice(i, i + 8).map(async (row) => {
      try {
        await head(`${baseUrl}/${row["filename"]}`, { token });
      } catch (err) {
        if (!(err instanceof BlobNotFoundError)) throw err;
        missing.push(row);
      }
    }));
  }
  return missing;
}

async function main() {
  const sourceUrl = process.env["DATABASE_URL"];
  const target = readTarget();
  const targetHost = new URL(target.url).hostname;
  if (!sourceUrl) throw new Error("DATABASE_URL (the local source database) is not set");
  if (target.url === sourceUrl || ["localhost", "127.0.0.1"].includes(targetHost)) {
    throw new Error("The target must be a remote database different from the source");
  }

  const sourceDb = connect(sourceUrl);
  const targetDb = connect(target.url);
  try {
    const local = await snapshot(sourceDb);
    const remote = await snapshot(targetDb);

    console.log(`Source: ${new URL(sourceUrl).hostname}  →  Target: ${targetHost}`);
    for (const table of TABLES) console.log(`  ${table.padEnd(14)} local ${local[table].length}  target ${remote[table].length}`);
    const published = (rows: Row[]) => rows.filter((row) => row["published"]).length;
    console.log(`Published projects: local ${published(local.project)}  target ${published(remote.project)}`);
    console.log("Projects only on local: ", onlyIn(local.project, remote.project, "slug").join(", ") || "-");
    console.log("Projects only on target:", onlyIn(remote.project, local.project, "slug").join(", ") || "-");
    console.log("Media only on target:   ", onlyIn(remote.media, local.media, "filename").length);

    const missing = await missingBlobs(local.media, target.blobBaseUrl, target.blobToken);
    console.log(`Files to upload to Blob: ${missing.length}`, missing.map((row) => row["filename"]));
    if (!APPLY) {
      console.log("\nDry run — nothing was changed. Rerun with --apply to mirror.");
      return;
    }

    for (const row of missing) {
      const filename = String(row["filename"]);
      await put(filename, createReadStream(path.join(UPLOAD_DIR, filename)), {
        access: "public",
        addRandomSuffix: false,
        contentType: String(row["mimeType"]),
        multipart: true,
        token: target.blobToken,
      });
      console.log(`  uploaded ${filename}`);
    }

    const backupFile = path.join(__dirname, "..", "backups", `content-${targetHost}-${Date.now()}.json`);
    await fs.mkdir(path.dirname(backupFile), { recursive: true });
    await fs.writeFile(backupFile, JSON.stringify(remote));
    console.log(`Target backup written to ${backupFile}`);

    const userIds = new Set((await targetDb.user.findMany({ select: { id: true } })).map((user) => user.id));
    const media = local.media.map((row) => ({ ...row, uploadedById: userIds.has(row["uploadedById"] as number) ? row["uploadedById"] : null }));

    await targetDb.$transaction(async (tx) => {
      for (const table of [...TABLES].reverse()) await delegate(tx, table).deleteMany();
      for (const table of TABLES) {
        const data = table === "media" ? media : local[table];
        if (data.length) await delegate(tx, table).createMany({ data });
      }
      for (const name of SEQUENCED) {
        await tx.$queryRawUnsafe(`SELECT setval(pg_get_serial_sequence('"${name}"', 'id'), COALESCE((SELECT MAX(id) FROM "${name}"), 0) + 1, false)`);
      }
    }, { timeout: 120_000, maxWait: 20_000 });

    for (const table of TABLES) {
      const count = await delegate(targetDb, table).count();
      console.log(`  ${table.padEnd(14)} target now ${count} ${count === local[table].length ? "✓" : "✗ MISMATCH"}`);
    }
  } finally {
    await sourceDb.$disconnect();
    await targetDb.$disconnect();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
