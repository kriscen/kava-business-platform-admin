## Context

前端 docs 中 `request-guide.md` 和 `upms-api.md` 已描述后端现行响应结构，但 `src/types/api.ts`、`src/api/interceptors.ts`、`src/types/common.ts`、`src/hooks/useCrudPage.ts` 仍按旧协议运行。`openspec/specs/api-infrastructure/spec.md` 也残留 `code/msg`、`records/size/current/pages` 和 `dept` 的描述。

## Goals

- 前端运行时代码与后端 `JsonResult` / `PagingInfo` 对齐。
- mock 与真实后端响应结构一致。
- 前端文档改为前端实现视角：页面、路由、交互、状态、API client、mock、i18n、构建验证。
- OpenSpec specs 与实现和 docs 保持一致。

## Non-Goals

- 不改变业务页面的 CRUD 功能范围。
- 不新增后端接口。
- 不重构 UI 组件体系。

## Decisions

### 1. ApiResponse 直接表达 JsonResult

**Decision**: `ApiResponse<T>` 使用 `success: boolean`, `data: T | null`, `errorCode: string | null`, `errorMessage: string | null`。

**Because**: 后端 `JsonResult` 是实际契约，前端不应维护第二套 `code/msg` 抽象。

### 2. DataTable 内部仍使用 records 作为组件私有格式

**Decision**: `PagingInfo<T>` 与后端一致使用 `list`，但 `useCrudPage.fetchData()` 返回给 `DataTable` 的本地结构可以继续是 `{ records, total }`。

**Because**: `DataTable` 是前端内部组件，保留其内部接口可减少页面级改动；后端协议转换集中在 hook 层。

### 3. Mock 统一返回后端包装结构

**Decision**: mock 的业务接口返回 `success/data/errorCode/errorMessage`，分页 mock 的 `data` 内使用 `list/total/pageNo/pageSize`。

**Because**: mock-first 开发只有与真实后端协议一致才有联调价值。

### 4. 文档按前端消费边界组织

**Decision**: `docs/05-modules` 不按后端服务/Maven 模块组织，改为前端模块或能力组织。

**Because**: 前端子项目的维护入口是页面、API client、状态和组件，而不是后端服务实现。

## API Contract

| operation        | frontend handling                                                          |
| ---------------- | -------------------------------------------------------------------------- | --- | -------------------------- |
| success response | `if (!result.success) reject`                                              |
| error toast      | use `result.errorMessage                                                   |     | t('common.requestFailed')` |
| paginated list   | map `res.data?.list ?? []` to DataTable records                            |
| total            | use `res.data?.total ?? 0`                                                 |
| current page     | request still sends `pageNo/pageSize`; response may echo `pageNo/pageSize` |

## File Changes

| change_type | files                                                                                              |
| ----------- | -------------------------------------------------------------------------------------------------- |
| modify      | `src/types/api.ts`, `src/types/common.ts`                                                          |
| modify      | `src/api/interceptors.ts`, `src/hooks/useCrudPage.ts`                                              |
| modify      | `src/pages/system/tenant/app-subscription-modal.tsx` if it compares old numeric/string error shape |
| modify      | `mock/**` response wrappers and pagination helpers                                                 |
| modify      | `docs/00-project-map.md`, `docs/05-modules/**`, relevant `docs/04-frontend/**`                     |
| modify      | `openspec/specs/api-infrastructure/spec.md`, relevant frontend specs                               |

## Dependencies

- Depends on backend child change `../kava-business-platform-ddd/openspec/changes/align-api-contract-docs-backend` for authoritative contract wording.
- Parent change path: `../openspec/changes/align-api-contract-docs`.

## Risks

| risk                                                     | mitigation                                                                                        |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Shared interceptor change affects every API call.        | Keep behavior limited to response wrapper detection and run full frontend checks.                 |
| Existing mock fixtures may be inconsistent.              | Update shared mock helpers first, then resource-specific mocks.                                   |
| Some auth endpoints can return raw OAuth token response. | Preserve existing `authApi.parseTokenResponse` behavior for both wrapped and raw token responses. |
