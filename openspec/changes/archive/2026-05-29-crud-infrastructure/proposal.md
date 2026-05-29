## Why

项目有 14 个 UPMS 资源需要 CRUD 页面，5 个 API 模块已实现但 0 个页面实际调用过 API。缺少表格、表单、弹窗、分页等基础 UI 组件，无法开始页面开发。需要先搭建可复用的 CRUD 基础设施，为后续批量出页面做准备。

## What Changes

- 安装 @tanstack/react-table、react-hook-form、@hookform/resolvers、zod 依赖
- 用 shadcn CLI 添加 UI 基础组件（table、input、label、select、checkbox、dialog、pagination、skeleton、card、badge、form、textarea、switch、toast）
- 封装 DataTable 通用业务组件：组合 shadcn Table + @tanstack/react-table + Pagination，支持列定义、数据获取、分页、加载态、空态、搜索栏/工具栏插槽
- 封装 FormModal 通用业务组件：组合 shadcn Dialog + react-hook-form，支持新建/编辑标题切换、loading 状态、children 表单内容、校验触发
- 用 User Management 页面做第一个验证页面，确认组件可用

## Capabilities

### New Capabilities

- `data-table`: 通用分页表格组件，基于 @tanstack/react-table + shadcn Table，支持服务端分页、列定义、加载态、空态、搜索栏/工具栏插槽
- `form-modal`: 通用表单弹窗组件，基于 shadcn Dialog + react-hook-form，支持新建/编辑切换、loading、校验触发
- `crud-ui-primitives`: shadcn UI 基础组件集（table、input、dialog、form、pagination 等），通过 CLI 安装

### Modified Capabilities

（无需修改已有 capability 的需求）

## Impact

- 新增依赖：@tanstack/react-table、react-hook-form、@hookform/resolvers、zod
- 新增文件：src/components/data-table.tsx、src/components/form-modal.tsx
- 新增文件：shadcn CLI 生成的 UI 组件到 src/components/ui/
- 验证页面：src/pages/platform/UserManagement.tsx 从 stub 改为实际调用 userApi 的 CRUD 页面
