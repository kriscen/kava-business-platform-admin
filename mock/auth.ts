import type { MockMethod } from 'vite-plugin-mock'

interface MockAccount {
  password: string
  userInfo: {
    role: string
    username: string
    tenantCode?: string
  }
}

const MOCK_ACCOUNTS: Record<string, MockAccount> = {
  admin: {
    password: '123456',
    userInfo: {
      role: 'platform_admin',
      username: 'admin',
    },
  },
  tenant: {
    password: '123456',
    userInfo: {
      role: 'tenant_admin',
      username: 'tenant',
      tenantCode: 'DEMO',
    },
  },
}

function generateMockJWT(payload: Record<string, unknown>): string {
  const now = Math.floor(Date.now() / 1000)
  const fullPayload = { ...payload, iat: now, exp: now + 15 * 60 }
  const encoded = btoa(JSON.stringify(fullPayload))
  return `mock.${encoded}.signature`
}

function generateRefreshToken(): string {
  return `refresh_${Math.random().toString(36).substring(2, 15)}`
}

export default [
  {
    url: '/api/auth/login',
    method: 'post',
    response: ({ body }: { body: Record<string, string> }) => {
      const { username, password, role, tenantCode } = body
      const account = MOCK_ACCOUNTS[username]

      if (!account || account.password !== password) {
        return { code: -1, message: '账号或密码错误' }
      }

      if (account.userInfo.role !== role) {
        return { code: -1, message: '账号或密码错误' }
      }

      if (role === 'tenant_admin' && tenantCode !== 'DEMO') {
        return { code: -1, message: '租户编码错误' }
      }

      return {
        code: 0,
        data: {
          userInfo: account.userInfo,
          accessToken: generateMockJWT({ sub: username, role, username, tenantCode }),
          refreshToken: generateRefreshToken(),
        },
        message: 'success',
      }
    },
  },
  {
    url: '/api/auth/logout',
    method: 'post',
    response: () => ({
      code: 0,
      message: 'success',
    }),
  },
  {
    url: '/api/auth/refresh',
    method: 'post',
    response: ({ body }: { body: Record<string, string> }) => {
      const { refreshToken } = body
      if (!refreshToken || !refreshToken.startsWith('refresh_')) {
        return { code: -1, message: 'Invalid refresh token' }
      }
      return {
        code: 0,
        data: {
          accessToken: generateMockJWT({ sub: 'refreshed' }),
          refreshToken: generateRefreshToken(),
        },
        message: 'success',
      }
    },
  },
] as MockMethod[]
