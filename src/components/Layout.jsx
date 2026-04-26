import { useRef } from 'react'
import { useOutlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from './Navbar'

// Snapshots the outlet at mount and never updates it.
// Each motion.div in AnimatePresence mounts fresh per navigation (keyed by pathname),
// so the snapshot is always correct at entry. During exit, the frozen snapshot
// prevents the exiting container from showing the new route's content.
function FrozenRoute() {
  const outlet = useOutlet()
  const frozen = useRef(outlet)
  return frozen.current
}

function CornerDecorations() {
  // CSS color property (not SVG attribute) so var() resolves correctly
  const svgStyle = { color: 'var(--t-corner-bright)' }

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {/* ── Top-left corner ─────────────────────── */}
      <svg style={svgStyle} className="absolute top-0 left-0" width="220" height="140" viewBox="0 0 220 140">
        <line x1="4"   y1="100" x2="80"  y2="4"   stroke="currentColor" strokeWidth="2" />
        <line x1="4"   y1="100" x2="4"   y2="140" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.35" />
        <line x1="80"  y1="4"   x2="220" y2="4"   stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.35" />
        <line x1="20"  y1="92"  x2="20"  y2="108" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
        <line x1="72"  y1="20"  x2="88"  y2="20"  stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      </svg>

      {/* ── Top-right corner ────────────────────── */}
      <svg style={svgStyle} className="absolute top-0 right-0" width="140" height="80" viewBox="0 0 140 80">
        <line x1="0"   y1="4"  x2="140" y2="4"  stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.35" />
        <line x1="136" y1="4"  x2="136" y2="80" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.35" />
        <line x1="100" y1="4"  x2="136" y2="40" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      </svg>

      {/* ── Bottom-left corner ──────────────────── */}
      <svg style={svgStyle} className="absolute bottom-0 left-0" width="140" height="80" viewBox="0 0 140 80">
        <line x1="4"   y1="0"  x2="4"   y2="76" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.35" />
        <line x1="4"   y1="76" x2="140" y2="76" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.35" />
        <line x1="4"   y1="40" x2="40"  y2="76" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      </svg>

      {/* ── Bottom-right corner ─────────────────── */}
      <svg style={svgStyle} className="absolute bottom-0 right-0" width="220" height="140" viewBox="0 0 220 140">
        <line x1="216" y1="40"  x2="140" y2="136" stroke="currentColor" strokeWidth="2" />
        <line x1="216" y1="0"   x2="216" y2="40"  stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.35" />
        <line x1="0"   y1="136" x2="140" y2="136" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.35" />
        <line x1="160" y1="136" x2="216" y2="80"  stroke="currentColor" strokeWidth="1" opacity="0.4" />
        <line x1="180" y1="136" x2="216" y2="100" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      </svg>
    </div>
  )
}

export default function Layout() {
  const location = useLocation()

  return (
    <div className="h-screen flex flex-col relative overflow-hidden">
      <CornerDecorations />
      <Navbar />

      <main className="flex-1 flex flex-col px-8 pt-6 pb-2 overflow-y-auto min-h-0">
        <AnimatePresence>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="flex-1 flex flex-col min-h-0"
          >
            <FrozenRoute />
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="border-t border-gold/10 py-3 px-6">
        <p className="text-xs text-moonstone-dark/40 font-mono tracking-widest uppercase text-center">
          Faust's Compendium — Lobotomy Corporation TTRPG Reference
        </p>
      </footer>
    </div>
  )
}
