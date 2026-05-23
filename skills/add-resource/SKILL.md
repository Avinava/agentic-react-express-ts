---
name: add-resource
description: Use when adding a new full-stack CRUD resource (e.g. "add a Comments resource"). Walks through Prisma model, Zod schema, tRPC router, and React page in order. Mirrors the patterns already used by Contact/Task/Project.
---

# Add a resource

Add a new full-stack CRUD resource end-to-end. Total time: ~10 minutes for a simple resource.

**Reference:** The `Contact` resource is the simplest existing example. Read it before you start:

- `prisma/schema.prisma` — `model Contact`
- `src/shared/schemas/contact.ts` — Zod schemas
- `src/server/routers/contact.ts` — tRPC router (list, byId, create, update, delete)
- `src/client/components/ContactForm.tsx` — RHF + Zod form
- `src/client/pages/ContactsPage.tsx` — page with table, dialog, mutations

## Ordered steps

Replace `Widget` / `widget` with your resource name throughout.

### 1. Database — `prisma/schema.prisma`

```prisma
model Widget {
  id        Int      @id @default(autoincrement())
  name      String
  notes     String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

```bash
npm run db:migrate    # generate + apply migration; name it "add_widget"
```

### 2. Shared schema — `src/shared/schemas/widget.ts`

```ts
import { z } from 'zod';

export const widgetInput = z.object({
  name: z.string().min(1).max(200),
  notes: z.string().max(2000).optional().nullable(),
});

export type WidgetInput = z.infer<typeof widgetInput>;

export const widgetUpdateInput = widgetInput.partial().extend({
  id: z.number().int().positive(),
});

export type WidgetUpdateInput = z.infer<typeof widgetUpdateInput>;
```

Then export it from `src/shared/schemas/index.ts`:

```ts
export * from './widget.js';
```

### 3. tRPC router — `src/server/routers/widget.ts`

Copy `src/server/routers/contact.ts` and adapt:

```ts
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { widgetInput, widgetUpdateInput } from '../../shared/schemas/index.js';
import { publicProcedure, router } from '../trpc.js';

const idInput = z.object({ id: z.number().int().positive() });

export const widgetRouter = router({
  list: publicProcedure.query(({ ctx }) =>
    ctx.prisma.widget.findMany({ orderBy: { createdAt: 'desc' } }),
  ),
  byId: publicProcedure.input(idInput).query(async ({ ctx, input }) => {
    const w = await ctx.prisma.widget.findUnique({ where: { id: input.id } });
    if (!w) throw new TRPCError({ code: 'NOT_FOUND', message: 'Widget not found' });
    return w;
  }),
  create: publicProcedure
    .input(widgetInput)
    .mutation(({ ctx, input }) => ctx.prisma.widget.create({ data: input })),
  update: publicProcedure.input(widgetUpdateInput).mutation(({ ctx, input }) => {
    const { id, ...data } = input;
    return ctx.prisma.widget.update({ where: { id }, data });
  }),
  delete: publicProcedure.input(idInput).mutation(async ({ ctx, input }) => {
    await ctx.prisma.widget.delete({ where: { id: input.id } });
    return { ok: true };
  }),
});
```

Wire it into `src/server/routers/index.ts`:

```ts
import { widgetRouter } from './widget.js';

export const appRouter = router({
  contact: contactRouter,
  task: taskRouter,
  project: projectRouter,
  widget: widgetRouter, // ← add
});
```

### 4. Client form — `src/client/components/WidgetForm.tsx`

Copy `ContactForm.tsx` and adapt — same pattern, RHF + Zod resolver.

### 5. Client page — `src/client/pages/WidgetsPage.tsx`

Copy `ContactsPage.tsx` and adapt. Wire the route in `src/client/App.tsx`:

```tsx
<Route path="/widgets" element={<WidgetsPage />} />
```

And the nav button in the same file.

### 6. Test

Add a basic form test (see `src/client/__tests__/ContactForm.test.tsx`) and/or a router validation test (see `src/server/__tests__/contact.router.test.ts`).

### 7. Commit

```bash
git add prisma src
git commit -m "feat(widget): add Widget CRUD resource"
```

If pre-commit complains: read all errors, fix in one pass, retry. See [`self-correcting-loop`](../self-correcting-loop/SKILL.md).

## Checklist

- [ ] Prisma model added + migration applied
- [ ] Zod schema in `src/shared/schemas/` + re-exported from `index.ts`
- [ ] tRPC router has all 5 operations: list, byId, create, update, delete
- [ ] Router registered in `src/server/routers/index.ts`
- [ ] Client form component using RHF + Zod resolver
- [ ] Client page with table, create/edit dialog, mutations using `trpc.widget.*`
- [ ] Route + nav button added to `App.tsx`
- [ ] At least one test added
- [ ] `npm run typecheck && npm run lint && npm run test:run` all pass
- [ ] Conventional commit message
