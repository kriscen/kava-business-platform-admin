import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import type { AuthState } from '@/stores/authStore'
import { request } from '@/api'

/**
 * OAuth2 回调页
 * 处理授权码换取 token
 */
const OAuthCallbackPage: React.FC = () => {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const isMock = import.meta.env.VITE_ENABLE_MOCK === 'true'

  useEffect(() => {
    // Mock 模式下直接显示错误
    if (isMock) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setError('OAuth 回调在 Mock 模式下不可用')
      return
    }

    const handleCallback = async () => {
      // 从 URL 解析 code 参数
      const params = new URLSearchParams(window.location.search)
      const code = params.get('code')
      const errorParam = params.get('error')

      if (errorParam) {
        setError('授权失败：' + errorParam)
        return
      }

      if (!code) {
        setError('未收到授权码')
        return
      }

      try {
        // 调用 /oauth2/token 获取 token
        const response = await request.post<{
          access_token: string
          refresh_token: string
          token_type: string
          expires_in: number
        }>('/oauth2/token', {
          grant_type: 'authorization_code',
          code,
          redirect_uri: import.meta.env.VITE_OAUTH_REDIRECT_URI,
        })

        const data = response.data
        if (data) {
          // 解析 JWT 获取用户信息
          const payload = JSON.parse(atob(data.access_token.split('.')[1]))

          // 设置认证状态
          const newState: AuthState = {
            isAuthenticated: true,
            userInfo: {
              role: payload.role,
              username: payload.username,
              tenantCode: payload.tenantCode,
            },
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
          }
          useAuthStore.setState(newState)

          // 跳转到首页
          navigate('/dashboard')
        }
      } catch {
        setError('获取 token 失败')
      }
    }

    handleCallback()
  }, [navigate, isMock])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        {error ? (
          <div className="text-center">
            <div className="mb-4 text-4xl">{isMock ? '⚠️' : '❌'}</div>
            <h2 className="mb-2 text-lg font-medium text-red-600">{error}</h2>
            <button
              onClick={() => (window.location.href = '/login')}
              className="mt-4 rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
            >
              返回登录页
            </button>
          </div>
        ) : (
          <div className="text-center">
            <div className="mb-4 text-4xl">🔄</div>
            <h2 className="text-lg font-medium text-gray-900">处理中...</h2>
            <p className="mt-2 text-sm text-gray-500">正在完成登录</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default OAuthCallbackPage
