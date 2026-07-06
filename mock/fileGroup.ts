import type { MockMethod } from 'vite-plugin-mock'
import { fail, ok, page } from './_utils'

let nextId = 100
const records: Record<
  number,
  { id: number; name: string; pid: number; type: string; gmtCreate: string }
> = {
  1: { id: 1, name: '默认分组', pid: 0, type: 'file', gmtCreate: '2025-01-01 00:00:00' },
  2: { id: 2, name: '图片分组', pid: 0, type: 'image', gmtCreate: '2025-01-01 00:00:00' },
  3: { id: 3, name: '文档分组', pid: 0, type: 'file', gmtCreate: '2025-01-01 00:00:00' },
  4: { id: 4, name: '头像', pid: 2, type: 'image', gmtCreate: '2025-01-02 10:00:00' },
  5: { id: 5, name: '报告', pid: 3, type: 'file', gmtCreate: '2025-01-02 11:00:00' },
}
nextId = 101

export default [
  {
    url: '/api/v1/sys/file-group/page',
    method: 'get',
    response: ({ query }: { query: Record<string, string> }) => {
      let list = Object.values(records)
      if (query.name) {
        list = list.filter((r) => r.name.includes(query.name))
      }
      const pageNo = parseInt(query.pageNo || '1')
      const pageSize = parseInt(query.pageSize || '10')
      const start = (pageNo - 1) * pageSize
      return ok(page(list.slice(start, start + pageSize), list.length, pageNo, pageSize))
    },
  },
  {
    url: /\/api\/v1\/sys\/file-group\/\d+$/,
    method: 'get',
    response: ({ query }: { query: Record<string, string> }) => {
      const urlParts = query.url?.split('/') || []
      const id = parseInt(urlParts[urlParts.length - 1])
      const r = records[id]
      if (!r) return fail(-1, '分组不存在')
      return ok(r)
    },
  },
  {
    url: '/api/v1/sys/file-group',
    method: 'post',
    response: ({ body }: { body: Record<string, unknown> }) => {
      const id = nextId++
      records[id] = {
        id,
        name: body.name as string,
        pid: (body.pid as number) || 0,
        type: (body.type as string) || 'file',
        gmtCreate: new Date().toISOString().replace('T', ' ').slice(0, 19),
      }
      return ok(id)
    },
  },
  {
    url: '/api/v1/sys/file-group',
    method: 'put',
    response: ({ body }: { body: Record<string, unknown> }) => {
      const id = body.id as number
      if (!records[id]) return fail(-1, '分组不存在')
      records[id] = {
        ...records[id],
        name: (body.name as string) ?? records[id].name,
        pid: (body.pid as number) ?? records[id].pid,
        type: (body.type as string) ?? records[id].type,
      }
      return ok(true)
    },
  },
  {
    url: '/api/v1/sys/file-group',
    method: 'delete',
    response: ({ body }: { body: number[] }) => {
      body.forEach((id) => delete records[id])
      return ok(true)
    },
  },
] as MockMethod[]
