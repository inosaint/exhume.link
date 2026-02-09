import { ShareCard } from '../components/ShareCard'
import { TradingCard3D } from '../components/TradingCard3D'
import type { ExhumeStats, PersonalityProfile } from '../data/tabsAnalysis'
import './sections.css'

interface ShareProps {
  profile: PersonalityProfile
  stats: ExhumeStats
}

export function Share({ profile, stats }: ShareProps) {
  return (
    <div className="share-section">
      <div className="share-section__content">
        <h2 className="share-section__title">Your Archetype</h2>

        <TradingCard3D profile={profile} stats={stats} />
      </div>

      <ShareCard profile={profile} stats={stats} />
    </div>
  )
}
