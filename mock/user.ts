import type { MockMethod } from 'vite-plugin-mock'

export default [
  {
    url: '/api/user/info',
    method: 'get',
    response: () => ({
      code: 0,
      data: {
        id: 1,
        username: 'admin',
        nickname: '管理员',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
        roles: ['admin'],
      },
      message: 'success',
    }),
  },
] as MockMethod[]