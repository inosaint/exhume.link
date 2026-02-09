import { StatsGrid } from '../components/StatsGrid'
import type { ExhumeStats, GrimReport } from '../data/tabsAnalysis'
import './sections.css'

interface NumbersProps {
  stats: ExhumeStats
  grimReport?: GrimReport
}

export function Numbers({ stats, grimReport }: NumbersProps) {
  return (
    <section className="section section--numbers">
      <div className="section__inner">
        <h2 className="section__heading">Ledger of Your Sins</h2>
        <p className="section__placeholder">
          Are you ready to ask for forgiveness?
        </p>

        <div className="numbers__stats">
          <StatsGrid stats={stats} grimReport={grimReport} />
        </div>
      </div>
    </section>
  )
}
