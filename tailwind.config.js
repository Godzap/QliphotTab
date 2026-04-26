/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Backgrounds — reference CSS vars, alpha-compatible
        navy: {
          950: 'rgb(var(--t-bg-950-rgb) / <alpha-value>)',
          900: 'rgb(var(--t-bg-900-rgb) / <alpha-value>)',
          800: 'rgb(var(--t-bg-800-rgb) / <alpha-value>)',
          700: 'rgb(var(--t-bg-700-rgb) / <alpha-value>)',
        },
        // Team accent color (green for default, violet for info, etc.)
        gold: {
          DEFAULT: 'rgb(var(--t-accent-rgb) / <alpha-value>)',
          light:   'rgb(var(--t-accent-light-rgb) / <alpha-value>)',
          dark:    'rgb(var(--t-accent-dark-rgb) / <alpha-value>)',
          muted:   'rgb(var(--t-accent-muted-rgb) / <alpha-value>)',
        },
        // Text colors
        moonstone: {
          DEFAULT: 'rgb(var(--t-text-rgb) / <alpha-value>)',
          dark:    'rgb(var(--t-text-muted-rgb) / <alpha-value>)',
        },
        // Tier colors — not team-specific, stay fixed
        tier: {
          zayin: '#4ade80',
          teth:  '#60a5fa',
          he:    '#fbbf24',
          waw:   '#fb923c',
          aleph: '#f87171',
        },
        // Damage types — fixed
        damage: {
          red:   '#f87171',
          white: '#e5e7eb',
          black: '#6b7280',
          pale:  '#7dd3fc',
        },
      },
      fontFamily: {
        display:  ['Cinzel', 'serif'],
        body:     ['Inter', 'sans-serif'],
        mono:     ['JetBrains Mono', 'monospace'],
        counter:  ['Orbitron', 'sans-serif'],
      },
      boxShadow: {
        'gold':       'var(--t-shadow-accent)',
        'gold-lg':    'var(--t-shadow-accent-lg)',
        'gold-sm':    'var(--t-shadow-accent-sm)',
        'tier-zayin': '0 0 12px rgba(74, 222, 128, 0.4)',
        'tier-teth':  '0 0 12px rgba(96, 165, 250, 0.4)',
        'tier-he':    '0 0 12px rgba(251, 191, 36, 0.4)',
        'tier-waw':   '0 0 12px rgba(251, 146, 60, 0.4)',
        'tier-aleph': '0 0 12px rgba(248, 113, 113, 0.4)',
      },
    },
  },
  plugins: [],
}
