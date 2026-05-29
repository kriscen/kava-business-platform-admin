import type { MockMethod } from 'vite-plugin-mock'

const PLATFORM_MENUS = [
  {
    key: 'dashboard',
    label: '仪表盘',
    icon: 'LayoutDashboard',
    path: '/platform/dashboard',
    sort: 1,
  },
  {
    key: 'system',
    label: '系统管理',
    icon: 'Settings',
    sort: 2,
    children: [
      {
        key: 'system-users',
        label: '用户管理',
        path: '/platform/system/users',
        sort: 1,
      },
      {
        key: 'system-roles',
        label: '角色管理',
        path: '/platform/system/roles',
        sort: 2,
      },
      {
        key: 'system-tenants',
        label: '租户管理',
        path: '/platform/system/tenants',
        sort: 3,
      },
      {
        key: 'system-menus',
        label: '菜单管理',
        path: '/platform/system/menus',
        sort: 4,
      },
    ],
  },
]

const TENANT_MENUS = [
  {
    key: 'dashboard',
    label: '仪表盘',
    icon: 'LayoutDashboard',
    path: '/tenant/dashboard',
    sort: 1,
  },
  {
    key: 'profile',
    label: '个人信息',
    icon: 'User',
    path: '/tenant/profile',
    sort: 2,
  },
]

export default [
  {
    url: '/api/menu/user',
    method: 'get',
    response: () => ({
      code: 0,
      data: PLATFORM_MENUS,
      message: 'success',
    }),
  },
  {
    url: '/api/menu/list',
    method: 'get',
    response: ({ headers }: { headers: Record<string, string> }) => {
      const authHeader = headers.authorization || ''
      const token = authHeader.replace('Bearer ', '')

      let role = 'platform_admin'
      try {
        if (token.startsWith('mock.')) {
          const payload = JSON.parse(atob(token.split('.')[1]))
          role = payload.role || 'platform_admin'
        }
      } catch {
        // fallback to platform_admin
      }

      return {
        code: 0,
        data: role === 'tenant_admin' ? TENANT_MENUS : PLATFORM_MENUS,
        message: 'success',
      }
    },
  },
] as MockMethod[]
