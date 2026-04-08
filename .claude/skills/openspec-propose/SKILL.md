---
name: openspec-propose
description: 一步创建带有所有 artifacts 的新 change 提案。当用户想快速描述他们想构建什么并获得一个准备好实现的完整提案（包括设计、规格和任务）时使用。
license: MIT
compatibility: 需要 openspec CLI。
metadata:
  author: openspec
  version: '1.0'
  generatedBy: '1.2.0'
---

提出一个新的 change——一步创建 change 并生成所有 artifacts。

我将创建一个带有这些 artifacts 的 change：

- proposal.md（是什么和为什么）
- design.md（如何）
- tasks.md（实现步骤）

准备好实现时，运行 /opsx:apply

---

**输入**：用户的请求应该包含一个 change 名称（kebab-case）或者对他们想构建的内容的描述。

**步骤**

1. **如果没有提供明确的输入，询问他们想构建什么**

   使用 **AskUserQuestion 工具**（开放式，没有预设选项）来问：

   > "你想做什么 change？描述你想构建或修复的内容。"

   从他们的描述中提取一个 kebab-case 名称（例如，"add user authentication" → `add-user-auth`）。

   **重要**：在没有理解用户想构建什么之前不要继续。

2. **创建 change 目录**

   ```bash
   openspec new change "<name>"
   ```

   这会在 `openspec/changes/<name>/` 创建一个带 `.openspec.yaml` 的脚手架 change。

3. **获取 artifact 构建顺序**

   ```bash
   openspec status --change "<name>" --json
   ```

   解析 JSON 获取：
   - `applyRequires`：实现前需要的 artifact ID 数组（例如 `["tasks"]`）
   - `artifacts`：所有 artifacts 及其状态和依赖的列表

4. **按顺序创建 artifacts 直到可以应用**

   使用 **TodoWrite 工具** 跟踪 artifacts 进度。

   按依赖顺序循环遍历 artifacts（先处理没有待处理依赖的 artifacts）：

   a. **对于每个状态为 `ready`（依赖已满足）的 artifact**：
   - 获取说明：
     ```bash
     openspec instructions <artifact-id> --change "<name>" --json
     ```
   - 说明 JSON 包含：
     - `context`：项目背景（对你的约束——不要包含在输出中）
     - `rules`：Artifact 特定规则（对你的约束——不要包含在输出中）
     - `template`：用于输出文件的结构
     - `instruction`：此 artifact 类型的模式特定指导
     - `outputPath`：写入 artifact 的位置
     - `dependencies`：需要读取上下文的已完成 artifacts
   - 读取任何已完成的依赖文件以获取上下文
   - 使用 `template` 作为结构创建 artifact 文件
   - 应用 `context` 和 `rules` 作为约束——但不要将它们复制到文件中
   - 显示简短进度："Created <artifact-id>"

   b. **继续直到所有 `applyRequires` artifacts 完成**
   - 创建每个 artifact 后，重新运行 `openspec status --change "<name>" --json`
   - 检查 `applyRequires` 中的每个 artifact ID 在 artifacts 数组中是否 `status: "done"`
   - 当所有 `applyRequires` artifacts 都完成时停止

   c. **如果 artifact 需要用户输入**（上下文不清楚）：
   - 使用 **AskUserQuestion 工具** 澄清
   - 然后继续创建

5. **显示最终状态**
   ```bash
   openspec status --change "<name>"
   ```

**输出**

完成所有 artifacts 后，总结：

- Change 名称和位置
- 创建的 artifacts 列表及简要描述
- 准备就绪状态："所有 artifacts 已创建！准备实现。"
- 提示："运行 `/opsx:apply` 或让我实现来开始处理任务。"

**Artifact 创建指南**

- 为每个 artifact 类型遵循 `openspec instructions` 的 `instruction` 字段
- 模式定义每个 artifact 应该包含什么——遵循它
- 在创建新的之前读取依赖 artifacts 获取上下文
- 使用 `template` 作为输出文件的结构——填充它的章节
- **重要**：`context` 和 `rules` 是对你的约束，不是文件的内容
  - 不要将 `<context>`、`<rules>`、`<project_context>` 块复制到 artifact 中
  - 这些指导你写什么，但不应该出现在输出中

**护栏**

- 创建实现所需的所有 artifacts（由模式的 `apply.requires` 定义）
- 在创建新的 artifact 前始终读取依赖 artifacts
- 如果上下文严重不清楚，询问用户——但最好做出合理的决策以保持势头
- 如果已存在同名 change，询问用户是想继续还是创建新的
- 写入后验证每个 artifact 文件存在，再继续下一个
