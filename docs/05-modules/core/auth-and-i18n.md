# 认证与 i18n

## 认证入口

前端提供平台管理员和租户管理员两套登录入口：

- `src/pages/login/PlatformLoginPage.tsx`
- `src/pages/login/TenantLoginPage.tsx`
- `src/pages/oauth-callback/OAuthCallbackPage.tsx`

OAuth2 token 端点封装在 `src/api/auth.ts`，使用 raw fetch 避免 Axios 401 拦截器递归。`parseTokenResponse()` 同时兼容 raw OAuth token response 和 `{ success, data, errorCode, errorMessage }` 包装响应。

## 认证状态

`src/stores/authStore.ts` 持有登录状态、用户信息、access token 和 refresh token。普通业务请求由 Axios 请求拦截器自动附加 `Authorization: Bearer <token>`。

## i18n 文件组织

i18n 入口位于 `src/i18n/`，当前维护 `zh-CN` locale。业务模块按文件拆分，例如：

- `user.json`、`role.json`、`menu.json`、`group.json`
- `tenant.json`、`app.json`
- `area.json`、`publicParam.json`、`routeConf.json`
- `log.json`、`auditLog.json`
- `file.json`、`fileGroup.json`

新增页面或按钮文案必须先补齐对应模块翻译文件，组件内通过 `t('module.key')` 引用，不在 JSX 中硬编码用户可见文本。
