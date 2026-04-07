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

Mock is enabled via `vite-plugin-mock`. Disable by setting `VITE_ENABLE_MOCK=false` in `.env.*`.

## Architecture

**Three environments** controlled by `.env.*` files and Vite mode:
- `development` — mock data enabled, empty `VITE_API_BASE_URL`
- `staging` — real API at `https://dev-api.kava-admin.example.com`
- `production` — real API at `https://api.kava-admin.example.com`

**API layer** (`src/api/`): Axios instance with interceptors. Response interceptor unwraps `ApiResponse` and rejects on `code !== 0`. HTTP errors (401/403/404/500/etc.) are handled with classification.

**State** (`src/stores/`): Zustand with `persist` and `devtools` middleware. `appStore` manages sidebar, language, theme.

**Routing** (`src/App.tsx`): React Router v7. Routes wrapped in `AdminLayout` with `ErrorBoundary`.

## OpenSpec Workflow

This project uses OpenSpec for spec-driven development. Key commands:
- `/opsx:propose` — create new change with all artifacts
- `/opsx:new` — start new change, step through artifacts
- `/opsx:continue` — progress change, create next artifact
- `/opsx:apply` — implement tasks from a change
- `/opsx:verify` — validate implementation matches change
- `/opsx:sync` — sync delta specs to main specs
- `/opsx:archive` — archive completed change

Artifact rules from `openspec/config.yaml`:
- **Proposals**: Must include Intent, Scope (with Non-goals), Approach
- **Delta Specs**: Use `## ADDED/## MODIFIED/## REMOVED` sections with GIVEN/WHEN/THEN scenarios
- **Design**: Include file changes, dependencies, API contracts
- **Tasks**: Max 2-hour chunks, hierarchical numbering, verifiable items

## Code Conventions

- Conventional commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`
- Components via shadcn/ui — check `src/components/ui/` before adding new
- `@` alias maps to `src/`
- Build output chunks: `vendor` (react/dom), `utils` (axios/zustand)
