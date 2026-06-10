# 组件

公共组件库，供各页面复用。

## Layout 壳组件 (`src/components/layout/`)

| 组件        | 说明                                                   |
| ----------- | ------------------------------------------------------ |
| AdminLayout | 管理后台整体布局（Sidebar + Header + Content）         |
| Header      | 顶部栏，显示用户信息、语言切换、登出按钮               |
| Sidebar     | 侧边导航菜单，按角色渲染不同菜单项，支持折叠/展开      |
| Content     | 内容区域，`<Outlet>` 外包裹 ErrorBoundary 实现崩溃隔离 |

## UI 原语 (`src/components/ui/`)

shadcn/ui 基础组件集合（Button、Input、Dialog、Table 等），通过 `@/components/ui/` 引用。

## 业务通用组件 (`src/components/`)

### DataTable

- **文件**: `src/components/data-table.tsx`
- **用途**: 通用数据表格组件，封装 @tanstack/react-table
- **特性**: 服务端分页、列定义、行选择、排序
- **使用场景**: 所有列表页（用户、角色、部门、租户等）

### TreeTable

- **文件**: `src/components/tree-table.tsx`
- **用途**: 通用树形数据表格组件，支持递归渲染带 `children` 的树形数据
- **特性**: 复用 `DataTableColumn<T>` 列定义、展开/折叠行、可选 `onLoadChildren` 懒加载回调、操作列插槽
- **使用场景**: 菜单管理、区域管理等树形结构数据页面

### FormModal

- **文件**: `src/components/form-modal.tsx`
- **用途**: 通用表单弹窗组件
- **特性**: 新建/编辑模式切换、loading 状态管理、表单验证集成
- **使用场景**: 所有 CRUD 弹窗表单

### ConfirmDialog

- **文件**: `src/components/confirm-dialog.tsx`
- **用途**: 通用确认对话框
- **特性**: 异步 onConfirm 回调、自动错误处理、loading 状态
- **使用场景**: 删除确认、启停操作等需二次确认的场景

### TreeSelect

- **文件**: `src/components/tree-select.tsx`
- **用途**: 层级树形数据单选组件
- **Props**:
  - `data` (`TreeNode[]`) — 树形数据源
  - `value` (`number | null`) — 当前选中值
  - `onChange` (`(id: number | null) => void`) — 选中回调
  - `placeholder` (`string`) — 占位文本，默认 `'请选择'`
  - `labelField` (`string`) — 显示字段名，默认 `'name'`
  - `valueField` (`string`) — 值字段名，默认 `'id'`
  - `childrenField` (`string`) — 子节点字段名，默认 `'children'`
  - `disabled` (`boolean`) — 是否禁用
- **特性**: 可配置字段映射、清除选择、点击外部关闭、缩进层级显示
- **使用场景**: 分组表单（上级分组选择）、用户表单（分组选择），未来可用于菜单/区域等层级数据

### DatePicker

- **文件**: `src/components/date-picker.tsx`
- **用途**: 日期时间选择组件，包装原生 `<input type="datetime-local">`
- **Props**:
  - `value` (`string`) — 当前日期时间值
  - `onChange` (`(value: string) => void`) — 值变更回调
  - `placeholder` (`string`) — 占位文本
  - `disabled` (`boolean`) — 是否禁用
- **特性**: 与 shadcn/ui Input 一致的样式、`[color-scheme:light_dark]` 适配暗色模式
- **使用场景**: 租户表单（有效期起止时间），未来可用于所有日期时间字段

## ErrorBoundary (`src/components/ErrorBoundary/`)

嵌套式错误边界，实现崩溃隔离：

- **App 根级**: `App.tsx` 顶层 ErrorBoundary 捕获全局未处理的渲染错误
- **页面内容级**: `Content.tsx` 中 `<Outlet>` 被 ErrorBoundary 包裹，页面级渲染崩溃只影响内容区域，Header 和 Sidebar 保持可用
