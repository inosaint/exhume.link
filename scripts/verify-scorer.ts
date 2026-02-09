/**
 * Quick scorer verification script.
 * Run with: npx tsx scripts/verify-scorer.ts
 *
 * Expected output: "Warlock of the Endless Horde"
 */
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const samplePath = join(__dirname, '..', 'browserdata', 'all_tabs_clean.txt')
const sampleText = readFileSync(samplePath, 'utf-8')

async function main() {
  // Dynamically import to handle the module
  const { analyzeInputToSession } = await import('../src/data/tabsAnalysis')

  const session = await analyzeInputToSession(sampleText, { stepDelayMs: 0 })

  console.log('=== Scorer Verification ===')
  console.log(`Total tabs:         ${session.stats.totalTabs}`)
  console.log(`Unique domains:     ${session.stats.uniqueDomains}`)
  console.log(`Repeat domains:     ${session.stats.repeatDomains}`)
  console.log(`Unresolved searches:${session.stats.unresolvedSearches}`)
  console.log(`Homepage-only:      ${session.stats.homepageOnly}`)
  console.log(`Mapped locations:   ${session.stats.mappedLocations}`)
  console.log(`Top domain:         ${session.stats.topDomain?.domain} (${session.stats.topDomain?.count})`)
  console.log(`Top categories:     ${session.stats.topCategories.map(c => `${c.label}: ${c.count}`).join(', ')}`)
  console.log()
  // Show category breakdown
  const cats = session.categoryGroups
    .filter(g => g.count > 0)
    .sort((a, b) => b.count - a.count)
    .map(g => `${g.category.label}: ${g.count}`)
  console.log(`All categories:     ${cats.join(', ')}`)
  console.log()
  console.log(`Archetype:          ${session.personality.archetype}`)
  console.log(`Title:              ${session.personality.title}`)
  console.log(`Description:        ${session.personality.description}`)
  console.log()

  // Import dimension/axis scoring for debugging
  const { scoreDimensionsDebug } = await import('../src/data/tabsAnalysis')
  if (typeof scoreDimensionsDebug === 'function') {
    console.log('--- Dimension & Axis Debug ---')
    console.log(scoreDimensionsDebug)
  }

  const expected = 'Warlock of the Endless Horde'
  if (session.personality.title === expected) {
    console.log(`✅ PASS — matches expected "${expected}"`)
  } else {
    console.log(`❌ FAIL — got "${session.personality.title}", expected "${expected}"`)
  }
}

main().catch(console.error)
