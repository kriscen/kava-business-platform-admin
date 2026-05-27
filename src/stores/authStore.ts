import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'
import { mockLogin } from '@/mocks/auth'

/**
 * 用户角色类型
 */
export type UserRole = 'platform_admin' | 'tenant_admin'

/**
 * 用户信息
 */
export interface UserInfo {
  role: UserRole
  username: string
  tenantCode?: string
}

/**
 * 认证状态
 */
export interface AuthState {
  isAuthenticated: boolean
  userInfo: UserInfo | null
  accessToken: string | null
  refreshToken: string | null
}

/**
 * 登录参数
 */
export interface LoginParams {
  username: string
  password: string
  role: UserRole
  tenantCode?: string
}

export type AuthStore = AuthState & {
  login: (params: LoginParams) => Promise<void>
  logout: () => void
}

const initialState: AuthState = {
  isAuthenticated: false,
  userInfo: null,
  accessToken: null,
  refreshToken: null,
}

/**
 * 创建认证 Store
 */
export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        login: async (params: LoginParams) => {
          const isMock = import.meta.env.VITE_ENABLE_MOCK === 'true'

          if (isMock) {
            // Mock 模式
            const result = await mockLogin(params)
            set({
              isAuthenticated: true,
              userInfo: result.userInfo,
              accessToken: result.accessToken,
              refreshToken: result.refreshToken,
            })
          } else {
            // OAuth2 模式 - 跳转到后端授权页
            const clientId = import.meta.env.VITE_OAUTH_CLIENT_ID || 'client_id'
            const redirectUri = import.meta.env.VITE_OAUTH_REDIRECT_URI
            const oauthUrl = `/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=read&state=${params.role}`

            // 将登录参数存储到 sessionStorage，用于回调时恢复
            sessionStorage.setItem('pending_login_params', JSON.stringify(params))

            // 跳转到 OAuth2 授权页
            window.location.href = oauthUrl
          }
        },

        logout: () => {
          set({
            isAuthenticated: false,
            userInfo: null,
            accessToken: null,
            refreshToken: null,
          })
          localStorage.removeItem('auth-storage')
          window.location.href = '/login'
        },
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          isAuthenticated: state.isAuthenticated,
          userInfo: state.userInfo,
          accessToken: state.accessToken,
          refreshToken: state.refreshToken,
        }),
      }
    ),
    { name: 'AuthStore' }
  )
)
