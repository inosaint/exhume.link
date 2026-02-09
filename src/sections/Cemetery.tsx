import { useRef, useEffect, useState } from 'react'
import { Gravestone, GravestoneRow } from '../components/Gravestone'
import { CATEGORY_GROUPS, type CategoryGroup, type CategoryId } from '../data/mockData'
import { NECROPOLIS_REGIONS } from '../lib/necropolisRegions'
import './sections.css'

/** Map category IDs to their gothic region names */
const REGION_NAMES: Record<CategoryId, string> = Object.fromEntries(
  NECROPOLIS_REGIONS.map(r => [r.id, r.name])
) as Record<CategoryId, string>

/** Map category IDs to their descriptions */
const REGION_DESCRIPTIONS: Record<CategoryId, string> = Object.fromEntries(
  NECROPOLIS_REGIONS.map(r => [r.id, r.description])
) as Record<CategoryId, string>

function CategorySection({ group, index }: { group: CategoryGroup; index: number }) {
  const [isVisible, setIsVisible] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const infoRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // Check for reduced motion preference
  const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Close info tooltip when clicking outside
  useEffect(() => {
    if (!showInfo) return
    function handleOutside(e: MouseEvent | TouchEvent) {
      if (infoRef.current && !infoRef.current.contains(e.target as Node)) {
        setShowInfo(false)
      }
    }
    document.addEventListener('mousedown', handleOutside)
    document.addEventListener('touchstart', handleOutside)
    return () => {
      document.removeEventListener('mousedown', handleOutside)
      document.removeEventListener('touchstart', handleOutside)
    }
  }, [showInfo])

  const description = REGION_DESCRIPTIONS[group.category.id] ?? group.category.description

  return (
    <div
      ref={sectionRef}
      className={`cemetery__category ${isVisible || reducedMotion ? 'cemetery__category--visible' : ''}`}
      style={{ '--category-delay': `${index * 100}ms` } as React.CSSProperties}
    >
      <div className="cemetery__category-header">
        <div className="cemetery__category-title-row">
          <span className="cemetery__category-icon">{group.category.icon}</span>
          <h3 className="cemetery__category-name">{REGION_NAMES[group.category.id] ?? group.category.label}</h3>
          <button
            ref={infoRef}
            className="cemetery__info-btn"
            onMouseEnter={() => setShowInfo(true)}
            onMouseLeave={() => setShowInfo(false)}
            onClick={() => setShowInfo(prev => !prev)}
            aria-label={`About ${REGION_NAMES[group.category.id] ?? group.category.label}`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            {showInfo && (
              <span className="cemetery__info-tooltip">{description}</span>
            )}
          </button>
        </div>
        <span className="cemetery__category-count">{group.count} buried</span>
      </div>

      {/* Desktop: Grid layout */}
      <div className="cemetery__grid">
        {group.tabs.map((tab, i) => (
          <Gravestone key={`${tab.url}:${i}`} tab={tab} index={i} />
        ))}
      </div>

      {/* Mobile: Horizontal scroll row */}
      <GravestoneRow tabs={group.tabs} startIndex={0} />
    </div>
  )
}

interface CemeteryProps {
  groups?: CategoryGroup[]
}

export function Cemetery({ groups }: CemeteryProps) {
  const categoryGroups = groups ?? CATEGORY_GROUPS
  const activeCategories = categoryGroups.filter(g => g.tabs.length > 0)
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollY, setScrollY] = useState(0)

  // Parallax effect within the cemetery section
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Check for reduced motion preference
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) return

    const handleScroll = () => {
      setScrollY(container.scrollTop)
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  // Calculate parallax offsets for background layers
  const bgOffset = scrollY * 0.3
  const midOffset = scrollY * 0.5

  return (
    <section className="section section--cemetery">
      {/* Parallax background layers */}
      <div className="cemetery__parallax">
        <div
          className="cemetery__layer cemetery__layer--bg"
          style={{ transform: `translateY(${bgOffset}px)` }}
        />
        <div
          className="cemetery__layer cemetery__layer--mid"
          style={{ transform: `translateY(${midOffset}px)` }}
        />
      </div>

      <div ref={containerRef} className="cemetery__scroll-container">
        <div className="cemetery__inner">
          <h2 className="section__heading">The Cemetery</h2>
          <p className="cemetery__subtitle">
            Each stone marks a tab. Click to resurrect.
          </p>

          <div className="cemetery__categories">
            {activeCategories.map((group, i) => (
              <CategorySection key={group.category.id} group={group} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
