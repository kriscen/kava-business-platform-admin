# Dual Routing Spec — Delta

## MODIFIED Requirements

### Requirement: Platform admin routes are isolated

The system SHALL provide routes under `/platform/*` for platform admin pages, using the unified `MainLayout` component. Route isolation is achieved via role-based guard on route metadata, not via separate layout components.

#### Scenario: Platform admin accesses platform routes

- **WHEN** a user with `platform_admin` role navigates to `/platform/dashboard`
- **THEN** the system renders the `MainLayout` with the dashboard page and platform menu

#### Scenario: Tenant admin is blocked from platform routes

- **WHEN** a user with `tenant_admin` role navigates to `/platform/dashboard`
- **THEN** the system redirects to `/tenant/dashboard`

### Requirement: Tenant admin routes are isolated

The system SHALL provide routes under `/tenant/*` for tenant admin pages, using the unified `MainLayout` component. Route isolation is achieved via role-based guard, not via separate layout components.

#### Scenario: Tenant admin accesses tenant routes

- **WHEN** a user with `tenant_admin` role navigates to `/tenant/dashboard`
- **THEN** the system renders the `MainLayout` with the dashboard page and tenant menu

#### Scenario: Platform admin is blocked from tenant routes

- **WHEN** a user with `platform_admin` role navigates to `/tenant/dashboard`
- **THEN** the system redirects to `/platform/dashboard`

## REMOVED Requirements

### Requirement: Platform Layout provides admin navigation

**Reason**: Replaced by unified `MainLayout` that dynamically renders the correct menu based on user role. See [[unified-layout]] spec.

**Migration**: All routes using `PlatformLayout` SHALL be updated to use `MainLayout`.

### Requirement: Tenant Layout provides tenant navigation

**Reason**: Replaced by unified `MainLayout`. Same as above.

**Migration**: All routes using `TenantLayout` SHALL be updated to use `MainLayout`.
