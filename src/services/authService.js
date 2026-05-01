const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://127.0.0.1:3001'

const NGROK_HEADER_VALUE = 'true'

function withOptionalTunnelHeaders(headers = {}) {
  if (/ngrok/i.test(API_BASE_URL)) {
    return {
      ...headers,
      'ngrok-skip-browser-warning': NGROK_HEADER_VALUE,
    }
  }

  return headers
}

async function parseJsonSafe(response) {
  try {
    return await response.json()
  } catch {
    return null
  }
}

function buildServiceError(message, extras = {}) {
  const error = new Error(message)
  Object.assign(error, extras)
  return error
}

export async function login({ username, password, terminalId }) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: withOptionalTunnelHeaders({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        username,
        password,
        terminalId,
      }),
    })

    const payload = await parseJsonSafe(response)

    if (!response.ok) {
      const detail = payload?.detail
      const fallbackMessage = typeof detail === 'string' ? detail : 'Falha na autenticacao do terminal.'

      throw buildServiceError(fallbackMessage, {
        status: response.status,
        detail,
      })
    }

    return payload
  } catch (error) {
    if (error?.status) throw error

    throw buildServiceError('Falha de conexao com o backend de autenticacao.', {
      status: 0,
      cause: error,
    })
  }
}

export async function me(token) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      method: 'GET',
      headers: withOptionalTunnelHeaders({
        Authorization: `Bearer ${token}`,
      }),
    })

    const payload = await parseJsonSafe(response)

    if (!response.ok) {
      const detail = payload?.detail
      throw buildServiceError(typeof detail === 'string' ? detail : 'Falha ao validar sessao.', {
        status: response.status,
        detail,
      })
    }

    return payload
  } catch (error) {
    if (error?.status) throw error

    throw buildServiceError('Falha de conexao ao validar sessao.', {
      status: 0,
      cause: error,
    })
  }
}

export async function logout(token) {
  if (!token) {
    return { ok: true }
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: 'POST',
      headers: withOptionalTunnelHeaders({
        Authorization: `Bearer ${token}`,
      }),
    })

    if (!response.ok) {
      const payload = await parseJsonSafe(response)
      const detail = payload?.detail
      throw buildServiceError(typeof detail === 'string' ? detail : 'Falha ao encerrar sessao.', {
        status: response.status,
        detail,
      })
    }

    return { ok: true }
  } catch (error) {
    if (error?.status) throw error

    throw buildServiceError('Falha de conexao ao encerrar sessao.', {
      status: 0,
      cause: error,
    })
  }
}

export { API_BASE_URL }
