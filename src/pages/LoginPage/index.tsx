import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore, type UserRole } from '@/stores/authStore'

/**
 * 登录页组件
 * 支持平台管理员和租户管理员两种登录方式
 */
const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)

  // Tab 状态
  const [activeTab, setActiveTab] = useState<UserRole>('platform_admin')

  // 表单状态
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [tenantCode, setTenantCode] = useState('')

  // 错误状态
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login({
        username,
        password,
        role: activeTab,
        tenantCode: activeTab === 'tenant_admin' ? tenantCode : undefined,
      })
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : '登录失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        {/* 标题 */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Kava Admin</h1>
          <p className="mt-2 text-sm text-gray-500">管理系统登录</p>
        </div>

        {/* Tab 切换 */}
        <div className="mb-6 flex rounded-lg bg-gray-100 p-1">
          <button
            type="button"
            onClick={() => setActiveTab('platform_admin')}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'platform_admin'
                ? 'bg-white text-blue-600 shadow'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            平台管理员
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('tenant_admin')}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'tenant_admin'
                ? 'bg-white text-blue-600 shadow'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            租户管理员
          </button>
        </div>

        {/* 登录表单 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 账号 */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              账号
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="请输入账号"
              required
            />
          </div>

          {/* 密码 */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              密码
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="请输入密码"
              required
            />
          </div>

          {/* 租户编码 - 仅租户管理员显示 */}
          {activeTab === 'tenant_admin' && (
            <div>
              <label htmlFor="tenantCode" className="block text-sm font-medium text-gray-700">
                租户编码
              </label>
              <input
                id="tenantCode"
                type="text"
                value={tenantCode}
                onChange={(e) => setTenantCode(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="请输入租户编码"
                required
              />
            </div>
          )}

          {/* 错误提示 */}
          {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}

          {/* 提交按钮 */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? '登录中...' : '登录'}
          </button>
        </form>

        {/* 提示信息 */}
        <div className="mt-6 text-center text-xs text-gray-400">
          {activeTab === 'platform_admin' ? (
            <p>Mock 模式：账号 admin，密码 123456</p>
          ) : (
            <p>Mock 模式：账号 tenant，密码 123456，租户编码 DEMO</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default LoginPage
