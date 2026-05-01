import { motion } from 'framer-motion'

const STEPS = [
  'VERIFICANDO IDENTIFICADOR DE FUNCIONARIO',
  'CONSULTANDO REGISTRO CORPORATIVO',
  'VALIDANDO NIVEL DE ACESSO',
  'CARREGANDO PERMISSOES DE DEPARTAMENTO',
  'ESTABELECENDO SESSAO SEGURA',
]

const PHASE_TRANSITION = { duration: 0.32, ease: [0.16, 1, 0.3, 1] }

export default function LoginAuthenticatingPhase({ username, progressIndex }) {
  const percent = Math.round((Math.min(progressIndex, STEPS.length) / STEPS.length) * 100)

  return (
    <motion.section
      className="dpl-phase dpl-phase-auth"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8, transition: { duration: 0.18, ease: 'easeIn' } }}
      transition={PHASE_TRANSITION}
    >
      {/* Dual-ring SVG spinner */}
      <div className="dpl-auth-spinner-wrap" aria-hidden="true">
        <svg
          width={80}
          height={80}
          viewBox="0 0 80 80"
          style={{ position: 'absolute', animation: 'dpl-spin 2.2s linear infinite' }}
        >
          <circle cx={40} cy={40} r={36} fill="none" stroke="#3A332C" strokeWidth={1} />
          <circle
            cx={40} cy={40} r={36}
            fill="none" stroke="#BFA35A" strokeWidth={1}
            strokeDasharray="30 196" strokeLinecap="square"
          />
        </svg>
        <svg
          width={80}
          height={80}
          viewBox="0 0 80 80"
          style={{ position: 'absolute', animation: 'dpl-spin 1.4s linear infinite reverse' }}
        >
          <circle cx={40} cy={40} r={26} fill="none" stroke="#2A2520" strokeWidth={1} />
          <circle
            cx={40} cy={40} r={26}
            fill="none" stroke="#BFA35A" strokeWidth={0.5}
            strokeDasharray="12 151" strokeLinecap="square"
            opacity={0.5}
          />
        </svg>
        <div className="dpl-auth-spinner-dot" />
      </div>

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
