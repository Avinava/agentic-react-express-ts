#!/usr/bin/env bash
# Project-wide typecheck. Lefthook calls this on pre-commit.
# Project-wide because TS type errors propagate; a "staged-only" check is unreliable.
set -euo pipefail
npm run typecheck
