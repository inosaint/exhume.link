import { StatsGrid } from '../components/StatsGrid'
import type { ExhumeStats } from '../data/tabsAnalysis'
import './sections.css'

interface NumbersProps {
  stats: ExhumeStats
  onNext: () => void
}

export function Numbers({ stats, onNext }: NumbersProps) {
  return (
    <section className="section section--numbers">
      <div className="section__inner">
        <h2 className="section__heading">The Ledger</h2>
        <p className="section__placeholder">
          The counts don’t lie. They just… linger.
        </p>

        <div className="numbers__stats">
          <StatsGrid stats={stats} />
        </div>

        <div className="numbers__cta">
          <button className="landing__cta" type="button" onClick={onNext}>
            Visit Your Tab Cemetery →
          </button>
        </div>
      </div>
    </section>
  )
}
