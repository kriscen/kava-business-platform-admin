import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { Toaster } from 'sonner'
import ErrorBoundary from '@/components/ErrorBoundary'
import { Spinner } from '@/components/ui/spinner'
import MainLayout from '@/layouts/MainLayout'
import { useAuthStore, type UserRole } from '@/stores/authStore'

const PlatformLoginPage = lazy(() => import('@/pages/login/PlatformLoginPage'))
const TenantLoginPage = lazy(() => import('@/pages/login/TenantLoginPage'))
const Dashboard = lazy(() => import('@/pages/dashboard/Dashboard'))
const UserManagement = lazy(() => import('@/pages/system/users/UserManagement'))
const TenantManagement = lazy(() => import('@/pages/system/tenant/TenantManagement'))
const PublicParamManagement = lazy(
  () => import('@/pages/system/public-param/PublicParamManagement')
)
const Profile = lazy(() => import('@/pages/system/Profile'))
const RoleManagement = lazy(() => import('@/pages/system/role/RoleManagement'))
const MenuManagement = lazy(() => import('@/pages/system/menu/MenuManagement'))
const AreaManagement = lazy(() => import('@/pages/system/area/AreaManagement'))
const I18nManagement = lazy(() => import('@/pages/system/i18n/I18nManagement'))
const RouteConfManagement = lazy(() => import('@/pages/system/route-conf/RouteConfManagement'))
const OAuthClientManagement = lazy(
  () => import('@/pages/system/oauth-client/OAuthClientManagement')
)
const LogManagement = lazy(() => import('@/pages/system/log/LogManagement'))
const AuditLogManagement = lazy(() => import('@/pages/system/audit-log/AuditLogManagement'))
const FileManagement = lazy(() => import('@/pages/system/file/FileManagement'))
const FileGroupManagement = lazy(() => import('@/pages/system/file-group/FileGroupManagement'))
const AppManagement = lazy(() => import('@/pages/system/app/AppManagement'))
const GroupManagement = lazy(() => import('@/pages/system/group/GroupManagement'))
const NotFound = lazy(() => import('@/pages/NotFound'))
const OAuthCallbackPage = lazy(() => import('@/pages/oauth-callback/OAuthCallbackPage'))

type SharedRoute = {
  path: string
  element: React.LazyExoticComponent<React.FC>
  allowedRoles: UserRole[]
}

const sharedRoutes: SharedRoute[] = [
  { path: 'dashboard', element: Dashboard, allowedRoles: ['platform_admin', 'tenant_admin'] },
  { path: 'system/users', element: UserManagement, allowedRoles: ['platform_admin'] },
  { path: 'system/tenant', element: TenantManagement, allowedRoles: ['platform_admin'] },
  {
    path: 'system/public-param',
    element: PublicParamManagement,
    allowedRoles: ['platform_admin'],
  },
  {
    path: 'system/role',
    element: RoleManagement,
    allowedRoles: ['platform_admin', 'tenant_admin'],
  },
  {
    path: 'system/menu',
    element: MenuManagement,
    allowedRoles: ['platform_admin', 'tenant_admin'],
  },
  {
    path: 'system/area',
    element: AreaManagement,
    allowedRoles: ['platform_admin', 'tenant_admin'],
  },
  {
    path: 'system/i18n',
    element: I18nManagement,
    allowedRoles: ['platform_admin', 'tenant_admin'],
  },
  {
    path: 'system/route-conf',
    element: RouteConfManagement,
    allowedRoles: ['platform_admin', 'tenant_admin'],
  },
  {
    path: 'system/oauth-client',
    element: OAuthClientManagement,
    allowedRoles: ['platform_admin', 'tenant_admin'],
  },
  { path: 'profile', element: Profile, allowedRoles: ['tenant_admin'] },
  { path: 'system/log', element: LogManagement, allowedRoles: ['platform_admin'] },
  { path: 'system/audit-log', element: AuditLogManagement, allowedRoles: ['platform_admin'] },
  { path: 'system/file', element: FileManagement, allowedRoles: ['platform_admin'] },
  { path: 'system/file-group', element: FileGroupManagement, allowedRoles: ['platform_admin'] },
  { path: 'system/app', element: AppManagement, allowedRoles: ['platform_admin'] },
  { path: 'system/group', element: GroupManagement, allowedRoles: ['platform_admin'] },
]

const prefixConfigs = [
  { prefix: 'platform', loginPath: '/platform/login', role: 'platform_admin' as UserRole },
  { prefix: 'tenant', loginPath: '/tenant/login', role: 'tenant_admin' as UserRole },
]

const RoleRoute: React.FC<{ allowedRole: UserRole; loginPath: string }> = ({
  allowedRole,
  loginPath,
}) => {
  const { isAuthenticated, userInfo } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to={loginPath} replace />
  }

  if (userInfo?.role !== allowedRole) {
    const redirectPath =
      userInfo?.role === 'platform_admin' ? '/platform/dashboard' : '/tenant/dashboard'
    return <Navigate to={redirectPath} replace />
  }

  return <Outlet />
}

const LoginRoute: React.FC<{ role: UserRole }> = ({ role }) => {
  const { isAuthenticated, userInfo } = useAuthStore()

  if (isAuthenticated && userInfo?.role === role) {
    const redirectPath = role === 'platform_admin' ? '/platform/dashboard' : '/tenant/dashboard'
    return <Navigate to={redirectPath} replace />
  }

  return <Outlet />
}

const RootRedirect: React.FC = () => {
  const { isAuthenticated, userInfo } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/platform/login" replace />
  }

  const redirectPath =
    userInfo?.role === 'tenant_admin' ? '/tenant/dashboard' : '/platform/dashboard'
  return <Navigate to={redirectPath} replace />
}

function App() {
  return (
    <ErrorBoundary>
      <Toaster position="top-center" richColors />
      <BrowserRouter>
        <Suspense fallback={<Spinner />}>
          <Routes>
            <Route path="/" element={<RootRedirect />} />

            {/* OAuth callback */}
            <Route path="/oauth/callback" element={<OAuthCallbackPage />} />

            {/* Login routes — independent, no MainLayout */}
            <Route element={<LoginRoute role="platform_admin" />}>
              <Route path="/platform/login" element={<PlatformLoginPage />} />
            </Route>
            <Route element={<LoginRoute role="tenant_admin" />}>
              <Route path="/tenant/login" element={<TenantLoginPage />} />
            </Route>

            {/* Authenticated routes — loop-generated, shared components */}
            {prefixConfigs.map(({ prefix, loginPath, role }) => (
              <Route key={prefix} element={<RoleRoute allowedRole={role} loginPath={loginPath} />}>
                <Route element={<MainLayout />}>
                  {sharedRoutes
                    .filter((r) => r.allowedRoles.includes(role))
                    .map((r) => (
                      <Route key={r.path} path={`/${prefix}/${r.path}`} element={<r.element />} />
                    ))}
                </Route>
              </Route>
            ))}

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
