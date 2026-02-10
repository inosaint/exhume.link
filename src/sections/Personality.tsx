import { useEffect, useState } from 'react'
import type { GrimReport, PersonalityProfile } from '../data/tabsAnalysis'
import './sections.css'

interface PersonalityProps {
  report: GrimReport
  personality: PersonalityProfile
}

/**
 * Parse verdict text and highlight the archetype title and numbers in gold.
 * Returns an array of text and span elements for rendering.
 */
function highlightVerdict(verdict: string, title: string): (string | JSX.Element)[] {
  const parts: (string | JSX.Element)[] = []
  let lastIndex = 0
  let keyCounter = 0

  // Create a regex that matches:
  // 1. The exact title (escaped for regex)
  // 2. Numbers (including those with commas and percentages)
  const escapedTitle = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const pattern = new RegExp(
    `(${escapedTitle}|\\d+(?:,\\d+)*(?:\\.\\d+)?%?)`,
    'g'
  )

  let match
  while ((match = pattern.exec(verdict)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(verdict.slice(lastIndex, match.index))
    }

    // Add the highlighted match
    parts.push(
      <span key={keyCounter++} className="verdict-reveal__highlight">
        {match[0]}
      </span>
    )

    lastIndex = match.index + match[0].length
  }

  // Add remaining text
  if (lastIndex < verdict.length) {
    parts.push(verdict.slice(lastIndex))
  }

  return parts
}

export function Personality({ report, personality }: PersonalityProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 400)
    return () => clearTimeout(timer)
  }, [])

  const highlightedVerdict = highlightVerdict(report.verdict, personality.title)

  return (
    <section className="section section--personality">
      <div className="section__inner">
        <div className="verdict-reveal">
          <div className="verdict-reveal__rule" />
          <p className={`verdict-reveal__text${visible ? ' verdict-reveal__text--visible' : ''}`}>
            {highlightedVerdict}
          </p>
        </div>
      </div>
    </section>
  )
}
