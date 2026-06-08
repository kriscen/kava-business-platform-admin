import { request } from '@/api'
import type {
  ApiResponse,
  PagingInfo,
  SysAreaQuery,
  SysAreaRequest,
  SysAreaListResponse,
  SysAreaDetailResponse,
} from '@/types'

const BASE_URL = '/api/v1/sys/area'

export const areaApi = {
  getPage: (params: SysAreaQuery): Promise<ApiResponse<PagingInfo<SysAreaListResponse>>> => {
    return request.get(BASE_URL + '/page', { params })
  },

  getTree: (params?: { areaType?: string }): Promise<ApiResponse<SysAreaListResponse[]>> => {
    return request.get(BASE_URL + '/tree', { params })
  },

  getChildren: (pid: number): Promise<ApiResponse<SysAreaListResponse[]>> => {
    return request.get(BASE_URL + '/children', { params: { pid } })
  },

  getById: (id: number): Promise<ApiResponse<SysAreaDetailResponse>> => {
    return request.get(`${BASE_URL}/${id}`)
  },

  create: (data: SysAreaRequest): Promise<ApiResponse<number>> => {
    return request.post(BASE_URL, data)
  },

  update: (id: number, data: SysAreaRequest): Promise<ApiResponse<void>> => {
    return request.put(`${BASE_URL}/${id}`, data)
  },

  remove: (ids: number[]): Promise<ApiResponse<void>> => {
    return request.delete(BASE_URL, { data: ids })
  },
}
