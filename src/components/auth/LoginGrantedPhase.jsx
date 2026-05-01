import { motion } from 'framer-motion'
import CornerBrackets from './CornerBrackets'

const PHASE_TRANSITION = { duration: 0.38, ease: [0.16, 1, 0.3, 1] }

export default function LoginGrantedPhase({ user, departmentColor }) {
  return (
    <motion.section
      className="dpl-phase dpl-phase-granted"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8, transition: { duration: 0.18, ease: 'easeIn' } }}
      transition={PHASE_TRANSITION}
    >
      <div className="dpl-result-icon is-granted dpl-icon-granted-pulse" aria-hidden="true">
        <svg width="30" height="30" viewBox="0 0 32 32">
          <polyline points="6,17 13,24 26,9" fill="none" stroke="#2F6B45" strokeWidth="2.5" strokeLinecap="square" />
        </svg>
      </div>

      <div className="dpl-result-copy">
        <p>ACESSO CONCEDIDO</p>
        <h2>{(user?.username || '').toUpperCase()}</h2>
      </div>

      <div className="dpl-granted-card" style={{ '--dept-color': departmentColor }}>
        <CornerBrackets color={departmentColor} size={10} inset={5} />
        <div className="dpl-granted-line" />
        <div className="dpl-granted-grid">
          <div>
            <span>CODIGO</span>
            <strong>{user?.employeeCode || '-'}</strong>
          </div>
          <div>
            <span>DEPARTAMENTO</span>
            <strong className="is-dept">{user?.department || '-'}</strong>
          </div>
          <div>
            <span>CARGO</span>
            <strong>{user?.role || '-'}</strong>
          </div>
          <div>
            <span>NIVEL DE ACESSO</span>
            <strong>{String(user?.accessLevel ?? 0).padStart(2, '0')}</strong>
          </div>
        </div>
      </div>

      <p className="dpl-redirecting">
        REDIRECIONANDO PARA O PAINEL OPERACIONAL <span>█</span>
      </p>
    </motion.section>
  )
}
