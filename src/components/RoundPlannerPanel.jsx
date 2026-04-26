import { useState } from 'react'

const WORK_TYPES = ['Instinct', 'Insight', 'Attachment', 'Repression']

const WORK_COLORS = {
  Instinct:   'text-red-400/80',
  Insight:    'text-yellow-400/80',
  Attachment: 'text-purple-400/80',
  Repression: 'text-sky-400/80',
}

function emptyRow() { return { employee: '', workType: '', itemId: '' } }

export default function RoundPlannerPanel({ boardItems, employees, setEmployees, onClose }) {
  const [nameInput, setNameInput] = useState('')
  const [rounds, setRounds]       = useState([emptyRow()])

  function addEmployee() {
    const name = nameInput.trim()
    if (!name || employees.includes(name)) return
    setEmployees(prev => [...prev, name])
    setNameInput('')
  }

  function killEmployee(name) {
    setEmployees(prev => prev.filter(e => e !== name))
    setRounds(prev => prev.map(r => r.employee === name ? { ...r, employee: '' } : r))
  }

  function updateRound(idx, field, value) {
    setRounds(prev => {
      const next = prev.map((r, i) => i === idx ? { ...r, [field]: value } : r)
      const last = next[next.length - 1]
      if (last.employee && last.workType && last.itemId && next.length < employees.length) {
        return [...next, emptyRow()]
      }
      return next
    })
  }

  function resetRound() { setRounds([emptyRow()]) }

  const usedEmployees = new Set(rounds.map(r => r.employee).filter(Boolean))
  const usedItems     = new Set(rounds.map(r => r.itemId).filter(Boolean))

  const selectCls = `w-full bg-navy-900 border border-gold/20 text-[11px] font-mono text-moonstone
    px-2 py-1.5 focus:outline-none focus:border-gold/50 transition-colors cursor-pointer
    appearance-none`

  return (
    <div className="flex flex-col h-full bg-navy-950">

      {/* Header */}
      <div className="flex items-center justify-between bg-gold/8 border-b border-gold/25 px-4 py-2.5 shrink-0">
        <div className="flex items-center gap-2">
          <div
            className="page-title-badge text-xs"
            style={{ clipPath: 'polygon(0 0, 100% 0, calc(100% - 8px) 100%, 0 100%)' }}
          >
            Round Planner
          </div>
          <span className="font-mono text-[10px] text-moonstone-dark/40 tracking-wider">
            {employees.length} {employees.length === 1 ? 'employee' : 'employees'}
          </span>
        </div>
        <button onClick={onClose} className="text-gold/35 hover:text-gold transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">

        {/* ── Employees ── */}
        <section className="space-y-2">
          <span className="section-label tracking-[0.2em] text-gold/70">Employees</span>

          <div className="flex gap-1.5">
            <input
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addEmployee()}
              placeholder="Employee name…"
              className="flex-1 bg-navy-900 border border-gold/20 px-3 py-1.5 text-xs font-mono
                text-moonstone placeholder-moonstone-dark/25 focus:outline-none focus:border-gold/50
                transition-colors"
              style={{ clipPath: 'polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 0 100%)' }}
            />
            <button
              onClick={addEmployee}
              className="shrink-0 text-xs font-mono text-gold/50 hover:text-gold
                border border-gold/25 hover:border-gold/60 px-3 transition-all"
            >
              Add
            </button>
          </div>

          {employees.length > 0 ? (
            <div className="space-y-1">
              {employees.map(emp => (
                <div key={emp} className="flex items-center justify-between bg-navy-900/50 border border-gold/10 px-3 py-1.5">
                  <span className="text-xs font-mono text-moonstone truncate">{emp}</span>
                  <button
                    onClick={() => killEmployee(emp)}
                    className="font-mono text-[9px] tracking-widest text-gold/25 hover:text-tier-aleph transition-colors ml-3 shrink-0 uppercase"
                  >
                    Kill
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[10px] font-mono text-moonstone-dark/25 italic">No employees registered.</p>
          )}
        </section>

        {/* ── Divider ── */}
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-gold/15" />
          <span className="section-label tracking-[0.2em] text-gold/70">Assignments</span>
          <div className="h-px flex-1 bg-gold/15" />
        </div>

        {/* ── Round rows ── */}
        <section className="space-y-1.5">
          {rounds.map((row, idx) => (
            <div key={idx} className="space-y-1">
              {/* Row number */}
              <span className="font-mono text-[9px] text-gold/25 tracking-widest">
                #{String(idx + 1).padStart(2, '0')}
              </span>
              <div className="flex gap-1">
                {/* Employee */}
                <select
                  value={row.employee}
                  onChange={e => updateRound(idx, 'employee', e.target.value)}
                  className={selectCls}
                >
                  <option value="">Employee</option>
                  {employees
                    .filter(e => !usedEmployees.has(e) || e === row.employee)
                    .map(e => <option key={e} value={e}>{e}</option>)
                  }
                </select>

                {/* Work Type */}
                <select
                  value={row.workType}
                  onChange={e => updateRound(idx, 'workType', e.target.value)}
                  className={`${selectCls} ${row.workType ? WORK_COLORS[row.workType] : ''}`}
                >
                  <option value="">Work Type</option>
                  {WORK_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>

                {/* Entity */}
                <select
                  value={row.itemId}
                  onChange={e => updateRound(idx, 'itemId', e.target.value)}
                  className={selectCls}
                >
                  <option value="">Entity</option>
                  {boardItems
                    .filter(b => !usedItems.has(b.id) || b.id === row.itemId)
                    .map(b => <option key={b.id} value={b.id}>{b.name}</option>)
                  }
                </select>
              </div>
            </div>
          ))}

          {employees.length === 0 && (
            <p className="text-[10px] font-mono text-moonstone-dark/25 italic">
              Add employees above to plan assignments.
            </p>
          )}

          {employees.length > 0 && rounds.length >= employees.length && (
            <p className="text-[10px] font-mono text-gold/25 tracking-wider pt-1">
              All employees assigned.
            </p>
          )}
        </section>
      </div>

      {/* Footer */}
      <div className="shrink-0 border-t border-gold/15 px-4 py-3">
        <button
          onClick={resetRound}
          className="w-full text-[10px] font-mono text-gold/35 hover:text-gold uppercase tracking-widest
            border border-gold/15 hover:border-gold/45 py-2 transition-all"
        >
          Reset Round
        </button>
      </div>
    </div>
  )
}
