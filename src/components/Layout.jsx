import { useRef } from 'react'
import { useOutlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from './Navbar'

function FrozenRoute() {
  const outlet = useOutlet()
  const frozen = useRef(outlet)
  return frozen.current
}

function CornerDecorations() {
  const svgStyle = { color: 'var(--t-corner-bright)' }

  return (
    <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden">
      <svg style={svgStyle} className="absolute top-0 right-0" width="140" height="80" viewBox="0 0 140 80">
        <line x1="0" y1="4" x2="140" y2="4" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.35" />
        <line x1="136" y1="4" x2="136" y2="80" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.35" />
        <line x1="100" y1="4" x2="136" y2="40" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      </svg>

      <svg style={svgStyle} className="absolute bottom-0 left-0" width="140" height="80" viewBox="0 0 140 80">
        <line x1="4" y1="0" x2="4" y2="76" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.35" />
        <line x1="4" y1="76" x2="140" y2="76" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.35" />
        <line x1="4" y1="40" x2="40" y2="76" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      </svg>
    </div>
  )
}

export default function Layout() {
  const location = useLocation()

  return (
    <div className="h-full min-h-0 flex flex-col relative overflow-hidden">
      <CornerDecorations />
      <Navbar />

      <main className="flex-1 min-h-0 relative">
        <AnimatePresence>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute inset-0 flex flex-col px-8 pt-6 pb-2 overflow-y-auto"
          >
            <FrozenRoute />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
