import type { MockMethod } from 'vite-plugin-mock'

let nextId = 100

const records: Record<
  number,
  { id: number; pid: number; name: string; sortOrder: number; gmtCreate: string }
> = {
  1: {
    id: 1,
    pid: 0,
    name: '总部',
    sortOrder: 0,
    gmtCreate: '2025-01-01 00:00:00',
  },
  2: {
    id: 2,
    pid: 1,
    name: '技术部',
    sortOrder: 1,
    gmtCreate: '2025-01-01 00:00:00',
  },
  3: {
    id: 3,
    pid: 1,
    name: '市场部',
    sortOrder: 2,
    gmtCreate: '2025-01-01 00:00:00',
  },
  4: {
    id: 4,
    pid: 1,
    name: '运营部',
    sortOrder: 3,
    gmtCreate: '2025-01-01 00:00:00',
  },
  5: {
    id: 5,
    pid: 2,
    name: '前端组',
    sortOrder: 0,
    gmtCreate: '2025-01-15 00:00:00',
  },
  6: {
    id: 6,
    pid: 2,
    name: '后端组',
    sortOrder: 1,
    gmtCreate: '2025-01-15 00:00:00',
  },
  7: {
    id: 7,
    pid: 2,
    name: '测试组',
    sortOrder: 2,
    gmtCreate: '2025-01-15 00:00:00',
  },
  8: {
    id: 8,
    pid: 3,
    name: '品牌推广组',
    sortOrder: 0,
    gmtCreate: '2025-02-01 00:00:00',
  },
  9: {
    id: 9,
    pid: 3,
    name: '渠道运营组',
    sortOrder: 1,
    gmtCreate: '2025-02-01 00:00:00',
  },
  10: {
    id: 10,
    pid: 4,
    name: '用户运营组',
    sortOrder: 0,
    gmtCreate: '2025-02-01 00:00:00',
  },
  11: {
    id: 11,
    pid: 4,
    name: '内容运营组',
    sortOrder: 1,
    gmtCreate: '2025-02-01 00:00:00',
  },
}
nextId = 101

function toFlatItem(r: (typeof records)[number]) {
  const parent = records[r.pid]
  return {
    ...r,
    parentName: parent?.name ?? '',
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
    url: '/api/v1/sys/group/page',
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
    url: '/api/v1/sys/group/tree',
    method: 'get',
    response: () => {
      return { code: 0, data: buildTree(0), message: 'success' }
    },
  },
  {
    url: /\/api\/v1\/sys\/group\/\d+$/,
    method: 'get',
    response: ({ url }: { url: string }) => {
      const id = parseInt(url.split('/').pop()!)
      const r = records[id]
      if (!r) return { code: -1, message: '分组不存在' }
      return { code: 0, data: toFlatItem(r), message: 'success' }
    },
  },
  {
    url: '/api/v1/sys/group',
    method: 'post',
    response: ({ body }: { body: Record<string, unknown> }) => {
      const id = nextId++
      const now = new Date().toISOString().replace('T', ' ').slice(0, 19)
      records[id] = {
        id,
        pid: (body.pid as number) || 0,
        name: body.name as string,
        sortOrder: (body.sortOrder as number) || 0,
        gmtCreate: now,
      }
      return { code: 0, data: id, message: 'success' }
    },
  },
  {
    url: /\/api\/v1\/sys\/group\/\d+$/,
    method: 'put',
    response: ({ body, url }: { body: Record<string, unknown>; url: string }) => {
      const id = parseInt(url.split('/').pop()!)
      if (!records[id]) return { code: -1, message: '分组不存在' }
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
    url: '/api/v1/sys/group',
    method: 'delete',
    response: ({ body }: { body: number[] }) => {
      body.forEach((id) => delete records[id])
      return { code: 0, message: 'success' }
    },
  },
] as MockMethod[]
