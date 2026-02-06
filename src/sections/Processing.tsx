import { useEffect, useRef } from 'react'
import './sections.css'

const DEFAULT_LINES = [
  'Unearthing your digital remains…',
  'Cross-referencing the dead…',
  'Preparing the resurrection…',
]

const ADVANCE_PAUSE = 1200 // ms after last line before auto-advancing

interface ProcessingProps {
  onNext: () => void
  lines?: string[]
  activeIndex?: number
  isReadyToAdvance?: boolean
}

export function Processing({
  onNext,
  lines = DEFAULT_LINES,
  activeIndex = 0,
  isReadyToAdvance = true,
}: ProcessingProps) {
  const onNextRef = useRef(onNext)

  useEffect(() => {
    onNextRef.current = onNext
  }, [onNext])

  const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (reducedMotion) return
    if (!isReadyToAdvance) return
    if (activeIndex < lines.length - 1) return

    const timer = setTimeout(() => onNextRef.current(), ADVANCE_PAUSE)
    return () => clearTimeout(timer)
  }, [reducedMotion, isReadyToAdvance, activeIndex, lines.length])

  const displayCount = Math.min(activeIndex + 1, lines.length)

  return (
    <section className="section section--processing">
      <div className="section__inner">
        <div className="processing__lines" role="status" aria-live="polite">
          {lines.map((line, i) => (
            <p
              key={i}
              className={`processing__line${i < displayCount ? ' visible' : ''}${i === activeIndex ? ' processing__line--active' : ''}`}
            >
              {line}
            </p>
          ))}
        </div>

        {reducedMotion && (
          <button
            className="landing__cta"
            type="button"
            onClick={onNext}
            disabled={!isReadyToAdvance}
          >
            {isReadyToAdvance ? 'Continue →' : 'Unearthing…'}
          </button>
        )}
      </div>
    </section>
  )
}
