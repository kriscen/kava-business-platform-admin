import { request } from '@/api'
import type {
  ApiResponse,
  PagingInfo,
  SysDeptQuery,
  SysDeptRequest,
  SysDeptListResponse,
  SysDeptDetailResponse,
} from '@/types'

const BASE_URL = '/api/v1/sys/dept'

export const deptApi = {
  getPage: (params: SysDeptQuery): Promise<ApiResponse<PagingInfo<SysDeptListResponse>>> => {
    return request.get(BASE_URL + '/page', { params })
  },

  getById: (id: number): Promise<ApiResponse<SysDeptDetailResponse>> => {
    return request.get(`${BASE_URL}/${id}`)
  },

  create: (data: SysDeptRequest): Promise<ApiResponse<number>> => {
    return request.post(BASE_URL, data)
  },

  update: (id: number, data: SysDeptRequest): Promise<ApiResponse<void>> => {
    return request.put(`${BASE_URL}/${id}`, data)
  },

  remove: (ids: number[]): Promise<ApiResponse<void>> => {
    return request.delete(BASE_URL, { data: ids })
  },

  getTree: (): Promise<ApiResponse<SysDeptListResponse[]>> => {
    return request.get(BASE_URL + '/tree')
  },
}
