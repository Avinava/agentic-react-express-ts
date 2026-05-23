# GEMINI.md

Gemini CLI: please read [`AGENTS.md`](AGENTS.md) first — it has the full architecture, stack, and conventions.

## Gemini-specific tips

- **Boundary rules** (server↔client) are enforced by ESLint. If you see `no-restricted-imports`, the fix is to move the code, not suppress the rule.
- **tRPC type inference** is the central pattern. Edit a router's `.input(…)` or return type, and the client auto-typechecks. Don't duplicate types.
- **Skills:** Always check [`skills/`](skills/) before re-deriving a pattern.
- **No `--no-verify`.** See [`skills/self-correcting-loop/SKILL.md`](skills/self-correcting-loop/SKILL.md).
