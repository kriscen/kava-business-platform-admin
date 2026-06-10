## MODIFIED Requirements

### Requirement: Consistent page directory structure

每个管理模块的页面组件 SHALL 位于 `src/pages/system/<module>/` 子目录内，文件名为 `index.tsx` 或 `<Module>Management.tsx`。模块的 columns 和 form 组件与页面组件同级。

#### Scenario: User management page location

- **WHEN** 项目启动时加载用户管理页面
- **THEN** lazy import 路径指向 `@/pages/system/users/UserManagement`（或 `@/pages/system/users/index`），与 tenant、app、role 等模块的目录结构一致

#### Scenario: User form submits relation fields

- **WHEN** 用户提交创建或编辑用户表单
- **THEN** 系统 SHALL 将 `groupId`、`roleIds`、`tenantId`（平台管理员时）字段随请求体一起发送到 `POST /api/v1/sys/user` 或 PUT 接口

#### Scenario: User list displays relation columns

- **WHEN** 用户列表加载完成
- **THEN** 列表 SHALL 展示分组名称（groupName）和角色名称（roleNames）列，数据来自后端 `SysUserListResponse` 的富化字段

## ADDED Requirements

### Requirement: 用户类型定义修正

`src/types/user.ts` 中的类型定义 SHALL 与后端 API 契约（`docs/04-frontend/upms-api.md`）保持一致。

#### Scenario: SysUserRequest 字段修正

- **WHEN** 定义 `SysUserRequest` 类型
- **THEN** SHALL 包含 `groupId`（非 `deptId`）、`roleIds`、`tenantId`、`username`、`password`、`phone`、`avatar`、`nickname`、`name`、`email`、`lockFlag`、`id` 字段，类型与 API 文档一致

#### Scenario: SysUserListResponse 字段修正

- **WHEN** 定义 `SysUserListResponse` 类型
- **THEN** SHALL 包含 `groupId`（非 `deptId`）、`groupName`（非 `deptName`）、`tenantId`、`tenantName`、`roleIds` 字段

#### Scenario: SysUserQuery 字段修正

- **WHEN** 定义 `SysUserQuery` 类型
- **THEN** 查询参数 SHALL 包含 `groupId`（非 `deptId`），与后端过滤参数一致
