## Why

用户管理表单目前只有基础字段（用户名、密码、手机、邮箱等），缺少后端 `SysUserRequest` 已支持的三个关键关联字段：`groupId`（分组）、`roleIds`（角色）、`tenantId`（租户）。没有这些字段，用户和角色/分组/租户之间的关联关系无法通过 UI 建立，用户管理功能形同虚设。

## What Changes

- 在用户表单中添加**分组选择器**：树形下拉，数据来源 `groupApi.getTree()`
- 在用户表单中添加**角色多选器**：多选下拉，数据来源 `roleApi.getDropdown()`
- 在用户表单中添加**租户下拉**：普通下拉，数据来源 `tenantApi.getDropdown()`，仅平台管理员可见
- 更新 `SysUserRequest` 和 `SysUserListResponse` 类型定义，修正字段名（`deptId` → `groupId`，`deptName` → `groupName`）以匹配后端 API 契约
- 在 `UserManagement.tsx` 的 `handleFormSubmit` 中传递新字段到 API
- 添加用户列表 columns 中对 `groupName`、`roleNames` 的展示
- 更新 `user.json` i18n 文件，添加新字段的翻译 key
- 更新 mock 数据以匹配修正后的字段名

## Capabilities

### New Capabilities

- `user-relation-selectors`: 用户表单中的分组、角色、租户关联选择器组件及其数据加载逻辑

### Modified Capabilities

- `crud-management-pages`: 用户管理的类型定义和表单提交逻辑需更新以支持关联字段

## Impact

- **类型文件** `src/types/user.ts`：修正字段名，添加新字段
- **组件文件** `src/pages/system/users/user-form.tsx`：添加三个选择器
- **页面文件** `src/pages/system/users/UserManagement.tsx`：传递关联字段到 API、根据角色显示租户选择器
- **列定义** `src/pages/system/users/columns.tsx`：展示 groupName、roleNames
- **i18n** `src/i18n/locales/zh-CN/user.json`：新增翻译 key
- **Mock** `mock/user.ts`：修正字段名、返回 roleNames 等富化字段
