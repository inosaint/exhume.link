import { useEffect, useRef, useState, type ReactNode } from 'react'
import type { ExhumeStats } from '../data/tabsAnalysis'
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
} as const

interface StatDef {
  label: string
  icon: ReactNode
  value: number
  suffix: string
  note?: string
  variant?: 'domain'
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

function StatCard({ label, icon, value, suffix, note, variant }: StatDef) {
  const display = useCountUp(value)

  return (
    <div className={`stat-card${variant === 'domain' ? ' stat-card--domain' : ''}`}>
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
    </div>
  )
}

export function StatsGrid({ stats }: { stats: ExhumeStats }) {
  const topDomain = stats.topDomain
  const topCategory = stats.topCategories?.[0]
  const realmName = topCategory
    ? NECROPOLIS_REGIONS.find(r => r.id === topCategory.id)?.name ?? topCategory.label
    : '—'

  const defs: StatDef[] = [
    { label: 'Graves Dug', icon: ICONS.tab, value: stats.totalTabs, suffix: '' },
    { label: 'Bloodlines Buried', icon: ICONS.globe, value: stats.uniqueDomains, suffix: '' },
    { label: 'Restless Spirits', icon: ICONS.search, value: stats.unresolvedSearches, suffix: '' },
    {
      label: 'Dominant Realm',
      icon: ICONS.realm,
      value: topCategory?.count ?? 0,
      suffix: ' graves',
      note: realmName,
      variant: 'domain',
    },
    {
      label: 'Your Popular Haunts',
      icon: ICONS.crown,
      value: topDomain?.count ?? 0,
      suffix: ' graves dug',
      note: topDomain?.domain ?? '—',
      variant: 'domain',
    },
  ]

  return (
    <div className="overview__stats">
      {defs.map((def) => (
        <StatCard key={def.label} {...def} />
      ))}
    </div>
  )
}

