# 应用壳

前端应用壳由 `src/App.tsx`、`src/layouts/MainLayout.tsx`、`src/components/layout/` 和全局错误/通知组件组成，负责把同一组业务页面挂载到 `/platform/*` 与 `/tenant/*` 两套角色入口下。

## 路由入口

| 入口                  | 说明                                    |
| --------------------- | --------------------------------------- |
| `/platform/login`     | 平台管理员登录页                        |
| `/tenant/login`       | 租户管理员登录页                        |
| `/oauth/callback`     | OAuth2 Authorization Code + PKCE 回调页 |
| `/platform/dashboard` | 平台管理员默认首页                      |
| `/tenant/dashboard`   | 租户管理员默认首页                      |

## 布局与守卫

- `RoleRoute` 校验登录状态和角色，不符合时跳转到对应登录页或 dashboard。
- `LoginRoute` 避免已登录用户重复进入登录页。
- `MainLayout` 提供侧边栏、顶部栏和内容区，业务页面通过 `<Outlet />` 渲染。
- `Content` 外层使用 ErrorBoundary，页面级渲染异常不会影响 Header 和 Sidebar。
- 根组件挂载 Sonner `<Toaster />`，HTTP 错误、业务错误和操作成功提示都通过 toast 展示。

## 代码分割

页面组件使用 `React.lazy()` 声明，路由渲染由 `<Suspense fallback={<Spinner />}>` 包裹。新增页面应保持页面级懒加载，不在 `App.tsx` 中静态 import 页面组件。
