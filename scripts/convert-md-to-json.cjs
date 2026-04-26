#!/usr/bin/env node
'use strict'

const fs   = require('fs')
const path = require('path')

const COMPENDIUM_DIR = process.argv[2]
const OUTPUT_FILE    = path.join(__dirname, '../src/data/abnormalities.json')

if (!COMPENDIUM_DIR) {
  console.error('Usage: node scripts/convert-md-to-json.cjs <path-to-faust-compendium-files>')
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

// ── CSV parser ──────────────────────────────────────────────────────────────
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

// ── MD parsers ──────────────────────────────────────────────────────────────
function parseGuidelines(section) {
  const guidelines = []
  const parts = section.split(/\*\*Guideline\s+(\d+)\*\*/i)
  let i = 1
  while (i < parts.length) {
    const num  = parts[i]
    const body = (parts[i + 1] ?? '')
    const text = body.split('\n')
      .map(l => l.trim())
      .filter(l => l && !l.startsWith('---') && !l.match(/^[>📄]/))
      .map(l => stripMd(l))
      .join(' ').trim()
    if (text) guidelines.push(`Guideline ${num}: ${text}`)
    i += 2
  }
  return guidelines
}

function parseDefensiveNotes(section) {
  const isNonEscaping = /non.escaping.object/i.test(section)
  const durMatch  = section.match(/\|\s*Durability\s*\|\s*(\d+)/)
  const durability = durMatch ? parseInt(durMatch[1], 10) : null
  let resistances = { red: '?', white: '?', black: '?', pale: '?' }
  const resLine = section.split('\n').find(l => /\|\s*Resistance\s*\|/i.test(l))
  if (resLine) {
    const cols = resLine.split('|').map(c => c.trim())
      .filter(c => c && c !== 'Resistance' && !c.includes('---') && c !== '')
    resistances = { red: cols[0]??'?', white: cols[1]??'?', black: cols[2]??'?', pale: cols[3]??'?' }
  }
  return { durability, isNonEscaping, enkephalinLocked: false, enkephalinCost: null, resistances }
}

function parseWorkTable(section) {
  const rows = []
  const lines = section.split('\n').filter(l => l.trim().startsWith('|'))
  let ready = false
  for (const line of lines) {
    if (/Work Type|---/.test(line)) { ready = true; continue }
    if (!ready) continue
    const cols = line.split('|').map(c => c.trim()).filter(Boolean)
    if (cols.length >= 3) rows.push({ workType: cols[0], roll: cols[1], result: stripMd(cols[2]) })
  }
  return rows
}

function parseExtraObservations(section) {
  const obs = []
  const after = section.split(/\*\*Extra observations:\*\*/i)[1]
  if (!after) return obs
  for (const line of after.split('\n')) {
    const t = line.trim()
    if (t.startsWith('- ')) obs.push(stripMd(t.slice(2).trim()))
  }
  return obs
}

function parseMdContent(filePath) {
  const content = fs.readFileSync(filePath, 'utf8')
  const name = content.split('\n')[0].replace(/^#+\s*/, '').trim()
  const mdCode = content.match(/^Code:\s*(.+)$/m)?.[1].trim() ?? null
  const manSection  = getSectionContent(content, 'Managerial Notes')
  const defSection  = getSectionContent(content, 'Defensive Notes')
  const empSection  = getSectionContent(content, 'Empirical Research')
  return {
    name, mdCode,
    guidelines:        parseGuidelines(manSection),
    defensiveNotes:    parseDefensiveNotes(defSection),
    workTable:         parseWorkTable(empSection),
    extraObservations: parseExtraObservations(empSection),
  }
}

// ── Main ────────────────────────────────────────────────────────────────────
// Use the Abnormalities CSV specifically — not any CSV (tools/ordeals CSVs are also present)
const csvFiles = fs.readdirSync(COMPENDIUM_DIR)
  .filter(f => f.endsWith('.csv') && f.toLowerCase().startsWith('abnormalities'))
const csvIndex = csvFiles.length > 0
  ? parseCSV(path.join(COMPENDIUM_DIR, csvFiles[0]))
  : {}
const csvNames = new Set(Object.keys(csvIndex))

const existingArr = fs.existsSync(OUTPUT_FILE)
  ? JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8')) : []
const existingByName = {}
for (const e of existingArr) existingByName[e.name.toLowerCase()] = e

const mdFiles = fs.readdirSync(COMPENDIUM_DIR).filter(f => f.endsWith('.md'))
const generated = []

for (const file of mdFiles) {
  const md = parseMdContent(path.join(COMPENDIUM_DIR, file))
  if (!md.name || md.name.toLowerCase().includes('compendium')) continue

  // Strict whitelist: only include entries present in the Abnormalities CSV
  if (csvNames.size > 0 && !csvIndex[md.name.toLowerCase()]) continue

  const csv  = csvIndex[md.name.toLowerCase()]
  const prev = existingByName[md.name.toLowerCase()]

  const code  = csv?.Code  || md.mdCode || null
  const level = normalizeLevel(csv?.Level || (prev?.level ?? ''))
  const id    = code ? code.toLowerCase() : toKebab(md.name)

  const hasManagerialNotes   = csv ? csv['Has Managerial Notes']   === 'Yes' : !!(md.guidelines.length)
  const hasDefensiveNotes    = csv ? csv['Has Defensive Notes']    === 'Yes' : !!(md.defensiveNotes.durability || md.defensiveNotes.isNonEscaping)
  const hasEmpiricalResearch = csv ? csv['Has Empirical Research'] === 'Yes' : !!(md.workTable.length || md.extraObservations.length)

  generated.push({
    id,
    name:  md.name,
    code,
    level,
    image: prev?.image ?? null,
    notes: prev?.notes ?? (csv?.Notes || ''),
    hasManagerialNotes,
    hasDefensiveNotes,
    hasEmpiricalResearch,
    managerialNotes:  { guidelines: md.guidelines },
    defensiveNotes: {
      ...md.defensiveNotes,
      enkephalinLocked: prev?.defensiveNotes?.enkephalinLocked ?? false,
      enkephalinCost:   prev?.defensiveNotes?.enkephalinCost   ?? null,
    },
    empiricalResearch: {
      workTable:         md.workTable,
      extraObservations: md.extraObservations,
    },
  })
}

const LEVEL_ORDER = { Zayin: 0, Teth: 1, HE: 2, Waw: 3, Aleph: 4 }
generated.sort((a, b) => {
  const d = (LEVEL_ORDER[a.level] ?? 9) - (LEVEL_ORDER[b.level] ?? 9)
  return d !== 0 ? d : a.name.localeCompare(b.name)
})

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(generated, null, 2))
console.log(`✓ Wrote ${generated.length} entries`)
console.log(`  ${generated.filter(e => e.image).length} with images · ${generated.filter(e => !e.image).length} need images`)
console.log(`\nImage naming: public/images/abnormalities/{lowercase-code}.png`)
console.log(`  No code entries use: {kebab-name}.png`)
