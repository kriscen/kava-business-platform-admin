## 1. 租户应用订阅 — API 与 Mock

- [x] 1.1 在 `src/api/modules/tenant.ts` 中新增 `getApps(tenantId)`、`subscribeApp(tenantId, appId)`、`unsubscribeApp(tenantId, appId)` 三个方法
- [x] 1.2 在 `mock/tenant.ts` 中新增三个端点的 mock handler（GET/POST/DELETE `tenant/{tenantId}/apps`），维护内存中的订阅关系数据

## 2. 租户应用订阅 — i18n

- [x] 2.1 在 `src/i18n/locales/zh-CN/tenant.json` 中新增订阅相关翻译 key（按钮文字、弹窗标题、列头、确认消息、错误提示等）

## 3. 租户应用订阅 — 页面实现

- [x] 3.1 在 `src/pages/system/tenant/columns.tsx` 的操作列增加"应用订阅"按钮
- [x] 3.2 创建 `src/pages/system/tenant/app-subscription-modal.tsx` 组件：包含已订阅应用列表（带退订按钮）和订阅新应用区域（应用下拉 + 订阅按钮）
- [x] 3.3 在 `TenantManagement.tsx` 中集成订阅弹窗状态管理和"应用订阅"按钮的 click handler
- [x] 3.4 在 `TenantManagement.tsx` 中添加 `subscribeDialogOpen`、`currentTenantId` 等状态，实现打开弹窗、订阅、退订、刷新列表的完整流程

## 4. 删除 dept 模块

- [x] 4.1 删除 `src/pages/system/dept/` 目录（DeptManagement.tsx、columns.tsx、dept-form.tsx）
- [x] 4.2 删除 `src/api/modules/dept.ts`
- [x] 4.3 删除 `mock/dept.ts`
- [x] 4.4 在 `mock/index.ts` 中移除 dept mock 的 import 和注册
- [x] 4.5 在 `src/App.tsx` 中移除 DeptManagement 的 lazy import 和 sharedRoutes 中的路由条目
- [x] 4.6 在 `src/routes/config.ts` 中移除 `/platform/system/dept` 和 `/tenant/system/dept` 路由配置
- [x] 4.7 删除 `src/i18n/locales/zh-CN/dept.json`

## 5. 用户管理页面目录整理

- [x] 5.1 将 `src/pages/system/UserManagement.tsx` 移入 `src/pages/system/users/` 并重命名为 `UserManagement.tsx`（与 `users/` 内的 columns.tsx、user-form.tsx 同级）
- [x] 5.2 更新 `src/App.tsx` 中的 lazy import 路径：`@/pages/system/UserManagement` → `@/pages/system/users/UserManagement`
- [x] 5.3 更新 `src/pages/system/users/UserManagement.tsx` 内部的相对 import（`./users/user-form` → `./user-form`，`./users/columns` → `./columns`）

## 6. 验证

- [x] 6.1 运行 `pnpm dev`，验证租户管理页面的"应用订阅"功能（打开弹窗、查看列表、订阅、退订）
- [x] 6.2 验证原 dept 路由不再可达，控制台无 dept 相关报错
- [x] 6.3 验证用户管理页面正常加载，路径与新目录一致
- [x] 6.4 运行 `pnpm type-check` 确认无 TypeScript 错误
