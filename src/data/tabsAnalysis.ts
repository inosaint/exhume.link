import {
  CATEGORIES,
  type CategoryDef,
  type CategoryGroup,
  type CategoryId,
  type ClusteredLocation,
  type TabEntry,
} from './mockData'

export type ArchetypeId =
  | 'necromancer'
  | 'warlock'
  | 'wraith'
  | 'bone-cleric'
  | 'zombie'
  | 'lich'
  | 'unburdened'
  | 'mortab'

export interface PersonalityProfile {
  archetype: ArchetypeId
  title: string
  description: string
  image: string
}

export interface ExhumeStats {
  totalTabs: number
  uniqueDomains: number
  repeatDomains: number
  unresolvedSearches: number
  homepageOnly: number
  topDomain: { domain: string; count: number } | null
  topCategories: { id: CategoryId; label: string; count: number }[]
  mappedLocations: number
  mappedDomains: number
}

export interface GrimReport {
  /** Domains with 5+ tabs — the rabbit holes */
  spirals: { domain: string; count: number }[]
  deepestSpiral: { domain: string; count: number } | null
  /** Consumption (reading+news+video+social) vs Creation (tools+design+portfolios) */
  consumptionCount: number
  creationCount: number
  ratio: string // e.g. "4:1"
  isConsumer: boolean
  /** Tabs likely stale (news, social, shopping — ephemeral by nature) */
  staleCount: number
  stalePct: number
  /** Unfinished business */
  unfinishedShopping: number
  unfinishedJobs: number
  /** Domains visited exactly once */
  oneAndDoneCount: number
  oneAndDonePct: number
  /** Template-generated verdict paragraph */
  verdict: string
}

export interface ExhumeSession {
  tabs: TabEntry[]
  categoryGroups: CategoryGroup[]
  locations: ClusteredLocation[]
  stats: ExhumeStats
  personality: PersonalityProfile
  grimReport: GrimReport
}

const TRACKING_PARAMS = new Set([
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'utm_id',
  'gclid',
  'fbclid',
  'igshid',
  'mc_cid',
  'mc_eid',
  'ref',
  'ref_src',
  'source',
])

const TWO_LEVEL_SUFFIXES = new Set([
  'co.in',
  'co.uk',
  'org.uk',
  'ac.uk',
  'gov.uk',
  'com.au',
  'net.au',
  'org.au',
  'co.jp',
  'com.br',
  'com.mx',
])

const ARCHETYPES: Record<
  ArchetypeId,
  { baseTitle: string; description: string; image: string }
> = {
  necromancer: {
    baseTitle: 'Necromancer',
    description:
      'You exhume knowledge on purpose. Your tabs are grimoires — long reads, old essays, and sources that still matter. You finish what you open. Nothing here is accidental.',
    image: '/necromancer.png',
  },
  warlock: {
    baseTitle: 'Warlock',
    description:
      'Your tabs are instruments of work. Tools, references, and opportunities bound by intent. You open with purpose, act decisively, and close the pact when the task is done.',
    image: '/warlock.png',
  },
  wraith: {
    baseTitle: 'Wraith',
    description:
      'You followed one idea too far. Rabbit holes, half-read books, endless related tabs — all circling something you haven\'t named yet. The knowledge lingers. You do too.',
    image: '/wraith.png',
  },
  'bone-cleric': {
    baseTitle: 'Bone Cleric',
    description:
      'You survey the dead and decide what rises. News, tools, markets, and signals pass through you. You evaluate, choose, and move on. Wide vision. Clean cuts.',
    image: '/bone-cleric.png',
  },
  zombie: {
    baseTitle: 'Zombie',
    description:
      'You didn\'t mean to open these tabs. They spread anyway. Social links, homepages, forgotten searches — all open, none finished. You wander. The tabs multiply.',
    image: '/zombie.png',
  },
  lich: {
    baseTitle: 'Lich',
    description:
      'You accumulate power but never release it. Carts filled, tools bookmarked, decisions deferred. Everything is collected. Nothing is committed.',
    image: '/lich.png',
  },
  unburdened: {
    baseTitle: 'The Unburdened',
    description:
      'Fewer than ten tabs. You travel light through the digital world — or you just got here. Either way, the graves are shallow.',
    image: '/theunburdened.png',
  },
  mortab: {
    baseTitle: 'Mor\'tab the Unending',
    description:
      'You have crossed the threshold. A thousand tabs or more, all coexisting in impossible equilibrium. Not chaos — something older. You no longer manage tabs. They orbit you.',
    image: '/mortabtheunending.png',
  },
}

const KNOWN_DOMAIN_LOCATIONS: Record<string, { city: string; lat: number; lng: number }> = {
  'medium.com': { city: 'San Francisco', lat: 37.7749, lng: -122.4194 },
  'youtube.com': { city: 'Mountain View', lat: 37.422, lng: -122.0841 },
  'google.com': { city: 'Mountain View', lat: 37.422, lng: -122.0841 },
  'google.co.in': { city: 'Bangalore', lat: 12.9716, lng: 77.5946 },
  'twitter.com': { city: 'San Francisco', lat: 37.7749, lng: -122.4194 },
  'x.com': { city: 'San Francisco', lat: 37.7749, lng: -122.4194 },
  'reddit.com': { city: 'San Francisco', lat: 37.7749, lng: -122.4194 },
  'amazon.com': { city: 'Seattle', lat: 47.6062, lng: -122.3321 },
  'amazon.in': { city: 'Bangalore', lat: 12.9716, lng: 77.5946 },
  'wikipedia.org': { city: 'San Francisco', lat: 37.7749, lng: -122.4194 },
  'github.com': { city: 'San Francisco', lat: 37.7749, lng: -122.4194 },
}

