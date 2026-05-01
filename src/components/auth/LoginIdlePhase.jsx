import { motion } from 'framer-motion'
import CornerBrackets from './CornerBrackets'

const BOOT_LINES = [
  '> SISTEMA DATAPAD INICIALIZADO',
  '> INTRANET CORPORATIVA - ACESSO RESTRITO',
  '> IDENTIFICACAO DE FUNCIONARIO NECESSARIA',
  '> AGUARDANDO CREDENCIAIS...',
]

export default function LoginIdlePhase({ onEngage }) {
  return (
    <motion.section
      className="dpl-phase dpl-phase-idle"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24 }}
    >
      <div className="dpl-idle-emblem">
        <img src="/images/Lobotomy-Logo.png" alt="Lobotomy Corporation" />
        <div>
          <h1>LOBOTOMY CORPORATION</h1>
          <p>SISTEMA INTERNO - CLASSIFICADO</p>
        </div>
      </div>

      <div className="dpl-boot-box">
        <CornerBrackets size={10} inset={4} />
        {BOOT_LINES.map((line, index) => (
          <p key={line} className={index === BOOT_LINES.length - 1 ? 'is-highlight' : ''}>
            {line}
            {index === BOOT_LINES.length - 1 ? <span className="dpl-cursor">|</span> : null}
          </p>
        ))}
      </div>

      <button type="button" className="dpl-primary-btn" onClick={onEngage}>
        INICIAR IDENTIFICACAO
      </button>

      <div className="dpl-legal">
        <strong>AVISO:</strong> Este terminal e propriedade da Lobotomy Corporation. Tentativas de acesso
        nao autorizado serao monitoradas e reportadas.
      </div>
    </motion.section>
  )
}
