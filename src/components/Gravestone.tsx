import { useState } from 'react'
import type { TabEntry } from '../data/mockData'
import './Gravestone.css'

interface GravestoneProps {
  tab: TabEntry
  index: number
}

export function Gravestone({ tab, index }: GravestoneProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [faviconLoaded, setFaviconLoaded] = useState(false)

  const handleClick = () => {
    window.open(tab.url, '_blank', 'noopener,noreferrer')
  }

  // Extract display title
  const displayTitle = tab.title || tab.domain
  const truncatedTitle = displayTitle.length > 24
    ? displayTitle.slice(0, 22) + '…'
    : displayTitle

  const faviconUrl = `https://www.google.com/s2/favicons?domain=${tab.domain}&sz=32`

  return (
    <button
      className={`gravestone ${isHovered ? 'gravestone--hovered' : ''}`}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ '--stagger-delay': `${index * 50}ms` } as React.CSSProperties}
      aria-label={`Open ${displayTitle} in new tab`}
    >
      <div className="gravestone__icon-wrap">
        <svg
          className="gravestone__svg"
          viewBox="0 0 80 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Gravestone shape - rounded top, flat base */}
          <path
            className="gravestone__stone"
            d="M4 30C4 14.536 16.536 2 32 2H48C63.464 2 76 14.536 76 30V98H4V30Z"
            fill="var(--color-bg-surface)"
            stroke="var(--color-stone)"
            strokeWidth="2"
          />
          {/* Inner border detail */}
          <path
            className="gravestone__inner"
            d="M10 32C10 19.85 19.85 10 32 10H48C60.15 10 70 19.85 70 32V90H10V32Z"
            fill="none"
            stroke="var(--color-stone)"
            strokeWidth="1"
            opacity="0.5"
          />
          {/* Cross fallback — hidden when favicon loads */}
          {!faviconLoaded && (
            <path
              className="gravestone__cross"
              d="M40 22V42M30 32H50"
              stroke="var(--color-accent-dim)"
              strokeWidth="2"
              strokeLinecap="round"
            />
          )}
        </svg>
        <img
          className={`gravestone__favicon${faviconLoaded ? ' gravestone__favicon--loaded' : ''}`}
          src={faviconUrl}
          alt=""
          width="24"
          height="24"
          loading="lazy"
          onLoad={() => setFaviconLoaded(true)}
          onError={() => setFaviconLoaded(false)}
        />
      </div>
      <span className="gravestone__domain">{tab.domain}</span>
      <span className="gravestone__title">{truncatedTitle}</span>
    </button>
  )
}

interface GravestoneRowProps {
  tabs: TabEntry[]
  startIndex: number
}

export function GravestoneRow({ tabs, startIndex }: GravestoneRowProps) {
  return (
    <div className="gravestone-row">
      {tabs.map((tab, i) => (
        <Gravestone key={`${tab.url}:${startIndex + i}`} tab={tab} index={startIndex + i} />
      ))}
    </div>
  )
}
