## 1. 类型系统对齐

- [x] 1.1 修改 `src/types/api.ts`：`ApiResponse.code` 从 `number` 改为 `string`，`message` 改为 `msg`，更新注释说明对齐后端 JsonResult
- [x] 1.2 新增 `src/types/common.ts`：定义 `PageQuery`（pageNo, pageSize）、`PagingInfo<T>`（records, total, size, current, pages）、`DropdownItem`（id, name/code）、`IdParam`
- [x] 1.3 新增 `src/types/user.ts`：定义 `SysUserQuery`、`SysUserRequest`、`SysUserListResponse`、`SysUserDetailResponse`，参照 docs/04-frontend/upms-api.md 中的字段
- [x] 1.4 新增 `src/types/role.ts`：定义 `SysRoleQuery`、`SysRoleRequest`、`SysRoleListResponse`、`SysRoleDetailResponse`、`SysRoleDropdownResponse`
- [x] 1.5 新增 `src/types/menu.ts`：定义 `SysMenuQuery`、`SysMenuRequest`、`SysMenuListResponse`（含递归 children）、`SysMenuDetailResponse`
- [x] 1.6 新增 `src/types/dept.ts`：定义 `SysDeptQuery`、`SysDeptRequest`、`SysDeptListResponse`（含递归 children）、`SysDeptDetailResponse`
- [x] 1.7 新增 `src/types/tenant.ts`：定义 `SysTenantQuery`、`SysTenantRequest`（含 adminUsername/adminPassword）、`SysTenantListResponse`、`SysTenantDropdownResponse`
- [x] 1.8 更新 `src/types/index.ts`：重新导出所有新增类型文件

## 2. 拦截器适配

- [x] 2.1 修改 `src/api/interceptors.ts`：业务码判断从 `data.code !== 0` 改为 `data.code !== '0'`，错误消息从 `data.message` 改为 `data.msg`
- [x] 2.2 全局搜索并修复所有引用 `ApiResponse.message` 的代码，改为 `.msg`
- [x] 2.3 确认 `type-check` 通过无类型错误

## 3. 错误通知机制

- [x] 3.1 安装并配置 shadcn/ui Sonner 组件（`pnpm add sonner`，添加 Toaster 到 App.tsx 根组件）
- [x] 3.2 修改 `src/api/interceptors.ts` 响应拦截器：业务错误调用 `toast.error(msg || '请求失败')`
- [x] 3.3 修改 `src/api/interceptors.ts` HTTP 错误处理：403/404/500/502/503/网络错误/超时 各场景调用 `toast.error()` 展示对应中文提示
- [x] 3.4 修改 `clearAuthAndRedirect()`：跳转前调用 `toast.info('登录已过期，请重新登录')`

## 4. Token 刷新统一

- [x] 4.1 从 `src/stores/authStore.ts` 中移除 `refreshAccessToken` 方法和对应类型定义（`AuthStore` 接口中的 `refreshAccessToken` 声明）
- [x] 4.2 确认拦截器中的 raw fetch token 刷新逻辑完整（已有 isRefreshing 锁 + refreshSubscribers 队列）

## 5. API 模块骨架

- [x] 5.1 新增 `src/api/auth.ts`：导出 `authApi.refreshToken(refreshToken)` 和 `authApi.exchangeCode(code)`，均使用 raw fetch
- [x] 5.2 新增 `src/api/modules/user.ts`：导出 `userApi` 对象，实现 getPage、getById、create、update、remove 方法
- [x] 5.3 新增 `src/api/modules/role.ts`：导出 `roleApi`，实现 getPage、getById、create、update、remove、getDropdown 方法
- [x] 5.4 新增 `src/api/modules/menu.ts`：导出 `menuApi`，实现 getPage、getById、create、update、remove、getTree 方法
- [x] 5.5 新增 `src/api/modules/dept.ts`：导出 `deptApi`，实现 getPage、getById、create、update、remove、getTree 方法
- [x] 5.6 新增 `src/api/modules/tenant.ts`：导出 `tenantApi`，实现 getPage、getById、create、update、remove、enable、disable、getDropdown 方法

## 6. 验证

- [x] 6.1 运行 `pnpm type-check` 确认无类型错误
- [x] 6.2 运行 `pnpm lint` 确认无 lint 错误
- [x] 6.3 运行 `pnpm dev` 确认 mock 模式正常启动，登录流程不受影响
