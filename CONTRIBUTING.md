# Contributing

Thanks for your interest. This is a template project — most contributions should make it more useful as a starting point, not add features users would delete.

## What we welcome

- Bug fixes (guardrail false positives, broken demo flows, doc errors)
- Documentation improvements
- New skill files that codify a common workflow
- Stack-version bumps (with all checks still green)
- Better tests

## What we generally don't accept

- Auth systems — too opinionated for a template
- New deploy targets — point to existing ones in docs instead
- Heavy abstractions — every layer is a layer the user has to learn

## Workflow

1. Open an issue to discuss anything non-trivial before coding.
2. Fork, branch (`feat/...`, `fix/...`, `docs/...`).
3. Write/update tests.
4. `npm run typecheck && npm run lint && npm run test:run && npm run build` must pass.
5. Conventional commit message. Pre-commit hooks will enforce this.
6. Open the PR. CI must pass.

## Adding a skill

Skills live in `skills/<kebab-name>/SKILL.md` with YAML frontmatter:

```yaml
---
name: skill-name
description: One-line summary of when to use this skill.
---
```

Then the body — ordered steps an agent can follow. Keep them concrete (real file paths, real commands) not generic.

## Code style

ESLint + Prettier handle most of it. The rules are deliberately strict:

- No `any`, no `!`, no double-cast.
- Cross-tier imports between `src/client` and `src/server` are forbidden.
- Conventional Commits required.

If a rule fights you, open an issue rather than disabling it — the constraint is usually correct.
