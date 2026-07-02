import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import Content from '@/components/layout/Content'
import { useAppStore } from '@/stores'
import { useMenuStore } from '@/stores/menuStore'

const MainLayout: React.FC = () => {
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
    <div className="flex min-h-screen bg-muted/30 text-foreground">
      <aside
        className="sticky top-0 z-30 flex h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-all duration-200"
        style={{ width: sidebarCollapsed ? '80px' : '232px' }}
      >
        <Sidebar collapsed={sidebarCollapsed} menus={menus} />
      </aside>
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="sticky top-0 z-20 h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85">
          <Header />
        </header>
        <main className="min-w-0 flex-1">
          <Content>
            <Outlet />
          </Content>
        </main>
      </div>
    </div>
  )
}

export default MainLayout
