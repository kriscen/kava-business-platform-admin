import type { MockMethod } from 'vite-plugin-mock'

const records: Record<
  number,
  {
    id: number
    logType: string
    title: string
    requestUri: string
    method: string
    serviceId: string
    createBy: string
    remoteAddr: string
    params: string
    time: number
    exception: string
    gmtCreate: string
  }
> = {
  1: {
    id: 1,
    logType: '2',
    title: '修改用户信息',
    requestUri: '/api/v1/sys/user',
    method: 'PUT',
    serviceId: 'kava-upms',
    createBy: 'admin',
    remoteAddr: '192.168.1.100',
    params: '{"id":1,"username":"admin","nickname":"管理员"}',
    time: 45,
    exception: '',
    gmtCreate: '2025-06-01 10:30:00',
  },
  2: {
    id: 2,
    logType: '1',
    title: '新增角色',
    requestUri: '/api/v1/sys/role',
    method: 'POST',
    serviceId: 'kava-upms',
    createBy: 'admin',
    remoteAddr: '192.168.1.100',
    params: '{"roleName":"测试角色","roleCode":"test_role"}',
    time: 32,
    exception: '',
    gmtCreate: '2025-06-01 11:00:00',
  },
  3: {
    id: 3,
    logType: '3',
    title: '删除菜单',
    requestUri: '/api/v1/sys/menu',
    method: 'DELETE',
    serviceId: 'kava-upms',
    createBy: 'admin',
    remoteAddr: '192.168.1.100',
    params: '[99]',
    time: 28,
    exception: '',
    gmtCreate: '2025-06-02 09:15:00',
  },
  4: {
    id: 4,
    logType: '4',
    title: '查询用户列表',
    requestUri: '/api/v1/sys/user/page',
    method: 'GET',
    serviceId: 'kava-upms',
    createBy: 'admin',
    remoteAddr: '192.168.1.100',
    params: '{"pageNo":1,"pageSize":10}',
    time: 120,
    exception: '',
    gmtCreate: '2025-06-02 14:20:00',
  },
  5: {
    id: 5,
    logType: '0',
    title: '系统异常',
    requestUri: '/api/v1/sys/tenant',
    method: 'POST',
    serviceId: 'kava-upms',
    createBy: 'system',
    remoteAddr: '10.0.0.1',
    params: '{}',
    time: 5000,
    exception: 'java.lang.NullPointerException: ...',
    gmtCreate: '2025-06-03 08:00:00',
  },
}

export default [
  {
    url: '/api/v1/sys/log/page',
    method: 'get',
    response: ({ query }: { query: Record<string, string> }) => {
      let list = Object.values(records)
      if (query.title) {
        list = list.filter((r) => r.title.includes(query.title))
      }
      if (query.logType) {
        list = list.filter((r) => r.logType === query.logType)
      }
      if (query.createBy) {
        list = list.filter((r) => r.createBy.includes(query.createBy))
      }
      const pageNo = parseInt(query.pageNo || '1')
      const pageSize = parseInt(query.pageSize || '10')
      const start = (pageNo - 1) * pageSize
      return {
        code: 0,
        data: {
          records: list.slice(start, start + pageSize).map((r) => ({
            id: r.id,
            logType: r.logType,
            title: r.title,
            requestUri: r.requestUri,
            method: r.method,
            serviceId: r.serviceId,
            createBy: r.createBy,
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
    url: /\/api\/v1\/sys\/log\/\d+$/,
    method: 'get',
    response: ({ query }: { query: Record<string, string> }) => {
      const urlParts = query.url?.split('/') || []
      const id = parseInt(urlParts[urlParts.length - 1])
      const r = records[id]
      if (!r) return { code: -1, message: '日志不存在' }
      return { code: 0, data: r, message: 'success' }
    },
  },
] as MockMethod[]
