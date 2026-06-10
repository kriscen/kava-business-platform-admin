import type { MockMethod } from 'vite-plugin-mock'

let nextId = 100
const records: Record<
  number,
  {
    id: number
    name: string
    permission: string
    pid: number
    path: string
    component: string
    icon: string
    sortOrder: number
    menuType: string
    visible: string
    keepAlive: string
    embedded: string
    gmtCreate: string
    gmtModified: string
  }
> = {
  1: {
    id: 1,
    name: '系统管理',
    permission: '',
    pid: 0,
    path: '/system',
    component: '',
    icon: 'Settings',
    sortOrder: 1,
    menuType: '0',
    visible: '0',
    keepAlive: '0',
    embedded: '0',
    gmtCreate: '2025-01-01 00:00:00',
    gmtModified: '2025-01-01 00:00:00',
  },
  2: {
    id: 2,
    name: '用户管理',
    permission: 'sys:user:list',
    pid: 1,
    path: '/system/users',
    component: 'system/users/index',
    icon: 'Users',
    sortOrder: 1,
    menuType: '0',
    visible: '0',
    keepAlive: '0',
    embedded: '0',
    gmtCreate: '2025-01-01 00:00:00',
    gmtModified: '2025-01-01 00:00:00',
  },
  3: {
    id: 3,
    name: '新增用户',
    permission: 'sys:user:add',
    pid: 2,
    path: '',
    component: '',
    icon: '',
    sortOrder: 1,
    menuType: '1',
    visible: '0',
    keepAlive: '0',
    embedded: '0',
    gmtCreate: '2025-01-01 00:00:00',
    gmtModified: '2025-01-01 00:00:00',
  },
  4: {
    id: 4,
    name: '编辑用户',
    permission: 'sys:user:edit',
    pid: 2,
    path: '',
    component: '',
    icon: '',
    sortOrder: 2,
    menuType: '1',
    visible: '0',
    keepAlive: '0',
    embedded: '0',
    gmtCreate: '2025-01-01 00:00:00',
    gmtModified: '2025-01-01 00:00:00',
  },
  5: {
    id: 5,
    name: '删除用户',
    permission: 'sys:user:delete',
    pid: 2,
    path: '',
    component: '',
    icon: '',
    sortOrder: 3,
    menuType: '1',
    visible: '0',
    keepAlive: '0',
    embedded: '0',
    gmtCreate: '2025-01-01 00:00:00',
    gmtModified: '2025-01-01 00:00:00',
  },
  6: {
    id: 6,
    name: '角色管理',
    permission: 'sys:role:list',
    pid: 1,
    path: '/system/role',
    component: 'system/role/index',
    icon: 'Shield',
    sortOrder: 2,
    menuType: '0',
    visible: '0',
    keepAlive: '0',
    embedded: '0',
    gmtCreate: '2025-01-01 00:00:00',
    gmtModified: '2025-01-01 00:00:00',
  },
  7: {
    id: 7,
    name: '菜单管理',
    permission: 'sys:menu:list',
    pid: 1,
    path: '/system/menu',
    component: 'system/menu/index',
    icon: 'Menu',
    sortOrder: 3,
    menuType: '0',
    visible: '0',
    keepAlive: '0',
    embedded: '0',
    gmtCreate: '2025-01-01 00:00:00',
    gmtModified: '2025-01-01 00:00:00',
  },
  8: {
    id: 8,
    name: '部门管理',
    permission: 'sys:dept:list',
    pid: 1,
    path: '/system/dept',
    component: 'system/dept/index',
    icon: 'Building2',
    sortOrder: 4,
    menuType: '0',
    visible: '0',
    keepAlive: '0',
    embedded: '0',
    gmtCreate: '2025-01-01 00:00:00',
    gmtModified: '2025-01-01 00:00:00',
  },
  9: {
    id: 9,
    name: '租户管理',
    permission: 'sys:tenant:list',
    pid: 1,
    path: '/system/tenant',
    component: 'system/tenant/index',
    icon: 'Building',
    sortOrder: 5,
    menuType: '0',
    visible: '0',
    keepAlive: '0',
    embedded: '0',
    gmtCreate: '2025-01-01 00:00:00',
    gmtModified: '2025-01-01 00:00:00',
  },
  10: {
    id: 10,
    name: '公共参数',
    permission: 'sys:publicParam:list',
    pid: 1,
    path: '/system/public-param',
    component: 'system/public-param/index',
    icon: 'Sliders',
    sortOrder: 6,
    menuType: '0',
    visible: '0',
    keepAlive: '0',
    embedded: '0',
    gmtCreate: '2025-01-01 00:00:00',
    gmtModified: '2025-01-01 00:00:00',
  },
  11: {
    id: 11,
    name: '分组管理',
    permission: 'sys:group:list',
    pid: 1,
    path: '/system/group',
    component: 'system/group/index',
    icon: 'FolderTree',
    sortOrder: 7,
    menuType: '0',
    visible: '0',
    keepAlive: '0',
    embedded: '0',
    gmtCreate: '2025-01-01 00:00:00',
    gmtModified: '2025-01-01 00:00:00',
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

function buildTree(pid: number): Record<string, unknown>[] {
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
    url: '/api/v1/sys/menu/page',
    method: 'get',
    response: ({ query }: { query: Record<string, string> }) => {
      let list = Object.values(records).map(toFlatItem)
      if (query.name) {
        list = list.filter((r) => r.name.includes(query.name))
      }
      if (query.menuType) {
        list = list.filter((r) => r.menuType === query.menuType)
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
    url: '/api/v1/sys/menu/tree',
    method: 'get',
    response: () => ({
      code: 0,
      data: buildTree(0),
      message: 'success',
    }),
  },
  {
    url: /\/api\/v1\/sys\/menu\/\d+$/,
    method: 'get',
    response: ({ query }: { query: Record<string, string> }) => {
      const urlParts = query.url?.split('/') || []
      const id = parseInt(urlParts[urlParts.length - 1])
      const r = records[id]
      if (!r) return { code: -1, message: '菜单不存在' }
      return { code: 0, data: toFlatItem(r), message: 'success' }
    },
  },
  {
    url: '/api/v1/sys/menu',
    method: 'post',
    response: ({ body }: { body: Record<string, unknown> }) => {
      const id = nextId++
      const now = new Date().toISOString().replace('T', ' ').slice(0, 19)
      records[id] = {
        id,
        name: body.name as string,
        permission: (body.permission as string) || '',
        pid: (body.pid as number) || 0,
        path: (body.path as string) || '',
        component: (body.component as string) || '',
        icon: (body.icon as string) || '',
        sortOrder: (body.sortOrder as number) || 0,
        menuType: (body.menuType as string) || '0',
        visible: (body.visible as string) ?? '0',
        keepAlive: (body.keepAlive as string) ?? '0',
        embedded: (body.embedded as string) ?? '0',
        gmtCreate: now,
        gmtModified: now,
      }
      return { code: 0, data: id, message: 'success' }
    },
  },
  {
    url: /\/api\/v1\/sys\/menu\/\d+$/,
    method: 'put',
    response: ({ body, url }: { body: Record<string, unknown>; url: string }) => {
      const id = parseInt(url.split('/').pop()!)
      if (!records[id]) return { code: -1, message: '菜单不存在' }
      records[id] = {
        ...records[id],
        name: (body.name as string) ?? records[id].name,
        permission: (body.permission as string) ?? records[id].permission,
        pid: (body.pid as number) ?? records[id].pid,
        path: (body.path as string) ?? records[id].path,
        component: (body.component as string) ?? records[id].component,
        icon: (body.icon as string) ?? records[id].icon,
        sortOrder: (body.sortOrder as number) ?? records[id].sortOrder,
        menuType: (body.menuType as string) ?? records[id].menuType,
        visible: (body.visible as string) ?? records[id].visible,
        keepAlive: (body.keepAlive as string) ?? records[id].keepAlive,
        embedded: (body.embedded as string) ?? records[id].embedded,
        gmtModified: new Date().toISOString().replace('T', ' ').slice(0, 19),
      }
      return { code: 0, message: 'success' }
    },
  },
  {
    url: '/api/v1/sys/menu',
    method: 'delete',
    response: ({ body }: { body: number[] }) => {
      const hasChildren = body.some((id) => Object.values(records).some((r) => r.pid === id))
      if (hasChildren) return { code: -1, message: '存在子菜单，无法删除' }
      body.forEach((id) => delete records[id])
      return { code: 0, message: 'success' }
    },
  },
] as MockMethod[]
