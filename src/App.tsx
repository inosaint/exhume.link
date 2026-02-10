import { useMemo, useState, useCallback, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Agentation } from 'agentation'
import { type FlowVariant, type SectionId, SECTIONS_A, SECTIONS_B, SECTIONS_C } from './sections/config'
import { analyzeInputToSession, extractUrlsFromText, type ExhumeSession } from './data/tabsAnalysis'
import SAMPLE_TABS from '../browserdata/all_tabs_clean.txt?raw'
import { Landing } from './sections/Landing'
import { Processing } from './sections/Processing'
import { Personality } from './sections/Personality'
import { Numbers } from './sections/Numbers'
import { Cemetery } from './sections/Cemetery'
import { WorldMap } from './sections/WorldMap'
import { NecropolisMap } from './sections/NecropolisMap'
import { HexMap } from './sections/HexMap'
import { GrimReport } from './sections/GrimReport'
import { Share } from './sections/Share'
import { posthog } from './lib/posthog'
import './App.css'

const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

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

const PHASE_TITLES: Partial<Record<SectionId, string>> = {
  landing: 'Surface Rite',
  processing: 'Unearthing',
  personality: 'The Verdict',
  numbers: 'Ledger Reading',
  cemetery: 'Cemetery Assembly',
  worldmap: 'Territory Alignment',
  hexmap: 'Territory Alignment',
  grimreport: 'Bone Reading',
  share: 'Archetype Binding',
}

function resolveFlowVariant(): FlowVariant {
  if (typeof window === 'undefined') return 'a'

  const params = new URLSearchParams(window.location.search)
  const fromUrl = params.get('flow')
  if (fromUrl === 'a' || fromUrl === 'b' || fromUrl === 'c') {
    window.localStorage.setItem('exhume.flow', fromUrl)
    return fromUrl
  }

  // Default to flow A for now (still overridable via `?flow=b` or `?flow=c`).
  window.localStorage.setItem('exhume.flow', 'a')
  return 'a'
}

export default function App() {
  const [flow] = useState<FlowVariant>(() => resolveFlowVariant())
  const [currentSection, setCurrentSection] = useState<SectionId>('landing')
  const [analysisStatus, setAnalysisStatus] = useState<AnalysisStatus>('idle')
  const [analysisStepIndex, setAnalysisStepIndex] = useState(0)
  const [analysisError, setAnalysisError] = useState<string | null>(null)
  const [session, setSession] = useState<ExhumeSession | null>(null)

  const isUnburdened = session?.personality.archetype === 'unburdened'
  const sections = useMemo(() => {
    const base = flow === 'c' ? SECTIONS_C : flow === 'b' ? SECTIONS_B : SECTIONS_A
    if (!isUnburdened) return base
    // Unburdened: skip analysis sections — verdict straight to share
    return base.filter(s =>
      s.id === 'landing' || s.id === 'processing' || s.id === 'personality' || s.id === 'share'
    )
  }, [flow, isUnburdened])

  // Track section changes for funnel analysis
  useEffect(() => {
    if (currentSection !== 'processing') {
      posthog.capture('$pageview', {
        section: currentSection,
        phase_title: PHASE_TITLES[currentSection],
        flow_variant: flow,
      })
    }
  }, [currentSection, flow])

  // Track archetype generation when session is created
  useEffect(() => {
    if (session) {
      posthog.capture('archetype_generated', {
        archetype: session.personality.archetype,
        archetype_title: session.personality.title,
        total_tabs: session.stats.totalTabs,
        unique_domains: session.stats.uniqueDomains,
        flow_variant: flow,
      })
    }
  }, [session, flow])

  const currentIndex = Math.max(0, sections.findIndex(s => s.id === currentSection))
  const isShareSection = currentSection === 'share'
  const isReady = analysisStatus === 'done' && session !== null
  const phaseTitle = PHASE_TITLES[currentSection] ?? sections[currentIndex]?.label ?? 'Ritual Phase'

  const goTo = useCallback((id: SectionId) => {
    if (id === 'processing') return
    const canNavigate = id === 'landing' || isReady
    if (!canNavigate) return
    setCurrentSection(id)
  }, [isReady])

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
    currentSection === 'personality' ||
    currentSection === 'numbers' ||
    currentSection === 'cemetery' ||
    currentSection === 'worldmap' ||
    currentSection === 'hexmap' ||
    currentSection === 'grimreport' ||
    currentSection === 'share'

  return (
    <div className={`app app--${currentSection}`}>
      {/* ── Progress rail ── */}
      <nav className="progress-rail" aria-label="Sections">
        <div className="progress-rail__phase">
          <span className="progress-rail__phase-count">Phase {currentIndex + 1} of {sections.length}</span>
          <span className="progress-rail__phase-label">· {phaseTitle}</span>
        </div>
        <div className="progress-rail__dots">
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
              type="button"
            >
              <span className="rail-dot__inner" />
            </button>
          )})}
        </div>
      </nav>

      {/* ── Active section ── */}
      <main className="section-viewport">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSection}
            className="section-slide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0.15 : 0.35, ease: 'easeInOut' }}
          >
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
              <Personality report={session.grimReport} />
            )}

            {currentSection === 'numbers' && session && (
              <Numbers stats={session.stats} grimReport={session.grimReport} />
            )}

            {currentSection === 'cemetery' && session && (
              <Cemetery groups={session.categoryGroups} />
            )}

            {currentSection === 'worldmap' && session && (
              flow === 'b' ? (
                <WorldMap
                  locations={session.locations}
                  tabs={session.tabs}
                  title="The Web"
                  subtitle="A spiderweb of the domains we could map. The rest remain unmarked."
                  mode="web"
                />
              ) : (
                <NecropolisMap groups={session.categoryGroups} />
              )
            )}

            {currentSection === 'hexmap' && session && (
              <HexMap groups={session.categoryGroups} />
            )}

            {currentSection === 'grimreport' && session && (
              <GrimReport report={session.grimReport} />
            )}

            {currentSection === 'share' && session && (
              <Share profile={session.personality} stats={session.stats} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ── Nav footer (single centered button) ── */}
      {showFooter && (
        <footer className="nav-footer">
          <button
            className={`nav-footer__cta${isShareSection ? ' nav-footer__cta--share' : ''}`}
            onClick={handlePrimary}
            disabled={!isShareSection && currentIndex === sections.length - 1}
            aria-label={isShareSection ? 'Share with your cult' : 'Next section'}
          >
            {isShareSection
              ? 'Share with Your Cult'
              : currentSection === 'personality'
                ? (isUnburdened ? 'Bind Your Archetype ↓' : 'Dig Deeper ↓')
                : currentSection === 'numbers'
                  ? 'Visit Your Tab Cemetery ↓'
                  : currentSection === 'cemetery'
                    ? (flow === 'c' ? 'Enter the Hex ↓' : flow === 'a' ? 'Bind Your Archetype ↓' : 'Visit the Global Dead ↓')
                    : currentSection === 'grimreport'
                      ? 'Prepare the Rite ↓'
                      : currentSection === 'worldmap' || currentSection === 'hexmap'
                        ? 'Prepare the Rite ↓'
                        : 'Continue ↓'}
          </button>
        </footer>
      )}

      {import.meta.env.DEV && (
        <Agentation endpoint="http://localhost:4747" />
      )}
    </div>
  )
}
