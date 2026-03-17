import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ErrorBoundary from '@/components/ErrorBoundary'
import AdminLayout from '@/components/layout/AdminLayout'

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

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AdminLayout title="Kava Admin">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/system/users" element={<UserManagement />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AdminLayout>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App