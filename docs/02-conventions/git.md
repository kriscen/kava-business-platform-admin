# Git 规范

## 提交信息

使用 Conventional Commits 格式，提交信息统一使用中文：

```
<type>(<scope>): <subject>

[可选 body]
[可选 footer]
```

### Type 类型

| type     | 说明          |
| -------- | ------------- |
| feat     | 新功能        |
| fix      | 修复 bug      |
| chore    | 构建/工具变更 |
| docs     | 文档变更      |
| refactor | 代码重构      |
| test     | 测试相关      |
| style    | 代码格式调整  |
| perf     | 性能优化      |

### 示例

```bash
# 简单提交
git commit -m "feat: 添加用户登录功能"

# 带 scope
git commit -m "feat(auth): 实现 OAuth2 PKCE 认证流程"

# 修复 bug
git commit -m "fix: 修复侧边栏折叠状态丢失的问题"

# 重构
git commit -m "refactor: 提取 CRUD 页面通用逻辑为 hooks"

# 带 body 说明
git commit -m "feat: 重新设计仪表盘

- 添加快捷入口卡片
- 优化统计数据展示
- 适配移动端布局"

# 关联 issue
git commit -m "fix: 修复登录超时问题

Closes #123"
```

## 分支策略

- `main` - 主分支，用于发布
- 功能开发在 feature 分支进行

## 提交准则

- subject 使用中文描述，简洁明了
- 不要在 subject 末尾添加句号
- body 用于详细说明（如有）
- scope 可选，用于标识变更影响范围（如模块名）

## 禁止操作

- 禁止 force push 到 main/master
- 禁止跳过 hooks 提交
