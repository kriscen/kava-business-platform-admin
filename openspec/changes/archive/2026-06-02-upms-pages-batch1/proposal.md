## Why

项目已有 UserManagement 作为 CRUD 页面参考实现，以及 DataTable/FormModal 等基础设施组件。现在需要对齐后端 UPMS 接口，将剩余的系统管理资源逐批落地为可交互的管理页面。第一批聚焦 Dept、Tenant、PublicParam 三个资源，同时补齐 TreeSelect、Switch、DatePicker 等共享组件。

## What Changes

- 新增 Dept 部门管理 CRUD 页面（tree 结构，需要 TreeSelect 组件选父部门）
- 新增 Tenant 租户管理 CRUD 页面（enable/disable 开关，DatePicker 时间选择，创建时额外字段）
- 新增 PublicParam 公共参数 CRUD 页面（标准 CRUD，无特殊交互）
- 新增 TreeSelect 共享组件（树形下拉选择，供 Dept/Menu 等资源复用）
- 新增 Switch/Toggle 行内组件（供 Tenant enable/disable 使用）
- 新增 DatePicker 共享组件（供 Tenant 时间字段使用）
- 新建 PublicParam 的 API 模块和类型定义
- 对齐 mock 数据到真实 API 路径（/api/v1/sys/\*）
- 补齐 i18n 翻译 key（dept.json、tenant.json、publicParam.json）
- 注册路由（先放 platform 下，归属后续优化）

## Capabilities

### New Capabilities

- `dept-management`: 部门管理页面，含 tree-select 父部门选择
- `tenant-management`: 租户管理页面，含 enable/disable 开关和日期选择
- `public-param-management`: 公共参数管理页面，标准 CRUD
- `tree-select-component`: 树形下拉选择共享组件
- `switch-component`: 行内开关/切换组件
- `date-picker-component`: 日期/时间选择共享组件
- `public-param-api`: 公共参数 API 模块和类型定义

### Modified Capabilities

- `unified-mock`: 新增 dept、tenant、publicParam 的 mock 端点，路径对齐 /api/v1/sys/\*
- `i18n-convention`: 新增 dept.json、tenant.json、publicParam.json 翻译文件
- `dual-routing`: 注册新页面路由到 platform 侧

## Impact

- **src/components/**: 新增 TreeSelect、Switch、DatePicker 组件
- **src/pages/platform/**: 新增 DeptManagement、TenantManagement、PublicParamManagement 页面及子组件
- **src/api/modules/**: 新增 publicParam.ts
- **src/types/**: 新增 publicParam.ts
- **src/i18n/locales/zh-CN/**: 新增 dept.json、tenant.json、publicParam.json
- **mock/**: 新增 dept.ts、tenant.ts、publicParam.ts，更新 index.ts 注册
- **src/App.tsx** 或路由配置: 新增 3 个路由
- **src/stores/menuStore.ts**: 新增菜单项
