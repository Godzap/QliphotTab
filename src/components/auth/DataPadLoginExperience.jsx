import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import LoginTopBar from './LoginTopBar'
import LoginBottomBar from './LoginBottomBar'
import LoginIdlePhase from './LoginIdlePhase'
import LoginInputPhase from './LoginInputPhase'
import LoginAuthenticatingPhase from './LoginAuthenticatingPhase'
import LoginGrantedPhase from './LoginGrantedPhase'
import LoginDeniedPhase from './LoginDeniedPhase'
import CornerBrackets from './CornerBrackets'
import ScanBar from './ScanBar'
import '../../styles/datapad-login.css'

const DEFAULT_BUILD_VERSION = 'v4.7.1-stable'
const DEFAULT_REDIRECT_PATH = '/dashboard'
const MAX_ATTEMPTS = 5
const AUTH_STEPS = 5

const DEPT_COLORS = {
  Informacao: '#7B5EA7',
  'Bem-Estar': '#3A7FC1',
  Seguranca: '#2F6B45',
  Controle: '#BFA35A',
  Treinamento: '#C47A2C',
  Anomalia: '#B83232',
}

function normalizeDepartment(department) {
  if (!department) return 'Controle'
  const normalized = String(department)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

  if (normalized === 'Anomalia') return 'Anomalia'
  if (normalized === 'Treinamento') return 'Treinamento'
  if (normalized === 'Informacao') return 'Informacao'
  if (normalized === 'Seguranca') return 'Seguranca'
  return normalized
}

function useClock() {
  const [time, setTime] = useState(() => (
    new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  ))

  useEffect(() => {
    const id = window.setInterval(() => {
      setTime(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
    }, 1000)
    return () => window.clearInterval(id)
  }, [])

  return time
}

function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

function getErrorText(error) {
  if (typeof error?.detail === 'string' && error.detail.trim()) return error.detail
  if (typeof error?.message === 'string' && error.message.trim()) return error.message
  return 'Falha de autenticacao.'
}

export default function DataPadLoginExperience({
  terminalId,
  redirectPath = DEFAULT_REDIRECT_PATH,
  buildVersion = DEFAULT_BUILD_VERSION,
  rootClassName = 'dpl-root',
}) {
  const navigate = useNavigate()
  const time = useClock()
  const accessCount = useMemo(() => Math.floor(Math.random() * 40) + 60, [])
  const { signIn, isAuthenticated } = useAuth()

  const [phase, setPhase] = useState('idle')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [validationErrors, setValidationErrors] = useState({})
  const [backendError, setBackendError] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [authStepIndex, setAuthStepIndex] = useState(0)
  const [grantedUser, setGrantedUser] = useState(null)
  const [deniedMessage, setDeniedMessage] = useState('Credenciais invalidas. Tente novamente.')

  const isAuthenticating = phase === 'auth'
  const isLocked = attempts >= MAX_ATTEMPTS
  const normalizedDepartment = normalizeDepartment(grantedUser?.department)
  const departmentColor = DEPT_COLORS[normalizedDepartment] || '#BFA35A'

  useEffect(() => {
    if (!isAuthenticated) return
    navigate(redirectPath, { replace: true })
  }, [isAuthenticated, navigate, redirectPath])

  useEffect(() => {
    if (phase !== 'auth') return undefined

    setAuthStepIndex(1)
    const timer = window.setInterval(() => {
      setAuthStepIndex((current) => {
        if (current >= AUTH_STEPS) return current
        return current + 1
      })
    }, 380)

    return () => window.clearInterval(timer)
  }, [phase])

  function validateFields(currentUsername, currentPassword) {
    const nextErrors = {}
    if (!currentUsername.trim()) nextErrors.username = 'Identificador obrigatorio.'
    if (!currentPassword) nextErrors.password = 'Codigo de acesso obrigatorio.'
    return nextErrors
  }

  function handleEngage() {
    setValidationErrors({})
    setBackendError('')
    setPhase('input')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (isAuthenticating) return

    const trimmedUsername = username.trim()
    const nextErrors = validateFields(trimmedUsername, password)
    setValidationErrors(nextErrors)
    setBackendError('')

    if (Object.keys(nextErrors).length > 0) return

    if (isLocked) {
      setDeniedMessage('Terminal bloqueado por excesso de tentativas. Contate o Departamento de Controle.')
      setPhase('denied')
      return
    }

    setPhase('auth')

    try {
      const [session] = await Promise.all([
        signIn({
          username: trimmedUsername,
          password,
          terminalId,
        }),
        wait(1400),
      ])

      setGrantedUser(session.user)
      setPassword('')
      setPhase('granted')
      setAuthStepIndex(AUTH_STEPS)

      window.setTimeout(() => {
        navigate(redirectPath, { replace: true })
      }, 1700)
    } catch (error) {
      if (error?.status === 401) {
        const nextAttempts = attempts + 1
        setAttempts(nextAttempts)
        const locked = nextAttempts >= MAX_ATTEMPTS
        setDeniedMessage(
          locked
            ? 'Tentativas excedidas. O terminal sera bloqueado e auditado.'
            : 'Credenciais invalidas. Esta tentativa foi registrada.'
        )
        setPhase('denied')
        return
      }

      if (error?.status === 400 || error?.status === 422) {
        setBackendError(getErrorText(error))
        setPhase('input')
        return
      }

      setDeniedMessage('Falha de conexao com o servidor de autenticacao. Verifique o backend.')
      setPhase('denied')
    }
  }

  function handleRetry() {
    setPassword('')
    setBackendError('')
    setValidationErrors({})
    setPhase('input')
  }

  return (
    <div className={rootClassName}>
      <div className="dpl-overlay-scanlines" aria-hidden="true" />
      <div className="dpl-overlay-vignette" aria-hidden="true" />
      <ScanBar />

      <LoginTopBar
        phase={phase}
        time={time}
        terminalId={terminalId}
      />

      <main className="dpl-content">
        <CornerBrackets size={16} inset={12} />
        <div className="dpl-vertical-line left" aria-hidden="true" />
        <div className="dpl-vertical-line right" aria-hidden="true" />

        <AnimatePresence mode="wait">
          {phase === 'idle' && (
            <LoginIdlePhase key="idle" onEngage={handleEngage} />
          )}

          {phase === 'input' && (
            <LoginInputPhase
              key="input"
              username={username}
              password={password}
              onUsernameChange={setUsername}
              onPasswordChange={setPassword}
              onSubmit={handleSubmit}
              isSubmitting={isAuthenticating}
              validationErrors={validationErrors}
              backendError={backendError}
              isLocked={isLocked}
              attempts={attempts}
              maxAttempts={MAX_ATTEMPTS}
            />
          )}

          {phase === 'auth' && (
            <LoginAuthenticatingPhase
              key="auth"
              username={username.trim()}
              progressIndex={authStepIndex}
            />
          )}

          {phase === 'granted' && (
            <LoginGrantedPhase
              key="granted"
              user={grantedUser}
              departmentColor={departmentColor}
            />
          )}

          {phase === 'denied' && (
            <LoginDeniedPhase
              key="denied"
              attempts={attempts}
              maxAttempts={MAX_ATTEMPTS}
              message={deniedMessage}
              locked={isLocked}
              onRetry={handleRetry}
            />
          )}
        </AnimatePresence>
      </main>

      <LoginBottomBar
        buildVersion={buildVersion}
        accessCount={accessCount}
      />
    </div>
  )
}

