## Mock-first 前端开发规则

所有前端开发必须确保 `pnpm dev`（`VITE_ENABLE_MOCK=true`）模式下核心流程可跑通，不依赖后端服务。

### 必须添加 mock 的场景

- 新增 API 端点且属于核心流程（认证、导航、当前开发模块的 CRUD）
- 修改已有 API 的请求/响应结构，需同步更新对应 mock

### 判断标准

如果缺少该 mock 会导致页面白屏、控制台报错或无法完成基本操作，则**必须**添加。非核心接口（如诊断、统计、已废弃模块）鼓励添加但不强制。

### Mock 文件规范

- 放在 `mock/` 目录，遵循 `vite-plugin-mock` 的 `MockMethod` 格式
- 参考已有的 `mock/auth.ts`、`mock/user.ts` 等文件的模式
- mock 数据应反映真实的 API 契约（字段名、类型、结构与 `src/api/modules/` 及 `docs/04-frontend/` 中定义的接口一致）
- 新建 mock 文件后，在 `mock/index.ts` 中注册

### 验证

添加或修改 mock 后，运行 `pnpm dev` 确认目标流程正常，不出现网络错误或白屏。

### Why

前端开发不应被后端进度阻塞。Mock 系统让开发者可以独立调试所有页面和交互。

### How to apply

在实现新功能或修改 API 调用时，同步检查 `mock/` 目录是否已有对应端点。如果没有且属于核心流程，必须一并添加。在设计阶段（OpenSpec design artifact）的"文件变更"部分标注需要新增/修改的 mock 文件。
