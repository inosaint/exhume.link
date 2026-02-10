import './sections.css'

export function Privacy() {
  return (
    <section className="section section--privacy">
      <div className="section__inner">
        <div className="privacy-content">
          <h1 className="privacy__title">Privacy & Data Collection</h1>

          <div className="privacy__body">
            <h2>What We Collect</h2>
            <p>
              When you use exhume.link, we collect anonymous analytics data to help us understand
              how people use the tool and improve the experience. This includes:
            </p>
            <ul>
              <li><strong>Usage Analytics:</strong> Which sections you visit, your navigation path through the tool (funnel analysis)</li>
              <li><strong>Archetype Results:</strong> The final archetype/personality type generated from your analysis</li>
              <li><strong>Statistics:</strong> Aggregate metrics like total number of tabs analyzed and unique domains (no specific URLs)</li>
              <li><strong>Device Information:</strong> Whether you're using a mobile or desktop device</li>
              <li><strong>Location:</strong> Your country of origin (based on IP address)</li>
              <li><strong>Session Data:</strong> Basic session information to understand visitor patterns</li>
            </ul>

            <h2>What We Don't Collect</h2>
            <p>We take your privacy seriously. We explicitly do NOT collect:</p>
            <ul>
              <li><strong>Your URLs:</strong> The actual links you paste or upload are never recorded or sent to our servers</li>
              <li><strong>Personal Information:</strong> No email addresses, names, or other identifying information</li>
              <li><strong>File Contents:</strong> The content of files you upload is processed locally and never leaves your browser</li>
            </ul>

            <h2>How Your Data is Processed</h2>
            <p>
              All tab analysis happens <strong>entirely in your browser</strong>. Your URLs and tab data
              are processed locally on your device and are never uploaded to our servers. Only anonymous
              analytics events (like "user viewed personality section" or "archetype generated: collector")
              are sent to our analytics platform.
            </p>

            <h2>Analytics Provider</h2>
            <p>
              We use PostHog for analytics. PostHog is a privacy-friendly analytics platform that
              helps us understand product usage without compromising your privacy. You can learn more
              about PostHog's privacy practices at{' '}
              <a
                href="https://posthog.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="privacy__link"
              >
                posthog.com/privacy
              </a>.
            </p>

            <h2>Data Retention</h2>
            <p>
              Analytics data is retained for a limited time for product improvement purposes.
              Since all data is anonymous and contains no personal information or actual URLs,
              there is no way to identify or link data back to individual users.
            </p>

            <h2>Your Rights</h2>
            <p>
              Since we don't collect personal information or identifiable data, there's no personal
              data to access, modify, or delete. The analytics we collect is aggregate and anonymous by design.
            </p>

            <h2>Questions?</h2>
            <p>
              If you have questions about our privacy practices, please reach out via the project's
              GitHub repository.
            </p>
          </div>

          <button
            className="privacy__back"
            onClick={() => window.history.back()}
            type="button"
          >
            ← Back
          </button>
        </div>
      </div>
    </section>
  )
}
