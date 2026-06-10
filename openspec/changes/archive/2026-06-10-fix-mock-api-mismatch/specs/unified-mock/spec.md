## MODIFIED Requirements

### Requirement: Mock endpoints aligned with real API paths

系统 SHALL 在 mock 数据中提供与真实后端完全一致的 API 路径和响应结构。所有 mock 的 URL、HTTP 方法、请求参数 SHALL 与对应 API 模块（`src/api/modules/`）的实际调用行为完全匹配。

#### Scenario: App update mock URL matches API module

- **WHEN** 开发模式下前端调用 `appApi.update(data)` 发送 `PUT /api/v1/sys/app`（id 在 request body 中）
- **THEN** mock 系统 SHALL 拦截 `PUT /api/v1/sys/app` 并返回成功响应，不带 `{id}` 路径参数

#### Scenario: FileGroup update mock URL matches API module

- **WHEN** 开发模式下前端调用 `fileGroupApi.update(data)` 发送 `PUT /api/v1/sys/file-group`（id 在 request body 中）
- **THEN** mock 系统 SHALL 拦截 `PUT /api/v1/sys/file-group` 并返回成功响应，不带 `{id}` 路径参数

#### Scenario: Tenant mock endpoints

- **WHEN** 开发模式下请求 `GET /api/v1/sys/tenant/page`
- **THEN** 返回符合 `PagingInfo<SysTenantListResponse>` 结构的分页数据

#### Scenario: Tenant enable/disable mock

- **WHEN** 开发模式下请求 `PUT /api/v1/sys/tenant/1/enable` 或 `disable`
- **THEN** 返回成功响应

#### Scenario: PublicParam mock endpoints

- **WHEN** 开发模式下请求 `GET /api/v1/sys/public-param/page`
- **THEN** 返回符合 `PagingInfo<SysPublicParamListResponse>` 结构的分页数据

## REMOVED Requirements

### Requirement: User info mock endpoint

**Reason**: `/api/user/info` 是旧版 API 路径，当前 API 模块使用 `/api/v1/sys/user/...` 路径，且无任何页面调用 `/api/user/info`。此 mock 为孤立遗留代码。
**Migration**: 无需迁移。如将来需要用户信息 mock，按 `src/api/modules/user.ts` 的路径新建。

### Requirement: System config mock endpoint

**Reason**: `/api/system/config` 无对应 API 模块，无任何页面或 store 调用。此 mock 为孤立遗留代码。
**Migration**: 无需迁移。
