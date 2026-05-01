import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const TERMINAL_ID = 'WEB-QLIPHOTTAB'

const ACCESS_LEVELS = [
  'Funcionario',
  'Supervisor',
  'Analista de Informacoes',
  'Coordenacao de Controle',
]

function getErrorText(error) {
  if (typeof error?.detail === 'string' && error.detail.trim()) return error.detail
  if (typeof error?.message === 'string' && error.message.trim()) return error.message
  return 'Falha na autenticacao. Tente novamente.'
}

function getRedirectPath(stateFrom) {
  if (typeof stateFrom === 'string' && stateFrom.startsWith('/')) {
    return stateFrom
  }

  if (stateFrom && typeof stateFrom === 'object' && typeof stateFrom.pathname === 'string') {
    const path = `${stateFrom.pathname}${stateFrom.search ?? ''}${stateFrom.hash ?? ''}`
    if (path.startsWith('/')) return path
  }

  return '/dashboard'
}

export default function AuthPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { signIn, isAuthenticated } = useAuth()

  const [username, setUsername] = useState('')
  const [department, setDepartment] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [validation, setValidation] = useState({})

  const redirectPath = useMemo(() => getRedirectPath(location.state?.from), [location.state])

  useEffect(() => {
    if (!isAuthenticated) return
    navigate(redirectPath, { replace: true })
  }, [isAuthenticated, navigate, redirectPath])

  async function handleSubmit(event) {
    event.preventDefault()
    if (submitting) return

    const trimmedUsername = username.trim()
    const nextValidation = {}

    if (!trimmedUsername) nextValidation.username = 'Identificador obrigatorio.'
    if (!password) nextValidation.password = 'Chave de acesso obrigatoria.'

    setValidation(nextValidation)
    setError('')

    if (Object.keys(nextValidation).length > 0) return

    setSubmitting(true)

    try {
      await signIn({
        username: trimmedUsername,
        password,
        terminalId: TERMINAL_ID,
      })

      setPassword('')
      navigate(redirectPath, { replace: true })
    } catch (authError) {
      setError(getErrorText(authError))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="h-full flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="flex-1 flex flex-col border border-gold/35 overflow-hidden"
        style={{ clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))' }}
      >
        <div className="flex items-center justify-between bg-gold/8 border-b border-gold/25 px-5 py-2.5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="page-title-badge text-xs" style={{ clipPath: 'polygon(0 0, 100% 0, calc(100% - 8px) 100%, 0 100%)' }}>
              Autentificar-se
            </div>
            <span className="font-mono text-xs text-moonstone-dark/45">
              Portal de acesso interno
            </span>
          </div>
          <span className="font-mono text-xs text-gold/35">TERMINAL WEB</span>
        </div>

        <div className="flex-1 grid lg:grid-cols-[1.15fr_0.85fr]">
          <form onSubmit={handleSubmit} className="border-b lg:border-b-0 lg:border-r border-gold/15 px-6 sm:px-8 py-7 space-y-6">
            <div className="space-y-3">
              <p className="font-mono text-xs text-gold/55 tracking-[0.28em] uppercase">
                Validacao de Credenciais
              </p>
              <h1 className="font-display text-3xl text-gold leading-tight">
                Acesso restrito aos sistemas internos da Corporacao
              </h1>
              <p className="text-sm text-moonstone-dark/70 leading-relaxed max-w-2xl">
                Entre com seu usuario e senha do backend para liberar o painel operacional.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="font-mono text-xs text-moonstone-dark/55 uppercase tracking-wider">Identificador</span>
                <input
                  type="text"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="EX: godzap"
                  autoComplete="username"
                  className="w-full bg-navy-900/70 border border-gold/20 px-4 py-3 text-sm text-moonstone placeholder-moonstone-dark/35 focus:outline-none"
                />
                {validation.username ? <span className="font-mono text-xs text-[#ff8f8f]">{validation.username}</span> : null}
              </label>
              <label className="space-y-2">
                <span className="font-mono text-xs text-moonstone-dark/55 uppercase tracking-wider">Departamento</span>
                <select
                  className="w-full bg-navy-900/70 border border-gold/20 px-4 py-3 text-sm text-moonstone focus:outline-none"
                  value={department}
                  onChange={(event) => setDepartment(event.target.value)}
                >
                  <option value="">Selecionar</option>
                  <option>Informacao</option>
                  <option>Bem-Estar</option>
                  <option>Seguranca</option>
                  <option>Controle</option>
                  <option>Treinamento</option>
                </select>
              </label>
              <label className="space-y-2 sm:col-span-2">
                <span className="font-mono text-xs text-moonstone-dark/55 uppercase tracking-wider">Chave de acesso</span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Digite sua senha"
                  autoComplete="current-password"
                  className="w-full bg-navy-900/70 border border-gold/20 px-4 py-3 text-sm text-moonstone placeholder-moonstone-dark/35 focus:outline-none"
                />
                {validation.password ? <span className="font-mono text-xs text-[#ff8f8f]">{validation.password}</span> : null}
              </label>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 bg-gold text-navy-950 font-mono text-xs tracking-[0.18em] uppercase disabled:opacity-60"
              >
                {submitting ? 'Validando...' : 'Entrar'}
              </button>
              <button type="button" className="px-5 py-2.5 border border-gold/25 text-gold/60 font-mono text-xs tracking-[0.18em] uppercase">
                Solicitar Acesso
              </button>
              <span className="font-mono text-xs text-moonstone-dark/45">
                {error || 'Sessao autenticada via token temporario do backend.'}
              </span>
            </div>
          </form>

          <div className="px-6 sm:px-7 py-7 bg-gold/4 space-y-5">
            <div className="border border-gold/15 bg-navy-900/50 p-5 space-y-3">
              <p className="section-label">Niveis de Permissao</p>
              <div className="grid gap-2">
                {ACCESS_LEVELS.map((level, index) => (
                  <div key={level} className="flex items-center justify-between border border-gold/10 px-3 py-2 text-sm">
                    <span className="text-moonstone">{level}</span>
                    <span className="font-mono text-xs text-gold/50">A0{index + 1}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-gold/15 bg-navy-900/50 p-5 space-y-3">
              <p className="section-label">Aviso Operacional</p>
              <p className="text-sm text-moonstone-dark/70 leading-relaxed">
                Em ambiente local, o bootstrap padrao cria credenciais para o usuario <span className="font-mono">godzap</span>.
                Ajuste o backend para credenciais reais antes de publicar.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
