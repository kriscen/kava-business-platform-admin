import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig } from 'axios'
import { setupInterceptors } from './interceptors'
import type { ApiResponse } from '@/types'

// 创建 Axios 实例
const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 设置拦截器
setupInterceptors(instance)

// 封装请求方法
export const request = {
  get: <T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    return instance.get(url, config)
  },

  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    return instance.post(url, data, config)
  },

  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    return instance.put(url, data, config)
  },

  delete: <T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    return instance.delete(url, config)
  },
}

export default instance