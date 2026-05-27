## ADDED Requirements

### Requirement: ApiResponse 与后端 JsonResult 对齐

`ApiResponse<T>` 类型 SHALL 与后端 `JsonResult<T>` 完全对齐：`code` 类型为 `string`（非 `number`），消息字段名为 `msg`（非 `message`）。成功时 `code` 值为 `"0"`。

#### Scenario: 业务成功响应

- **WHEN** 后端返回 `{ "code": "0", "msg": "success", "data": { "id": 1 } }`
- **THEN** `ApiResponse<{id: number}>` 的 `code` 类型为 `string`，`msg` 字段值为 `"success"`

#### Scenario: 业务失败响应

- **WHEN** 后端返回 `{ "code": "A00403", "msg": "租户已停用", "data": null }`
- **THEN** `ApiResponse` 的 `code` 为 `"A00403"`，`msg` 为 `"租户已停用"`

#### Scenario: 拦截器判断业务成功

- **WHEN** 响应拦截器检查业务码
- **THEN** 使用 `data.code !== '0'` 判断失败（字符串比较）

### Requirement: 分页类型定义

系统 SHALL 提供 `PageQuery` 和 `PagingInfo<T>` 通用分页类型，与后端分页协议对齐。

#### Scenario: PageQuery 包含通用分页参数

- **WHEN** API 模块需要查询分页数据
- **THEN** 请求参数继承 `PageQuery`，包含 `pageNo: number`（默认 1）和 `pageSize: number`（默认 10）

#### Scenario: PagingInfo 包含后端分页响应结构

- **WHEN** 后端返回分页数据
- **THEN** `PagingInfo<T>` 类型包含 `records: T[]`、`total: number`、`size: number`、`current: number`、`pages: number`

### Requirement: 核心实体类型定义

系统 SHALL 为后端 UPMS 模块的核心资源定义 TypeScript 类型，包括 Request（创建/更新）和 Response（列表/详情）类型。

#### Scenario: 用户实体类型完整

- **THEN** 存在 `SysUserRequest`（username, password, phone, deptId, tenantId, roleIds 等字段）、`SysUserListResponse`（含 deptName, tenantName 富化字段）、`SysUserDetailResponse`（额外含 roleNames）

#### Scenario: 角色实体类型完整

- **THEN** 存在 `SysRoleRequest`（roleName, roleCode, menuIds 等字段）、`SysRoleListResponse`、`SysRoleDetailResponse`（含 menuIds, menuNames）、`SysRoleDropdownResponse`

#### Scenario: 菜单实体类型完整

- **THEN** 存在 `SysMenuRequest`（name, permission, path, component, menuType 等字段）、`SysMenuListResponse`（含 children 递归结构和 parentName）、`SysMenuDetailResponse`

#### Scenario: 部门实体类型完整

- **THEN** 存在 `SysDeptRequest`（name, pid, sortOrder）、`SysDeptListResponse`（含 children 递归结构和 parentName）

#### Scenario: 租户实体类型完整

- **THEN** 存在 `SysTenantRequest`（name, code, status 等字段，创建时含 adminUsername/adminPassword）、`SysTenantListResponse`、`SysTenantDropdownResponse`

### Requirement: 实体类型文件组织

实体类型 SHALL 按资源模块分文件存放于 `src/types/` 目录，通用类型放在 `src/types/common.ts`。

#### Scenario: 类型文件结构

- **THEN** `src/types/common.ts` 导出 `PageQuery`、`PagingInfo<T>`、`IdParam` 等通用类型；`src/types/user.ts`、`role.ts`、`menu.ts`、`dept.ts`、`tenant.ts` 各导出对应资源的类型

#### Scenario: 类型统一导出

- **THEN** `src/types/index.ts` 重新导出所有类型文件，外部通过 `@/types` 统一引用
