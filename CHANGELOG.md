# Changelog

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html)
and [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [0.1.0] — 2026-05-24

### Added

- Initial release. Full-stack TypeScript template:
  - React 19 + Vite 7 client (MUI 7, React Router 7)
  - Express 5 + tRPC 11 server with type-safe end-to-end API
  - Prisma 7 + PostgreSQL data layer
  - Zod schemas shared between client and server
  - React Hook Form + Zod resolver for forms
  - TanStack Query via `@trpc/react-query`
- CRM demo: Contact, Task, Project resources with full CRUD.
- Guardrails (Lefthook + parallel pre-commit pipeline):
  - Prettier via lint-staged
  - ESLint 9 (strict TS, import order, architecture boundaries via `no-restricted-imports`)
  - TypeScript project-wide typecheck
  - Knip unused-code detection
  - Vitest related-tests on staged files
  - Gitleaks secret scanning
  - Commitlint (Conventional Commits)
- Agent files: `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `.github/copilot-instructions.md`.
- Five agent skills:
  - `onboard-an-agent`
  - `add-resource`
  - `self-correcting-loop`
  - `remove-demo-code`
  - `deploy-checklist`
- GitHub Actions CI (lint, typecheck, knip, test, build).
