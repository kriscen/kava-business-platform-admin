import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { User, Settings, LogOut, PanelLeftClose, PanelLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '@/stores'
import { useAuthStore } from '@/stores/authStore'
import { usePageTitle } from '@/hooks'

const Header: React.FC = () => {
  const { t } = useTranslation()
  const { sidebarCollapsed, toggleSidebar } = useAppStore()
  const { userInfo, logout } = useAuthStore()
  const pageTitle = usePageTitle()

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          aria-label={t('layout.toggleSidebar')}
          title={t('layout.toggleSidebar')}
          onClick={toggleSidebar}
        >
          {sidebarCollapsed ? (
            <PanelLeft className="size-5" />
          ) : (
            <PanelLeftClose className="size-5" />
          )}
        </Button>
        <div className="min-w-0">
          <h1 className="truncate text-lg font-semibold">{pageTitle || t('layout.title')}</h1>
        </div>
      </div>
      <div className="flex shrink-0 items-center">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex h-10 cursor-pointer items-center gap-2 rounded-md px-2 text-sm transition-colors hover:bg-muted focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50">
            <Avatar size="sm">
              <AvatarFallback>
                <User className="size-4" />
              </AvatarFallback>
            </Avatar>
            <span className="hidden max-w-36 truncate sm:inline">
              {userInfo?.username || t('common.admin')}
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={4}>
            <DropdownMenuItem>
              <User className="size-4" />
              {t('layout.profile')}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="size-4" />
              {t('layout.settings')}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={handleLogout}>
              <LogOut className="size-4" />
              {t('layout.logout')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export default Header
