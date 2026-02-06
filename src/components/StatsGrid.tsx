import { useEffect, useRef, useState } from 'react'
import type { ExhumeStats } from '../data/tabsAnalysis'

interface StatDef {
  label: string
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

function StatCard({ label, value, suffix, note, variant }: StatDef) {
  const display = useCountUp(value)

  return (
    <div className={`stat-card${variant === 'domain' ? ' stat-card--domain' : ''}`}>
      {variant === 'domain' ? (
        <>
          <span className="stat-card__kicker">{label}</span>
          {note && <span className="stat-card__domain">{note}</span>}
          <span className="stat-card__count">{display}{suffix}</span>
        </>
      ) : (
        <>
          {note && <span className="stat-card__note">{note}</span>}
          <span className="stat-card__value">{display}{suffix}</span>
          <span className="stat-card__label">{label}</span>
        </>
      )}
    </div>
  )
}

export function StatsGrid({ stats }: { stats: ExhumeStats }) {
  const topDomain = stats.topDomain

  const defs: StatDef[] = [
    { label: 'Total Tabs', value: stats.totalTabs, suffix: '' },
    { label: 'Unique Domains', value: stats.uniqueDomains, suffix: '' },
    { label: 'Haunts (3+)', value: stats.repeatDomains, suffix: '' },
    { label: 'Unresolved Searches', value: stats.unresolvedSearches, suffix: '' },
    { label: 'Mapped Locations', value: stats.mappedLocations, suffix: '' },
    {
      label: 'Most Popular Domain',
      value: topDomain?.count ?? 0,
      suffix: ' tabs',
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

