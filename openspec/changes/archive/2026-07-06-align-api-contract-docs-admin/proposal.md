## Why

前端系统管理页面已经覆盖 15 个资源页面和 API module，但共享 API 基础设施仍按旧响应协议处理：`ApiResponse` 使用 `code/msg`，分页类型使用 `records/current`。后端实际返回 `success/errorCode/errorMessage` 和 `list/pageNo/pageSize`，导致真实联调时分页列表、业务错误提示和订阅弹窗错误分支存在失败风险。

同时，前端模块文档没有站在前端子项目视角组织，当前 `docs/05-modules` 只列 `core` 和 `member`，没有反映系统管理页面、API client、mock、hooks 和 i18n 的实际边界。

Parent change: `../openspec/changes/align-api-contract-docs`

## What Changes

- 修正前端 `ApiResponse<T>` 类型为后端 `JsonResult<T>` 结构。
- 修正分页类型和 `useCrudPage` 数据映射，使用 `data.list` 而不是 `data.records`。
- 修正响应拦截器的业务成功判断和错误消息来源。
- 检查系统管理页面、租户应用订阅弹窗、树形 CRUD hook 中对旧协议的假设。
- 对齐 mock 响应包装和分页结构，保证 mock-first 调试仍可用。
- 更新前端 OpenSpec 和 docs，从页面、交互、状态、API client、mock、i18n 视角描述已实现模块。

## Capabilities

### New Capabilities

- `frontend-module-docs`: 建立前端子项目视角的模块文档规范。

### Modified Capabilities

- `api-infrastructure`: 对齐后端 `JsonResult` 和 `PagingInfo` 响应契约。
- `system-management-pages`: 确保所有管理页面通过统一 hook 消费后端分页结构。
- `tenant-app-subscription`: 修正订阅弹窗对错误码和响应结构的处理。

## Impact

- `src/types/api.ts`
- `src/types/common.ts`
- `src/api/interceptors.ts`
- `src/hooks/useCrudPage.ts`
- `src/hooks/useTreeCrudPage.ts`（仅在存在旧协议假设时修改）
- `src/pages/system/**`（仅修正协议消费）
- `mock/**`
- `docs/00-project-map.md`
- `docs/04-frontend/*`
- `docs/05-modules/**`
- `openspec/specs/api-infrastructure/spec.md`
- `openspec/specs/system-management-pages/spec.md`

## Non-Goals

- 不新增页面或改变系统管理页面视觉设计。
- 不改变后端 API 路径、字段名或错误码定义。
- 不引入新的请求库或状态管理方案。
- 不处理未实现的后端业务能力。
