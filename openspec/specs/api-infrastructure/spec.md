# API Infrastructure Spec

## Purpose

API 层约定：按后端资源模块组织 API 调用文件，定义与后端 JsonResult 对齐的 TypeScript 类型，规范 CRUD 和特殊接口的函数签名，以及响应拦截器的错误处理和 Toast 通知。

## Requirements

### Requirement: API 模块文件组织

系统 SHALL 在 `src/api/modules/` 下按后端资源模块组织 API 调用文件，每个文件对应一个后端资源。

#### Scenario: 模块文件结构

- **THEN** 存在 `src/api/modules/user.ts`、`role.ts`、`menu.ts`、`dept.ts`、`tenant.ts`，以及 `src/api/auth.ts`（OAuth2 token 端点）

#### Scenario: 每个模块导出 API 对象

- **WHEN** 业务代码需要调用用户 API
- **THEN** 通过 `import { userApi } from '@/api/modules/user'` 获取，调用 `userApi.getPage(query)` 等方法

### Requirement: API 函数签名规范

每个 API 模块 SHALL 提供标准的 CRUD 函数签名，返回类型使用 `ApiResponse<T>` 包装。

#### Scenario: 分页查询函数签名

- **WHEN** 资源支持分页查询
- **THEN** 模块导出 `getPage(params: XxxQuery): Promise<ApiResponse<PagingInfo<XxxListResponse>>>` 函数，使用 GET 方法

#### Scenario: 详情查询函数签名

- **WHEN** 资源支持按 ID 查询
- **THEN** 模块导出 `getById(id: number): Promise<ApiResponse<XxxDetailResponse>>` 函数，使用 GET 方法

#### Scenario: 创建函数签名

- **WHEN** 资源支持创建
- **THEN** 模块导出 `create(data: XxxRequest): Promise<ApiResponse<Long>>` 函数，使用 POST 方法

#### Scenario: 更新函数签名

- **WHEN** 资源支持更新
- **THEN** 模块导出 `update(id: number, data: XxxRequest): Promise<ApiResponse<Void>>` 或 `update(data: XxxRequest): Promise<ApiResponse<Boolean>>` 函数，使用 PUT 方法

#### Scenario: 批量删除函数签名

- **WHEN** 资源支持删除
- **THEN** 模块导出 `remove(ids: number[]): Promise<ApiResponse<Void>>` 函数，使用 DELETE 方法

### Requirement: 特殊接口支持

API 模块 SHALL 支持后端定义的非标准 CRUD 接口（下拉列表、树形查询、启停操作等）。

#### Scenario: 角色下拉接口

- **THEN** `roleApi.getDropdown()` 返回 `Promise<ApiResponse<SysRoleDropdownResponse[]>>`

#### Scenario: 菜单树接口

- **THEN** `menuApi.getTree()` 返回 `Promise<ApiResponse<SysMenuListResponse[]>>`（含嵌套 children）

#### Scenario: 部门树接口

- **THEN** `deptApi.getTree()` 返回 `Promise<ApiResponse<SysDeptListResponse[]>>`

#### Scenario: 租户启停接口

- **THEN** `tenantApi.enable(id: number)` 和 `tenantApi.disable(id: number)` 分别调用 `PUT /{id}/enable` 和 `PUT /{id}/disable`

#### Scenario: 租户下拉接口

- **THEN** `tenantApi.getDropdown()` 返回 `Promise<ApiResponse<SysTenantDropdownResponse[]>>`

### Requirement: Auth API 模块

系统 SHALL 提供 `src/api/auth.ts` 封装 OAuth2 token 端点调用。

#### Scenario: token 刷新函数

- **THEN** `authApi.refreshToken(refreshToken: string)` 使用 raw fetch（不经过 Axios 拦截器）调用 `POST /oauth2/token`，返回 `{ access_token, refresh_token, expires_in }`

#### Scenario: 授权码换 token

- **THEN** `authApi.exchangeCode(code: string)` 使用 raw fetch 调用 `POST /oauth2/token` with `grant_type=authorization_code`

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

### Requirement: PublicParam 类型和 API 模块

系统 SHALL 定义 PublicParam 相关类型并提供 `publicParamApi` 模块，包含 CRUD 操作，基础路径为 `/api/v1/sys/public-param`。

#### Scenario: PublicParam 类型定义

- **THEN** 存在 `SysPublicParamQuery`、`SysPublicParamRequest`、`SysPublicParamListResponse`、`SysPublicParamDetailResponse` 类型，与 `docs/04-frontend/upms-api.md` 中的定义一致

#### Scenario: PublicParam CRUD 操作

- **THEN** `publicParamApi` 包含 `getPage`、`getById`、`create`、`update(id, data)`、`remove(ids)` 方法

### Requirement: Toast 组件集成

系统 SHALL 接入 shadcn/ui Sonner toast 组件，在应用根组件提供全局 `<Toaster />`。

#### Scenario: Toaster 挂载在根组件

- **WHEN** 应用启动
- **THEN** `App.tsx` 中渲染 `<Toaster />` 组件，所有页面均可触发 toast 通知

### Requirement: 响应拦截器展示业务错误 toast

响应拦截器检测到业务错误（`code !== '0'`）时 SHALL 展示 toast 错误通知。

#### Scenario: 业务错误展示错误消息

- **WHEN** 后端返回 `{ "code": "A00403", "msg": "租户已停用" }`
- **THEN** 拦截器调用 `toast.error('租户已停用')`，用户看到错误 toast

#### Scenario: 业务错误无 msg 字段

- **WHEN** 后端返回 `{ "code": "99999", "msg": "" }` 且 msg 为空
- **THEN** 拦截器展示默认消息 `toast.error('请求失败')`

### Requirement: HTTP 错误分类展示 toast

响应拦截器 SHALL 根据 HTTP 状态码分类展示对应的错误 toast。

#### Scenario: 403 禁止访问

- **WHEN** 后端返回 403
- **THEN** 展示 `toast.error('禁止访问，无权限')`

#### Scenario: 404 资源不存在

- **WHEN** 后端返回 404
- **THEN** 展示 `toast.error('请求的资源不存在')`

#### Scenario: 500 服务器错误

- **WHEN** 后端返回 500
- **THEN** 展示 `toast.error('服务器内部错误')`

#### Scenario: 502 网关错误

- **WHEN** 后端返回 502
- **THEN** 展示 `toast.error('网关错误')`

#### Scenario: 503 服务不可用

- **WHEN** 后端返回 503
- **THEN** 展示 `toast.error('服务暂时不可用')`

#### Scenario: 网络连接失败

- **WHEN** 请求因网络错误失败（`error.message === 'Network Error'`）
- **THEN** 展示 `toast.error('网络连接失败，请检查网络')`

#### Scenario: 请求超时

- **WHEN** 请求超时（`error.code === 'ECONNABORTED'`）
- **THEN** 展示 `toast.error('请求超时，请稍后重试')`

### Requirement: Token 过期提示

Token 刷新失败导致登出时 SHALL 展示提示 toast，且所有排队的 401 请求 SHALL 被正确 reject 而非永远挂起。

#### Scenario: refresh_token 过期登出

- **WHEN** token 刷新失败，系统执行 `clearAuthAndRedirect()`
- **THEN** 在跳转登录页前展示 `toast.info`（使用 i18n key）

#### Scenario: 刷新失败后排队请求被 reject

- **WHEN** refresh 请求返回失败，且有多于 1 个请求在队列中等待
- **THEN** 所有排队请求的 Promise 被 reject，而非永远挂起
