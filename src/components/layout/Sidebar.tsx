import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Settings, ChevronDown, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { MenuItem } from '@/types'

interface SidebarProps {
  collapsed: boolean
  menus?: MenuItem[]
}

const defaultMenus: MenuItem[] = [
  {
    key: 'dashboard',
    label: '仪表盘',
    icon: 'LayoutDashboard',
    path: '/dashboard',
  },
  {
    key: 'system',
    label: '系统管理',
    icon: 'Settings',
    children: [
      {
        key: 'users',
        label: '用户管理',
        path: '/system/users',
      },
    ],
  },
]

// 图标映射
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Settings,
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, menus = defaultMenus }) => {
  const location = useLocation()
  const [expandedKeys, setExpandedKeys] = useState<string[]>(['system'])

  const toggleExpand = (key: string) => {
    setExpandedKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    )
  }

  const renderMenuItem = (item: MenuItem, level = 0) => {
    const Icon = item.icon ? iconMap[item.icon as string] : null
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedKeys.includes(item.key)
    const isActive = item.path === location.pathname

    if (hasChildren) {
      return (
        <div key={item.key}>
          <button
            onClick={() => toggleExpand(item.key)}
            className={cn(
              'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground',
              level > 0 && 'pl-6'
            )}
          >
            {Icon && <Icon className="size-4 shrink-0" />}
            {!collapsed && (
              <>
                <span className="flex-1 text-left">{item.label}</span>
                {isExpanded ? (
                  <ChevronDown className="size-4" />
                ) : (
                  <ChevronRight className="size-4" />
                )}
              </>
            )}
          </button>
          {!collapsed && isExpanded && (
            <div className="mt-1">
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
        className={cn(
          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
          isActive
            ? 'bg-accent text-accent-foreground'
            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
          level > 0 && 'pl-6'
        )}
      >
        {Icon && <Icon className="size-4 shrink-0" />}
        {!collapsed && <span>{item.label}</span>}
      </Link>
    )
  }

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center justify-center border-b border-border font-semibold text-primary">
        {collapsed ? 'KA' : 'Kava Admin'}
      </div>
      {/* 菜单 */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-2">
        {menus.map((item) => renderMenuItem(item))}
      </nav>
    </div>
  )
}

export default Sidebar