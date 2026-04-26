import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getAll, CATEGORY_META } from '../data'
import SearchBar from '../components/SearchBar'
import TierBadge from '../components/TierBadge'
import CompletionDots from '../components/CompletionDots'
import EntryImage from '../components/EntryImage'

const SECTION_OPTIONS = {
  abnormalities: [
    { label: 'GEST', key: 'hasManagerialNotes' },
    { label: 'DEF', key: 'hasDefensiveNotes' },
    { label: 'PESQ', key: 'hasEmpiricalResearch' },
  ],
  systems: [
    { label: 'INFO', key: 'hasNotes' },
    { label: 'PESQ', key: 'hasEmpiricalResearch' },
  ],
  ordeals: [
    { label: 'DESC', key: 'hasDescription' },
    { label: 'PESQ', key: 'hasEmpiricalResearch' },
  ],
}

function getCompletionChecks(entry, category) {
  if (category === 'abnormalities' && entry.sourceCategory === 'tools') {
    return [
      { label: 'INFO', filled: entry.hasNotes },
      { label: 'PESQ', filled: entry.hasEmpiricalResearch },
    ]
  }

  if (category === 'abnormalities') {
    return [
      { label: 'GEST', filled: entry.hasManagerialNotes },
      { label: 'DEF', filled: entry.hasDefensiveNotes },
      { label: 'PESQ', filled: entry.hasEmpiricalResearch },
    ]
  }

  if (category === 'systems') {
    return [
      { label: 'INFO', filled: entry.hasNotes },
      { label: 'PESQ', filled: entry.hasEmpiricalResearch },
    ]
  }

  if (category === 'ordeals') {
    return [
      { label: 'DESC', filled: entry.hasDescription },
      { label: 'PESQ', filled: entry.hasEmpiricalResearch },
    ]
  }

  return []
}

const rowVariants = {
  hidden: { opacity: 0, x: -8 },
  show: { opacity: 1, x: 0, transition: { duration: 0.2, ease: 'easeOut' } },
}

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.03 } },
}

