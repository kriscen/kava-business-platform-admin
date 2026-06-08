## Context

前端已有 10 个系统管理模块（用户、角色、菜单、部门、租户、区域、i18n、路由配置、公共参数、OAuth 客户端），均遵循统一的 CRUD 页面模式：类型定义 → API 模块 → 页面组件（DataTable + FormModal + columns + form）→ Mock → i18n → 路由/菜单注册。

后端 UPMS 还提供了 5 个未对接的资源接口：日志、审计日志、文件、文件分组、应用管理。本次变更将补齐这 5 个页面。

## Goals / Non-Goals

**Goals:**

- 新增 5 个管理页面，复用已有的 DataTable/FormModal/TreeTable 组件模式
- 每个模块配套完整的类型、API、Mock、i18n、路由、菜单注册
- 日志和审计日志为只读页面（仅列表 + 详情查看）
- 应用管理包含菜单树绑定功能

**Non-Goals:**

- 不修改已有的 10 个模块
- 不实现动态路由（后续独立变更）
- 不实现按钮级权限控制（后续独立变更）
- 不实现租户应用订阅页面（挂在租户详情下，复杂度较高，后续单独处理）

## Decisions

### D1: 日志/审计日志使用只读列表模式

日志和审计日志只有 GET /page 和 GET /{id} 两个接口，无增删改。页面不渲染"新增"按钮和批量删除，行操作仅有"查看详情"。详情使用 FormModal 的 edit 模式（disabled 状态）或独立的 Description 组件展示。

**理由**：最小化代码差异，复用 DataTable 组件，仅跳过表单提交逻辑。

### D2: 文件分组使用标准 CRUD 而非 TreeTable

文件分组 API 提供了标准分页接口 `GET /page`，与菜单/区域的 `/tree` 接口不同。虽然分组有 pid 父子关系，但后端未提供 tree 接口，前端使用标准 DataTable + 分页即可。

**理由**：与后端 API 保持一致，避免前端自行组装树形结构。如果后端后续提供 tree 接口，可再升级为 TreeTable。

### D3: 应用管理的菜单绑定使用独立弹窗

应用编辑表单只处理基本字段（code、name、icon、description）。菜单绑定通过行操作中的"绑定菜单"按钮触发独立弹窗，弹窗内展示菜单树 Checkbox，提交时调用 `PUT /{id}/menus` 接口。

**理由**：将菜单选择与基本信息编辑分离，降低表单复杂度。菜单树数据量可能较大，独立弹窗有更充裕的空间。

### D4: 统一文件结构

每个模块遵循已有模式的文件结构：

```
src/types/<module>.ts          → 类型定义
src/api/modules/<module>.ts    → API 模块
src/pages/system/<module>/     → 页面组件
  ├── <Module>Management.tsx   → 主页面
  ├── columns.tsx              → 列定义
  └── <module>-form.tsx        → 表单组件（日志/审计日志无此文件）
mock/<module>.ts               → Mock 数据
src/i18n/locales/zh-CN/<module>.json → 翻译
```

### D5: 模块注册文件

修改以下文件完成注册：

- `src/types/index.ts` — re-export 新类型
- `src/App.tsx` — lazy import + sharedRoutes 条目
- `src/routes/config.ts` — 面包屑路由配置
- `src/stores/menuStore.ts` — ALL_MENUS 菜单项
- `src/i18n/locales/zh-CN/layout.json` — 菜单标签翻译
- `mock/index.ts` — Mock 注册

## Risks / Trade-offs

- **日志数据量大** → 日志列表可能数据量很大，但后端已提供分页，前端 DataTable 已支持分页，无需额外处理
- **文件上传** → 当前文件管理仅管理文件元数据记录，不包含实际的文件上传功能（需要单独的上传组件和 OSS 对接）
- **应用菜单绑定** → 菜单树选择器需要复用或新建一个 CheckboxTree 组件，如果已有的 TreeSelect 不支持多选，需要扩展
