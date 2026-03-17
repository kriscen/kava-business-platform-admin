import type { MockMethod } from 'vite-plugin-mock'

export default [
  {
    url: '/api/menu/user',
    method: 'get',
    response: () => ({
      code: 0,
      data: [
        {
          key: 'dashboard',
          label: '仪表盘',
          icon: 'DashboardOutlined',
          path: '/dashboard',
          sort: 1,
        },
        {
          key: 'system',
          label: '系统管理',
          icon: 'SettingOutlined',
          sort: 2,
          children: [
            {
              key: 'users',
              label: '用户管理',
              path: '/system/users',
              sort: 1,
            },
          ],
        },
      ],
      message: 'success',
    }),
  },
] as MockMethod[]