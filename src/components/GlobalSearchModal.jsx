import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { searchAll, CATEGORY_META } from '../data'
import TierBadge from './TierBadge'

export default function GlobalSearchModal() {
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState('navigate')
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef(null)
  const listRef = useRef(null)
  const navigate = useNavigate()

  const allResults = searchAll(query)
  const results = mode === 'add'
    ? allResults.filter((r) => r.category === 'abnormalities')
    : allResults

  useEffect(() => {
    const handler = () => {
      setMode('navigate')
      setOpen(true)
      setQuery('')
      setSelectedIndex(-1)
    }
    window.addEventListener('open-global-search', handler)
    return () => window.removeEventListener('open-global-search', handler)
  }, [])

  useEffect(() => {
    const handler = () => {
      if (open) return
      setMode('add')
      setOpen(true)
      setQuery('')
      setSelectedIndex(-1)
    }
    window.addEventListener('open-companion-picker', handler)
    return () => window.removeEventListener('open-companion-picker', handler)
  }, [open])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 40)
  }, [open])

  useEffect(() => {
    setSelectedIndex(-1)
  }, [query])

  useEffect(() => {
    if (selectedIndex < 0 || !listRef.current) return
    const el = listRef.current.children[selectedIndex]
    el?.scrollIntoView({ block: 'nearest' })
  }, [selectedIndex])

  function close() {
    setOpen(false)
    setQuery('')
    setSelectedIndex(-1)
  }

  function openResult(result) {
    if (mode === 'add') {
      window.dispatchEvent(new CustomEvent('companion-add-entry', { detail: { id: result.id, category: result.category } }))
    } else {
      navigate(`/${result.category}/${result.id}`)
    }
    close()
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape') {
      close()
      return
    }
    if (!results.length) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((i) => Math.max(i - 1, -1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const target = selectedIndex >= 0 ? results[selectedIndex] : results[0]
      if (target) openResult(target)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[200]"
            onClick={close}
          />

          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.97 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="fixed inset-0 z-[201] flex items-center justify-center px-4 pointer-events-none"
            style={{ alignItems: 'flex-start', paddingTop: '18vh' }}
          >
            <div className="w-full max-w-2xl pointer-events-auto">
              <div
                className="bg-navy-950 border-2 border-gold/60 shadow-gold-lg overflow-hidden"
                style={{ clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))' }}
              >
                <div className="flex items-center gap-3 px-5 py-4 border-b border-gold/15">
                  <svg className="w-4 h-4 text-gold/60 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                  </svg>
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={mode === 'add' ? 'Adicionar anomalia ao painel...' : 'Buscar registros, codigos e notas...'}
                    className="flex-1 bg-transparent text-moonstone text-base font-mono placeholder-moonstone-dark/35 focus:outline-none"
                  />
                  {query && (
                    <button onClick={() => setQuery('')} className="text-moonstone-dark/40 hover:text-gold transition-colors shrink-0">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>

                {query && (
                  <div ref={listRef} className="max-h-[360px] overflow-y-auto divide-y divide-gold/10">
                    {results.length === 0 ? (
                      <p className="px-5 py-4 text-sm italic text-moonstone-dark/50">
                        Faust ainda nao possui acesso a estas informacoes.
                      </p>
                    ) : (
                      results.map((result, idx) => (
                        <button
                          key={`${result.category}-${result.id}`}
                          onClick={() => openResult(result)}
                          onMouseEnter={() => setSelectedIndex(idx)}
                          className={`w-full flex items-center gap-4 px-5 py-3 text-left transition-colors
                            ${selectedIndex === idx
                              ? 'bg-gold/10 border-l-2 border-gold'
                              : 'border-l-2 border-transparent hover:bg-navy-800/60'
                            }`}
                        >
                          <span className="text-xs font-mono text-gold/40 uppercase tracking-widest w-24 shrink-0">
                            {CATEGORY_META[result.category]?.label ?? result.category}
                          </span>

                          <span className="flex-1 text-sm font-display text-moonstone">
                            {result.name}
                          </span>

                          {result.code && (
                            <span className="font-mono text-xs text-moonstone-dark/50 shrink-0">
                              {result.code}
                            </span>
                          )}

                          {(result.level || result.color) && (
                            <TierBadge level={result.level} color={result.color} />
                          )}
                        </button>
                      ))
                    )}
                  </div>
                )}

                <div className="flex items-center gap-5 px-5 py-2.5 border-t border-gold/10 bg-navy-900/50">
                  <span className="text-xs font-mono text-moonstone-dark/40">
                    <kbd className="text-gold/50">↑↓</kbd> navegar
                  </span>
                  <span className="text-xs font-mono text-moonstone-dark/40">
                    <kbd className="text-gold/50">↵</kbd> {mode === 'add' ? 'adicionar' : 'abrir'}
                  </span>
                  <span className="text-xs font-mono text-moonstone-dark/40">
                    <kbd className="text-gold/50">esc</kbd> fechar
                  </span>
                  <span className="ml-auto text-xs font-mono text-moonstone-dark/25">
                    Ctrl+L
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
