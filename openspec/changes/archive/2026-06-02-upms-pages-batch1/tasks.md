## 1. 公共组件

- [x] 1.1 新建 TreeSelect 组件 (`src/components/tree-select.tsx`)：基于 Popover + 递归 TreeNode，支持 data/value/onChange/labelField/valueField/childrenField/placeholder props
- [x] 1.2 新建 DatePicker 组件 (`src/components/date-picker.tsx`)：封装原生 `<input type="datetime-local">`，支持 value/onChange/placeholder/disabled props，统一样式

## 2. PublicParam API 模块与类型

- [x] 2.1 新建 `src/types/publicParam.ts`：定义 SysPublicParamQuery、SysPublicParamRequest、SysPublicParamListResponse、SysPublicParamDetailResponse 类型
- [x] 2.2 新建 `src/api/modules/publicParam.ts`：实现 getPage、getById、create、update(id, data)、remove(ids)，基础路径 `/api/v1/sys/public-param`
- [x] 2.3 在 `src/types/index.ts` 中导出 PublicParam 类型

## 3. Mock 数据

- [x] 3.1 新建 `mock/dept.ts`：对齐 `/api/v1/sys/dept/*` 路径，包含 page（分页列表）、tree（嵌套 children 树）、/:id（详情）、POST（创建）、PUT /:id（更新）、DELETE（批量删除）
- [x] 3.2 新建 `mock/tenant.ts`：对齐 `/api/v1/sys/tenant/*` 路径，包含 page、dropdown、/:id、POST、PUT /:id、PUT /:id/enable、PUT /:id/disable、DELETE
- [x] 3.3 新建 `mock/publicParam.ts`：对齐 `/api/v1/sys/public-param/*` 路径，包含 page、/:id、POST、PUT /:id、DELETE
- [x] 3.4 更新 `mock/index.ts`：注册三个新 mock 模块

## 4. i18n 翻译文件

- [x] 4.1 新建 `src/i18n/locales/zh-CN/dept.json`：部门管理相关翻译 key（title、description、name、parentDept、sortOrder、searchName、confirmDelete 等）
- [x] 4.2 新建 `src/i18n/locales/zh-CN/tenant.json`：租户管理相关翻译 key（title、description、name、code、domain、websiteName、logo、footer、startTime、endTime、status、adminUsername、adminPassword、enable、disable、confirmEnable、confirmDisable 等）
- [x] 4.3 新建 `src/i18n/locales/zh-CN/publicParam.json`：公共参数相关翻译 key（title、description、publicName、publicKey、publicValue、status、publicType、systemFlag 等）

## 5. Dept 部门管理页面

- [x] 5.1 新建 `src/pages/platform/dept/columns.tsx`：定义表格列（name、parentName、sortOrder、gmtCreate、操作），操作列含编辑/删除按钮
- [x] 5.2 新建 `src/pages/platform/dept/dept-form.tsx`：react-hook-form + zod 表单，字段 name(必填)/pid(TreeSelect)/sortOrder(number)
- [x] 5.3 新建 `src/pages/platform/dept/DeptManagement.tsx`：页面组件，复用 UserManagement 模式（搜索、DataTable、FormModal、CRUD 操作）

## 6. Tenant 租户管理页面

- [x] 6.1 新建 `src/pages/platform/tenant/columns.tsx`：定义表格列（name、code、tenantDomain、websiteName、startTime、endTime、status Badge、gmtCreate、操作），操作列含编辑/删除/启用禁用
- [x] 6.2 新建 `src/pages/platform/tenant/tenant-form.tsx`：react-hook-form + zod 表单，字段 name(必填)/code(必填)/tenantDomain/websiteName/logo/footer/startTime(DatePicker)/endTime(DatePicker)/status(select)，创建模式额外 adminUsername/adminPassword
- [x] 6.3 新建 `src/pages/platform/tenant/TenantManagement.tsx`：页面组件，含 enable/disable toggle 逻辑

## 7. PublicParam 公共参数管理页面

- [x] 7.1 新建 `src/pages/platform/public-param/columns.tsx`：定义表格列（publicName、publicKey、publicValue、status、publicType、systemFlag、操作）
- [x] 7.2 新建 `src/pages/platform/public-param/public-param-form.tsx`：react-hook-form + zod 表单，字段 publicName(必填)/publicKey(必填)/publicValue(必填)/status/publicType/systemFlag
- [x] 7.3 新建 `src/pages/platform/public-param/PublicParamManagement.tsx`：页面组件，标准 CRUD

## 8. 路由与菜单注册

- [x] 8.1 在路由配置中注册三个页面：`/platform/system/dept`、`/platform/system/tenant`、`/platform/system/public-param`，使用 React.lazy 懒加载
- [x] 8.2 在 menuStore 中为 platform_admin 添加"部门管理"、"租户管理"、"公共参数"菜单项，归属"系统管理"分组下

## 9. 验证

- [x] 9.1 运行 `pnpm dev` 验证三个页面在 mock 模式下完整可用（列表、搜索、创建、编辑、删除）
- [x] 9.2 运行 `pnpm type-check` 确认无类型错误
- [x] 9.3 运行 `pnpm lint` 确认无 lint 错误
