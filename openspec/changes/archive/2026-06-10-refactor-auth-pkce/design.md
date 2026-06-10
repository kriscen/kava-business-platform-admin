## Context

前端 auth 实现与后端最新文档存在多处不一致：

- 授权流程缺少 PKCE 参数（code_verifier / code_challenge）
- state 参数用 role 值代替随机值，且 callback 不验证
- Token exchange 用 JSON 格式而非 form-urlencoded
- JWT claims 结构已变更（authorities → roles，新增 tenantId/userType/dataScope）
- access_token 存在 localStorage，存在 XSS 风险
- scope 值应为 `internal` 而非 `read`
- 普通客户端 token 响应包裹在 JsonResult 中，需要正确解析
- refresh token 请求缺少 client_id 参数
- .env.development 的 redirect_uri 端口与 vite.config.ts 不匹配（5173 vs 3000）

Mock 模式保持现有用户名密码登录方式不变，不走 OAuth 重定向流程。

## Goals / Non-Goals

**Goals:**

- 实现完整的 OAuth2 Authorization Code + PKCE 流程
- 对齐后端文档的 JWT claims 结构
- 采用更安全的 token 存储策略（access → sessionStorage）
- 支持页面加载时静默刷新 token
- 修正所有与后端文档不一致的参数和格式

**Non-Goals:**

- 不改变 Mock 模式的登录方式（保持用户名密码）
- 不新增 consent 页面（后端自动批准 internal scope）
- 不实现 token 撤销（revoke）的前端调用（可选功能，后续再加）

## Decisions

### 1. PKCE 工具函数独立模块

将 `generateCodeVerifier`、`generateCodeChallenge`、`generateState` 放在 `src/utils/pkce.ts`，与 auth 逻辑解耦。

**理由**：PKCE 是通用的 OAuth2 安全机制，独立模块便于测试和复用。

### 2. code_verifier 存 sessionStorage

PKCE 的 code_verifier 在 authorize 请求生成后、callback 之前需要持久化（因为页面会跳转）。存 sessionStorage 而非 localStorage，关闭 tab 自动清除。

**替代方案**：存内存变量 — 不可行，因为 authorize → callback 之间有页面跳转，内存会丢失。

### 3. state 参数编码角色信息 + 随机后缀

state 格式为 `{role}:{random}`，如 `platform_admin:a8f3k2`。callback 时验证前缀确定角色，验证随机部分防 CSRF。

**替代方案**：纯随机 state — 需要额外存储机制来关联 role，增加复杂度。

### 4. Token 存储策略

| Token         | 存储位置       | 理由                                                 |
| ------------- | -------------- | ---------------------------------------------------- |
| access_token  | sessionStorage | 页面刷新不丢，关闭 tab 清除，XSS 窗口有限            |
| refresh_token | localStorage   | 关闭 tab 后重新打开可静默恢复，避免重新走 OAuth 流程 |
| code_verifier | sessionStorage | authorize → callback 之间需要持久化                  |
| state         | sessionStorage | authorize → callback 之间需要验证                    |

**替代方案**：全部存 sessionStorage — 更安全但关闭 tab 需重新登录，B 端管理后台用户体验差。

### 5. 静默刷新逻辑放在 authStore 初始化时

页面加载时检查：sessionStorage 有 access_token → 直接用；没有 → 检查 localStorage 的 refresh_token → 静默刷新；都没有 → 未登录状态。

### 6. Token exchange 使用 raw fetch

保持现有方案，token 端点调用不经过 Axios 拦截器（避免循环）。但需修正：

- Content-Type 改为 `application/x-www-form-urlencoded`
- 正确解析 JsonResult 包裹的响应

### 7. 登录页改造

真实模式下，登录页只显示一个"登录"按钮，点击后生成 PKCE 参数跳转到 `/oauth2/authorize`。Mock 模式保持现有表单不变。

## Risks / Trade-offs

- **[风险] state 参数格式耦合角色信息** → 如果未来角色类型增加，state 格式可能需要调整。缓解：state 格式设计为可扩展（`{role}:{random}`），新增角色只需加新前缀。

- **[风险] refresh_token 长期存在 localStorage** → XSS 攻击者可利用 refresh_token 无限续期。缓解：access_token 有效期 12 小时，refresh_token 30 天，相比全部存 localStorage 已有改善。后续可考虑 token 绑定设备指纹。

- **[权衡] 关闭 tab 后 access_token 丢失** → 用户关闭 tab 再打开需要静默刷新，增加一次网络请求。可接受：refresh 请求耗时短，用户无感知。
