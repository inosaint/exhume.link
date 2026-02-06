import { PersonalityCard } from '../components/PersonalityCard'
import { StatsGrid } from '../components/StatsGrid'
import type { ExhumeStats, PersonalityProfile } from '../data/tabsAnalysis'
import './sections.css'

/* ── Overview section ── */
interface OverviewProps {
  profile: PersonalityProfile
  stats: ExhumeStats
}

export function Overview({ profile, stats }: OverviewProps) {
  return (
    <section className="section section--overview">
      <div className="section__inner">
        {/* personality reveal */}
        <PersonalityCard profile={profile} />

        {/* stats row */}
        <StatsGrid stats={stats} />
      </div>
    </section>
  )
}
