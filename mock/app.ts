import type { MockMethod } from 'vite-plugin-mock'

let nextId = 100
const records: Record<
  number,
  {
    id: number
    code: string
    name: string
    icon: string
    status: string
    description: string
    menuIds: number[]
    gmtCreate: string
  }
> = {
  1: {
    id: 1,
    code: 'kava-admin',
    name: 'Kava 管理后台',
    icon: 'Settings',
    status: '0',
    description: '平台管理后台应用',
    menuIds: [1, 2, 3, 4, 5],
    gmtCreate: '2025-01-01 00:00:00',
  },
  2: {
    id: 2,
    code: 'kava-portal',
    name: 'Kava 门户',
    icon: 'Globe',
    status: '0',
    description: '面向终端用户的门户应用',
    menuIds: [1, 3],
    gmtCreate: '2025-01-02 10:00:00',
  },
  3: {
    id: 3,
    code: 'kava-mobile',
    name: 'Kava 移动端',
    icon: 'Smartphone',
    status: '9',
    description: '移动端应用（已停用）',
    menuIds: [],
    gmtCreate: '2025-01-03 14:00:00',
  },
}
nextId = 101

export default [
  {
    url: '/api/v1/sys/app/page',
    method: 'get',
    response: ({ query }: { query: Record<string, string> }) => {
      let list = Object.values(records)
      if (query.appName) {
        list = list.filter((r) => r.name.includes(query.appName))
      }
      const pageNo = parseInt(query.pageNo || '1')
      const pageSize = parseInt(query.pageSize || '10')
      const start = (pageNo - 1) * pageSize
      return {
        code: 0,
        data: {
          records: list.slice(start, start + pageSize).map((r) => ({
            id: r.id,
            code: r.code,
            name: r.name,
            icon: r.icon,
            status: r.status,
            gmtCreate: r.gmtCreate,
          })),
          total: list.length,
          size: pageSize,
          current: pageNo,
          pages: Math.ceil(list.length / pageSize),
        },
        message: 'success',
      }
    },
  },
  {
    url: /\/api\/v1\/sys\/app\/\d+$/,
    method: 'get',
    response: ({ query }: { query: Record<string, string> }) => {
      const urlParts = query.url?.split('/') || []
      const id = parseInt(urlParts[urlParts.length - 1])
      const r = records[id]
      if (!r) return { code: -1, message: '应用不存在' }
      return { code: 0, data: r, message: 'success' }
    },
  },
  {
    url: '/api/v1/sys/app/dropdown',
    method: 'get',
    response: () => ({
      code: 0,
      data: Object.values(records).map((r) => ({
        id: r.id,
        code: r.code,
        name: r.name,
      })),
      message: 'success',
    }),
  },
  {
    url: '/api/v1/sys/app',
    method: 'post',
    response: ({ body }: { body: Record<string, unknown> }) => {
      const id = nextId++
      records[id] = {
        id,
        code: body.code as string,
        name: body.name as string,
        icon: (body.icon as string) || '',
        status: '0',
        description: (body.description as string) || '',
        menuIds: [],
        gmtCreate: new Date().toISOString().replace('T', ' ').slice(0, 19),
      }
      return { code: 0, data: id, message: 'success' }
    },
  },
  {
    url: /\/api\/v1\/sys\/app\/\d+$/,
    method: 'put',
    response: ({ body, url }: { body: Record<string, unknown>; url: string }) => {
      const id = parseInt(url.split('/').pop()!)
      if (!records[id]) return { code: -1, message: '应用不存在' }
      records[id] = {
        ...records[id],
        code: (body.code as string) ?? records[id].code,
        name: (body.name as string) ?? records[id].name,
        icon: (body.icon as string) ?? records[id].icon,
        description: (body.description as string) ?? records[id].description,
      }
      return { code: 0, data: true, message: 'success' }
    },
  },
  {
    url: /\/api\/v1\/sys\/app\/\d+\/menus$/,
    method: 'put',
    response: ({ body, url }: { body: number[]; url: string }) => {
      const parts = url.split('/')
      const id = parseInt(parts[parts.length - 2])
      if (!records[id]) return { code: -1, message: '应用不存在' }
      records[id].menuIds = body
      return { code: 0, data: true, message: 'success' }
    },
  },
  {
    url: '/api/v1/sys/app',
    method: 'delete',
    response: ({ body }: { body: number[] }) => {
      body.forEach((id) => delete records[id])
      return { code: 0, data: true, message: 'success' }
    },
  },
] as MockMethod[]
