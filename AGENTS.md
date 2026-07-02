# AGENTS.md

This file provides guidance to Codex when working with code in this repository.

## Repository Guardrails

- 不可以修改工作目录外的文件。
- `AGENTS.md` and `.agents/` are the Codex-facing configuration.
- `.claude/` and `CLAUDE.md` are legacy Claude Code configuration kept for reference only; do not update them unless the user explicitly asks.
- Claude Code `settings.json` hooks/permissions do not run in Codex. Follow the equivalent rules in this file and `.agents/rules/`.

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

Codex skills live under `.agents/skills/`. The old `/opsx:*` phrases are still accepted as user-facing aliases, but Codex should invoke the matching skill by intent/name.

| Codex skill / legacy alias                  | 说明                                        |
| ------------------------------------------- | ------------------------------------------- |
| `openspec-propose` (`/opsx:propose`)        | 创建新 change，生成全部 artifacts           |
| `openspec-new-change` (`/opsx:new`)         | 逐步创建 change artifacts                   |
| `openspec-apply-change` (`/opsx:apply`)     | 实现 change 中的 tasks                      |
| `openspec-verify-change` (`/opsx:verify`)   | 验证实现是否符合 change                     |
| `openspec-archive-change` (`/opsx:archive`) | 归档已完成的 change，并评估 specs/docs 同步 |
| `update-docs-map` (`/update-docs-map`)      | 同步 `docs/00-project-map.md`               |

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

## Project Rules

Always follow these project rules:

- Documentation: use `docs/00-project-map.md` as the docs entry point; when files under `docs/` are added, removed, or renamed, run the `update-docs-map` skill.
- Mock-first: core frontend flows must work under `pnpm dev` with mock data and no backend dependency.
- i18n: all user-visible strings must use i18n translation keys instead of hardcoded JSX or logic strings.

Codex rule files:

@.agents/rules/project-docs.md

<!-- KAVA-PROJECT-RULES: do NOT remove next line on /init -->

@.agents/rules/mock-first.md

<!-- KAVA-PROJECT-RULES: do NOT remove next line on /init -->

@.agents/rules/i18n.md

## Docs Structure

```
docs/
├── 00-project-map.md        # 文档目录索引
├── 01-architecture/
│   ├── overview.md          # 项目架构、技术栈、三种环境
│   └── boundaries.md        # 模块边界 (API层、状态层、布局层)
├── 02-conventions/
│   ├── code-style.md        # 代码风格、组件规范
│   ├── git.md              # Git 提交规范
│   └── mock-first.md       # Mock-first 前端开发规范
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
