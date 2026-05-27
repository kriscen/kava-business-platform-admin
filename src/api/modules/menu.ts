import { request } from '@/api'
import type {
  ApiResponse,
  PagingInfo,
  SysMenuQuery,
  SysMenuRequest,
  SysMenuListResponse,
  SysMenuDetailResponse,
} from '@/types'

const BASE_URL = '/api/v1/sys/menu'

export const menuApi = {
  getPage: (params: SysMenuQuery): Promise<ApiResponse<PagingInfo<SysMenuListResponse>>> => {
    return request.get(BASE_URL + '/page', { params })
  },

  getById: (id: number): Promise<ApiResponse<SysMenuDetailResponse>> => {
    return request.get(`${BASE_URL}/${id}`)
  },

  create: (data: SysMenuRequest): Promise<ApiResponse<number>> => {
    return request.post(BASE_URL, data)
  },

  update: (id: number, data: SysMenuRequest): Promise<ApiResponse<void>> => {
    return request.put(`${BASE_URL}/${id}`, data)
  },

  remove: (ids: number[]): Promise<ApiResponse<void>> => {
    return request.delete(BASE_URL, { data: ids })
  },

  getTree: (): Promise<ApiResponse<SysMenuListResponse[]>> => {
    return request.get(BASE_URL + '/tree')
  },
}
