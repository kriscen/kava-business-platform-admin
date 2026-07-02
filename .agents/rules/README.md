# `.agents/rules/`

此目录存放 Codex 需要长期遵循的项目专属规则。

## 使用方式

- 每条规则放在独立的 `.md` 文件中，例如 `project-docs.md`
- 在根目录 `AGENTS.md` 中通过 `@.agents/rules/<file>.md` 引用
- 重要规则也应在 `AGENTS.md` 中保留简短摘要，确保 Codex 即使没有展开引用也能遵守

## 迁移说明

这些规则从旧的 `.claude/rules/` 迁移而来。后续面向 Codex 的规则更新应改在 `.agents/rules/` 中完成；`.claude/rules/` 仅作为历史参考保留。

## 新增规则

1. 在本目录新建 `<topic>.md`
2. 在根目录 `AGENTS.md` 增加一行：`@.agents/rules/<topic>.md`
3. 如果规则是必须长期遵守的护栏，在 `AGENTS.md` 的 Project Rules 中补充一句摘要
