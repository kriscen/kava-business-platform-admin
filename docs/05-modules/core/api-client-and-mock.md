# API Client 与 Mock

## 运行时契约

前端 Axios client 位于 `src/api/request.ts` 和 `src/api/interceptors.ts`。普通业务接口返回后端 `JsonResult<T>`：

```typescript
interface ApiResponse<T = unknown> {
  success: boolean
  data: T | null
  errorCode: string | null
  errorMessage: string | null
}
```

分页接口的 `data` 使用后端 `PagingInfo<T>`：

```typescript
interface PagingInfo<T> {
  list: T[]
  total: number
  pageNo: number
  pageSize: number
}
```

响应拦截器只在 `success === false` 时按业务失败处理，展示 `errorMessage || common.requestFailed` 并 reject。HTTP 401 使用 refresh token 队列刷新；刷新失败时清理认证状态并跳转到对应登录页。

## CRUD Hook 边界

`useCrudPage` 面向后端读取 `res.data.list`，再转换为 DataTable 内部需要的 `{ records, total }`。`records` 是前端表格组件私有格式，不是后端分页协议。

`useTreeCrudPage` 用于菜单、分组、地区等树形页面，调用对应 API 的 `getTree()`，再由页面提供搜索过滤和表单行为。

## Mock 约定

mock 文件位于项目根目录 `mock/`，统一通过 `mock/_utils.ts` 包装响应：

- `ok(data)`：成功响应，`success: true`
- `okVoid()`：无业务数据的成功响应
- `fail(errorCode, errorMessage)`：业务失败响应
- `page(list, total, pageNo, pageSize)`：分页数据结构

mock 分页响应必须返回 `data.list/data.total/data.pageNo/data.pageSize`，不得再使用 `records/current/size/pages` 表达后端协议。
