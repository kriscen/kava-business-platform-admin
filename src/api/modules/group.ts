import { request } from '@/api'
import type {
  ApiResponse,
  PagingInfo,
  SysGroupQuery,
  SysGroupRequest,
  SysGroupListResponse,
  SysGroupDetailResponse,
} from '@/types'

const BASE_URL = '/api/v1/sys/group'

export const groupApi = {
  getPage: (params: SysGroupQuery): Promise<ApiResponse<PagingInfo<SysGroupListResponse>>> => {
    return request.get(BASE_URL + '/page', { params })
  },

  getById: (id: number): Promise<ApiResponse<SysGroupDetailResponse>> => {
    return request.get(`${BASE_URL}/${id}`)
  },

  create: (data: SysGroupRequest): Promise<ApiResponse<number>> => {
    return request.post(BASE_URL, data)
  },

  update: (id: number, data: SysGroupRequest): Promise<ApiResponse<void>> => {
    return request.put(`${BASE_URL}/${id}`, data)
  },

  remove: (ids: number[]): Promise<ApiResponse<void>> => {
    return request.delete(BASE_URL, { data: ids })
  },

  getTree: (): Promise<ApiResponse<SysGroupListResponse[]>> => {
    return request.get(BASE_URL + '/tree')
  },
}
