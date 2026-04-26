import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

const NAV_LINKS = [
  { to: '/',              label: 'Hub'           },
  { to: '/abnormalities', label: 'Abnormalities' },
  { to: '/tools',         label: 'Tools'         },
  { to: '/ordeals',       label: 'Ordeals'       },
  { to: '/companion',     label: 'Companion'     },
]

const STATUS_MESSAGES = [
  'Harvesting Enkephalin...',
  'Walking to Abnormality Room...',
  'Healing in Main Room...',
  'Equipping E.G.O Gear...',
  'Consulting with Sephirah...',
  'Curing Insanity...',
  'Reading Reports...',
  'Facing the Fear...',
  'Making the Future...',
  'Requesting Bullet...',
  'Calling R-Corp...',
  'Protecting Bong-Bong...',
]

function StatusTicker() {
  const [msgIndex, setMsgIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')

  useEffect(() => {
    const fullMsg = STATUS_MESSAGES[msgIndex]
    setDisplayed('')
    let i = 0
    let cycleTimer = null

    const typeInterval = setInterval(() => {
      i++
      setDisplayed(fullMsg.slice(0, i))
      if (i >= fullMsg.length) {
        clearInterval(typeInterval)
        // Wait 20–30 seconds then advance to next message
        const delay = 10000
        cycleTimer = setTimeout(() => {
          setMsgIndex((idx) => (idx + 1) % STATUS_MESSAGES.length)
        }, delay)
      }
    }, 150)

    return () => {
      clearInterval(typeInterval)
      if (cycleTimer) clearTimeout(cycleTimer)
    }
  }, [msgIndex])

  return (
    <span className="font-mono text-xs text-gold/70 tracking-wider whitespace-nowrap">
      {displayed}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse', ease: 'steps(1)' }}
        className="inline-block w-[7px] h-[13px] bg-gold align-middle ml-px"
      />
    </span>
  )
}

export default function Navbar() {
  const location = useLocation()

  return (
    <header className="sticky top-0 z-50 bg-navy-950/98 backdrop-blur-sm border-b-2 border-gold/40">
      <div className="max-w-7xl mx-auto flex items-stretch h-11">

        {/* Navigation tabs — scrollable on small screens */}
        <nav className="flex items-stretch flex-1 overflow-x-auto scrollbar-none">
          {NAV_LINKS.map(({ to, label }, i) => {
            const active =
              to === '/' ? location.pathname === '/' : location.pathname.startsWith(to)
            return (
              <Link
                key={to}
                to={to}
                className={`relative flex items-center gap-2 px-4 sm:px-5 text-xs font-display font-semibold
                  tracking-widest uppercase transition-all duration-150 border-r border-gold/20 whitespace-nowrap shrink-0
                  ${i === 0 ? 'border-l border-gold/20' : ''}
                  ${active
                    ? 'bg-gold text-navy-950 shadow-gold tab-active-scan tab-active-flicker overflow-hidden'
                    : 'text-gold/60 hover:text-gold hover:bg-gold/5'
                  }`}
              >
                <kbd className={`text-[9px] font-mono px-1 py-0.5 border leading-none
                  ${active
                    ? 'bg-navy-950/20 border-navy-950/30 text-navy-950/60'
                    : 'bg-navy-800 border-gold/25 text-gold/50'
                  }`}
                >
                  {i + 1}
                </kbd>
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Nav hint + status ticker */}
        <div className="flex items-center divide-x divide-gold/15 border-l border-gold/20">
          <span className="hidden md:flex items-center gap-1.5 px-4 text-[10px] font-mono text-moonstone-dark/55 tracking-wider whitespace-nowrap">
            <kbd className="text-[9px] font-mono text-gold/70 bg-navy-800 border border-gold/35 px-1 py-0.5 leading-none">Ctrl</kbd>
            +<span className="text-gold/70">1–5</span> to navigate
          </span>
          <button
            onClick={() => window.dispatchEvent(new Event('open-global-search'))}
            className="hidden md:flex items-center gap-1.5 px-4 text-[10px] font-mono text-moonstone-dark/55 tracking-wider whitespace-nowrap hover:text-moonstone-dark/80 transition-colors"
          >
            <kbd className="text-[9px] font-mono text-gold/70 bg-navy-800 border border-gold/35 px-1 py-0.5 leading-none">Ctrl</kbd>
            +<span className="text-gold/70">L</span> to search
          </button>
          <div className="flex items-center px-4 w-56 shrink-0">
            <StatusTicker />
          </div>
        </div>
      </div>
    </header>
  )
}
