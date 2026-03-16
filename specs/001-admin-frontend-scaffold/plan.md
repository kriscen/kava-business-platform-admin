# 实现计划：后台管理前端项目基础架构

**分支**：`001-admin-frontend-scaffold` | **日期**：2026-03-16 | **规范**：[spec.md](./spec.md)
**输入**：来自 `/specs/001-admin-frontend-scaffold/spec.md` 的功能规范

## 摘要

从零搭建后台管理前端项目脚手架，包含：项目初始化（Vite + React + TypeScript + ESLint/Prettier）、布局系统（侧边栏+顶栏+内容区）、HTTP 请求封装（Axios）、状态管理（Zustand）、国际化基础设施（react-i18next）、错误监控与日志、Mock 数据支持（Mock.js）。

## 技术上下文

**语言/版本**：TypeScript 5.x + Node.js 18+
**主要依赖**：React 18.x、Vite 5.x、Axios、Zustand、react-i18next、Mock.js、react-router-dom
**存储**：localStorage（状态持久化、语言偏好）
**测试**：Vitest + React Testing Library（待研究确认）
**目标平台**：现代浏览器（Chrome、Firefox、Safari、Edge 最新版本）
**项目类型**：Web 前端单页应用
**性能目标**：冷启动 < 3s、热更新 < 500ms、构建 < 30s
**约束**：gzip 后打包体积 < 500KB（不含第三方库）
**规模/范围**：后台管理系统基础架构，支持 7 个核心用户故事

## 宪章检查

*门控：在阶段 0 研究之前必须通过。在阶段 1 设计之后重新检查。*

| 原则 | 状态 | 说明 |
|------|------|------|
| 规范优先 | ✅ 通过 | 已有完整的 spec.md，用户故事清晰、验收场景明确 |
| 增量交付 | ✅ 通过 | 用户故事已按 P1/P2/P3 优先级划分，可独立交付 |
| YAGNI 原则 | ✅ 通过 | 只实现明确需要的基础设施，不涉及业务功能 |

**门控结果**：✅ 通过，可进入阶段 0

## 初始化上下文

**当前目录状态**：
- 当前目录 `/Users/kriscen/krisWorkspace/myself/kava-business-platform-admin` 已是项目根目录
- 目录中已存在 `.git/`、`.claude/`、`.specify/`、`.agents/`、`.trae/`、`specs/` 等配置目录
- 项目尚未初始化：缺少 `package.json`、`src/`、`vite.config.ts` 等核心文件

**初始化方案**：
- 使用 `npm create vite@latest . -- --template react-ts` 在当前目录初始化项目
- 该命令会创建 Vite + React + TypeScript 的基础项目结构
- 初始化后会生成：`package.json`、`tsconfig.json`、`vite.config.ts`、`src/`、`index.html` 等文件

**注意事项**：
- 由于当前目录非空，初始化命令需要确认覆盖/合并现有文件
- 需保留现有的 `.git/`、`.claude/`、`.specify/`、`.agents/`、`.trae/`、`specs/`、`CLAUDE.md`、`.gitignore` 等配置文件

## 项目结构

### 文档（此功能）

```
specs/001-admin-frontend-scaffold/
├── spec.md              # 功能规范（已完成）
├── plan.md              # 此文件
├── research.md          # 阶段 0 输出（待生成）
├── data-model.md        # 阶段 1 输出（待生成）
├── quickstart.md        # 阶段 1 输出（待生成）
├── contracts/           # 阶段 1 输出（待生成）
└── tasks.md             # 阶段 2 输出（/speckit.tasks 命令）
```

### 源代码（仓库根目录）

```
src/
├── api/                 # HTTP 请求封装
│   ├── request.ts       # Axios 实例配置
│   ├── interceptors.ts  # 请求/响应拦截器
│   └── types.ts         # 请求相关类型定义
├── components/          # 公共组件
│   ├── layout/          # 布局组件
│   │   ├── AdminLayout.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── Content.tsx
│   └── ErrorBoundary/   # 错误边界组件
├── stores/              # Zustand 状态管理
│   ├── index.ts         # Store 导出
│   └── appStore.ts      # 应用状态
├── i18n/                # 国际化
│   ├── index.ts         # i18n 配置
│   └── locales/         # 语言包
│       └── zh-CN/        # 中文
├── mock/                 # Mock 数据
│   ├── index.ts         # Mock 入口
│   └── modules/         # Mock 模块
├── hooks/                # 自定义 Hooks
├── utils/                # 工具函数
├── types/                # 全局类型定义
├── styles/               # 全局样式
├── App.tsx               # 根组件
├── main.tsx              # 应用入口
└── vite-env.d.ts         # Vite 类型声明

public/                   # 静态资源

tests/                    # 测试文件
├── unit/                 # 单元测试
└── integration/          # 集成测试

配置文件（根目录）：
├── vite.config.ts        # Vite 配置
├── tsconfig.json         # TypeScript 配置
├── .eslintrc.cjs         # ESLint 配置
├── .prettierrc           # Prettier 配置
└── package.json          # 项目依赖
```

**结构决策**：选择 Web 应用前端结构。采用功能模块化组织，api/components/stores/i18n/mock 独立目录。

## 复杂性跟踪

*无宪章违规，无需填写*

| 违规 | 为什么需要 | 更简单的替代方案被拒绝的原因 |
|------|----------|---------------------------|
| - | - | - |