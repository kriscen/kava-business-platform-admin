## 1. 修复 Mock URL 路径不匹配

- [x] 1.1 修改 `mock/app.ts` 的 update 接口 URL：将 `PUT /api/v1/sys/app/{id}` 改为 `PUT /api/v1/sys/app`，调整 handler 从 request body 取 id
- [x] 1.2 修改 `mock/fileGroup.ts` 的 update 接口 URL：将 `PUT /api/v1/sys/file-group/{id}` 改为 `PUT /api/v1/sys/file-group`，调整 handler 从 request body 取 id

## 2. 删除孤立 Mock 文件

- [x] 2.1 删除 `mock/user.ts` 文件
- [x] 2.2 删除 `mock/system.ts` 文件
- [x] 2.3 从 `mock/index.ts` 中移除 `userMocks` 和 `systemMocks` 的导入和注册

## 3. 统一 Auth API 调用路径

- [x] 3.1 修改 `src/pages/oauth-callback/OAuthCallbackPage.tsx`：改用 `authApi.exchangeCode()` 替代直接调用 `request.post('/oauth2/token', ...)`
- [x] 3.2 修改 `src/stores/authStore.ts`：改用 `authApi.refreshToken()` 替代直接调用 `request.post('/api/auth/refresh', ...)`

## 4. 验证

- [x] 4.1 运行 `pnpm dev`，验证登录/登出/刷新 token 流程正常
- [x] 4.2 在 mock 模式下测试 app 和 fileGroup 的编辑（update）操作，确认 mock 被正确命中
- [x] 4.3 验证 OAuth 回调流程在 mock 模式下正常工作
