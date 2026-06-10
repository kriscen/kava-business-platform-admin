interface TokenResponse {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
}

interface JsonResult<T> {
  success: boolean
  data: T | null
  errorCode: string | null
  errorMessage: string | null
}

function parseTokenResponse(json: unknown): TokenResponse {
  const obj = json as Record<string, unknown>
  if ('success' in obj) {
    const result = json as JsonResult<TokenResponse>
    if (!result.success || !result.data) {
      throw new Error(result.errorMessage || 'Token request failed')
    }
    return result.data
  }
  return json as TokenResponse
}

export const authApi = {
  refreshToken: async (refreshToken: string): Promise<TokenResponse> => {
    const clientId = import.meta.env.VITE_OAUTH_CLIENT_ID || 'client_id'

    const response = await fetch('/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: clientId,
      }),
    })

    if (!response.ok) {
      throw new Error('Token refresh failed')
    }

    return parseTokenResponse(await response.json())
  },

  exchangeCode: async (code: string, codeVerifier: string): Promise<TokenResponse> => {
    const clientId = import.meta.env.VITE_OAUTH_CLIENT_ID || 'client_id'
    const redirectUri = import.meta.env.VITE_OAUTH_REDIRECT_URI

    const response = await fetch('/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: clientId,
        redirect_uri: redirectUri,
        code_verifier: codeVerifier,
      }),
    })

    if (!response.ok) {
      throw new Error('Code exchange failed')
    }

    return parseTokenResponse(await response.json())
  },
}
