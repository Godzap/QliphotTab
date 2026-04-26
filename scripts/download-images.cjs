#!/usr/bin/env node
'use strict'

const fs   = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const DATA_FILE = path.join(__dirname, '../src/data/abnormalities.json')
const IMG_DIR   = path.join(__dirname, '../public/images/abnormalities')
const BASE_URL  = 'https://lobotomycorporation.wiki.gg/images/'

if (!fs.existsSync(IMG_DIR)) fs.mkdirSync(IMG_DIR, { recursive: true })

function toPascalCase(name) {
  return name
    .replace(/['']/g, '')
    .replace(/[^a-zA-Z0-9\s]/g, ' ')
    .split(/\s+/).filter(Boolean)
    .map(w => w[0].toUpperCase() + w.slice(1))
    .join('')
}

function candidates(name) {
  const pascal = toPascalCase(name)
  const words  = name.replace(/[^a-zA-Z0-9\s]/g, ' ').split(/\s+/).filter(Boolean)
  const first2 = words.slice(0, 2).map(w => w[0].toUpperCase() + w.slice(1)).join('')
  const first3 = words.slice(0, 3).map(w => w[0].toUpperCase() + w.slice(1)).join('')
  return [
    `${pascal}Portrait.png`,
    `${first3}Portrait.png`,
    `${first2}Portrait.png`,
  ].filter((v, i, a) => a.indexOf(v) === i)
}

function sleep(ms) {
  execSync(`ping -n ${Math.ceil(ms / 1000) + 1} 127.0.0.1 > nul 2>&1 || sleep ${Math.ceil(ms / 1000)}`)
}

function tryCurl(url, dest, retries = 2) {
  try {
    const result = execSync(
      `curl -s -w "\\n%{http_code}|%{content_type}" -o "${dest}" "${url}"`,
      { timeout: 20000 }
    ).toString().trim()
    const lines = result.split('\n')
    const [status, contentType] = lines[lines.length - 1].split('|')
    if (status === '200' && contentType?.includes('image')) return 'ok'
    if (fs.existsSync(dest)) fs.unlinkSync(dest)
    if (status === '429' && retries > 0) return 'rate-limited'
    return 'not-found'
  } catch {
    if (fs.existsSync(dest)) fs.unlinkSync(dest)
    return 'not-found'
  }
}

async function main() {
  const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'))
  const todo = data.filter(e => !e.image && !e.imageSkip)
  console.log(`Downloading images for ${todo.length} entries...\n`)

  let found = 0, missing = 0

  for (const entry of todo) {
    const dest = path.join(IMG_DIR, `${entry.id}.png`)
    process.stdout.write(`  ${entry.name.padEnd(45)}`)

    let ok = false
    for (const filename of candidates(entry.name)) {
      let result = tryCurl(BASE_URL + filename, dest)
      if (result === 'rate-limited') {
        process.stdout.write('(rate limited, waiting 10s) ')
        sleep(10000)
        result = tryCurl(BASE_URL + filename, dest)
      }
      if (result === 'ok') {
        entry.image = `${entry.id}.png`
        ok = true
        break
      }
    }

    if (ok) { found++; console.log(`✓  ${entry.id}.png`) }
    else     { missing++; console.log('✗  not found') }

    sleep(3000)
  }

  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
  console.log(`\n✓ ${found} downloaded · ✗ ${missing} not found`)
  if (missing > 0) {
    console.log('\nStill missing:')
    data.filter(e => !e.image).forEach(e => console.log(`  ${e.name.padEnd(45)} → ${e.id}.png`))
  }
}

main().catch(console.error)
