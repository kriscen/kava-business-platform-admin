import type { MockMethod } from 'vite-plugin-mock'

let nextId = 100
const records: Record<
  number,
  { id: number; name: string; pid: number; sortOrder: number; gmtCreate: string }
> = {
  1: { id: 1, name: '总公司', pid: 0, sortOrder: 1, gmtCreate: '2025-01-01 00:00:00' },
  2: { id: 2, name: '研发部', pid: 1, sortOrder: 1, gmtCreate: '2025-01-01 00:00:00' },
  3: { id: 3, name: '市场部', pid: 1, sortOrder: 2, gmtCreate: '2025-01-01 00:00:00' },
  4: { id: 4, name: '财务部', pid: 1, sortOrder: 3, gmtCreate: '2025-01-01 00:00:00' },
  5: { id: 5, name: '前端组', pid: 2, sortOrder: 1, gmtCreate: '2025-01-01 00:00:00' },
  6: { id: 6, name: '后端组', pid: 2, sortOrder: 2, gmtCreate: '2025-01-01 00:00:00' },
}
nextId = 101

function toFlatItem(r: (typeof records)[number]) {
  const parent = records[r.pid]
  return {
    id: r.id,
    name: r.name,
    pid: r.pid,
    parentName: parent?.name ?? '',
    sortOrder: r.sortOrder,
    gmtCreate: r.gmtCreate,
  }
}

function buildTree(pid: number) {
  return Object.values(records)
    .filter((r) => r.pid === pid)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((r) => {
      const children = buildTree(r.id)
      return {
        ...toFlatItem(r),
        ...(children.length > 0 ? { children } : { children: [] }),
      }
    })
}

export default [
  {
    url: '/api/v1/sys/dept/page',
    method: 'get',
    response: ({ query }: { query: Record<string, string> }) => {
      let list = Object.values(records).map(toFlatItem)
      if (query.name) {
        list = list.filter((r) => r.name.includes(query.name))
      }
      const pageNo = parseInt(query.pageNo || '1')
      const pageSize = parseInt(query.pageSize || '10')
      const start = (pageNo - 1) * pageSize
      return {
        code: 0,
        data: {
          records: list.slice(start, start + pageSize),
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
    url: '/api/v1/sys/dept/tree',
    method: 'get',
    response: () => ({
      code: 0,
      data: buildTree(0),
      message: 'success',
    }),
  },
  {
    url: '/api/v1/sys/dept/:id',
    method: 'get',
    response: ({ query }: { query: Record<string, string> }) => {
      const urlParts = query.url?.split('/') || []
      const id = parseInt(urlParts[urlParts.length - 1])
      const r = records[id]
      if (!r) return { code: -1, message: '部门不存在' }
      return { code: 0, data: toFlatItem(r), message: 'success' }
    },
  },
  {
    url: '/api/v1/sys/dept',
    method: 'post',
    response: ({ body }: { body: Record<string, unknown> }) => {
      const id = nextId++
      records[id] = {
        id,
        name: body.name as string,
        pid: (body.pid as number) || 0,
        sortOrder: (body.sortOrder as number) || 0,
        gmtCreate: new Date().toISOString().replace('T', ' ').slice(0, 19),
      }
      return { code: 0, data: id, message: 'success' }
    },
  },
  {
    url: /\/api\/v1\/sys\/dept\/\d+$/,
    method: 'put',
    response: ({ body, url }: { body: Record<string, unknown>; url: string }) => {
      const id = parseInt(url.split('/').pop()!)
      if (!records[id]) return { code: -1, message: '部门不存在' }
      records[id] = {
        ...records[id],
        name: (body.name as string) ?? records[id].name,
        pid: (body.pid as number) ?? records[id].pid,
        sortOrder: (body.sortOrder as number) ?? records[id].sortOrder,
      }
      return { code: 0, message: 'success' }
    },
  },
  {
    url: '/api/v1/sys/dept',
    method: 'delete',
    response: ({ body }: { body: number[] }) => {
      body.forEach((id) => delete records[id])
      return { code: 0, message: 'success' }
    },
  },
] as MockMethod[]
