## Context

前端项目已有完整的租户管理和应用管理 CRUD 页面，遵循统一的 DataTable + FormModal + react-hook-form 模式。docs/04 定义了租户应用订阅的 3 个 API 端点但前端未实现。dept 模块已废弃（改名为 group），遗留代码需要清理。UserManagement.tsx 的文件位置与项目惯例（页面组件在子目录内）不一致。

## Goals / Non-Goals

**Goals:**

- 在租户管理页面增加"应用订阅"功能入口，支持查看/订阅/退订应用
- 删除所有 dept 遗留代码
- 统一 user 页面目录结构

**Non-Goals:**

- 不修改后端 API
- 不改变 group 模块的实现（已独立存在）
- 不重构其他模块的目录结构

## Decisions

### 1. 租户应用订阅 UI 形式

**选择**：在 TenantManagement.tsx 的操作列增加"应用订阅"按钮，点击后打开一个独立的 FormModal 展示订阅管理。

**理由**：参考 AppManagement 中"绑定菜单"的模式——操作列按钮 + 独立弹窗。这比在租户详情表单中加 tab 更轻量，且与现有交互模式一致。

**替代方案**：在租户详情页加 tab panel。过于复杂，当前没有 tab 表单的先例。

### 2. 订阅弹窗的交互设计

**选择**：弹窗内展示已订阅应用列表（带退订按钮）+ 下方"订阅新应用"区域（应用下拉 + 确认按钮）。

**理由**：简单直观，不需要复杂的多选表格。应用数量通常不多（<20），列表足够。

### 3. API 模块组织

**选择**：在现有 `tenant.ts` API 模块中新增 3 个方法（`getApps`、`subscribeApp`、`unsubscribeApp`），而非创建独立的 `tenantApp.ts`。

**理由**：这些端点的 base path 是 `/api/v1/sys/tenant/{tenantId}/apps`，属于租户资源的子资源，放在 tenant 模块中语义更清晰。

### 4. User 页面目录整理

**选择**：将 `UserManagement.tsx` 移入 `users/` 目录并重命名为 `index.tsx`。

**理由**：与其他模块（tenant/、app/、role/ 等）保持一致——页面组件在子目录内。同时更新 App.tsx 的 lazy import 路径。

## Risks / Trade-offs

- [租户订阅弹窗] 应用数量多时列表可能过长 → 当前场景应用数量有限，暂不处理分页
- [删除 dept] 如果有其他分支引用 dept 代码会产生冲突 → 合并前确认分支状态
