# 任务：后台管理前端项目基础架构

**输入**：来自 `/specs/001-admin-frontend-scaffold/` 的设计文档
**先决条件**：plan.md（必需）、spec.md（用户故事必需）、research.md、data-model.md、contracts/

**组织**：任务按用户故事分组，以实现每个故事的独立实现和测试。

## 格式：`[ID] [P?] [Story] 描述`
- **[P]**：可以并行运行（不同文件、无依赖关系）
- **[Story]**：此任务属于哪个用户故事（例如 US1、US2、US3）

---

## 阶段 1：设置（共享基础设施）

**目的**：项目初始化和基本结构

- [ ] T001 [US1] 使用 `npm create vite@latest . -- --template react-ts` 在当前目录初始化 Vite + React + TypeScript 项目
- [ ] T002 [US1] 创建项目目录结构：`src/api/`、`src/components/`、`src/stores/`、`src/i18n/`、`src/mock/`、`src/hooks/`、`src/utils/`、`src/types/`、`src/styles/`
- [ ] T003 [P] [US1] 在 `src/types/api.ts` 中创建 API 相关类型定义：`RequestConfig`、`ApiResponse<T>`
- [ ] T004 [P] [US1] 在 `src/types/layout.ts` 中创建布局相关类型定义：`MenuItem`、`LayoutConfig`
- [ ] T005 [P] [US1] 在 `src/types/error.ts` 中创建错误相关类型定义：`ErrorType`、`ErrorInfo`
- [ ] T006 [US1] 在 `src/types/index.ts` 中统一导出所有类型

---

## 阶段 2：基础（阻塞先决条件）

**目的**：在任何用户故事实现之前必须完成的核心基础设施

**⚠️ 关键**：在此阶段完成之前，不能开始用户故事工作

- [ ] T007 [US1] 配置 `vite.config.ts`：路径别名 `@/`、开发服务器端口 3000、构建优化（manualChunks）
- [ ] T008 [US1] 配置 `tsconfig.json`：添加路径映射 `"@/*": ["src/*"]`
- [ ] T009 [P] [US1] 安装并配置 ESLint：`@typescript-eslint`、`eslint-plugin-react-hooks`、`eslint-config-prettier`
- [ ] T010 [P] [US1] 安装并配置 Prettier：创建 `.prettierrc`、`.prettierignore`
- [ ] T011 [US1] 配置 `package.json` scripts：`dev`、`build`、`preview`、`lint`、`format`、`type-check`
- [ ] T012 [US1] 创建 `.env.example` 和 `.env.local` 环境变量模板文件
- [ ] T013 [US1] 创建 `src/styles/global.css` 全局样式文件（CSS reset + 基础样式）

**检查点**：基础就绪 - 用户故事实现现在可以并行开始

---

## 阶段 3：用户故事 1 - 项目初始化与开发环境 (优先级: P1) 🎯 MVP

**目标**：提供完整配置好的 React 项目脚手架，开发者可以立即开始业务开发

**独立测试**：运行 `npm run dev` 启动开发服务器，访问页面看到空白内容区，ESLint/Prettier 正常工作

### 用户故事 1 的实现

- [ ] T014 [US1] 更新 `index.html`：添加页面标题、favicon、meta 标签
- [ ] T015 [US1] 创建 `src/main.tsx`：应用入口，引入全局样式
- [ ] T016 [US1] 创建 `src/App.tsx`：根组件，渲染占位内容（Hello World）
- [ ] T017 [US1] 创建 `src/vite-env.d.ts`：Vite 环境类型声明（`ImportMetaEnv`、`ImportMeta`）
- [ ] T018 [US1] 安装核心依赖：`react-router-dom`、`axios`、`zustand`、`antd`、`@ant-design/icons`
- [ ] T019 [US1] 验证：运行 `npm run dev` 确认开发服务器正常启动
- [ ] T020 [US1] 验证：运行 `npm run build` 确认项目构建成功
- [ ] T021 [US1] 验证：运行 `npm run lint` 确认 ESLint 检查正常

**检查点**：此时，用户故事 1 应该完全功能并可独立测试

---

## 阶段 4：用户故事 2 - 布局系统 (优先级: P2)

**目标**：提供经典的后台管理布局组件（侧边栏+顶栏+内容区），开发者可以专注于业务页面开发

**独立测试**：渲染布局组件，验证侧边栏可折叠、顶栏显示、内容区正常展示

### 用户故事 2 的实现

- [ ] T022 [P] [US2] 创建 `src/components/layout/Sidebar.tsx`：侧边栏组件，支持折叠/展开、菜单渲染
- [ ] T023 [P] [US2] 创建 `src/components/layout/Header.tsx`：顶栏组件，显示标题、折叠按钮、用户信息区域
- [ ] T024 [P] [US2] 创建 `src/components/layout/Content.tsx`：内容区组件，包裹子路由
- [ ] T025 [US2] 创建 `src/components/layout/AdminLayout.tsx`：主布局组件，组合 Sidebar + Header + Content
- [ ] T026 [US2] 添加布局样式：侧边栏过渡动画、响应式适配（<768px 折叠侧边栏）
- [ ] T027 [US2] 更新 `src/App.tsx`：集成 AdminLayout 组件
- [ ] T028 [US2] 验证：访问页面显示完整布局（侧边栏+顶栏+内容区）
- [ ] T029 [US2] 验证：点击折叠按钮，侧边栏正确折叠/展开

