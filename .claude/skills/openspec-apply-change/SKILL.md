---
name: openspec-apply-change
description: 实现 OpenSpec change 中的任务。当用户想要开始实现、继续实现或逐个处理任务时使用。
license: MIT
compatibility: 需要 openspec CLI。
metadata:
  author: openspec
  version: '1.0'
  generatedBy: '1.2.0'
---

实现 OpenSpec change 中的任务。

**输入**: 可选指定 change 名称。如果省略，检查是否可以从对话上下文中推断。如果模糊或不明确，必须提示用户选择可用的 changes。

**步骤**

1. **选择 change**

   如果提供了名称，直接使用。否则：
   - 如果用户提到了 change，从对话上下文中推断
   - 如果只有一个活跃的 change，自动选择
   - 如果不明确，运行 `openspec list --json` 获取可用的 changes，使用 **AskUserQuestion 工具** 让用户选择

   始终声明："Using change: <name>" 以及如何覆盖（例如 `/opsx:apply <other>`）。

2. **检查状态以了解 schema**

   ```bash
   openspec status --change "<name>" --json
   ```

   解析 JSON 以了解：
   - `schemaName`: 使用的工作流（例如 "spec-driven"）
   - 哪个 artifact 包含任务（通常是 spec-driven 的 "tasks"，其他请检查 status）

3. **获取应用说明**

   ```bash
   openspec instructions apply --change "<name>" --json
   ```

   返回：
   - 上下文文件路径（因 schema 而异——可能是 proposal/specs/design/tasks 或 spec/tests/implementation/docs）
   - 进度（总数、已完成、剩余）
   - 任务列表及状态
   - 基于当前状态的动态指令

   **处理状态：**
   - 如果 `state: "blocked"`（缺少 artifacts）：显示消息，建议使用 openspec-continue-change
   - 如果 `state: "all_done"`：祝贺，建议归档
   - 其他情况：继续实现

4. **读取上下文文件**

   从应用说明输出中读取 `contextFiles` 列出的文件。
   文件取决于所使用的 schema：
   - **spec-driven**: proposal, specs, design, tasks
   - 其他 schema：遵循 CLI 输出中的 contextFiles

5. **显示当前进度**

   显示：
   - 使用的 schema
   - 进度："N/M tasks complete"
   - 剩余任务概览
   - CLI 的动态指令

6. **实现任务（循环直到完成或阻塞）**

   对于每个待处理任务：
   - 显示正在处理的任务
   - 进行所需的代码更改
   - 保持更改最小化和聚焦
   - 在 tasks 文件中标记任务完成：`- [ ]` → `- [x]`
   - 继续下一个任务

   **暂停条件：**
   - 任务不清晰 → 请求澄清
   - 实现揭示设计问题 → 建议更新 artifacts
   - 遇到错误或阻塞 → 报告并等待指导
   - 用户中断

7. **完成或暂停时显示状态**

   显示：
   - 本次会话完成的任务
   - 总体进度："N/M tasks complete"
   - 如果全部完成：建议归档
   - 如果暂停：解释原因并等待指导

**实现期间输出**

```
## 正在实现: <change-name> (schema: <schema-name>)

正在处理任务 3/7: <task description>
[...实现中...]
✓ 任务完成

正在处理任务 4/7: <task description>
[...实现中...]
✓ 任务完成
```

**完成时输出**

```
## 实现完成

**Change:** <change-name>
**Schema:** <schema-name>
**进度:** 7/7 任务完成 ✓

### 本次会话完成
- [x] 任务 1
- [x] 任务 2
...

所有任务完成！准备归档此 change。
```

**暂停时输出（遇到问题）**

```
## 实现暂停

**Change:** <change-name>
**Schema:** <schema-name>
**进度:** 4/7 任务完成

### 遇到问题
<问题描述>

**选项：**
1. <选项 1>
2. <选项 2>
3. 其他方法

您想怎么做？
```

**护栏规则**

- 持续处理任务直到完成或阻塞
- 开始前始终阅读上下文文件（从应用说明输出）
- 如果任务模糊，暂停并询问后再实现
- 如果实现揭示问题，暂停并建议更新 artifacts
- 保持代码更改最小化且限定在每个任务范围内
- 完成后立即更新任务复选框
- 遇到错误、阻塞或需求不明确时暂停——不要猜测
- 使用 CLI 输出中的 contextFiles，不要假设特定的文件名

**流式工作流集成**

此 skill 支持"对 change 执行操作"模型：

- **可随时调用**：如果任务存在，可以在所有 artifacts 完成之前调用，在部分实现之后调用，或与其他操作交叉执行
- **允许 artifact 更新**：如果实现揭示设计问题，建议更新 artifacts——不是阶段锁定，流式工作
