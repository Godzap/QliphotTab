import { motion } from 'framer-motion'
import CornerBrackets from './CornerBrackets'

export default function LoginDeniedPhase({ attempts, maxAttempts, message, onRetry, locked }) {
  return (
    <motion.section
      className="dpl-phase dpl-phase-denied"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
    >
      <div className="dpl-result-icon is-denied" aria-hidden="true">
        <svg width="30" height="30" viewBox="0 0 32 32">
          <line x1="8" y1="8" x2="24" y2="24" stroke="#B83232" strokeWidth="2.5" />
          <line x1="24" y1="8" x2="8" y2="24" stroke="#B83232" strokeWidth="2.5" />
        </svg>
      </div>

      <div className="dpl-result-copy">
        <p>ACESSO NEGADO</p>
        <h2>{locked ? 'TERMINAL BLOQUEADO' : 'CREDENCIAIS INVALIDAS'}</h2>
      </div>

      <div className="dpl-denied-card">
        <CornerBrackets color="#B83232" size={10} inset={5} />
        <h3>ALERTA DE SEGURANCA</h3>
        <p>{message}</p>
        <div className="dpl-denied-attempts">
          <span>TENTATIVAS REGISTRADAS</span>
          <strong>{String(attempts).padStart(3, '0')} / {String(maxAttempts).padStart(3, '0')}</strong>
        </div>
      </div>

      {!locked ? (
        <button type="button" className="dpl-primary-btn" onClick={onRetry}>
          TENTAR NOVAMENTE
        </button>
      ) : null}
    </motion.section>
  )
}
