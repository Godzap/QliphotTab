import { useEffect, useState } from 'react'
import './LoadingScreen.css'

const LOG_LINES = [
  { text: 'Verificando integridade do núcleo...',      delay: 1900, type: 'active' },
  { text: 'Núcleo verificado.',                         delay: 2400, type: 'done'   },
  { text: 'Carregando banco de anormalidades...',       delay: 2800, type: 'active' },
  { text: '[ AVISO ] 9 entidades detectadas.',          delay: 3400, type: 'warn'   },
  { text: 'Módulo de contenção inicializado.',          delay: 3900, type: 'done'   },
  { text: 'Conectando às câmeras de monitoramento...', delay: 4400, type: 'active' },
  { text: 'Câmeras ativas — Setor A, B, C.',            delay: 5000, type: 'done'   },
  { text: 'Carregando perfis de agentes...',            delay: 5400, type: 'active' },
  { text: '6 agentes disponíveis para implantação.',   delay: 5900, type: 'done'   },
  { text: 'Sistema pronto.',                            delay: 6600, type: 'done'   },
]

const PROGRESS_KF = [
  { pct: 8,   delay: 400  },
  { pct: 18,  delay: 800  },
  { pct: 35,  delay: 1400 },
  { pct: 51,  delay: 2000 },
  { pct: 67,  delay: 2600 },
  { pct: 82,  delay: 3200 },
  { pct: 90,  delay: 3600 },
  { pct: 95,  delay: 3800 },
  { pct: 100, delay: 4000 },
]

const STATUS = {
  0:   'Inicializando sistema...',
  18:  'Verificando módulos...',
  35:  'Carregando anormalidades...',
  51:  'Atenção: conteúdo sensível detectado.',
  67:  'Estabelecendo protocolos de segurança...',
  82:  'Calibrando medidores de energia...',
  95:  'Finalizando...',
  100: 'Sistema operacional.',
}

function getStatus(pct) {
  const keys = Object.keys(STATUS).map(Number).sort((a, b) => b - a)
  for (const k of keys) if (pct >= k) return STATUS[k]
  return STATUS[0]
}

const BASE_DELAY = 1600

const LOG_COLOR  = { done: '#1abc9c', warn: '#b83232', active: '#555' }
const LOG_PREFIX = { done: '✓ ',      warn: '⚠ ',      active: '▸ '  }

export default function LoadingScreen({ onComplete }) {
  const [logLines,     setLogLines]     = useState([])
  const [pct,          setPct]          = useState(0)
  const [statusTop,    setStatusTop]    = useState(STATUS[0])
  const [statusBottom, setStatusBottom] = useState('Aguardando conexão...')
  const [showComplete, setShowComplete] = useState(false)
  const [fading,       setFading]       = useState(false)
  const [clock,        setClock]        = useState('')

  useEffect(() => {
    const tick = () => {
      const n = new Date()
      const p = v => String(v).padStart(2, '0')
      setClock(`DIA 04 · ${p(n.getHours())}:${p(n.getMinutes())}:${p(n.getSeconds())}`)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const timers = LOG_LINES.map(({ text, delay, type }) =>
      setTimeout(() => setLogLines(prev => [...prev, { text, type }].slice(-5)), delay)
    )
    return () => timers.forEach(clearTimeout)
  }, [])

  useEffect(() => {
    const timers = PROGRESS_KF.map(({ pct: p, delay }) =>
      setTimeout(() => {
        setPct(p)
        setStatusTop(getStatus(p))
        setStatusBottom(p >= 100
          ? 'Conexão estabelecida — Gestor autorizado.'
          : 'Carregando módulos do sistema...'
        )
      }, BASE_DELAY + delay)
    )
    return () => timers.forEach(clearTimeout)
  }, [])

  useEffect(() => {
    const t1 = setTimeout(() => setShowComplete(true), 7000)
    const t2 = setTimeout(() => setFading(true), 8200)
    const t3 = setTimeout(() => onComplete?.(), 8800)
    return () => [t1, t2, t3].forEach(clearTimeout)
  }, [onComplete])

  const logoSrc = `${import.meta.env.BASE_URL}images/Lobotomy-Logo.png`

  return (
    <div
      className="lc-loading-wrap"
      style={{
        opacity: fading ? 0 : 1,
        transition: fading ? 'opacity 0.6s ease' : 'none',
        pointerEvents: fading ? 'none' : 'all',
      }}
    >
      <div className="lc-tablet-frame">
        <div className="lc-screen">
          <div className="lc-power-flash" />
          <div className="lc-scanlines" />
          <div className="lc-vignette" />
          <div className="lc-deco-top" />
          <div className="lc-deco-bottom" />
          <div className="lc-corner lc-corner-tl" />
          <div className="lc-corner lc-corner-tr" />
          <div className="lc-corner lc-corner-bl" />
          <div className="lc-corner lc-corner-br" />
          <div className="lc-glitch" />

          <div className="lc-top-bar">
            <span className="lc-top-bar-title">Sistema de Gestão — Terminal 4</span>
            <div className="lc-top-dots">
              <div style={{ background: '#b83232' }} />
              <div style={{ background: '#e8b700' }} />
              <div style={{ background: '#1abc9c' }} />
            </div>
          </div>

          <div className="lc-content">
            <div className="lc-logo-area">
              <img src={logoSrc} alt="Corporação Lobotomy" className="lc-logo-img" />
              <div className="lc-logo-name">Corporação Lobotomy</div>
              <div className="lc-logo-tagline">Enfrente o Medo · Construa o Futuro</div>
            </div>

            <div className="lc-progress-area">
              <div className="lc-progress-label">
                <span>{statusTop}</span>
                <span style={{ color: '#1abc9c' }}>{pct}%</span>
              </div>
              <div className="lc-progress-track">
                <div className="lc-progress-fill" style={{ width: `${pct}%` }} />
              </div>
            </div>

            <div className="lc-log-area">
              {logLines.map((line, i) => (
                <div key={i} className="lc-log-line" style={{ color: LOG_COLOR[line.type] }}>
                  {LOG_PREFIX[line.type]}{line.text}
                </div>
              ))}
            </div>
          </div>

          <div className="lc-complete" style={{ opacity: showComplete ? 1 : 0 }}>
            <span className={`lc-complete-text${showComplete ? ' lc-pulse' : ''}`}>
              Acesso Autorizado
            </span>
          </div>

          <div className="lc-status-bar">
            <div className="lc-status-dot" />
            <span className="lc-status-text">{statusBottom}</span>
            <span className="lc-clock">{clock}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
