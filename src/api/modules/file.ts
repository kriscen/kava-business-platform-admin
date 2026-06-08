import { request } from '@/api'
import type {
  ApiResponse,
  PagingInfo,
  SysFileQuery,
  SysFileRequest,
  SysFileListResponse,
  SysFileDetailResponse,
} from '@/types'

const BASE_URL = '/api/v1/sys/file'

export const fileApi = {
  getPage: (params: SysFileQuery): Promise<ApiResponse<PagingInfo<SysFileListResponse>>> => {
    return request.get(BASE_URL + '/page', { params })
  },

  getById: (id: number): Promise<ApiResponse<SysFileDetailResponse>> => {
    return request.get(`${BASE_URL}/${id}`)
  },

  create: (data: SysFileRequest): Promise<ApiResponse<number>> => {
    return request.post(BASE_URL, data)
  },

  update: (data: SysFileRequest): Promise<ApiResponse<boolean>> => {
    return request.put(BASE_URL, data)
  },

  remove: (ids: number[]): Promise<ApiResponse<boolean>> => {
    return request.delete(BASE_URL, { data: ids })
  },
}
