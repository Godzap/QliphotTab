import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getAll, CATEGORY_META } from '../data'
import { useTheme, TEAMS } from '../context/ThemeContext'

const CATEGORY_ICONS = {
  abnormalities: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c-1.5 3-4 4.5-4 8a4 4 0 0 0 8 0c0-3.5-2.5-5-4-8z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v1a3 3 0 0 0 6 0v-1" />
      <circle cx="12" cy="11" r="1.5" fill="currentColor" />
    </svg>
  ),
  tools: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.472-2.472M11.42 15.17 6.343 20.246a2.652 2.652 0 0 1-3.75-3.75l5.076-5.077m0 0 2.473-2.472m0 0L14.25 5.25a2.652 2.652 0 0 1 3.75 3.75l-3.472 3.47" />
    </svg>
  ),
  ordeals: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  ),
  companion: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
    </svg>
  ),
}

const NAV_ENTRIES = [
  { key: 'abnormalities', to: '/abnormalities', label: 'Abnormalities', description: 'Anomalous entities contained within the facility. Each poses unique risk and research value.', shortcut: 'Ctrl+2' },
  { key: 'tools',         to: '/tools',         label: 'Tools',         description: 'Equipment derived from abnormality research. Classified by usage type and risk tier.',          shortcut: 'Ctrl+3' },
  { key: 'ordeals',       to: '/ordeals',       label: 'Ordeals',       description: 'Wave incursions drawn at designated cycle intervals. Severity scales with facility progress.',  shortcut: 'Ctrl+4' },
  { key: 'companion',     to: '/companion',     label: 'Companion',     description: 'Active session board. Pin abnormalities and tools for quick reference during play.',             shortcut: 'Ctrl+5' },
]

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
}

const containerVariants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.1 } },
}

