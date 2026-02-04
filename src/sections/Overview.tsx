import { useState, useEffect, useRef } from 'react'
import { ShareCard } from '../components/ShareCard'
import './sections.css'

/* ── static data (scorer wires this up in a later phase) ── */
interface StatDef {
  label:  string
  value:  number
  suffix: string
  note?:  string
}

const STATS: StatDef[] = [
  { label: 'Total Tabs',     value: 689, suffix: ''  },
  { label: 'Unique Domains', value: 500, suffix: '+' },
  { label: 'Browsers',       value: 2,   suffix: ''  },
  { label: 'Top Domain',     value: 44,  suffix: '', note: 'Medium' },
]

const PERSONALITY = {
  archetype:   'The Resurrectionist',
  volume:      'of the Horde',
  description: 'Every tab is a tool. Nothing open without reason. '
             + 'A workspace of design, portfolios, and purpose — '
             + 'scout activity high, depth earned.',
}

/* ── useCountUp: animates an integer 0 → target ── */
function useCountUp(target: number, duration = 1200) {
  const [count, setCount]   = useState(0)
  const startRef            = useRef<number | null>(null)
  const rafRef              = useRef<number>(0)

  const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (reducedMotion) {
      setCount(target)
      return
    }

    startRef.current = null   // reset on mount / strict-mode re-invoke

    function tick(now: number) {
      if (startRef.current === null) startRef.current = now
      const t     = Math.min((now - startRef.current) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)           // cubic ease-out
      setCount(Math.round(eased * target))
      if (t < 1) rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [target, duration, reducedMotion])

  return count
}

/* ── StatCard ── */
function StatCard({ label, value, suffix, note }: StatDef) {
  const display = useCountUp(value)

  return (
    <div className="stat-card">
      {note && <span className="stat-card__note">{note}</span>}
      <span className="stat-card__value">{display}{suffix}</span>
      <span className="stat-card__label">{label}</span>
    </div>
  )
}

/* ── Overview section ── */
export function Overview() {
  const [showShareCard, setShowShareCard] = useState(false)

  return (
    <section className="section section--overview">
      <div className="section__inner">
        <h2 className="section__heading">The Dead</h2>

        {/* stats row */}
        <div className="overview__stats">
          {STATS.map(s => <StatCard key={s.label} {...s} />)}
        </div>

        {/* personality reveal */}
        <div className="personality-card">
          <img
            className="personality-card__image"
            src="/personality-placeholder.svg"
            alt="Archetype portrait — placeholder"
          />
          <div className="personality-card__body">
            <span className="personality-card__volume">{PERSONALITY.volume}</span>
            <h3 className="personality-card__name">{PERSONALITY.archetype}</h3>
            <p className="personality-card__desc">{PERSONALITY.description}</p>
          </div>
        </div>

        {/* share button */}
        <button
          className="overview__share-btn"
          onClick={() => setShowShareCard(true)}
        >
          Share Your Results
        </button>
      </div>

      {/* share card modal */}
      {showShareCard && (
        <ShareCard onClose={() => setShowShareCard(false)} />
      )}
    </section>
  )
}
