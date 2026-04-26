import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { getById } from '../data'
import EntryDetailContent from './EntryDetailContent'

export default function CompanionDetailModal({ entryId, category, onClose, onPrev, onNext, index, total }) {
  const entry = entryId ? getById(category, entryId) : null
  const scrollRef = useRef(null)

  useEffect(() => {
    if (!entry) return
    const handler = (e) => {
      if (e.key === 'Escape')     { onClose(); return }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); onPrev?.() }
      if (e.key === 'ArrowRight') { e.preventDefault(); onNext?.() }
      if (e.key === 'ArrowUp')    { e.preventDefault(); scrollRef.current?.scrollBy({ top: -120, behavior: 'smooth' }) }
      if (e.key === 'ArrowDown')  { e.preventDefault(); scrollRef.current?.scrollBy({ top: 120,  behavior: 'smooth' }) }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [entry, onClose, onPrev, onNext])

  return createPortal(
    <AnimatePresence>
      {entry && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200]"
            onClick={onClose}
          />

          {/* Modal panel */}
          <motion.div
            key={entryId}
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed inset-0 z-[201] flex items-center justify-center px-4 py-8 pointer-events-none"
          >
            <div
              className="w-full max-w-3xl max-h-full pointer-events-auto flex flex-col
                bg-navy-950 border-2 border-gold/60 shadow-gold-lg overflow-hidden"
              style={{ clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))' }}
            >
              {/* Header */}
              <div className="flex items-center justify-between bg-gold/8 border-b border-gold/25 px-5 py-2.5 shrink-0">
                <div className="flex items-center gap-3">
                  <div
                    className="page-title-badge text-xs"
                    style={{ clipPath: 'polygon(0 0, 100% 0, calc(100% - 8px) 100%, 0 100%)' }}
                  >
                    Board Entry
                  </div>
                  <span className="font-mono text-xs text-moonstone-dark/45 truncate max-w-[300px]">
                    {entry.name}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {total > 1 && (
                    <span className="font-mono text-[10px] text-moonstone-dark/30 tracking-wider">
                      {index + 1} / {total}
                    </span>
                  )}
                  <button
                    onClick={onClose}
                    className="flex items-center gap-1.5 text-xs font-mono text-gold/35 hover:text-gold transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Close
                  </button>
                </div>
              </div>

              {/* Scrollable content */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-5">
                <EntryDetailContent entry={entry} category={category} />
              </div>

              {/* Footer with nav */}
              <div className="shrink-0 border-t border-gold/10 bg-navy-900/50 px-5 py-2 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <button
                    onClick={onPrev}
                    disabled={!onPrev || index === 0}
                    className="flex items-center gap-1 text-xs font-mono text-gold/35 hover:text-gold
                      disabled:opacity-20 disabled:cursor-not-allowed transition-colors px-2 py-1"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                    </svg>
                    Prev
                  </button>
                  <button
                    onClick={onNext}
                    disabled={!onNext || index === total - 1}
                    className="flex items-center gap-1 text-xs font-mono text-gold/35 hover:text-gold
                      disabled:opacity-20 disabled:cursor-not-allowed transition-colors px-2 py-1"
                  >
                    Next
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                  </button>
                </div>
                <span className="text-xs font-mono text-moonstone-dark/30">
                  <kbd className="text-gold/40">←→</kbd> navigate &nbsp; <kbd className="text-gold/40">esc</kbd> close
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  )
}
