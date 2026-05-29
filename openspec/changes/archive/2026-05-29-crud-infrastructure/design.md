## Context

项目是一个基于 React 19 + TypeScript + Vite + Tailwind CSS 4 + shadcn/ui (base-nova) 的双角色管理后台。当前只有 5 个 shadcn 基础组件，缺少表格、表单、弹窗等 CRUD 页面必需的 UI 组件。有 14 个 UPMS 资源需要 CRUD 页面，5 个 API 模块已实现但 0 个页面实际调用过 API。

## Goals / Non-Goals

**Goals:**

- 安装 shadcn UI 基础组件集，补齐 CRUD 页面所需的 UI 原语
- 封装 DataTable 通用组件，支持服务端分页、列定义、加载态、搜索/工具栏插槽
- 封装 FormModal 通用组件，支持新建/编辑切换、表单校验、loading 状态
- 用 User Management 页面验证组件可用性

**Non-Goals:**

- 不封装 TreePanel（后续 change 处理）
- 不实现所有 14 个 CRUD 页面（只做 User Management 验证）
- 不做动态菜单渲染（已有 role-based-menu capability）
- 不做国际化文案补充

## Decisions

### 1. 表格方案：@tanstack/react-table + shadcn Table

**选择**: 使用 @tanstack/react-table 作为无头表格引擎，shadcn Table 作为样式层。

**理由**:

- @tanstack/react-table 是 React 生态事实标准，提供排序、筛选、分页、列定义等核心逻辑
- shadcn Table 提供开箱即用的样式，与项目 base-nova 风格一致
- 服务端分页通过 manualPagination 模式实现，fetchData 由页面传入

**替代方案**:

- 直接用 shadcn Table 手写分页逻辑 → 重复造轮子，每个页面都要写一遍
- 使用 Ant Design Table → 与 shadcn 生态不兼容，样式冲突

### 2. 表单方案：react-hook-form + zod + shadcn Form

**选择**: 使用 react-hook-form 管理表单状态，zod 做校验，shadcn Form 做胶水。

**理由**:

- react-hook-form 性能优秀（非受控模式），与 shadcn Form 组件官方集成
- zod 是 TypeScript 优先的校验库，schema 可复用为类型定义
- shadcn Form 组件封装了 react-hook-form 的 Controller + Label + ErrorMessage

**替代方案**:

- 手写 useState 管理表单 → 校验逻辑重复，字段多时维护困难
- Formik → 社区活跃度下降，性能不如 react-hook-form

### 3. 组件封装策略：薄胶水层

**选择**: DataTable 和 FormModal 只做薄封装，不抽象过度。

**理由**:

- shadcn 组件已经提供了良好的基础，不需要再包一层
- @tanstack/react-table 的 columnDef 直接暴露给页面定义，不额外抽象
- 表单字段完全由 children 传入，FormModal 不关心具体字段

**原则**:

- DataTable 只管：分页状态、加载态、空态、布局（搜索栏 + 表格 + 分页）
- FormModal 只管：弹窗开关、标题切换、loading、取消/确认按钮

### 4. 目录结构

```
src/components/
├── ui/                    ← shadcn CLI 生成的原始组件
├── data-table.tsx         ← 通用 DataTable
└── form-modal.tsx         ← 通用 FormModal

src/pages/platform/users/
├── index.tsx              ← 页面入口
├── columns.tsx            ← 列定义
└── user-form.tsx          ← 表单内容
```

每个 CRUD 页面将列定义和表单内容分离出来，页面本身只做组装。

## Risks / Trade-offs

**[风险] shadcn base-nova 组件兼容性**
shadcn v4 base-nova 风格使用 @base-ui/react 而非 Radix UI，部分组件可能行为与预期不同。
→ 缓解：安装后逐一验证组件功能，遇到问题查看 base-ui 文档或替换为 Radix 版本。

**[风险] @tanstack/react-table 学习成本**
团队成员可能不熟悉 tanstack 的 columnDef API。
→ 缓解：DataTable 封装简化使用方式，提供示例列定义，文档化常见用法。

**[权衡] 组件通用性 vs 灵活性**
过度通用会导致 API 复杂，过度定制会导致复用率低。
→ 决策：先做 2-3 个页面验证，根据实际重复模式调整组件设计。
