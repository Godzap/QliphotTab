import { TIER_STYLES, ORDEAL_COLOR_STYLES } from '../data'

export default function TierBadge({ level, color, size = 'sm' }) {
  const label = level ?? color ?? '—'
  const styles = level ? TIER_STYLES[level] : ORDEAL_COLOR_STYLES[color]
  if (!styles) return null

  const sizeClass = size === 'lg' ? 'px-3 py-1 text-sm' : 'px-2 py-0.5 text-xs'

  return (
    <span className={`tier-badge font-mono tracking-wider ${sizeClass} ${styles.color} ${styles.border} ${styles.bg} border`}>
      {label}
    </span>
  )
}
