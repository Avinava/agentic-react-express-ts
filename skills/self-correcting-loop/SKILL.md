---
name: self-correcting-loop
description: Use on every commit. The pre-commit hooks run checks in parallel. If any fail, read ALL errors, fix them in one pass, and retry. NEVER use --no-verify.
---

# Self-correcting commit loop

This project uses Lefthook to run quality checks **in parallel** on every `git commit`. Total pipeline time: ~3 seconds. If any check fails, the commit is rejected and you see the errors.

**This is not a blocker — it's a feedback loop.** Read the errors, fix them, retry.

## CRITICAL: Never bypass hooks

**NEVER use `git commit --no-verify` or `git commit -n`.**

The pre-commit hooks exist to catch YOUR mistakes. If hooks keep failing, fix the root cause — don't skip the check. The ONLY exception is if the user **explicitly** tells you to skip.

## Test integrity

**NEVER modify a test just to make it pass.**

- If a test fails, the CODE is wrong, not the test.
- The ONLY reason to change a test is if the **requirements** changed.
- If requirements changed, explain WHY in the commit message.
- Ask the user before modifying any test file. Never delete or skip tests without approval.

## The pipeline

Every `git commit` triggers (in parallel):

```
┌─ Prettier ────── auto-fixes formatting               (auto-fix via lint-staged)
├─ Knip ────────── detects unused exports/files         (manual fix)
├─ ESLint ──────── TS + import order + boundaries       (manual fix)
├─ TypeScript ──── full project typecheck               (manual fix)
├─ Vitest ──────── runs tests related to changed files  (manual fix)
├─ Gitleaks ────── detects hardcoded secrets/API keys   (manual fix)
└─ Commitlint ──── validates commit message format      (rephrase)
```

## The loop

```
1. Make changes
2. git add the changed files
3. git commit -m "type(scope): description"
4. IF rejected → read ALL errors → fix ALL in one pass → goto 2
5. IF accepted → done
```

### Critical: fix ALL errors in one pass

Do NOT fix one error, commit, see the next, fix, commit. Read the entire error output, identify every failure, fix all of them, stage, retry.

## Reading common error output

### Prettier

Auto-fixes via lint-staged. If you see it, stage the reformatted files and retry.

### Knip

```
Unused exports:
  src/foo.ts: someExport
```

Remove the unused export. If it's intentionally public, add the entry to `knip.json` → `entry`.

### ESLint — boundary violation

```
error  'no-restricted-imports' — Server code must not import from src/client.
```

Move the code or extract the shared bits to `src/shared/`. Don't suppress the rule.

### ESLint — type lies

```
error  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
```

Replace `any` with the actual type or `unknown` (then narrow).

```
error  Forbidden non-null assertion.  @typescript-eslint/no-non-null-assertion
```

`!` lies to the compiler. Check the value properly:

```ts
const v = maybe();
if (!v) throw new Error('expected v');
// use v
```

### TypeScript

```
error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.
```

Fix the type. Don't use `@ts-ignore` or `as any`.

### Vitest

A test failed. Fix the **code**, not the test. See "Test integrity" above.

### Gitleaks (secrets)

```
Finding: API_KEY = "sk-abc..."
```

Remove the hardcoded secret. Use `process.env.…` instead. If the secret already landed in history, alert the user — they need to rotate it.

### Commitlint

```
✖ subject may not be empty
✖ type may not be empty
```

Use Conventional Commits: `feat(scope): description`, `fix(scope): description`, etc.

## False-positive escape hatches

If you genuinely need to suppress a rule:

- ESLint: `// eslint-disable-next-line <rule-name>` with a comment explaining why.
- Knip: add the entry to `knip.json`.
- Gitleaks: if it's a test fixture, add the fingerprint to `.gitleaksignore`.

**Always ask the user before suppressing** — they may prefer to fix the root cause.

## Commit message format

`<type>(<scope>): <subject>`

Types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `style`, `perf`, `ci`.

Examples:

```
feat(contact): add email validation
fix(server): handle empty body in tRPC mutations
chore(deps): bump prisma to 7.4.1
docs(readme): clarify Postgres setup
```
