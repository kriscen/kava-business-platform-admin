import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'
import { request } from '@/api'
import { authApi } from '@/api/auth'
import { generateCodeVerifier, generateCodeChallenge, generateState } from '@/utils/pkce'

export type UserRole = 'platform_admin' | 'tenant_admin'

export interface UserInfo {
  role: UserRole
  username: string
  tenantCode?: string
  userId?: string
  tenantId?: string
  groupId?: string
  userType?: string
  dataScope?: string
  roles?: string[]
}

export interface AuthState {
  isAuthenticated: boolean
  userInfo: UserInfo | null
  accessToken: string | null
  refreshToken: string | null
}

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

export function parseJwtPayload(token: string): Record<string, unknown> {
  return JSON.parse(atob(token.split('.')[1]))
}

export function buildUserInfoFromJwt(payload: Record<string, unknown>, role: UserRole): UserInfo {
  return {
    role,
    username: payload.username as string,
    userId: payload.userId as string,
    tenantId: payload.tenantId as string,
    tenantCode: payload.tenantId as string,
    groupId: payload.groupId as string,
    userType: payload.userType as string,
    dataScope: payload.dataScope as string,
    roles: payload.roles as string[],
  }
}

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

            const codeVerifier = generateCodeVerifier()
            const codeChallenge = await generateCodeChallenge(codeVerifier)
            const state = generateState(params.role)

            sessionStorage.setItem('pkce_code_verifier', codeVerifier)
            sessionStorage.setItem('pkce_state', state)

            const oauthUrl = `/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=internal&code_challenge=${codeChallenge}&code_challenge_method=S256&state=${state}`

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
          sessionStorage.removeItem('access_token')
          sessionStorage.removeItem('pkce_code_verifier')
          sessionStorage.removeItem('pkce_state')

          if (isMock && accessToken) {
            request.post('/api/auth/logout').catch(() => {})
          }

          const loginPath = role === 'tenant_admin' ? '/tenant/login' : '/platform/login'
          window.location.href = loginPath
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

export async function doRefreshAccessToken(): Promise<string> {
  const state = useAuthStore.getState()
  const { refreshToken } = state
  if (!refreshToken) {
    throw new Error('No refresh token')
  }

  const isMock = import.meta.env.VITE_ENABLE_MOCK === 'true'
  if (isMock) {
    const result = await request.post<{
      accessToken: string
      refreshToken: string
    }>('/api/auth/refresh', { refreshToken })

    const newAccessToken = result.data!.accessToken
    const newRefreshToken = result.data!.refreshToken
    useAuthStore.setState({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    })
    return newAccessToken
  }

  const data = await authApi.refreshToken(refreshToken)
  useAuthStore.setState({
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
  })
  sessionStorage.setItem('access_token', data.access_token)
  return data.access_token
}

export async function initAuth(): Promise<void> {
  const isMock = import.meta.env.VITE_ENABLE_MOCK === 'true'
  if (isMock) return

  const state = useAuthStore.getState()
  if (state.isAuthenticated && state.accessToken) return

  const sessionToken = sessionStorage.getItem('access_token')
  if (sessionToken) {
    const payload = parseJwtPayload(sessionToken)
    const userType = payload.userType as string
    const role: UserRole = userType === '1' ? 'platform_admin' : 'tenant_admin'
    useAuthStore.setState({
      isAuthenticated: true,
      accessToken: sessionToken,
      userInfo: buildUserInfoFromJwt(payload, role),
    })
    return
  }

  const refreshToken = state.refreshToken
  if (refreshToken) {
    try {
      await doRefreshAccessToken()
      const newToken = useAuthStore.getState().accessToken
      if (newToken) {
        const payload = parseJwtPayload(newToken)
        const userType = payload.userType as string
        const role: UserRole = userType === '1' ? 'platform_admin' : 'tenant_admin'
        useAuthStore.setState({
          isAuthenticated: true,
          userInfo: buildUserInfoFromJwt(payload, role),
        })
        sessionStorage.setItem('access_token', newToken)
      }
    } catch {
      useAuthStore.setState({
        isAuthenticated: false,
        userInfo: null,
        accessToken: null,
        refreshToken: null,
      })
      localStorage.removeItem('auth-storage')
    }
  }
}
