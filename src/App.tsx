import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ErrorBoundary from '@/components/ErrorBoundary'
import AdminLayout from '@/components/layout/AdminLayout'
import LoginPage from '@/pages/LoginPage'
import OAuthCallbackPage from '@/pages/OAuthCallbackPage'
import { useAuthStore } from '@/stores/authStore'

// 占位页面组件
const Dashboard: React.FC = () => (
  <div className="rounded-lg bg-white p-6">
    <h2 className="text-lg font-semibold">仪表盘</h2>
    <p className="text-muted-foreground">欢迎使用 Kava Admin 管理系统</p>
  </div>
)

const UserManagement: React.FC = () => (
  <div className="rounded-lg bg-white p-6">
    <h2 className="text-lg font-semibold">用户管理</h2>
    <p className="text-muted-foreground">用户管理页面</p>
  </div>
)

/**
 * 需要登录的保护路由组件
 */
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

/**
 * 已登录用户访问登录页时重定向
 */
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          {/* 公共路由 - 登录页 */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />

          {/* OAuth 回调页 */}
          <Route path="/oauth/callback" element={<OAuthCallbackPage />} />

          {/* 受保护的路由 */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="system/users" element={<UserManagement />} />
          </Route>

          {/* 404 重定向 */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
