import type { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios'
import { toast } from 'sonner'
import i18n from '@/i18n'
import type { ApiResponse } from '@/types'
import { useAuthStore } from '@/stores/authStore'

let isRefreshing = false
let refreshSubscribers: Array<{
  resolve: (token: string) => void
  reject: (error: unknown) => void
}> = []

function subscribeTokenRefresh(resolve: (token: string) => void, reject: (error: unknown) => void) {
  refreshSubscribers.push({ resolve, reject })
}

function onTokenRefreshed(newToken: string) {
  refreshSubscribers.forEach(({ resolve }) => resolve(newToken))
  refreshSubscribers = []
}

function onTokenRefreshFailed(error: unknown) {
  refreshSubscribers.forEach(({ reject }) => reject(error))
  refreshSubscribers = []
}

function clearAuthAndRedirect() {
  toast.info(i18n.t('common.tokenExpired'))
  const role = useAuthStore.getState().userInfo?.role
  useAuthStore.setState({
    isAuthenticated: false,
    userInfo: null,
    accessToken: null,
    refreshToken: null,
  })
  localStorage.removeItem('auth-storage')
  const loginPath = role === 'tenant_admin' ? '/tenant/login' : '/platform/login'
  window.location.href = loginPath
}

export const setupInterceptors = (instance: AxiosInstance): void => {
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = useAuthStore.getState().accessToken
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error: AxiosError) => {
      return Promise.reject(error)
    }
  )

  instance.interceptors.response.use(
    (response) => {
      const data = response.data as ApiResponse
      if (String(data.code) !== '0') {
        toast.error(data.msg || i18n.t('common.requestFailed'))
        return Promise.reject(data)
      }
      return response.data
    },
    async (error: AxiosError<ApiResponse>) => {
      if (error.response) {
        const { status, data } = error.response

        switch (status) {
          case 401:
            if (!isRefreshing) {
              isRefreshing = true
              try {
                await useAuthStore.getState().refreshAccessToken()
                const newToken = useAuthStore.getState().accessToken
                if (newToken) {
                  onTokenRefreshed(newToken)
                } else {
                  onTokenRefreshFailed(new Error('Refresh token failed'))
                  clearAuthAndRedirect()
                }
              } catch (refreshError) {
                onTokenRefreshFailed(refreshError)
                clearAuthAndRedirect()
              } finally {
                isRefreshing = false
              }
            }

            return new Promise((resolve, reject) => {
              subscribeTokenRefresh(
                (newToken: string) => {
                  if (error.config && error.config.headers) {
                    error.config.headers.Authorization = `Bearer ${newToken}`
                    resolve(instance(error.config))
                  }
                },
                (refreshError: unknown) => {
                  reject(refreshError)
                }
              )
            })

          case 403:
            toast.error(i18n.t('common.forbidden'))
            break
          case 404:
            toast.error(i18n.t('common.notFound'))
            break
          case 500:
            toast.error(i18n.t('common.serverError'))
            break
          case 502:
            toast.error(i18n.t('common.badGateway'))
            break
          case 503:
            toast.error(i18n.t('common.serviceUnavailable'))
            break
          default:
            toast.error(data?.msg || i18n.t('common.requestError', { status }))
        }
      } else if (error.code === 'ECONNABORTED') {
        toast.error(i18n.t('common.requestTimeout'))
      } else if (error.message === 'Network Error') {
        toast.error(i18n.t('common.networkError'))
      } else {
        toast.error(i18n.t('common.unknownError'))
      }

      return Promise.reject(error)
    }
  )
}
