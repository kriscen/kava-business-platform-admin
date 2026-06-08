import { request } from '@/api'
import type {
  ApiResponse,
  PagingInfo,
  SysOauthClientQuery,
  SysOauthClientRequest,
  SysOauthClientListResponse,
  SysOauthClientDetailResponse,
} from '@/types'

const BASE_URL = '/api/v1/sys/oauth-client'

export const oauthClientApi = {
  getPage: (
    params: SysOauthClientQuery
  ): Promise<ApiResponse<PagingInfo<SysOauthClientListResponse>>> => {
    return request.get(BASE_URL + '/page', { params })
  },

  getById: (id: number): Promise<ApiResponse<SysOauthClientDetailResponse>> => {
    return request.get(`${BASE_URL}/${id}`)
  },

  create: (data: SysOauthClientRequest): Promise<ApiResponse<number>> => {
    return request.post(BASE_URL, data)
  },

  update: (id: number, data: SysOauthClientRequest): Promise<ApiResponse<void>> => {
    return request.put(`${BASE_URL}/${id}`, data)
  },

  remove: (ids: number[]): Promise<ApiResponse<void>> => {
    return request.delete(BASE_URL, { data: ids })
  },
}
