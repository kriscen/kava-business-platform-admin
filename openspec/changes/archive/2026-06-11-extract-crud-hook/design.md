## Context

当前 15 个系统管理页面中，12 个使用 DataTable 分页模式，3 个使用 TreeTable 树形模式。每个页面重复约 150-200 行样板代码，包括搜索状态管理、弹窗状态机、数据获取回调、增删改处理函数、列定义 memo 等。现有 DataTable 组件内部耦合了数据获取逻辑。

## Goals / Non-Goals

**Goals:**

- 提取 `useCrudPage` hook 封装分页 CRUD 页面的通用逻辑
- 提取 `useTreeCrudPage` hook 封装树形 CRUD 页面的通用逻辑
- 提取 `CrudPageLayout` 组件统一页面布局结构
- 重构全部 15 个 Management 页面使用新 hook，每页减少 60-70% 代码量
- 新增管理页面只需声明 API、列、搜索字段、表单组件

**Non-Goals:**

- 不重构 DataTable/TreeTable 组件本身（保持向后兼容）
- 不改变任何 API 接口或后端逻辑
- 不添加 URL 搜索同步功能（独立 change）
- 不添加路由级 ErrorBoundary（独立 change）
- 不改变 i18n 翻译结构

## Decisions

### Decision 1: 配置式 hook 而非组合式 hook

**选择**: 使用配置对象驱动的单一 hook，而非多个小 hook 的组合。

**理由**: 当前所有 CRUD 页面的差异是声明性的（哪个 API、哪些列、哪些搜索字段），而非行为性的。配置式 hook 让页面只需声明"我是谁"，不需要编排"怎么工作"。组合式 hook（如 `useModal` + `usePagination` + `useSearch`）会让每个页面仍然需要手动连接这些 hook，样板代码减少有限。

**替代方案**: 组合式 hook — 更灵活但对当前场景过度设计，因为页面间的行为差异为零。

### Decision 2: Hook 接受 searchParams 而非管理搜索状态

**选择**: Hook 接受 `searchParams` 对象作为输入，搜索字段的 UI 和状态仍由页面管理。

**理由**: 每个页面的搜索字段不同（有的是 Input，有的是 Select，有的是 DatePicker），字段类型和数量都是页面特有的。Hook 只需要接收最终的搜索参数对象来驱动 fetchData。

```
Page manages:  searchName, searchPhone, searchLockFlag (state + UI)
Hook receives: searchParams = { username, phone, lockFlag } (derived object)
Hook manages:  searchParams 变化 → 重新 fetch 的逻辑
```

### Decision 3: Hook 内部处理数据获取，不依赖 DataTable 内部 fetch

**选择**: Hook 内部管理 `fetchData` 回调和 `refreshKey`，通过 `tableProps` 传递给 DataTable。DataTable 内部调用 `fetchData` 获取数据，`refreshKey` 变化时触发重新获取。

**理由**: 当前 DataTable 已有 `fetchData` 接口，Hook 通过 `useCallback` 包装 API 调用并合并 searchParams，searchParams 变化时 `fetchData` 引用更新自动触发 DataTable 重新获取。`refreshKey` 用于显式刷新（增删改后）。这比直接注入 data/total/loading 更简洁，复用了 DataTable 已有的 fetch 基础设施。

### Decision 4: CrudPageLayout 组件封装布局

**选择**: 提取一个 `CrudPageLayout` 组件封装页头 + 搜索栏 + 工具栏 + DataTable + FormModal 的布局。

**理由**: 每个页面的 JSX 结构完全相同 — 页头（title + description）、搜索栏、工具栏、表格、弹窗。CrudPageLayout 让页面只需传入配置，不需要手写布局。

### Decision 5: 树形页面使用独立的 useTreeCrudPage hook

**选择**: 为 Menu/Area/Group 三个 TreeTable 页面提供独立的 `useTreeCrudPage` hook。

**理由**: 树形页面的数据获取模式（一次性获取 tree 而非分页）、搜索模式（前端过滤而非后端查询）与分页页面不同。共用一个 hook 会导致大量条件分支，不如分离。两个 hook 共享弹窗状态管理的内部实现。

## Risks / Trade-offs

**[Risk] DataTable 行为变化** → Hook 通过 tableProps 传递 fetchData + refreshKey，复用 DataTable 内部 fetch 机制。现有 DataTable 的 fetchData 模式不变，其他使用场景不受影响。

**[Risk] 页面重构引入回归** → 逐页面重构，每个页面重构后立即验证 mock 模式下的 CRUD 流程。不一次性重构所有页面。

**[Risk] 类型擦除** → 泛型 hook 在 TypeScript 中的类型推导可能丢失。通过显式泛型参数和 DataTableColumn 类型约束解决。

**[Trade-off] 搜索状态不同步 URL** → 当前 change 不包含 URL 搜索同步，搜索状态仍然是页面刷新丢失的。这是有意的 non-goal，后续独立 change 处理。
