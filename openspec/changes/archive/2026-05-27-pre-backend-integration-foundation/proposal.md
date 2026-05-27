## Why

前端类型系统、API 层和错误处理与后端契约不对齐。当前 `ApiResponse.code` 是 `number`（后端返回 `string`），字段名用 `message`（后端返回 `msg`），缺少分页类型和实体类型。API 调用散落在 store 和页面中无模块化组织。所有错误仅 `console.error`，用户无感知。这些问题如果不在对接前修复，会在对接第一天就大面积报错。

## What Changes

- **BREAKING**: `ApiResponse.code` 类型从 `number` 改为 `string`，字段名 `message` 改为 `msg`，与后端 `JsonResult` 对齐
- 新增 `PagingInfo<T>`、`PageQuery` 分页类型
- 新增后端实体类型定义（User, Role, Menu, Dept, Tenant 等）
- 新增 `src/api/` 模块化 API 层，按后端资源模块组织（auth, system/user, system/role 等）
- 接入 toast 通知组件，拦截器中向用户展示 HTTP 错误和业务错误
- 统一 token 刷新路径，修复 `authStore.refreshAccessToken()` 使用 `request` 封装导致的潜在拦截器循环问题

## Capabilities

### New Capabilities

- `api-types`: 后端契约类型系统——ApiResponse 对齐、PagingInfo 分页、后端实体类型（User, Role, Menu, Dept, Tenant 等）
- `api-modules`: 模块化 API 层——按资源模块组织 API 调用，统一请求/响应约定
- `error-notification`: 用户可感知的错误通知——拦截器接入 toast，展示 HTTP 和业务错误

### Modified Capabilities

- `user-auth`: token 刷新路径统一，修复 `authStore.refreshAccessToken()` 的拦截器循环风险

## Impact

- `src/types/api.ts` — ApiResponse 类型定义变更（breaking）
- `src/api/interceptors.ts` — 业务码判断逻辑适配 string code，接入 toast 通知
- `src/stores/authStore.ts` — 移除 `refreshAccessToken` 中的 `request` 调用，统一走 raw fetch
- `src/api/` — 新增模块化 API 文件
- `src/types/` — 新增实体类型和分页类型
- 新增 toast 组件（shadcn/ui sonner）
- 所有引用 `ApiResponse.message` 的代码需改为 `msg`
