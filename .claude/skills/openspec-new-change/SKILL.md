---
name: openspec-new-change
description: 使用实验性 artifact 工作流启动一个新的 OpenSpec change。当用户想用结构化的逐步方法创建新功能、修复或修改时使用。
license: MIT
compatibility: 需要 openspec CLI。
metadata:
  author: openspec
  version: '1.0'
  generatedBy: '1.2.0'
---

使用实验性 artifact 驱动方法启动一个新的 change。

**输入**：用户的请求应该包含一个 change 名称（kebab-case）或者对他们想构建的内容的描述。

**步骤**

1. **如果没有提供明确的输入，询问他们想构建什么**

   使用 **AskUserQuestion 工具**（开放式，没有预设选项）来问：

   > "你想做什么 change？描述你想构建或修复的内容。"

   从他们的描述中提取一个 kebab-case 名称（例如，"add user authentication" → `add-user-auth`）。

   **重要**：在没有理解用户想构建什么之前不要继续。

2. **确定工作流模式**

   使用默认模式（省略 `--schema`），除非用户明确要求不同的工作流。

   **只有在用户提到以下内容时才使用不同的模式：**
   - 一个特定的模式名称 → 使用 `--schema <name>`
   - "show workflows" 或 "what workflows" → 运行 `openspec schemas --json` 让他们选择

   **否则**：省略 `--schema` 使用默认模式。

3. **创建 change 目录**

   ```bash
   openspec new change "<name>"
   ```

   只有在用户请求了特定工作流时才添加 `--schema <name>`。
   这会在 `openspec/changes/<name>/` 创建一个带有所选模式的脚手架 change。

4. **显示 artifact 状态**

   ```bash
   openspec status --change "<name>"
   ```

   这显示哪些 artifacts 需要创建，哪些已就绪（依赖已满足）。

5. **获取第一个 artifact 的说明**
   第一个 artifact 取决于模式（例如，`proposal` 用于 spec-driven）。
   检查状态输出找到第一个状态为 "ready" 的 artifact。

   ```bash
   openspec instructions <first-artifact-id> --change "<name>"
   ```

   这输出用于创建第一个 artifact 的模板和上下文。

6. **停下来等待用户方向**

**输出**

完成步骤后，总结：

- Change 名称和位置
- 使用的模式/工作流及其 artifact 序列
- 当前状态（0/N 个 artifact 完成）
- 第一个 artifact 的模板
- 提示："准备好创建第一个 artifact 了吗？只需描述这个 change 是关于什么的，我来起草，或者让我继续。"

**护栏**

- 暂时不要创建任何 artifacts——只显示说明
- 不要超过显示第一个 artifact 模板
- 如果名称无效（不是 kebab-case），请求一个有效名称
- 如果已存在同名 change，建议继续那个 change
- 如果使用非默认工作流，传递 --schema
