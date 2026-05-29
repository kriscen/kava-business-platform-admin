import type { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios'
import { toast } from 'sonner'
import type { ApiResponse } from '@/types'
import { useAuthStore } from '@/stores/authStore'

let isRefreshing = false
let refreshSubscribers: Array<(token: string) => void> = []

function subscribeTokenRefresh(callback: (token: string) => void) {
  refreshSubscribers.push(callback)
}

function onTokenRefreshed(newToken: string) {
  refreshSubscribers.forEach((callback) => callback(newToken))
  refreshSubscribers = []
}

function clearAuthAndRedirect() {
  toast.info('登录已过期，请重新登录')
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
        toast.error(data.msg || '请求失败')
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
                  clearAuthAndRedirect()
                }
              } catch {
                clearAuthAndRedirect()
              } finally {
                isRefreshing = false
              }
            }

            return new Promise((resolve) => {
              subscribeTokenRefresh((newToken: string) => {
                if (error.config && error.config.headers) {
                  error.config.headers.Authorization = `Bearer ${newToken}`
                  resolve(instance(error.config))
                }
              })
            })

          case 403:
            toast.error('禁止访问，无权限')
            break
          case 404:
            toast.error('请求的资源不存在')
            break
          case 500:
            toast.error('服务器内部错误')
            break
          case 502:
            toast.error('网关错误')
            break
          case 503:
            toast.error('服务暂时不可用')
            break
          default:
            toast.error(data?.msg || `请求错误: ${status}`)
        }
      } else if (error.code === 'ECONNABORTED') {
        toast.error('请求超时，请稍后重试')
      } else if (error.message === 'Network Error') {
        toast.error('网络连接失败，请检查网络')
      } else {
        toast.error('未知错误')
      }

      return Promise.reject(error)
    }
  )
}
