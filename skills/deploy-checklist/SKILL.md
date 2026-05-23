---
name: deploy-checklist
description: Use before pushing to a deployed environment (staging or prod). Walks through env vars, migrations, secrets, build, and rollback prep.
---

# Deploy checklist

Run through this before every deploy. Skipping it is how outages happen.

## 1. Environment variables

Every variable in `example.env` must exist in the deploy target with a real value:

- `DATABASE_URL` — points at the production Postgres (not local!)
- `PORT` — matches what the platform expects (usually set by the platform itself)
- `NODE_ENV=production`

Run on your local machine pointing at the prod env (carefully):

```bash
# Confirm the deployed app can reach the prod DB.
DATABASE_URL="<prod url>" npx prisma db pull --print | head -20
```

If that errors, fix the connection string before deploying.

## 2. Database migrations

```bash
DATABASE_URL="<prod url>" npx prisma migrate deploy
```

`migrate deploy` is the only command safe for production — it never resets, never prompts. Never run `migrate dev` against prod.

## 3. Secret hygiene

```bash
npx gitleaks detect --no-banner
```

If gitleaks finds anything in history, **stop**. Rotate the leaked credential and force-push only after coordinating with the user. Hardcoded secrets are the #1 cause of preventable breaches.

Check `.env` is in `.gitignore`:

```bash
git check-ignore .env    # must print ".env"
```

## 4. Build

```bash
npm run build
```

Both the client (`vite build`) and server (`tsc -p tsconfig.server.json`) must build clean. If either errors, deploy fails — fix locally first.

## 5. Run the full guardrail pass

```bash
npm run typecheck && npm run lint && npm run lint:unused && npm run test:run
```

CI does this too, but running locally first catches issues before they waste deploy time.

## 6. Smoke test the build

```bash
NODE_ENV=production node dist/server/index.js
# In another terminal:
curl http://localhost:3001/api/health
```

`{ "status": "ok", "env": "production" }` means the server started cleanly. Hit a tRPC endpoint too:

```bash
curl http://localhost:3001/trpc/contact.list
```

## 7. Rollback plan

Know how you'll roll back **before** you deploy:

- Platform redeploy of previous build (most platforms: 1 click)
- `prisma migrate resolve --rolled-back <migration-name>` if a migration corrupted state
- DB backup snapshot before the deploy (use the platform's built-in snapshot)

## Checklist

- [ ] Prod env vars set and verified
- [ ] `prisma migrate deploy` succeeded
- [ ] `gitleaks detect` clean
- [ ] `.env` is in `.gitignore`
- [ ] `npm run build` succeeds locally
- [ ] `typecheck`, `lint`, `lint:unused`, `test:run` all pass
- [ ] Smoke test against production build succeeds
- [ ] DB snapshot taken; rollback path identified
