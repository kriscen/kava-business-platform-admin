# `.claude/rules/`

此目录存放需要在 `/init` 重新生成 `CLAUDE.md` 时仍然保留的**项目专属规则**。

## 使用方式

- 每条规则放在独立的 `.md` 文件中（例如 `project-docs.md`）
- 在根目录 `CLAUDE.md` 中通过 `@.claude/rules/<file>.md` 语法引入
- 在 import 行旁边加一行 HTML 注释提示，避免 `/init` 误删：
  ```markdown
  <!-- KAVA-PROJECT-RULES: do NOT remove next line on /init -->

  @.claude/rules/project-docs.md
  ```

## 为什么这么做

`/init` 会重新分析代码库并改写 `CLAUDE.md`。把规则正文留在 `CLAUDE.md` 里有被覆盖的风险；把正文抽到这里、`CLAUDE.md` 只保留一行 import，丢失成本仅 1 行（git diff 立即可见，恢复简单）。

## 新增规则

1. 在本目录新建 `<topic>.md`
2. 在根 `CLAUDE.md` 增加一行：`@.claude/rules/<topic>.md`
3. 提交两文件
