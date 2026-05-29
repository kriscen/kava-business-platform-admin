## ADDED Requirements

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
