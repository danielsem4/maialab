# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `docker compose up -d` — Start PostgreSQL (host port **5433**)
- **Server** (`cd server`): `npm run dev` (nodemon + ts-node, port 3001), `npm run build` (tsc), `npm run db:migrate`, `npm run db:generate`, `npm run db:seed`, `npm run db:studio`
- **Client** (`cd client`): `npm run dev` (Vite, port 5173, proxies `/api` → `localhost:3001`), `npm run build` (tsc -b + vite build), `npm run lint`, `npm run test` (Vitest)

## Architecture

Two independent npm projects (no workspaces): `client/` and `server/`.

### Server — Express 5 + TypeScript (CommonJS) + Prisma 7 + PostgreSQL

- **Entry:** `server/src/index.ts` — helmet, cors (`CLIENT_URL`, credentials), cookie-parser, routers mounted under `/api/<resource>` (no versioning), `errorHandler` last.
- **Prisma:** schema in `server/prisma/schema.prisma`; datasource URL comes from `prisma.config.ts` (`DATABASE_URL`); singleton client in `src/lib/prisma.ts` using `@prisma/adapter-pg`.
- **Auth:** JWT (8h) in httpOnly cookie `token` (`src/shared/utils/cookie.ts`). Login is two-step: `POST /api/auth/login` → OTP emailed (logged to console when SES isn't configured) → `POST /api/auth/verify-otp` sets the cookie. `authenticate` middleware puts `{ userId, role }` on `req.currentUser`; `authorize(...roles)` checks role.
- **Errors:** throw `AppError(message, statusCode)`; `errorHandler` turns it into `{ message }`.
- **Validation:** `validateRequest(zodSchema)` middleware on routes.

**Module pattern** — each feature is `src/modules/<name>/` with:
- `<name>.routes.ts` — manually wires `new Repository()` → `new Service(repo)` → `create<Name>Controller(service)`, exports `<name>Router`
- `<name>.controller.ts` — `create<Name>Controller(service)` factory; each handler `try { ... } catch (err) { next(err) }`
- `<name>.service.ts` — class taking the repository interface in its constructor; business logic + `AppError`s
- `<name>.repository.ts` — `I<Name>Repository` interface + class using the `prisma` singleton
- `<name>.schema.ts` — Zod schemas + `z.infer` DTO types

Reference implementation: `src/modules/auth/`.

### Client — React 19 + TypeScript + Vite

- **Routing:** `client/src/router.tsx` (React Router 7 `createBrowserRouter`). Authenticated routes are children of `src/common/components/layouts/ProtectedLayout.tsx` (sidebar + header shell; redirects to `/login` when no `userId`).
- **State layers:**
  - **Zustand** (`src/store/`) — `useAuthStore` (only `userId`/`role` persisted as `"auth-store"`), `useThemeStore` (light/dark/system), `useLanguageStore`
  - **TanStack React Query** (`src/hooks/queries/`) — server data, in-memory only
  - **Axios instance** (`src/lib/axios.ts`) — `baseURL: "/api"`, `withCredentials`; 401 (outside `/auth/*`) clears the store and redirects to `/login`
- **API modules:** `src/api/*Api.ts`, consumed by query hooks.

## Coding Standards & Best Practices

### 1. Component Architecture ("Dumb Components")

- **Separation of Concerns:** Components should be purely presentational ("dumb").
- **Logic Extraction:** Move all business logic, state management, and side effects into **Custom Hooks** or **Zustand Stores**.
- **No Inline Functions:** Do not define handlers inside the JSX `return` statement. Define them in the hook or component body.
  - _Bad:_ `<button onClick={() => setCount(c => c + 1)} />`
  - _Good:_ `<button onClick={handleIncrement} />`

### 2. Reusability (DRY Principle)

- **Logic:** If you write the same logic twice, create a reusable hook in `src/hooks/common/`.
- **UI:** If you see repeated JSX structures, extract them into reusable components in `src/components/common/`.

### 3. File Structure & Naming

- **Hooks:** Must start with `use` (e.g., `useLogin.tsx`, `useToggle.ts`).
- **Components:** PascalCase (e.g., `PatientCard.tsx`).
- **Utilities:** camelCase (e.g., `dateUtils.ts`).
- **File Limits:** Files should aim to be under **150 lines**. If a file exceeds this, split logic into smaller hooks or sub-components.

### 4. Memoization

Do not use `useMemo` or `useCallback` manually unless there is a measured need.

### 5. Testing

- **Mandatory Utils Testing:** Every new utility function in `client/src/lib/` or `client/src/common/utils/` must have a corresponding unit test file (e.g., `myUtil.test.ts`).

### 6. Internationalization (i18n)

- **All user-visible strings** must use `t()` from `react-i18next`. Never write raw English in JSX or component logic.
- **No fallback strings:** Do not use `t("key") || "English fallback"` — add the key to the locale files instead.
- **Schema error messages** must be i18n key strings, not raw English.
- **All 4 locale files** must be updated together: `client/src/i18n/locales/en.ts`, `he.ts`, `ar.ts`, `ru.ts`.
- RTL (`he`, `ar`): use logical utilities (`ms-*`, `start-*`, `text-start`) and `rtl:`/`ltr:` variants.

## Key Conventions

- Client import alias: `@/*` → `client/src/*`
- UI components in `client/src/components/ui/` (shadcn new-york, Radix + CVA); theme tokens in `client/src/index.css` (oklch, `.dark` variant)
- Screens in `client/src/screens/{route}/` with co-located `components/`, `hooks/`, `schema/`
- Types: `I` prefix interfaces (`IAuthUser`) in `client/src/common/types/`
- Styling: Tailwind CSS v4 via `@tailwindcss/vite`, `cn()` in `client/src/lib/utils.ts`

## Security Rules

- **Never persist sensitive data** (passwords, tokens, PII) to localStorage. The httpOnly cookie is the real auth mechanism.
- All client API calls go through `client/src/lib/axios.ts`.
- Never commit `server/.env`; keep `server/.env.example` in sync when adding env vars.
