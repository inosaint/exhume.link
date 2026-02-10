import { useEffect, useRef, useState, useCallback } from 'react'
import './sections.css'

const DEFAULT_LINES = [
  'Unearthing your digital remains…',
  'Cross-referencing the dead…',
  'Preparing the resurrection…',
]

/** Minimum lines revealed before we auto-advance */
const MIN_LINES_BEFORE_ADVANCE = 3

/** Pause after minimum lines are shown before auto-advancing (ms) */
const ADVANCE_PAUSE = 500

/** Audio file path */
const DIG_AUDIO_SRC = '/freesound_community-digging-with-shovel-63069.mp3'

/**
 * Volume threshold to detect a "dig" impact.
 * The analyser returns RMS energy 0–1; shovel impacts spike well above ambient.
 */
const DIG_THRESHOLD = 0.12

/** Minimum ms between two detected digs (debounce) */
const DIG_COOLDOWN = 800

interface ProcessingProps {
  onNext: () => void
  lines?: string[]
  activeIndex?: number
  isReadyToAdvance?: boolean
}

export function Processing({
  onNext,
  lines = DEFAULT_LINES,
  isReadyToAdvance = true,
}: ProcessingProps) {
  const onNextRef = useRef(onNext)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const ctxRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const rafRef = useRef<number>(0)
  const lastDigRef = useRef(0)
  const [visibleCount, setVisibleCount] = useState(0)
  const visibleRef = useRef(0)

  useEffect(() => {
    onNextRef.current = onNext
  }, [onNext])

  const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Detect digs via Web Audio API analyser
  const detectDigs = useCallback((totalLines: number) => {
    const analyser = analyserRef.current
    if (!analyser) return

    const data = new Uint8Array(analyser.fftSize)

    function tick() {
      const a = analyserRef.current
      if (!a) return
      a.getByteTimeDomainData(data)

      // Compute RMS energy
      let sum = 0
      for (let i = 0; i < data.length; i++) {
        const v = (data[i] - 128) / 128
        sum += v * v
      }
      const rms = Math.sqrt(sum / data.length)

      const now = performance.now()
      if (
        rms > DIG_THRESHOLD &&
        now - lastDigRef.current > DIG_COOLDOWN &&
        visibleRef.current < totalLines
      ) {
        lastDigRef.current = now
        visibleRef.current++
        setVisibleCount(visibleRef.current)
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
  }, [])

  // Timed fallback when audio analysis isn't available
  const timedFallbackRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const timedFallback = useCallback((totalLines: number) => {
    let current = visibleRef.current
    timedFallbackRef.current = setInterval(() => {
      current++
      visibleRef.current = current
      setVisibleCount(current)
      if (current >= totalLines && timedFallbackRef.current) {
        clearInterval(timedFallbackRef.current)
      }
    }, 1800)
  }, [])

  // Start audio + analyser on mount, hard stop on unmount
  useEffect(() => {
    if (reducedMotion) {
      setVisibleCount(lines.length)
      return
    }

    const audio = new Audio(DIG_AUDIO_SRC)
    audio.loop = true
    audio.volume = 0.4
    audioRef.current = audio

    // Set up Web Audio analyser
    const ctx = new AudioContext()
    const source = ctx.createMediaElementSource(audio)
    const analyser = ctx.createAnalyser()
    analyser.fftSize = 512
    source.connect(analyser)
    analyser.connect(ctx.destination)
    ctxRef.current = ctx
    analyserRef.current = analyser

    audio.play()
      .then(() => {
        // Chrome autoplay policy: audio.play() can resolve but AudioContext
        // stays suspended without a user gesture. In that case the analyser
        // returns silence and digs are never detected — fall back to timed.
        if (ctx.state === 'suspended') {
          ctx.resume().catch(() => {})
          // Give it a moment — if still suspended, fall back
          setTimeout(() => {
            if (ctxRef.current?.state === 'suspended') {
              timedFallback(lines.length)
            } else {
              detectDigs(lines.length)
            }
          }, 200)
        } else {
          detectDigs(lines.length)
        }
      })
      .catch(() => {
        // Autoplay blocked — fall back to timed reveals
        timedFallback(lines.length)
      })

    return () => {
      // Hard stop on unmount
      cancelAnimationFrame(rafRef.current)
      if (timedFallbackRef.current) clearInterval(timedFallbackRef.current)
      audio.pause()
      audio.currentTime = 0
      audioRef.current = null
      analyserRef.current = null
      ctx.close().catch(() => {})
      ctxRef.current = null
    }
  }, [lines.length, reducedMotion, detectDigs, timedFallback])

  // Auto-advance once analysis is done AND at least 3 lines are visible
  useEffect(() => {
    if (reducedMotion) return
    if (!isReadyToAdvance) return
    if (visibleCount < MIN_LINES_BEFORE_ADVANCE) return

    const timer = setTimeout(() => onNextRef.current(), ADVANCE_PAUSE)
    return () => clearTimeout(timer)
  }, [reducedMotion, isReadyToAdvance, visibleCount])

  return (
    <section className="section section--processing">
      <div className="section__inner">
        <div className="processing__lines" role="status" aria-live="polite">
          {lines.map((line, i) => {
            const isVisible = i < visibleCount
            const isLatest = i === visibleCount - 1
            return (
              <p
                key={i}
                className={`processing__line${isVisible ? ' visible' : ''}${isLatest ? ' processing__line--active' : ''}`}
              >
                {line}
              </p>
            )
          })}
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
