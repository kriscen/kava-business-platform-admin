import { Menu } from 'antd'
import { DashboardOutlined, SettingOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import type { MenuItem } from '@/types'

interface SidebarProps {
  collapsed: boolean
  menus?: MenuItem[]
}

const defaultMenus: MenuItem[] = [
  {
    key: 'dashboard',
    label: '仪表盘',
    icon: <DashboardOutlined />,
    path: '/dashboard',
  },
  {
    key: 'system',
    label: '系统管理',
    icon: <SettingOutlined />,
    children: [
      {
        key: 'users',
        label: '用户管理',
        path: '/system/users',
      },
    ],
  },
]

const Sidebar: React.FC<SidebarProps> = ({ collapsed, menus = defaultMenus }) => {
  const convertToAntdItems = (items: MenuItem[]): MenuProps['items'] => {
    return items.map((item) => ({
      key: item.key,
      icon: item.icon,
      label: item.path ? <a href={item.path}>{item.label}</a> : item.label,
      children: item.children ? convertToAntdItems(item.children) : undefined,
    }))
  }

  return (
    <div
      style={{
        width: collapsed ? 80 : 200,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.2s',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: '1px solid #f0f0f0',
          fontWeight: 600,
          color: '#1890ff',
        }}
      >
        {collapsed ? 'KA' : 'Kava Admin'}
      </div>
      <Menu
        mode="inline"
        inlineCollapsed={collapsed}
        items={convertToAntdItems(menus)}
        style={{ flex: 1, borderRight: 0 }}
      />
    </div>
  )
}

export default Sidebar