import type { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios'
import type { ApiResponse } from '@/types'
import { useAuthStore } from '@/stores/authStore'

/**
 * Token 刷新锁，防止多个并发请求同时刷新 token
 */
let isRefreshing = false
let refreshSubscribers: Array<(token: string) => void> = []

/**
 * 添加 token 刷新后的回调
 */
function subscribeTokenRefresh(callback: (token: string) => void) {
  refreshSubscribers.push(callback)
}

/**
 * 通知所有等待的请求 token 已刷新
 */
function onTokenRefreshed(newToken: string) {
  refreshSubscribers.forEach((callback) => callback(newToken))
  refreshSubscribers = []
}

/**
 * 清除登录状态并跳转到登录页
 */
function clearAuthAndRedirect() {
  useAuthStore.getState().logout()
  window.location.href = '/login'
}

/**
 * 设置请求和响应拦截器
 */
export const setupInterceptors = (instance: AxiosInstance): void => {
  // 请求拦截器
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

  // 响应拦截器
  instance.interceptors.response.use(
    (response) => {
      const data = response.data as ApiResponse
      // 业务错误处理
      if (data.code !== 0) {
        console.error('业务错误:', data.message || '请求失败')
        return Promise.reject(data)
      }
      return response.data
    },
    async (error: AxiosError<ApiResponse>) => {
      // HTTP 错误分类处理
      if (error.response) {
        const { status, data } = error.response

        switch (status) {
          case 401:
            // 尝试刷新 token
            if (!isRefreshing) {
              isRefreshing = true
              try {
                const refreshToken = useAuthStore.getState().refreshToken
                if (refreshToken) {
                  // 发送刷新请求
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

            // 等待 token 刷新完成后重试请求
            return new Promise((resolve) => {
              subscribeTokenRefresh((newToken: string) => {
                if (error.config && error.config.headers) {
                  error.config.headers.Authorization = `Bearer ${newToken}`
                  resolve(instance(error.config))
                }
              })
            })

          case 403:
            console.error('禁止访问，无权限')
            break
          case 404:
            console.error('资源不存在')
            break
          case 500:
            console.error('服务器内部错误')
            break
          case 502:
            console.error('网关错误')
            break
          case 503:
            console.error('服务不可用')
            break
          default:
            console.error(`请求错误: ${status}`, data?.message)
        }
      } else if (error.code === 'ECONNABORTED') {
        console.error('请求超时')
      } else if (error.message === 'Network Error') {
        console.error('网络连接失败')
      } else {
        console.error('未知错误:', error.message)
      }

      return Promise.reject(error)
    }
  )
}
