import { useEffect, useRef } from 'react'
import { motion, useAnimate } from 'framer-motion'
import CornerBrackets from './CornerBrackets'

const PHASE_TRANSITION = { duration: 0.32, ease: [0.16, 1, 0.3, 1] }

export default function LoginInputPhase({
  username,
  password,
  onUsernameChange,
  onPasswordChange,
  onSubmit,
  isSubmitting,
  validationErrors,
  backendError,
  isLocked,
  attempts,
  maxAttempts,
}) {
  const canSubmit = Boolean(username.trim() && password) && !isSubmitting && !isLocked
  const hasError = Boolean(backendError)

  const [scope, animateShake] = useAnimate()
  const isFirst = useRef(true)

  useEffect(() => {
    if (isFirst.current) { isFirst.current = false; return }
    if (backendError) {
      animateShake(scope.current, { x: [0, -6, 6, -5, 5, -3, 3, 0] }, { duration: 0.48, ease: 'easeInOut' })
    }
  }, [backendError])

  return (
    <motion.section
      className="dpl-phase dpl-phase-input"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8, transition: { duration: 0.18, ease: 'easeIn' } }}
      transition={PHASE_TRANSITION}
    >
      <div ref={scope} className={`dpl-form-shell ${hasError ? 'is-error' : ''}`}>
        <CornerBrackets color={hasError ? '#B83232' : '#3A332C'} size={12} inset={6} />

        {hasError && <div className="dpl-form-error-bar" />}

        <header>
          <p>AUTENTICACAO DE FUNCIONARIO</p>
          <h2>IDENTIFICACAO</h2>
        </header>

        <form onSubmit={onSubmit} className="dpl-form-grid">
          <label className="dpl-field">
            <span>IDENTIFICADOR DO FUNCIONARIO</span>
            <input
              type="text"
              autoComplete="username"
              spellCheck={false}
              value={username}
              onChange={(event) => onUsernameChange(event.target.value)}
              placeholder="ex: godzap"
              disabled={isSubmitting || isLocked}
            />
            {validationErrors.username ? <small>{validationErrors.username}</small> : null}
          </label>

          <label className="dpl-field">
            <span>CODIGO DE ACESSO</span>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => onPasswordChange(event.target.value)}
              placeholder="••••••••"
              disabled={isSubmitting || isLocked}
            />
            {validationErrors.password ? <small>{validationErrors.password}</small> : null}
          </label>

          {backendError ? (
            <div className="dpl-inline-error" role="alert">
              {backendError}
            </div>
          ) : null}

          {isLocked ? (
            <div className="dpl-inline-error" role="alert">
              Terminal bloqueado por excesso de tentativas ({String(attempts).padStart(3, '0')}/{String(maxAttempts).padStart(3, '0')}).
            </div>
          ) : null}

          <button type="submit" className="dpl-primary-btn" disabled={!canSubmit}>
            {isSubmitting ? 'VERIFICANDO...' : 'SOLICITAR ACESSO'}
          </button>
        </form>
      </div>
    </motion.section>
  )
}
