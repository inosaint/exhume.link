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
    if (!analyser) {
      console.log('[UNEARTH] detectDigs called but analyser is null')
      return
    }

    console.log('[UNEARTH] Starting dig detection loop, totalLines:', totalLines)
    const data = new Uint8Array(analyser.fftSize)
    let tickCount = 0

    function tick() {
      const a = analyserRef.current
      if (!a) {
        console.log('[UNEARTH] analyser lost in tick loop')
        return
      }
      a.getByteTimeDomainData(data)

      // Compute RMS energy
      let sum = 0
      for (let i = 0; i < data.length; i++) {
        const v = (data[i] - 128) / 128
        sum += v * v
      }
      const rms = Math.sqrt(sum / data.length)

      // Log every 30 ticks (~500ms) for debugging
      tickCount++
      if (tickCount % 30 === 0) {
        console.log(`[UNEARTH] RMS: ${rms.toFixed(4)}, threshold: ${DIG_THRESHOLD}, visible: ${visibleRef.current}/${totalLines}, audioCtx state: ${ctxRef.current?.state}`)
      }

      const now = performance.now()
      if (
        rms > DIG_THRESHOLD &&
        now - lastDigRef.current > DIG_COOLDOWN &&
        visibleRef.current < totalLines
      ) {
        lastDigRef.current = now
        visibleRef.current++
        setVisibleCount(visibleRef.current)
        console.log(`[UNEARTH] 🎵 DIG DETECTED! RMS: ${rms.toFixed(4)}, revealing line ${visibleRef.current}/${totalLines}`)
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
  }, [])

  // Timed fallback when audio analysis isn't available
  const timedFallbackRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const timedFallback = useCallback((totalLines: number) => {
    console.log('[UNEARTH] ⏱️  Using TIMED FALLBACK mode, starting at line', visibleRef.current)
    let current = visibleRef.current
    timedFallbackRef.current = setInterval(() => {
      current++
      visibleRef.current = current
      setVisibleCount(current)
      console.log(`[UNEARTH] ⏱️  Timed reveal: line ${current}/${totalLines}`)
      if (current >= totalLines && timedFallbackRef.current) {
        clearInterval(timedFallbackRef.current)
        console.log('[UNEARTH] ⏱️  Timed fallback complete')
      }
    }, 1800)
  }, [])

  // Start audio + analyser on mount, hard stop on unmount
  useEffect(() => {
    console.log('[UNEARTH] 🚀 Processing component mounted, lines:', lines.length)
    if (reducedMotion) {
      console.log('[UNEARTH] Reduced motion detected, showing all lines immediately')
      setVisibleCount(lines.length)
      return
    }

    const audio = new Audio(DIG_AUDIO_SRC)
    audio.loop = true
    audio.volume = 0.4
    audioRef.current = audio
    console.log('[UNEARTH] Audio element created, src:', DIG_AUDIO_SRC)

    // Set up Web Audio analyser
    const ctx = new AudioContext()
    const source = ctx.createMediaElementSource(audio)
    const analyser = ctx.createAnalyser()
    analyser.fftSize = 512
    source.connect(analyser)
    analyser.connect(ctx.destination)
    ctxRef.current = ctx
    analyserRef.current = analyser
    console.log('[UNEARTH] AudioContext created, initial state:', ctx.state)

    console.log('[UNEARTH] Starting audio playback...')
    audio.play()
      .then(() => {
        console.log('[UNEARTH] ✅ audio.play() resolved, AudioContext state:', ctx.state)
        // Chrome autoplay policy: audio.play() can resolve but AudioContext
        // stays suspended without a user gesture. In that case the analyser
        // returns silence and digs are never detected — fall back to timed.
        if (ctx.state === 'suspended') {
          console.log('[UNEARTH] ⚠️  AudioContext is SUSPENDED, attempting resume...')
          ctx.resume()
            .then(() => console.log('[UNEARTH] ctx.resume() resolved, new state:', ctx.state))
            .catch((err) => console.error('[UNEARTH] ctx.resume() failed:', err))
          // Give it a moment — if still suspended, fall back
          setTimeout(() => {
            const currentState = ctxRef.current?.state
            console.log('[UNEARTH] After 200ms wait, AudioContext state:', currentState)
            if (currentState === 'suspended') {
              console.log('[UNEARTH] ❌ Still suspended after resume attempt, using timed fallback')
              timedFallback(lines.length)
            } else {
              console.log('[UNEARTH] ✅ AudioContext running, using dig detection')
              detectDigs(lines.length)
            }
          }, 200)
        } else {
          console.log('[UNEARTH] ✅ AudioContext already running, using dig detection')
          detectDigs(lines.length)
        }
      })
      .catch((err) => {
        // Autoplay blocked — fall back to timed reveals
        console.log('[UNEARTH] ❌ audio.play() rejected:', err, '- using timed fallback')
        timedFallback(lines.length)
      })

    return () => {
      // Hard stop on unmount
      console.log('[UNEARTH] 🛑 Cleanup: stopping audio and closing AudioContext')
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
    if (!isReadyToAdvance) {
      console.log('[UNEARTH] Not ready to advance yet')
      return
    }
    if (visibleCount < MIN_LINES_BEFORE_ADVANCE) {
      console.log(`[UNEARTH] Waiting for minimum lines: ${visibleCount}/${MIN_LINES_BEFORE_ADVANCE}`)
      return
    }

    console.log(`[UNEARTH] ✅ Auto-advance triggered! visibleCount: ${visibleCount}, advancing in ${ADVANCE_PAUSE}ms`)
    const timer = setTimeout(() => {
      console.log('[UNEARTH] 🚀 Advancing to next section')
      onNextRef.current()
    }, ADVANCE_PAUSE)
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
