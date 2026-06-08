## 1. 日志管理模块（只读）

- [x] 1.1 创建 `src/types/log.ts`：SysLogQuery、SysLogListResponse、SysLogDetailResponse 类型定义
- [x] 1.2 创建 `src/api/modules/log.ts`：getPage、getById 方法
- [x] 1.3 创建 `src/pages/system/log/columns.tsx`：列定义（logType、title、requestUri、method、serviceId、createBy、gmtCreate、查看详情）
- [x] 1.4 创建 `src/pages/system/log/LogManagement.tsx`：只读列表页面，无新增/删除按钮，行操作仅查看详情，详情用 FormModal 展示
- [x] 1.5 创建 `mock/log.ts`：分页查询 + 详情 Mock 数据
- [x] 1.6 创建 `src/i18n/locales/zh-CN/log.json`：翻译 key

## 2. 审计日志管理模块（只读）

- [x] 2.1 创建 `src/types/auditLog.ts`：SysAuditLogQuery、SysAuditLogListResponse、SysAuditLogDetailResponse 类型定义
- [x] 2.2 创建 `src/api/modules/auditLog.ts`：getPage、getById 方法
- [x] 2.3 创建 `src/pages/system/audit-log/columns.tsx`：列定义（auditName、auditField、beforeVal、afterVal、gmtCreate、查看详情）
- [x] 2.4 创建 `src/pages/system/audit-log/AuditLogManagement.tsx`：只读列表页面，详情用 FormModal 展示
- [x] 2.5 创建 `mock/auditLog.ts`：分页查询 + 详情 Mock 数据
- [x] 2.6 创建 `src/i18n/locales/zh-CN/auditLog.json`：翻译 key

## 3. 文件管理模块

- [x] 3.1 创建 `src/types/file.ts`：SysFileQuery、SysFileRequest、SysFileListResponse、SysFileDetailResponse 类型定义
- [x] 3.2 创建 `src/api/modules/file.ts`：getPage、getById、create、update、remove 方法
- [x] 3.3 创建 `src/pages/system/file/columns.tsx`：列定义（fileName、original、bucketName、dir、type、fileSize、gmtCreate、操作）
- [x] 3.4 创建 `src/pages/system/file/file-form.tsx`：表单组件（fileName、original、bucketName、dir、type、groupId、fileSize）
- [x] 3.5 创建 `src/pages/system/file/FileManagement.tsx`：标准 CRUD 页面
- [x] 3.6 创建 `mock/file.ts`：完整 CRUD Mock 数据
- [x] 3.7 创建 `src/i18n/locales/zh-CN/file.json`：翻译 key

## 4. 文件分组管理模块

- [x] 4.1 创建 `src/types/fileGroup.ts`：SysFileGroupQuery、SysFileGroupRequest、SysFileGroupListResponse、SysFileGroupDetailResponse 类型定义
- [x] 4.2 创建 `src/api/modules/fileGroup.ts`：getPage、getById、create、update、remove 方法
- [x] 4.3 创建 `src/pages/system/file-group/columns.tsx`：列定义（name、type、gmtCreate、操作）
- [x] 4.4 创建 `src/pages/system/file-group/file-group-form.tsx`：表单组件（name、pid、type）
- [x] 4.5 创建 `src/pages/system/file-group/FileGroupManagement.tsx`：标准 CRUD 页面
- [x] 4.6 创建 `mock/fileGroup.ts`：完整 CRUD Mock 数据
- [x] 4.7 创建 `src/i18n/locales/zh-CN/fileGroup.json`：翻译 key

## 5. 应用管理模块

- [x] 5.1 创建 `src/types/app.ts`：SysAppQuery、SysAppRequest、SysAppListResponse、SysAppDetailResponse、SysAppDropdownResponse 类型定义
- [x] 5.2 创建 `src/api/modules/app.ts`：getPage、getById、create、update、remove、dropdown、bindMenus 方法
- [x] 5.3 创建 `src/pages/system/app/columns.tsx`：列定义（code、name、icon、status、gmtCreate、操作含绑定菜单）
- [x] 5.4 创建 `src/pages/system/app/app-form.tsx`：表单组件（code、name、icon、description）
- [x] 5.5 创建 `src/pages/system/app/AppManagement.tsx`：CRUD 页面 + 菜单绑定弹窗（Checkbox 树形选择）
- [x] 5.6 创建 `mock/app.ts`：完整 CRUD + dropdown + bindMenus Mock 数据
- [x] 5.7 创建 `src/i18n/locales/zh-CN/app.json`：翻译 key

## 6. 全局注册

- [x] 6.1 更新 `src/types/index.ts`：re-export 5 个新模块的类型
- [x] 6.2 更新 `src/i18n/locales/zh-CN/layout.json`：添加 logManagement、auditLogManagement、fileManagement、fileGroupManagement、appManagement 菜单标签
- [x] 6.3 更新 `mock/index.ts`：注册 5 个新 mock 模块
- [x] 6.4 更新 `src/stores/menuStore.ts`：在 ALL_MENUS 的 system 分组下添加 5 个菜单项
- [x] 6.5 更新 `src/routes/config.ts`：添加 5 个模块的面包屑路由配置（platform + tenant 双份）
- [x] 6.6 更新 `src/App.tsx`：添加 5 个模块的 lazy import + sharedRoutes 条目

## 7. 验证

- [ ] 7.1 运行 `pnpm dev` 确认所有 5 个页面可正常访问、列表加载、搜索、CRUD 操作正常
- [x] 7.2 运行 `pnpm type-check` 确认无 TypeScript 错误
- [x] 7.3 运行 `pnpm lint` 确认无 ESLint 错误
