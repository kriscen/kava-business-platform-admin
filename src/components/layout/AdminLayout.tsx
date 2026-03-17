import { useEffect } from 'react'
import { Layout } from 'antd'
import Sidebar from './Sidebar'
import Header from './Header'
import Content from './Content'
import { useAppStore } from '@/stores'
import type { MenuItem } from '@/types'

interface AdminLayoutProps {
  title?: string
  menus?: MenuItem[]
  children?: React.ReactNode
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ title, menus, children }) => {
  const { sidebarCollapsed, setSidebarCollapsed } = useAppStore()

  // 响应式处理：小于 768px 自动折叠
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true)
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [setSidebarCollapsed])

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout.Sider
        collapsible
        collapsed={sidebarCollapsed}
        onCollapse={setSidebarCollapsed}
        trigger={null}
        style={{
          overflow: 'hidden',
          background: '#fff',
          borderRight: '1px solid #f0f0f0',
        }}
        width={200}
        collapsedWidth={80}
      >
        <Sidebar collapsed={sidebarCollapsed} menus={menus} />
      </Layout.Sider>
      <Layout>
        <Layout.Header style={{ padding: 0, height: 64, background: '#fff' }}>
          <Header title={title} />
        </Layout.Header>
        <Layout.Content>
          <Content>{children}</Content>
        </Layout.Content>
      </Layout>
    </Layout>
  )
}

export default AdminLayout