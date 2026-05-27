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
  useAuthStore.getState().logout()
  window.location.href = '/login'
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
      if (data.code !== '0') {
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
                const refreshToken = useAuthStore.getState().refreshToken
                if (refreshToken) {
                  const refreshResponse = await fetch('/oauth2/token', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      grant_type: 'refresh_token',
                      refresh_token: refreshToken,
                    }),
                  })

                  if (refreshResponse.ok) {
                    const result = await refreshResponse.json()
                    useAuthStore.setState({
                      accessToken: result.access_token,
                      refreshToken: result.refresh_token,
                    })
                    onTokenRefreshed(result.access_token)
                  } else {
                    clearAuthAndRedirect()
                  }
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
