## ADDED Requirements

### Requirement: Platform admin login page exists

The system SHALL provide a dedicated login page at `/platform/login` for platform administrators.

#### Scenario: Platform login page renders

- **WHEN** a user navigates to `/platform/login`
- **THEN** the system renders a login form with username and password fields

#### Scenario: Platform login with valid credentials

- **WHEN** a user submits valid platform admin credentials on `/platform/login`
- **THEN** the system authenticates the user and redirects to `/platform/dashboard`

#### Scenario: Platform login with invalid credentials

- **WHEN** a user submits invalid credentials on `/platform/login`
- **THEN** the system shows an error message and remains on the login page

### Requirement: Tenant admin login page exists

The system SHALL provide a dedicated login page at `/tenant/login` for tenant administrators.

#### Scenario: Tenant login page renders

- **WHEN** a user navigates to `/tenant/login`
- **THEN** the system renders a login form with username, password, and tenantCode fields

#### Scenario: Tenant login with valid credentials

- **WHEN** a user submits valid tenant admin credentials (including tenantCode) on `/tenant/login`
- **THEN** the system authenticates the user and redirects to `/tenant/dashboard`

#### Scenario: Tenant login with invalid tenantCode

- **WHEN** a user submits valid credentials but invalid tenantCode on `/tenant/login`
- **THEN** the system shows an error message about invalid tenant

### Requirement: Authenticated users are redirected from login

The system SHALL redirect authenticated users away from login pages to their respective dashboard.

#### Scenario: Platform admin visits platform login

- **WHEN** an authenticated `platform_admin` user navigates to `/platform/login`
- **THEN** the system redirects to `/platform/dashboard`

#### Scenario: Tenant admin visits tenant login

- **WHEN** an authenticated `tenant_admin` user navigates to `/tenant/login`
- **THEN** the system redirects to `/tenant/dashboard`
