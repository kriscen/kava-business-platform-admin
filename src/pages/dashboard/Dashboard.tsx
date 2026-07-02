import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import {
  Activity,
  ArrowRight,
  AppWindow,
  Building2,
  Database,
  KeyRound,
  Menu,
  Shield,
  ShieldCheck,
  UserCircle,
  Users,
} from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { getBasePath } from '@/stores/menuStore'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { LucideIcon } from 'lucide-react'

interface ShortcutItem {
  icon: LucideIcon
  titleKey: string
  descKey: string
  path: string
  toneClassName: string
}

const platformShortcuts: ShortcutItem[] = [
  {
    icon: Users,
    titleKey: 'dashboard.platform.users.title',
    descKey: 'dashboard.platform.users.description',
    path: '/system/users',
    toneClassName: 'bg-chart-1/10 text-chart-1',
  },
  {
    icon: Building2,
    titleKey: 'dashboard.platform.tenant.title',
    descKey: 'dashboard.platform.tenant.description',
    path: '/system/tenant',
    toneClassName: 'bg-chart-2/10 text-chart-2',
  },
  {
    icon: AppWindow,
    titleKey: 'dashboard.platform.app.title',
    descKey: 'dashboard.platform.app.description',
    path: '/system/app',
    toneClassName: 'bg-chart-5/10 text-chart-5',
  },
  {
    icon: Shield,
    titleKey: 'dashboard.platform.role.title',
    descKey: 'dashboard.platform.role.description',
    path: '/system/role',
    toneClassName: 'bg-chart-3/15 text-chart-3',
  },
]

const tenantShortcuts: ShortcutItem[] = [
  {
    icon: Shield,
    titleKey: 'dashboard.tenant.role.title',
    descKey: 'dashboard.tenant.role.description',
    path: '/system/role',
    toneClassName: 'bg-chart-1/10 text-chart-1',
  },
  {
    icon: Menu,
    titleKey: 'dashboard.tenant.menu.title',
    descKey: 'dashboard.tenant.menu.description',
    path: '/system/menu',
    toneClassName: 'bg-chart-2/10 text-chart-2',
  },
  {
    icon: KeyRound,
    titleKey: 'dashboard.tenant.oauthClient.title',
    descKey: 'dashboard.tenant.oauthClient.description',
    path: '/system/oauth-client',
    toneClassName: 'bg-chart-5/10 text-chart-5',
  },
  {
    icon: UserCircle,
    titleKey: 'dashboard.tenant.profile.title',
    descKey: 'dashboard.tenant.profile.description',
    path: '/profile',
    toneClassName: 'bg-chart-3/15 text-chart-3',
  },
]

interface MetricItem {
  icon: LucideIcon
  labelKey: string
  value: string
  unitKey?: string
  noteKey: string
  toneClassName: string
}

interface FocusItem {
  icon: LucideIcon
  titleKey: string
  descKey: string
  statusKey: string
  path: string
  toneClassName: string
  badgeClassName: string
}

const platformFocusItems: FocusItem[] = [
  {
    icon: ShieldCheck,
    titleKey: 'dashboard.platformFocus.permission.title',
    descKey: 'dashboard.platformFocus.permission.description',
    statusKey: 'dashboard.status.baseline',
    path: '/system/role',
    toneClassName: 'bg-chart-1/10 text-chart-1',
    badgeClassName: 'border-chart-1/30 bg-chart-1/10 text-chart-1',
  },
  {
    icon: Building2,
    titleKey: 'dashboard.platformFocus.tenant.title',
    descKey: 'dashboard.platformFocus.tenant.description',
    statusKey: 'dashboard.status.attention',
    path: '/system/tenant',
    toneClassName: 'bg-chart-3/15 text-chart-3',
    badgeClassName: 'border-chart-3/40 bg-chart-3/15 text-chart-3',
  },
  {
    icon: Activity,
    titleKey: 'dashboard.platformFocus.audit.title',
    descKey: 'dashboard.platformFocus.audit.description',
    statusKey: 'dashboard.status.tracking',
    path: '/system/audit-log',
    toneClassName: 'bg-chart-2/10 text-chart-2',
    badgeClassName: 'border-chart-2/30 bg-chart-2/10 text-chart-2',
  },
]

