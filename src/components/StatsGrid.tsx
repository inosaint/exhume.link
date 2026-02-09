import { useEffect, useRef, useState, type ReactNode } from 'react'
import type { ExhumeStats, GrimReport } from '../data/tabsAnalysis'
import { NECROPOLIS_REGIONS } from '../lib/necropolisRegions'

/** Tiny inline SVG icons — 16×16, currentColor fill */
const ICONS = {
  /** Tab / browser tab → Graves */
  tab: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18" />
      <path d="M9 3v6" />
    </svg>
  ),
  /** Globe → Bloodlines (domains) */
  globe: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  /** Search → Restless Spirits */
  search: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  /** Shield → Dominant Realm (top category) */
  realm: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  /** Crown → Your Popular Haunts (top domain) */
  crown: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 20h20L19 8l-5 6-2-8-2 8-5-6z" />
    </svg>
  ),
  /** Skull → The Rot (stale tabs) */
  skull: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="10" r="8" />
      <path d="M8 14v4" />
      <path d="M12 14v4" />
      <path d="M16 14v4" />
      <circle cx="9" cy="10" r="1.5" fill="currentColor" />
      <circle cx="15" cy="10" r="1.5" fill="currentColor" />
    </svg>
  ),
} as const

interface StatDef {
  label: string
  icon: ReactNode
  value: number
  suffix: string
  note?: string
  variant?: 'domain'
  tooltip: string
}

function useCountUp(target: number, duration = 1200) {
  const [count, setCount] = useState(0)
  const startRef = useRef<number | null>(null)
  const rafRef = useRef<number>(0)

  const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (reducedMotion) return

    startRef.current = null

    function tick(now: number) {
      if (startRef.current === null) startRef.current = now
      const t = Math.min((now - startRef.current) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setCount(Math.round(eased * target))
      if (t < 1) rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [target, duration, reducedMotion])

  return reducedMotion ? target : count
}

function StatCard({ label, icon, value, suffix, note, variant, tooltip }: StatDef) {
  const display = useCountUp(value)
  const [showTooltip, setShowTooltip] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  // Close tooltip when tapping outside on mobile
  useEffect(() => {
    if (!showTooltip) return
    function handleOutside(e: MouseEvent | TouchEvent) {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        setShowTooltip(false)
      }
    }
    document.addEventListener('mousedown', handleOutside)
    document.addEventListener('touchstart', handleOutside)
    return () => {
      document.removeEventListener('mousedown', handleOutside)
      document.removeEventListener('touchstart', handleOutside)
    }
  }, [showTooltip])

  return (
    <div
      ref={cardRef}
      className={`stat-card${variant === 'domain' ? ' stat-card--domain' : ''}`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={() => setShowTooltip(prev => !prev)}
    >
      {variant === 'domain' ? (
        <>
          <span className="stat-card__kicker">{icon} {label}</span>
          {note && <span className="stat-card__domain">{note}</span>}
          <span className="stat-card__count">{display}{suffix}</span>
        </>
      ) : (
        <>
          {note && <span className="stat-card__note">{note}</span>}
          <span className="stat-card__value">{display}{suffix}</span>
          <span className="stat-card__label">{icon} {label}</span>
        </>
      )}
      {showTooltip && (
        <div className="stat-card__tooltip">{tooltip}</div>
      )}
    </div>
  )
}

export function StatsGrid({ stats, grimReport }: { stats: ExhumeStats; grimReport?: GrimReport }) {
  const topDomain = stats.topDomain
  const topCategory = stats.topCategories?.[0]
  const realmName = topCategory
    ? NECROPOLIS_REGIONS.find(r => r.id === topCategory.id)?.name ?? topCategory.label
    : '—'

  const defs: StatDef[] = [
    { label: 'Graves Dug', icon: ICONS.tab, value: stats.totalTabs, suffix: '', tooltip: 'Total number of browser tabs exhumed from your browsing history.' },
    { label: 'Bloodlines Buried', icon: ICONS.globe, value: stats.uniqueDomains, suffix: '', tooltip: 'Unique websites you visited — each domain is a distinct bloodline.' },
    { label: 'Restless Spirits', icon: ICONS.search, value: stats.unresolvedSearches, suffix: '', tooltip: 'Searches you started but never followed through on — questions left unanswered.' },
    {
      label: 'Dominant Realm',
      icon: ICONS.realm,
      value: topCategory?.count ?? 0,
      suffix: ' graves',
      note: realmName,
      variant: 'domain',
      tooltip: 'The category of websites you visited most — your ruling domain in the digital afterlife.',
    },
    {
      label: 'Your Popular Haunts',
      icon: ICONS.crown,
      value: topDomain?.count ?? 0,
      suffix: ' graves dug',
      note: topDomain?.domain ?? '—',
      variant: 'domain',
      tooltip: 'The single website you returned to most — your favourite haunt.',
    },
  ]

  if (grimReport && grimReport.stalePct > 0) {
    defs.push({
      label: 'The Rot',
      icon: ICONS.skull,
      value: grimReport.stalePct,
      suffix: '%',
      tooltip: 'Percentage of your tabs that are probably already dead — news, social, and shopping pages that decay by the hour.',
    })
  }

  return (
    <div className="overview__stats">
      {defs.map((def) => (
        <StatCard key={def.label} {...def} />
      ))}
    </div>
  )
}

