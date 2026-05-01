import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import CornerBrackets from './CornerBrackets'

const BOOT_LINES = [
  '> SISTEMA DATAPAD INICIALIZADO',
  '> INTRANET CORPORATIVA - ACESSO RESTRITO',
  '> IDENTIFICACAO DE FUNCIONARIO NECESSARIA',
  '> AGUARDANDO CREDENCIAIS...',
]

const PHASE_TRANSITION = { duration: 0.38, ease: [0.16, 1, 0.3, 1] }

function useTypewriter(lines, speed = 28, startDelay = 0) {
  const [displayed, setDisplayed] = useState([])
  const cancelRef = useRef(false)

  useEffect(() => {
    cancelRef.current = false

    async function run() {
      if (startDelay > 0) await sleep(startDelay)
      for (let li = 0; li < lines.length; li++) {
        const line = lines[li]
        for (let ci = 0; ci <= line.length; ci++) {
          if (cancelRef.current) return
          setDisplayed((prev) => {
            const next = [...prev]
            next[li] = line.slice(0, ci)
            return next
          })
          await sleep(ci === 0 ? 110 : speed)
        }
      }
    }

    run()
    return () => { cancelRef.current = true }
  }, [])

  return displayed
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

export default function LoginIdlePhase({ onEngage }) {
  const displayed = useTypewriter(BOOT_LINES, 28, 180)

  return (
    <motion.section
      className="dpl-phase dpl-phase-idle"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8, transition: { duration: 0.18, ease: 'easeIn' } }}
      transition={PHASE_TRANSITION}
    >
      <div className="dpl-idle-emblem">
        <div className="dpl-idle-logo-wrap">
          <div className="dpl-idle-ring" />
          <img
            src={`${import.meta.env.BASE_URL}images/corporacaologo.png`}
            onError={(e) => {
              e.currentTarget.onerror = null
              e.currentTarget.src = `${import.meta.env.BASE_URL}images/Lobotomy-Logo.png`
            }}
            alt="Lobotomy Corporation"
          />
        </div>
        <div>
          <h1>LOBOTOMY CORPORATION</h1>
          <p>SISTEMA INTERNO - CLASSIFICADO</p>
        </div>
      </div>

      <div className="dpl-boot-box">
        <CornerBrackets size={10} inset={4} />
        {BOOT_LINES.map((line, index) => {
          const text = displayed[index] ?? ''
          const isLast = index === BOOT_LINES.length - 1
          return (
            <p key={line} className={isLast ? 'is-highlight' : ''}>
              {text}
              {isLast && <span className="dpl-cursor">█</span>}
            </p>
          )
        })}
      </div>

      <button type="button" className="dpl-primary-btn dpl-idle-cta" onClick={onEngage}>
        INICIAR IDENTIFICACAO
      </button>

      <div className="dpl-legal">
        <strong>AVISO:</strong> Este terminal e propriedade da Lobotomy Corporation. Tentativas de acesso
        nao autorizado serao monitoradas e reportadas.
      </div>
    </motion.section>
  )
}
