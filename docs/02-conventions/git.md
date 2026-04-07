# Git 规范

## 提交信息

使用 Conventional Commits 格式：

```
<type>: <subject>

feat:     新功能
fix:      修复 bug
chore:    构建/工具变更
docs:     文档变更
refactor: 代码重构
test:     测试相关
```

## 分支策略

- `main` - 主分支，用于发布
- 功能开发在 feature 分支进行

## 提交准则

- subject 使用中文描述，简洁明了
- 不要在 subject 末尾添加句号
- body 用于详细说明（如有）

## 禁止操作

- 禁止 force push 到 main/master
- 禁止跳过 hooks 提交
