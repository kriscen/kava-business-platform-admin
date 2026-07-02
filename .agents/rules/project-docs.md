## Project Documentation

The project maintains two distinct documentation locations, each serving a different purpose:

### `docs/` — Engineering Documentation (long-lived)

Stable project knowledge: architecture, conventions, API specs, module references, and decision history. Treat this as the canonical source of truth for "how the system works today".

- **Entry point**: [`docs/00-project-map.md`](../../docs/00-project-map.md) — navigation index of the entire `docs/` directory; read this first to locate any document.
- Structure: `01-architecture/` (overview & boundaries), `02-conventions/` (code style, git), `03-reference/` (error codes), `04-frontend/` (auth-api, upms-api).
- Whenever files under `docs/` are added, removed, or renamed, run the `update-docs-map` skill to sync `00-project-map.md`.

### `openspec/` — Change Artifacts (short-lived, per-change)

OpenSpec change proposals and specs for in-flight work. Each change lives in its own subdirectory under `openspec/changes/`, containing proposal, design, specs, and tasks. Completed changes get archived; their delta specs are merged back into `openspec/specs/` (the main spec set).

- Use `openspec/` to drive new features/refactors via the OpenSpec workflow.
- Use `docs/` to look up established knowledge and document outcomes after a change ships.

### Archive → Docs 同步规则

执行 `openspec-archive-change` 归档 change 后，必须执行以下流程：

1. **检查归档内容**：读取刚归档的 change 中的 proposal、specs、design 等 artifacts，提炼出其中包含的**长期有效的工程知识**（如新增的 API 接口、变更的业务规则、架构决策等）
2. **对比 docs 现状**：检查 `docs/` 对应目录中是否已有相关文档，判断归档内容是否需要反映到 docs 中
3. **向用户确认**：列出建议同步的内容和目标文件，等待用户确认后再执行更新。不要自行更新 docs
4. **更新后同步索引**：如果用户确认更新了 docs，运行 `update-docs-map` skill 刷新 `docs/00-project-map.md`

**不同步的情况**：纯实现细节、临时方案、已被后续 change 替代的内容不需要同步到 docs。
