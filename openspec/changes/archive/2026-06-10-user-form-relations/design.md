## Context

用户管理页面（`src/pages/system/users/`）已有基础 CRUD 功能，但表单缺少后端 `SysUserRequest` 定义的关键关联字段。当前 `SysUserRequest` 类型使用了错误的字段名（`deptId` 而非 `groupId`），需要修正以匹配 `docs/04-frontend/upms-api.md` 中的 API 契约。

角色表单（`role-form.tsx`）中已有 `MenuTreeCheckbox` 递归树形多选组件可作为参考模式。应用管理页面中的菜单绑定也有类似的树形选择器实现。

## Goals / Non-Goals

**Goals:**

- 用户表单支持选择分组（树形单选）、角色（多选下拉）、租户（单选下拉，平台管理员专属）
- 类型定义修正为与后端 API 契约一致
- 用户列表展示 groupName 和 roleNames 列
- Mock 数据同步更新

**Non-Goals:**

- 不实现按钮级权限控制（属于 P1 范畴）
- 不重构现有表单组件架构
- 不修改其他管理页面的表单

## Decisions

### 1. 分组选择器：使用 TreeSelect 模式

**选择**：用递归组件渲染分组树，选中节点回填 `groupId`。

**理由**：分组是 pid 树形结构，用普通 Select 无法体现层级关系。项目已有 `MenuTreeCheckbox`（role-form.tsx）的递归树模式可参考，但分组是单选，实现更简单。

**替代方案**：使用第三方 TreeSelect 组件（如 shadcn 不提供原生 TreeSelect，需要自己组合）。

### 2. 角色选择器：多选下拉

**选择**：使用 shadcn Select 的多选模式或自定义多选组件，数据来源 `roleApi.getDropdown()`。

**理由**：后端 `SysUserRequest.roleIds` 是 `List<Long>`，需要多选。`getDropdown()` 返回 `{id, roleName, roleCode}`，用于构建选项列表。

**替代方案**：用 Checkbox 列表（类似角色表单的 MenuTreeCheckbox 模式）。但角色是扁平列表不需要树形，多选下拉更紧凑。

### 3. 租户选择器：条件渲染

**选择**：根据 auth store 中的 `userInfo.role` 判断是否显示租户下拉。平台管理员显示，租户管理员不显示（后端从 JWT 自动解析 tenantId）。

**理由**：`business-guide.md` 明确说明前端不需要手动传递 tenantId（后端从 JWT 解析），但平台管理员创建用户时可能需要指定租户。`tenantApi.getDropdown()` 已有现成 API。

### 4. 类型修正策略：直接修正

**选择**：将 `SysUserQuery.deptId` → `groupId`、`SysUserRequest.deptId` → `groupId`、`SysUserListResponse.deptId/deptName` → `groupId/groupName`，同时补充缺失的 `roleIds`、`tenantId`、`groupName` 等字段。

**理由**：后端 API 契约文档中明确字段名是 `groupId`/`groupName`，当前的 `deptId` 是历史遗留错误。直接修正比维护别名更清晰。

## Risks / Trade-offs

- **字段名修改影响范围**：修正 `deptId` → `groupId` 会影响 mock 数据和列定义，需同步更新 → 逐一检查并更新所有引用点
- **角色多选 UI 复杂度**：shadcn/ui 没有原生多选组件，需要自定义组合（Checkbox + Popover 或自定义 MultiSelect）→ 复用已有的 Checkbox 列表模式，保持一致性
