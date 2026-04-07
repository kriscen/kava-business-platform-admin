# 架构概览

Kava Admin 是一个基于 React 19 + TypeScript 的后台管理平台。

## 技术栈

| 类别     | 技术                         |
| -------- | ---------------------------- |
| 框架     | React 19 + TypeScript        |
| 构建     | Vite 8                       |
| 样式     | Tailwind CSS 4 + shadcn/ui   |
| 状态管理 | Zustand (persist + devtools) |
| HTTP     | Axios (拦截器模式)           |
| 路由     | React Router DOM 7           |
| 国际化   | i18next                      |

## 项目结构

```
src/
├── api/              # Axios 实例和拦截器
├── components/       # React 组件
│   ├── layout/      # 布局组件 (AdminLayout, Sidebar, Header, Content)
│   └── ui/           # shadcn/ui 基础组件
├── hooks/            # 自定义 React Hooks
├── i18n/             # 国际化配置和翻译文件
├── lib/              # 工具库 (utils.ts)
├── stores/           # Zustand 状态管理
├── styles/           # 全局样式
├── types/            # TypeScript 类型定义
└── utils/            # 工具函数 (errorHandler 等)
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

- **请求拦截器**：从 localStorage 读取 token，添加 `Authorization: Bearer {token}`
- **响应拦截器**：业务错误 (`code !== 0`) 和 HTTP 错误 (401/403/404/500/502/503) 统一处理

## 状态管理 (`src/stores/`)

Zustand store，使用 `persist` + `devtools` 中间件：

- `appStore`：侧边栏折叠状态、语言、主题
- 持久化到 localStorage (key: `app-storage`)

详见 [模块边界](./boundaries.md)

## 路由 (`src/App.tsx`)

React Router v7。路由包裹在 `AdminLayout` 中，包含 `ErrorBoundary` 错误边界。

## 构建产物

生产构建使用代码分割，输出 chunks：

- `vendor` - React/ReactDOM
- `utils` - Axios/Zustand

## 路径别名

`@` 指向 `src/` 目录
