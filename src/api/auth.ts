interface TokenResponse {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
}

export const authApi = {
  refreshToken: async (refreshToken: string): Promise<TokenResponse> => {
    const response = await fetch('/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
    })

    if (!response.ok) {
      throw new Error('Token refresh failed')
    }

    return response.json()
  },

  exchangeCode: async (code: string): Promise<TokenResponse> => {
    const clientId = import.meta.env.VITE_OAUTH_CLIENT_ID || 'client_id'
    const redirectUri = import.meta.env.VITE_OAUTH_REDIRECT_URI

    const response = await fetch('/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        code,
        client_id: clientId,
        redirect_uri: redirectUri,
      }),
    })

    if (!response.ok) {
      throw new Error('Code exchange failed')
    }

    return response.json()
  },
}
