import './sections.css'

interface ProcessingProps {
  onNext: () => void
}

export function Processing({ onNext }: ProcessingProps) {
  return (
    <section className="section section--processing">
      <div className="section__inner">
        <h2 className="processing__title">Preparing the remains…</h2>
        <p className="processing__placeholder">
          (Processing animation will live here — Phase 2)
        </p>
        <button className="processing__skip" onClick={onNext}>
          Continue →
        </button>
      </div>
    </section>
  )
}
