## 1. 路由配置基础设施

- [x] 1.1 创建 `src/routes/config.ts`，定义 `RouteConfig` 类型和 `routeConfig` 常量
- [x] 1.2 添加 `RouteConfig` 类型定义：`path`, `titleKey`, `breadcrumb?: string[]`, `children?`
- [x] 1.3 配置现有路由元数据：`/dashboard`, `/system/users`
- [x] 1.4 导出 `routeConfig` 和类型

## 2. usePageTitle Hook

- [x] 2.1 创建 `src/hooks/usePageTitle.ts`
- [x] 2.2 实现无参数版本：自动从 `routeConfig` 查找当前路由对应的 `titleKey`
- [x] 2.3 实现有参数版本：允许手动覆盖标题
- [x] 2.4 实现 i18n key 解析，使用 `t()` 获取翻译文本
- [x] 2.5 实现回退逻辑：key 不存在时显示路由路径

## 3. useBreadcrumbs Hook

- [x] 3.1 创建 `src/hooks/useBreadcrumbs.ts`
- [x] 3.2 实现基于当前路由和配置的 breadcrumb 数组生成
- [x] 3.3 实现首页面包屑项（固定）
- [x] 3.4 实现子路径面包屑查找（如 `/system/users` 找到 `['首页', '系统管理', '用户管理']`）

## 4. Header 组件集成

- [x] 4.1 修改 `src/components/layout/Header.tsx`
- [x] 4.2 移除 `title` prop 依赖
- [x] 4.3 集成 `usePageTitle()` 自动获取标题
- [x] 4.4 移除 App.tsx 中 Dashboard/UserManagement 的 title prop 传入

## 5. Content 组件集成

- [x] 5.1 修改 `src/components/layout/Content.tsx`
- [x] 5.2 集成 `useBreadcrumbs()` 获取面包屑数据
- [x] 5.3 动态渲染 BreadcrumbLink（使用路由而非硬编码）
- [x] 5.4 保持 BreadcrumbList 结构兼容

## 6. AdminLayout 调整

- [x] 6.1 检查 `src/components/layout/AdminLayout.tsx`
- [x] 6.2 确认 `buildMenus()` 和 `usePageTitle()` 不会冲突
- [x] 6.3 验证路由变化时标题和面包屑同步更新

## 7. 验证与测试

- [x] 7.1 手动测试：访问 `/dashboard` 验证标题和面包屑
- [x] 7.2 手动测试：访问 `/system/users` 验证标题和面包屑
- [x] 7.3 手动测试：从 `/dashboard` 导航到 `/system/users`，验证标题切换
- [x] 7.4 检查 i18n key 不存在时的回退显示
