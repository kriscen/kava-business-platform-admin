---
name: openspec-continue-change
description: 通过创建下一个 artifact 继续处理 OpenSpec change。当用户想要推进他们的 change、创建下一个 artifact 或继续工作流时使用。
license: MIT
compatibility: 需要 openspec CLI。
metadata:
  author: openspec
  version: '1.0'
  generatedBy: '1.2.0'
---

通过创建下一个 artifact 继续处理 change。

**输入**: 可选指定 change 名称。如果省略，检查是否可以从对话上下文中推断。如果模糊或不明确，必须提示用户选择可用的 changes。

**步骤**

1. **如果没有提供 change 名称，提示选择**

   运行 `openspec list --json` 获取可用的 changes（按最近修改排序）。然后使用 **AskUserQuestion 工具** 让用户选择要处理的 change。

   呈现前 3-4 个最近修改的 changes，显示：
   - Change 名称
   - Schema（如果存在来自 `schema` 字段，否则为 "spec-driven"）
   - 状态（例如 "0/5 tasks"、"complete"、"no tasks"）
   - 最近修改时间（来自 `lastModified` 字段）

   将最近修改的 change 标记为"(Recommended)"，因为这可能是用户想要继续的。

   **重要**: 不要猜测或自动选择 change。始终让用户选择。

2. **检查当前状态**

   ```bash
   openspec status --change "<name>" --json
   ```

   解析 JSON 了解当前状态。响应包括：
   - `schemaName`: 使用的工作流 schema（例如 "spec-driven"）
   - `artifacts`: artifacts 数组及其状态（"done"、"ready"、"blocked"）
   - `isComplete`: 布尔值，指示所有 artifacts 是否完成

3. **根据状态行动**：

   ***

   **如果所有 artifacts 都完成了（`isComplete: true`）**：
   - 祝贺用户
   - 显示包括所用 schema 的最终状态
   - 建议："所有 artifacts 已创建！现在可以实现此 change 或归档它。"
   - 停止

   ***

   **如果 artifacts 准备好创建**（状态显示 `status: "ready"` 的 artifacts）：
   - 从状态输出中选择第一个 `status: "ready"` 的 artifact
   - 获取其说明：
     ```bash
     openspec instructions <artifact-id> --change "<name>" --json
     ```
   - 解析 JSON。关键字段是：
     - `context`: 项目背景（对你的约束——不要包含在输出中）
     - `rules`: Artifact 特定规则（对你的约束——不要包含在输出中）
     - `template`: 用于输出的结构
     - `instruction`: Schema 特定指导
     - `outputPath`: 写入 artifact 的位置
     - `dependencies`: 为上下文需要阅读的已完成的 artifacts
   - **创建 artifact 文件**：
     - 阅读任何已完成的依赖文件以获取上下文
     - 使用 `template` 作为结构——填写其部分
     - 应用 `context` 和 `rules` 作为约束——但不要将它们复制到文件中
     - 写入说明中指定的输出路径
   - 显示创建了什么以及现在解锁了什么
   - 创建**一个** artifact 后停止

   ***

   **如果没有 artifacts 准备好（全部阻塞）**：
   - 这对于有效的 schema 不应该发生
   - 显示状态并建议检查问题

4. **创建 artifact 后显示进度**
   ```bash
   openspec status --change "<name>"
   ```

**输出**

每次调用后显示：

- 创建了哪个 artifact
- 使用的 schema 工作流
- 当前进度（N/M 完成）
- 现在解锁了哪些 artifacts
- 提示："想继续吗？只需告诉我继续或告诉我下一步做什么。"

**Artifact 创建指南**

artifact 类型及其目的取决于 schema。使用 CLI 输出的 `instruction` 字段了解要创建什么。

常见的 artifact 模式：

**spec-driven schema**（proposal → specs → design → tasks）：

- **proposal.md**: 如果不清晰，询问用户关于 change 的问题。填写 Why、What Changes、Capabilities、Impact。
  - Capabilities 部分至关重要——列出的每个 capability 都需要一个 spec 文件。
- **specs/<capability>/spec.md**: 为 proposal 的 Capabilities 部分列出的每个 capability 创建一个 spec（使用 capability 名称，不是 change 名称）。
- **design.md**: 记录技术决策、架构和实现方法。
- **tasks.md**: 将实现分解为带复选框的任务。

对于其他 schema，遵循 CLI 输出的 `instruction` 字段。

**护栏规则**

- 每次调用创建一个 artifact
- 创建新 artifact 前始终阅读依赖的 artifacts
- 不要跳过 artifacts 或乱序创建
- 如果上下文不清晰，创建前询问用户
- 写入后验证 artifact 文件存在，然后才能标记进度
- 使用 schema 的 artifact 序列，不要假设特定的 artifact 名称
- **重要**：`context` 和 `rules` 是对你的约束，不是文件的内容
  - 不要将 `<context>`、`<rules>`、`<project_context>` 块复制到 artifact 中
  - 这些指导你写什么，但不应该出现在输出中
