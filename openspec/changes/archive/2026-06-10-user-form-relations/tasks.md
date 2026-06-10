## 1. 类型定义修正

- [x] 1.1 修正 `src/types/user.ts`：将 `SysUserQuery.deptId` → `groupId`；`SysUserRequest.deptId` → `groupId`；`SysUserListResponse.deptId/deptName` → `groupId/groupName`；确保 `roleIds`、`tenantId` 字段存在且类型正确
- [x] 1.2 更新 `mock/user.ts` 中的 mock 数据字段名：`deptId` → `groupId`、`deptName` → `groupName`，添加 `roleNames` 富化字段

## 2. i18n 翻译

- [x] 2.1 更新 `src/i18n/locales/zh-CN/user.json`：添加 `group`（分组）、`groupPlaceholder`、`role`（角色）、`rolePlaceholder`、`tenant`（租户）、`tenantPlaceholder`、`groupName`（分组名称）、`roleNames`（角色名称）等 key

## 3. 用户表单关联选择器

- [x] 3.1 在 `user-form.tsx` 中添加分组选择器：调用 `groupApi.getTree()` 获取分组树，用递归树形单选组件渲染，回填 `groupId`
- [x] 3.2 在 `user-form.tsx` 中添加角色多选器：调用 `roleApi.getDropdown()` 获取角色列表，用 Checkbox 列表模式渲染多选，回填 `roleIds`
- [x] 3.3 在 `user-form.tsx` 中添加租户下拉（条件渲染）：从 auth store 读取 `userInfo.role`，平台管理员时调用 `tenantApi.getDropdown()` 渲染下拉，回填 `tenantId`
- [x] 3.4 更新 `user-form.tsx` 的 Zod schema：添加 `groupId`、`roleIds`、`tenantId` 字段验证，更新 `UserFormValues` 类型
- [x] 3.5 更新 `user-form.tsx` 的 `useEffect` reset 逻辑：包含 `groupId`、`roleIds`、`tenantId` 的初始值和编辑回填

## 4. 页面提交逻辑

- [x] 4.1 更新 `UserManagement.tsx` 的 `handleFormSubmit`：将 `groupId`、`roleIds`、`tenantId` 传入 `SysUserRequest` 发送到 API
- [x] 4.2 更新 `columns.tsx`：将 `deptName` 列替换为 `groupName`，添加 `roleNames` 展示列

## 5. 验证

- [x] 5.1 运行 `pnpm dev` 验证用户管理页面：创建用户表单显示分组、角色、租户选择器
- [x] 5.2 验证编辑用户时选择器正确预填
- [x] 5.3 验证列表正确展示 groupName 和 roleNames 列
- [x] 5.4 运行 `pnpm type-check` 确保无类型错误
