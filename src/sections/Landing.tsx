import './sections.css'

interface LandingProps {
  onNext: () => void
}

export function Landing({ onNext }: LandingProps) {
  return (
    <section className="section section--landing">
      <div className="section__inner">
        <h1 className="landing__title">exhume.link</h1>
        <p className="landing__tagline">
          Your tabs have been buried.<br />
          It's time to dig them up.
        </p>
        <button className="landing__cta" onClick={onNext}>
          Begin the Exhumation
        </button>
      </div>
    </section>
  )
}
