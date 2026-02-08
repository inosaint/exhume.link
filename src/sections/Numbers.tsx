import { StatsGrid } from '../components/StatsGrid'
import type { ExhumeStats } from '../data/tabsAnalysis'
import './sections.css'

interface NumbersProps {
  stats: ExhumeStats
}

export function Numbers({ stats }: NumbersProps) {
  return (
    <section className="section section--numbers">
      <div className="section__inner">
        <h2 className="section__heading">Ledger of Your Sins</h2>
        <p className="section__placeholder">
          The counts don't lie. They just… linger.
        </p>

        <div className="numbers__stats">
          <StatsGrid stats={stats} />
        </div>
      </div>
    </section>
  )
}