**检查点**：此时，用户故事 1 和 2 都应该独立工作

---

## 阶段 5：用户故事 3 - HTTP 请求封装 (优先级: P2)

**目标**：提供统一封装的 HTTP 请求模块，支持请求拦截、响应拦截、错误处理

**独立测试**：发送测试请求，验证请求拦截、响应拦截、错误处理正常工作

### 用户故事 3 的实现

- [ ] T030 [US3] 创建 `src/api/request.ts`：Axios 实例配置（baseURL、timeout、headers）
- [ ] T031 [US3] 创建 `src/api/interceptors.ts`：请求拦截器（添加 Token）、响应拦截器（业务错误处理）
- [ ] T032 [US3] 在 `src/api/request.ts` 中封装请求方法：`request.get`、`request.post`、`request.put`、`request.delete`
- [ ] T033 [US3] 实现错误分类处理：网络错误、请求超时、401 未授权、403 禁止访问、500 服务器错误
- [ ] T034 [US3] 创建 `src/api/index.ts`：统一导出 request 实例
- [ ] T035 [US3] 验证：调用 `request.get('/api/test')` 确认请求发送成功（可使用 Mock 数据）

**检查点**：此时，用户故事 1、2、3 都应该独立工作

---

## 阶段 6：用户故事 4 - 状态管理 (优先级: P3)

**目标**：提供全局状态管理方案，支持状态持久化和调试工具

**独立测试**：在组件中读取和更新全局状态，验证状态持久化和 DevTools 正常

### 用户故事 4 的实现

- [ ] T036 [US4] 创建 `src/stores/appStore.ts`：AppState 类型定义（sidebarCollapsed、language、theme）
- [ ] T037 [US4] 使用 Zustand 创建 store：实现 toggleSidebar、setLanguage、setTheme 方法
- [ ] T038 [US4] 配置 persist 中间件：持久化 sidebarCollapsed、language、theme 到 localStorage
- [ ] T039 [US4] 配置 devtools 中间件：支持 Redux DevTools 调试
- [ ] T040 [US4] 创建 `src/stores/index.ts`：统一导出所有 store
- [ ] T041 [US4] 更新 `src/components/layout/Header.tsx`：集成 useAppStore 控制侧边栏折叠
- [ ] T042 [US4] 更新 `src/components/layout/Sidebar.tsx`：从 store 读取折叠状态
- [ ] T043 [US4] 验证：刷新页面后侧边栏折叠状态保持

**检查点**：此时，用户故事 1-4 都应该独立工作

---

## 阶段 7：用户故事 5 - 国际化基础设施 (优先级: P3)

**目标**：提供国际化框架，当前支持中文，预留多语言扩展能力

**独立测试**：在组件中使用 `t('common.confirm')` 获取对应翻译

### 用户故事 5 的实现

- [ ] T044 [US5] 安装依赖：`i18next`、`react-i18next`
- [ ] T045 [US5] 创建 `src/i18n/locales/zh-CN/common.json`：通用翻译（确认、取消、保存等）
- [ ] T046 [US5] 创建 `src/i18n/locales/zh-CN/layout.json`：布局相关翻译
- [ ] T047 [US5] 创建 `src/i18n/index.ts`：i18n 配置，设置默认语言为 zh-CN
- [ ] T048 [US5] 在 `src/main.tsx` 中引入 i18n 配置
- [ ] T049 [US5] 更新 `src/components/layout/Header.tsx`：使用 `useTranslation` 获取翻译文案
- [ ] T050 [US5] 验证：组件中显示正确的中文文案

**检查点**：此时，用户故事 1-5 都应该独立工作

---

## 阶段 8：用户故事 6 - 错误监控与日志 (优先级: P3)

**目标**：提供全局错误捕获机制，当前在控制台输出，预留监控服务扩展

**独立测试**：主动触发错误，验证错误被捕获并在控制台输出完整信息

### 用户故事 6 的实现

- [ ] T051 [P] [US6] 创建 `src/components/ErrorBoundary/index.tsx`：React Error Boundary 组件
- [ ] T052 [P] [US6] 创建 `src/utils/errorHandler.ts`：全局错误处理函数（格式化错误信息）
- [ ] T053 [US6] 在 `src/main.tsx` 中注册全局错误监听：`window.onerror`、`window.onunhandledrejection`
- [ ] T054 [US6] 更新 `src/App.tsx`：使用 ErrorBoundary 包裹根组件
- [ ] T055 [US6] 创建错误降级 UI：ErrorBoundary 显示友好的错误提示页面
- [ ] T056 [US6] 验证：抛出测试错误，确认控制台输出完整错误信息

