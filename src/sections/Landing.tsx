import { useState } from 'react'
import './sections.css'

interface LandingProps {
  isBusy: boolean
  error?: string | null
  sampleText?: string
  onBegin: (input: { text: string; file: File | null }) => void
}

export function Landing({ isBusy, error, sampleText, onBegin }: LandingProps) {
  const [text, setText] = useState('')
  const [file, setFile] = useState<File | null>(null)

  return (
    <section className="section section--landing">
      <div className="section__inner">
        <h1 className="landing__title">exhume.link</h1>
        <p className="landing__tagline">
          Your tabs have been buried.<br />
          It's time to dig them up.
        </p>

        <form
          className="surface__form"
          onSubmit={(e) => {
            e.preventDefault()
            onBegin({ text, file })
          }}
        >
          <div className="surface__panel">
            <label className="surface__label" htmlFor="surface-urls">
              Paste URLs or upload a CSV
            </label>
            <textarea
              id="surface-urls"
              className="surface__textarea"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste links here… (one per line, or any text that contains http(s):// URLs)"
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
                  Use sample dataset
                </button>
              )}
            </div>

            {file && (
              <p className="surface__meta">
                File: <span className="surface__meta-value">{file.name}</span>
              </p>
            )}

            {error && (
              <p className="surface__error" role="alert">
                {error}
              </p>
            )}
          </div>

          <button className="landing__cta" type="submit" disabled={isBusy}>
            {isBusy ? 'Unearthing…' : 'Begin the Exhumation'}
          </button>

          <p className="surface__note">
            Analysis runs locally in your browser. No links are uploaded.
          </p>
        </form>
      </div>
    </section>
  )
}
