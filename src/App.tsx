import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { Toaster } from 'sonner'
import ErrorBoundary from '@/components/ErrorBoundary'
import PlatformLayout from '@/layouts/PlatformLayout'
import TenantLayout from '@/layouts/TenantLayout'
import PlatformLoginPage from '@/pages/platform/LoginPage'
import TenantLoginPage from '@/pages/tenant/LoginPage'
import PlatformDashboard from '@/pages/platform/Dashboard'
import PlatformUserManagement from '@/pages/platform/UserManagement'
import TenantDashboard from '@/pages/tenant/Dashboard'
import TenantProfile from '@/pages/tenant/Profile'
import OAuthCallbackPage from '@/pages/OAuthCallbackPage'
import { useAuthStore, type UserRole } from '@/stores/authStore'

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

          {/* 兜底重定向 */}
          <Route path="*" element={<RootRedirect />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