**检查点**：此时，用户故事 1-6 都应该独立工作

---

## 阶段 9：用户故事 7 - Mock 数据支持 (优先级: P3)

**目标**：提供 Mock 数据方案，支持后端接口未就绪时的独立开发调试

**独立测试**：配置 Mock 接口，验证请求返回 Mock 数据

### 用户故事 7 的实现

- [ ] T057 [US7] 安装依赖：`mockjs`、`vite-plugin-mock`
- [ ] T058 [US7] 更新 `vite.config.ts`：配置 viteMockServe 插件（开发环境启用）
- [ ] T059 [P] [US7] 创建 `mock/user.ts`：用户信息 Mock 接口 `/api/user/info`
- [ ] T060 [P] [US7] 创建 `mock/system.ts`：系统配置 Mock 接口 `/api/system/config`
- [ ] T061 [P] [US7] 创建 `mock/menu.ts`：用户菜单 Mock 接口 `/api/menu/user`
- [ ] T062 [US7] 创建 `mock/index.ts`：Mock 模块统一导出
- [ ] T063 [US7] 验证：请求 Mock 接口返回模拟数据
- [ ] T064 [US7] 验证：设置 `VITE_ENABLE_MOCK=false` 后请求发送到真实后端

**检查点**：此时，所有用户故事应该独立功能

---

## 阶段 10：完善和跨领域关注点

**目的**：影响多个用户故事的改进

- [ ] T065 创建 `src/hooks/` 目录：预留自定义 Hooks 位置
- [ ] T066 创建 `src/utils/` 目录：预留工具函数位置，添加通用工具函数
- [ ] T067 [P] 更新 `.env.example`：添加所有环境变量说明
- [ ] T068 集成路由：在 AdminLayout 中配置路由结构（预留路由出口）
- [ ] T069 性能验证：确认构建体积 < 500KB（gzip，不含第三方库）
- [ ] T070 最终验证：运行 quickstart.md 中的所有验证场景

---

## 依赖关系和执行顺序

### 阶段依赖关系

```
阶段 1 (设置) ──→ 阶段 2 (基础) ──→ 阶段 3+ (用户故事)
                                          │
                    ┌─────────────────────┼─────────────────────┐
                    │                     │                     │
                    ▼                     ▼                     ▼
              阶段 4 (US2)          阶段 5 (US3)          阶段 6 (US4)
                    │                     │                     │
                    └──────────┬──────────┴──────────┬──────────┘
                               │                     │
                               ▼                     ▼
                         阶段 7 (US5)         阶段 8 (US6)
                               │                     │
                               └──────────┬──────────┘
                                          │
                                          ▼
                                    阶段 9 (US7)
                                          │
                                          ▼
                                    阶段 10 (完善)
```

### 用户故事依赖关系

- **US1 (P1)**：MVP，必须在所有其他故事之前完成
- **US2 (P2)**：依赖 US1，可与 US3 并行
- **US3 (P2)**：依赖 US1，可与 US2 并行
- **US4 (P3)**：依赖 US2（需要布局组件集成 store），可与 US5/US6 并行
- **US5 (P3)**：依赖 US1，可与 US4/US6 并行
- **US6 (P3)**：依赖 US1，可与 US4/US5 并行
- **US7 (P3)**：依赖 US3（需要 API 接口定义），可与 US4/US5/US6 并行

### 并行机会

**阶段 1 内并行**：
- T003、T004、T005 可并行（不同类型文件）

**阶段 2 内并行**：
- T009、T010 可并行（ESLint 和 Prettier 配置独立）

**阶段 4 内并行**：
- T022、T023、T024 可并行（不同组件文件）

**阶段 8 内并行**：
- T051、T052 可并行（不同文件）

**阶段 9 内并行**：
- T059、T060、T061 可并行（不同 Mock 模块）

---

## 并行示例：用户故事 4 和 5

```bash
# 当基础阶段完成后，可以同时启动：
任务 T036-T040："创建 Zustand store（用户故事 4）"
任务 T044-T048："配置 i18n 国际化（用户故事 5）"
```

---

## 实现策略

### MVP 优先（仅用户故事 1）

1. 完成阶段 1：设置
2. 完成阶段 2：基础
3. 完成阶段 3：用户故事 1
4. **停止并验证**：运行 `npm run dev` 确认项目启动正常
5. 可以开始后续业务开发

### 增量交付

1. 完成设置 + 基础 + US1 → 项目可用（MVP！）
2. 添加 US2 + US3 → 布局和请求能力就绪
3. 添加 US4 + US5 + US6 → 状态管理、国际化、错误监控
4. 添加 US7 → Mock 数据支持
5. 完成阶段 10 → 最终验证

---

## 备注

- [P] 任务 = 不同文件、无依赖关系，可并行执行
- [Story] 标签将任务映射到特定用户故事以便追溯
- 每个用户故事应该可独立完成和测试
- 在每个任务或逻辑组后提交
- 在任何检查点停止以独立验证故事
- 避免：模糊任务、同一文件冲突、破坏独立性的跨故事依赖关系