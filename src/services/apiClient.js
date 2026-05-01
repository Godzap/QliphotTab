const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || ''

function normalizeApiBaseUrl(value) {
  if (!value || typeof value !== 'string') return ''
  return value.replace(/\/+$/, '')
}

export const API_BASE_URL = normalizeApiBaseUrl(rawApiBaseUrl)
export const HAS_CONFIGURED_API_BASE_URL = Boolean(API_BASE_URL)

function shouldSkipNgrokWarning(baseUrl) {
  return /ngrok/i.test(baseUrl)
}

function withOptionalTunnelHeaders(headers = {}) {
  if (!shouldSkipNgrokWarning(API_BASE_URL)) {
    return headers
  }

  return {
    ...headers,
    'ngrok-skip-browser-warning': 'true',
  }
}

function parseJsonSafe(response) {
  return response.json().catch(() => null)
}

function buildServiceError(message, extras = {}) {
  const error = new Error(message)
  Object.assign(error, extras)
  return error
}

function logApiDiagnostic({ endpoint, method, status, detail, cause }) {
  const prefix = '[api]'
  const safeStatus = status ?? 'unknown'
  const safeMethod = method || 'GET'
  console.error(`${prefix} ${safeMethod} ${endpoint} failed`, {
    apiBaseUrl: API_BASE_URL || '(missing)',
    status: safeStatus,
    detail,
    cause,
  })
}

export async function requestJson(endpoint, { method = 'GET', headers = {}, body, token } = {}) {
  if (!API_BASE_URL) {
    const error = buildServiceError(
      'API base URL ausente. Configure VITE_API_BASE_URL (ou VITE_API_URL).',
      { status: 0, code: 'MISSING_API_BASE_URL' },
    )
    logApiDiagnostic({ endpoint, method, status: 0, detail: error.message })
    throw error
  }

  const requestHeaders = withOptionalTunnelHeaders({
    ...headers,
  })
  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`
  }
  if (body !== undefined && !requestHeaders['Content-Type']) {
    requestHeaders['Content-Type'] = 'application/json'
  }

  const requestInit = {
    method,
    headers: Object.keys(requestHeaders).length > 0 ? requestHeaders : undefined,
    body: body === undefined ? undefined : JSON.stringify(body),
  }

  let response
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, requestInit)
  } catch (cause) {
    const error = buildServiceError('Falha de conexao com o backend.', {
      status: 0,
      endpoint,
      method,
      cause,
    })
    logApiDiagnostic({ endpoint, method, status: 0, detail: error.message, cause })
    throw error
  }

  const payload = await parseJsonSafe(response)

  if (!response.ok) {
    const detail = payload?.detail ?? payload?.message ?? null
    const errorMessage = typeof detail === 'string'
      ? detail
      : `Falha ao acessar backend (${response.status}).`
    const error = buildServiceError(errorMessage, {
      status: response.status,
      endpoint,
      method,
      detail,
      payload,
    })
    logApiDiagnostic({ endpoint, method, status: response.status, detail, cause: null })
    throw error
  }

  return payload
}

if (!HAS_CONFIGURED_API_BASE_URL) {
  console.warn('[api] VITE_API_BASE_URL/VITE_API_URL nao configurada. Rotas protegidas dependerao de fallback.')
}
