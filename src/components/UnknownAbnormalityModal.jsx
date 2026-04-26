import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'

const WORK_TYPES = ['Instinct', 'Insight', 'Attachment', 'Repression']
const RESULTS    = ['Bad', 'Neutral', 'Good']

const RESULT_COLORS = {
  Bad:     'text-red-400/80',
  Neutral: 'text-yellow-400/80',
  Good:    'text-green-400/80',
}

const LEVEL_COLORS = {
  Zayn:  'text-tier-zayin/80',
  Teth:  'text-tier-teth/80',
  HE:    'text-tier-he/80',
  WAW:   'text-tier-waw/80',
  Aleph: 'text-tier-aleph/80',
}

const WORK_COLORS = {
  Instinct:   'text-red-400/80',
  Insight:    'text-yellow-400/80',
  Attachment: 'text-purple-400/80',
  Repression: 'text-sky-400/80',
}

function emptyRow() { return { workType: '', roll: '', result: '' } }

function initDraft(entry) {
  return {
    name:    entry?.name    ?? '',
    level:   entry?.level   ?? '',
    workLog: entry?.workLog?.length ? entry.workLog : [emptyRow()],
    notes:   entry?.notes   ?? '',
  }
}

export default function UnknownAbnormalityModal({ entry, onSave, onDelete, onClose }) {
  const [draft,         setDraft]         = useState(() => initDraft(entry))
  const [copied,        setCopied]        = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    setDraft(initDraft(entry))
    setConfirmDelete(false)
  }, [entry])

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  function updateLog(idx, field, value) {
    setDraft(prev => {
      const next = prev.workLog.map((r, i) => i === idx ? { ...r, [field]: value } : r)
      const last = next[next.length - 1]
      if (last.workType && last.roll && last.result) {
        return { ...prev, workLog: [...next, emptyRow()] }
      }
      return { ...prev, workLog: next }
    })
  }

  function handleSave() {
    onSave({ ...draft, id: entry?.id ?? Date.now().toString() })
    onClose()
  }

  async function handleExport() {
    const payload = { name: draft.name, level: draft.level, workLog: draft.workLog, notes: draft.notes }
    await navigator.clipboard.writeText(JSON.stringify(payload, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const inputCls = `w-full bg-navy-900 border border-gold/20 px-3 py-1.5 text-xs font-mono
    text-moonstone placeholder-moonstone-dark/25 focus:outline-none focus:border-gold/50 transition-colors`

  const selectCls = `bg-navy-900 border border-gold/20 text-[11px] font-mono text-moonstone
    px-2 py-1.5 focus:outline-none focus:border-gold/50 transition-colors cursor-pointer appearance-none`

  return createPortal(
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200]"
        onClick={onClose}
      />
      <motion.div
        key="panel"
        initial={{ opacity: 0, y: 16, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.97 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="fixed inset-0 z-[201] flex items-center justify-center px-4 py-8 pointer-events-none"
      >
        <div
          className="w-full max-w-2xl max-h-full pointer-events-auto flex flex-col
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
                Field Notes
              </div>
              <span className="font-mono text-xs text-moonstone-dark/45 truncate max-w-[300px]">
                {draft.name || 'New Entry'}
              </span>
            </div>
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

          {/* Body */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

            {/* Name + Level row */}
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2 space-y-1">
                <label className="section-label tracking-[0.18em] text-gold/70">Name</label>
                <input
                  value={draft.name}
                  onChange={e => setDraft(p => ({ ...p, name: e.target.value }))}
                  placeholder="Unknown designation…"
                  className={inputCls}
                  style={{ clipPath: 'polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 0 100%)' }}
                />
              </div>
              <div className="space-y-1">
                <label className="section-label tracking-[0.18em] text-gold/70">Level</label>
                <select
                  value={draft.level}
                  onChange={e => setDraft(p => ({ ...p, level: e.target.value }))}
                  className={`${selectCls} w-full [&>option]:text-moonstone ${draft.level ? LEVEL_COLORS[draft.level] : ''}`}
                >
                  <option value="">—</option>
                  {['Zayn', 'Teth', 'HE', 'WAW', 'Aleph'].map(l => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Work Log */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="section-label tracking-[0.18em] text-gold/70">Work Log</span>
                <div className="h-px flex-1 bg-gold/10" />
              </div>

              <div className="space-y-1.5">
                {draft.workLog.map((row, idx) => (
                  <div key={idx} className="flex gap-1.5 items-center">
                    <span className="font-mono text-[9px] text-gold/20 w-5 shrink-0 text-right">
                      {String(idx + 1).padStart(2, '0')}
                    </span>

                    <select
                      value={row.workType}
                      onChange={e => updateLog(idx, 'workType', e.target.value)}
                      className={`${selectCls} flex-1 [&>option]:text-moonstone ${row.workType ? WORK_COLORS[row.workType] : ''}`}
                    >
                      <option value="">Work Type</option>
                      {WORK_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>

                    <select
                      value={row.roll}
                      onChange={e => updateLog(idx, 'roll', e.target.value)}
                      className={`${selectCls} flex-1 [&>option]:text-moonstone ${row.roll ? RESULT_COLORS[row.roll] : ''}`}
                    >
                      <option value="">Roll</option>
                      {RESULTS.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>

                    <input
                      value={row.result}
                      onChange={e => updateLog(idx, 'result', e.target.value)}
                      placeholder="Result"
                      className={`${selectCls} flex-1`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1">
              <label className="section-label tracking-[0.18em] text-gold/70">Notes</label>
              <textarea
                value={draft.notes}
                onChange={e => setDraft(p => ({ ...p, notes: e.target.value }))}
                placeholder="Observations, behaviors, hazards…"
                rows={4}
                className={`${inputCls} resize-none leading-relaxed`}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="shrink-0 border-t border-gold/10 bg-navy-900/50 px-5 py-2.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={handleExport}
                className="flex items-center gap-1.5 text-xs font-mono text-gold/45 hover:text-gold
                  border border-gold/20 hover:border-gold/50 px-3 py-1.5 transition-all"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                </svg>
                {copied ? 'Copied!' : 'Export JSON'}
              </button>
            </div>

            <div className="flex items-center gap-2">
              {entry && !confirmDelete && (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="text-xs font-mono text-tier-aleph/40 hover:text-tier-aleph
                    border border-tier-aleph/20 hover:border-tier-aleph/50 px-3 py-1.5 transition-all"
                >
                  Delete
                </button>
              )}
              {entry && confirmDelete && (
                <>
                  <span className="font-mono text-[10px] text-tier-aleph/60">Confirm delete?</span>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="text-xs font-mono text-gold/40 hover:text-gold border border-gold/20
                      hover:border-gold/50 px-3 py-1.5 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => onDelete(entry.id)}
                    className="text-xs font-mono text-tier-aleph/70 hover:text-tier-aleph
                      border border-tier-aleph/40 hover:border-tier-aleph/70 px-3 py-1.5 transition-all"
                  >
                    Confirm
                  </button>
                </>
              )}
              <button
                onClick={handleSave}
                className="text-xs font-mono text-gold/70 hover:text-gold
                  border border-gold/40 hover:border-gold/70 bg-gold/5 hover:bg-gold/10
                  px-4 py-1.5 transition-all"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body
  )
}
