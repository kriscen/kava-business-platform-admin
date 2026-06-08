## Why

后端 UPMS API 已提供日志、审计日志、文件、文件分组、应用管理 5 个资源的完整 REST 接口，但前端缺少对应的管理页面。补齐这些页面后，平台管理员可以查看系统日志、管理文件资源、管理应用及菜单绑定，补齐系统管理模块的最后一块拼图。

## What Changes

- 新增**日志管理**页面：只读分页列表 + 详情弹窗（无 CRUD 表单）
- 新增**审计日志**页面：只读分页列表 + 详情弹窗（无 CRUD 表单）
- 新增**文件管理**页面：标准 CRUD 分页列表 + 创建/编辑表单
- 新增**文件分组**页面：标准 CRUD 分页列表 + 创建/编辑表单
- 新增**应用管理**页面：标准 CRUD + dropdown + 菜单绑定功能
- 每个模块配套：类型定义、API 模块、Mock 数据、i18n 翻译、路由注册、菜单注册

## Capabilities

### New Capabilities

- `log-management`: 日志管理页面，只读分页列表 + 详情查看
- `audit-log-management`: 审计日志管理页面，只读分页列表 + 详情查看
- `file-management`: 文件管理页面，标准 CRUD（fileName、original、bucketName、dir、type、groupId、fileSize）
- `file-group-management`: 文件分组管理页面，标准 CRUD（pid、type、name）
- `app-management`: 应用管理页面，CRUD + 菜单绑定（code、name、icon、description、menuIds）

### Modified Capabilities

- `crud-management-pages`: 新增 5 个模块的页面规范，扩展覆盖范围

## Impact

- **新增文件**：每个模块 7 个文件（types、api、page×3、mock、i18n），共约 35 个文件
- **修改文件**：`src/types/index.ts`（re-export）、`src/App.tsx`（路由注册）、`src/routes/config.ts`（面包屑）、`src/stores/menuStore.ts`（菜单项）、`src/i18n/locales/zh-CN/layout.json`（菜单标签）、`mock/index.ts`（mock 注册）
- **无破坏性变更**：纯新增页面，不影响已有功能
- **日志/审计日志**为只读页面，无表单组件，实现较简单
- **应用管理**包含菜单树选择器（复用已有的 TreeSelect 或 CheckboxTree 模式）
