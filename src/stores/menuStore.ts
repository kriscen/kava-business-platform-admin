import { create } from 'zustand'
import { useAuthStore, type UserRole } from '@/stores/authStore'
import type { MenuItem } from '@/types'

interface MenuConfig {
  key: string
  label: string
  path: string
  icon?: string
  roles: UserRole[]
  children?: MenuConfig[]
}

const PLATFORM_MENUS: MenuConfig[] = [
  {
    key: 'dashboard',
    label: '仪表盘',
    path: '/platform/dashboard',
    icon: 'LayoutDashboard',
    roles: ['platform_admin'],
  },
  {
    key: 'system',
    label: '系统管理',
    path: '/platform/system',
    icon: 'Settings',
    roles: ['platform_admin'],
    children: [
      {
        key: 'system-users',
        label: '用户管理',
        path: '/platform/system/users',
        roles: ['platform_admin'],
      },
    ],
  },
]

const TENANT_MENUS: MenuConfig[] = [
  {
    key: 'dashboard',
    label: '仪表盘',
    path: '/tenant/dashboard',
    icon: 'LayoutDashboard',
    roles: ['tenant_admin'],
  },
  {
    key: 'profile',
    label: '个人信息',
    path: '/tenant/profile',
    icon: 'User',
    roles: ['tenant_admin'],
  },
]

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
    .filter((menu) => menu.roles.includes(role))
    .map((menu) => {
      const item: MenuItem = {
        key: menu.key,
        label: menu.label,
        path: menu.path,
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

    const allMenus = role === 'platform_admin' ? PLATFORM_MENUS : TENANT_MENUS
    const filteredMenus = filterMenusByRole(allMenus, role)

    set({ menus: filteredMenus })
  },

  getMenuByRole: (role: UserRole) => {
    const allMenus = role === 'platform_admin' ? PLATFORM_MENUS : TENANT_MENUS
    return filterMenusByRole(allMenus, role)
  },
}))
