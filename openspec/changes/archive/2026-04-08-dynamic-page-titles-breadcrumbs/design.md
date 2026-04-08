## Context

当前 `AdminLayout` 的 `Header` 和 `Content` 组件使用静态或 props 传入的标题和面包屑：

- Header 标题通过 `title` prop 传入，容易遗漏
- 面包屑固定显示"首页"
- 页面间导航时用户无法感知位置变化

现有 i18n 体系已使用 `menu.*` key 管理菜单标签。

## Goals / Non-Goals

**Goals:**

- 路由配置集中管理元数据（标题 key、面包屑层级）
- `usePageTitle()` 自动同步页面标题到 Header
- `useBreadcrumbs()` 根据路由自动生成面包屑路径
- 复用现有 i18n key，保持一致性

**Non-Goals:**

- 不实现动态路由参数（如 `/users/:id`）
- 不实现功能级权限控制
- 不修改现有页面组件结构

## Decisions

### 1. TypeScript 配置文件 vs 组件内定义

**选择：独立配置文件 `src/routes/config.ts`**

| 方案       | 优点                         | 缺点               |
| ---------- | ---------------------------- | ------------------ |
| 配置文件   | 集中管理、类型安全、易于维护 | 需要同步路由       |
| 组件内定义 | 内聚性强                     | 分散、难以全局查询 |

**理由**：配置与组件解耦，路由结构一目了然。

### 2. i18n key 命名空间

**选择：使用 `layout.*` namespace**

- `layout.dashboard` → 仪表盘标题
- `layout.system` → 系统管理标题
- `layout.userManagement` → 用户管理标题
- `layout.home` → 首页（面包屑起始项）

**理由**：`layout.json` 是页面级标题的自然位置，与页面布局组件对应。`menu.*` keys 存在于 menuStore 中用于菜单渲染，而 `layout.*` 用于页面标题和面包屑，职责分离更清晰。

### 3. Hook 实现方式

```typescript
// 基础版本：自动读取当前路由配置
usePageTitle() // 无参数，自动从 routeConfig 读取

// 覆盖版本：手动指定标题
usePageTitle('自定义标题')
```

**理由**：Hook 方式灵活，支持自动和手动场景。

## Risks / Trade-offs

| Risk                          | Mitigation                        |
| ----------------------------- | --------------------------------- |
| 路由配置与实际路由不同步      | Task 包含验证步骤                 |
| i18n key 不存在导致显示原 key | 先检查 key 存在性，缺失时显示路径 |
| 路由变更时忘记更新配置        | ESLint 规则（可选后续）           |

## Open Questions

1. 动态路由参数（`:id`）的标题覆盖方式？
2. 嵌套布局（如 Modal 内）如何处理面包屑？
3. 页面切换是否需要过渡动画？
