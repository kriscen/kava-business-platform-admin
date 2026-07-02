# Claude Code → Codex Migration

This project was originally configured for Claude Code. Codex-facing configuration now lives in:

- `AGENTS.md` — durable repository instructions for Codex
- `.agents/skills/` — reusable Codex skills migrated from `.claude/skills/`
- `.agents/rules/` — project rules migrated from `.claude/rules/`

## Migration Map

| Claude Code source                                | Codex target                                                | Status                                   |
| ------------------------------------------------- | ----------------------------------------------------------- | ---------------------------------------- |
| `CLAUDE.md`                                       | `AGENTS.md`                                                 | Migrated and adapted                     |
| `.claude/rules/*.md`                              | `.agents/rules/*.md`                                        | Migrated                                 |
| `.claude/skills/*/SKILL.md`                       | `.agents/skills/*/SKILL.md`                                 | Migrated and Codex wording adjusted      |
| `.claude/settings.json` PostToolUse docs hook     | `AGENTS.md` Project Rules + `.agents/rules/project-docs.md` | Converted to instruction-level guardrail |
| `.claude/settings.local.json` command permissions | Codex app/session approval settings                         | Not migrated into repo config            |
| `.claude/agents/`, `.claude/hooks/`               | n/a                                                         | No files found to migrate                |

## Notes

- `.claude/` and `CLAUDE.md` are kept as legacy reference only.
- Do not update `.claude/` unless the user explicitly asks.
- If Codex project-level hook syntax is later needed and verified, the docs-map reminder can be promoted from instruction-level guardrail to a mechanical hook.
