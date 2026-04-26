import abnormalities from './abnormalities.json'
import tools from './tools.json'
import ordeals from './ordeals.json'

export const DATA = { abnormalities, tools, ordeals }

export function getAll(category) {
  return DATA[category] ?? []
}

export function getById(category, id) {
  return DATA[category]?.find((entry) => entry.id === id) ?? null
}

export const TIER_ORDER = ['Zayin', 'Teth', 'HE', 'Waw', 'Aleph']

export const TIER_STYLES = {
  Zayin:  { color: 'text-tier-zayin', border: 'border-tier-zayin/60', shadow: 'shadow-tier-zayin', bg: 'bg-tier-zayin/10' },
  Teth:   { color: 'text-tier-teth',  border: 'border-tier-teth/60',  shadow: 'shadow-tier-teth',  bg: 'bg-tier-teth/10'  },
  HE:     { color: 'text-tier-he',    border: 'border-tier-he/60',    shadow: 'shadow-tier-he',    bg: 'bg-tier-he/10'    },
  Waw:    { color: 'text-tier-waw',   border: 'border-tier-waw/60',   shadow: 'shadow-tier-waw',   bg: 'bg-tier-waw/10'   },
  Aleph:  { color: 'text-tier-aleph', border: 'border-tier-aleph/60', shadow: 'shadow-tier-aleph', bg: 'bg-tier-aleph/10' },
}

export const ORDEAL_COLOR_STYLES = {
  Crimson: { color: 'text-tier-aleph', border: 'border-tier-aleph/60', bg: 'bg-tier-aleph/10' },
  Amber:   { color: 'text-tier-waw',   border: 'border-tier-waw/60',   bg: 'bg-tier-waw/10'  },
  Indigo:  { color: 'text-tier-teth',  border: 'border-tier-teth/60',  bg: 'bg-tier-teth/10' },
  Pale:    { color: 'text-moonstone',  border: 'border-moonstone/40',  bg: 'bg-moonstone/10' },
}

export const CATEGORY_META = {
  abnormalities: {
    label: 'Abnormalities',
    description: 'Anomalous entities contained within the facility. Each poses unique risk and research value.',
    filterKey: 'level',
    filterOptions: TIER_ORDER,
    filterStyles: TIER_STYLES,
  },
  tools: {
    label: 'Tools',
    description: 'Equipment derived from abnormality research. Classified by usage type and risk tier.',
    filterKey: 'level',
    filterOptions: TIER_ORDER,
    filterStyles: TIER_STYLES,
  },
  ordeals: {
    label: 'Ordeals',
    description: 'Wave incursions drawn at designated cycle intervals. Severity scales with facility progress.',
    filterKey: 'color',
    filterOptions: ['Crimson', 'Amber', 'Indigo', 'Pale'],
    filterStyles: ORDEAL_COLOR_STYLES,
  },
}

export function searchAll(query) {
  if (!query.trim()) return []
  const q = query.toLowerCase()
  const results = []
  for (const [category, entries] of Object.entries(DATA)) {
    for (const entry of entries) {
      if (
        entry.name.toLowerCase().includes(q) ||
        (entry.code && entry.code.toLowerCase().includes(q)) ||
        (entry.notes && entry.notes.toLowerCase().includes(q))
      ) {
        results.push({ ...entry, category })
      }
    }
  }
  return results
}
