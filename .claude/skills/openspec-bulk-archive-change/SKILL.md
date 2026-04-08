---
name: openspec-bulk-archive-change
description: 一次归档多个已完成的 changes。当需要归档多个并行 changes 时使用。
license: MIT
compatibility: 需要 openspec CLI。
metadata:
  author: openspec
  version: '1.0'
  generatedBy: '1.2.0'
---

在单个操作中归档多个已完成的 changes。

此 skill 允许批量归档 changes，通过检查代码库智能处理 spec 冲突。

**输入**: 无需输入（提示选择）

**步骤**

1. **获取活跃的 changes**

   运行 `openspec list --json` 获取所有活跃的 changes。

   如果没有活跃的 changes，通知用户并停止。

2. **提示选择 changes**

   使用 **AskUserQuestion 工具**（多选）让用户选择 changes：
   - 显示每个 change 及其 schema
   - 包含"All changes"选项
   - 允许任意数量的选择（1+ 可以，2+ 是典型用例）

   **重要**: 不要自动选择。始终让用户选择。

3. **批量验证 - 收集所有选中 changes 的状态**

   对于每个选中的 change，收集：

   a. **Artifact 状态** - 运行 `openspec status --change "<name>" --json`
   - 解析 `schemaName` 和 `artifacts` 列表
   - 记录哪些 artifacts 是 `done` vs 其他状态

   b. **任务完成** - 读取 `openspec/changes/<name>/tasks.md`
   - 统计 `- [ ]`（未完成）vs `- [x]`（完成）
   - 如果没有 tasks 文件，记为"No tasks"

   c. **Delta specs** - 检查 `openspec/changes/<name>/specs/` 目录
   - 列出存在的 capability specs
   - 对于每个，提取需求名称（匹配 `### Requirement: <name>` 的行）

4. **检测 spec 冲突**

   构建 `capability -> [涉及它的 changes]` 的映射：

   ```
   auth -> [change-a, change-b]  <- 冲突（2+ changes）
   api  -> [change-c]            <- 正常（只有 1 个 change）
   ```

   当 2+ 个选中的 changes 对同一个 capability 有 delta specs 时，存在冲突。

5. **智能解决冲突**

   **对于每个冲突**，调查代码库：

   a. **读取冲突的 delta specs** 了解每个声称添加/修改的内容

   b. **搜索代码库** 查找实现证据：
   - 查找实现每个 delta spec 中需求的代码
   - 检查相关文件、函数或测试

   c. **确定解决方案**：
   - 如果只有一个 change 实际实现了 -> 同步那个的 specs
   - 如果两个都实现了 -> 按时间顺序应用（较旧的优先，较新的覆盖）
   - 如果都没有实现 -> 跳过 spec 同步，警告用户

   d. **记录每个冲突的解决方案**：
   - 同步哪个 change 的 specs
   - 应用顺序（如果两者都有）
   - 理由（代码库中发现了什么）

6. **显示合并状态表**

   显示总结所有 changes 的表格：

   ```
   | Change               | Artifacts | Tasks | Specs   | Conflicts | Status |
   |---------------------|-----------|-------|---------|-----------|--------|
   | schema-management   | Done      | 5/5   | 2 delta | None      | Ready  |
   | project-config      | Done      | 3/3   | 1 delta | None      | Ready  |
   | add-oauth           | Done      | 4/4   | 1 delta | auth (!)  | Ready* |
   | add-verify-skill    | 1 left    | 2/5   | None    | None      | Warn   |
   ```

   对于冲突，显示解决方案：

   ```
   * 冲突解决方案：
     - auth spec: 将先应用 add-oauth 再应用 add-jwt（两者都实现了，按时间顺序）
   ```

   对于未完成的 changes，显示警告：

   ```
   警告：
   - add-verify-skill: 1 个未完成的 artifact，3 个未完成的任务
   ```

7. **确认批量操作**

   使用 **AskUserQuestion 工具** 进行单一确认：
   - "归档 N 个 changes？"基于状态的选项
   - 选项可能包括：
     - "归档全部 N 个 changes"
     - "只归档 N 个已就绪的 changes（跳过未完成的）"
     - "取消"

   如果有未完成的 changes，明确说明它们将带有警告被归档。

