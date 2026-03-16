# 数据模型：后台管理前端项目基础架构

**功能分支**：`001-admin-frontend-scaffold`
**日期**：2026-03-16

## 概述

本文档定义后台管理前端项目基础架构中的核心实体及其关系。

---

## 实体定义

### 1. 请求配置 (RequestConfig)

HTTP 请求的全局配置。

| 字段 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| baseURL | string | 否 | '' | API 基础地址 |
| timeout | number | 否 | 10000 | 请求超时时间（毫秒） |
| headers | Record<string, string> | 否 | {} | 默认请求头 |
| withCredentials | boolean | 否 | false | 是否携带 Cookie |

```typescript
// types/api.ts
export interface RequestConfig {
  baseURL?: string
  timeout?: number
  headers?: Record<string, string>
  withCredentials?: boolean
}
```

---

### 2. 响应结构 (ApiResponse)

后端 API 统一响应格式。

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| code | number | 是 | 业务状态码，0 表示成功 |
| data | T | 否 | 响应数据 |
| message | string | 否 | 响应消息 |

```typescript
// types/api.ts
export interface ApiResponse<T = unknown> {
  code: number
  data?: T
  message?: string
}
```

---

### 3. 布局配置 (LayoutConfig)

布局组件的配置项。

| 字段 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| logo | ReactNode | 否 | - | Logo 元素 |
| title | string | 否 | 'Admin' | 标题 |
| menus | MenuItem[] | 否 | [] | 菜单项列表 |
| sidebarWidth | number | 否 | 200 | 侧边栏宽度（展开状态） |
| collapsedWidth | number | 否 | 80 | 侧边栏宽度（折叠状态） |

```typescript
// types/layout.ts
import { ReactNode } from 'react'

export interface MenuItem {
  key: string
  label: string
  icon?: ReactNode
  path?: string
  children?: MenuItem[]
}

export interface LayoutConfig {
  logo?: ReactNode
  title?: string
  menus?: MenuItem[]
  sidebarWidth?: number
  collapsedWidth?: number
}
```

---

### 4. 应用状态 (AppState)

全局应用级状态。

| 字段 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| sidebarCollapsed | boolean | 是 | false | 侧边栏折叠状态 |
| language | string | 是 | 'zh-CN' | 当前语言 |
| theme | 'light' \| 'dark' | 是 | 'light' | 主题模式 |

```typescript
// stores/appStore.ts
export interface AppState {
  sidebarCollapsed: boolean
  language: string
  theme: 'light' | 'dark'
}

export interface AppActions {
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  setLanguage: (lang: string) => void
  setTheme: (theme: 'light' | 'dark') => void
}

export type AppStore = AppState & AppActions
```

---

### 5. 错误信息 (ErrorInfo)

全局错误捕获的结构化信息。

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| type | ErrorType | 是 | 错误类型 |
| message | string | 是 | 错误消息 |
| stack | string | 否 | 错误堆栈 |
| timestamp | number | 是 | 发生时间戳 |
| componentStack | string | 否 | React 组件堆栈（ErrorBoundary） |

```typescript
// types/error.ts
export type ErrorType =
  | 'javascript'      // JavaScript 运行时错误
  | 'promise'         // 未捕获的 Promise rejection
  | 'render'          // React 渲染错误
  | 'network'         // 网络请求错误
  | 'business'        // 业务逻辑错误

export interface ErrorInfo {
  type: ErrorType
  message: string
  stack?: string
  timestamp: number
  componentStack?: string
}
```

---

### 6. 国际化配置 (I18nConfig)

| 字段 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| lng | string | 否 | 'zh-CN' | 默认语言 |
| fallbackLng | string | 否 | 'zh-CN' | 降级语言 |
| resources | Record<string, Translation> | 是 | - | 语言包资源 |

```typescript
// i18n/types.ts
export interface Translation {
  [key: string]: string | Translation
}

export interface I18nConfig {
  lng?: string
  fallbackLng?: string
  resources: Record<string, { translation: Translation }>
}
```

---

### 7. Mock 配置 (MockConfig)

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| url | string | 是 | 接口路径 |
| method | HttpMethod | 是 | HTTP 方法 |
| response | Function \| object | 是 | 响应数据或函数 |
| timeout | number | 否 | 模拟延迟（毫秒） |

```typescript
// mock/types.ts
export type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch'

export interface MockConfig {
  url: string
  method: HttpMethod
  response: (() => unknown) | unknown
  timeout?: number
}
```

---

## 实体关系图

```
┌─────────────────────────────────────────────────────────────┐
│                        AppState                              │
│  ┌─────────────────┐  ┌─────────────┐  ┌─────────────────┐  │
│  │ sidebarCollapsed│  │  language   │  │     theme       │  │
│  └─────────────────┘  └─────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      LayoutConfig                            │
│  ┌───────────┐  ┌─────────┐  ┌───────────┐  ┌────────────┐  │
│  │   logo    │  │  title  │  │   menus   │  │sidebarWidth│  │
│  └───────────┘  └─────────┘  └─────┬─────┘  └────────────┘  │
└─────────────────────────────────────────┼───────────────────┘
                                          │
                                          ▼
                                   ┌────────────┐
                                   │  MenuItem  │
                                   │────────────│
                                   │ key        │
                                   │ label      │
                                   │ icon       │
                                   │ path       │
                                   │ children[] │
                                   └────────────┘

┌─────────────────────────────────────────────────────────────┐
│                     RequestConfig                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                   │
│  │ baseURL  │  │ timeout  │  │ headers  │                   │
│  └──────────┘  └──────────┘  └──────────┘                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      ApiResponse<T>                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                   │
│  │   code   │  │   data   │  │ message  │                   │
│  └──────────┘  └──────────┘  └──────────┘                   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                       ErrorInfo                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────┐   │
│  │   type   │  │ message  │  │  stack   │  │ timestamp  │   │
│  └──────────┘  └──────────┘  └──────────┘  └────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 状态持久化策略

| 状态 | 持久化 | 存储位置 | 说明 |
|------|--------|---------|------|
| sidebarCollapsed | 是 | localStorage | 用户体验 |
| language | 是 | localStorage | 用户偏好 |
| theme | 是 | localStorage | 用户偏好 |

---

## 验证规则

### RequestConfig
- `timeout` 必须 > 0
- `baseURL` 如果提供必须是有效 URL

### MenuItem
- `key` 必填且唯一
- `label` 必填
- `path` 如果提供必须是有效路径

### AppState
- `language` 必须是已配置的语言之一

---

## 类型文件结构

```
src/types/
├── api.ts        # RequestConfig, ApiResponse
├── layout.ts     # LayoutConfig, MenuItem
├── error.ts      # ErrorInfo, ErrorType
└── index.ts      # 统一导出
```