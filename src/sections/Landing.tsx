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
  const [showHowTo, setShowHowTo] = useState(false)

  const hasUrl = useMemo(() => URL_PATTERN.test(text), [text])
  const canSubmit = hasUrl || !!file
  const isSubmitDisabled = isBusy || !canSubmit

  return (
    <section className="section section--landing" style={{ paddingTop: '2rem' }}>
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
            <h1
              className="landing__title"
              onClick={() => {
                if (sampleText && !isBusy) {
                  setText(sampleText)
                  setFile(null)
                }
              }}
            >
              exhume.link
            </h1>

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

                <button
                  type="button"
                  className="surface__sample"
                  onClick={() => setShowHowTo(true)}
                >
                  How to export tabs
                </button>
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
            Analysis runs locally in your browser. No links are uploaded.{' '}
            <button
              type="button"
              className="surface__note-link"
              onClick={() => setShowPrivacy(true)}
            >
              Privacy policy
            </button>
          </p>
        </form>

        {showHowTo && (
          <div className="privacy-modal" onClick={() => setShowHowTo(false)}>
            <div className="privacy-modal__content" onClick={(e) => e.stopPropagation()}>
              <h2 className="privacy-modal__title">How to Export Your Tabs</h2>

              <div className="privacy-modal__body">
                <p>
                  The first step is getting a list of your open tab URLs. Here's how,
                  depending on your browser.
                </p>

                <section>
                  <h3>Safari on iPhone &amp; iPad</h3>
                  <p>Safari has a built-in feature to copy all your open tab links at once.</p>
                  <img
                    src="/safari-iOS.jpeg"
                    alt="Safari iOS Copy Links menu"
                    className="howto-modal__img"
                  />
                  <ol className="howto-modal__steps">
                    <li>Open Safari on your iPhone or iPad.</li>
                    <li>Tap and hold the <strong>Tabs</strong> button (two overlapping squares, bottom-right).</li>
                    <li>Tap <strong>Copy Links</strong> from the menu.</li>
                    <li>All URLs are now on your clipboard, ready to paste.</li>
                  </ol>
                </section>

                <section>
                  <h3>Safari on macOS</h3>
                  <p>Your Mac's Safari also has a native option, via the sidebar.</p>
                  <img
                    src="/safari-macOS.png"
                    alt="Safari macOS Copy Links menu"
                    className="howto-modal__img"
                  />
                  <ol className="howto-modal__steps">
                    <li>Open Safari on your Mac.</li>
                    <li>Show the <strong>Sidebar</strong> (click the sidebar icon in the toolbar).</li>
                    <li>Right-click on your tab group or the "X Tabs" label.</li>
                    <li>Select <strong>Copy Links</strong>. The URLs are now on your clipboard.</li>
                  </ol>
                </section>

                <section>
                  <h3>Chrome, Firefox &amp; Edge</h3>
                  <p>
                    For these browsers, you'll need a browser extension. Install one, click
                    the extension icon, and copy all open tab URLs.
                  </p>
                  <p>
                    Personal recommendation:{' '}
                    <a href="https://www.one-tab.com" target="_blank" rel="noopener noreferrer">
                      OneTab
                    </a>
                  </p>
                  <ul>
                    <li>
                      <strong>Chrome:</strong>{' '}
                      <a href="https://chromewebstore.google.com/detail/copy-all-urls/iiagcalhlpmgdipdcikkjiliaankcagj" target="_blank" rel="noopener noreferrer">
                        Copy All URLs
                      </a>
                    </li>
                    <li>
                      <strong>Firefox:</strong>{' '}
                      <a href="https://addons.mozilla.org/en-US/firefox/addon/copy-url-of-all-tabs/" target="_blank" rel="noopener noreferrer">
                        Copy URL of All Tabs
                      </a>
                    </li>
                    <li>
                      <strong>Edge:</strong>{' '}
                      <a href="https://microsoftedge.microsoft.com/addons/detail/copy-all-urls/pnifopiiginkkodeanknklhahdpnmech" target="_blank" rel="noopener noreferrer">
                        Copy All URLs
                      </a>
                    </li>
                  </ul>
                </section>

                <section>
                  <h3>Paste into exhume.link</h3>
                  <ol className="howto-modal__steps">
                    <li>Find the input box on this page.</li>
                    <li>Paste your list of URLs (<strong>Ctrl+V</strong> / <strong>Cmd+V</strong>).</li>
                    <li>Or upload a file via <strong>Choose file</strong>.</li>
                    <li>Click <strong>Begin the Exhumation</strong>.</li>
                  </ol>
                </section>
              </div>

              <button
                className="privacy-modal__close"
                onClick={() => setShowHowTo(false)}
                type="button"
              >
                Close
              </button>
            </div>
          </div>
        )}

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
