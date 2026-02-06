import { ShareCard } from '../components/ShareCard'
import type { ExhumeStats, PersonalityProfile } from '../data/tabsAnalysis'
import './sections.css'

interface ShareProps {
  profile: PersonalityProfile
  stats: ExhumeStats
}

export function Share({ profile, stats }: ShareProps) {
  return <ShareCard profile={profile} stats={stats} />
}
