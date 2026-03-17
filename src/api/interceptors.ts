import type { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios'
import type { ApiResponse } from '@/types'

/**
 * 设置请求和响应拦截器
 */
export const setupInterceptors = (instance: AxiosInstance): void => {
  // 请求拦截器
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // 添加 Token（预留钩子）
      const token = localStorage.getItem('token')
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
        // 统一错误提示（可接入 message 组件）
        console.error('业务错误:', data.message || '请求失败')
        return Promise.reject(data)
      }
      return response.data
    },
    (error: AxiosError<ApiResponse>) => {
      // HTTP 错误分类处理
      if (error.response) {
        const { status, data } = error.response

        switch (status) {
          case 401:
            // 预留登录跳转钩子
            console.error('未授权，请重新登录')
            // 可以在这里触发登录页面跳转
            break
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