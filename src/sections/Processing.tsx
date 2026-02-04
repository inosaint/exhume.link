import { useState, useEffect, useRef } from 'react'
import './sections.css'

const LINES = [
  'Unearthing your digital remains…',
  'Cross-referencing the dead…',
  'Preparing the resurrection…',
]

const INITIAL_DELAY  = 200   // ms before first line appears
const LINE_GAP       = 600   // ms between each subsequent line
const ADVANCE_PAUSE  = 2000  // ms after last line before auto-advancing

interface ProcessingProps {
  onNext: () => void
}

export function Processing({ onNext }: ProcessingProps) {
  const [visibleCount, setVisibleCount] = useState(0)
  const onNextRef = useRef(onNext)
  onNextRef.current = onNext

  const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (reducedMotion) {
      setVisibleCount(LINES.length)
      return
    }

    const timers: ReturnType<typeof setTimeout>[] = []

    LINES.forEach((_, i) => {
      timers.push(
        setTimeout(() => setVisibleCount(i + 1), INITIAL_DELAY + LINE_GAP * i)
      )
    })

    const lastLineTime = INITIAL_DELAY + LINE_GAP * (LINES.length - 1)
    timers.push(
      setTimeout(() => onNextRef.current(), lastLineTime + ADVANCE_PAUSE)
    )

    return () => timers.forEach(clearTimeout)
  }, [reducedMotion])

  return (
    <section className="section section--processing">
      <div className="section__inner">
        <div className="processing__lines" role="status" aria-live="polite">
          {LINES.map((line, i) => (
            <p
              key={i}
              className={`processing__line${i < visibleCount ? ' visible' : ''}`}
            >
              {line}
            </p>
          ))}
        </div>

        <button className="processing__skip" onClick={onNext}>
          {reducedMotion ? 'Continue →' : 'Skip →'}
        </button>
      </div>
    </section>
  )
}
