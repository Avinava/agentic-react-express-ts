---
name: remove-demo-code
description: Use when starting a real project from this template. Removes the CRM demo (Contact/Task/Project) cleanly so the repo is a blank slate without breaking guardrails.
---

# Remove the demo code

When you start a real project, strip the CRM demo (Contact, Task, Project) but keep all the guardrails, agent files, and skills. Total time: ~5 minutes.

## Steps

### 1. Reset the database

```bash
npm run db:reset
```

Wipes the dev DB. Confirm when prompted.

### 2. Replace the schema

Open `prisma/schema.prisma` and delete the three demo models (`Contact`, `Task`, `Project`, `ProjectMember`) and the two enums (`TaskStatus`, `Priority`). Keep the `datasource` and `generator` blocks. Add your own models.

```bash
npm run db:migrate
```

### 3. Delete demo backend files

```bash
rm src/shared/schemas/{contact,task,project}.ts
rm src/server/routers/{contact,task,project}.ts
rm src/server/__tests__/contact.router.test.ts
```

Edit `src/shared/schemas/index.ts` and `src/server/routers/index.ts` to remove the deleted exports.

### 4. Delete demo frontend files

```bash
rm src/client/components/{ContactForm,TaskForm,ProjectForm}.tsx
rm src/client/pages/{ContactsPage,TasksPage,ProjectsPage}.tsx
rm src/client/__tests__/ContactForm.test.tsx
```

Open `src/client/App.tsx` — remove the demo routes and nav buttons. Open `src/client/pages/HomePage.tsx` — replace with whatever your app needs (or keep the layout, swap the data).

### 5. Replace demo seed data

Edit `prisma/seed.ts` — delete the contacts/projects/tasks and add your own.

### 6. Update docs

- `README.md` — replace the project description and screenshots with yours.
- `AGENTS.md` — update the "Adding a feature" section if your domain is different from CRUD-on-Postgres.
- `package.json` — change `name` and `description`.

### 7. Verify

```bash
npm run typecheck && npm run lint && npm run test:run && npm run build
```

All four must pass. If any fail, you missed an import — search for `Contact`, `Task`, `Project`.

### 8. Reset git history (optional)

If you used `degit` you don't need this. If you cloned, reset:

```bash
rm -rf .git
git init
git add .
git commit -m "feat: initial commit"
```

## Checklist

- [ ] Database reset
- [ ] `prisma/schema.prisma` replaced
- [ ] Demo shared schemas removed
- [ ] Demo tRPC routers removed + `appRouter` updated
- [ ] Demo pages/components removed + routes/nav updated
- [ ] Seed file replaced
- [ ] README, AGENTS, package.json updated
- [ ] `typecheck`, `lint`, `test`, `build` all pass
