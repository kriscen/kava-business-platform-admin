## ADDED Requirements

### Requirement: Group API module

The system SHALL provide a `groupApi` object in `src/api/modules/group.ts` that wraps all 6 Group REST endpoints: `getPage`, `getById`, `create`, `update`, `remove`, `getTree`.

#### Scenario: Paginated group listing

- **WHEN** `groupApi.getPage({ pageNo: 1, pageSize: 10 })` is called
- **THEN** the system sends `GET /api/v1/sys/group/page?pageNo=1&pageSize=10` and returns `ApiResponse<PagingInfo<SysGroupListResponse>>`
- **NOTE**: The management page uses `getTree()` for hierarchical display; `getPage` is available for programmatic use but not used in the current UI

#### Scenario: Get group tree

- **WHEN** `groupApi.getTree()` is called
- **THEN** the system sends `GET /api/v1/sys/group/tree` and returns `ApiResponse<SysGroupListResponse[]>` with nested `children`

#### Scenario: Create group

- **WHEN** `groupApi.create({ name: '技术部', pid: 1, sortOrder: 0 })` is called
- **THEN** the system sends `POST /api/v1/sys/group` with the request body and returns `ApiResponse<Long>`

#### Scenario: Update group

- **WHEN** `groupApi.update({ id: 2, name: '研发部', pid: 1, sortOrder: 1 })` is called
- **THEN** the system sends `PUT /api/v1/sys/group/{id}` with the request body and returns `ApiResponse<Void>`

#### Scenario: Delete groups

- **WHEN** `groupApi.remove([1, 2])` is called
- **THEN** the system sends `DELETE /api/v1/sys/group` with body `[1, 2]` and returns `ApiResponse<Void>`

### Requirement: Group type definitions

The system SHALL define TypeScript types in `src/types/group.ts` matching the backend API contract: `SysGroupQuery` (extends `PageQuery`), `SysGroupRequest`, `SysGroupListResponse` (with self-referencing `children`), `SysGroupDetailResponse`.

#### Scenario: Tree response type supports nesting

- **WHEN** the tree API response is consumed
- **THEN** `SysGroupListResponse.children` is typed as `SysGroupListResponse[]`, allowing arbitrary nesting depth

### Requirement: Group management page

The system SHALL provide a group management page at `src/pages/system/group/GroupManagement.tsx` with TreeTable for hierarchical listing, FormModal for create/edit, and columns definition.

#### Scenario: View group tree

- **WHEN** user navigates to the group management page
- **THEN** the page displays a tree table with expandable rows and columns: name, sortOrder, parentName, gmtCreate, and actions (add child, edit, delete)

#### Scenario: Create new group

- **WHEN** user clicks "Create" button and fills in the form (name, parent group, sortOrder) then submits
- **THEN** the system calls `groupApi.create()`, refreshes the table, and shows a success notification

#### Scenario: Edit existing group

- **WHEN** user clicks "Edit" on a group row, modifies fields, and submits
- **THEN** the system calls `groupApi.update()`, refreshes the table, and shows a success notification

#### Scenario: Delete groups

- **WHEN** user selects one or more groups and clicks "Delete"
- **THEN** the system calls `groupApi.remove()` with the selected IDs, refreshes the table, and shows a success notification

### Requirement: Group form with parent selector

The group create/edit form SHALL include a parent group selector (tree dropdown) for the `pid` field, allowing users to place the group within the organizational hierarchy.

#### Scenario: Select parent group in form

- **WHEN** user opens the group form in edit mode
- **THEN** the form displays a tree-select dropdown for parent group, populated from `groupApi.getTree()`, with the current node and its descendants excluded from options to prevent circular references

### Requirement: Group mock data

The system SHALL provide mock data in `mock/group.ts` registered in `mock/index.ts` that returns realistic hierarchical group data for all 6 Group endpoints.

#### Scenario: Mock dev mode works

- **WHEN** `pnpm dev` is run (mock mode) and user navigates to group management
- **THEN** the page loads without errors, displays mock group data, and supports create/edit/delete operations via mock responses

### Requirement: Route and navigation registration

The group management page SHALL be accessible via route `system/group` under both platform and tenant admin contexts, with corresponding breadcrumb configuration.

#### Scenario: Platform admin accesses group page

- **WHEN** platform admin navigates to `/platform/system/group`
- **THEN** the group management page loads with the correct breadcrumb trail

#### Scenario: Route config includes group

- **WHEN** the app loads routes
- **THEN** `sharedRoutes` in `App.tsx` includes `{ path: 'system/group', element: GroupManagement, allowedRoles: ['platform_admin'] }` and `config.ts` includes matching breadcrumb entries
