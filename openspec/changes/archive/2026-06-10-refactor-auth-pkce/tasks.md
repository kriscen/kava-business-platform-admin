## 1. PKCE 工具模块

- [x] 1.1 创建 `src/utils/pkce.ts`，实现 `generateCodeVerifier()`、`generateCodeChallenge(verifier)`、`generateState(role)` 三个函数

## 2. Auth API 模块改造

- [x] 2.1 改造 `src/api/auth.ts` 的 `exchangeCode()`：Content-Type 改为 `application/x-www-form-urlencoded`，请求体改为 form-encoded 格式，加入 `code_verifier` 参数，正确解析 JsonResult 包裹的响应
- [x] 2.2 改造 `src/api/auth.ts` 的 `refreshToken()`：Content-Type 改为 `application/x-www-form-urlencoded`，加入 `client_id` 参数，正确解析 JsonResult 包裹的响应

## 3. AuthStore 改造

- [x] 3.1 改造 `login()` 方法：真实模式下生成 PKCE 参数，将 code_verifier 和 state 存入 sessionStorage，构建带 code_challenge 的 authorize URL 跳转
- [x] 3.2 改造 token 存储策略：access_token 存 sessionStorage，refresh_token 存 localStorage，调整 Zustand persist 配置
- [x] 3.3 改造 JWT 解析逻辑：适配新 claims 结构（roles 替代 authorities，新增 tenantId、userType、dataScope）
- [x] 3.4 改造 `clearAuthAndRedirect()`：同步清理 sessionStorage 中的 access_token、code_verifier、state
- [x] 3.5 改造 `initAuth()` / 页面加载逻辑：检查 sessionStorage 的 access_token，若无则用 localStorage 的 refresh_token 静默刷新

## 4. OAuth Callback 页面改造

- [x] 4.1 改造 `OAuthCallbackPage`：从 sessionStorage 读取并验证 state 参数，state 不匹配时中止并显示错误
- [x] 4.2 改造 `OAuthCallbackPage`：从 sessionStorage 读取 code_verifier 传给 exchangeCode，适配新的 userInfo 结构按 userType 跳转

## 5. 登录页面改造

- [x] 5.1 改造 `PlatformLoginPage`：真实模式下只显示"登录"按钮（点击触发 authStore.login），Mock 模式保持现有表单
- [x] 5.2 改造 `TenantLoginPage`：真实模式下只显示"登录"按钮，Mock 模式保持现有表单

## 6. 环境配置修正

- [x] 6.1 修正 `.env.development` 的 `VITE_OAUTH_REDIRECT_URI` 端口从 5173 改为 3000

## 7. Mock 数据同步

- [x] 7.1 更新 `mock/auth.ts` 的 JWT payload 结构：对齐新 claims（roles/tenantId/userType/dataScope）

## 8. 文档修正

- [x] 8.1 修正 `docs/04-frontend/auth-guide.md` 中 scope 示例从 `openid profile` 改为 `internal`
