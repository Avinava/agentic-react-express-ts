# CLAUDE.md

Claude Code: please read [`AGENTS.md`](AGENTS.md) first — it has the full architecture, stack, and conventions.

## Claude-specific tips

- **Skills:** This repo ships skill files in [`skills/`](skills/). Read them top-down when their trigger applies; they have ordered steps that are faster than re-discovering the pattern.
- **Permissions:** Hook bypassing should be denied. If `~/.claude/settings.json` doesn't already block `--no-verify`, add:
  ```json
  {
    "permissions": {
      "deny": ["Bash(git commit*--no-verify*)", "Bash(git commit*-n *)"]
    }
  }
  ```
- **Slash commands worth knowing here:** `/review` (built-in PR review), `/security-review`, and `verify` (manual app-driven verification) are particularly useful.
- **Self-correcting loop:** If a commit is rejected, do NOT bypass. Read all errors, fix in one pass, retry. See [`skills/self-correcting-loop/SKILL.md`](skills/self-correcting-loop/SKILL.md).
