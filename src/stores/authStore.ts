import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'
import { request } from '@/api'

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
  refreshAccessToken: () => Promise<void>
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
      (set, get) => ({
        ...initialState,

        login: async (params: LoginParams) => {
          const isMock = import.meta.env.VITE_ENABLE_MOCK === 'true'

          if (isMock) {
            const result = await request.post<{
              userInfo: UserInfo
              accessToken: string
              refreshToken: string
            }>('/api/auth/login', params)

            set({
              isAuthenticated: true,
              userInfo: result.data!.userInfo,
              accessToken: result.data!.accessToken,
              refreshToken: result.data!.refreshToken,
            })
          } else {
            const clientId = import.meta.env.VITE_OAUTH_CLIENT_ID || 'client_id'
            const redirectUri = import.meta.env.VITE_OAUTH_REDIRECT_URI
            const oauthUrl = `/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=read&state=${params.role}`

            sessionStorage.setItem('pending_login_params', JSON.stringify(params))
            window.location.href = oauthUrl
          }
        },

        logout: () => {
          const { accessToken, userInfo } = get()
          const isMock = import.meta.env.VITE_ENABLE_MOCK === 'true'
          const role = userInfo?.role

          set({
            isAuthenticated: false,
            userInfo: null,
            accessToken: null,
            refreshToken: null,
          })
          localStorage.removeItem('auth-storage')

          if (isMock && accessToken) {
            request.post('/api/auth/logout').catch(() => {})
          }

          const loginPath = role === 'tenant_admin' ? '/tenant/login' : '/platform/login'
          window.location.href = loginPath
        },

        refreshAccessToken: async () => {
          const { refreshToken } = get()
          if (!refreshToken) {
            throw new Error('No refresh token')
          }

          const isMock = import.meta.env.VITE_ENABLE_MOCK === 'true'
          if (isMock) {
            const result = await request.post<{
              accessToken: string
              refreshToken: string
            }>('/api/auth/refresh', { refreshToken })

            set({
              accessToken: result.data!.accessToken,
              refreshToken: result.data!.refreshToken,
            })
          } else {
            const result = await request.post<{
              access_token: string
              refresh_token: string
            }>('/oauth2/token', {
              grant_type: 'refresh_token',
              refresh_token: refreshToken,
            })

            set({
              accessToken: result.data!.access_token,
              refreshToken: result.data!.refresh_token,
            })
          }
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
