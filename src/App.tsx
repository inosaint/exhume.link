import { useMemo, useState, useCallback } from 'react'
import { Agentation } from 'agentation'
import { type FlowVariant, type SectionId, SECTIONS_A, SECTIONS_B } from './sections/config'
import { analyzeInputToSession, extractUrlsFromText, type ExhumeSession } from './data/tabsAnalysis'
import SAMPLE_TABS from '../browserdata/all_tabs_clean.txt?raw'
import { Landing } from './sections/Landing'
import { Processing } from './sections/Processing'
import { Personality } from './sections/Personality'
import { Numbers } from './sections/Numbers'
import { Cemetery } from './sections/Cemetery'
import { WorldMap } from './sections/WorldMap'
import { NecropolisMap } from './sections/NecropolisMap'
import { Share } from './sections/Share'
import './App.css'

type AnalysisStatus = 'idle' | 'running' | 'done' | 'error'

const PROCESSING_LINES = [
  'Gathering the bones…',
  'Listening for links…',
  'Scraping rust from URLs…',
  'Counting the haunts…',
  'Sorting remains into plots…',
  'Pinning souls to the globe…',
  'Consulting the archetypes…',
]

function resolveFlowVariant(): FlowVariant {
  if (typeof window === 'undefined') return 'a'

  const params = new URLSearchParams(window.location.search)
  const fromUrl = params.get('flow')
  if (fromUrl === 'a' || fromUrl === 'b') {
    window.localStorage.setItem('exhume.flow', fromUrl)
    return fromUrl
  }

  // Default to flow A for now (still overridable via `?flow=b`).
  window.localStorage.setItem('exhume.flow', 'a')
  return 'a'
}

export default function App() {
  const [flow] = useState<FlowVariant>(() => resolveFlowVariant())
  const sections = useMemo(() => (flow === 'b' ? SECTIONS_B : SECTIONS_A), [flow])
  const [currentSection, setCurrentSection] = useState<SectionId>('landing')
  const [analysisStatus, setAnalysisStatus] = useState<AnalysisStatus>('idle')
  const [analysisStepIndex, setAnalysisStepIndex] = useState(0)
  const [analysisError, setAnalysisError] = useState<string | null>(null)
  const [session, setSession] = useState<ExhumeSession | null>(null)

  const currentIndex = Math.max(0, sections.findIndex(s => s.id === currentSection))
  const isShareSection = currentSection === 'share'
  const isReady = analysisStatus === 'done' && session !== null

  const goTo = useCallback((id: SectionId) => {
    if (id === 'processing') return
    const canNavigate = id === 'landing' || isReady
    if (!canNavigate) return
    setCurrentSection(id)
  }, [isReady])

  const prev = useCallback(() => {
    if (currentIndex > 0) setCurrentSection(sections[currentIndex - 1].id)
  }, [currentIndex, sections])

  const next = useCallback(() => {
    if (currentIndex < sections.length - 1) setCurrentSection(sections[currentIndex + 1].id)
  }, [currentIndex, sections])

  const handlePrimary = useCallback(() => {
    if (isShareSection) {
      window.dispatchEvent(new CustomEvent('share-card-request'))
      return
    }
    next()
  }, [isShareSection, next])

  const handleBegin = useCallback(async (input: { text: string; file: File | null }) => {
    if (analysisStatus === 'running') return

    setAnalysisError(null)
    setSession(null)
    setAnalysisStepIndex(0)
    setAnalysisStatus('running')

    try {
      const parts: string[] = []
      if (input.text.trim()) parts.push(input.text)
      if (input.file) parts.push(await input.file.text())
      const combined = parts.join('\n\n')

      const extractedCount = extractUrlsFromText(combined).length
      const stepDelayMs = extractedCount > 2000 ? 420 : extractedCount > 800 ? 320 : 260

      setCurrentSection('processing')

      const result = await analyzeInputToSession(combined, {
        onStep: setAnalysisStepIndex,
        stepDelayMs,
      })

      setSession(result)
      setAnalysisStatus('done')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to analyze input.'
      setAnalysisError(message)
      setAnalysisStatus('error')
      setCurrentSection('landing')
    }
  }, [analysisStatus])

  const showFooter =
    currentSection === 'cemetery' ||
    currentSection === 'worldmap' ||
    currentSection === 'share'

  return (
    <div className={`app app--${currentSection}`}>
      {/* ── Progress rail ── */}
      <nav className="progress-rail" aria-label="Sections">
        {sections.map((section) => {
          const disabled =
            section.id === 'processing' ||
            (section.id !== 'landing' && !isReady)

          return (
          <button
            key={section.id}
            className={`rail-dot ${currentSection === section.id ? 'active' : ''}${disabled ? ' rail-dot--disabled' : ''}`}
            onClick={() => goTo(section.id)}
            aria-label={section.label}
            aria-current={currentSection === section.id ? 'step' : undefined}
            disabled={disabled}
          >
            <span className="rail-dot__inner" />
            <span className="rail-dot__label">{section.label}</span>
          </button>
        )})}
      </nav>

      {/* ── Active section ── */}
      <main className="section-viewport">
        {currentSection === 'landing' && (
          <Landing
            isBusy={analysisStatus === 'running'}
            error={analysisError}
            sampleText={SAMPLE_TABS}
            onBegin={handleBegin}
          />
        )}
        {currentSection === 'processing' && (
          <Processing
            onNext={next}
            lines={PROCESSING_LINES}
            activeIndex={analysisStepIndex}
            isReadyToAdvance={analysisStatus === 'done'}
          />
        )}

        {currentSection === 'personality' && session && (
          <Personality profile={session.personality} onNext={next} />
        )}

        {currentSection === 'numbers' && session && (
          <Numbers stats={session.stats} onNext={next} />
        )}

        {currentSection === 'cemetery' && session && (
          <Cemetery groups={session.categoryGroups} />
        )}

        {currentSection === 'worldmap' && session && (
          flow === 'a' ? (
            <NecropolisMap groups={session.categoryGroups} />
          ) : (
            <WorldMap
              locations={session.locations}
              tabs={session.tabs}
              title="The Web"
              subtitle="A spiderweb of the domains we could map. The rest remain unmarked."
              mode="web"
            />
          )
        )}

        {currentSection === 'share' && session && (
          <Share profile={session.personality} stats={session.stats} />
        )}
      </main>

      {/* ── Prev / Next nav (results only) ── */}
      {showFooter && (
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
            {currentIndex + 1} / {sections.length}
          </span>
          <button
            className={`nav-btn nav-btn--next${isShareSection ? ' nav-btn--share' : ''}`}
            onClick={handlePrimary}
            disabled={!isShareSection && currentIndex === sections.length - 1}
            aria-label={isShareSection ? 'Share with your cult' : 'Next section'}
          >
            {isShareSection
              ? 'Share with Your Cult'
              : currentSection === 'cemetery'
                ? (flow === 'a' ? 'Enter the Necropolis →' : 'Visit the Global Dead →')
                : currentSection === 'worldmap'
                  ? 'Prepare the Rite →'
                  : 'Continue →'}
          </button>
        </footer>
      )}

      {import.meta.env.DEV && (
        <Agentation endpoint="http://localhost:4747" />
      )}
    </div>
  )
}
