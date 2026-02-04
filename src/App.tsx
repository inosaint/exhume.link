import { useState, useCallback } from 'react'
import { type SectionId, SECTIONS } from './sections/config'
import { Landing }    from './sections/Landing'
import { Processing } from './sections/Processing'
import { Overview }   from './sections/Overview'
import { Cemetery }   from './sections/Cemetery'
import { WorldMap }   from './sections/WorldMap'
import './App.css'

export default function App() {
  const [currentSection, setCurrentSection] = useState<SectionId>('landing')

  const currentIndex = SECTIONS.findIndex(s => s.id === currentSection)

  const goTo = useCallback((id: SectionId) => {
    setCurrentSection(id)
  }, [])

  const prev = useCallback(() => {
    if (currentIndex > 0) setCurrentSection(SECTIONS[currentIndex - 1].id)
  }, [currentIndex])

  const next = useCallback(() => {
    if (currentIndex < SECTIONS.length - 1) setCurrentSection(SECTIONS[currentIndex + 1].id)
  }, [currentIndex])

  return (
    <div className="app">
      {/* ── Progress rail ── */}
      <nav className="progress-rail" aria-label="Sections">
        {SECTIONS.map((section, i) => (
          <button
            key={section.id}
            className={`rail-dot ${currentSection === section.id ? 'active' : ''}`}
            onClick={() => goTo(section.id)}
            aria-label={section.label}
            aria-current={currentSection === section.id ? 'step' : undefined}
          >
            <span className="rail-dot__inner" />
            <span className="rail-dot__label">{section.label}</span>
          </button>
        ))}
      </nav>

      {/* ── Active section ── */}
      <main className="section-viewport">
        {currentSection === 'landing'    && <Landing   onNext={next} />}
        {currentSection === 'processing' && <Processing onNext={next} />}
        {currentSection === 'overview'   && <Overview  />}
        {currentSection === 'cemetery'   && <Cemetery  />}
        {currentSection === 'worldmap'   && <WorldMap  />}
      </main>

      {/* ── Prev / Next nav ── */}
      <footer className="nav-footer">
        <button
          className="nav-btn nav-btn--prev"
          onClick={prev}
          disabled={currentIndex === 0}
          aria-label="Previous section"
        >
          ← Back
        </button>
        <span className="nav-footer__counter">
          {currentIndex + 1} / {SECTIONS.length}
        </span>
        <button
          className="nav-btn nav-btn--next"
          onClick={next}
          disabled={currentIndex === SECTIONS.length - 1}
          aria-label="Next section"
        >
          Continue →
        </button>
      </footer>
    </div>
  )
}
