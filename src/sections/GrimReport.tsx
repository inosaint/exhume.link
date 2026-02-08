/**
 * The Grim Report — behavioral analysis of the user's tab data.
 *
 * Advances the narrative by surfacing insights the user didn't already know:
 * spirals (rabbit holes), consumption vs creation ratio, stale tabs,
 * unfinished business, and a closing verdict.
 */
import type { GrimReport as GrimReportData } from '../data/tabsAnalysis'
import './grimreport.css'

interface GrimReportProps {
  report: GrimReportData
}

function InsightCard({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="grim__card">
      <span className="grim__card-label">{label}</span>
      <div className="grim__card-body">{children}</div>
    </div>
  )
}

export function GrimReport({ report }: GrimReportProps) {
  const hasSpirals = report.spirals.length > 0
  const hasUnfinished = report.unfinishedShopping > 0 || report.unfinishedJobs > 0
  const totalUnfinished = report.unfinishedShopping + report.unfinishedJobs

  // Consumption/creation bar widths
  const barTotal = Math.max(report.consumptionCount + report.creationCount, 1)
  const consumePct = Math.round((report.consumptionCount / barTotal) * 100)
  const createPct = 100 - consumePct

  return (
    <section className="section section--grimreport">
      <div className="grim__scroll">
        <div className="grim__inner">
          <h2 className="section__heading grim__title">The Grim Report</h2>
          <p className="grim__subtitle">What the bones reveal.</p>

          <div className="grim__cards">
            {/* ── The Spiral ── */}
            {hasSpirals && (
              <InsightCard label="The Spiral">
                <p className="grim__insight">
                  You fell{' '}
                  <span className="grim__accent">{report.deepestSpiral!.count} tabs</span>{' '}
                  deep into{' '}
                  <span className="grim__accent">{report.deepestSpiral!.domain}</span>.
                </p>
                {report.spirals.length > 1 && (
                  <div className="grim__spiral-list">
                    {report.spirals.map(s => (
                      <div key={s.domain} className="grim__spiral-item">
                        <span className="grim__spiral-domain">{s.domain}</span>
                        <span className="grim__spiral-count">{s.count}</span>
                      </div>
                    ))}
                  </div>
                )}
              </InsightCard>
            )}

            {/* ── The Ratio ── */}
            <InsightCard label="The Ratio">
              <p className="grim__insight">
                For every thing you {report.isConsumer ? 'created' : 'consumed'}, you{' '}
                {report.isConsumer ? 'consumed' : 'created'}{' '}
                <span className="grim__accent">{report.ratio}</span>.
              </p>
              <div className="grim__bar">
                <div
                  className="grim__bar-fill grim__bar-fill--consume"
                  style={{ width: `${consumePct}%` }}
                  title={`Consumption: ${report.consumptionCount}`}
                >
                  <span className="grim__bar-label">
                    {report.consumptionCount}
                  </span>
                </div>
                <div
                  className="grim__bar-fill grim__bar-fill--create"
                  style={{ width: `${createPct}%` }}
                  title={`Creation: ${report.creationCount}`}
                >
                  <span className="grim__bar-label">
                    {report.creationCount}
                  </span>
                </div>
              </div>
              <div className="grim__bar-legend">
                <span className="grim__bar-key grim__bar-key--consume">Consumed</span>
                <span className="grim__bar-key grim__bar-key--create">Created</span>
              </div>
            </InsightCard>

            {/* ── The Rot ── */}
            {report.stalePct > 0 && (
              <InsightCard label="The Rot">
                <p className="grim__insight">
                  <span className="grim__accent">{report.stalePct}%</span> of your tabs
                  are probably already dead.
                </p>
                <p className="grim__detail">
                  {report.staleCount} tabs across news, social, and shopping — ephemeral
                  by nature, decaying by the hour.
                </p>
              </InsightCard>
            )}

            {/* ── Unfinished Business ── */}
            {hasUnfinished && (
              <InsightCard label="Unfinished Business">
                <p className="grim__insight">
                  <span className="grim__accent">{totalUnfinished}</span>{' '}
                  {totalUnfinished === 1 ? 'thing' : 'things'} saved but never acted on.
                </p>
                <div className="grim__unfinished">
                  {report.unfinishedShopping > 0 && (
                    <p className="grim__detail">
                      {report.unfinishedShopping} shopping {report.unfinishedShopping === 1 ? 'tab' : 'tabs'} —
                      carts abandoned, wishlists ignored.
                    </p>
                  )}
                  {report.unfinishedJobs > 0 && (
                    <p className="grim__detail">
                      {report.unfinishedJobs} job {report.unfinishedJobs === 1 ? 'listing' : 'listings'} —
                      browsed but never applied to.
                    </p>
                  )}
                </div>
              </InsightCard>
            )}

            {/* ── The Drift ── */}
            {report.oneAndDonePct > 0 && (
              <InsightCard label="The Drift">
                <p className="grim__insight">
                  <span className="grim__accent">{report.oneAndDonePct}%</span> of domains
                  you visited exactly once — and never returned.
                </p>
                <p className="grim__detail">
                  {report.oneAndDoneCount} of {report.oneAndDoneCount + (Math.round(report.oneAndDoneCount / Math.max(report.oneAndDonePct, 1) * 100) - report.oneAndDoneCount)} domains,
                  touched and forgotten.
                </p>
              </InsightCard>
            )}
          </div>

        </div>
      </div>
    </section>
  )
}
