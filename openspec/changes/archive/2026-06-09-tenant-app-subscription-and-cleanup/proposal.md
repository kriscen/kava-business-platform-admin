## Why

docs/04 定义了租户应用订阅 API（POST/DELETE/GET `/tenant/{tenantId}/apps`），但前端完全没有实现。同时 dept 模块已重命名为 group，遗留的 dept 代码需要清理。用户管理页面的文件组织与项目惯例不一致，也需要统一。

## What Changes

- **新增**：租户应用订阅功能——在租户管理页面增加"应用订阅"操作入口，支持查看已订阅应用、订阅新应用、退订已有应用
- **清理**：删除 dept 模块全部代码（页面、API、mock、路由、i18n），因为 dept 已改名为 group
- **整理**：将 `src/pages/system/UserManagement.tsx` 移入 `src/pages/system/users/` 目录，与其他模块保持一致的目录结构

## Capabilities

### New Capabilities

- `tenant-app-subscription`: 租户应用订阅管理——查看、订阅、退订应用

### Modified Capabilities

- `crud-management-pages`: 用户管理页面目录结构调整（移入 users/ 子目录）

## Impact

- **新增文件**：`src/pages/system/tenant/app-subscription-modal.tsx`、`src/i18n/locales/zh-CN/tenant.json` 新增 key
- **删除文件**：`src/pages/system/dept/`（3个文件）、`src/api/modules/dept.ts`、`mock/dept.ts`、`src/types/dept.ts`、`src/i18n/locales/zh-CN/dept.json`
- **修改文件**：`src/api/modules/tenant.ts`（新增3个订阅方法）、`mock/tenant.ts`（新增3个端点mock）、`src/App.tsx`（移除 dept 路由、调整 user import）、`src/routes/config.ts`（移除 dept 路由配置）、`mock/index.ts`（移除 dept mock 注册）、`src/pages/system/tenant/columns.tsx`（增加订阅按钮）、`src/pages/system/tenant/TenantManagement.tsx`（集成订阅弹窗）
- **API 对接**：在现有 `tenant.ts` 模块中新增 3 个方法（`getApps`、`subscribeApp`、`unsubscribeApp`），复用 `/api/v1/sys/tenant/{tenantId}/apps` 端点
