import { request } from '@/api'
import type {
  ApiResponse,
  PagingInfo,
  SysUserQuery,
  SysUserRequest,
  SysUserListResponse,
  SysUserDetailResponse,
} from '@/types'

const BASE_URL = '/api/v1/sys/user'

export const userApi = {
  getPage: (params: SysUserQuery): Promise<ApiResponse<PagingInfo<SysUserListResponse>>> => {
    return request.get(BASE_URL + '/page', { params })
  },

  getById: (id: number): Promise<ApiResponse<SysUserDetailResponse>> => {
    return request.get(`${BASE_URL}/${id}`)
  },

  create: (data: SysUserRequest): Promise<ApiResponse<number>> => {
    return request.post(BASE_URL, data)
  },

  update: (data: SysUserRequest): Promise<ApiResponse<boolean>> => {
    return request.put(BASE_URL, data)
  },

  remove: (ids: number[]): Promise<ApiResponse<boolean>> => {
    return request.delete(BASE_URL, { data: ids })
  },
}
