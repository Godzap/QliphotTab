#!/usr/bin/env node
'use strict'

const fs   = require('fs')
const path = require('path')

const COMPENDIUM_DIR = process.argv[2]
const OUTPUT_FILE    = path.join(__dirname, '../src/data/tools.json')

if (!COMPENDIUM_DIR) {
  console.error('Usage: node scripts/convert-tools-to-json.cjs <path-to-faust-compendium-files>')
  process.exit(1)
}

const LEVEL_MAP = { zayin: 'Zayin', teth: 'Teth', he: 'HE', waw: 'Waw', aleph: 'Aleph' }
function normalizeLevel(s) { return LEVEL_MAP[(s ?? '').toLowerCase()] ?? s }

function toKebab(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function stripMd(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1').replace(/\*(.+?)\*/g, '$1')
    .replace(/^>\s*/gm, '').replace(/📄/g, '').trim()
}

function getSectionContent(text, title) {
  const m = text.match(new RegExp(`## ${title}\\s*([\\s\\S]*?)(?=\\n## |$)`))
  return m ? m[1].trim() : ''
}

function parseCSV(filePath) {
  const index = {}
  if (!fs.existsSync(filePath)) return index
  const lines = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '').split('\n')
  const headers = lines[0].split(',').map(h => h.trim())
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',')
    if (cols.length < 2) continue
    const row = {}
    headers.forEach((h, j) => { row[h] = (cols[j] ?? '').trim() })
    if (row.Name) index[row.Name.toLowerCase()] = row
  }
  return index
}

function parseNotesSection(section) {
  const typeMatch = section.match(/\*\*Type:\*\*\s*(.+)/i)
  const typeDescriptor = typeMatch ? typeMatch[1].trim() : null

  // type definition is the blockquote after **Type:**
  const typeDefMatch = section.match(/\*\*Type:\*\*[^\n]*\n+>\s*(.+?)(?=\n\n|\*\*|$)/s)
  const typeDefinition = typeDefMatch ? typeDefMatch[1].replace(/^>\s*/gm, '').trim() : null

  // unlock conditions
  const unlockConditions = []
  const unlockMatch = section.match(/\*\*Unlock Condition[s]?:\*\*\s*([^\n]+)/i)
  if (unlockMatch) unlockConditions.push(stripMd(unlockMatch[1].trim()))

  // effects — **Effect N:** followed by text
  const effects = []
  const effectParts = section.split(/\*\*Effect\s+(\d+):\*\*/i)
  let i = 1
  while (i < effectParts.length) {
    const num  = effectParts[i]
    const body = (effectParts[i + 1] ?? '').split('\n')
      .map(l => l.trim())
      .filter(l => l && !l.startsWith('---') && !l.match(/^[>📄]/) && !l.match(/^\*\*Effect/))
      .map(l => stripMd(l))
      .join(' ').trim()
    if (body) effects.push({ label: `Effect ${num}`, text: body })
    i += 2
  }

  return { typeDescriptor, typeDefinition, unlockConditions, effects }
}

function parseEmpiricalSection(section) {
  const observations = []
  for (const line of section.split('\n')) {
    const t = line.trim()
    if (t.startsWith('- ')) observations.push(stripMd(t.slice(2).trim()))
    else if (t && !t.startsWith('---') && !t.match(/^[>📄*|#]/) && !t.match(/Faust does not/i)) {
      const clean = stripMd(t)
      if (clean) observations.push(clean)
    }
  }
  return observations.filter(Boolean)
}

function parseMdContent(filePath) {
  const content = fs.readFileSync(filePath, 'utf8')
  const name     = content.split('\n')[0].replace(/^#+\s*/, '').trim()
  const mdCode   = content.match(/^Code:\s*(.+)$/m)?.[1].trim() ?? null
  const mdLevel  = content.match(/^Level:\s*(.+)$/m)?.[1].trim() ?? null
  const isSingle = /^Single Use:\s*Yes/im.test(content)
  const notesSection = getSectionContent(content, 'Notes')
  const empSection   = getSectionContent(content, 'Empirical Research')
  return {
    name, mdCode, mdLevel, isSingle,
    toolNotes:         parseNotesSection(notesSection),
    empObservations:   parseEmpiricalSection(empSection),
  }
}

// ── Main ────────────────────────────────────────────────────────────────────
const csvFile = fs.readdirSync(COMPENDIUM_DIR)
  .find(f => f.endsWith('.csv') && f.toLowerCase().startsWith('tools'))
const csvIndex = csvFile ? parseCSV(path.join(COMPENDIUM_DIR, csvFile)) : {}

const existingArr = fs.existsSync(OUTPUT_FILE)
  ? JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8')) : []
const existingByName = {}
for (const e of existingArr) existingByName[e.name.toLowerCase()] = e

const mdFiles = fs.readdirSync(COMPENDIUM_DIR).filter(f => f.endsWith('.md'))
const generated = []

for (const file of mdFiles) {
  const md  = parseMdContent(path.join(COMPENDIUM_DIR, file))
  if (!md.name) continue

  const csv = csvIndex[md.name.toLowerCase()]
  if (!csv) continue  // only include entries in the Tools CSV

  const prev = existingByName[md.name.toLowerCase()]
  const code  = csv.Code || md.mdCode || null
  const level = normalizeLevel(csv.Level || md.mdLevel || prev?.level || '')
  const id    = code ? code.toLowerCase() : toKebab(md.name)
  const isSingle = csv['Single Use'] === 'Yes' || md.isSingle

  const hasNotes             = csv['Has Notes']             === 'Yes'
  const hasEmpiricalResearch = csv['Has Empirical Research'] === 'Yes'

  generated.push({
    id,
    name:  md.name,
    code,
    level,
    image:     prev?.image ?? null,
    usageType: isSingle ? 'Single Use' : 'Equippable',
    notes:     prev?.notes ?? (csv.Notes || ''),
    hasNotes,
    hasEmpiricalResearch,
    toolNotes: {
      typeDescriptor:   md.toolNotes.typeDescriptor,
      typeDefinition:   md.toolNotes.typeDefinition,
      unlockConditions: md.toolNotes.unlockConditions,
      effects:          md.toolNotes.effects,
    },
    empiricalResearch: {
      observations: md.empObservations,
    },
  })
}

const LEVEL_ORDER = { Zayin: 0, Teth: 1, HE: 2, Waw: 3, Aleph: 4 }
generated.sort((a, b) => {
  const d = (LEVEL_ORDER[a.level] ?? 9) - (LEVEL_ORDER[b.level] ?? 9)
  return d !== 0 ? d : a.name.localeCompare(b.name)
})

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(generated, null, 2))
console.log(`✓ Wrote ${generated.length} tool entries`)
console.log(`  ${generated.filter(e => e.hasNotes).length} with notes · ${generated.filter(e => e.hasEmpiricalResearch).length} with empirical data`)
