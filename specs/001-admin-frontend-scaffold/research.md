# 研究文档：后台管理前端项目基础架构

**功能分支**：`001-admin-frontend-scaffold`
**日期**：2026-03-16

## 研究概述

本文档记录技术决策过程，解决规范中的技术选型和最佳实践问题。

---

## 1. 测试框架选型

### 决策
选择 **Vitest + React Testing Library**

### 理由
- **Vitest 原生支持 Vite**：与项目构建工具 Vite 无缝集成，共享配置，无需额外配置
- **Jest 兼容 API**：与 Jest API 兼容，迁移成本低
- **速度优势**：ESM 原生支持，冷启动和热更新速度快
- **React Testing Library**：React 官方推荐的测试库，专注用户行为测试

### 考虑的替代方案
- **Jest**：需要额外配置支持 Vite/ESM，配置复杂度高
- **Playwright**：更适合 E2E 测试，单元测试场景较重

---

## 2. Vite + React + TypeScript 项目初始化最佳实践

### 决策
使用 `create-vite` 脚手架 + 手动配置增强

### 项目配置要点

```typescript
// vite.config.ts 核心配置
{
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 3000,
    open: true,
    proxy: {} // 预留后端代理配置
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['axios', 'zustand']
        }
      }
    }
  }
}
```

### ESLint + Prettier 配置
- 使用 `eslint-config-prettier` 避免 ESLint 和 Prettier 冲突
- 配置 `@typescript-eslint` 提供 TypeScript 支持
- 使用 `eslint-plugin-react-hooks` 检查 Hooks 规则

### 理由
- `create-vite` 提供最小化配置起点，避免过度封装
- 手动配置增强保持配置透明可控
- 符合 YAGNI 原则，只配置当前需要的功能

---

## 3. Zustand 状态管理最佳实践

### 决策
使用 Zustand 作为全局状态管理方案

### 实现模式

```typescript
// stores/appStore.ts
import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'

interface AppState {
  sidebarCollapsed: boolean
  language: string
  toggleSidebar: () => void
  setLanguage: (lang: string) => void
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        sidebarCollapsed: false,
        language: 'zh-CN',
        toggleSidebar: () => set((state) => ({
          sidebarCollapsed: !state.sidebarCollapsed
        })),
        setLanguage: (lang) => set({ language: lang })
      }),
      { name: 'app-storage' }
    ),
    { name: 'AppStore' }
  )
)
```

### 理由
- **轻量级**：仅 ~1KB gzip，符合体积约束
- **简单 API**：无样板代码，学习成本低
- **内置中间件**：persist（持久化）、devtools（调试）开箱即用
- **TypeScript 友好**：类型推断完善

### 考虑的替代方案
- **Redux Toolkit**：功能完善但体积较大，对小型项目过度设计
- **MobX**：响应式模式学习成本较高

---

## 4. Mock.js 与 Vite 集成模式

### 决策
使用 `vite-plugin-mock` + Mock.js

### 实现模式

```typescript
// vite.config.ts
import { viteMockServe } from 'vite-plugin-mock'

export default defineConfig({
  plugins: [
    viteMockServe({
      mockPath: 'mock',
      enable: process.env.NODE_ENV === 'development'
    })
  ]
})

// mock/user.ts
export default [
  {
    url: '/api/user/info',
    method: 'get',
    response: () => ({
      code: 0,
      data: { id: 1, name: 'Admin' }
    })
  }
]
```

### 理由
- `vite-plugin-mock` 专为 Vite 设计，支持 HMR
- 支持 TypeScript 类型
- 环境切换简单（开发环境启用，生产环境禁用）

---

## 5. React Error Boundary 实现模式

### 决策
实现通用 ErrorBoundary 组件 + 全局错误处理

### 实现模式

```typescript
// components/ErrorBoundary/index.tsx
import { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 输出到控制台，预留监控服务接口
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <div>Something went wrong.</div>
    }
    return this.props.children
  }
}
```

### 全局错误处理
- `window.onerror`：捕获 JavaScript 运行时错误
- `window.onunhandledrejection`：捕获未处理的 Promise rejection

---

## 6. react-i18next 国际化配置

### 决策
使用 react-i18next 作为国际化方案

### 实现模式

```typescript
// i18n/index.ts
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import zhCN from './locales/zh-CN'

i18n.use(initReactI18next).init({
  resources: {
    'zh-CN': { translation: zhCN }
  },
  lng: 'zh-CN',
  fallbackLng: 'zh-CN',
  interpolation: {
    escapeValue: false
  }
})

export default i18n
```

### 理由
- React 官方推荐
- 支持动态加载语言包（按需）
- Hooks API（useTranslation）简洁
- 社区成熟，文档完善

---

## 7. Axios 请求封装模式

### 决策
创建统一的 Axios 实例 + 拦截器

### 实现模式

```typescript
// api/request.ts
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 添加 Token（预留钩子）
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    const { data } = response
    // 业务错误处理
    if (data.code !== 0) {
      // 统一错误提示
      return Promise.reject(data)
    }
    return data
  },
  (error) => {
    // HTTP 错误分类处理
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 预留登录跳转钩子
          console.error('Unauthorized')
          break
        case 403:
          console.error('Forbidden')
          break
        default:
          console.error('Server Error')
      }
    } else if (error.request) {
      // 网络错误
      console.error('Network Error')
    }
    return Promise.reject(error)
  }
)

export const request = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    instance.get<T>(url, config),
  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    instance.post<T>(url, data, config),
  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    instance.put<T>(url, data, config),
  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    instance.delete<T>(url, config)
}
```

---

## 8. 布局系统实现方案

### 决策
使用 Ant Design Layout 组件 + 自定义样式

### 理由
- Ant Design 是成熟的 React UI 库，提供完整的后台管理布局组件
- 响应式设计内置支持
- 社区活跃，文档完善

### 布局结构
```
┌────────────────────────────────────────────┐
│                  Header                     │
├──────────┬─────────────────────────────────┤
│          │                                 │
│ Sidebar  │           Content                │
│          │                                 │
│          │                                 │
└──────────┴─────────────────────────────────┘
```

### 考虑的替代方案
- **自定义 CSS 布局**：开发成本高，需要处理大量边界情况
- **Tailwind CSS**：需要额外学习成本，本项目暂不引入

---

## 技术栈总结

| 类别 | 技术选型 | 版本 |
|------|---------|------|
| 构建工具 | Vite | 5.x |
| 前端框架 | React | 18.x |
| 语言 | TypeScript | 5.x |
| UI 库 | Ant Design | 5.x |
| 路由 | react-router-dom | 6.x |
| HTTP 客户端 | Axios | 1.x |
| 状态管理 | Zustand | 4.x |
| 国际化 | react-i18next | 14.x |
| Mock | vite-plugin-mock + Mock.js | - |
| 测试 | Vitest + React Testing Library | - |
| 代码规范 | ESLint + Prettier | - |

---

## 风险与缓解

| 风险 | 影响 | 缓解措施 |
|------|------|---------|
| Ant Design 体积较大 | 打包体积超限 | 使用按需导入、Tree Shaking |
| Zustand 版本更新 | API 变更 | 锁定版本号，关注 Changelog |
| Mock 数据与真实 API 不一致 | 开发调试困难 | 保持 Mock 数据结构与真实 API 一致 |

---

## 下一步

- [ ] 阶段 1：生成 data-model.md
- [ ] 阶段 1：生成 contracts/
- [ ] 阶段 1：生成 quickstart.md