## ADDED Requirements

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
