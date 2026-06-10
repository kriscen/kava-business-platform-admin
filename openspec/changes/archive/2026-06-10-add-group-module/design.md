## Context

UPMS 后端已提供完整的分组 (Group) REST API（`/api/v1/sys/group/`），包括分页查询、CRUD、树形结构接口。Group 代表租户内部的组织结构（部门树），字段包括 `id`、`name`、`pid`、`sortOrder`、`parentName`、`children`、`gmtCreate`。

前端现有 14 个系统管理页面均遵循统一模式：`DataTable` + `FormModal` + `columns.tsx` + `*-form.tsx`。其中 Area 模块同样有树形接口，可作为树形展示的参考。

当前缺少：API 模块、类型定义、页面组件、Mock 数据、路由注册。

## Goals / Non-Goals

**Goals:**

- 完整对接后端 Group API 的 6 个端点（page、getById、create、update、delete、tree）
- 提供分组管理页面，支持列表视图和树形视图
- 提供完整的 Mock 数据，确保 `pnpm dev` 模式下可用

**Non-Goals:**

- 不在本 change 中改造用户表单的 groupId 下拉选择器（后续可增强）
- 不在本 change 中改造角色 dsScope 的分组选择（后续可增强）
- 不对接分组管理以外的任何新业务模块

## Decisions

### 1. API 模块结构遵循现有模式

新建 `src/api/modules/group.ts`，使用 `request` 实例，导出 `groupApi` 对象。无需在 `src/api/index.ts` 额外注册（各页面直接 import 模块文件）。

### 2. 类型定义参照 Area 模块的树形模式

新建 `src/types/group.ts`，定义 `SysGroupRequest`、`SysGroupListResponse`（含 `children` 自引用）、`SysGroupDetailResponse`、`SysGroupQuery`。在 `src/types/index.ts` 中 re-export。

### 3. 页面布局：表格为主，支持树形切换

参照 Area 管理页的交互模式。默认展示分页列表视图（DataTable），可切换为树形视图。FormModal 处理创建/编辑，表单含 pid 分组选择（树形下拉）。

### 4. Mock 数据参照后端文档字段

`mock/group.ts` 生成包含层级关系的分组数据（如总部→技术部、市场部），在 `mock/index.ts` 中注册。

### 5. 路由注册

- `src/App.tsx`：添加 lazy import + sharedRoutes 条目，仅 `platform_admin` 可见
- `src/routes/config.ts`：添加面包屑配置（platform + tenant 两套）

## Risks / Trade-offs

- [Group 树形数据可能较深] → 前端表格使用 `expandable` 行展开，不一次渲染整棵树，保持性能
- [pid 选择需要树形下拉] → 可复用 Area 页面的树形选择组件模式，如已有 TreeSelect 组件则直接使用
