# Unified Mock Spec

## Purpose

Mock system providing auth endpoints (login/logout/refresh), role-based menu endpoints, and HTTP-based auth store integration.

## Requirements

### Requirement: Auth mock provides login endpoint

The mock system SHALL provide `/api/auth/login` endpoint that validates credentials and returns user info with token.

#### Scenario: Platform admin mock login

- **WHEN** a POST request to `/api/auth/login` with `{ username: "admin", password: "123456", role: "platform_admin" }`
- **THEN** the mock returns `{ code: 0, data: { userInfo: { role: "platform_admin", username: "admin" }, accessToken: "...", refreshToken: "..." } }`

#### Scenario: Tenant admin mock login

- **WHEN** a POST request to `/api/auth/login` with `{ username: "tenant", password: "123456", role: "tenant_admin", tenantCode: "DEMO" }`
- **THEN** the mock returns `{ code: 0, data: { userInfo: { role: "tenant_admin", username: "tenant", tenantCode: "DEMO" }, accessToken: "...", refreshToken: "..." } }`

#### Scenario: Invalid credentials mock login

- **WHEN** a POST request to `/api/auth/login` with invalid credentials
- **THEN** the mock returns `{ code: -1, message: "Invalid credentials" }`

### Requirement: Auth mock provides logout endpoint

The mock system SHALL provide `/api/auth/logout` endpoint.

#### Scenario: Mock logout

- **WHEN** a POST request to `/api/auth/logout`
- **THEN** the mock returns `{ code: 0, message: "success" }`

### Requirement: Auth mock provides refresh token endpoint

The mock system SHALL provide `/api/auth/refresh` endpoint for token refresh.

#### Scenario: Mock token refresh

- **WHEN** a POST request to `/api/auth/refresh` with a valid refresh token
- **THEN** the mock returns new access and refresh tokens

### Requirement: Menu mock returns role-based menus

The mock system SHALL provide `/api/menu/list` endpoint that returns different menus based on the user's role.

#### Scenario: Platform admin menu

- **WHEN** a request to `/api/menu/list` from a `platform_admin` user
- **THEN** the mock returns platform admin menu items (Dashboard, User Management, Role Management, Tenant Management, etc.)

#### Scenario: Tenant admin menu

- **WHEN** a request to `/api/menu/list` from a `tenant_admin` user
- **THEN** the mock returns tenant admin menu items (Dashboard, Profile, etc.)

### Requirement: Auth store uses HTTP calls in mock mode

The auth store SHALL use HTTP API calls (via Axios) for login, even in mock mode, instead of direct function calls.

#### Scenario: Login calls API

- **WHEN** `login()` is called in the auth store
- **THEN** it makes a POST request to `/api/auth/login` via Axios, regardless of mock mode

#### Scenario: Mock mode flag controls mock system

- **WHEN** `VITE_ENABLE_MOCK` is `true`
- **THEN** vite-plugin-mock intercepts the HTTP requests and returns mock data

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
