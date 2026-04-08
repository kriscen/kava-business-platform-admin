## 1. 路由与布局

- [x] 1.1 在 `App.tsx` 添加登录页路由 `/login`，使用独立布局（不在 AdminLayout 内）
- [x] 1.2 在 `App.tsx` 添加 OAuth 回调页路由 `/oauth/callback`
- [x] 1.3 添加受保护路由逻辑：未登录访问 `/dashboard` 时重定向到 `/login`

## 2. Auth Store

- [x] 2.1 创建 `src/stores/authStore.ts`，定义 AuthState 和 AuthActions
- [x] 2.2 实现 `login()` 方法：根据 VITE_ENABLE_MOCK 选择 Mock 或 OAuth2 模式
- [x] 2.3 实现 `logout()` 方法：清除 localStorage 和 state
- [x] 2.4 实现 `refreshAccessToken()` 方法：调用刷新接口，重试失败处理
- [x] 2.5 实现 token 持久化：从 localStorage 恢复登录状态

## 3. 登录页组件

- [x] 3.1 创建 `src/pages/LoginPage.tsx`
- [x] 3.2 实现 Tab 切换：平台管理员 / 租户管理员
- [x] 3.3 实现表单验证：账号、密码必填，租户管理员模式下租户编码必填
- [x] 3.4 Mock 模式：调用 authStore.login() 模拟登录
- [x] 3.5 OAuth2 模式：跳转到 `/oauth2/authorize`

## 4. OAuth 回调页

- [x] 4.1 创建 `src/pages/OAuthCallbackPage.tsx`
- [x] 4.2 从 URL 解析 `code` 参数
- [x] 4.3 调用 `/oauth2/token` 获取 access_token 和 refresh_token
- [x] 4.4 存储 token 后跳转到 `/dashboard`

## 5. API 拦截器增强

- [x] 5.1 修改 `src/api/interceptors.ts` 请求拦截器：从 localStorage 读取 access_token 添加到 Authorization header
- [x] 5.2 修改响应拦截器：捕获 401，调用 refreshAccessToken() 刷新 token
- [x] 5.3 刷新失败时清除登录状态，跳转到登录页

## 6. Mock 登录数据

- [x] 6.1 在 `.env.development` 设置 `VITE_ENABLE_MOCK=true`
- [x] 6.2 创建 `src/mocks/auth.ts` 提供 Mock JWT 验证逻辑
- [x] 6.3 Mock 账号：平台管理员 `admin/123456`，租户管理员 `tenant/123456/DEMO`

## 7. 动态菜单

- [x] 7.1 创建 `src/stores/menuStore.ts` 管理菜单状态
- [x] 7.2 根据 authStore 的 role 动态生成菜单：platform_admin 看到全部，tenant_admin 仅看租户菜单
- [x] 7.3 修改 `AdminLayout.tsx`：使用 menuStore 渲染侧边栏菜单

## 8. 登出功能

- [x] 8.1 在 `Header.tsx` 添加"登出"按钮
- [x] 8.2 点击登出时调用 authStore.logout()，跳转到登录页

## 9. 环境配置

- [x] 9.1 在 `.env.development` 添加 `VITE_OAUTH_REDIRECT_URI=http://localhost:5173/oauth/callback`
- [x] 9.2 在 `.env.staging` 和 `.env.production` 添加生产环境 OAuth2 配置
- [x] 9.3 更新 `.env.example` 文档（项目不存在该文件，跳过）
