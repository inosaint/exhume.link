/**
 * Mock data for Cemetery and World Map sections.
 * This data mirrors the expected output from the scoring pipeline
 * and is based on the sample dataset (689 tabs).
 */

export interface TabEntry {
  url: string
  domain: string
  title?: string
  category: CategoryId
}

export type CategoryId =
  | 'reading'
  | 'design'
  | 'tools'
  | 'social'
  | 'video'
  | 'shopping'
  | 'news'
  | 'portfolios'
  | 'jobs'
  | 'events'
  | 'travel'
  | 'other'

export interface CategoryDef {
  id: CategoryId
  label: string
  icon: string // SVG path or emoji for now
  description: string
}

export const CATEGORIES: CategoryDef[] = [
  { id: 'reading',    label: 'Reading',           icon: '📚', description: 'Articles, blogs, newsletters' },
  { id: 'design',     label: 'Design & UX',       icon: '🎨', description: 'Design resources and inspiration' },
  { id: 'tools',      label: 'Tools',             icon: '🛠️', description: 'Productivity and dev tools' },
  { id: 'social',     label: 'Social',            icon: '💬', description: 'Social media and communities' },
  { id: 'video',      label: 'Video',             icon: '📺', description: 'YouTube, Vimeo, streaming' },
  { id: 'shopping',   label: 'Shopping',          icon: '🛒', description: 'E-commerce and products' },
  { id: 'news',       label: 'News',              icon: '📰', description: 'News outlets and journalism' },
  { id: 'portfolios', label: 'Portfolios',        icon: '💼', description: 'Designer and developer portfolios' },
  { id: 'jobs',       label: 'Jobs & Hiring',     icon: '🎯', description: 'Job boards and career resources' },
  { id: 'events',     label: 'Events',            icon: '📅', description: 'Conferences, meetups, invites' },
  { id: 'travel',     label: 'Travel',            icon: '✈️', description: 'Travel planning and destinations' },
  { id: 'other',      label: 'Other',             icon: '📎', description: 'Miscellaneous tabs' },
]

// Domain to location mapping for world map
export interface DomainLocation {
  domain: string
  lat: number
  lng: number
  city: string
  count: number
}

export const DOMAIN_LOCATIONS: DomainLocation[] = [
  { domain: 'medium.com',        lat: 37.7749, lng: -122.4194, city: 'San Francisco', count: 44 },
  { domain: 'youtube.com',       lat: 37.4220, lng: -122.0841, city: 'Mountain View', count: 27 },
  { domain: 'google.co.in',      lat: 12.9716, lng: 77.5946,   city: 'Bangalore',     count: 22 },
  { domain: 'twitter.com',       lat: 37.7749, lng: -122.4194, city: 'San Francisco', count: 14 },
  { domain: 'amazon.in',         lat: 12.9716, lng: 77.5946,   city: 'Bangalore',     count: 11 },
  { domain: 'reddit.com',        lat: 37.7749, lng: -122.4194, city: 'San Francisco', count: 9 },
  { domain: 'uxdesign.cc',       lat: 37.7749, lng: -122.4194, city: 'San Francisco', count: 6 },
  { domain: 'wikipedia.org',     lat: 37.7749, lng: -122.4194, city: 'San Francisco', count: 5 },
  { domain: 'lu.ma',             lat: 37.7749, lng: -122.4194, city: 'San Francisco', count: 4 },
  { domain: 'substack.com',      lat: 37.7749, lng: -122.4194, city: 'San Francisco', count: 4 },
  { domain: 'figma.com',         lat: 37.7749, lng: -122.4194, city: 'San Francisco', count: 3 },
  { domain: 'github.com',        lat: 37.7749, lng: -122.4194, city: 'San Francisco', count: 3 },
  { domain: 'notion.so',         lat: 37.7749, lng: -122.4194, city: 'San Francisco', count: 2 },
  { domain: 'dribbble.com',      lat: 40.7128, lng: -74.0060,  city: 'New York',      count: 3 },
  { domain: 'linkedin.com',      lat: 37.3861, lng: -122.0839, city: 'Sunnyvale',     count: 4 },
  { domain: 'bbc.com',           lat: 51.5074, lng: -0.1278,   city: 'London',        count: 2 },
  { domain: 'reuters.com',       lat: 51.5074, lng: -0.1278,   city: 'London',        count: 2 },
  { domain: 'livemint.com',      lat: 19.0760, lng: 72.8777,   city: 'Mumbai',        count: 3 },
  { domain: 'economictimes.com', lat: 19.0760, lng: 72.8777,   city: 'Mumbai',        count: 2 },
]

