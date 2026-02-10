import { useRef, useEffect, useState } from 'react'
import type { ExhumeStats, PersonalityProfile } from '../data/tabsAnalysis'
import './TradingCard3D.css'

interface TradingCard3DProps {
  profile: PersonalityProfile
  stats: ExhumeStats
}

export function TradingCard3D({ profile, stats }: TradingCard3DProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)
  const [mouseX, setMouseX] = useState(50)
  const [mouseY, setMouseY] = useState(50)
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!isHovering) return

      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const centerX = rect.width / 2
      const centerY = rect.height / 2

      const rotateXValue = ((y - centerY) / centerY) * -15
      const rotateYValue = ((x - centerX) / centerX) * 15

      // Calculate mouse position as percentage for gradient positioning
      const mouseXPercent = (x / rect.width) * 100
      const mouseYPercent = (y / rect.height) * 100

      setRotateX(rotateXValue)
      setRotateY(rotateYValue)
      setMouseX(mouseXPercent)
      setMouseY(mouseYPercent)
    }

    const handleMouseLeave = () => {
      setIsHovering(false)
      setRotateX(0)
      setRotateY(0)
      setMouseX(50)
      setMouseY(50)
    }

    const handleMouseEnter = () => {
      setIsHovering(true)
    }

    card.addEventListener('mousemove', handleMouseMove)
    card.addEventListener('mouseleave', handleMouseLeave)
    card.addEventListener('mouseenter', handleMouseEnter)

    return () => {
      card.removeEventListener('mousemove', handleMouseMove)
      card.removeEventListener('mouseleave', handleMouseLeave)
      card.removeEventListener('mouseenter', handleMouseEnter)
    }
  }, [isHovering])

  // Rarity calculation
  let rarity = 'COMMON'
  if (stats.totalTabs > 1000) rarity = 'LEGENDARY'
  else if (stats.totalTabs > 500) rarity = 'EPIC'
  else if (stats.totalTabs > 100) rarity = 'RARE'
  else if (stats.totalTabs > 50) rarity = 'UNCOMMON'

  return (
    <div className="trading-card-3d-container">
      <div
        ref={cardRef}
        className="trading-card-3d"
        style={{
          transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transition: isHovering ? 'none' : 'transform 0.5s ease-out',
        }}
      >
        <div className="trading-card-3d__inner">
          {/* Holographic overlay - moves with mouse */}
          <div
            className="trading-card-3d__holo"
            style={{
              backgroundPosition: `${mouseX}% ${mouseY}%`,
              opacity: isHovering ? 1 : 0.5,
            }}
          />

          {/* Sparkle/shine effect */}
          <div
            className="trading-card-3d__sparkle"
            style={{
              backgroundPosition: `${mouseX}% ${mouseY}%`,
              opacity: isHovering ? 0.8 : 0,
            }}
          />

          {/* Glare effect */}
          <div
            className="trading-card-3d__glare"
            style={{
              backgroundPosition: `${mouseX}% ${mouseY}%`,
              opacity: isHovering ? 0.3 : 0,
            }}
          />

          {/* Portrait */}
          <div className="trading-card-3d__portrait">
            <img src={profile.image} alt={profile.title} />
          </div>

          {/* Rarity badge - top right over portrait */}
          <div className="trading-card-3d__rarity">
            <span>{rarity}</span>
          </div>

          {/* Title */}
          <h2 className="trading-card-3d__title">{profile.title}</h2>

          {/* Description */}
          <p className="trading-card-3d__description">{profile.description}</p>

          {/* Popular haunt */}
          {stats.topDomain && (
            <div className="trading-card-3d__haunt">
              <span className="trading-card-3d__haunt-label">Popular haunt</span>
              <span className="trading-card-3d__haunt-value">
                {stats.topDomain.domain.length > 25
                  ? stats.topDomain.domain.substring(0, 22) + '...'
                  : stats.topDomain.domain}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
