import RichText from './RichText'

const ROLL_STYLES = {
  Good:    'text-tier-zayin',
  Neutral: 'text-tier-he',
  Bad:     'text-tier-aleph',
}

const WORK_TYPE_STYLES = {
  Instinct:   'text-damage-red',
  Insight:    'text-damage-white',
  Attachment: 'text-damage-black',
  Repression: 'text-damage-pale',
}

export default function WorkTable({ rows }) {
  if (!rows || rows.length === 0) return null

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border border-gold-muted/20 rounded-sm overflow-hidden">
        <thead>
          <tr className="bg-navy-800/60 text-xs font-mono text-moonstone-dark/60 uppercase tracking-wider">
            <th className="px-4 py-2 text-left">Work Type</th>
            <th className="px-4 py-2 text-left">Roll</th>
            <th className="px-4 py-2 text-left">Result</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gold-muted/10">
          {rows.map((row, i) => (
            <tr key={i} className="bg-navy-900/30 hover:bg-navy-800/30 transition-colors">
              <td className={`px-4 py-2.5 font-mono text-xs ${WORK_TYPE_STYLES[row.workType] ?? 'text-moonstone'}`}>
                {row.workType}
              </td>
              <td className={`px-4 py-2.5 font-mono text-xs font-semibold ${ROLL_STYLES[row.roll] ?? 'text-moonstone'}`}>
                {row.roll}
              </td>
              <td className="px-4 py-2.5 text-xs text-moonstone/80 leading-relaxed">
                <RichText text={row.result} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
