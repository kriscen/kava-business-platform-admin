import { request } from '@/api'
import type {
  ApiResponse,
  PagingInfo,
  SysI18nQuery,
  SysI18nRequest,
  SysI18nListResponse,
  SysI18nDetailResponse,
} from '@/types'

const BASE_URL = '/api/v1/sys/i18n'

export const i18nApi = {
  getPage: (params: SysI18nQuery): Promise<ApiResponse<PagingInfo<SysI18nListResponse>>> => {
    return request.get(BASE_URL + '/page', { params })
  },

  getById: (id: number): Promise<ApiResponse<SysI18nDetailResponse>> => {
    return request.get(`${BASE_URL}/${id}`)
  },

  create: (data: SysI18nRequest): Promise<ApiResponse<number>> => {
    return request.post(BASE_URL, data)
  },

  update: (id: number, data: SysI18nRequest): Promise<ApiResponse<void>> => {
    return request.put(`${BASE_URL}/${id}`, data)
  },

  remove: (ids: number[]): Promise<ApiResponse<void>> => {
    return request.delete(BASE_URL, { data: ids })
  },
}