export default function ListPage({ category }) {
  const meta = CATEGORY_META[category]
  const entries = getAll(category)

  const [query, setQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState(new Set())
  const [sectionFilters, setSectionFilters] = useState(new Set())

  function toggleFilter(opt) {
    setActiveFilters((prev) => {
      const next = new Set(prev)
      next.has(opt) ? next.delete(opt) : next.add(opt)
      return next
    })
  }

  function toggleSection(key) {
    setSectionFilters((prev) => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  const filtered = useMemo(() => {
    return entries.filter((entry) => {
      if (activeFilters.size > 0 && !activeFilters.has(entry[meta.filterKey])) return false
      if (sectionFilters.size > 0) {
        for (const key of sectionFilters) {
          if (!entry[key]) return false
        }
      }
      if (query) {
        const q = query.toLowerCase()
        return (
          entry.name.toLowerCase().includes(q) ||
          (entry.code && entry.code.toLowerCase().includes(q)) ||
          (entry.notes && entry.notes.toLowerCase().includes(q))
        )
      }
      return true
    })
  }, [entries, query, activeFilters, sectionFilters, meta])

  return (
    <div className="h-full flex flex-col">
      <div
        className="flex-1 flex flex-col border border-gold/35 overflow-hidden"
        style={{ clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))' }}
      >
        <div className="flex items-center justify-between bg-gold/8 border-b border-gold/25 px-5 py-2.5 shrink-0">
          <div className="flex items-center gap-3">
            <div
              className="page-title-badge text-xs"
              style={{ clipPath: 'polygon(0 0, 100% 0, calc(100% - 8px) 100%, 0 100%)' }}
            >
              {meta.label}
            </div>
            <span className="font-mono text-xs text-moonstone-dark/50 hidden sm:block">
              {meta.description}
            </span>
          </div>
          <span className="font-mono text-xs text-gold/40">
            {filtered.length} / {entries.length} registros
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 px-5 py-3 border-b border-gold/15 bg-gold/3 shrink-0">
          <div className="w-56">
            <SearchBar
              value={query}
              onChange={setQuery}
              placeholder="Buscar..."
            />
          </div>

          <span className="w-px h-5 bg-gold/15 mx-1" />

          <button
            onClick={() => setActiveFilters(new Set())}
            className={`px-3 py-1 text-xs font-mono tracking-wider border transition-all duration-150
              ${activeFilters.size === 0
                ? 'border-gold/70 text-gold bg-gold/10'
                : 'border-gold/20 text-moonstone-dark/50 hover:border-gold/40 hover:text-moonstone-dark'
              }`}
          >
            Todos
          </button>

          {meta.filterOptions.map((opt) => {
            const styles = meta.filterStyles[opt]
            const isActive = activeFilters.has(opt)
            return (
              <button
                key={opt}
                onClick={() => toggleFilter(opt)}
                className={`px-3 py-1 text-xs font-mono tracking-wider border transition-all duration-150
                  ${isActive
                    ? `${styles.color} ${styles.border} ${styles.bg}`
                    : 'border-gold/15 text-moonstone-dark/45 hover:border-gold/35 hover:text-moonstone-dark'
                  }`}
              >
                {opt}
              </button>
            )
          })}

          <span className="w-px h-5 bg-gold/15 mx-1" />

          <button
            onClick={() => setSectionFilters(new Set())}
            className={`px-3 py-1 text-xs font-mono tracking-wider border transition-all duration-150
              ${sectionFilters.size === 0
                ? 'border-gold/70 text-gold bg-gold/10'
                : 'border-gold/20 text-moonstone-dark/50 hover:border-gold/40 hover:text-moonstone-dark'
              }`}
          >
            Todos
          </button>

          {SECTION_OPTIONS[category]?.map(({ label, key }) => {
            const active = sectionFilters.has(key)
            return (
              <button
                key={key}
                onClick={() => toggleSection(key)}
                className={`px-3 py-1 text-xs font-mono tracking-wider border transition-all duration-150
                  ${active
                    ? 'border-gold/70 text-gold bg-gold/10'
                    : 'border-gold/15 text-moonstone-dark/45 hover:border-gold/35 hover:text-moonstone-dark'
                  }`}
              >
                {label}
              </button>
            )
          })}
        </div>

        <div className="flex items-center gap-4 px-5 py-2 border-b border-gold/10 bg-navy-800/30 shrink-0">
          <div className="w-10 shrink-0" />
          <span className="flex-1 text-xs font-mono text-moonstone-dark/40 uppercase tracking-widest">Nome</span>
          <span className="w-16 text-xs font-mono text-moonstone-dark/40 uppercase tracking-widest">Classe</span>
          <span className="w-24 text-xs font-mono text-moonstone-dark/40 uppercase tracking-widest hidden md:block">Codigo</span>
          <span className="w-40 text-xs font-mono text-moonstone-dark/40 uppercase tracking-widest hidden lg:block">Resumo</span>
          <span className="w-40 text-xs font-mono text-moonstone-dark/40 uppercase tracking-widest hidden md:block">Dados</span>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="placeholder-text text-center py-16 px-6">
              Faust ainda nao possui acesso a estas informacoes.
            </p>
          ) : (
            <motion.div variants={containerVariants} initial="hidden" animate="show">
              {filtered.map((entry) => {
                const checks = getCompletionChecks(entry, category)
                return (
                  <motion.div key={entry.id} variants={rowVariants}>
                    <Link
                      to={`/${category}/${entry.id}`}
                      className="flex items-center gap-4 px-5 py-3 border-b border-gold/8 hover:bg-gold/5 transition-colors duration-100 group"
                    >
                      <div className="w-10 h-10 shrink-0">
                        <EntryImage
                          image={entry.image}
                          name={entry.name}
                          category={entry.sourceCategory === 'tools' ? 'tools' : category}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-base font-display text-moonstone group-hover:text-gold transition-colors truncate">
                          {entry.name}
                        </p>
                      </div>

                      <div className="w-16 shrink-0">
                        {(entry.level || entry.color) && (
                          <TierBadge level={entry.level} color={entry.color} />
                        )}
                      </div>

                      <span className="w-24 font-mono text-sm text-moonstone-dark/55 truncate hidden md:block">
                        {entry.code ?? '-'}
                      </span>

                      <span className="w-40 text-sm text-moonstone-dark/45 truncate hidden lg:block">
                        {entry.notes || entry.classification || '-'}
                      </span>

                      <div className="w-40 shrink-0 hidden md:block">
                        <CompletionDots checks={checks} />
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
