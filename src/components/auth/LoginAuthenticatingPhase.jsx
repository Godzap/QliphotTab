import { motion } from 'framer-motion'

const STEPS = [
  'VERIFICANDO IDENTIFICADOR DE FUNCIONARIO',
  'CONSULTANDO REGISTRO CORPORATIVO',
  'VALIDANDO NIVEL DE ACESSO',
  'CARREGANDO PERMISSOES DE DEPARTAMENTO',
  'ESTABELECENDO SESSAO SEGURA',
]

export default function LoginAuthenticatingPhase({ username, progressIndex }) {
  const percent = Math.round((Math.min(progressIndex, STEPS.length) / STEPS.length) * 100)

  return (
    <motion.section
      className="dpl-phase dpl-phase-auth"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="dpl-auth-spinner" aria-hidden="true" />

      <div className="dpl-auth-user">
        <p>VERIFICANDO</p>
        <h2>{(username || '---').toUpperCase()}</h2>
      </div>

      <div className="dpl-progress-wrap">
        <div className="dpl-progress-track">
          <div className="dpl-progress-value" style={{ width: `${percent}%` }} />
        </div>
        <div className="dpl-progress-meta">
          <span>{STEPS[Math.max(0, progressIndex - 1)] || STEPS[0]}</span>
          <strong>{percent}%</strong>
        </div>
      </div>

      <div className="dpl-auth-steps">
        {STEPS.map((step, index) => {
          const active = index < progressIndex
          return (
            <div key={step} className={`dpl-auth-step ${active ? 'is-ok' : ''}`}>
              <span />
              <p>{step}</p>
              {active ? <strong>OK</strong> : null}
            </div>
          )
        })}
      </div>
    </motion.section>
  )
}
