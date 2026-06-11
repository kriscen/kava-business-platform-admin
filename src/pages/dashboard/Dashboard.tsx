import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Users, Building2, AppWindow, Shield, Menu, KeyRound, UserCircle } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { getBasePath } from '@/stores/menuStore'
import { Card, CardContent } from '@/components/ui/card'
import type { LucideIcon } from 'lucide-react'

interface ShortcutItem {
  icon: LucideIcon
  titleKey: string
  descKey: string
  path: string
}

const platformShortcuts: ShortcutItem[] = [
  {
    icon: Users,
    titleKey: 'dashboard.platform.users.title',
    descKey: 'dashboard.platform.users.description',
    path: '/system/users',
  },
  {
    icon: Building2,
    titleKey: 'dashboard.platform.tenant.title',
    descKey: 'dashboard.platform.tenant.description',
    path: '/system/tenant',
  },
  {
    icon: AppWindow,
    titleKey: 'dashboard.platform.app.title',
    descKey: 'dashboard.platform.app.description',
    path: '/system/app',
  },
  {
    icon: Shield,
    titleKey: 'dashboard.platform.role.title',
    descKey: 'dashboard.platform.role.description',
    path: '/system/role',
  },
]

const tenantShortcuts: ShortcutItem[] = [
  {
    icon: Shield,
    titleKey: 'dashboard.tenant.role.title',
    descKey: 'dashboard.tenant.role.description',
    path: '/system/role',
  },
  {
    icon: Menu,
    titleKey: 'dashboard.tenant.menu.title',
    descKey: 'dashboard.tenant.menu.description',
    path: '/system/menu',
  },
  {
    icon: KeyRound,
    titleKey: 'dashboard.tenant.oauthClient.title',
    descKey: 'dashboard.tenant.oauthClient.description',
    path: '/system/oauth-client',
  },
  {
    icon: UserCircle,
    titleKey: 'dashboard.tenant.profile.title',
    descKey: 'dashboard.tenant.profile.description',
    path: '/profile',
  },
]

const Dashboard: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { userInfo } = useAuthStore()
  const isTenant = userInfo?.role === 'tenant_admin'
  const basePath = getBasePath(userInfo?.role || 'platform_admin')

  const shortcuts = isTenant ? tenantShortcuts : platformShortcuts
  const today = new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          {t('dashboard.greeting', { name: userInfo?.username || '' })}
        </h1>
        <p className="text-muted-foreground">{today}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {t(isTenant ? 'dashboard.tenantSubtitle' : 'dashboard.platformSubtitle')}
        </p>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold">{t('dashboard.shortcuts')}</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {shortcuts.map((item) => (
            <Card
              key={item.path}
              className="cursor-pointer transition-shadow hover:shadow-md"
              onClick={() => navigate(`${basePath}${item.path}`)}
            >
              <CardContent className="flex items-start gap-4 pt-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <item.icon className="size-5" />
                </div>
                <div>
                  <p className="font-medium">{t(item.titleKey)}</p>
                  <p className="text-sm text-muted-foreground">{t(item.descKey)}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
