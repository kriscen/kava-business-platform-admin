import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import Content from '@/components/layout/Content'
import { useAppStore } from '@/stores'
import { useMenuStore } from '@/stores/menuStore'

const PlatformLayout: React.FC = () => {
  const { sidebarCollapsed, setSidebarCollapsed } = useAppStore()
  const { menus, buildMenus } = useMenuStore()

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

  useEffect(() => {
    buildMenus()
  }, [buildMenus])

  return (
    <div className="flex min-h-screen">
      <aside
        className="flex h-screen flex-col border-r border-border bg-sidebar transition-all duration-200"
        style={{ width: sidebarCollapsed ? '80px' : '200px' }}
      >
        <Sidebar collapsed={sidebarCollapsed} menus={menus} />
      </aside>
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="h-16 border-b border-border bg-white">
          <Header />
        </header>
        <main className="flex-1">
          <Content>
            <Outlet />
          </Content>
        </main>
      </div>
    </div>
  )
}

export default PlatformLayout
