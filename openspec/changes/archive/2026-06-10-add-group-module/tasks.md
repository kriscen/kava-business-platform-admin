## 1. Types & API

- [x] 1.1 Create `src/types/group.ts` with SysGroupQuery, SysGroupRequest, SysGroupListResponse (with children), SysGroupDetailResponse; re-export from `src/types/index.ts`
- [x] 1.2 Create `src/api/modules/group.ts` with groupApi (getPage, getById, create, update, remove, getTree) following existing module pattern

## 2. Mock Data

- [x] 2.1 Create `mock/group.ts` with mock data for all 6 Group endpoints (page, getById, create, update, delete, tree) using realistic hierarchical data
- [x] 2.2 Register group mocks in `mock/index.ts`

## 3. Page Components

- [x] 3.1 Create `src/pages/system/group/columns.tsx` with table column definitions (name, sortOrder, parentName, gmtCreate, actions)
- [x] 3.2 Create `src/pages/system/group/group-form.tsx` with FormModal form (name, pid tree-select, sortOrder)
- [x] 3.3 Create `src/pages/system/group/GroupManagement.tsx` using DataTable + FormModal + useDataTable pattern

## 4. i18n

- [x] 4.1 Add group translation keys to `src/i18n/locales/zh-CN/` (common module or new group.json)

## 5. Routing & Navigation

- [x] 5.1 Add lazy import and sharedRoutes entry in `src/App.tsx` for system/group path
- [x] 5.2 Add breadcrumb config entries in `src/routes/config.ts` for platform and tenant contexts

## 6. Verification

- [x] 6.1 Run `pnpm dev` and verify group management page loads, displays mock data, and CRUD operations work
- [x] 6.2 Run `pnpm type-check` and `pnpm lint` to ensure no type or lint errors
