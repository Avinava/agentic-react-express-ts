# GitHub Copilot Instructions

Read [`AGENTS.md`](../AGENTS.md) first for full architecture and conventions.

## Copilot-specific essentials

- **TypeScript strict.** No `any`. No `!`. No `as unknown as T`.
- **Boundary rule:** `src/server/**` and `src/client/**` cannot import each other (type-only client→server is OK for tRPC's `AppRouter`).
- **Validation lives in `src/shared/schemas/`** as Zod. tRPC `.input(schema)` is the only way to accept mutation data.
- **MUI** for UI primitives; `sx` for one-offs.
- **Conventional Commits** — `feat(scope): …`, `fix(scope): …`, etc. No `--no-verify`.
- **Skills:** [`skills/`](../skills/) has step-by-step recipes for adding resources, removing the demo, and unblocking commits.
