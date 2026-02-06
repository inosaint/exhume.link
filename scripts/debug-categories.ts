import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const samplePath = join(__dirname, '..', 'browserdata', 'all_tabs_clean.txt')
const text = readFileSync(samplePath, 'utf-8')

import { extractUrlsFromText, getRegistrableDomain } from '../src/data/tabsAnalysis.js'

const urls = extractUrlsFromText(text)

const domainCounts = new Map<string, number>()
for (const raw of urls) {
  try {
    const u = new URL(raw)
    const d = getRegistrableDomain(u.hostname)
    domainCounts.set(d, (domainCounts.get(d) ?? 0) + 1)
  } catch { /* skip */ }
}

const sorted = Array.from(domainCounts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 50)
console.log('Top 50 domains:')
for (const [d, c] of sorted) {
  console.log(`  ${c.toString().padStart(4)}  ${d}`)
}

// Show some sample 'other' URLs
console.log('\n--- Sample URLs that likely fall into "other" ---')
const knownDomains = new Set([
  'medium.com', 'youtube.com', 'google.com', 'google.co.in', 'twitter.com', 'x.com',
  'reddit.com', 'amazon.com', 'amazon.in', 'instagram.com', 'linkedin.com',
  'github.com', 'notion.so', 'figma.com', 'uxdesign.cc', 'dribbble.com',
  'substack.com', 'wikipedia.org', 'bbc.com', 'reuters.com', 'vimeo.com',
  'open.spotify.com', 'lu.ma', 'eventbrite.com', 'greenhouse.io', 'lever.co',
])

let count = 0
for (const raw of urls) {
  try {
    const u = new URL(raw)
    const d = getRegistrableDomain(u.hostname)
    const host = u.hostname.toLowerCase()
    // Check if this would be classified as "other"
    if (!knownDomains.has(d) &&
        !host.endsWith('.medium.com') &&
        !host.endsWith('.substack.com') &&
        !host.includes('.design') &&
        !d.endsWith('.lk') &&
        !d.startsWith('amazon.')) {
      if (count < 30) {
        console.log(`  ${d.padEnd(35)} ${raw.substring(0, 80)}`)
        count++
      }
    }
  } catch { /* skip */ }
}
