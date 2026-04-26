import { forwardRef } from 'react'

const SearchBar = forwardRef(function SearchBar(
  { value, onChange, onKeyDown, placeholder = 'Search…', autoFocus = false },
  ref
) {
  return (
    <div className="relative">
      <svg
        className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/50 pointer-events-none"
        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
      </svg>

      <input
        ref={ref}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="w-full bg-navy-900/70 border border-gold-muted/30
          pl-10 pr-20 py-2.5 text-sm text-moonstone placeholder-moonstone-dark/40
          focus:outline-none focus:border-gold/60 focus:bg-navy-800/80
          transition-colors duration-150 font-mono
          clip-path-none"
        style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))' }}
      />

      {/* Ctrl+L hint — visible when input is empty */}
      {!value && (
        <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none select-none
          text-[10px] font-mono text-gold/55 bg-navy-800 border border-gold/25 px-1.5 py-0.5 tracking-wide">
          Ctrl+L
        </kbd>
      )}

      {/* Clear button — visible when input has text */}
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-moonstone-dark/40 hover:text-gold transition-colors"
          tabIndex={-1}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
})

export default SearchBar