// Sample tabs grouped by category (representative subset)
export interface CategoryGroup {
  category: CategoryDef
  tabs: TabEntry[]
  count: number
}

// Generate mock tabs for each category based on real data
function generateMockTabs(): CategoryGroup[] {
  const tabsByCategory: Record<CategoryId, TabEntry[]> = {
    reading: [
      { url: 'https://medium.com/@user/article-1', domain: 'medium.com', title: 'The Future of Design Systems', category: 'reading' },
      { url: 'https://medium.com/@user/article-2', domain: 'medium.com', title: 'Building Better Products', category: 'reading' },
      { url: 'https://medium.com/@user/article-3', domain: 'medium.com', title: 'On Design Leadership', category: 'reading' },
      { url: 'https://newsletter.substack.com/p/1', domain: 'substack.com', title: 'Weekly Design Digest', category: 'reading' },
      { url: 'https://astralcodexten.substack.com/p/1', domain: 'substack.com', title: 'Astral Codex Ten', category: 'reading' },
      { url: 'https://www.brainpickings.org/article', domain: 'brainpickings.org', title: 'The Art of Possibility', category: 'reading' },
    ],
    design: [
      { url: 'https://uxdesign.cc/article-1', domain: 'uxdesign.cc', title: 'Designing for Accessibility', category: 'design' },
      { url: 'https://uxdesign.cc/article-2', domain: 'uxdesign.cc', title: 'UI Animation Principles', category: 'design' },
      { url: 'https://dribbble.com/shots/1', domain: 'dribbble.com', title: 'Dashboard Concept', category: 'design' },
      { url: 'https://dribbble.com/shots/2', domain: 'dribbble.com', title: 'Mobile App Design', category: 'design' },
      { url: 'https://www.figma.com/community/file/1', domain: 'figma.com', title: 'Design System Kit', category: 'design' },
    ],
    tools: [
      { url: 'https://figma.com/file/1', domain: 'figma.com', title: 'Project Dashboard', category: 'tools' },
      { url: 'https://github.com/repo/1', domain: 'github.com', title: 'react-components', category: 'tools' },
      { url: 'https://github.com/repo/2', domain: 'github.com', title: 'design-tokens', category: 'tools' },
      { url: 'https://notion.so/page/1', domain: 'notion.so', title: 'Project Roadmap', category: 'tools' },
      { url: 'https://cursor.sh/docs', domain: 'cursor.sh', title: 'Cursor AI Editor', category: 'tools' },
      { url: 'https://chatgpt.com/', domain: 'chatgpt.com', title: 'ChatGPT', category: 'tools' },
    ],
    social: [
      { url: 'https://twitter.com/user/status/1', domain: 'twitter.com', title: 'Design thread', category: 'social' },
      { url: 'https://twitter.com/user/status/2', domain: 'twitter.com', title: 'Tech discussion', category: 'social' },
      { url: 'https://reddit.com/r/design/1', domain: 'reddit.com', title: 'r/design discussion', category: 'social' },
      { url: 'https://reddit.com/r/webdev/1', domain: 'reddit.com', title: 'r/webdev thread', category: 'social' },
      { url: 'https://linkedin.com/posts/1', domain: 'linkedin.com', title: 'Career update', category: 'social' },
    ],
    video: [
      { url: 'https://youtube.com/watch?v=1', domain: 'youtube.com', title: 'Design Systems Talk', category: 'video' },
      { url: 'https://youtube.com/watch?v=2', domain: 'youtube.com', title: 'React Tutorial', category: 'video' },
      { url: 'https://youtube.com/watch?v=3', domain: 'youtube.com', title: 'Figma Tips', category: 'video' },
      { url: 'https://vimeo.com/1', domain: 'vimeo.com', title: 'Portfolio Showcase', category: 'video' },
    ],
    shopping: [
      { url: 'https://amazon.in/dp/1', domain: 'amazon.in', title: 'Design Book', category: 'shopping' },
      { url: 'https://amazon.in/dp/2', domain: 'amazon.in', title: 'Mechanical Keyboard', category: 'shopping' },
      { url: 'https://amazon.in/dp/3', domain: 'amazon.in', title: 'Monitor Stand', category: 'shopping' },
    ],
    news: [
      { url: 'https://livemint.com/tech/1', domain: 'livemint.com', title: 'Tech Industry News', category: 'news' },
      { url: 'https://economictimes.com/1', domain: 'economictimes.com', title: 'Startup Funding', category: 'news' },
      { url: 'https://bbc.com/news/1', domain: 'bbc.com', title: 'Global Tech', category: 'news' },
      { url: 'https://reuters.com/tech/1', domain: 'reuters.com', title: 'AI Development', category: 'news' },
    ],
    portfolios: [
      { url: 'https://designer1.design/', domain: 'designer1.design', title: 'Portfolio - Sarah Chen', category: 'portfolios' },
      { url: 'https://designer2.com/work', domain: 'designer2.com', title: 'Portfolio - Alex Rivera', category: 'portfolios' },
      { url: 'https://creative.studio/', domain: 'creative.studio', title: 'Creative Studio', category: 'portfolios' },
    ],
    jobs: [
      { url: 'https://greenhouse.io/job/1', domain: 'greenhouse.io', title: 'Senior Designer - Stripe', category: 'jobs' },
      { url: 'https://otta.com/job/1', domain: 'otta.com', title: 'Product Designer - Figma', category: 'jobs' },
      { url: 'https://wellfound.com/job/1', domain: 'wellfound.com', title: 'Design Lead - Startup', category: 'jobs' },
    ],
    events: [
      { url: 'https://lu.ma/event/1', domain: 'lu.ma', title: 'Design Systems Conf', category: 'events' },
      { url: 'https://lu.ma/event/2', domain: 'lu.ma', title: 'SF Design Meetup', category: 'events' },
      { url: 'https://config.figma.com/', domain: 'figma.com', title: 'Config 2026', category: 'events' },
    ],
    travel: [
      { url: 'https://tripadvisor.com/galle', domain: 'tripadvisor.com', title: 'Galle Fort Guide', category: 'travel' },
      { url: 'https://booking.com/colombo', domain: 'booking.com', title: 'Hotels in Colombo', category: 'travel' },
    ],
    other: [
      { url: 'https://wikipedia.org/wiki/Design', domain: 'wikipedia.org', title: 'Design - Wikipedia', category: 'other' },
      { url: 'https://google.co.in/search?q=test', domain: 'google.co.in', title: 'Google Search', category: 'other' },
    ],
  }

  // Real counts from the sample dataset (689 tabs total)
  const categoryCounts: Record<CategoryId, number> = {
    reading: 85,     // Medium (44) + Substack (21) + blogs
    design: 107,     // UXDesign.cc + Dribbble + design resources
    tools: 35,       // Figma, GitHub, Notion, AI tools
    social: 25,      // Twitter (14) + Reddit (9) + LinkedIn
    video: 31,       // YouTube (27) + Vimeo
    shopping: 15,    // Amazon (11) + others
    news: 24,        // Various news outlets
    portfolios: 40,  // .design domains, portfolio paths
    jobs: 12,        // Job boards
    events: 8,       // Luma (4) + conference sites
    travel: 8,       // Sri Lanka planning
    other: 299,      // Everything else
  }

  return CATEGORIES.map(category => ({
    category,
    tabs: tabsByCategory[category.id],
    count: categoryCounts[category.id],
  }))
}

