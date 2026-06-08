import { request } from '@/api'
import type {
  ApiResponse,
  PagingInfo,
  SysAuditLogQuery,
  SysAuditLogListResponse,
  SysAuditLogDetailResponse,
} from '@/types'

const BASE_URL = '/api/v1/sys/audit-log'

export const auditLogApi = {
  getPage: (
    params: SysAuditLogQuery
  ): Promise<ApiResponse<PagingInfo<SysAuditLogListResponse>>> => {
    return request.get(BASE_URL + '/page', { params })
  },

  getById: (id: number): Promise<ApiResponse<SysAuditLogDetailResponse>> => {
    return request.get(`${BASE_URL}/${id}`)
  },
}
