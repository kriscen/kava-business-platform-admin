import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/stores/authStore'
import type { AuthState } from '@/stores/authStore'
import { request } from '@/api'

const OAuthCallbackPage: React.FC = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [error, setError] = useState('')
  const isMock = import.meta.env.VITE_ENABLE_MOCK === 'true'

  useEffect(() => {
    if (isMock) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setError(t('oauth.mockUnavailable'))
      return
    }

    const handleCallback = async () => {
      const params = new URLSearchParams(window.location.search)
      const code = params.get('code')
      const errorParam = params.get('error')

      if (errorParam) {
        setError(t('oauth.authFailed', { error: errorParam }))
        return
      }

      if (!code) {
        setError(t('oauth.noCode'))
        return
      }

      try {
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
          const payload = JSON.parse(atob(data.access_token.split('.')[1]))

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

          const role = useAuthStore.getState().userInfo?.role
          navigate(role === 'tenant_admin' ? '/tenant/dashboard' : '/platform/dashboard')
        }
      } catch {
        setError(t('oauth.tokenFailed'))
      }
    }

    handleCallback()
  }, [navigate, isMock, t])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        {error ? (
          <div className="text-center">
            <div className="mb-4 text-4xl">{isMock ? '⚠️' : '❌'}</div>
            <h2 className="mb-2 text-lg font-medium text-red-600">{error}</h2>
            <button
              onClick={() => navigate('/')}
              className="mt-4 rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
            >
              {t('oauth.backToLogin')}
            </button>
          </div>
        ) : (
          <div className="text-center">
            <div className="mb-4 text-4xl">🔄</div>
            <h2 className="text-lg font-medium text-gray-900">{t('common.processing')}</h2>
            <p className="mt-2 text-sm text-gray-500">{t('oauth.completingLogin')}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default OAuthCallbackPage
