import { motion } from 'framer-motion'
import CornerBrackets from './CornerBrackets'

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

  return (
    <motion.section
      className="dpl-phase dpl-phase-input"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className={`dpl-form-shell ${backendError ? 'is-error' : ''}`}>
        <CornerBrackets color={backendError ? '#B83232' : '#3A332C'} size={12} inset={6} />

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
              placeholder="********"
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
