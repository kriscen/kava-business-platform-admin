# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Tech Stack

React 19 + TypeScript, Vite 8, Tailwind CSS 4, shadcn/ui (base-ui/react), Zustand (state), Axios (HTTP), i18next (i18n), React Router DOM 7.

## Commands

```bash
pnpm dev          # Local dev with mock data (VITE_ENABLE_MOCK=true)
pnpm dev:staging  # Connect to staging server
pnpm dev:prod     # Simulate production
pnpm build        # Production build (tsc -b && vite build)
pnpm build:staging
pnpm lint         # ESLint check
pnpm lint:fix     # Auto-fix lint issues
pnpm format       # Prettier format
pnpm type-check   # TypeScript check without emit
```

## Architecture

详细架构说明见 [docs/01-architecture/overview.md](docs/01-architecture/overview.md)：

- 三种环境 (.env.\*)
- API 层 (Axios + 拦截器)
- 状态管理 (Zustand)
- 路由 (React Router v7)

## OpenSpec Workflow

Spec-driven development 工作流：

| 命令             | 说明                                 |
| ---------------- | ------------------------------------ |
| `/opsx:propose`  | 创建新 change，生成全部 artifacts    |
| `/opsx:new`      | 逐步创建 change artifacts            |
| `/opsx:continue` | 继续当前 change，创建下一个 artifact |
| `/opsx:apply`    | 实现 change 中的 tasks               |
| `/opsx:verify`   | 验证实现是否符合 change              |
| `/opsx:sync`     | 将 delta specs 同步到 main specs     |
| `/opsx:archive`  | 归档已完成的 change                  |

Artifact 规则 (见 `openspec/config.yaml`)：

- **Proposals**: Intent, Scope (含 Non-goals), Approach
- **Delta Specs**: `## ADDED/## MODIFIED/## REMOVED` + GIVEN/WHEN/THEN 场景
- **Design**: 文件变更、依赖、API 契约
- **Tasks**: 最大 2 小时块，层级编号，可验证

## Code Conventions

详细规范见 [docs/02-conventions/](docs/02-conventions/)：

- Conventional commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`
- 组件使用 shadcn/ui (检查 `src/components/ui/` 是否已存在)
- `@` 别名指向 `src/`
- 构建 chunks: `vendor` (react/dom), `utils` (axios/zustand)

## Docs Structure

```
docs/
├── 00-project-map.md        # 文档目录索引
├── 01-architecture/
│   ├── overview.md          # 项目架构、技术栈、三种环境
│   └── boundaries.md        # 模块边界 (API层、状态层、布局层)
├── 02-conventions/
│   ├── code-style.md        # 代码风格、组件规范
│   └── git.md              # Git 提交规范
├── 03-reference/
│   └── error-codes.md      # 错误码参考和错误处理流程
├── 04-frontend/
│   ├── auth-api.md          # Auth 前端对接 (OAuth2, JWT)
│   └── upms-api.md          # UPMS 前端对接 (用户/角色/菜单等)
├── 05-modules/
│   ├── overview.md          # 模块索引
│   ├── core/                # 核心模块
│   └── member/              # 会员模块
└── 06-product/
    └── README.md            # 产品设想与规划
```
