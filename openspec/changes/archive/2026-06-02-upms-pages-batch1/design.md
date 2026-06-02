## Context

项目已有 UserManagement 作为 CRUD 页面参考实现，以及 DataTable（分页表格）、FormModal（表单弹窗）、ConfirmDialog（确认框）等基础设施组件。API 模块和类型定义已就绪（dept.ts、tenant.ts），PublicParam 需新建。mock 数据路径需从自定义路径对齐到 `/api/v1/sys/*`。平台/租户路由归属待定，先统一放 platform 下。

现有 UI 组件库（shadcn/ui base-ui）：Input、Select、Button、Badge、Switch、Dialog、Textarea 等。

## Goals / Non-Goals

**Goals:**

- 交付 Dept、Tenant、PublicParam 三个完整 CRUD 管理页面
- 新建 TreeSelect 共享组件（供 Dept pid 选择，后续 Menu/Role 复用）
- 新建 DatePicker 共享组件（供 Tenant 时间字段，后续其他资源复用）
- 在 Tenant 表格操作列使用已有 Switch 组件实现 enable/disable
- 对齐 mock 路径到真实 API（`/api/v1/sys/*`）
- 所有用户可见字符串走 i18n

**Non-Goals:**

- 不做平台/租户路由归属的区分（先统一 platform，后续优化）
- 不做 Dept 的纯 tree 视图（先用分页表格，tree 视图后续迭代）
- 不做 Tenant 的 logo 文件上传（先用 URL 输入，文件上传留 File 模块时做）
- 不做 Dept 表单中的 Tenant 过滤（Dept 不涉及 tenantId 字段）

## Decisions

### 1. 页面结构复用 UserManagement 模式

每个页面采用与 UserManagement 完全相同的结构：

- 页面组件：管理搜索状态、modal 状态、fetchData 回调
- columns.tsx：表格列定义 + 操作按钮
- xxx-form.tsx：react-hook-form + zod 表单

**理由：** 已验证的模式，团队成员熟悉，减少认知负担。每个页面的差异仅在于字段和特殊交互。

### 2. TreeSelect 基于已有的 Select + 递归渲染

使用 Popover + 递归 TreeNode 构建 TreeSelect，而非引入第三方 tree 组件。

**理由：** 项目使用 base-ui，TreeSelect 只需要简单的树形选择（单选），不值得引入外部依赖。Popover 提供弹层，递归组件渲染树节点，逻辑清晰可控。

**组件接口：**

```ts
interface TreeSelectProps {
  data: TreeNode[] // 树形数据
  value?: number | null // 当前选中 id
  onChange: (id: number | null) => void
  placeholder?: string
  labelField?: string // 默认 'name'
  valueField?: string // 默认 'id'
  childrenField?: string // 默认 'children'
}
```

### 3. DatePicker 使用原生 HTML date/datetime-local input

不引入第三方日期库（dayjs/date-fns），直接使用 `<input type="datetime-local">`。

**理由：** 当前只需要基础的日期时间选择，原生 input 足够。如果后续需要复杂的日期范围选择、日历面板等，再引入第三方库。减少依赖。

### 4. Mock 路径完全对齐真实 API

mock 文件使用与真实后端完全一致的路径和响应结构。

| mock 文件           | 端点                                                                                                                                                                                                                                                            |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| mock/dept.ts        | `GET /api/v1/sys/dept/page`, `GET /api/v1/sys/dept/tree`, `GET /api/v1/sys/dept/:id`, `POST /api/v1/sys/dept`, `PUT /api/v1/sys/dept/:id`, `DELETE /api/v1/sys/dept`                                                                                            |
| mock/tenant.ts      | `GET /api/v1/sys/tenant/page`, `GET /api/v1/sys/tenant/dropdown`, `GET /api/v1/sys/tenant/:id`, `POST /api/v1/sys/tenant`, `PUT /api/v1/sys/tenant/:id`, `PUT /api/v1/sys/tenant/:id/enable`, `PUT /api/v1/sys/tenant/:id/disable`, `DELETE /api/v1/sys/tenant` |
| mock/publicParam.ts | `GET /api/v1/sys/public-param/page`, `GET /api/v1/sys/public-param/:id`, `POST /api/v1/sys/public-param`, `PUT /api/v1/sys/public-param/:id`, `DELETE /api/v1/sys/public-param`                                                                                 |

### 5. PublicParam API 模块遵循已有模式

新建 `src/types/publicParam.ts` 和 `src/api/modules/publicParam.ts`，接口风格与 dept.ts 一致（path-ID PUT，void DELETE）。

### 6. 路由和菜单

三个页面先注册到 platform 路由下：

- `/platform/system/dept` → DeptManagement
- `/platform/system/tenant` → TenantManagement
- `/platform/system/public-param` → PublicParamManagement

菜单加到 platform 侧边栏 "System" 分组下。

## Risks / Trade-offs

**[Dept 分页 vs tree 视图]** → 先用分页表格。Dept 数据量通常不大，但 tree 视图更直观。分页表格实现快，后续可加 tree 视图模式切换。Dept 表单中的 pid 字段仍通过 TreeSelect 使用 `/tree` 接口。

**[原生 DatePicker 样式]** → `datetime-local` 在不同浏览器样式不一致，但功能完整。如果视觉要求高，后续替换为第三方组件。

**[Mock 数据真实性]** → mock 数据应尽量反映真实 API 响应结构，但不含真实业务数据。Dept mock 的 tree 结构需要模拟嵌套 children。
