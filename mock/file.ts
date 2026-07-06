import type { MockMethod } from 'vite-plugin-mock'
import { fail, ok, page } from './_utils'

let nextId = 100
const records: Record<
  number,
  {
    id: number
    fileName: string
    original: string
    bucketName: string
    dir: string
    type: string
    groupId: number
    fileSize: number
    gmtCreate: string
    gmtModified: string
  }
> = {
  1: {
    id: 1,
    fileName: 'avatar_001.jpg',
    original: '头像.jpg',
    bucketName: 'kava-bucket',
    dir: '/avatar/2025/06',
    type: 'image/jpeg',
    groupId: 1,
    fileSize: 256000,
    gmtCreate: '2025-06-01 10:00:00',
    gmtModified: '2025-06-01 10:00:00',
  },
  2: {
    id: 2,
    fileName: 'report_2025.pdf',
    original: '2025年报告.pdf',
    bucketName: 'kava-bucket',
    dir: '/docs/2025',
    type: 'application/pdf',
    groupId: 2,
    fileSize: 1536000,
    gmtCreate: '2025-06-02 14:30:00',
    gmtModified: '2025-06-02 14:30:00',
  },
  3: {
    id: 3,
    fileName: 'data_export.xlsx',
    original: '数据导出.xlsx',
    bucketName: 'kava-bucket',
    dir: '/export/2025/06',
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    groupId: 2,
    fileSize: 512000,
    gmtCreate: '2025-06-03 09:15:00',
    gmtModified: '2025-06-03 09:15:00',
  },
}
nextId = 101

export default [
  {
    url: '/api/v1/sys/file/page',
    method: 'get',
    response: ({ query }: { query: Record<string, string> }) => {
      let list = Object.values(records)
      if (query.fileName) {
        list = list.filter((r) => r.fileName.includes(query.fileName))
      }
      const pageNo = parseInt(query.pageNo || '1')
      const pageSize = parseInt(query.pageSize || '10')
      const start = (pageNo - 1) * pageSize
      return ok(
        page(
          list.slice(start, start + pageSize).map((r) => ({
            id: r.id,
            fileName: r.fileName,
            original: r.original,
            bucketName: r.bucketName,
            dir: r.dir,
            type: r.type,
            fileSize: r.fileSize,
            gmtCreate: r.gmtCreate,
          })),
          list.length,
          pageNo,
          pageSize
        )
      )
    },
  },
  {
    url: /\/api\/v1\/sys\/file\/\d+$/,
    method: 'get',
    response: ({ query }: { query: Record<string, string> }) => {
      const urlParts = query.url?.split('/') || []
      const id = parseInt(urlParts[urlParts.length - 1])
      const r = records[id]
      if (!r) return fail(-1, '文件不存在')
      return ok(r)
    },
  },
  {
    url: '/api/v1/sys/file',
    method: 'post',
    response: ({ body }: { body: Record<string, unknown> }) => {
      const id = nextId++
      const now = new Date().toISOString().replace('T', ' ').slice(0, 19)
      records[id] = {
        id,
        fileName: body.fileName as string,
        original: body.original as string,
        bucketName: body.bucketName as string,
        dir: body.dir as string,
        type: body.type as string,
        groupId: (body.groupId as number) || 0,
        fileSize: (body.fileSize as number) || 0,
        gmtCreate: now,
        gmtModified: now,
      }
      return ok(id)
    },
  },
  {
    url: '/api/v1/sys/file',
    method: 'put',
    response: ({ body }: { body: Record<string, unknown> }) => {
      const id = body.id as number
      if (!records[id]) return fail(-1, '文件不存在')
      records[id] = {
        ...records[id],
        fileName: (body.fileName as string) ?? records[id].fileName,
        original: (body.original as string) ?? records[id].original,
        bucketName: (body.bucketName as string) ?? records[id].bucketName,
        dir: (body.dir as string) ?? records[id].dir,
        type: (body.type as string) ?? records[id].type,
        groupId: (body.groupId as number) ?? records[id].groupId,
        fileSize: (body.fileSize as number) ?? records[id].fileSize,
        gmtModified: new Date().toISOString().replace('T', ' ').slice(0, 19),
      }
      return ok(true)
    },
  },
  {
    url: '/api/v1/sys/file',
    method: 'delete',
    response: ({ body }: { body: number[] }) => {
      body.forEach((id) => delete records[id])
      return ok(true)
    },
  },
] as MockMethod[]
