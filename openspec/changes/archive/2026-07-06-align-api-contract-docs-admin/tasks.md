## 1. API 契约类型与拦截器

- [x] 1.1 修改 `src/types/api.ts`，将 `ApiResponse<T>` 对齐为 `success/data/errorCode/errorMessage`。验收：类型与后端 `JsonResult<T>` 字段一致。
- [x] 1.2 修改 `src/api/interceptors.ts`，使用 `success` 判断业务失败并展示 `errorMessage`。验收：业务失败响应会 reject，并使用现有 i18n fallback。
- [x] 1.3 保留 `src/api/auth.ts` 对 OAuth token raw response 和 JsonResult response 的兼容解析。验收：授权码换 token 和 refresh token 不受通用拦截器变更影响。

## 2. 分页数据映射与状态

- [x] 2.1 修改 `src/types/common.ts` 的 `PagingInfo<T>` 为 `list/total/pageNo/pageSize`。验收：类型与后端 `PagingInfo<T>` 一致。
- [x] 2.2 修改 `src/hooks/useCrudPage.ts`，将 `res.data.list` 映射为 DataTable 内部 `records`。验收：DataTable 内部接口不扩大到页面层。
- [x] 2.3 检查 `useTreeCrudPage`、系统管理页面和租户应用订阅弹窗是否有旧协议假设。验收：不存在 `res.data.records`、`data.code`、`data.msg` 的业务接口处理。

## 3. 页面、交互、mock、i18n

- [x] 3.1 验证 15 个系统管理页面仍通过统一 hook 加载、搜索、删除和刷新。验收：页面代码不直接依赖后端分页字段，树形页面详情类型已与 DetailResponse 对齐。
- [x] 3.2 修正租户应用订阅弹窗错误处理，按 `errorCode` 识别系统应用不可退订等业务错误。验收：`10100002` 可展示 `tenant.systemAppNoUnsubscribe` 提示。
- [x] 3.3 对齐 mock 响应包装和分页结构。验收：分页 mock 返回 `success/data.list/data.total/data.pageNo/data.pageSize/errorCode/errorMessage`。
- [x] 3.4 检查 i18n 文案复用。验收：错误 fallback 使用现有 `common.*` key；本次未新增 i18n key。

## 4. 前端文档与 OpenSpec

- [x] 4.1 更新 `openspec/specs/api-infrastructure/spec.md`，移除 `code/msg`、`records/current` 和 `dept` 旧协议。验收：spec 与运行时代码一致。
- [x] 4.2 更新 `docs/05-modules`，按前端能力组织已实现模块。验收：文档覆盖应用壳、系统管理页面、API client、hooks、mock、i18n、认证入口。
- [x] 4.3 更新 `docs/00-project-map.md`。验收：新增或调整的前端文档入口都能在文档地图中找到。

## 5. 验证

- [x] 5.1 运行 `pnpm lint`。验收：通过（0 error，11 warning；warning 为既有 Fast Refresh/React Compiler 提示）。
- [x] 5.2 运行 `pnpm type-check`。验收：通过。
- [x] 5.3 运行 `pnpm build`。验收：通过；Vite 输出 vendor chunk > 500k 的体积 warning。