const CCTLD_LOCATIONS: Record<string, { city: string; lat: number; lng: number }> = {
  in: { city: 'New Delhi', lat: 28.6139, lng: 77.209 },
  lk: { city: 'Colombo', lat: 6.9271, lng: 79.8612 },
  uk: { city: 'London', lat: 51.5074, lng: -0.1278 },
  fr: { city: 'Paris', lat: 48.8566, lng: 2.3522 },
  de: { city: 'Berlin', lat: 52.52, lng: 13.405 },
  jp: { city: 'Tokyo', lat: 35.6762, lng: 139.6503 },
  ca: { city: 'Ottawa', lat: 45.4215, lng: -75.6972 },
  au: { city: 'Canberra', lat: -35.2809, lng: 149.13 },
  br: { city: 'Brasília', lat: -15.7939, lng: -47.8828 },
  mx: { city: 'Mexico City', lat: 19.4326, lng: -99.1332 },
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function stripTrailingPunctuation(url: string): string {
  return url.replace(/[)\],.;]+$/g, '')
}

export function extractUrlsFromText(text: string): string[] {
  const matches = text.match(/https?:\/\/[^\s"'<>]+/gi) ?? []
  const urls: string[] = []

  for (const match of matches) {
    const cleaned = stripTrailingPunctuation(match.trim())
    if (!cleaned) continue
    urls.push(cleaned)
  }

  return urls
}

function withoutTrackingParams(url: URL): URL {
  const next = new URL(url.toString())
  next.hash = ''

  for (const [key] of Array.from(next.searchParams.entries())) {
    const lower = key.toLowerCase()
    if (lower.startsWith('utm_') || TRACKING_PARAMS.has(lower)) {
      next.searchParams.delete(key)
    }
  }

  const search = next.searchParams.toString()
  next.search = search ? `?${search}` : ''
  return next
}

function unwrapGoogleAmp(url: URL): URL {
  const host = url.hostname.toLowerCase()
  if (!host.includes('google.')) return url

  const prefix = '/amp/s/'
  if (!url.pathname.startsWith(prefix)) return url

  const raw = url.pathname.slice(prefix.length) + url.search + url.hash
  const target = raw.startsWith('http://') || raw.startsWith('https://')
    ? raw
    : `https://${raw}`

  try {
    return new URL(target)
  } catch {
    return url
  }
}

function normalizeUrl(input: string): URL | null {
  try {
    const parsed = new URL(input)
    const unwrapped = unwrapGoogleAmp(parsed)
    return withoutTrackingParams(unwrapped)
  } catch {
    return null
  }
}

export function getRegistrableDomain(hostname: string): string {
  const host = hostname.toLowerCase().replace(/^www\./, '')
  const parts = host.split('.').filter(Boolean)
  if (parts.length <= 2) return host

  const last2 = parts.slice(-2).join('.')
  if (TWO_LEVEL_SUFFIXES.has(last2)) {
    return parts.slice(-3).join('.')
  }
  return last2
}

function isHomepage(url: URL): boolean {
  const path = url.pathname.replace(/\/+$/, '')
  return (path === '' || path === '/') && url.search === ''
}

function isUnresolvedSearch(url: URL, domain: string): boolean {
  if (domain.startsWith('google.')) {
    return url.pathname === '/search' && url.searchParams.has('q')
  }
  return false
}

function topNFromCounts(map: Map<string, number>, n: number): { domain: string; count: number }[] {
  return Array.from(map.entries())
    .map(([domain, count]) => ({ domain, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, n)
}

function estimateLocation(domain: string): { city: string; lat: number; lng: number } | null {
  const known = KNOWN_DOMAIN_LOCATIONS[domain]
  if (known) return known

  const parts = domain.split('.').filter(Boolean)
  const tld = parts[parts.length - 1]
  if (!tld || tld.length !== 2) return null
  return CCTLD_LOCATIONS[tld] ?? null
}

/* ── Domain sets for classification ── */

const JOBS_DOMAINS = new Set([
  'greenhouse.io', 'lever.co', 'otta.com', 'wellfound.com', 'angel.co',
  'indeed.com', 'glassdoor.com', 'ziprecruiter.com', 'otter.work', 'talentify.io',
  'workatastartup.com', 'remoteok.io', 'weworkremotely.com', 'hired.com',
])

const EVENTS_DOMAINS = new Set([
  'lu.ma', 'luma.com', 'eventbrite.com', 'meetup.com', 'ti.to',
  'hopin.com', 'splashthat.com',
])

const TRAVEL_DOMAINS = new Set([
  'tripadvisor.com', 'booking.com', 'airbnb.com', 'hotels.com',
  'skyscanner.com', 'kayak.com', 'lonelyplanet.com',
])

const TOOLS_DOMAINS = new Set([
  'github.com', 'notion.so', 'notion.site', 'figma.com', 'cal.com',
  'chat.openai.com', 'openai.com', 'claude.ai', 'cursor.com',
  'linear.app', 'vercel.com', 'netlify.com', 'heroku.com', 'railway.app',
  'miro.com', 'whimsical.com', 'excalidraw.com', 'loom.com',
  'slack.com', 'discord.com', 'airtable.com', 'amplitude.com',
  'mixpanel.com', 'segment.com', 'hotjar.com', 'webflow.com',
  'framer.com', 'retool.com', 'supabase.com', 'firebase.google.com',
  'stackoverflow.com', 'codepen.io', 'replit.com', 'codesandbox.io',
  'npmjs.com', 'bundlephobia.com', 'caniuse.com', 'typescriptlang.org',
])

const DESIGN_DOMAINS = new Set([
  'uxdesign.cc', 'dribbble.com', 'behance.net', 'awwwards.com',
  'designernews.co', 'dezeen.com', 'itsnicethat.com', 'creativeboom.com',
  'printmag.com', 'eyeondesign.aiga.org', 'designweek.co.uk',
  'designobserver.com', 'core77.com', 'yankodesign.com', 'fastcompany.com',
  'commarts.com', 'typeroom.eu', 'fontsinuse.com', 'typographica.org',
  'smashingmagazine.com', 'alistapart.com', 'cssdesignawards.com',
  'designspiration.com', 'abduzeedo.com', 'swiss-miss.com',
  'the-brandidentity.com', 'bfrnd.com', 'thecollectiveshift.com',
  'spec.fm', 'nngroup.com', 'lawsofux.com', 'refactoringui.com',
  'ui.dev', 'uxplanet.org', 'uxtools.co', 'designsystems.com',
  'storybook.js.org', 'mobbin.com', 'pageflows.com',
  'nobl.io', 'leaddev.com',
])

const NEWS_DOMAINS = new Set([
  'bbc.com', 'bbc.co.uk', 'reuters.com', 'livemint.com', 'economictimes.com',
  'theatlantic.com', 'bloomberg.com', 'nytimes.com', 'washingtonpost.com',
  'theguardian.com', 'wired.com', 'arstechnica.com', 'theverge.com',
  'techcrunch.com', 'cnn.com', 'axios.com', 'apnews.com', 'npr.org',
  'qz.com', 'vox.com', 'slate.com', 'newyorker.com', 'propublica.org',
  'technologyreview.com', 'hbr.org', 'ft.com', 'economist.com',
  'restofworld.org', 'dhakatribune.com', 'firstpost.com',
  'scroll.in', 'thehindu.com', 'ndtv.com', 'moneycontrol.com',
  'protocol.com', 'semafor.com', 'puck.news', 'platformer.news',
])

const SOCIAL_DOMAINS = new Set([
  'twitter.com', 'x.com', 't.co', 'reddit.com', 'instagram.com',
  'linkedin.com', 'facebook.com', 'threads.net', 'mastodon.social',
  'bsky.app', 'hacker-news.firebaseio.com', 'news.ycombinator.com',
  'producthunt.com',
])

const VIDEO_DOMAINS = new Set([
  'youtube.com', 'vimeo.com', 'twitch.tv', 'dailymotion.com',
  'bandcamp.com',
])

const READING_DOMAINS = new Set([
  'medium.com', 'substack.com', 'wordpress.com', 'wikipedia.org',
  'dev.to', 'beehiiv.com', 'goodreads.com', 'bookshop.org',
  'brainpickings.org', 'themarginalian.org', 'ribbonfarm.com',
  'astralcodexten.com', 'slatestarcodex.com', 'farnamstreetblog.com',
  'fs.blog', 'lesswrong.com', 'waitbutwhy.com', 'aeon.co',
  'longreads.com', 'lithub.com', 'tor.com', 'lrb.co.uk',
  'theparisreview.org', 'granta.com', 'interestingengineering.com',
  'nautil.us', 'theconversation.com', 'psyche.co',
  'perell.com', 'alexdanco.com', 'raptitude.com', 'austinkleon.com',
  'invertedpassion.com', 'pragmaticengineer.com', 'stratechery.com',
  'eugenewei.com', 'matthewstrom.com', 'ben-evans.com',
  'paulgraham.com', 'sethgodin.com', 'calnewport.com',
  'lennysnewsletter.com', 'platformmag.com', 'noidea.dog',
  'stfj.net', 'thomasbyttebier.be', 'pxjournal.org',
])

const SHOPPING_DOMAINS = new Set([
  'etsy.com', 'ebay.com', 'walmart.com', 'target.com', 'shopify.com',
  'steampowered.com', 'shopartshop.com', 'upwithpaper.com',
])

const _GAMING_DOMAINS = new Set([
  'steampowered.com', 'store.steampowered.com', 'pcgamesn.com',
  'itch.io', 'myanimelist.net', 'ign.com', 'kotaku.com', 'polygon.com',
])
void _GAMING_DOMAINS // reserved for future classifier expansion

function classifyCategory(url: URL, domain: string): CategoryId {
  const host = url.hostname.toLowerCase()
  const path = url.pathname.toLowerCase()

  // PDFs are reading material
  if (path.endsWith('.pdf')) return 'reading'

  // Jobs & hiring (check before other categories since /jobs paths are specific)
  if (JOBS_DOMAINS.has(domain) || path.includes('/jobs') || path.includes('/careers') || path.includes('/hiring')) {
    return 'jobs'
  }

  // Events
  if (EVENTS_DOMAINS.has(domain)) return 'events'

  // Travel (includes .lk country TLD)
  if (TRAVEL_DOMAINS.has(domain) || domain.endsWith('.lk')) return 'travel'

  // Shopping (amazon.* domains + path heuristics)
  if (
    domain.startsWith('amazon.') ||
    SHOPPING_DOMAINS.has(domain) ||
    path.includes('/dp/') ||
    path.includes('/product/') ||
    path.includes('/cart')
  ) {
    return 'shopping'
  }

  // Tools & productivity
  if (TOOLS_DOMAINS.has(domain)) return 'tools'

  // Design & UX (domain list + .design TLD + path heuristics)
  if (
    DESIGN_DOMAINS.has(domain) ||
    domain.endsWith('.design') ||
    path.includes('/design/') ||
    (path.includes('/design') && path.endsWith('/design'))
  ) {
    return 'design'
  }

  // News
  if (NEWS_DOMAINS.has(domain)) return 'news'

  // Video
  if (
    VIDEO_DOMAINS.has(domain) ||
    host.endsWith('.youtube.com') ||
    domain === 'open.spotify.com' ||
    domain === 'spotify.com'
  ) {
    return 'video'
  }

  // Social
  if (SOCIAL_DOMAINS.has(domain)) return 'social'

  // Reading platforms / long-form / blogs
  if (
    READING_DOMAINS.has(domain) ||
    host.endsWith('.medium.com') ||
    host.endsWith('.substack.com') ||
    host.includes('wordpress.com') ||
    host.includes('blogspot.') ||
    path.includes('/blog/') ||
    path.includes('/blog') && path.split('/').length <= 3 ||
    path.includes('/writing/') ||
    path.includes('/essay') ||
    path.includes('/article/')
  ) {
    return 'reading'
  }

  // Portfolios (heuristics — personal sites with portfolio paths)
  if (
    path.includes('/portfolio') ||
    path.includes('/case-stud') ||
    path === '/work' ||
    path.startsWith('/work/') ||
    path.includes('/projects') ||
    path === '/about' ||
    path === '/' && (
      host.includes('studio') ||
      host.includes('agency') ||
      host.includes('creative')
    )
  ) {
    return 'portfolios'
  }

  // Personal/agency homepage heuristic:
  // A homepage (no path or single shallow path) on a non-major platform domain
  // is likely a personal portfolio or design studio site.
  const pathSegments = path.split('/').filter(Boolean)
  const isPersonalTLD = /\.(io|co|me|cc|ee|dev|xyz|art|page|site|cool|work|land|studio|agency)$/.test(domain)

  // Homepage of a personal-TLD domain → portfolio
  if (pathSegments.length === 0 && isPersonalTLD) {
    return 'portfolios'
  }

  // Homepage of any non-major .com/.org → likely portfolio (person or company homepage)
  // We check: ≤1 path segment, not a known platform, short domain name typical of personal sites
  const isMajorPlatform = domain.split('.')[0].length > 12 // rough heuristic: long first-part = less likely personal
  if (pathSegments.length <= 1 && !isMajorPlatform) {
    // If the path looks like a name, work sample, or about page → portfolio
    const seg = pathSegments[0] ?? ''
    if (
      seg === '' || // homepage
      seg === 'about' ||
      seg === 'info' ||
      seg === 'stamps' ||
      seg === 'films' ||
      /^[a-z-]+$/.test(seg) && seg.length < 20 // short slug, likely a page name
    ) {
      return 'portfolios'
    }
  }

  return 'other'
}

function buildCategoryGroups(tabs: TabEntry[]): CategoryGroup[] {
  const byCategory = new Map<CategoryId, TabEntry[]>()
  for (const tab of tabs) {
    const list = byCategory.get(tab.category) ?? []
    list.push(tab)
    byCategory.set(tab.category, list)
  }

  return CATEGORIES.map((category: CategoryDef) => {
    const list = byCategory.get(category.id) ?? []
    return {
      category,
      tabs: list,
      count: list.length,
    }
  })
}

function computeTopCategories(counts: Record<CategoryId, number>): { id: CategoryId; label: string; count: number }[] {
  return CATEGORIES
    .filter((c) => c.id !== 'other')
    .map((c) => ({ id: c.id, label: c.label, count: counts[c.id] ?? 0 }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)
}

/* ── 8-dimension scoring per docs/personality-scoring.md ── */

export interface DimensionScores {
  depth: number         // dim 1: inverted breadth + repeat domains + rabbit holes
  readingMass: number   // dim 2: reading platforms + blogs + books + long-form news
  actionMass: number    // dim 3: tools + portfolios + shopping + jobs
  socialPull: number    // dim 4: twitter + reddit + instagram + linkedin
  unresolvedCuriosity: number // dim 5: open google searches + homepage-only tabs
  rabbitHoleDepth: number     // dim 6: cross-platform follows + repeat authors + series reads
  scoutActivity: number       // dim 7: portfolios + job boards + events + distinct news outlets
  evergreenRetention: number  // dim 8: (not detectable from URLs alone, defaults to 0)
}

export interface AxisScores {
  depthBreadth: number    // axis A: >0.5 = depth, <0.5 = breadth
  consumptionAction: number // axis B: >0.5 = action, <0.5 = consumption
  resolvedUnresolved: number // axis C: >0.5 = unresolved, <0.5 = resolved
}

function clamp01(v: number): number {
  return Math.min(1, Math.max(0, v))
}

/**
 * Detect rabbit holes: same topic appearing across multiple platforms.
 * We approximate this by finding domains that share URL path keywords
 * (e.g. same author name, book title, or topic slug appearing on 2+ domains).
 */
function countRabbitHoles(tabs: { url: string; domain: string }[]): number {
  // Extract meaningful path slugs (3+ char segments) grouped by domain
  const slugsByDomain = new Map<string, Set<string>>()
  for (const tab of tabs) {
    try {
      const url = new URL(tab.url)
      const segments = url.pathname
        .split('/')
        .filter(s => s.length >= 4 && !/^\d+$/.test(s))
        .map(s => s.toLowerCase().replace(/[-_]/g, ''))
      if (segments.length === 0) continue
      const existing = slugsByDomain.get(tab.domain) ?? new Set()
      for (const seg of segments) existing.add(seg)
      slugsByDomain.set(tab.domain, existing)
    } catch { /* skip */ }
  }

  // Find slugs that appear across 2+ different domains
  const slugDomainCount = new Map<string, number>()
  for (const [, slugs] of slugsByDomain) {
    for (const slug of slugs) {
      slugDomainCount.set(slug, (slugDomainCount.get(slug) ?? 0) + 1)
    }
  }

  return Array.from(slugDomainCount.values()).filter(c => c >= 2).length
}

/**
 * Count series read-throughs: multiple tabs from the same Medium publication,
 * Substack, or similar reading platform (same subdomain/path prefix).
 */
function countSeriesReads(tabs: { url: string; domain: string }[]): number {
  const publicationCounts = new Map<string, number>()

  for (const tab of tabs) {
    try {
      const url = new URL(tab.url)
      const host = url.hostname.toLowerCase()

      // Medium publications: medium.com/@author or custom.medium.com
      if (tab.domain === 'medium.com') {
        const pathMatch = url.pathname.match(/^\/@([^/]+)/)
        if (pathMatch) {
          publicationCounts.set(`medium:${pathMatch[1]}`, (publicationCounts.get(`medium:${pathMatch[1]}`) ?? 0) + 1)
        }
      }
      // Substack: author.substack.com
      if (host.endsWith('.substack.com')) {
        const sub = host.replace('.substack.com', '')
        publicationCounts.set(`substack:${sub}`, (publicationCounts.get(`substack:${sub}`) ?? 0) + 1)
      }
    } catch { /* skip */ }
  }

  // Count publications with 2+ tabs (indicates sequential reading)
  return Array.from(publicationCounts.values()).filter(c => c >= 2).length
}

/**
 * Count distinct news outlets in the dataset.
 */
function countDistinctNewsOutlets(
  tabs: { domain: string; category: CategoryId }[]
): number {
  const outlets = new Set<string>()
  for (const tab of tabs) {
    if (tab.category === 'news') outlets.add(tab.domain)
  }
  return outlets.size
}

function scoreDimensions(input: {
  totalTabs: number
  uniqueDomains: number
  domainCounts: Map<string, number>
  categoryCounts: Record<CategoryId, number>
  unresolvedSearches: number
  homepageOnly: number
  tabs: { url: string; domain: string; category: CategoryId }[]
}): DimensionScores {
  const { totalTabs, uniqueDomains, domainCounts, categoryCounts, unresolvedSearches, homepageOnly, tabs } = input
  const total = Math.max(1, totalTabs)

  // ── Dim 1: Depth ──
  // Inverted breadth ratio + repeat domain weight + rabbit holes
  const breadthRatio = uniqueDomains / total
  const invertedBreadth = 1 - breadthRatio
  const repeatDomainCount = Array.from(domainCounts.values()).filter(c => c >= 3).length
  const repeatWeight = Math.min(1, repeatDomainCount / 10)
  const rabbitHoles = countRabbitHoles(tabs)
  const rabbitHoleWeight = Math.min(1, rabbitHoles / 8)
  const depth = clamp01((invertedBreadth * 0.5) + (repeatWeight * 0.3) + (rabbitHoleWeight * 0.2))

  // ── Dim 2: Reading Mass ──
  // Normalize against classified tabs only (exclude 'other') so uncategorized
  // personal-domain tabs don't dilute the signal.
  const otherCount = categoryCounts.other ?? 0
  const classifiedTotal = Math.max(1, total - otherCount)

  const readingTabs = (categoryCounts.reading ?? 0) + (categoryCounts.news ?? 0)
  const readingMass = clamp01(readingTabs / classifiedTotal)

  // ── Dim 3: Action Mass ──
  const actionTabs = (categoryCounts.tools ?? 0) + (categoryCounts.portfolios ?? 0) +
    (categoryCounts.shopping ?? 0) + (categoryCounts.jobs ?? 0) + (categoryCounts.events ?? 0) +
    (categoryCounts.design ?? 0) // design tabs in this context are workspace/professional
  const actionMass = clamp01(actionTabs / classifiedTotal)

  // ── Dim 4: Social Pull ──
  const socialTabs = categoryCounts.social ?? 0
  const socialPull = clamp01(socialTabs / total)

  // ── Dim 5: Unresolved Curiosity ──
  // Open searches are strong unresolved signals; homepage-only tabs are weaker
  // (homepage tabs often indicate "bookmark-like" behavior, not true unresolved curiosity)
  const unresolvedSignals = unresolvedSearches + (homepageOnly * 0.3)
  const unresolvedCuriosity = clamp01(unresolvedSignals / total)

  // ── Dim 6: Rabbit Hole Depth ──
  const seriesReads = countSeriesReads(tabs)
  const rabbitHoleDepth = clamp01(
    (rabbitHoleWeight * 0.5) + (Math.min(1, seriesReads / 5) * 0.5)
  )

  // ── Dim 7: Scout Activity ──
  // Portfolios, job boards, events, and distinct news outlets all signal
  // deliberate professional scouting. Design tabs also contribute.
  const portfolioTabs = categoryCounts.portfolios ?? 0
  const jobTabs = categoryCounts.jobs ?? 0
  const eventTabs = categoryCounts.events ?? 0
  const designTabs = categoryCounts.design ?? 0
  const newsOutlets = countDistinctNewsOutlets(tabs)
  const scoutRaw = portfolioTabs + jobTabs + eventTabs + newsOutlets + designTabs
  const scoutActivity = clamp01(scoutRaw / classifiedTotal)

  // ── Dim 8: Evergreen Retention ──
  // Not reliably detectable from URLs alone (no dates in most URLs)
  const evergreenRetention = 0

  return {
    depth,
    readingMass,
    actionMass,
    socialPull,
    unresolvedCuriosity,
    rabbitHoleDepth,
    scoutActivity,
    evergreenRetention,
  }
}

function mapToAxes(dims: DimensionScores): AxisScores {
  // Axis A: DEPTH ↔ BREADTH — driven by dims 1 (depth) and 6 (rabbit hole depth)
  // High value = deep, low value = broad
  const depthBreadth = clamp01((dims.depth * 0.7) + (dims.rabbitHoleDepth * 0.3))

  // Axis B: CONSUMPTION ↔ ACTION
  // Per spec: Action = dim 3 (action mass), Consumption = dim 2 (reading mass)
  // Scout activity (dim 7) also signals action-oriented behavior —
  // portfolios, job boards, events are deliberate workspace actions.
  // Social pull (dim 4) is a consumption signal — content arrives via feeds.
  const actionSignal = dims.actionMass + (dims.scoutActivity * 0.5)
  const consumptionSignal = dims.readingMass + (dims.socialPull * 0.5)
  const totalMass = actionSignal + consumptionSignal
  const consumptionAction = totalMass > 0
    ? clamp01(actionSignal / totalMass)
    : 0.5

  // Axis C: RESOLVED ↔ UNRESOLVED — driven by dims 5 (unresolved) vs 7 (scout)
  // High scout activity + low unresolved = resolved (deliberate browsing)
  // High unresolved + low scout = unresolved (wandering)
  const resolveTotal = dims.unresolvedCuriosity + dims.scoutActivity
  const resolvedUnresolved = resolveTotal > 0
    ? clamp01(dims.unresolvedCuriosity / resolveTotal)
    : 0.5

  return { depthBreadth, consumptionAction, resolvedUnresolved }
}

function axesToArchetype(axes: AxisScores, dims: DimensionScores): ArchetypeId {
  const isDeep = axes.depthBreadth >= 0.5
  const isAction = axes.consumptionAction >= 0.5
  const isUnresolved = axes.resolvedUnresolved >= 0.5

  if (isDeep && !isAction && !isUnresolved) return 'necromancer'
  if (isDeep && isAction && !isUnresolved) return 'warlock'
  if (isDeep && !isAction && isUnresolved) return 'wraith'
  if (!isDeep && isAction && !isUnresolved) return 'bone-cleric'
  if (!isDeep && !isAction && isUnresolved) return 'zombie'
  if (!isDeep && isAction && isUnresolved) return 'lich'

  // Edge cases (deep + action + unresolved, broad + consumption + resolved)
  // These don't occur naturally per spec — pick closest match
  if (isDeep && isAction && isUnresolved) {
    // Lean toward wraith if reading heavy, lich otherwise
    return dims.readingMass > dims.actionMass ? 'wraith' : 'lich'
  }
  // Broad + consumption + resolved
  if (dims.socialPull > 0.1) return 'zombie'
  return 'necromancer'
}

function scorePersonality(input: {
  totalTabs: number
  uniqueDomains: number
  domainCounts: Map<string, number>
  categoryCounts: Record<CategoryId, number>
  unresolvedSearches: number
  homepageOnly: number
  tabs: { url: string; domain: string; category: CategoryId }[]
}): PersonalityProfile {
  const { totalTabs } = input

  // Special override: <10 tabs → Unburdened (not enough signal to classify)
  if (totalTabs < 10) {
    const base = ARCHETYPES.unburdened
    return {
      archetype: 'unburdened',
      title: base.baseTitle,
      description: base.description,
      image: base.image,
    }
  }

  // Special override: ≥1000 tabs → Mor'tab the Unending (ascended state)
  if (totalTabs >= 1000) {
    const base = ARCHETYPES.mortab
    return {
      archetype: 'mortab',
      title: base.baseTitle,
      description: base.description,
      image: base.image,
    }
  }

  const dims = scoreDimensions(input)
  const axes = mapToAxes(dims)
  const archetype = axesToArchetype(axes, dims)

  const volumeSuffix =
    totalTabs >= 500
      ? 'of the Endless Horde'
      : totalTabs >= 250
        ? 'of the Horde'
        : totalTabs >= 100
          ? 'of the Dark Legion'
          : totalTabs >= 50
            ? 'of the Cult'
            : 'of the Shadows'

  const base = ARCHETYPES[archetype]
  const title = `${base.baseTitle} ${volumeSuffix}`

  return {
    archetype,
    title,
    description: base.description,
    image: base.image,
  }
}

/* ── Grim Report computation ── */

function computeGrimReport(input: {
  domainCounts: Map<string, number>
  categoryCounts: Record<CategoryId, number>
  totalTabs: number
  uniqueDomains: number
  personality: PersonalityProfile
}): GrimReport {
  const { domainCounts, categoryCounts, totalTabs, uniqueDomains, personality } = input

  // Spirals: domains with 5+ tabs
  const spirals = Array.from(domainCounts.entries())
    .filter(([, c]) => c >= 5)
    .map(([domain, count]) => ({ domain, count }))
    .sort((a, b) => b.count - a.count)

  const deepestSpiral = spirals.length > 0 ? spirals[0] : null

  // Consumption vs Creation
  const consumptionCount =
    (categoryCounts.reading ?? 0) +
    (categoryCounts.news ?? 0) +
    (categoryCounts.video ?? 0) +
    (categoryCounts.social ?? 0)

  const creationCount =
    (categoryCounts.tools ?? 0) +
    (categoryCounts.design ?? 0) +
    (categoryCounts.portfolios ?? 0)

  const isConsumer = consumptionCount >= creationCount
  const high = Math.max(consumptionCount, creationCount, 1)
  const low = Math.max(Math.min(consumptionCount, creationCount), 1)
  const ratioNum = Math.round(high / low)
  const ratio = ratioNum <= 1 ? '1:1' : `${ratioNum}:1`

  // Stale tabs: news, social, shopping are ephemeral
  const staleCount =
    (categoryCounts.news ?? 0) +
    (categoryCounts.social ?? 0) +
    (categoryCounts.shopping ?? 0)
  const stalePct = totalTabs > 0 ? Math.round((staleCount / totalTabs) * 100) : 0

  // Unfinished business
  const unfinishedShopping = categoryCounts.shopping ?? 0
  const unfinishedJobs = categoryCounts.jobs ?? 0

  // One-and-done domains
  const oneAndDoneCount = Array.from(domainCounts.values()).filter(c => c === 1).length
  const oneAndDonePct = uniqueDomains > 0 ? Math.round((oneAndDoneCount / uniqueDomains) * 100) : 0

  // Build verdict
  const verdictParts: string[] = []

  if (personality.archetype === 'unburdened') {
    // Unburdened (<10 tabs) — lighter, cleaner verdict
    verdictParts.push(`You opened ${totalTabs} ${totalTabs === 1 ? 'grave' : 'graves'}.`)
    if (oneAndDonePct > 0) {
      verdictParts.push(`${oneAndDonePct}% of your tabs were laid to rest the same day.`)
    }
    verdictParts.push(`You are ${personality.title} — and nothing is holding you here.`)
  } else if (personality.archetype === 'mortab') {
    // Mor'tab the Unending (≥1000 tabs) — ascended, reverential verdict
    verdictParts.push('Time failed somewhere past tab 600.')
    verdictParts.push('Nothing you opened was ever closed. It was fuel.')
    verdictParts.push('Fuel for your insatiable hunger.')
    verdictParts.push(`Now you've ascended to your now true form,`)
    verdictParts.push(`We bow in your presence, O great ${personality.title}.`)
  } else {
    verdictParts.push(`You opened ${totalTabs} graves.`)

    if (deepestSpiral) {
      verdictParts.push(`You spiraled ${deepestSpiral.count} tabs deep into ${deepestSpiral.domain}.`)
    }

    if (stalePct > 0) {
      verdictParts.push(`${stalePct}% of your tabs are probably already dead.`)
    }

    if (unfinishedShopping > 0 && unfinishedJobs > 0) {
      verdictParts.push(`You saved ${unfinishedShopping} things you'll never buy and browsed ${unfinishedJobs} jobs you'll never apply to.`)
    } else if (unfinishedShopping > 0) {
      verdictParts.push(`You saved ${unfinishedShopping} things you'll never buy.`)
    } else if (unfinishedJobs > 0) {
      verdictParts.push(`You browsed ${unfinishedJobs} jobs you'll never apply to.`)
    }

    if (oneAndDonePct > 50) {
      verdictParts.push(`${oneAndDonePct}% of the domains you touched, you never returned to.`)
    }

    verdictParts.push(`You are ${personality.title} — and you have unfinished business.`)
  }

  return {
    spirals,
    deepestSpiral,
    consumptionCount,
    creationCount,
    ratio,
    isConsumer,
    staleCount,
    stalePct,
    unfinishedShopping,
    unfinishedJobs,
    oneAndDoneCount,
    oneAndDonePct,
    verdict: verdictParts.join(' '),
  }
}

export async function analyzeInputToSession(
  inputText: string,
  options?: {
    onStep?: (stepIndex: number) => void
    stepDelayMs?: number
  }
): Promise<ExhumeSession> {
  const stepDelayMs = options?.stepDelayMs ?? 280
  const onStep = options?.onStep

  const extracted = extractUrlsFromText(inputText)
  if (extracted.length === 0) {
    throw new Error('No URLs found. Paste links or upload a CSV with links.')
  }

  const normalizedUrls: URL[] = []
  const tabs: TabEntry[] = []
  const domainCounts = new Map<string, number>()
  const uniqueDomains = new Set<string>()
  const categoryCounts = Object.fromEntries(
    CATEGORIES.map((c) => [c.id, 0])
  ) as Record<CategoryId, number>

  let unresolvedSearches = 0
  let homepageOnly = 0

  onStep?.(0)
  await sleep(stepDelayMs)

  onStep?.(1)
  await sleep(stepDelayMs)

  onStep?.(2)
  for (const raw of extracted) {
    const url = normalizeUrl(raw)
    if (!url) continue
    normalizedUrls.push(url)
  }
  await sleep(stepDelayMs)

  onStep?.(3)
  for (const url of normalizedUrls) {
    const domain = getRegistrableDomain(url.hostname)
    uniqueDomains.add(domain)
    domainCounts.set(domain, (domainCounts.get(domain) ?? 0) + 1)
    if (isHomepage(url)) homepageOnly += 1
    if (isUnresolvedSearch(url, domain)) unresolvedSearches += 1
  }
  await sleep(stepDelayMs)

  onStep?.(4)
  for (const url of normalizedUrls) {
    const domain = getRegistrableDomain(url.hostname)
    const category = classifyCategory(url, domain)
    categoryCounts[category] = (categoryCounts[category] ?? 0) + 1

    tabs.push({
      url: url.toString(),
      domain,
      category,
    })
  }
  await sleep(stepDelayMs)

  onStep?.(5)
  const topDomains = topNFromCounts(domainCounts, 1)
  const repeatDomains = Array.from(domainCounts.values()).filter((c) => c >= 3).length

  const domainLocations: Array<{ domain: string; count: number; city: string; lat: number; lng: number }> = []
  for (const [domain, count] of domainCounts.entries()) {
    const loc = estimateLocation(domain)
    if (!loc) continue
    domainLocations.push({ domain, count, ...loc })
  }

  const locationsByCity = new Map<string, ClusteredLocation>()
  for (const loc of domainLocations) {
    const key = loc.city
    if (!locationsByCity.has(key)) {
      locationsByCity.set(key, {
        city: loc.city,
        lat: loc.lat,
        lng: loc.lng,
        domains: [],
        totalCount: 0,
      })
    }
    const cluster = locationsByCity.get(key)!
    cluster.domains.push({ domain: loc.domain, count: loc.count })
    cluster.totalCount += loc.count
  }

  const locations = Array.from(locationsByCity.values()).sort((a, b) => b.totalCount - a.totalCount)
  await sleep(stepDelayMs)

  onStep?.(6)
  const personality = scorePersonality({
    totalTabs: tabs.length,
    uniqueDomains: uniqueDomains.size,
    domainCounts,
    categoryCounts,
    unresolvedSearches,
    homepageOnly,
    tabs,
  })
  await sleep(stepDelayMs)

  const topDomain = topDomains[0] ?? null
  const topCategories = computeTopCategories(categoryCounts)

  const stats: ExhumeStats = {
    totalTabs: tabs.length,
    uniqueDomains: uniqueDomains.size,
    repeatDomains,
    unresolvedSearches,
    homepageOnly,
    topDomain,
    topCategories,
    mappedLocations: locations.length,
    mappedDomains: domainLocations.length,
  }

  const categoryGroups = buildCategoryGroups(tabs)

  const grimReport = computeGrimReport({
    domainCounts,
    categoryCounts,
    totalTabs: tabs.length,
    uniqueDomains: uniqueDomains.size,
    personality,
  })

  return {
    tabs,
    categoryGroups,
    locations,
    stats,
    personality,
    grimReport,
  }
}
