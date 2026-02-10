import { useState, useMemo } from 'react'
import './sections.css'

const URL_PATTERN = /https?:\/\/[^\s"'<>]+/i

interface LandingProps {
  isBusy: boolean
  error?: string | null
  sampleText?: string
  onBegin: (input: { text: string; file: File | null }) => void
}

export function Landing({ isBusy, error, sampleText, onBegin }: LandingProps) {
  const [text, setText] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [showPrivacy, setShowPrivacy] = useState(false)

  const hasUrl = useMemo(() => URL_PATTERN.test(text), [text])
  const canSubmit = hasUrl || !!file
  const isSubmitDisabled = isBusy || !canSubmit

  return (
    <section className="section section--landing">
      <div className="section__inner">
        <form
          className="surface__form"
          onSubmit={(e) => {
            e.preventDefault()
            if (isSubmitDisabled) return
            onBegin({ text, file })
          }}
        >
          <div className="tombstone">
            <h1 className="landing__title">exhume.link</h1>

            <p className="tombstone__epitaph">
              Here lies your dead browser tabs
              <br />
              Opened with hope
              <br />
              Never closed
              <br />
              Waiting to be read
            </p>

            <div className="surface__panel">
              <label className="surface__label" htmlFor="surface-urls">
                Paste URLs or choose a file (txt, csv)
              </label>
              <textarea
                id="surface-urls"
                className="surface__textarea"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste links here…"
                spellCheck={false}
                disabled={isBusy}
              />

              <div className="surface__row">
                <label className="surface__file">
                  <input
                    type="file"
                    accept=".csv,.txt"
                    onChange={(e) => {
                      const next = e.target.files?.[0] ?? null
                      setFile(next)
                    }}
                    disabled={isBusy}
                  />
                  <span className="surface__file-button">Choose file</span>
                </label>

                {sampleText && (
                  <button
                    type="button"
                    className="surface__sample"
                    onClick={() => {
                      setText(sampleText)
                      setFile(null)
                    }}
                    disabled={isBusy}
                  >
                    Test dataset
                  </button>
                )}
              </div>

              {file && (
                <p className="surface__meta">
                  File: <span className="surface__meta-value">{file.name}</span>
                </p>
              )}
            </div>
          </div>

          <button className="landing__cta" type="submit" disabled={isSubmitDisabled}>
            {isBusy ? 'Unearthing…' : 'Begin the Exhumation'}
          </button>

          <p className="surface__note">
            Analysis runs locally in your browser. No links are uploaded.
            <br />
            We collect anonymous analytics to improve the experience.{' '}
            <button
              type="button"
              className="surface__note-link"
              onClick={() => setShowPrivacy(true)}
            >
              Privacy policy
            </button>
          </p>
        </form>

        {showPrivacy && (
          <div className="privacy-modal" onClick={() => setShowPrivacy(false)}>
            <div className="privacy-modal__content" onClick={(e) => e.stopPropagation()}>
              <h2 className="privacy-modal__title">Privacy & Data Collection</h2>

              <div className="privacy-modal__body">
                <section>
                  <h3>What We Collect</h3>
                  <p>We collect anonymous analytics to improve the tool:</p>
                  <ul>
                    <li><strong>Usage analytics:</strong> Which sections you visit, navigation patterns</li>
                    <li><strong>Archetype results:</strong> The personality type generated</li>
                    <li><strong>Statistics:</strong> Tab counts and domain counts (no specific URLs)</li>
                    <li><strong>Device info:</strong> Mobile or desktop</li>
                    <li><strong>Location:</strong> Country of origin</li>
                  </ul>
                </section>

                <section>
                  <h3>What We Don't Collect</h3>
                  <ul>
                    <li><strong>Your URLs:</strong> Never recorded or sent to servers</li>
                    <li><strong>Personal information:</strong> No emails, names, or identifiers</li>
                    <li><strong>File contents:</strong> Processed locally, never uploaded</li>
                  </ul>
                </section>

                <section>
                  <h3>How It Works</h3>
                  <p>
                    All tab analysis happens <strong>in your browser</strong>. Your URLs and data
                    are processed locally and never uploaded. Only anonymous analytics events
                    (like "viewed personality section" or "archetype: collector") are sent to PostHog.
                  </p>
                </section>
              </div>

              <button
                className="privacy-modal__close"
                onClick={() => setShowPrivacy(false)}
                type="button"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="error-toast" role="alert">
            <div className="error-toast__drip" />
            <p className="error-toast__message">{error}</p>
          </div>
        )}
      </div>
    </section>
  )
}
