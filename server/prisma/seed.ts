import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";
import pg from "pg";
import "dotenv/config";

const pool = new pg.Pool({
  connectionString: process.env["DATABASE_URL"],
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const SALT_ROUNDS = 10;

async function main() {
  const email = process.env["SEED_ADMIN_EMAIL"]?.toLowerCase();
  const password = process.env["SEED_ADMIN_PASSWORD"];
  if (!email || !password) {
    throw new Error("SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD must be set");
  }

  const hashPassword = await bcrypt.hash(password, SALT_ROUNDS);
  await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, name: "Super Admin", hashPassword, role: Role.SUPER_ADMIN },
  });
  console.log(`Seeded super admin: ${email}`);

  // Starter content only — admins replace it from the admin panel.
  await prisma.labInfo.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, name: "MAIA Lab" },
  });

  const projectCount = await prisma.project.count();
  if (projectCount === 0) {
    await prisma.project.create({
      data: {
        slug: "example-project",
        title: "Example project",
        summary: "A draft that shows how projects look. Edit or delete it from the admin panel.",
        description: "## Overview\n\nDescribe the research question, methods and results here.",
        tags: ["example"],
        published: false,
      },
    });
  }
  console.log("Seeded starter lab info and example project");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
