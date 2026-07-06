# member/ 会员模块

当前前端子项目尚未实现会员管理页面、会员 API 模块或会员路由。

会员相关后端能力处于 MVP 边界时，前端只保留模块占位说明，不在系统管理菜单、`src/api/modules/`、`src/pages/system/` 或 i18n 中暴露会员入口。后续新增会员 UI 时，应补齐：

- `src/api/modules/member.ts`
- `src/types/member.ts`
- `src/pages/system/member/`
- `src/i18n/locales/zh-CN/member.json`
- 对应 mock 文件与 `mock/index.ts` 注册
