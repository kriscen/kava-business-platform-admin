import { create } from 'zustand'
import i18n from '@/i18n'
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
    label: 'layout.dashboard',
    path: '/platform/dashboard',
    icon: 'LayoutDashboard',
    roles: ['platform_admin'],
  },
  {
    key: 'system',
    label: 'layout.system',
    path: '/platform/system',
    icon: 'Settings',
    roles: ['platform_admin'],
    children: [
      {
        key: 'system-users',
        label: 'layout.userManagement',
        path: '/platform/system/users',
        roles: ['platform_admin'],
      },
    ],
  },
]

const TENANT_MENUS: MenuConfig[] = [
  {
    key: 'dashboard',
    label: 'layout.dashboard',
    path: '/tenant/dashboard',
    icon: 'LayoutDashboard',
    roles: ['tenant_admin'],
  },
  {
    key: 'profile',
    label: 'layout.profile',
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
        label: i18n.t(menu.label),
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
