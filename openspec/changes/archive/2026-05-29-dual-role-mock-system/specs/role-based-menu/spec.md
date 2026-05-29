## ADDED Requirements

### Requirement: Platform admin sees platform-specific menu items

The menu system SHALL show platform admin specific menu items when the user has `platform_admin` role.

#### Scenario: Platform admin menu structure

- **WHEN** a `platform_admin` user is authenticated
- **THEN** the sidebar shows: Dashboard, User Management, Role Management, Tenant Management, Menu Management, System Config

### Requirement: Tenant admin sees tenant-specific menu items

The menu system SHALL show tenant admin specific menu items when the user has `tenant_admin` role.

#### Scenario: Tenant admin menu structure

- **WHEN** a `tenant_admin` user is authenticated
- **THEN** the sidebar shows: Dashboard, Profile, and any additional menu items configured for this tenant

### Requirement: Menu store supports role-based filtering

The menu store SHALL provide a method to get menu items filtered by the current user's role.

#### Scenario: Get menu by role

- **WHEN** `getMenuByRole()` is called with `platform_admin` role
- **THEN** it returns the platform admin menu configuration

#### Scenario: Get menu by role for tenant

- **WHEN** `getMenuByRole()` is called with `tenant_admin` role
- **THEN** it returns the tenant admin menu configuration

### Requirement: Menu items have correct routing paths

Menu items SHALL have paths that match the route namespace for the user's role.

#### Scenario: Platform menu paths

- **WHEN** platform admin menu items are rendered
- **THEN** all menu item paths start with `/platform/`

#### Scenario: Tenant menu paths

- **WHEN** tenant admin menu items are rendered
- **THEN** all menu item paths start with `/tenant/`
