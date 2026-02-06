import type { PersonalityProfile } from '../data/tabsAnalysis'

export function PersonalityCard({ profile }: { profile: PersonalityProfile }) {
  return (
    <div className="personality-card">
      <img
        className="personality-card__image"
        src={profile.image}
        alt={`Archetype portrait — ${profile.title}`}
      />
      <div className="personality-card__body">
        <h3 className="personality-card__name">{profile.title}</h3>
        <p className="personality-card__desc">{profile.description}</p>
      </div>
    </div>
  )
}
