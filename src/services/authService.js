import { API_BASE_URL, requestJson } from './apiClient'

export async function login({ username, password, terminalId }) {
  return requestJson('/api/auth/login', {
    method: 'POST',
    body: {
      username,
      password,
      terminalId,
    },
  })
}

export async function me(token) {
  return requestJson('/api/auth/me', {
    method: 'GET',
    token,
  })
}

export async function logout(token) {
  if (!token) {
    return { ok: true }
  }

  await requestJson('/api/auth/logout', {
    method: 'POST',
    token,
  })

  return { ok: true }
}

export { API_BASE_URL }
