## Why

15 个系统管理页面（User、Role、Menu、Area、Tenant 等）每个都重复约 150-200 行相同的 CRUD 样板代码：搜索状态、弹窗状态、数据版本刷新、fetchData 回调、增删改处理、列定义 memo 等。总计约 3000 行重复代码。新增一个管理页面需要复制粘贴再逐字段修改，维护成本高且容易出现不一致。

## What Changes

- 提取 `useCrudPage<T>` hook，封装 CRUD 管理页面的通用逻辑（搜索、分页、弹窗、增删改、刷新、批量操作）
- 提取 `CrudPageLayout` 组件，统一页头、DataTable、FormModal 的布局结构
- 重构全部 15 个 Management 页面使用新 hook 和组件，消除重复样板
- 保持每个页面的业务差异（列定义、搜索字段、表单组件、API 模块）不变

## Capabilities

### New Capabilities

- `crud-page-hook`: 通用 CRUD 页面 hook 和布局组件，封装管理页面的搜索、分页、弹窗、增删改、批量操作等通用逻辑

### Modified Capabilities

- `system-management-pages`: 所有 13 个管理模块页面重构为使用 `useCrudPage` hook，消除重复样板代码

## Impact

- **代码变更**: `src/hooks/useCrudPage.ts`（新增）、`src/components/crud-page-layout.tsx`（新增）、`src/pages/system/*/` 下 15 个 Management 组件重构
- **无 API 变更**: 不改变任何 API 调用或后端接口
- **无依赖变更**: 使用现有依赖（react-hook-form、zustand、@tanstack/react-table）
- **行为保持一致**: 搜索、分页、删除确认、toast 提示等行为不变
- **i18n 不变**: 翻译 key 和文件结构不变
