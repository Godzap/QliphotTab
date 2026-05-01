import { motion } from 'framer-motion'
import CornerBrackets from './CornerBrackets'

export default function LoginGrantedPhase({ user, departmentColor }) {
  return (
    <motion.section
      className="dpl-phase dpl-phase-granted"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
    >
      <div className="dpl-result-icon is-granted" aria-hidden="true">
        <svg width="30" height="30" viewBox="0 0 32 32">
          <polyline points="6,17 13,24 26,9" fill="none" stroke="#2F6B45" strokeWidth="2.5" />
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
        REDIRECIONANDO PARA O PAINEL OPERACIONAL <span>|</span>
      </p>
    </motion.section>
  )
}
