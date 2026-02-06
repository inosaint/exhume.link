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
          </p>
        </form>

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
