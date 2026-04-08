/**
 * Mock 登录数据
 * 仅在 VITE_ENABLE_MOCK=true 时使用
 */

import type { UserRole, UserInfo } from '@/stores/authStore'

/**
 * Mock 账号配置
 */
const MOCK_ACCOUNTS: Record<string, { password: string; userInfo: UserInfo }> = {
  admin: {
    password: '123456',
    userInfo: {
      role: 'platform_admin' as UserRole,
      username: 'admin',
    },
  },
  tenant: {
    password: '123456',
    userInfo: {
      role: 'tenant_admin' as UserRole,
      username: 'tenant',
      tenantCode: 'DEMO',
    },
  },
}

/**
 * Mock JWT payload
 */
interface MockJWTPayload {
  sub: string
  role: UserRole
  username: string
  tenantCode?: string
  exp: number
  iat: number
}

/**
 * 生成 Mock JWT
 */
function generateMockJWT(payload: Omit<MockJWTPayload, 'iat' | 'exp'>): string {
  const now = Math.floor(Date.now() / 1000)
  const fullPayload: MockJWTPayload = {
    ...payload,
    iat: now,
    exp: now + 15 * 60, // 15 分钟
  }

  // 简单的 base64 编码（不是真正的 JWT，仅用于 mock）
  const encoded = btoa(JSON.stringify(fullPayload))
  return `mock.${encoded}.signature`
}

/**
 * 生成 Mock Refresh Token
 */
function generateMockRefreshToken(): string {
  return `refresh_${Math.random().toString(36).substring(2, 15)}`
}

export interface MockLoginResult {
  userInfo: UserInfo
  accessToken: string
  refreshToken: string
}

/**
 * Mock 登录验证
 */
export async function mockLogin(params: {
  username: string
  password: string
  role: UserRole
  tenantCode?: string
}): Promise<MockLoginResult> {
  // 模拟网络延迟
  await new Promise((resolve) => setTimeout(resolve, 500))

  const account = MOCK_ACCOUNTS[params.username]

  // 验证账号存在
  if (!account) {
    throw new Error('账号或密码错误')
  }

  // 验证密码
  if (account.password !== params.password) {
    throw new Error('账号或密码错误')
  }

  // 验证角色匹配
  if (account.userInfo.role !== params.role) {
    throw new Error('账号或密码错误')
  }

  // 验证租户编码（如果是租户管理员）
  if (params.role === 'tenant_admin') {
    if (params.tenantCode !== 'DEMO') {
      throw new Error('租户编码错误')
    }
    if (account.userInfo.tenantCode !== params.tenantCode) {
      throw new Error('租户编码错误')
    }
  }

  // 生成 mock token
  const accessToken = generateMockJWT({
    sub: params.username,
    role: params.role,
    username: params.username,
    tenantCode: params.tenantCode,
  })

  const refreshToken = generateMockRefreshToken()

  return {
    userInfo: account.userInfo,
    accessToken,
    refreshToken,
  }
}
