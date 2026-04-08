import { useEffect } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import Content from './Content'
import { useAppStore } from '@/stores'
import { useMenuStore } from '@/stores/menuStore'

interface AdminLayoutProps {
  title?: string
  children?: React.ReactNode
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ title, children }) => {
  const { sidebarCollapsed, setSidebarCollapsed } = useAppStore()
  const { menus: dynamicMenus, buildMenus } = useMenuStore()

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

  // 登录后构建动态菜单
  useEffect(() => {
    buildMenus()
  }, [buildMenus])

  return (
    <div className="flex min-h-screen">
      {/* 侧边栏 */}
      <aside
        className="flex h-screen flex-col border-r border-border bg-sidebar transition-all duration-200"
        style={{ width: sidebarCollapsed ? '80px' : '200px' }}
      >
        <Sidebar collapsed={sidebarCollapsed} menus={dynamicMenus} />
      </aside>
      {/* 主内容区 */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="h-16 border-b border-border bg-white">
          <Header title={title} />
        </header>
        <main className="flex-1">
          <Content>{children}</Content>
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
