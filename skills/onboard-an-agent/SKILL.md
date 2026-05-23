---
name: onboard-an-agent
description: Use the first time an agent (or human) opens this repo. Installs deps, prepares the env, validates that the dev environment works, and points the agent at the right files.
---

# Onboard an agent

Use this skill the very first time you open this repo. Five minutes from clone to "dev server running, tests green, ready to ship features."

## Steps

### 1. Confirm prerequisites

```bash
node --version    # must be >= 22
which psql        # Postgres client should be installed
pg_isready        # Postgres should be running
git --version
```

If Postgres isn't running locally, install it (`brew install postgresql@16 && brew services start postgresql@16` on macOS) or point `DATABASE_URL` at a remote instance later.

### 2. Install dependencies

```bash
npm install
```

This installs Node packages **and** wires up Lefthook (`prepare` script). After this, `git commit` will run the full pre-commit pipeline.

### 3. Configure environment

```bash
cp example.env .env
```

Open `.env` and confirm `DATABASE_URL` matches your local (or remote) Postgres. The default points to `postgresql://postgres:postgres@localhost:5432/agentic_react_express_ts`.

### 4. Initialize the database

```bash
npm run db:setup    # runs `prisma migrate dev` + `prisma generate`
npm run db:seed     # loads demo CRM data
```

If `db:setup` errors, the most common causes are: wrong port, wrong user/password, or Postgres not running. Fix `DATABASE_URL` and retry — do NOT delete the migrations directory.

### 5. Verify everything works

```bash
npm run typecheck   # zero errors
npm run lint        # zero warnings
npm run test:run    # all pass
npm run build       # production build succeeds
```

All four must pass before touching application code. If something fails, **do not start coding** — debug the failure first. The guardrails are the whole point.

### 6. Start the dev server

```bash
npm run dev
```

Open <http://localhost:3000>. You should see the homepage, then Contacts/Tasks/Projects with seeded data.

### 7. Read the rest

- [`AGENTS.md`](../../AGENTS.md) — conventions, stack, scripts
- [`skills/add-resource/SKILL.md`](../add-resource/SKILL.md) — how to add a new CRUD resource
- [`skills/self-correcting-loop/SKILL.md`](../self-correcting-loop/SKILL.md) — what to do when a commit is rejected

You're done. Pick a task and start building.

## Troubleshooting

| Symptom                                          | Fix                                                                                  |
| ------------------------------------------------ | ------------------------------------------------------------------------------------ |
| `npm install` fails with peer dep errors         | Confirm Node >= 22 (`nvm use`)                                                       |
| `prisma migrate dev` says "Can't reach database" | Check Postgres is running, `DATABASE_URL` matches                                    |
| `npm run dev` shows blank page                   | Check the server (:3001) is up. Browser DevTools → Network → look at `/trpc/…` calls |
| Pre-commit fails on a fresh clone                | The guardrails work — read [self-correcting-loop](../self-correcting-loop/SKILL.md)  |
