# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**kava-business-platform-admin** - 企业级后台管理平台前端项目，使用 Claude Code + Speckit + Trae 工作流开发。

## Tech Stack

- React 19 + TypeScript
- Vite 8 + Tailwind CSS 4
- shadcn/ui (base-ui/react primitives)
- Zustand (state management, persisted with localStorage)
- Axios (HTTP client with interceptors)
- i18next (internationalization, currently zh-CN)
- vite-plugin-mock (local mock data)

## Commands

```bash
pnpm dev              # 本地开发 (development 模式, 启用 Mock)
pnpm dev:staging      # 连接开发服务器
pnpm dev:prod         # 模拟生产环境
pnpm build            # 生产构建
pnpm build:staging    # staging 构建
pnpm lint             # ESLint 检查
pnpm lint:fix         # 自动修复 lint 问题
pnpm format           # Prettier 格式化
pnpm type-check       # TypeScript 类型检查
```

## Environment Configuration

| 文件 | 模式 | 用途 |
|------|------|------|
| `.env` | - | 公共变量 (VITE_APP_TITLE) |
| `.env.development` | development | 本地开发 (Mock 启用) |
| `.env.staging` | staging | 开发服务器 |
| `.env.production` | production | 生产环境 |

变量命名规范: `VITE_[分类]_[属性]` (如 `VITE_API_BASE_URL`, `VITE_ENABLE_MOCK`)

**注意**: 不要使用 `local` 作为模式名，Vite 8 禁止。

## Architecture

### Path Alias
- `@/` → `src/`

### Core Structure
```
src/
├── api/           # Axios 实例 + 拦截器
├── components/
│   ├── layout/    # AdminLayout, Sidebar, Header, Content
│   └── ui/        # shadcn/ui 组件
├── i18n/          # i18next 配置 + 语言包
├── stores/        # Zustand stores (useAppStore)
├── types/         # TypeScript 类型定义
└── utils/         # 工具函数 (errorHandler)
mock/              # vite-plugin-mock 模拟数据
```

### Key Patterns

**API 请求**: `src/api/request.ts` 导出 `request.get/post/put/delete`，返回类型 `ApiResponse<T>`

**状态管理**: Zustand store 使用 `devtools` + `persist` 中间件，自动持久化到 localStorage

**布局**: `AdminLayout` 组合 `Sidebar` + `Header` + `Content`，响应式自动折叠侧边栏 (<768px)

**Mock**: `VITE_ENABLE_MOCK=true` 时加载 `mock/` 目录下的模拟接口

## Speckit Workflow

规范驱动开发流程:

1. `/speckit.specify "<feature>"` - 创建功能规范
2. `/speckit.clarify` - 澄清需求
3. `/speckit.plan` - 生成技术方案
4. `/speckit.tasks` - 生成任务列表
5. `/speckit.implement` - 执行实现

## Available Skills

- `/simple` - 创意/架构工作前的头脑风暴
- `/frontend-design` - 创建高质量前端界面
- `/web-design-guidelines` - UI 代码审查 (可访问性/最佳实践)