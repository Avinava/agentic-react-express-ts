# AGENTS.md

> Canonical guide for AI coding agents (Claude Code, Codex, Cursor, Aider, GitHub Copilot, Gemini CLI) working in this repo. `CLAUDE.md`, `GEMINI.md`, and `.github/copilot-instructions.md` all point here.

## Mission

`agentic-react-express-ts` is a production-ready full-stack TypeScript template designed for the agentic era. It's meant to be:

1. **Type-safe end-to-end** — tRPC carries types from server to client; nothing untyped crosses the wire.
2. **Guardrailed** — every commit runs ESLint + TypeScript + Prettier + Knip + Vitest + Gitleaks + Commitlint in parallel (~3s). Failed commits are rejected. See `skills/self-correcting-loop/SKILL.md`.
3. **Skill-driven** — common workflows (add a resource, remove the demo, deploy) live as `skills/<name>/SKILL.md` files you can read step-by-step.

Keep this template simple, clean, and well-documented. When in doubt: fewer features, clearer code.

## Stack

| Layer        | Tool                                                        |
| ------------ | ----------------------------------------------------------- |
| Language     | TypeScript 5.x (`strict: true`, `noUncheckedIndexedAccess`) |
| Client       | React 19 + Vite 7 + MUI 7 + React Router 7                  |
| Server       | Express 5 + tRPC 11 (Express adapter)                       |
| Data         | Prisma 7 + PostgreSQL                                       |
| Validation   | Zod (via tRPC `.input(…)`)                                  |
| Forms        | React Hook Form + Zod resolver                              |
| Server state | TanStack Query (via `@trpc/react-query`)                    |
| Tests        | Vitest 4 + React Testing Library + jsdom                    |
| Commits      | Conventional Commits (commitlint)                           |
| Pre-commit   | Lefthook (parallel)                                         |

## Architecture

```
src/
├── client/    React app (UI only, no business logic)
├── server/    Express + tRPC routers (all I/O and DB access)
└── shared/    Zod schemas + types reused by both
```

**Boundary rules** (enforced by ESLint `no-restricted-imports`):

- `src/server/**` must NOT import from `src/client/**`.
- `src/client/**` must NOT import values from `src/server/**`. The only allowed cross-tier import is `import type { AppRouter } from '@/server/routers'` for tRPC's type inference.
- `src/shared/**` is the safe shared zone — both sides may import from it freely.

Why: this is how the template makes the server bundle small and prevents secrets/business-logic leaks into the client.

## Setup

```bash
nvm use                   # Node 22
npm install               # installs deps + lefthook hooks
cp example.env .env       # edit DATABASE_URL
npm run setup             # generate Prisma client
npm run db:setup          # apply migrations
npm run db:seed           # load demo CRM data
npm run dev               # client :3000 + server :3001
```

## Scripts

| Script                                                                   | What it does                                   |
| ------------------------------------------------------------------------ | ---------------------------------------------- |
| `npm run dev`                                                            | Client + server in parallel (concurrently)     |
| `npm run client`                                                         | Vite dev server (:3000)                        |
| `npm run server`                                                         | Express + tRPC via nodemon + tsx (:3001)       |
| `npm run build`                                                          | Build client (`vite build`) and server (`tsc`) |
| `npm run typecheck`                                                      | `tsc --noEmit` for client and server configs   |
| `npm run lint` / `lint:fix`                                              | ESLint                                         |
| `npm run lint:unused`                                                    | Knip — unused exports/deps                     |
| `npm run format` / `format:check`                                        | Prettier                                       |
| `npm run test` / `test:run` / `test:coverage`                            | Vitest                                         |
| `npm run db:setup` / `db:migrate` / `db:seed` / `db:studio` / `db:reset` | Prisma                                         |

## Conventions

- **ESM only.** `import`/`export`, never `require`. File extensions in imports (`.js`) — see `verbatimModuleSyntax` semantics.
- **Functional components** only.
- **Custom hooks for data** — never call fetch/axios directly in pages; use tRPC hooks (`trpc.contact.list.useQuery()`).
- **MUI for UI** — `@mui/material` components, `sx` prop for one-off styling, theme tokens for everything else.
- **Server validation** — never trust inputs. Every mutation must define `.input(zodSchema)`.
- **Errors** — throw `TRPCError({ code, message })`. Don't return ad-hoc `{ success: false }` shapes.
- **No `any`.** Use `unknown` and narrow.
- **Type-only imports.** `import type { … }` for types. ESLint enforces.

## Adding a feature

1. **Always start by reading `skills/add-resource/SKILL.md`** — it has the exact, ordered steps for adding a new full-stack CRUD resource.
2. For one-off changes, mirror an existing resource. The `contact` resource is the simplest reference (`prisma/schema.prisma` → `src/shared/schemas/contact.ts` → `src/server/routers/contact.ts` → `src/client/pages/ContactsPage.tsx`).

## Testing

```bash
npm test            # watch mode
npm run test:run    # one-shot (CI)
```

- Client tests use jsdom + RTL. Setup in `src/client/__tests__/setup.ts`.
- Server tests use tRPC `createCallerFactory` with a mocked Prisma client.
- **Never modify a test to make it pass.** If a test fails, the code is wrong. See `skills/self-correcting-loop/SKILL.md`.

## Commit style

Conventional Commits. `<type>(<scope>): <subject>`.

```
feat(contact): add email validation
fix(server): handle empty body in tRPC mutations
chore(deps): bump prisma to 7.4.1
```

Types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `style`, `perf`, `ci`.

**Never use `--no-verify`.** If pre-commit hooks fail, read the errors and fix them. The whole point of the guardrails is to catch bad commits before they land.

## Skills (read these when relevant)

| Skill                                                                          | When                                       |
| ------------------------------------------------------------------------------ | ------------------------------------------ |
| [`skills/onboard-an-agent/SKILL.md`](skills/onboard-an-agent/SKILL.md)         | First time opening this repo               |
| [`skills/add-resource/SKILL.md`](skills/add-resource/SKILL.md)                 | Adding any new CRUD resource               |
| [`skills/self-correcting-loop/SKILL.md`](skills/self-correcting-loop/SKILL.md) | Whenever a commit is rejected              |
| [`skills/remove-demo-code/SKILL.md`](skills/remove-demo-code/SKILL.md)         | When stripping the demo for a real project |
| [`skills/deploy-checklist/SKILL.md`](skills/deploy-checklist/SKILL.md)         | Before pushing to a deployed env           |

## Key files (quick map)

| File                                     | Purpose                                                               |
| ---------------------------------------- | --------------------------------------------------------------------- |
| `src/server/index.ts`                    | Express boot, helmet, CORS, rate limit, tRPC mount, graceful shutdown |
| `src/server/routers/index.ts`            | `appRouter` — composes contact/task/project routers                   |
| `src/server/trpc.ts`                     | `initTRPC`, `publicProcedure`, `createCallerFactory`                  |
| `src/server/context.ts`                  | Per-request context (`prisma`, `req`, `res`)                          |
| `src/client/main.tsx`                    | React entry — providers, router                                       |
| `src/client/trpc.tsx`                    | tRPC client + TanStack Query provider                                 |
| `src/shared/schemas/*`                   | Zod schemas reused on both sides                                      |
| `prisma/schema.prisma`                   | Database schema                                                       |
| `eslint.config.js`                       | Flat config — strict TS, import order, boundary rules                 |
| `lefthook.yml`                           | Pre-commit pipeline                                                   |
| `tsconfig.json` / `tsconfig.server.json` | Client (bundler) vs server (NodeNext) TS configs                      |
