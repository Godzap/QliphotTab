import EntryImage from './EntryImage'
import TierBadge from './TierBadge'
import SectionBlock from './SectionBlock'
import RichText from './RichText'
import ResistanceTable from './ResistanceTable'
import WorkTable from './WorkTable'

// ── Shared sub-renderers ──────────────────────────────────────────────────────

function AbnormalityManagerialNotes({ data }) {
  if (!data?.guidelines?.length) return <p className="placeholder-text">No guidelines recorded.</p>
  return (
    <div>
      {data.guidelines.map((g, i) => {
        const m     = g.match(/^(Guideline\s+\d+):\s*([\s\S]+)$/)
        const label = m ? m[1] : null
        const body  = m ? m[2] : g
        return (
          <div key={i}>
            {i > 0 && (
              <div className="relative my-3 flex items-center gap-2">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/25 to-transparent" />
                <div className="w-1 h-1 rounded-full bg-gold/30" />
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/25 to-transparent" />
              </div>
            )}
            {label && (
              <span className="inline-block font-mono text-[10px] tracking-widest uppercase text-gold/60 mb-1.5">
                {label}
              </span>
            )}
            <p className="text-sm text-moonstone/85 leading-relaxed">
              <RichText text={body} />
            </p>
          </div>
        )
      })}
    </div>
  )
}

function EmpiricalResearch({ data }) {
  const hasTable = data?.workTable?.length > 0
  const hasObs   = data?.extraObservations?.length > 0
  if (!hasTable && !hasObs) {
    return <p className="text-xs text-moonstone-dark/50 italic">No field data collected yet.</p>
  }
  return (
    <div className="space-y-5">
      {hasTable && <WorkTable rows={data.workTable} />}
      {hasObs && (
        <div>
          <p className="section-label mb-2">Extra Observations</p>
          <ObservationList items={data.extraObservations} />
        </div>
      )}
    </div>
  )
}

function ToolNotes({ data }) {
  if (!data) return null
  return (
    <div className="space-y-4 text-sm text-moonstone/85">
      {data.typeDescriptor && (
        <p>
          <span className="font-semibold text-gold">{data.typeDescriptor}</span>
          {data.typeDefinition && <span className="text-moonstone-dark/70"> — {data.typeDefinition}</span>}
        </p>
      )}
      {data.unlockConditions?.length > 0 && (
        <div>
          <p className="section-label mb-1.5">Unlock Conditions</p>
          <ul className="space-y-1">
            {data.unlockConditions.map((c, i) => (
              <li key={i} className="text-moonstone-dark/70 text-xs before:content-['—'] before:mr-2 before:text-gold-muted/40">
                <RichText text={c} />
              </li>
            ))}
          </ul>
        </div>
      )}
      {data.effects?.length > 0 && (
        <div>
          <p className="section-label mb-2">Effects</p>
          <div>
            {data.effects.map((e, i) => (
              <div key={i}>
                {i > 0 && (
                  <div className="relative my-3 flex items-center gap-2">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/25 to-transparent" />
                    <div className="w-1 h-1 rounded-full bg-gold/30" />
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/25 to-transparent" />
                  </div>
                )}
                <span className="inline-block font-mono text-[10px] tracking-widest uppercase text-gold/60 mb-1.5">
                  {e.label}
                </span>
                <p className="text-sm text-moonstone/85 leading-relaxed">
                  <RichText text={e.text} />
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function OrdealDescription({ data }) {
  if (!data) return null
  return (
    <div className="space-y-3 text-sm">
      {data.themeName && <p className="font-display text-base text-gold/90">{data.themeName}</p>}
      {data.quote && (
        <blockquote className="border-l-2 border-gold-muted/30 pl-4 italic text-moonstone-dark/70">
          {data.quote}
        </blockquote>
      )}
      {data.appearance && <p className="text-moonstone/80 leading-relaxed">{data.appearance}</p>}
    </div>
  )
}

export function ObservationList({ items }) {
  if (!items?.length) return null
  return (
    <ul className="space-y-2">
      {items.map((obs, i) => (
        <li key={i} className="flex gap-2 text-xs text-moonstone/75 leading-relaxed">
          <span className="text-gold-muted/40 shrink-0 mt-0.5">—</span>
          <RichText text={obs} />
        </li>
      ))}
    </ul>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────

export default function EntryDetailContent({ entry, category }) {
  return (
    <div className="space-y-5">
      {/* Entry header */}
      <div className="flex flex-col sm:flex-row gap-6 pb-5 border-b border-gold/10">
        <div className="shrink-0">
          <div className="w-40 h-40 sm:w-48 sm:h-48 border-2 border-gold/45"
            style={{ clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)' }}
          >
            <EntryImage image={entry.image} name={entry.name} category={category} className="w-full h-full object-cover" />
          </div>
        </div>
        <div className="flex flex-col gap-2.5 justify-center">
          {entry.code && <p className="font-mono text-xs text-moonstone-dark/45 tracking-widest">{entry.code}</p>}
          <h2 className="font-display text-2xl sm:text-3xl text-gold leading-tight">{entry.name}</h2>
          <div className="flex flex-wrap items-center gap-2">
            {(entry.level || entry.color) && <TierBadge level={entry.level} color={entry.color} size="lg" />}
            {entry.usageType && (
              <span className="tier-badge text-xs text-moonstone-dark/70 border-gold-muted/30 bg-navy-800/60 border px-2 py-0.5">
                {entry.usageType}
              </span>
            )}
            {entry.time && (
              <span className="font-mono text-xs text-moonstone-dark/60 bg-navy-800/60 border border-gold-muted/20 px-2 py-0.5">
                {entry.time}
              </span>
            )}
          </div>
          {entry.notes && <p className="text-xs text-moonstone-dark/55 italic">{entry.notes}</p>}
        </div>
      </div>

      {/* Abnormalities */}
      {category === 'abnormalities' && (
        <>
          <SectionBlock title="Managerial Notes" filled={entry.hasManagerialNotes}>
            <AbnormalityManagerialNotes data={entry.managerialNotes} />
          </SectionBlock>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <SectionBlock title="Defensive Notes" filled={entry.hasDefensiveNotes}>
              <ResistanceTable {...entry.defensiveNotes} />
            </SectionBlock>
            <SectionBlock title="Empirical Research" filled={entry.hasEmpiricalResearch || entry.empiricalResearch?.extraObservations?.length > 0}>
              <EmpiricalResearch data={entry.empiricalResearch} />
            </SectionBlock>
          </div>
        </>
      )}

      {/* Tools */}
      {category === 'tools' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <SectionBlock title="Notes" filled={entry.hasNotes}>
            <ToolNotes data={entry.toolNotes} />
          </SectionBlock>
          <SectionBlock title="Empirical Research" filled={entry.hasEmpiricalResearch || entry.empiricalResearch?.observations?.length > 0}>
            <ObservationList items={entry.empiricalResearch?.observations} />
          </SectionBlock>
        </div>
      )}

      {/* Ordeals */}
      {category === 'ordeals' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <SectionBlock title="Description" filled={entry.hasDescription}>
            <OrdealDescription data={entry.description} />
          </SectionBlock>
          <SectionBlock title="Empirical Research" filled={entry.hasEmpiricalResearch || entry.empiricalResearch?.observations?.length > 0}>
            <ObservationList items={entry.empiricalResearch?.observations} />
          </SectionBlock>
        </div>
      )}
    </div>
  )
}
