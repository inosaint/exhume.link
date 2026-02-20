import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const samplePath = join(__dirname, '..', 'browserdata', 'lich_tabs.txt')
const text = readFileSync(samplePath, 'utf-8')

async function main() {
  const { analyzeInputToSession } = await import('../src/data/tabsAnalysis')
  const session = await analyzeInputToSession(text, { stepDelayMs: 0 })

  // Group 'other' tabs by domain
  const otherByDomain = new Map<string, string[]>()
  for (const tab of session.tabs) {
    if (tab.category === 'other') {
      const list = otherByDomain.get(tab.domain) ?? []
      list.push(tab.url)
      otherByDomain.set(tab.domain, list)
    }
  }

  const sorted = Array.from(otherByDomain.entries())
    .sort((a, b) => b[1].length - a[1].length)

  console.log(`Total "other" tabs: ${session.tabs.filter(t => t.category === 'other').length}`)
  console.log(`Unique "other" domains: ${sorted.length}\n`)

  for (const [domain, urls] of sorted.slice(0, 60)) {
    console.log(`${urls.length.toString().padStart(3)}  ${domain}`)
    for (const u of urls.slice(0, 2)) {
      console.log(`      ${u.substring(0, 100)}`)
    }
  }
}

main().catch(console.error)
