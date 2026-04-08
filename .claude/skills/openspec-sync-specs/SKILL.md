---
name: openspec-sync-specs
description: 将 change 中的 delta specs 同步到 main specs。当用户想在不归档 change 的情况下用 delta spec 的更改更新 main specs 时使用。
license: MIT
compatibility: 需要 openspec CLI。
metadata:
  author: openspec
  version: '1.0'
  generatedBy: '1.2.0'
---

将 change 中的 delta specs 同步到 main specs。

这是一个 **agent 驱动** 的操作——我会读取 delta specs 并直接编辑 main specs 来应用更改。这允许智能合并（例如，只添加一个场景而不复制整个需求）。

**输入**：可选指定 change 名称。如果省略，检查是否能从对话上下文中推断。如果模糊或不明确，你必须提示选择可用的 changes。

**步骤**

1. **如果没有提供 change 名称，提示选择**

   运行 `openspec list --json` 获取可用的 changes。使用 **AskUserQuestion 工具** 让用户选择。

   显示有 delta specs（在 `specs/` 目录下）的 changes。

   **重要**：不要猜测或自动选择 change。始终让用户选择。

2. **找到 delta specs**

   在 `openspec/changes/<name>/specs/*/spec.md` 中查找 delta spec 文件。

   每个 delta spec 文件包含以下章节：
   - `## ADDED Requirements` - 要添加的新需求
   - `## MODIFIED Requirements` - 对现有需求的更改
   - `## REMOVED Requirements` - 要删除的需求
   - `## RENAMED Requirements` - 要重命名的需求（FROM:/TO: 格式）

   如果没有找到 delta specs，通知用户并停止。

3. **对于每个 delta spec，将更改应用到 main specs**

   对于每个在 `openspec/changes/<name>/specs/<capability>/spec.md` 有 delta spec 的 capability：

   a. **读取 delta spec** 理解预期的更改

   b. **读取 main spec** 在 `openspec/specs/<capability>/spec.md`（可能还不存在）

   c. **智能应用更改**：

   **ADDED Requirements：**
   - 如果需求在 main spec 中不存在 → 添加它
   - 如果需求已存在 → 更新它以匹配（视为隐式 MODIFIED）

   **MODIFIED Requirements：**
   - 在 main spec 中找到该需求
   - 应用更改——这可以是：
     - 添加新场景（不需要复制现有场景）
     - 修改现有场景
     - 更改需求描述
   - 保留 delta 中未提及的场景/内容

   **REMOVED Requirements：**
   - 从 main spec 中删除整个需求块

   **RENAMED Requirements：**
   - 找到 FROM 需求，重命名为 TO

   d. **如果 capability 还不存在则创建新的 main spec**：
   - 创建 `openspec/specs/<capability>/spec.md`
   - 添加 Purpose 章节（可以简短，标记为 TBD）
   - 添加带有 ADDED 需求的 Requirements 章节

4. **显示摘要**

   应用所有更改后，总结：
   - 更新了哪些 capabilities
   - 做了哪些更改（添加/修改/删除/重命名的需求）

**Delta Spec 格式参考**

```markdown
## ADDED Requirements

### Requirement: New Feature

系统应该做某件新事情。

#### Scenario: Basic case

- **WHEN** 用户做 X
- **THEN** 系统做 Y

## MODIFIED Requirements

### Requirement: Existing Feature

#### Scenario: New scenario to add

- **WHEN** 用户做 A
- **THEN** 系统做 B

## REMOVED Requirements

### Requirement: Deprecated Feature

## RENAMED Requirements

- FROM: `### Requirement: Old Name`
- TO: `### Requirement: New Name`
```

**关键原则：智能合并**

与程序化合并不同，你可以应用**部分更新**：

- 要添加场景，只需在 MODIFIED 下包含该场景——不要复制现有场景
- Delta 代表的是*意图*，而不是整体替换
- 使用你的判断来合理合并更改

**成功时的输出**

```
## Specs 已同步：<change-name>

更新的 main specs：

**<capability-1>**:
- 添加的需求："New Feature"
- 修改的需求："Existing Feature"（添加了 1 个场景）

**<capability-2>**:
- 创建了新的 spec 文件
- 添加的需求："Another Feature"

Main specs 已更新。Change 保持活跃——实现完成后归档。
```

**护栏**

- 在进行更改前读取 delta 和 main specs
- 保留 delta 中未提及的现有内容
- 如果有不清楚的地方，请求澄清
- 在进行更改时显示你在改什么
- 操作应该是幂等的——运行两次应该得到相同的结果
