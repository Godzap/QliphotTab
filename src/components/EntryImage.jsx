export default function EntryImage({ image, name, category, className = '' }) {
  const src = image ? `${import.meta.env.BASE_URL}images/${category}/${image}` : null

  if (!src) {
    return (
      <div className={`flex items-center justify-center bg-navy-800 border border-gold-muted/20 ${className}`}>
        <span className="font-display text-gold-muted/40 text-xs tracking-widest text-center px-2 leading-tight">
          {name}
        </span>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={name}
      className={`object-contain ${className}`}
      loading="lazy"
    />
  )
}
