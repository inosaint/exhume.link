import { PersonalityCard } from '../components/PersonalityCard'
import type { PersonalityProfile } from '../data/tabsAnalysis'
import './sections.css'

interface PersonalityProps {
  profile: PersonalityProfile
  onNext: () => void
}

export function Personality({ profile, onNext }: PersonalityProps) {
  return (
    <section className="section section--personality">
      <div className="section__inner">
        <PersonalityCard profile={profile} />

        <button className="landing__cta" type="button" onClick={onNext}>
          Dig Deeper →
        </button>
      </div>
    </section>
  )
}
