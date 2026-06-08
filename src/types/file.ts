import type { PageQuery } from './common'

/** 文件查询参数 */
export interface SysFileQuery extends PageQuery {
  fileName?: string
}

/** 文件创建/更新请求 */
export interface SysFileRequest {
  id?: number
  fileName: string
  original: string
  bucketName: string
  dir: string
  type: string
  groupId?: number
  fileSize: number
}

/** 文件列表响应 */
export interface SysFileListResponse {
  id: number
  fileName: string
  original: string
  bucketName: string
  dir: string
  type: string
  fileSize: number
  gmtCreate: string
}

/** 文件详情响应 */
export interface SysFileDetailResponse extends SysFileListResponse {
  groupId: number
}
