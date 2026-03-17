import type { MockMethod } from 'vite-plugin-mock'

export default [
  {
    url: '/api/system/config',
    method: 'get',
    response: () => ({
      code: 0,
      data: {
        siteName: 'Kava Admin',
        logo: '/logo.png',
        version: '1.0.0',
      },
      message: 'success',
    }),
  },
] as MockMethod[]