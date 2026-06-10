## Context

项目采用 mock-first 开发模式（`VITE_ENABLE_MOCK=true`），通过 `vite-plugin-mock` 在 dev server 层拦截 HTTP 请求。当前 mock 层存在两类问题：

1. **URL 路径不匹配**：`mock/app.ts` 和 `mock/fileGroup.ts` 的 update 接口 URL 带 `{id}` 路径参数，但对应 API 模块的 `update()` 方法将 id 放在 request body 中（`PUT /base` 而非 `PUT /base/{id}`），导致 mock 永远匹配不上。
2. **孤立文件**：`mock/user.ts`（`/api/user/info`）和 `mock/system.ts`（`/api/system/config`）是早期遗留，无对应 API 模块和页面调用。
3. **authApi 未被使用**：`src/api/auth.ts` 定义了 `exchangeCode()` 和 `refreshToken()`，但页面和 store 直接用 `request.post` 绕过。

## Goals / Non-Goals

**Goals:**

- 修复 mock URL 与 API 模块的不一致，确保 `pnpm dev` 模式下所有 CRUD 操作的 mock 可命中
- 删除孤立 mock 文件，减少维护负担
- 统一 auth 相关调用路径，消除代码重复

**Non-Goals:**

- 不统一 update 方法的两种签名模式（id in URL vs id in body），这是后端 API 契约决定的
- 不修改任何 API 类型定义或后端接口
- 不新增 mock 数据或 mock 接口

## Decisions

### 1. 修复 mock URL 而非修改 API 模块

**选择**：修改 `mock/app.ts` 和 `mock/fileGroup.ts` 的 PUT URL，去掉 `{id}`。

**理由**：API 模块的签名已经与页面调用一致且正常工作（连 staging/prod 时没问题），mock 应该适配 API 而非反过来。修改 API 模块会影响生产代码，风险更高。

### 2. 直接删除孤立 mock 而非修复

**选择**：删除 `mock/user.ts` 和 `mock/system.ts`，从 `mock/index.ts` 移除导入。

**理由**：这两个 mock 的 URL（`/api/user/info`、`/api/system/config`）是旧版路径，当前没有任何代码调用。与其修复为新路径（需要猜测正确的响应结构），不如直接删除。如果将来需要，可以按需新建。

### 3. 页面改用 authApi 而非删除 authApi

**选择**：让 `OAuthCallbackPage` 和 `authStore` 改用 `authApi.exchangeCode()` / `authApi.refreshToken()`，保留 authApi 作为统一入口。

**理由**：authApi 是认证相关调用的集中点，保留它符合 API 层的架构设计。删除方法、让页面继续直接调 `request.post` 会导致维护分散。

## Risks / Trade-offs

- [低风险] 删除孤立 mock 不影响任何现有功能，因为无代码调用这些端点
- [低风险] 修改 mock URL 后，如果将来 API 模块的 update 签名改变，mock 需要同步更新——但这本来就是 mock 维护的基本要求
- [中风险] authStore 和 OAuthCallbackPage 改用 authApi 后，需要验证登录/登出/刷新/OAuth 回调流程在 mock 模式下正常工作
