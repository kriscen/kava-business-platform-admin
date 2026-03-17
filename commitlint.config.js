export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // 类型枚举
    'type-enum': [
      2,
      'always',
      [
        'feat', // 新功能
        'fix', // 修复 bug
        'docs', // 文档变更
        'style', // 代码格式(不影响代码运行的变动)
        'refactor', // 重构(既不是新增功能，也不是修改 bug 的代码变动)
        'perf', // 性能优化
        'test', // 增加测试
        'chore', // 构建过程或辅助工具的变动
        'revert', // 回滚
        'build', // 构建系统或外部依赖的更改
      ],
    ],
    // subject 大小写不敏感
    'subject-case': [0],
  },
}