export default function HomePage() {
  const { team, setTeam } = useTheme()
  const counts = {
    abnormalities: getAll('abnormalities').length,
    tools:         getAll('tools').length,
    ordeals:       getAll('ordeals').length,
    companion:     (() => { try { return JSON.parse(localStorage.getItem('companion-board') ?? '[]').length } catch { return 0 } })(),
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
        {/* ── Panel header strip ───────────────────────────── */}
        <div className="flex items-center justify-between bg-gold/8 border-b border-gold/25 px-6 py-2.5">
          <span className="section-label tracking-[0.2em]">Terminal de Acesso — Uso Interno</span>
          <span className="font-mono text-xs text-gold/30">REF-00 // ACESSO LIBERADO</span>
        </div>

        {/* ── Hero: welcome text ────────────────────────────── */}
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
            O repositório central da Corporação Lobotomia.
          </p>

          <div className="space-y-3.5 text-sm text-moonstone leading-relaxed border-l-2 border-gold/30 pl-5">
            <p>
              Acesse as principais ferramentas do seu departamento, registre informações
              importantes e acompanhe os dados operacionais da instalação.
            </p>
            <p>
              Por meio deste tablet, cada equipe poderá acessar recursos específicos
              conforme seu time e ranque:
            </p>
            <ul className="space-y-1.5 pl-1">
              {[
                { team: 'Informação', desc: 'registros e estudos sobre Anomalias.' },
                { team: 'Bem-Estar',  desc: 'dados e acompanhamento dos funcionários.' },
                { team: 'Segurança', desc: 'relatórios de brechas, riscos e incidentes.' },
                { team: 'Controle',  desc: 'coordenação geral das equipes e operações.' },
              ].map(({ team, desc }) => (
                <li key={team} className="flex gap-2 items-baseline">
                  <span className="text-gold/70 font-mono text-xs tracking-widest shrink-0">—</span>
                  <span>
                    <span className="text-gold font-semibold">{team}</span>
                    <span className="text-moonstone-dark/70"> — {desc}</span>
                  </span>
                </li>
              ))}
            </ul>
            <p>
              Faça login abaixo para se autenticar e liberar os recursos disponíveis para o seu cargo.
            </p>
            <p className="text-moonstone-dark/50 italic text-xs pt-1 border-t border-gold/10 pt-3">
              Caso seja um funcionário novo ou ainda tenha dúvidas sobre o funcionamento da
              corporação, consulte o{' '}
              <span className="text-gold/60 not-italic font-mono tracking-wide">Guia para Novos Funcionários</span>.
              {' '}Lá você encontrará as informações essenciais para começar.
            </p>
          </div>
        </div>

        {/* ── Team theme switcher ───────────────────────────── */}
        <div className="border-t border-gold/20">
          <div className="flex items-center gap-0 bg-gold/5 border-b border-gold/15 px-6 py-2">
            <span className="section-label tracking-[0.2em] text-gold/70">Selecionar Time</span>
            <span className="flex-1 ml-4 h-px bg-gold/15" />
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 divide-x divide-gold/10">
            {TEAMS.map((t) => {
              const active = team === t.id
              return (
                <motion.button
                  key={t.id}
                  onClick={() => setTeam(t.id)}
                  whileTap={{ scale: 0.97 }}
                  className="relative flex flex-col items-center justify-center gap-1.5 py-4 px-3 transition-colors duration-200 group overflow-hidden"
                  style={{
                    background: active ? `${t.bg}cc` : 'transparent',
                  }}
                >
                  {/* Active top bar */}
                  {active && (
                    <motion.span
                      layoutId="team-active-bar"
                      className="absolute top-0 left-0 right-0 h-0.5"
                      style={{ background: t.color }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}

                  {/* Color swatch dot */}
                  <span
                    className="w-4 h-4 rounded-full border border-white/10 transition-all duration-200"
                    style={{
                      background: t.color,
                      boxShadow: active ? `0 0 10px ${t.color}99` : 'none',
                    }}
                  />

                  {/* Team name */}
                  <span
                    className="font-mono text-[10px] tracking-widest uppercase leading-none transition-all duration-200"
                    style={{ color: active ? t.color : 'rgba(var(--t-accent-rgb) / 0.4)' }}
                  >
                    {t.label}
                  </span>

                  {/* Sublabel */}
                  <span
                    className="font-mono text-[9px] tracking-wider opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: t.textColor + '80' }}
                  >
                    {t.sublabel}
                  </span>

                  {/* Hover tint */}
                  <span
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                    style={{ background: `${t.color}0d` }}
                  />
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* ── Category divider ─────────────────────────────── */}
        <div className="flex items-center gap-0 bg-gold/5 border-t border-b border-gold/20 px-6 py-2">
          <span className="section-label tracking-[0.2em] text-gold/70">Navigation</span>
          <span className="flex-1 ml-4 h-px bg-gold/15" />
        </div>

        {/* ── Category cards ───────────────────────────────── */}
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
                  {/* Icon + count row */}
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
                        {key === 'companion' ? 'on board' : 'entries'}
                      </span>
                    </div>
                  </div>

                  {/* Title + desc */}
                  <div className="flex-1">
                    <h2 className="font-display text-lg text-moonstone group-hover:text-gold transition-colors mb-1.5">
                      {label}
                    </h2>
                    <p className="text-xs text-moonstone-dark/55 leading-relaxed">
                      {description}
                    </p>
                  </div>

                  {/* Bottom arrow + shortcut */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-mono text-gold/40 group-hover:text-gold transition-colors">
                      <span>{key === 'companion' ? 'Open board' : 'View all'}</span>
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

        {/* ── Sephirah Query Interface (WIP placeholder) ── */}
        <div className="flex-1 border-t border-gold/20 relative overflow-hidden flex flex-col min-h-[220px]">

          {/* Section header */}
          <div className="flex items-center justify-between bg-gold/5 border-b border-gold/15 px-6 py-2 shrink-0">
            <span className="section-label tracking-[0.2em]">Sephirah Query Interface</span>
            <div className="flex items-center gap-2">
              <motion.span
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="w-1.5 h-1.5 rounded-full bg-tier-aleph"
              />
              <span className="font-mono text-xs text-tier-aleph/70 tracking-widest">OFFLINE</span>
            </div>
          </div>

          {/* Ghost chat content — visible but locked */}
          <div className="flex-1 px-6 py-5 space-y-4 select-none pointer-events-none opacity-25">
            <div className="flex gap-3 items-start">
              <span className="font-mono text-xs text-gold shrink-0 pt-1">FAUST ›</span>
              <p className="text-sm text-moonstone italic">This terminal is not yet operational. Stand by.</p>
            </div>
            <div className="flex justify-end">
              <p className="text-sm text-moonstone-dark/60 bg-navy-800/40 border border-gold/10 px-4 py-2 max-w-sm font-mono text-xs">
                What work type is safe for Spider Bud?
              </p>
            </div>
            <div className="flex gap-3 items-start">
              <span className="font-mono text-xs text-gold shrink-0 pt-1">FAUST ›</span>
              <p className="text-sm text-moonstone italic">Query processing suspended pending system activation.</p>
            </div>
          </div>

          {/* Ghost input row */}
          <div className="shrink-0 border-t border-gold/15 px-4 py-3 flex gap-3 opacity-20 pointer-events-none select-none">
            <div
              className="flex-1 bg-navy-900/60 border border-gold/20 px-4 py-2 text-sm font-mono text-moonstone-dark/40"
              style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%)' }}
            >
              Query the compendium…
            </div>
            <div className="border border-gold/20 text-gold/40 font-mono text-xs px-5 py-2 tracking-widest uppercase flex items-center">
              Send
            </div>
          </div>

          {/* WIP overlay */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              background: 'repeating-linear-gradient(-45deg, transparent, transparent 18px, rgba(0,255,153,0.015) 18px, rgba(0,255,153,0.015) 36px)',
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="border border-gold/30 bg-navy-950/90 px-10 py-6 text-center space-y-2.5"
              style={{ clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))' }}
            >
              <p
                className="font-display text-lg text-gold/80 tracking-[0.3em] uppercase font-semibold"
                style={{ textShadow: '0 0 20px rgba(0,255,153,0.3)' }}
              >
                Work In Progress
              </p>
              <p className="font-mono text-xs text-moonstone-dark/50 tracking-widest mt-1">
                Sephirah Query Interface — Pending Implementation
              </p>
            </motion.div>
          </div>

        </div>
      </motion.div>
    </div>
  )
}
