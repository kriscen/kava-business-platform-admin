import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import ErrorBoundary from '@/components/ErrorBoundary'
import AdminLayout from '@/components/layout/AdminLayout'
import '@/styles/layout.css'

// 占位页面组件
const Dashboard: React.FC = () => (
  <div style={{ padding: '24px', background: '#fff', borderRadius: '8px' }}>
    <h2>仪表盘</h2>
    <p>欢迎使用 Kava Admin 管理系统</p>
  </div>
)

const UserManagement: React.FC = () => (
  <div style={{ padding: '24px', background: '#fff', borderRadius: '8px' }}>
    <h2>用户管理</h2>
    <p>用户管理页面</p>
  </div>
)

function App() {
  return (
    <ErrorBoundary>
      <ConfigProvider locale={zhCN}>
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
      </ConfigProvider>
    </ErrorBoundary>
  )
}

export default App