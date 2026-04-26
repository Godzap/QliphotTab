export default function CompletionDots({ checks }) {
  return (
    <div className="flex items-center gap-3">
      {checks.map(({ label, filled }) => (
        <span key={label} className="flex items-center gap-1">
          <span className={`text-[11px] font-mono tracking-wider ${filled ? 'text-gold/65' : 'text-moonstone-dark/30'}`}>
            {label}
          </span>
          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
            filled ? 'bg-gold shadow-gold-sm' : 'border border-gold-muted/35'
          }`} />
        </span>
      ))}
    </div>
  )
}
