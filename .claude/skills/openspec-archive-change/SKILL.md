---
name: openspec-archive-change
description: 在实验性工作流中归档已完成的 change。当用户想要在实现完成后最终确定并归档 change 时使用。
license: MIT
compatibility: 需要 openspec CLI。
metadata:
  author: openspec
  version: '1.0'
  generatedBy: '1.2.0'
---

在实验性工作流中归档已完成的 change。

**输入**: 可选指定 change 名称。如果省略，检查是否可以从对话上下文中推断。如果模糊或不明确，必须提示用户选择可用的 changes。

**步骤**

1. **如果没有提供 change 名称，提示选择**

   运行 `openspec list --json` 获取可用的 changes。使用 **AskUserQuestion 工具** 让用户选择。

   仅显示活跃的 changes（尚未归档的）。
   如果可用，显示每个 change 使用的 schema。

   **重要**: 不要猜测或自动选择 change。始终让用户选择。

2. **检查 artifact 完成状态**

   运行 `openspec status --change "<name>" --json` 检查 artifact 完成情况。

   解析 JSON 以了解：
   - `schemaName`: 使用的工作流
   - `artifacts`: artifacts 列表及其状态（`done` 或其他）

   **如果任何 artifact 不是 `done`：**
   - 显示列出未完成 artifacts 的警告
   - 使用 **AskUserQuestion 工具** 确认用户是否要继续
   - 如果用户确认则继续

3. **检查任务完成状态**

   读取 tasks 文件（通常是 `tasks.md`）检查未完成的任务。

   统计标记为 `- [ ]`（未完成）vs `- [x]`（完成）的任务。

   **如果发现未完成的任务：**
   - 显示未完成任务数量的警告
   - 使用 **AskUserQuestion 工具** 确认用户是否要继续
   - 如果用户确认则继续

   **如果没有 tasks 文件：** 不显示任务相关警告继续。

4. **评估 delta spec 同步状态**

   检查 `openspec/changes/<name>/specs/` 中是否存在 delta specs。如果不存在，不进行同步提示。

   **如果存在 delta specs：**
   - 将每个 delta spec 与其对应的 main spec 进行比较，位于 `openspec/specs/<capability>/spec.md`
   - 确定将应用哪些更改（添加、修改、删除、重命名）
   - 在提示前显示合并摘要

   **提示选项：**
   - 如果需要更改："立即同步（推荐）"、"不同步直接归档"
   - 如果已同步："立即归档"、"仍然同步"、"取消"

   如果用户选择同步，使用 Task 工具（subagent_type: "general-purpose", prompt: "使用 Skill 工具调用 openspec-sync-specs 处理 change '<name>'。Delta spec 分析：<包含分析的 delta spec 摘要>">）。无论选择如何，继续归档。

5. **执行归档**

   创建归档目录（如果不存在）：

   ```bash
   mkdir -p openspec/changes/archive
   ```

   使用当前日期生成目标名称：`YYYY-MM-DD-<change-name>`

   **检查目标是否已存在：**
   - 如果存在：报错失败，建议重命名现有归档或使用不同日期
   - 如果不存在：将 change 目录移动到归档

   ```bash
   mv openspec/changes/<name> openspec/changes/archive/YYYY-MM-DD-<name>
   ```

6. **显示摘要**

   显示归档完成摘要，包括：
   - Change 名称
   - 使用的 schema
   - 归档位置
   - 是否同步了 specs（如果适用）
   - 关于任何警告的说明（未完成的 artifacts/tasks）

**成功时输出**

```
## 归档完成

**Change:** <change-name>
**Schema:** <schema-name>
**归档位置:** openspec/changes/archive/YYYY-MM-DD-<name>/
**Specs:** ✓ 已同步到 main specs（或"No delta specs"或"Sync skipped"）

所有 artifacts 完成。所有任务完成。
```

**护栏规则**

- 如果未提供 change 名称，始终提示选择
- 使用 artifact 图（openspec status --json）检查完成情况
- 不要因警告而阻止归档——只是告知并确认
- 移动到归档时保留 .openspec.yaml（它随目录移动）
- 显示清晰的摘要
- 如果请求同步，使用 openspec-sync-specs 方法（agent 驱动）
- 如果存在 delta specs，始终运行同步评估并在提示前显示合并摘要
