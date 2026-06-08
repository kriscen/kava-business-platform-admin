import type { MockMethod } from 'vite-plugin-mock'

let nextId = 100
const records: Record<
  number,
  {
    id: number
    pid: number
    name: string
    adcode: number
    areaType: string
    areaStatus: string
    cityCode: string
    gmtCreate: string
  }
> = {
  1: {
    id: 1,
    pid: 0,
    name: '中国',
    adcode: 100000,
    areaType: '0',
    areaStatus: '1',
    cityCode: '',
    gmtCreate: '2025-01-01 00:00:00',
  },
  2: {
    id: 2,
    pid: 1,
    name: '北京市',
    adcode: 110000,
    areaType: '1',
    areaStatus: '1',
    cityCode: '010',
    gmtCreate: '2025-01-01 00:00:00',
  },
  3: {
    id: 3,
    pid: 2,
    name: '东城区',
    adcode: 110101,
    areaType: '2',
    areaStatus: '1',
    cityCode: '010',
    gmtCreate: '2025-01-01 00:00:00',
  },
  4: {
    id: 4,
    pid: 2,
    name: '西城区',
    adcode: 110102,
    areaType: '2',
    areaStatus: '1',
    cityCode: '010',
    gmtCreate: '2025-01-01 00:00:00',
  },
  5: {
    id: 5,
    pid: 2,
    name: '朝阳区',
    adcode: 110105,
    areaType: '2',
    areaStatus: '1',
    cityCode: '010',
    gmtCreate: '2025-01-01 00:00:00',
  },
  6: {
    id: 6,
    pid: 1,
    name: '上海市',
    adcode: 310000,
    areaType: '1',
    areaStatus: '1',
    cityCode: '021',
    gmtCreate: '2025-01-01 00:00:00',
  },
  7: {
    id: 7,
    pid: 6,
    name: '黄浦区',
    adcode: 310101,
    areaType: '2',
    areaStatus: '1',
    cityCode: '021',
    gmtCreate: '2025-01-01 00:00:00',
  },
  8: {
    id: 8,
    pid: 6,
    name: '浦东新区',
    adcode: 310115,
    areaType: '2',
    areaStatus: '1',
    cityCode: '021',
    gmtCreate: '2025-01-01 00:00:00',
  },
  9: {
    id: 9,
    pid: 1,
    name: '广东省',
    adcode: 440000,
    areaType: '1',
    areaStatus: '1',
    cityCode: '',
    gmtCreate: '2025-01-01 00:00:00',
  },
  10: {
    id: 10,
    pid: 9,
    name: '深圳市',
    adcode: 440300,
    areaType: '2',
    areaStatus: '1',
    cityCode: '0755',
    gmtCreate: '2025-01-01 00:00:00',
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
    .sort((a, b) => a.adcode - b.adcode)
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
    url: '/api/v1/sys/area/page',
    method: 'get',
    response: ({ query }: { query: Record<string, string> }) => {
      let list = Object.values(records).map(toFlatItem)
      if (query.name) {
        list = list.filter((r) => r.name.includes(query.name))
      }
      if (query.areaType) {
        list = list.filter((r) => r.areaType === query.areaType)
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
    url: '/api/v1/sys/area/tree',
    method: 'get',
    response: ({ query }: { query: Record<string, string> }) => {
      const tree = buildTree(0)
      if (query.areaType) {
        function filterTree(nodes: ReturnType<typeof buildTree>): ReturnType<typeof buildTree> {
          return nodes
            .map((n) => {
              if (n.areaType === query.areaType) return n
              const children = n.children
                ? filterTree(n.children as ReturnType<typeof buildTree>)
                : []
              return children.length > 0 ? { ...n, children } : null
            })
            .filter(Boolean) as ReturnType<typeof buildTree>
        }
        return { code: 0, data: filterTree(tree), message: 'success' }
      }
      return { code: 0, data: tree, message: 'success' }
    },
  },
  {
    url: '/api/v1/sys/area/children',
    method: 'get',
    response: ({ query }: { query: Record<string, string> }) => {
      const pid = parseInt(query.pid || '100000')
      const children = Object.values(records)
        .filter((r) => r.pid === pid)
        .map(toFlatItem)
      return { code: 0, data: children, message: 'success' }
    },
  },
  {
    url: /\/api\/v1\/sys\/area\/\d+$/,
    method: 'get',
    response: ({ query }: { query: Record<string, string> }) => {
      const urlParts = query.url?.split('/') || []
      const id = parseInt(urlParts[urlParts.length - 1])
      const r = records[id]
      if (!r) return { code: -1, message: '区域不存在' }
      return { code: 0, data: toFlatItem(r), message: 'success' }
    },
  },
  {
    url: '/api/v1/sys/area',
    method: 'post',
    response: ({ body }: { body: Record<string, unknown> }) => {
      const id = nextId++
      const now = new Date().toISOString().replace('T', ' ').slice(0, 19)
      records[id] = {
        id,
        pid: (body.pid as number) || 0,
        name: body.name as string,
        adcode: (body.adcode as number) || 0,
        areaType: (body.areaType as string) || '3',
        areaStatus: (body.areaStatus as string) || '1',
        cityCode: (body.cityCode as string) || '',
        gmtCreate: now,
      }
      return { code: 0, data: id, message: 'success' }
    },
  },
  {
    url: /\/api\/v1\/sys\/area\/\d+$/,
    method: 'put',
    response: ({ body, url }: { body: Record<string, unknown>; url: string }) => {
      const id = parseInt(url.split('/').pop()!)
      if (!records[id]) return { code: -1, message: '区域不存在' }
      records[id] = {
        ...records[id],
        name: (body.name as string) ?? records[id].name,
        pid: (body.pid as number) ?? records[id].pid,
        adcode: (body.adcode as number) ?? records[id].adcode,
        areaType: (body.areaType as string) ?? records[id].areaType,
        areaStatus: (body.areaStatus as string) ?? records[id].areaStatus,
        cityCode: (body.cityCode as string) ?? records[id].cityCode,
      }
      return { code: 0, message: 'success' }
    },
  },
  {
    url: '/api/v1/sys/area',
    method: 'delete',
    response: ({ body }: { body: number[] }) => {
      body.forEach((id) => delete records[id])
      return { code: 0, message: 'success' }
    },
  },
] as MockMethod[]
