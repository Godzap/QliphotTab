import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { getById } from '../data'
import CompanionCard from '../components/CompanionCard'
import CompanionDetailModal from '../components/CompanionDetailModal'
import RoundPlannerPanel from '../components/RoundPlannerPanel'
import UnknownAbnormalityModal from '../components/UnknownAbnormalityModal'

export default function CompanionPage() {
  const [board, setBoard] = useState(() => {
    try { return JSON.parse(localStorage.getItem('companion-board') ?? '[]') } catch { return [] }
  })
  const [selected,     setSelected]     = useState(null)
  const [confirmClear, setConfirmClear] = useState(false)
  const [plannerOpen,  setPlannerOpen]  = useState(false)
  const [employees,    setEmployees]    = useState(() => {
    try { return JSON.parse(localStorage.getItem('companion-employees') ?? '[]') } catch { return [] }
  })
  const [unknowns,     setUnknowns]     = useState(() => {
    try { return JSON.parse(localStorage.getItem('companion-unknown') ?? '[]') } catch { return [] }
  })
  const [unknownSheet, setUnknownSheet] = useState(null)

  useEffect(() => {
    localStorage.setItem('companion-board', JSON.stringify(board))
  }, [board])

  useEffect(() => {
    localStorage.setItem('companion-employees', JSON.stringify(employees))
  }, [employees])

  useEffect(() => {
    localStorage.setItem('companion-unknown', JSON.stringify(unknowns))
  }, [unknowns])

  useEffect(() => {
    const handler = (e) => {
      const { id, category } = e.detail
      setBoard(prev =>
        prev.find(x => x.id === id && x.category === category)
          ? prev
          : [...prev, { id, category }]
      )
    }
    window.addEventListener('companion-add-entry', handler)
    return () => window.removeEventListener('companion-add-entry', handler)
  }, [])

  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey && e.key === 'a') {
        e.preventDefault()
        window.dispatchEvent(new Event('open-companion-picker'))
        return
      }
      if (e.ctrlKey && e.key === 'e') {
        e.preventDefault()
        setPlannerOpen(prev => !prev)
        return
      }
      if (e.key === 'Escape') {
        setPlannerOpen(false)
        return
      }
      if (!e.ctrlKey && !e.altKey && !e.metaKey && !e.shiftKey) {
        const tag = document.activeElement?.tagName
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
        const n = parseInt(e.key, 10)
        if (n >= 1 && n <= board.length) {
          e.preventDefault()
          const { id, category } = board[n - 1]
          setSelected({ id, category })
        }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [board])

  const selectedIndex = selected
    ? board.findIndex(x => x.id === selected.id && x.category === selected.category)
    : -1

  const boardItems = [
    ...board
      .map(({ id, category }) => {
        const entry = getById(category, id)
        return entry ? { id, name: entry.name, category } : null
      })
      .filter(Boolean),
    ...unknowns.map(u => ({ id: u.id, name: u.name || '—', category: 'unknown' })),
  ]

  function remove(id, category) {
    setBoard(prev => prev.filter(x => !(x.id === id && x.category === category)))
    if (selected?.id === id && selected?.category === category) setSelected(null)
  }

  function removeAll() {
    setBoard([])
    setSelected(null)
    setConfirmClear(false)
  }

  function saveUnknown(entry) {
    setUnknowns(prev => {
      const exists = prev.find(u => u.id === entry.id)
      return exists ? prev.map(u => u.id === entry.id ? entry : u) : [...prev, entry]
    })
  }

  function deleteUnknown(id) {
    setUnknowns(prev => prev.filter(u => u.id !== id))
    setUnknownSheet(null)
  }

  function navigate(delta) {
    if (selectedIndex < 0) return
    const next = selectedIndex + delta
    if (next >= 0 && next < board.length) setSelected(board[next])
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col border border-gold/35 overflow-hidden h-full"
      style={{ clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))' }}
    >
      {/* Panel header */}
      <div className="flex items-center justify-between bg-gold/8 border-b border-gold/25 px-5 py-2.5">
        <div className="flex items-center gap-3">
          <div
            className="page-title-badge text-xs"
            style={{ clipPath: 'polygon(0 0, 100% 0, calc(100% - 8px) 100%, 0 100%)' }}
          >
            Companion
          </div>
          <span className="font-mono text-[10px] text-moonstone-dark/40 tracking-wider">
            Active board — {board.length} {board.length === 1 ? 'entry' : 'entries'}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {board.length > 0 && (
            <button
              onClick={() => setConfirmClear(true)}
              className="text-xs font-mono text-gold/30 hover:text-tier-aleph
                border border-gold/15 hover:border-tier-aleph/50
                px-3 py-1 transition-all"
            >
              Remove All
            </button>
          )}
          <button
            onClick={() => setPlannerOpen(prev => !prev)}
            className={`hint-glitter flex items-center gap-1.5 text-xs font-mono
              border px-3 py-1 transition-all
              ${plannerOpen
                ? 'text-gold border-gold/60 bg-gold/10'
                : 'text-gold/50 hover:text-gold border-gold/25 hover:border-gold/60 bg-navy-800/60 hover:bg-navy-800'
              }`}
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
            </svg>
            Round Planner
            <kbd className="text-[9px] font-mono text-gold/40 bg-navy-800 border border-gold/25 px-1 py-0.5 leading-none">Ctrl+E</kbd>
          </button>
          <div className="hidden sm:flex items-center divide-x divide-gold/20">
            <span className="flex items-center gap-1 font-mono text-[10px] text-moonstone-dark/70 tracking-wider pr-3">
              <kbd className="text-[9px] font-mono text-gold/80 bg-navy-800 border border-gold/50 px-1 py-0.5 leading-none">1–9</kbd>
              <span>to open</span>
            </span>
            <span className="flex items-center gap-1 font-mono text-[10px] text-moonstone-dark/70 tracking-wider pl-3">
              <kbd className="text-[9px] font-mono text-gold/80 bg-navy-800 border border-gold/50 px-1 py-0.5 leading-none">Ctrl</kbd>
              +<span className="text-gold/80">A</span>
              <span>to add</span>
            </span>
          </div>
          <button
            onClick={() => window.dispatchEvent(new Event('open-companion-picker'))}
            className="flex items-center gap-1.5 text-xs font-mono text-gold/50 hover:text-gold
              border border-gold/25 hover:border-gold/60 bg-navy-800/60 hover:bg-navy-800
              px-3 py-1 transition-all"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Abnormality
          </button>
        </div>
      </div>

      {/* Content row: board + planner */}
      <div className="flex flex-1 min-h-0 relative">

        {/* Board */}
        <div className="flex-1 min-w-0 overflow-y-auto px-5 pb-5 pt-3">
          {board.length === 0 && unknowns.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
              <svg className="w-10 h-10 text-gold/15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
              </svg>
              <p className="font-mono text-xs text-moonstone-dark/35 tracking-wider">No entries on board.</p>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => window.dispatchEvent(new Event('open-companion-picker'))}
                  className="text-xs font-mono text-gold/40 hover:text-gold transition-colors underline underline-offset-2"
                >
                  Add your first abnormality →
                </button>
                <span className="text-moonstone-dark/20 font-mono text-xs">or</span>
                <button
                  onClick={() => setUnknownSheet('new')}
                  className="text-xs font-mono text-moonstone/30 hover:text-moonstone transition-colors underline underline-offset-2"
                >
                  Create a field note →
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {board.map(({ id, category }, idx) => {
                const entry = getById(category, id)
                if (!entry) return null
                return (
                  <CompanionCard
                    key={`${category}-${id}`}
                    entry={entry}
                    category={category}
                    index={idx + 1}
                    onClick={() => setSelected({ id, category })}
                    onRemove={() => remove(id, category)}
                  />
                )
              })}

              {unknowns.map((u, idx) => (
                <div
                  key={u.id}
                  className="relative group cursor-pointer card-base card-hover bg-navy-900/90 border border-gold/15"
                  onClick={() => setUnknownSheet(u)}
                >
                  <span className="absolute top-1.5 left-1.5 z-10 w-5 h-5 flex items-center justify-center
                    bg-navy-950/80 border border-gold/30 font-mono text-[10px] text-gold/50
                    group-hover:text-gold group-hover:border-gold/60 transition-colors leading-none">
                    {board.length + idx + 1}
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteUnknown(u.id) }}
                    className="absolute top-1.5 right-1.5 z-10 opacity-0 group-hover:opacity-100
                      w-5 h-5 flex items-center justify-center
                      bg-navy-950/80 border border-gold/30 text-gold/60
                      hover:text-gold hover:border-gold/70 transition-all text-xs leading-none"
                    title="Remove entry"
                  >
                    ×
                  </button>
                  <div className="w-full aspect-square overflow-hidden border-b border-gold/10
                    flex items-center justify-center bg-navy-900">
                    <span className="font-display text-4xl text-gold/10">?</span>
                  </div>
                  <div className="p-2.5 space-y-1.5">
                    <p className="font-display text-xs text-moonstone leading-tight line-clamp-2">
                      {u.name || '—'}
                    </p>
                    {u.level && (
                      <p className="font-mono text-[10px] text-moonstone-dark/40">{u.level}</p>
                    )}
                    <span className="inline-block font-mono text-[9px] tracking-widest px-1 py-px border
                      text-moonstone/50 border-moonstone/20 bg-moonstone/5">
                      FIELD NOTES
                    </span>
                  </div>
                </div>
              ))}

              <button
                onClick={() => setUnknownSheet('new')}
                className="card-base border border-dashed border-gold/15 hover:border-gold/40
                  flex flex-col items-center justify-center gap-2
                  text-gold/20 hover:text-gold/50 transition-all cursor-pointer
                  bg-navy-900/40 hover:bg-navy-900/70 aspect-square"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                <span className="font-mono text-[9px] tracking-widest uppercase">Field Notes</span>
              </button>
            </div>
          )}

        </div>

        {/* Planner panel — slides in from right */}
        <AnimatePresence>
          {plannerOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 520, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="shrink-0 border-l border-gold/25 overflow-hidden h-full"
            >
              <RoundPlannerPanel
                boardItems={boardItems}
                employees={employees}
                setEmployees={setEmployees}
                onClose={() => setPlannerOpen(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Confirm clear portal */}
      {createPortal(
        <AnimatePresence>
          {confirmClear && (
            <>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[200]"
                onClick={() => setConfirmClear(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className="fixed inset-0 z-[201] flex items-center justify-center px-4 pointer-events-none"
              >
                <div
                  className="pointer-events-auto bg-navy-950 border-2 border-gold/50 shadow-gold-lg px-8 py-6 flex flex-col gap-4 text-center"
                  style={{ clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))' }}
                >
                  <p className="font-display text-base text-moonstone tracking-wide">Clear the entire board?</p>
                  <p className="font-mono text-xs text-moonstone-dark/45">This will remove all {board.length} {board.length === 1 ? 'entry' : 'entries'}.</p>
                  <div className="flex items-center justify-center gap-3 pt-1">
                    <button
                      onClick={() => setConfirmClear(false)}
                      className="text-xs font-mono text-gold/50 hover:text-gold border border-gold/25 hover:border-gold/60 px-5 py-1.5 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={removeAll}
                      className="text-xs font-mono text-tier-aleph/70 hover:text-tier-aleph border border-tier-aleph/30 hover:border-tier-aleph/60 px-5 py-1.5 transition-all"
                    >
                      Remove All
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}

      <CompanionDetailModal
        entryId={selected?.id}
        category={selected?.category}
        onClose={() => setSelected(null)}
        onPrev={() => navigate(-1)}
        onNext={() => navigate(1)}
        index={selectedIndex}
        total={board.length}
      />

      {unknownSheet != null && (
        <UnknownAbnormalityModal
          entry={unknownSheet === 'new' ? null : unknownSheet}
          onSave={saveUnknown}
          onDelete={deleteUnknown}
          onClose={() => setUnknownSheet(null)}
        />
      )}
    </motion.div>
  )
}
