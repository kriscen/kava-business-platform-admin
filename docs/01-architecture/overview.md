# 架构概览

Kava Admin 是一个基于 React 19 + TypeScript 的后台管理平台。

## 技术栈

| 类别     | 技术                                 |
| -------- | ------------------------------------ |
| 框架     | React 19 + TypeScript                |
| 构建     | Vite 8                               |
| 样式     | Tailwind CSS 4 + shadcn/ui           |
| 表格     | @tanstack/react-table + shadcn Table |
| 表单     | react-hook-form + zod + shadcn Form  |
| 状态管理 | Zustand (persist + devtools)         |
| HTTP     | Axios (拦截器模式)                   |
| 路由     | React Router DOM 7                   |
| 国际化   | i18next                              |

## 项目结构

```
src/
├── api/              # Axios 实例和拦截器
│   ├── auth.ts       # OAuth2 token 端点（raw fetch）
│   └── modules/      # 按后端资源组织的 API 模块
│       ├── user.ts   # 用户 CRUD + 分页
│       ├── role.ts   # 角色 CRUD + 下拉
│       ├── menu.ts   # 菜单 CRUD + 树
│       ├── dept.ts   # 部门 CRUD + 树
│       └── tenant.ts # 租户 CRUD + 启停
├── components/       # React 组件
│   ├── layout/      # 布局组件 (Sidebar, Header, Content)
│   ├── ui/           # shadcn/ui 基础组件
│   ├── data-table.tsx  # 通用 DataTable（服务端分页、列定义、行选择）
│   └── form-modal.tsx  # 通用 FormModal（新建/编辑切换、loading）
├── layouts/          # 页面布局
│   ├── PlatformLayout.tsx  # 平台管理员后台布局
│   └── TenantLayout.tsx    # 租户管理员后台布局
├── hooks/            # 自定义 React Hooks
├── i18n/             # 国际化配置和翻译文件
├── lib/              # 工具库 (utils.ts)
├── pages/
│   ├── platform/     # 平台管理员页面 (/platform/*)
│   └── tenant/       # 租户管理员页面 (/tenant/*)
├── stores/           # Zustand 状态管理
├── styles/           # 全局样式
├── types/            # TypeScript 类型定义
│   ├── api.ts       # ApiResponse（对齐后端 JsonResult）
│   ├── common.ts    # PageQuery, PagingInfo<T> 等通用类型
│   ├── user.ts      # 用户实体类型
│   ├── role.ts      # 角色实体类型
│   ├── menu.ts      # 菜单实体类型
│   ├── dept.ts      # 部门实体类型
│   └── tenant.ts    # 租户实体类型
└── utils/            # 工具函数 (errorHandler 等)

mock/                 # vite-plugin-mock 数据（HTTP 拦截模式）
├── auth.ts           # 登录/登出/刷新 token
├── menu.ts           # 角色菜单
└── ...
```

## 三种环境

由 `.env.*` 文件和 Vite mode 控制：

| 环境          | Mock | API 地址                                 |
| ------------- | ---- | ---------------------------------------- |
| `development` | 启用 | 空 (使用本地 mock)                       |
| `staging`     | 禁用 | `https://dev-api.kava-admin.example.com` |
| `production`  | 禁用 | `https://api.kava-admin.example.com`     |

Mock 通过 `vite-plugin-mock` 启用，可在 `.env.*` 中设置 `VITE_ENABLE_MOCK=false` 禁用。

## API 层 (`src/api/`)

Axios 实例 (`request.ts`) 配置 baseURL 和 timeout，拦截器 (`interceptors.ts`) 处理：

- **请求拦截器**：从 authStore 读取 token，添加 `Authorization: Bearer {token}`
- **响应拦截器**：业务错误 (`code !== '0'`) 时展示 toast 通知并 reject；HTTP 错误 (401/403/404/500/502/503) 分类展示 toast 并 reject

API 调用按后端资源模块组织在 `src/api/modules/` 下，每个模块导出同名 API 对象（如 `userApi`、`roleApi`），提供标准 CRUD 方法。认证端点在 `src/api/auth.ts`，使用 raw fetch 避免拦截器循环。

## 状态管理 (`src/stores/`)

Zustand store，使用 `persist` + `devtools` 中间件：

- `appStore`：侧边栏折叠状态、语言、主题
- 持久化到 localStorage (key: `app-storage`)

详见 [模块边界](./boundaries.md)

## 路由 (`src/App.tsx`)

React Router v7。采用双路由架构，按角色隔离：

- `/platform/*` — 平台管理员后台，使用 `PlatformLayout`
- `/tenant/*` — 租户管理员后台，使用 `TenantLayout`
- 各自有独立的登录页（`/platform/login`、`/tenant/login`）
- 路由守卫检查用户角色，未认证用户重定向到对应登录页

详见 [模块边界](./boundaries.md)

## 构建产物

生产构建使用代码分割，输出 chunks：

- `vendor` - React/ReactDOM
- `utils` - Axios/Zustand

## 路径别名

`@` 指向 `src/` 目录
