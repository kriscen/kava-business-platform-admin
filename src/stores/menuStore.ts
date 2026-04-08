import { create } from 'zustand'
import { useAuthStore, type UserRole } from '@/stores/authStore'
import type { MenuItem } from '@/types'

/**
 * 菜单配置
 */
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
    path: '/dashboard',
    roles: ['platform_admin', 'tenant_admin'],
  },
  {
    key: 'system',
    label: '系统管理',
    path: '/system',
    roles: ['platform_admin'],
    children: [
      {
        key: 'system-users',
        label: '用户管理',
        path: '/system/users',
        roles: ['platform_admin'],
      },
    ],
  },
]

const TENANT_MENUS: MenuConfig[] = [
  {
    key: 'dashboard',
    label: '仪表盘',
    path: '/dashboard',
    roles: ['platform_admin', 'tenant_admin'],
  },
]

/**
 * 菜单状态
 */
interface MenuState {
  menus: MenuItem[]
}

/**
 * 菜单操作
 */
interface MenuActions {
  buildMenus: () => void
}

type MenuStore = MenuState & MenuActions

/**
 * 根据角色过滤菜单
 */
function filterMenusByRole(menus: MenuConfig[], role: UserRole): MenuItem[] {
  return menus
    .filter((menu) => menu.roles.includes(role))
    .map((menu) => {
      const item: MenuItem = {
        key: menu.key,
        label: menu.label,
        path: menu.path,
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
}))
