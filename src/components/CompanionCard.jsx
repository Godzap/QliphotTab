import EntryImage from './EntryImage'
import TierBadge from './TierBadge'

const CATEGORY_STYLE = {
  abnormalities: { label: 'ABNORMALITY', color: 'text-gold/70 border-gold/30 bg-gold/5' },
  tools:         { label: 'TOOL', color: 'text-tier-teth/80 border-tier-teth/30 bg-tier-teth/5' },
}

export default function CompanionCard({ entry, category, index, onClick, onRemove }) {
  const cat = CATEGORY_STYLE[category] ?? { label: category.toUpperCase(), color: 'text-moonstone-dark/50 border-gold/20' }

  return (
    <div
      className="relative group cursor-pointer card-base card-hover bg-navy-900/90"
      onClick={onClick}
    >
      {/* Index badge */}
      {index != null && (
        <span className="absolute top-1.5 left-1.5 z-10 w-5 h-5 flex items-center justify-center
          bg-navy-950/80 border border-gold/30 font-mono text-[10px] text-gold/50
          group-hover:text-gold group-hover:border-gold/60 transition-colors leading-none">
          {index}
        </span>
      )}

      {/* Remove button */}
      <button
        onClick={(e) => { e.stopPropagation(); onRemove() }}
        className="absolute top-1.5 right-1.5 z-10 opacity-0 group-hover:opacity-100
          w-5 h-5 flex items-center justify-center
          bg-navy-950/80 border border-gold/30 text-gold/60
          hover:text-gold hover:border-gold/70 transition-all text-xs leading-none"
        title="Remove from board"
      >
        ×
      </button>

      {/* Portrait */}
      <div className="w-full aspect-square overflow-hidden border-b border-gold/10">
        <EntryImage
          image={entry.image}
          name={entry.name}
          category={category}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Info */}
      <div className="p-2.5 space-y-1.5">
        <p className="font-display text-xs text-moonstone leading-tight line-clamp-2">
          {entry.name}
        </p>
        <div className="flex items-center gap-1.5 flex-wrap">
          {(entry.level || entry.color) && <TierBadge level={entry.level} color={entry.color} />}
          {entry.code && (
            <span className="font-mono text-[10px] text-moonstone-dark/40">{entry.code}</span>
          )}
        </div>
        <span className={`inline-block font-mono text-[9px] tracking-widest px-1 py-px border ${cat.color}`}>
          {cat.label}
        </span>
      </div>
    </div>
  )
}
