## Why

系统审计发现 mock 层与 API 模块存在多处不一致：2 个孤立 mock 文件（`user.ts`、`system.ts`）无对应 API 和页面调用，2 个 mock 的 PUT URL 路径与 API 模块实际行为不匹配（`app.ts`、`fileGroup.ts`），以及 `auth.ts` 中 2 个 API 方法未被页面使用。这些问题导致 `pnpm dev` 模式下部分更新操作的 mock 无法命中，前端调试依赖真实后端。

## What Changes

- 删除孤立 mock 文件 `mock/user.ts` 和 `mock/system.ts`
- 修复 `mock/app.ts` 的 update 接口 URL：`PUT /api/v1/sys/app/{id}` → `PUT /api/v1/sys/app`（id 在 body 中）
- 修复 `mock/fileGroup.ts` 的 update 接口 URL：`PUT /api/v1/sys/file-group/{id}` → `PUT /api/v1/sys/file-group`（id 在 body 中）
- 清理 `src/api/auth.ts` 中未被调用的 `exchangeCode()` 和 `refreshToken()` 方法，让页面统一使用 `authApi`
- 更新 `OAuthCallbackPage` 改用 `authApi.exchangeCode()` 而非直接调用 `request.post`
- 更新 `authStore` 改用 `authApi.refreshToken()` 而非直接调用 `request.post`

## Capabilities

### New Capabilities

无新增能力。

### Modified Capabilities

- `unified-mock`: 修复 mock URL 路径与 API 模块的不一致，删除孤立 mock 文件

## Impact

- `mock/` 目录：删除 2 个文件，修改 2 个文件
- `src/api/auth.ts`：移除 2 个未使用方法
- `src/pages/oauth-callback/OAuthCallbackPage.tsx`：改用 authApi
- `src/stores/authStore.ts`：改用 authApi
- 不影响生产构建（mock 仅在 `VITE_ENABLE_MOCK=true` 时生效）
- 不改变任何 API 契约或页面功能行为
