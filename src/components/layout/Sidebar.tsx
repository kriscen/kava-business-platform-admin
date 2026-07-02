import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Settings,
  User,
  Users,
  Building2,
  Wrench,
  Shield,
  Menu,
  MapPin,
  Globe,
  Route,
  KeyRound,
  FileText,
  ClipboardList,
  File,
  FolderOpen,
  AppWindow,
  Group,
  ChevronDown,
  ChevronRight,
} from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import type { MenuItem } from '@/types'

interface SidebarProps {
  collapsed: boolean
  menus?: MenuItem[]
}

const defaultMenus: MenuItem[] = [
  {
    key: 'dashboard',
    label: 'layout.dashboard',
    icon: 'LayoutDashboard',
    path: '/dashboard',
  },
  {
    key: 'system',
    label: 'layout.system',
    icon: 'Settings',
    children: [
      {
        key: 'users',
        label: 'layout.userManagement',
        path: '/system/users',
      },
    ],
  },
]

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Settings,
  User,
  Users,
  Building2,
  Wrench,
  Shield,
  Menu,
  MapPin,
  Globe,
  Route,
  KeyRound,
  FileText,
  ClipboardList,
  File,
  FolderOpen,
  AppWindow,
  Group,
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, menus = defaultMenus }) => {
  const { t } = useTranslation()
  const location = useLocation()
  const [expandedKeys, setExpandedKeys] = useState<string[]>(['system'])

  const toggleExpand = (key: string) => {
    setExpandedKeys((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]))
  }

  const renderMenuItem = (item: MenuItem, level = 0) => {
    const Icon = item.icon ? iconMap[item.icon as string] : null
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedKeys.includes(item.key)
    const isActive = item.path === location.pathname
    const isChildActive = item.children?.some((child) => child.path === location.pathname) ?? false
    const label = t(item.label)

    if (hasChildren) {
      return (
        <div key={item.key}>
          <button
            type="button"
            aria-expanded={!collapsed ? isExpanded : undefined}
            aria-label={collapsed ? label : undefined}
            title={collapsed ? label : undefined}
            onClick={() => toggleExpand(item.key)}
            className={cn(
              'flex min-h-10 w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50',
              (isActive || isChildActive) && 'bg-sidebar-accent text-sidebar-accent-foreground',
              collapsed && 'justify-center',
              level > 0 && !collapsed && 'pl-6'
            )}
          >
            {Icon && <Icon className="size-4 shrink-0" />}
            {!collapsed && (
              <>
                <span className="min-w-0 flex-1 truncate text-left">{label}</span>
                {isExpanded ? (
                  <ChevronDown className="size-4" />
                ) : (
                  <ChevronRight className="size-4" />
                )}
              </>
            )}
          </button>
          {!collapsed && isExpanded && (
            <div className="mt-1 space-y-1">
              {item.children!.map((child) => renderMenuItem(child, level + 1))}
            </div>
          )}
        </div>
      )
    }

    return (
      <Link
        key={item.key}
        to={item.path || '#'}
        aria-current={isActive ? 'page' : undefined}
        aria-label={collapsed ? label : undefined}
        title={collapsed ? label : undefined}
        className={cn(
          'flex min-h-10 items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50',
          isActive
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
          collapsed && 'justify-center',
          level > 0 && !collapsed && 'pl-6'
        )}
      >
        {Icon && <Icon className="size-4 shrink-0" />}
        {!collapsed && <span className="truncate">{label}</span>}
      </Link>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-3 font-semibold text-sidebar-foreground">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary text-sm text-primary-foreground">
          KA
        </div>
        {!collapsed && <span className="truncate">{t('layout.title')}</span>}
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-2" aria-label={t('layout.system')}>
        {menus.map((item) => renderMenuItem(item))}
      </nav>
    </div>
  )
}

export default Sidebar