const tenantFocusItems: FocusItem[] = [
  {
    icon: ShieldCheck,
    titleKey: 'dashboard.tenantFocus.permission.title',
    descKey: 'dashboard.tenantFocus.permission.description',
    statusKey: 'dashboard.status.baseline',
    path: '/system/role',
    toneClassName: 'bg-chart-1/10 text-chart-1',
    badgeClassName: 'border-chart-1/30 bg-chart-1/10 text-chart-1',
  },
  {
    icon: Menu,
    titleKey: 'dashboard.tenantFocus.navigation.title',
    descKey: 'dashboard.tenantFocus.navigation.description',
    statusKey: 'dashboard.status.attention',
    path: '/system/menu',
    toneClassName: 'bg-chart-3/15 text-chart-3',
    badgeClassName: 'border-chart-3/40 bg-chart-3/15 text-chart-3',
  },
  {
    icon: KeyRound,
    titleKey: 'dashboard.tenantFocus.oauth.title',
    descKey: 'dashboard.tenantFocus.oauth.description',
    statusKey: 'dashboard.status.tracking',
    path: '/system/oauth-client',
    toneClassName: 'bg-chart-2/10 text-chart-2',
    badgeClassName: 'border-chart-2/30 bg-chart-2/10 text-chart-2',
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
  const roleLabel = t(
    isTenant ? 'dashboard.identity.tenantAdmin' : 'dashboard.identity.platformAdmin'
  )
  const scopeLabel = isTenant
    ? userInfo?.tenantCode || t('dashboard.identity.currentTenant')
    : t('dashboard.identity.globalPlatform')
  const environmentLabel =
    import.meta.env.VITE_ENABLE_MOCK === 'true'
      ? t('dashboard.environment.mock')
      : t('dashboard.environment.server')
  const focusItems = isTenant ? tenantFocusItems : platformFocusItems
  const metrics: MetricItem[] = [
    {
      icon: ShieldCheck,
      labelKey: 'dashboard.metrics.role.label',
      value: roleLabel,
      noteKey: 'dashboard.metrics.role.note',
      toneClassName: 'bg-chart-1/10 text-chart-1',
    },
    {
      icon: Database,
      labelKey: 'dashboard.metrics.scope.label',
      value: scopeLabel,
      noteKey: isTenant
        ? 'dashboard.metrics.scope.tenantNote'
        : 'dashboard.metrics.scope.platformNote',
      toneClassName: 'bg-chart-2/10 text-chart-2',
    },
    {
      icon: AppWindow,
      labelKey: 'dashboard.metrics.entries.label',
      value: String(shortcuts.length),
      unitKey: 'dashboard.metrics.entries.unit',
      noteKey: 'dashboard.metrics.entries.note',
      toneClassName: 'bg-chart-5/10 text-chart-5',
    },
    {
      icon: Activity,
      labelKey: 'dashboard.metrics.environment.label',
      value: environmentLabel,
      noteKey: 'dashboard.metrics.environment.note',
      toneClassName: 'bg-chart-3/15 text-chart-3',
    },
  ]

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-primary/15 bg-[linear-gradient(135deg,var(--card),color-mix(in_oklch,var(--primary),var(--card)_88%))] px-5 py-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="border-primary/25 bg-primary/10 text-primary">
                {roleLabel}
              </Badge>
              <span className="text-sm text-muted-foreground">{today}</span>
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                {t('dashboard.greeting', { name: userInfo?.username || t('common.admin') })}
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                {t(isTenant ? 'dashboard.tenantSubtitle' : 'dashboard.platformSubtitle')}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm sm:flex sm:items-center">
            <div className="rounded-md border border-chart-1/20 bg-chart-1/10 px-3 py-2">
              <p className="text-xs text-muted-foreground">{t('dashboard.identity.scope')}</p>
              <p className="mt-1 max-w-40 truncate font-medium">{scopeLabel}</p>
            </div>
            <div className="rounded-md border border-chart-2/20 bg-chart-2/10 px-3 py-2">
              <p className="text-xs text-muted-foreground">{t('dashboard.identity.mode')}</p>
              <p className="mt-1 font-medium">{environmentLabel}</p>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="dashboard-overview" className="space-y-3">
        <div>
          <h2 id="dashboard-overview" className="text-base font-semibold">
            {t('dashboard.overview')}
          </h2>
          <p className="text-sm text-muted-foreground">{t('dashboard.overviewDescription')}</p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((item) => (
            <Card key={item.labelKey} size="sm" className="rounded-lg">
              <CardContent className="flex items-start gap-3">
                <div
                  className={`flex size-9 shrink-0 items-center justify-center rounded-md ${item.toneClassName}`}
                >
                  <item.icon className="size-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">{t(item.labelKey)}</p>
                  <p className="mt-1 truncate text-lg font-semibold">
                    {item.value}
                    {item.unitKey && (
                      <span className="ml-1 text-sm font-medium text-muted-foreground">
                        {t(item.unitKey)}
                      </span>
                    )}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">{t(item.noteKey)}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.42fr)]">
        <section aria-labelledby="dashboard-workbench" className="space-y-3">
          <div>
            <h2 id="dashboard-workbench" className="text-base font-semibold">
              {t('dashboard.shortcuts')}
            </h2>
            <p className="text-sm text-muted-foreground">{t('dashboard.shortcutsDescription')}</p>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {shortcuts.map((item) => (
              <button
                key={item.path}
                type="button"
                aria-label={t(item.titleKey)}
                className="group flex min-h-28 w-full items-start gap-4 rounded-lg border bg-card p-4 text-left shadow-sm transition-colors hover:border-primary/40 hover:bg-muted/30 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                onClick={() => navigate(`${basePath}${item.path}`)}
              >
                <span
                  className={`flex size-10 shrink-0 items-center justify-center rounded-md ${item.toneClassName}`}
                >
                  <item.icon className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-medium">{t(item.titleKey)}</span>
                  <span className="mt-1 block text-sm leading-5 text-muted-foreground">
                    {t(item.descKey)}
                  </span>
                </span>
                <ArrowRight className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
              </button>
            ))}
          </div>
        </section>

        <section aria-labelledby="dashboard-focus">
          <Card className="rounded-lg">
            <CardHeader>
              <CardTitle id="dashboard-focus">{t('dashboard.focus')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {focusItems.map((item) => (
                <button
                  key={item.titleKey}
                  type="button"
                  className="group flex w-full items-start gap-3 rounded-md border bg-background p-3 text-left transition-colors hover:border-primary/40 hover:bg-muted/40 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  onClick={() => navigate(`${basePath}${item.path}`)}
                >
                  <span
                    className={`flex size-8 shrink-0 items-center justify-center rounded-md ${item.toneClassName}`}
                  >
                    <item.icon className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-3">
                      <span className="font-medium">{t(item.titleKey)}</span>
                      <Badge variant="outline" className={`rounded-md ${item.badgeClassName}`}>
                        {t(item.statusKey)}
                      </Badge>
                    </span>
                    <span className="mt-1 block text-sm leading-5 text-muted-foreground">
                      {t(item.descKey)}
                    </span>
                  </span>
                </button>
              ))}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}

export default Dashboard