8. **为每个确认的 change 执行归档**

   按确定顺序处理 changes（遵循冲突解决方案）：

   a. **同步 specs** 如果存在 delta specs：
   - 使用 openspec-sync-specs 方法（agent 驱动的智能合并）
   - 对于冲突，按解决的顺序应用
   - 跟踪是否完成同步

   b. **执行归档**：

   ```bash
   mkdir -p openspec/changes/archive
   mv openspec/changes/<name> openspec/changes/archive/YYYY-MM-DD-<name>
   ```

   c. **跟踪每个结果**：
   - 成功：归档成功
   - 失败：归档期间出错（记录错误）
   - 跳过：用户选择不归档（如果适用）

9. **显示摘要**

   显示最终结果：

   ```
   ## 批量归档完成

   已归档 3 个 changes：
   - schema-management-cli -> archive/2026-01-19-schema-management-cli/
   - project-config -> archive/2026-01-19-project-config/
   - add-oauth -> archive/2026-01-19-add-oauth/

   跳过 1 个 change：
   - add-verify-skill（用户选择不归档未完成的）

   Spec 同步摘要：
   - 4 个 delta specs 同步到 main specs
   - 1 个冲突解决（auth：按时间顺序应用了两者）
   ```

   如果有任何失败：

   ```
   失败 1 个 change：
   - some-change: 归档目录已存在
   ```

**冲突解决示例**

示例 1：只有一个实现了

```
冲突：specs/auth/spec.md 被 [add-oauth, add-jwt] 修改

检查 add-oauth：
- Delta 添加了"OAuth Provider Integration"需求
- 搜索代码库... 找到实现 OAuth 流程的 src/auth/oauth.ts

检查 add-jwt：
- Delta 添加了"JWT Token Handling"需求
- 搜索代码库... 未找到 JWT 实现

解决方案：只有 add-oauth 实现了。将只同步 add-oauth 的 specs。
```

示例 2：两者都实现了

```
冲突：specs/api/spec.md 被 [add-rest-api, add-graphql] 修改

检查 add-rest-api（创建于 2026-01-10）：
- Delta 添加了"REST Endpoints"需求
- 搜索代码库... 找到 src/api/rest.ts

检查 add-graphql（创建于 2026-01-15）：
- Delta 添加了"GraphQL Schema"需求
- 搜索代码库... 找到 src/api/graphql.ts

解决方案：两者都实现了。将先应用 add-rest-api specs，
然后应用 add-graphql specs（按时间顺序，较新的覆盖）。
```

**成功时输出**

```
## 批量归档完成

已归档 N 个 changes：
- <change-1> -> archive/YYYY-MM-DD-<change-1>/
- <change-2> -> archive/YYYY-MM-DD-<change-2>/

Spec 同步摘要：
- N 个 delta specs 同步到 main specs
- 无冲突（或：解决了 M 个冲突）
```

**部分成功时输出**

```
## 批量归档完成（部分）

已归档 N 个 changes：
- <change-1> -> archive/YYYY-MM-DD-<change-1>/

跳过 M 个 changes：
- <change-2>（用户选择不归档未完成的）

失败 K 个 changes：
- <change-3>: 归档目录已存在
```

**没有 Changes 时输出**

```
## 没有可归档的 Changes

未找到活跃的 changes。创建一个新 change 开始。
```

**护栏规则**

- 允许任意数量的 changes（1+ 可以，2+ 是典型用例）
- 始终提示选择，不要自动选择
- 尽早检测 spec 冲突并通过检查代码库解决
- 当两个 changes 都实现时，按时间顺序应用 specs
- 仅在实现缺失时跳过 spec 同步（警告用户）
- 确认前显示每个 change 的清晰状态
- 对整个批次使用单一确认
- 跟踪并报告所有结果（成功/跳过/失败）
- 移动到归档时保留 .openspec.yaml
- 归档目录目标使用当前日期：YYYY-MM-DD-<name>
- 如果归档目标存在，该 change 失败但继续其他