export const CATEGORY_GROUPS: CategoryGroup[] = generateMockTabs()

// Aggregate locations for clustering on the map
export interface ClusteredLocation {
  city: string
  lat: number
  lng: number
  domains: { domain: string; count: number }[]
  totalCount: number
}

export function getClusteredLocations(): ClusteredLocation[] {
  const clusters = new Map<string, ClusteredLocation>()

  for (const loc of DOMAIN_LOCATIONS) {
    const key = loc.city
    if (!clusters.has(key)) {
      clusters.set(key, {
        city: loc.city,
        lat: loc.lat,
        lng: loc.lng,
        domains: [],
        totalCount: 0,
      })
    }
    const cluster = clusters.get(key)!
    cluster.domains.push({ domain: loc.domain, count: loc.count })
    cluster.totalCount += loc.count
  }

  return Array.from(clusters.values()).sort((a, b) => b.totalCount - a.totalCount)
}

// Stats for the share card
export const SHARE_STATS = {
  totalTabs: 689,
  uniqueDomains: 500,
  browsers: 2,
  topDomain: { name: 'Medium', count: 44 },
  archetype: 'Warlock of the Endless Horde',
  volumeSuffix: '',
  topCategories: [
    { id: 'design' as CategoryId, label: 'Design & UX', count: 107 },
    { id: 'reading' as CategoryId, label: 'Reading', count: 85 },
    { id: 'portfolios' as CategoryId, label: 'Portfolios', count: 40 },
  ],
}

export const PERSONALITY_PROFILE = {
  title: 'Zombie of the Shadows',
  description:
    'Your tabs are instruments of work. Tools, references, and opportunities bound by intent. You open with purpose, act decisively, and close the pact when the task is done.',
  image: '/zombie.png',
}
