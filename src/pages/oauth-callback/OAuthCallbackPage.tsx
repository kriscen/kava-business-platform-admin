import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuthStore, buildUserInfoFromJwt, parseJwtPayload } from '@/stores/authStore'
import type { UserRole } from '@/stores/authStore'
import { authApi } from '@/api/auth'

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
      const state = params.get('state')

      if (errorParam) {
        setError(t('oauth.authFailed', { error: errorParam }))
        return
      }

      if (!code) {
        setError(t('oauth.noCode'))
        return
      }

      const savedState = sessionStorage.getItem('pkce_state')
      if (!state || state !== savedState) {
        setError(t('oauth.stateMismatch'))
        return
      }

      const codeVerifier = sessionStorage.getItem('pkce_code_verifier')
      if (!codeVerifier) {
        setError(t('oauth.noCodeVerifier'))
        return
      }

      try {
        const data = await authApi.exchangeCode(code, codeVerifier)

        const payload = parseJwtPayload(data.access_token)
        const userType = payload.userType as string
        const role: UserRole = userType === '1' ? 'platform_admin' : 'tenant_admin'

        useAuthStore.setState({
          isAuthenticated: true,
          userInfo: buildUserInfoFromJwt(payload, role),
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
        })

        sessionStorage.setItem('access_token', data.access_token)
        sessionStorage.removeItem('pkce_code_verifier')
        sessionStorage.removeItem('pkce_state')

        navigate(role === 'tenant_admin' ? '/tenant/dashboard' : '/platform/dashboard')
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
