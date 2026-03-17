import { Avatar, Dropdown, Space, Button } from 'antd'
import { UserOutlined, LogoutOutlined, SettingOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '@/stores'

interface HeaderProps {
  title?: string
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const { t } = useTranslation()
  const { sidebarCollapsed, toggleSidebar } = useAppStore()

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: t('layout.profile'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: t('layout.settings'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: t('layout.logout'),
    },
  ]

  return (
    <div
      style={{
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        background: '#fff',
        borderBottom: '1px solid #f0f0f0',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Button
          type="text"
          icon={sidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={toggleSidebar}
          style={{ marginRight: 16 }}
        />
        <h1 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>{title || t('layout.title')}</h1>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
          <Space style={{ cursor: 'pointer' }}>
            <Avatar icon={<UserOutlined />} />
            <span>管理员</span>
          </Space>
        </Dropdown>
      </div>
    </div>
  )
}

export default Header