---
name: openspec-cleanup
description: 整理 openspec 目录：清理归档中的冗余 delta specs，合并相关的 main specs。当用户觉得 openspec 内容太多、需要整理时使用。
license: MIT
compatibility: 无特殊依赖。
metadata:
  author: Kris
  version: '1.0'
  generatedBy: '1.0'
---

整理 `openspec/` 目录，包含两个阶段：清理归档冗余数据、合并相关 main specs。

**输入**: 无必需参数。可选指定阶段（`archive` 或 `specs`）跳过选择直接执行某一阶段。

---

## 阶段一：清理归档中的 delta specs

归档 change 中的 `specs/` 子目录是 delta spec 快照，已合并到 `openspec/specs/`，属于冗余数据。

**步骤**

1. **扫描归档目录**

   ```bash
   ls openspec/changes/archive/
   ```

   统计归档数量和每个归档是否包含 `specs/` 子目录。

2. **分析冗余情况**

   对每个归档：
   - 检查是否存在 `specs/` 子目录
   - 如果存在，列出其中的 spec 名称
   - 对比 `openspec/specs/` 中是否有对应的 main spec（注意名称可能已变化，如 `dept-domain-service` → `group-domain-service`）

   汇总：需清理的归档数、涉及的 spec 文件数、预估释放空间。

3. **确认并执行清理**

   使用 **AskUserQuestion 工具** 展示清理摘要，确认后执行：

   ```bash
   for dir in openspec/changes/archive/*/specs; do
     rm -rf "$dir"
   done
   ```

4. **验证结果**

   确认所有 `specs/` 子目录已移除，显示清理后的归档总大小。

---

## 阶段二：合并相关 main specs

将主题相关、粒度过细的 main specs 合并为更大的能力单元。

**步骤**

1. **扫描 main specs**

   ```bash
   ls openspec/specs/
   ```

2. **读取并分析所有 spec 内容**

   对每个 spec 目录，读取 `spec.md`，提取：
   - Capability 名称和 Purpose
   - Requirements 列表
   - 与其他 spec 的关联关系（如引用相同实体、共享验证逻辑、属于同一业务链路）

3. **识别合并机会**

   按以下规则识别可合并的 spec 组：
   - **同一聚合的拆分**：如 `group-domain-service` + `group-tree-validation`（DomainService 和它的验证规则）
   - **同一中间表模式**：如 `role-menu-binding` + `user-role-binding`（结构相同的绑定管理）
   - **同一业务链路**：如认证 → 上下文传播 → 鉴权（authentication-flow + unified-user-context + permission-system）
   - **跨实体的通用模式**：如 ListQuery + Dropdown + ResponseEnrichment（API 查询/展示规范）
   - **基础设施约定**：如审计字段 + 错误码 + DDD 规则（基础层统一约定）

   保持独立的 spec（不适合合并）：
   - 有独立生命周期的核心实体管理（如 `app-management`、`tenant-system`）
   - 特定子域的完整能力（如 `i18n-kv-management`、`area-query`）

4. **向用户展示合并方案**

   使用 **AskUserQuestion 工具** 展示合并建议：

   | 合并后     | 包含的现有 spec     | 理由     |
   | ---------- | ------------------- | -------- |
   | `new-name` | `spec-a` + `spec-b` | 简短说明 |

   同时列出将保持独立的 spec。

   提供选项：
   - **全部执行** — 按建议方案合并
   - **只合并明显相关的** — 只合并争议最小的几组
   - **我来调整** — 用户自定义方案

5. **执行合并**

   对每个合并组：
   - 读取所有源 spec 的完整内容
   - 按统一的 Purpose → Requirements 结构重新组织
   - 去重重复的 Scenario（如两个 spec 中都有"创建角色时绑定菜单"）
   - 保留所有不重复的 Requirement 和 Scenario
   - 创建新目录并写入合并后的 `spec.md`
   - 删除源 spec 目录

   合并后的 spec 格式：

   ```markdown
   # Capability: <merged-name>

   ## Purpose

   <合并各源 spec 的 Purpose，形成统一描述>

   ## Requirements

   ### Requirement: <标题>

   <内容，保持 WHEN/THEN/AND 格式>
   ```

6. **显示合并结果**

   ```
   ## Specs 合并完成

   **合并前**: N 个 specs
   **合并后**: M 个 specs

   合并映射:
   - spec-a + spec-b → new-name
   - spec-c + spec-d + spec-e → another-name

   保持独立: spec-x, spec-y, spec-z
   ```

---

## 护栏规则

- 清理归档前必须确认，不自动执行删除
- 合并 specs 前必须展示方案并获得用户确认
- 合并时保留所有 Requirements 和 Scenarios，不丢失内容
- 合并后的 Purpose 必须准确反映各源 spec 的范围
- 不修改 `openspec/changes/` 中非归档的活跃 change
- 不修改 `openspec/config.yaml`
- 如果 `openspec/specs/` 中没有可合并的 spec（粒度已经合理），输出"specs 已经足够精简，无需合并"
- 如果 `openspec/changes/archive/` 为空或不包含 `specs/` 子目录，输出"归档已是最新，无需清理"
- 整理完成后建议用户使用 `git commit` 提交变更
