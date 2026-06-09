import { create } from 'zustand'
import i18n from '@/i18n'
import { useAuthStore, type UserRole } from '@/stores/authStore'
import type { MenuItem } from '@/types'

interface MenuConfig {
  key: string
  label: string
  path: string
  icon?: string
  allowedRoles: UserRole[]
  children?: MenuConfig[]
}

const ALL_MENUS: MenuConfig[] = [
  {
    key: 'dashboard',
    label: 'layout.dashboard',
    path: '/dashboard',
    icon: 'LayoutDashboard',
    allowedRoles: ['platform_admin', 'tenant_admin'],
  },
  {
    key: 'system',
    label: 'layout.system',
    path: '/system',
    icon: 'Settings',
    allowedRoles: ['platform_admin'],
    children: [
      {
        key: 'system-users',
        label: 'layout.userManagement',
        path: '/system/users',
        allowedRoles: ['platform_admin'],
      },
      {
        key: 'system-tenant',
        label: 'layout.tenantManagement',
        path: '/system/tenant',
        allowedRoles: ['platform_admin'],
      },
      {
        key: 'system-public-param',
        label: 'layout.publicParamManagement',
        path: '/system/public-param',
        allowedRoles: ['platform_admin'],
      },
      {
        key: 'system-role',
        label: 'layout.roleManagement',
        path: '/system/role',
        allowedRoles: ['platform_admin', 'tenant_admin'],
      },
      {
        key: 'system-menu',
        label: 'layout.menuManagement',
        path: '/system/menu',
        allowedRoles: ['platform_admin', 'tenant_admin'],
      },
      {
        key: 'system-area',
        label: 'layout.areaManagement',
        path: '/system/area',
        allowedRoles: ['platform_admin', 'tenant_admin'],
      },
      {
        key: 'system-i18n',
        label: 'layout.i18nManagement',
        path: '/system/i18n',
        allowedRoles: ['platform_admin', 'tenant_admin'],
      },
      {
        key: 'system-route-conf',
        label: 'layout.routeConfManagement',
        path: '/system/route-conf',
        allowedRoles: ['platform_admin', 'tenant_admin'],
      },
      {
        key: 'system-oauth-client',
        label: 'layout.oauthClientManagement',
        path: '/system/oauth-client',
        allowedRoles: ['platform_admin', 'tenant_admin'],
      },
      {
        key: 'system-log',
        label: 'layout.logManagement',
        path: '/system/log',
        allowedRoles: ['platform_admin'],
      },
      {
        key: 'system-audit-log',
        label: 'layout.auditLogManagement',
        path: '/system/audit-log',
        allowedRoles: ['platform_admin'],
      },
      {
        key: 'system-file',
        label: 'layout.fileManagement',
        path: '/system/file',
        allowedRoles: ['platform_admin'],
      },
      {
        key: 'system-file-group',
        label: 'layout.fileGroupManagement',
        path: '/system/file-group',
        allowedRoles: ['platform_admin'],
      },
      {
        key: 'system-app',
        label: 'layout.appManagement',
        path: '/system/app',
        allowedRoles: ['platform_admin'],
      },
    ],
  },
  {
    key: 'profile',
    label: 'layout.profile',
    path: '/profile',
    icon: 'User',
    allowedRoles: ['tenant_admin'],
  },
]

export function getBasePath(role: UserRole): string {
  return role === 'tenant_admin' ? '/tenant' : '/platform'
}

interface MenuState {
  menus: MenuItem[]
}

interface MenuActions {
  buildMenus: () => void
  getMenuByRole: (role: UserRole) => MenuItem[]
}

type MenuStore = MenuState & MenuActions

function filterMenusByRole(menus: MenuConfig[], role: UserRole): MenuItem[] {
  return menus
    .filter((menu) => menu.allowedRoles.includes(role))
    .map((menu) => {
      const basePath = getBasePath(role)
      const item: MenuItem = {
        key: menu.key,
        label: i18n.t(menu.label),
        path: `${basePath}${menu.path}`,
        icon: menu.icon,
      }
      if (menu.children) {
        item.children = filterMenusByRole(menu.children, role)
      }
      return item
    })
}

export const useMenuStore = create<MenuStore>((set) => ({
  menus: [],

  buildMenus: () => {
    const userInfo = useAuthStore.getState().userInfo
    const role = userInfo?.role || 'platform_admin'

    const filteredMenus = filterMenusByRole(ALL_MENUS, role)

    set({ menus: filteredMenus })
  },

  getMenuByRole: (role: UserRole) => {
    return filterMenusByRole(ALL_MENUS, role)
  },
}))
