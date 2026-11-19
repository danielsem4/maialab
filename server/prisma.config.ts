import "dotenv/config";
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  // Prisma CLI (migrate, studio) needs a direct connection; Neon's pooled
  // DATABASE_URL is for the app runtime (src/lib/prisma.ts).
  datasource: {
    url: process.env['DATABASE_URL_UNPOOLED'] || env('DATABASE_URL'),
  },
  migrations: {
    seed: 'npx ts-node prisma/seed.ts',
  },
});
