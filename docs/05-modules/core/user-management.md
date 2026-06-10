# 用户管理

用户管理页面 (`src/pages/system/users/`) 提供用户 CRUD、关联字段选择和列表展示功能。

## 关联选择器

用户表单包含三个关联字段选择器，各自的数据来源和渲染方式不同：

### 分组选择器

- **组件**: `GroupTreeRadio`（递归 radio 列表，在 `user-form.tsx` 中定义）
- **数据来源**: `groupApi.getTree()` → `GET /api/v1/sys/group/tree`
- **字段**: `groupId`（number，树形单选）
- **交互**: 展开式树形列表，点击 radio 选中节点，回填 groupId

### 角色多选器

- **组件**: `RoleCheckboxList`（checkbox 列表，在 `user-form.tsx` 中定义）
- **数据来源**: `roleApi.getDropdown()` → `GET /api/v1/sys/role/dropdown`
- **字段**: `roleIds`（number[]，多选）
- **交互**: 勾选/取消勾选角色，回填 roleIds 数组

### 租户下拉（平台管理员专属）

- **组件**: shadcn `Select`（普通下拉）
- **数据来源**: `tenantApi.getDropdown()` → `GET /api/v1/sys/tenant/dropdown`
- **字段**: `tenantId`（number，单选）
- **条件渲染**: 仅当 `useAuthStore().userInfo.role === 'platform_admin'` 时显示
- **业务规则**: 租户管理员创建用户时后端从 JWT 自动解析 tenantId，前端不传递此字段

## 类型定义

用户相关类型定义在 `src/types/user.ts`，核心字段：

- `SysUserRequest`: groupId、roleIds、tenantId + 基础字段
- `SysUserListResponse`: groupId、groupName、roleIds、roleNames、tenantId、tenantName + 基础字段
- `SysUserQuery`: groupId、tenantId 作为可选过滤参数
