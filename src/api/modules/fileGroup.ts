import { request } from '@/api'
import type {
  ApiResponse,
  PagingInfo,
  SysFileGroupQuery,
  SysFileGroupRequest,
  SysFileGroupListResponse,
  SysFileGroupDetailResponse,
} from '@/types'

const BASE_URL = '/api/v1/sys/file-group'

export const fileGroupApi = {
  getPage: (
    params: SysFileGroupQuery
  ): Promise<ApiResponse<PagingInfo<SysFileGroupListResponse>>> => {
    return request.get(BASE_URL + '/page', { params })
  },

  getById: (id: number): Promise<ApiResponse<SysFileGroupDetailResponse>> => {
    return request.get(`${BASE_URL}/${id}`)
  },

  create: (data: SysFileGroupRequest): Promise<ApiResponse<number>> => {
    return request.post(BASE_URL, data)
  },

  update: (data: SysFileGroupRequest): Promise<ApiResponse<boolean>> => {
    return request.put(BASE_URL, data)
  },

  remove: (ids: number[]): Promise<ApiResponse<boolean>> => {
    return request.delete(BASE_URL, { data: ids })
  },
}
