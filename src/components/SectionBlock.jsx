import { motion } from 'framer-motion'

const PLACEHOLDER = 'Faust does not have access to this information yet.'

export default function SectionBlock({ title, filled, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="border border-gold-muted/20 bg-navy-900/50 rounded-sm overflow-hidden"
    >
      <div className="flex items-center gap-3 px-5 py-3 bg-navy-800/40 border-b border-gold-muted/15">
        <span
          className={`w-1.5 h-1.5 rounded-full ${filled ? 'bg-gold shadow-gold' : 'bg-gold-muted/25'}`}
        />
        <h3 className="section-label">{title}</h3>
      </div>
      <div className="px-5 py-5">
        {filled ? children : <p className="placeholder-text">{PLACEHOLDER}</p>}
      </div>
    </motion.div>
  )
}
