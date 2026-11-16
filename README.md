# maialab

Full-stack app: **React** client + **Express + TypeScript** server, **PostgreSQL** via **Prisma**.

## Prerequisites

- Node.js 22+
- Docker with Compose (PostgreSQL runs in a container)

## Project Structure

```
maialab/
├── client/              # React + Vite frontend
├── server/              # Express + TypeScript backend
└── docker-compose.yml   # PostgreSQL (host port 5433)
```

## Getting Started

### 1. Database

```bash
docker compose up -d
```

Postgres is exposed on **localhost:5433** (5432 is left free for a native install).

### 2. Server

```bash
cd server
npm install
cp .env.example .env      # then set JWT_SECRET and SEED_ADMIN_PASSWORD
npm run db:generate
npm run db:migrate
npm run db:seed           # creates the super admin from SEED_ADMIN_*
npm run dev
```

Server runs on **http://localhost:3001**. Health check: `GET /api/health`.

### 3. Client

```bash
cd client
npm install
npm run dev
```

Client runs on **http://localhost:5173** and proxies `/api` to `localhost:3001`.

## Available Scripts

### Server (`/server`)

| Command               | Description                      |
| --------------------- | -------------------------------- |
| `npm run dev`         | Start dev server with hot reload |
| `npm run build`       | Compile TypeScript to `dist/`    |
| `npm start`           | Run compiled server from `dist/` |
| `npm run db:migrate`  | Run Prisma migrations            |
| `npm run db:generate` | Generate Prisma client           |
| `npm run db:studio`   | Open Prisma Studio               |
| `npm run db:seed`     | Seed the database                |

### Client (`/client`)

| Command           | Description                      |
| ----------------- | -------------------------------- |
| `npm run dev`     | Start Vite dev server            |
| `npm run build`   | Type-check + production build    |
| `npm run preview` | Preview production build         |
| `npm run lint`    | Run ESLint                       |
| `npm run test`    | Run tests (Vitest)               |

## Tech Stack

**Client:** React 19, TypeScript, Vite 7, Tailwind CSS v4, shadcn/ui (Radix), TanStack Query, Zustand, React Hook Form + Zod, React Router 7, i18next (en/he/ar/ru, RTL)

**Server:** Express 5, TypeScript, Prisma 7 (`@prisma/adapter-pg`) + PostgreSQL, JWT in httpOnly cookie, bcrypt, email OTP (AWS SES, console fallback in dev)
