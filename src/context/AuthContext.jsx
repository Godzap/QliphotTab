import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { login as loginRequest, logout as logoutRequest, me as meRequest } from '../services/authService'

const TOKEN_KEY = 'datapad.auth.token'
const USER_KEY = 'datapad.auth.user'

const AuthContext = createContext(null)

function sanitizeUser(user) {
  if (!user || typeof user !== 'object') return null

  return {
    id: user.id ?? null,
    username: user.username ?? '',
    employeeCode: user.employeeCode ?? '',
    fullName: user.fullName ?? '',
    department: user.department ?? '',
    role: user.role ?? '',
    accessLevel: user.accessLevel ?? 0,
    permissions: Array.isArray(user.permissions) ? user.permissions : [],
  }
}

function readSessionStorage() {
  const token = sessionStorage.getItem(TOKEN_KEY)
  const rawUser = sessionStorage.getItem(USER_KEY)

  if (!token || !rawUser) {
    return { token: null, user: null }
  }

  try {
    const user = sanitizeUser(JSON.parse(rawUser))
    if (!user) return { token: null, user: null }

    return { token, user }
  } catch {
    return { token: null, user: null }
  }
}

function writeSessionStorage(token, user) {
  sessionStorage.setItem(TOKEN_KEY, token)
  sessionStorage.setItem(USER_KEY, JSON.stringify(user))
}

function clearSessionStorage() {
  sessionStorage.removeItem(TOKEN_KEY)
  sessionStorage.removeItem(USER_KEY)
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const stored = readSessionStorage()
    setToken(stored.token)
    setUser(stored.user)
    setIsReady(true)
  }, [])

  const clearSession = useCallback(() => {
    clearSessionStorage()
    setToken(null)
    setUser(null)
  }, [])

  const signIn = useCallback(async ({ username, password, terminalId }) => {
    const payload = await loginRequest({ username, password, terminalId })
    const cleanUser = sanitizeUser(payload?.user)

    if (!payload?.token || !cleanUser) {
      throw new Error('Resposta de autenticacao invalida.')
    }

    writeSessionStorage(payload.token, cleanUser)
    setToken(payload.token)
    setUser(cleanUser)

    return {
      token: payload.token,
      user: cleanUser,
    }
  }, [])

  const signOut = useCallback(async () => {
    if (token) {
      try {
        await logoutRequest(token)
      } catch {
        // Ignore logout transport failures and always clear the local session.
      }
    }

    clearSession()
  }, [clearSession, token])

  const validateSession = useCallback(async () => {
    if (!token) return null

    try {
      const payload = await meRequest(token)
      if (payload?.user) {
        const cleanUser = sanitizeUser(payload.user)
        if (cleanUser) {
          writeSessionStorage(token, cleanUser)
          setUser(cleanUser)
          return cleanUser
        }
      }

      return user
    } catch (error) {
      if (error.status === 401 || error.status === 403) {
        clearSession()
      }
      return null
    }
  }, [clearSession, token, user])

  useEffect(() => {
    if (!isReady || !token) return
    validateSession()
  }, [isReady, token, validateSession])

  const value = useMemo(() => ({
    token,
    user,
    isReady,
    isAuthenticated: Boolean(token && user),
    signIn,
    signOut,
    validateSession,
  }), [isReady, signIn, signOut, token, user, validateSession])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider.')
  }

  return context
}
