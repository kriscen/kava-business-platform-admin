## Why

UPMS 后端已提供完整的分组 (Group) CRUD + 树形接口，但前端尚未对接。Group 是租户内部的组织结构（如部门树），用于用户归属和数据权限范围（角色的 dsType/dsScope）。缺少 Group 模块意味着用户表单中的 `groupId` 字段无法通过下拉选择填充，角色的自定义数据权限范围也无法选择分组节点。

## What Changes

- 新增 `src/api/modules/group.ts`：对接后端 Group REST API（CRUD + tree）
- 新增 `src/pages/system/group/`：分组管理页面（DataTable + FormModal + 树形展示）
- 新增 `mock/group.ts`：Mock 数据支撑本地开发
- 注册新路由到侧边栏菜单和路由配置

## Capabilities

### New Capabilities

- `group-management`: 分组管理模块 — 包含分组 CRUD API 对接、管理页面（支持树形展示）、Mock 数据

### Modified Capabilities

<!-- 无需修改现有 spec 的行为要求 -->

## Impact

- **API 层**：新增 `src/api/modules/group.ts`，需在 `src/api/index.ts` 中注册
- **Mock 层**：新增 `mock/group.ts`，需在 `mock/index.ts` 中注册
- **路由**：在系统管理路由中新增 group 路由
- **菜单**：后端菜单树中需要配置 group 菜单项（或通过 seed/mock 数据）
- **依赖**：复用现有 `DataTable`、`FormModal`、`useDataTable` 等组件模式
