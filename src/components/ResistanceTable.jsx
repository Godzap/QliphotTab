const DAMAGE_TYPES = [
  { key: 'red',   label: '🔴 Red',   color: 'text-damage-red'   },
  { key: 'white', label: '⬜ White', color: 'text-damage-white' },
  { key: 'black', label: '⬛ Black', color: 'text-damage-black' },
  { key: 'pale',  label: '🩵 Pale',  color: 'text-damage-pale'  },
]

const RESISTANCE_STYLES = {
  Normal:     'text-moonstone/70',
  Weak:       'text-tier-aleph font-semibold',
  Endured:    'text-tier-he',
  Resistant:  'text-tier-teth',
  Immune:     'text-tier-teth font-bold',
  Absorb:     'text-tier-zayin font-bold',
  Vulnerable: 'text-tier-aleph font-bold',
  '?':        'text-moonstone-dark/40 italic',
  'N/A':      'text-moonstone-dark/30',
}

export default function ResistanceTable({ durability, isNonEscaping, enkephalinLocked, enkephalinCost, resistances }) {
  if (isNonEscaping) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-moonstone-dark/60 italic border border-gold-muted/20 bg-navy-800/40 px-4 py-3 rounded-sm">
          Non Escaping Object — this abnormality does not escape and has no defensive stats.
        </p>
        <ResistanceRow resistances={{ red: 'N/A', white: 'N/A', black: 'N/A', pale: 'N/A' }} />
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {durability !== null && durability !== undefined && (
        <p className="text-sm text-moonstone/80">
          <span className="text-moonstone-dark/60 font-mono text-xs tracking-wider uppercase mr-2">Durability</span>
          <span className="font-mono text-gold">{durability}</span>
        </p>
      )}
      {enkephalinLocked && (
        <p className="text-sm text-moonstone-dark/60 italic border border-gold-muted/20 bg-navy-800/40 px-4 py-3 rounded-sm">
          Stats locked behind {enkephalinCost} Enkephalin boxes. Defensive data pending.
        </p>
      )}
      <ResistanceRow resistances={resistances} />
    </div>
  )
}

function ResistanceRow({ resistances }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border border-gold-muted/20 rounded-sm overflow-hidden">
        <thead>
          <tr className="bg-navy-800/60">
            {DAMAGE_TYPES.map(({ key, label, color }) => (
              <th key={key} className={`px-4 py-2 text-center text-xs font-mono ${color}`}>
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="bg-navy-900/40">
            {DAMAGE_TYPES.map(({ key }) => {
              const val = resistances?.[key] ?? '?'
              return (
                <td key={key} className={`px-4 py-2 text-center text-xs ${RESISTANCE_STYLES[val] ?? 'text-moonstone/70'}`}>
                  {val}
                </td>
              )
            })}
          </tr>
        </tbody>
      </table>
    </div>
  )
}
