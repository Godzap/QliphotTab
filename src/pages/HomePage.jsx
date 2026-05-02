import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getAll } from '../data'

const CATEGORY_ICONS = {
  abnormalities: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c-1.5 3-4 4.5-4 8a4 4 0 0 0 8 0c0-3.5-2.5-5-4-8z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v1a3 3 0 0 0 6 0v-1" />
      <circle cx="12" cy="11" r="1.5" fill="currentColor" />
    </svg>
  ),
  systems: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 6.75h15m-15 5.25h15m-15 5.25h9" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 15.75 18 17.25l3-3" />
    </svg>
  ),
  ordeals: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  ),
  auth: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V7.875a4.125 4.125 0 1 0-8.25 0V10.5m-1.5 0h10.5A1.5 1.5 0 0 1 18.75 12v6a1.5 1.5 0 0 1-1.5 1.5H6.75A1.5 1.5 0 0 1 5.25 18v-6a1.5 1.5 0 0 1 1.5-1.5Z" />
    </svg>
  ),
}

const NAV_ENTRIES = [
  {
    key: 'abnormalities',
    to: '/abnormalities',
    label: 'Anomalias',
    description: 'Catalogo central com anomalias e artefatos anormais sob observacao da instalacao.',
    shortcut: 'Ctrl+2',
  },
  {
    key: 'systems',
    to: '/systems',
    label: 'Sistemas',
    description: 'Colecao de modulos internos, consoles e protocolos de apoio ao trabalho dos departamentos.',
    shortcut: 'Ctrl+3',
  },
  {
    key: 'ordeals',
    to: '/ordeals',
    label: 'Times',
    description: 'Quadros operacionais, respostas de campo e frentes acionadas conforme o estado da instalacao.',
    shortcut: 'Ctrl+4',
  },
  {
    key: 'auth',
    to: '/auth',
    label: 'Autentificar-se',
    description: 'Acesso de funcionarios para validacao de credenciais e liberacao de recursos internos.',
    shortcut: 'Ctrl+5',
  },
]

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
}

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

export default function HomePage() {
  const counts = {
    abnormalities: getAll('abnormalities').length,
    systems: getAll('systems').length,
    ordeals: getAll('ordeals').length,
    auth: 1,
  }

  return (
    <div className="min-h-full">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="border border-gold/35 min-h-full flex flex-col"
        style={{ clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))' }}
      >
        <div className="flex items-center justify-between bg-gold/8 border-b border-gold/25 px-6 py-2.5">
          <span className="section-label tracking-[0.2em]">Terminal de Acesso - Uso Interno</span>
          <span className="font-mono text-xs text-gold/30">REF-00 // ACESSO LIBERADO</span>
        </div>

        <div className="px-6 sm:px-8 py-6 border-b border-gold/15">
          <p className="font-mono text-xs text-gold/50 tracking-[0.25em] uppercase mb-1">
            Bem-vindo ao
          </p>
          <h1
            className="font-display text-4xl font-bold text-gold mb-2 leading-tight tracking-wide"
            style={{ textShadow: '0 0 24px rgba(0,255,153,0.55), 0 0 8px rgba(0,255,153,0.35)' }}
          >
            QliphotTab
          </h1>
          <p className="font-mono text-sm text-gold/60 tracking-widest mb-5 border-b border-gold/15 pb-4">
            O repositorio central da Corporacao Lobotomia.
          </p>

          <div className="space-y-3.5 text-sm text-moonstone leading-relaxed border-l-2 border-gold/30 pl-5">
            <p>
              Consulte os registros centrais do seu departamento, acompanhe dados operacionais
              e monitore os recursos internos autorizados para a sua funcao.
            </p>
            <p>
              Por meio deste terminal, cada equipe pode acessar recursos especificos
              conforme seu time e sua autorizacao:
            </p>
            <ul className="space-y-1.5 pl-1">
              {[
                { team: 'Informacao', desc: 'registros, estudos e classificacoes sobre anomalias.' },
                { team: 'Bem-Estar', desc: 'dados de acompanhamento, suporte e estabilidade de funcionarios.' },
                { team: 'Seguranca', desc: 'relatorios de brechas, riscos e eventos criticos.' },
                { team: 'Controle', desc: 'coordenacao geral das equipes, sistemas e operacoes.' },
              ].map(({ team, desc }) => (
                <li key={team} className="flex gap-2 items-baseline">
                  <span className="text-gold/70 font-mono text-xs tracking-widest shrink-0">-</span>
                  <span>
                    <span className="text-gold font-semibold">{team}</span>
                    <span className="text-moonstone-dark/70"> - {desc}</span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="text-moonstone-dark/50 italic text-xs pt-1 border-t border-gold/10 pt-3">
              Caso seja um funcionario novo ou ainda tenha duvidas sobre o funcionamento da corporacao,
              consulte o <span className="text-gold/60 not-italic font-mono tracking-wide">Guia para Novos Funcionarios</span>.
              Nele voce encontrara as informacoes essenciais para comecar.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-0 bg-gold/5 border-t border-b border-gold/20 px-6 py-2">
          <span className="section-label tracking-[0.2em] text-gold/70">Navegacao</span>
          <span className="flex-1 ml-4 h-px bg-gold/15" />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-gold/15"
        >
          {NAV_ENTRIES.map(({ key, to, label, description, shortcut }) => (
            <motion.div key={key} variants={cardVariants}>
              <Link to={to} className="block group h-full overflow-hidden relative">
                <div className="px-5 py-5 h-full flex flex-col gap-3 transition-colors duration-200 group-hover:bg-gold/5">
                  <div className="flex items-start justify-between">
                    <span className="text-gold/60 group-hover:text-gold transition-colors">
                      {CATEGORY_ICONS[key]}
                    </span>
                    <div className="flex items-baseline gap-1.5">
                      <span
                        className="font-counter text-2xl font-bold text-gold/30 group-hover:text-gold/70 transition-all duration-300 leading-none tracking-widest"
                        style={{ fontVariantNumeric: 'tabular-nums' }}
                      >
                        {String(counts[key]).padStart(2, '0')}
                      </span>
                      <span className="font-mono text-[10px] text-gold/20 group-hover:text-gold/45 transition-colors tracking-wider">
                        {key === 'auth' ? 'portal' : 'registros'}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1">
                    <h2 className="font-display text-lg text-moonstone group-hover:text-gold transition-colors mb-1.5">
                      {label}
                    </h2>
                    <p className="text-xs text-moonstone-dark/55 leading-relaxed">
                      {description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-mono text-gold/40 group-hover:text-gold transition-colors">
                      <span>{key === 'auth' ? 'Abrir portal' : 'Ver registros'}</span>
                      <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                      </svg>
                    </div>
                    <kbd className="text-[10px] font-mono text-gold/55 bg-navy-800 border border-gold/25 px-1.5 py-0.5 tracking-wide">
                      {shortcut}
                    </kbd>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gold origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </Link>
            </motion.div>
          ))}
        </motion.div>

      </motion.div>
    </div>
  )
}
