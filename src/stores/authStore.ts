import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'
import { request } from '@/api'
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
  refreshAccessToken: () => void
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
          // 清除 localStorage 中的持久化数据
          localStorage.removeItem('auth-storage')
          // 跳转到登录页
          window.location.href = '/login'
        },

        refreshAccessToken: () => {
          const currentRefreshToken = get().refreshToken
          if (!currentRefreshToken) {
            get().logout()
            return
          }

          request
            .post<{
              access_token: string
              refresh_token: string
              expires_in: number
            }>('/oauth2/token', {
              grant_type: 'refresh_token',
              refresh_token: currentRefreshToken,
            })
            .then((response) => {
              const data = response.data
              if (data) {
                set({
                  accessToken: data.access_token,
                  refreshToken: data.refresh_token,
                })
              }
            })
            .catch(() => {
              // 刷新失败，清除登录状态
              get().logout()
            })
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
