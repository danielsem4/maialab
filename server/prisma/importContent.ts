// Imports lab info, team members and projects from prisma/content/ as drafts.
// Safe to rerun: existing projects (by slug) and members (by email) are skipped,
// and lab info only fills empty fields. Pass --force to recreate the projects.
import { PrismaPg } from "@prisma/adapter-pg";
import { MemberCategory, PrismaClient, ProjectStatus } from "@prisma/client";
import fs from "fs/promises";
import path from "path";
import pg from "pg";
import { imageSize } from "image-size";
import "dotenv/config";
import { storage } from "../src/shared/storage/localStorage";

const pool = new pg.Pool({ connectionString: process.env["DATABASE_URL"] });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

const CONTENT_DIR = path.join(__dirname, "content");
const FORCE = process.argv.includes("--force");
const MIME_TYPES: Record<string, string> = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp" };

interface ImageRef { file: string; alt: string; caption?: string }

interface LabContent {
  lab: { tagline: string; about: string; mission: string; contactEmail: string; hero?: ImageRef };
  members: { name: string; title: string; email: string; category: MemberCategory; sortOrder: number; photo?: ImageRef }[];
}

interface ProjectContent {
  slug: string;
  title: string;
  summary: string;
  description: string;
  status: ProjectStatus;
  tags: string[];
  featured: boolean;
  sortOrder: number;
  cover?: ImageRef;
  images: ImageRef[];
  members: { email: string; role: string }[];
}

async function readJson<T>(file: string): Promise<T> {
  return JSON.parse(await fs.readFile(file, "utf8")) as T;
}

async function createMedia(dir: string, image: ImageRef): Promise<number> {
  const extension = path.extname(image.file).toLowerCase();
  const mimeType = MIME_TYPES[extension];
  if (!mimeType) throw new Error(`Unsupported image type: ${image.file}`);
  const buffer = await fs.readFile(path.join(dir, image.file));
  const { width, height } = imageSize(buffer);
  const stored = await storage.save(buffer, extension === ".jpeg" ? ".jpg" : extension);
  const media = await prisma.media.create({
    data: { filename: stored.filename, originalName: image.file, mimeType, size: stored.size, width, height, alt: image.alt },
  });
  return media.id;
}

async function importLab(): Promise<void> {
  const dir = path.join(CONTENT_DIR, "lab");
  const { lab, members } = await readJson<LabContent>(path.join(dir, "lab.json"));

  const current = await prisma.labInfo.upsert({ where: { id: 1 }, update: {}, create: { id: 1, name: "MAIA Lab" } });
  const updates: Record<string, string | number> = {};
  for (const key of ["tagline", "about", "mission", "contactEmail"] as const) {
    if (!current[key]) updates[key] = lab[key];
  }
  if (!current.heroMediaId && lab.hero) updates["heroMediaId"] = await createMedia(dir, lab.hero);
  await prisma.labInfo.update({ where: { id: 1 }, data: updates });
  console.log(`Lab info: filled ${Object.keys(updates).join(", ") || "nothing (already set)"}`);

  for (const member of members) {
    if (await prisma.member.findFirst({ where: { email: member.email } })) {
      console.log(`Member skipped (exists): ${member.name}`);
      continue;
    }
    const photoMediaId = member.photo ? await createMedia(dir, member.photo) : null;
    const { photo: _photo, ...data } = member;
    await prisma.member.create({ data: { ...data, photoMediaId, published: false } });
    console.log(`Member created (unpublished): ${member.name}`);
  }
}

async function importProject(slug: string): Promise<void> {
  const dir = path.join(CONTENT_DIR, "projects", slug);
  const project = await readJson<ProjectContent>(path.join(dir, "project.json"));

  const existing = await prisma.project.findUnique({ where: { slug: project.slug } });
  if (existing && !FORCE) {
    console.log(`Project skipped (exists): ${project.slug}`);
    return;
  }
  if (existing) await prisma.project.delete({ where: { id: existing.id } });

  const coverMediaId = project.cover ? await createMedia(dir, project.cover) : null;
  const images = [];
  for (const [sortOrder, image] of project.images.entries()) {
    images.push({ mediaId: await createMedia(dir, image), caption: image.caption ?? "", sortOrder });
  }
  const members = [];
  for (const { email, role } of project.members) {
    const member = await prisma.member.findFirst({ where: { email } });
    if (member) members.push({ memberId: member.id, role });
  }

  const { cover: _cover, images: _images, members: _members, ...data } = project;
  await prisma.project.create({
    data: { ...data, coverMediaId, published: false, images: { create: images }, members: { create: members } },
  });
  console.log(`Project ${existing ? "recreated" : "created"} (unpublished): ${project.slug}`);
}

async function main() {
  await importLab();
  const slugs = await fs.readdir(path.join(CONTENT_DIR, "projects"));
  for (const slug of slugs.sort()) await importProject(slug);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
