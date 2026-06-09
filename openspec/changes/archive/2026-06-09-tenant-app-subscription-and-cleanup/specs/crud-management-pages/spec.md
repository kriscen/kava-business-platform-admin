## MODIFIED Requirements

### Requirement: Consistent page directory structure

每个管理模块的页面组件 SHALL 位于 `src/pages/system/<module>/` 子目录内，文件名为 `index.tsx` 或 `<Module>Management.tsx`。模块的 columns 和 form 组件与页面组件同级。

#### Scenario: User management page location

- **WHEN** 项目启动时加载用户管理页面
- **THEN** lazy import 路径指向 `@/pages/system/users/UserManagement`（或 `@/pages/system/users/index`），与 tenant、app、role 等模块的目录结构一致

## REMOVED Requirements

### Requirement: Dept management module

**Reason**: dept 已重命名为 group，group 模块已独立实现。dept 模块的所有代码为废弃遗留。
**Migration**: 使用 `src/pages/system/group/`（即现有分组管理模块）替代。无数据迁移需求，dept 和 group 是独立实体。

#### Scenario: Dept route no longer exists

- **WHEN** 用户访问原 `/platform/system/dept` 或 `/tenant/system/dept` 路由
- **THEN** 路由不存在，页面不渲染（或显示 404）

#### Scenario: Dept mock no longer registered

- **WHEN** 开发模式下前端调用 `/api/v1/sys/dept/*` 接口
- **THEN** mock 系统不处理该请求，返回 404
