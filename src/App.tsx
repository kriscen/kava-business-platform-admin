import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { Toaster } from 'sonner'
import ErrorBoundary from '@/components/ErrorBoundary'
import { Spinner } from '@/components/ui/spinner'
import PlatformLayout from '@/layouts/PlatformLayout'
import TenantLayout from '@/layouts/TenantLayout'
import { useAuthStore, type UserRole } from '@/stores/authStore'

const PlatformLoginPage = lazy(() => import('@/pages/platform/LoginPage'))
const TenantLoginPage = lazy(() => import('@/pages/tenant/LoginPage'))
const PlatformDashboard = lazy(() => import('@/pages/platform/Dashboard'))
const PlatformUserManagement = lazy(() => import('@/pages/platform/UserManagement'))
const PlatformDeptManagement = lazy(() => import('@/pages/platform/dept/DeptManagement'))
const PlatformTenantManagement = lazy(() => import('@/pages/platform/tenant/TenantManagement'))
const PlatformPublicParamManagement = lazy(
  () => import('@/pages/platform/public-param/PublicParamManagement')
)
const TenantDashboard = lazy(() => import('@/pages/tenant/Dashboard'))
const TenantProfile = lazy(() => import('@/pages/tenant/Profile'))
const NotFound = lazy(() => import('@/pages/NotFound'))
const OAuthCallbackPage = lazy(() => import('@/pages/OAuthCallbackPage'))

/**
 * 路由守卫：检查认证状态和角色
 */
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

/**
 * 登录页守卫：已登录则重定向到对应 dashboard
 */
const LoginRoute: React.FC<{ role: UserRole }> = ({ role }) => {
  const { isAuthenticated, userInfo } = useAuthStore()

  if (isAuthenticated && userInfo?.role === role) {
    const redirectPath = role === 'platform_admin' ? '/platform/dashboard' : '/tenant/dashboard'
    return <Navigate to={redirectPath} replace />
  }

  return <Outlet />
}

/**
 * 根路径重定向
 */
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
            {/* 根路径重定向 */}
            <Route path="/" element={<RootRedirect />} />

            {/* OAuth 回调页 */}
            <Route path="/oauth/callback" element={<OAuthCallbackPage />} />

            {/* 平台管理员登录 */}
            <Route element={<LoginRoute role="platform_admin" />}>
              <Route path="/platform/login" element={<PlatformLoginPage />} />
            </Route>

            {/* 平台管理员后台 */}
            <Route element={<RoleRoute allowedRole="platform_admin" loginPath="/platform/login" />}>
              <Route element={<PlatformLayout />}>
                <Route path="/platform/dashboard" element={<PlatformDashboard />} />
                <Route path="/platform/system/users" element={<PlatformUserManagement />} />
                <Route path="/platform/system/dept" element={<PlatformDeptManagement />} />
                <Route path="/platform/system/tenant" element={<PlatformTenantManagement />} />
                <Route
                  path="/platform/system/public-param"
                  element={<PlatformPublicParamManagement />}
                />
              </Route>
            </Route>

            {/* 租户管理员登录 */}
            <Route element={<LoginRoute role="tenant_admin" />}>
              <Route path="/tenant/login" element={<TenantLoginPage />} />
            </Route>

            {/* 租户管理员后台 */}
            <Route element={<RoleRoute allowedRole="tenant_admin" loginPath="/tenant/login" />}>
              <Route element={<TenantLayout />}>
                <Route path="/tenant/dashboard" element={<TenantDashboard />} />
                <Route path="/tenant/profile" element={<TenantProfile />} />
              </Route>
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
