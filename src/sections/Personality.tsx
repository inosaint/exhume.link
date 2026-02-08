import { useEffect, useState } from 'react'
import type { GrimReport } from '../data/tabsAnalysis'
import './sections.css'

interface PersonalityProps {
  report: GrimReport
}

export function Personality({ report }: PersonalityProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 400)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="section section--personality">
      <div className="section__inner">
        <div className="verdict-reveal">
          <div className="verdict-reveal__rule" />
          <p className={`verdict-reveal__text${visible ? ' verdict-reveal__text--visible' : ''}`}>
            {report.verdict}
          </p>
        </div>
      </div>
    </section>
  )
}
