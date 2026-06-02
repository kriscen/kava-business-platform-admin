# Hooks 与路由

## 路由结构

路由定义在 `src/App.tsx`，采用 React Router v7 双角色架构。

### 平台管理员路由 (`/platform/*`)

使用 `PlatformLayout`，需 `platform_admin` 角色：

| 路径                            | 组件                            | 说明         |
| ------------------------------- | ------------------------------- | ------------ |
| `/platform/login`               | `PlatformLoginPage`             | 登录页       |
| `/platform/dashboard`           | `PlatformDashboard`             | 仪表盘       |
| `/platform/system/users`        | `PlatformUserManagement`        | 用户管理     |
| `/platform/system/dept`         | `PlatformDeptManagement`        | 部门管理     |
| `/platform/system/tenant`       | `PlatformTenantManagement`      | 租户管理     |
| `/platform/system/public-param` | `PlatformPublicParamManagement` | 公共参数管理 |

### 租户管理员路由 (`/tenant/*`)

使用 `TenantLayout`，需 `tenant_admin` 角色：

| 路径                | 组件              | 说明     |
| ------------------- | ----------------- | -------- |
| `/tenant/login`     | `TenantLoginPage` | 登录页   |
| `/tenant/dashboard` | `TenantDashboard` | 仪表盘   |
| `/tenant/profile`   | `TenantProfile`   | 个人信息 |

### 公共路由

| 路径              | 组件                | 说明                               |
| ----------------- | ------------------- | ---------------------------------- |
| `/`               | `RootRedirect`      | 根据认证状态重定向到对应 dashboard |
| `/oauth/callback` | `OAuthCallbackPage` | OAuth 授权码回调页                 |
| `*`               | `NotFound`          | 404 页面                           |

### 路由守卫

- **`RoleRoute`**: 检查认证状态和角色，未认证重定向到登录页，角色不匹配重定向到对应 dashboard
- **`LoginRoute`**: 已登录用户访问登录页时重定向到对应 dashboard

### 代码分割

所有页面组件使用 `React.lazy()` 动态导入，配合 `<Suspense fallback={<Spinner />}>` 实现代码分割。生产构建输出页面级独立 chunk。
