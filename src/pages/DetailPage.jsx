import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getById, CATEGORY_META } from '../data'
import EntryDetailContent from '../components/EntryDetailContent'

export default function DetailPage({ category }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const entry = getById(category, id)
  const meta = CATEGORY_META[category]

  if (!entry) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="placeholder-text text-lg">Entry not found.</p>
          <button onClick={() => navigate(`/${category}`)} className="mt-4 text-xs font-mono text-gold-muted hover:text-gold transition-colors">
            ← Return to {meta.label}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="flex-1 flex flex-col border border-gold/35 overflow-hidden"
        style={{ clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))' }}
      >
        {/* Panel header */}
        <div className="flex items-center justify-between bg-gold/8 border-b border-gold/25 px-5 py-2.5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="page-title-badge text-xs" style={{ clipPath: 'polygon(0 0, 100% 0, calc(100% - 8px) 100%, 0 100%)' }}>
              {meta.label}
            </div>
            <nav className="flex items-center gap-1.5 text-xs font-mono text-moonstone-dark/45">
              <Link to="/" className="hover:text-gold transition-colors">Hub</Link>
              <span className="text-gold/20">/</span>
              <Link to={`/${category}`} className="hover:text-gold transition-colors">{meta.label}</Link>
              <span className="text-gold/20">/</span>
              <span className="text-moonstone-dark/70 truncate max-w-[240px]">{entry.name}</span>
            </nav>
          </div>
          <Link to={`/${category}`} className="flex items-center gap-1.5 text-xs font-mono text-gold/35 hover:text-gold transition-colors">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Back
          </Link>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <EntryDetailContent entry={entry} category={category} />
        </div>
      </motion.div>
    </div>
  )
}
