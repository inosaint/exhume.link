/**
 * Hex Map — Flow C visualization.
 * Renders each tab as an individual hexagon, clustered by category.
 * Supports two layout modes: d3-force and d3-hexbin.
 */
import { useMemo, useState, useRef, useEffect } from 'react'
import { select } from 'd3-selection'
import { zoom, zoomIdentity, type ZoomBehavior } from 'd3-zoom'
import { forceLayout, hexbinLayout, hexPoints, hexbinRiverPath, MAP_W, MAP_H, type HexTile } from '../lib/hexTileLayout'
import { NECROPOLIS_REGIONS } from '../lib/necropolisRegions'
import type { CategoryGroup } from '../data/mockData'
import './hexmap.css'

type LayoutMode = 'force' | 'hexbin'

/** Default zoom scale — closer, map-like intimacy */
const DEFAULT_ZOOM = 3.2

interface HexMapProps {
  groups: CategoryGroup[]
}

interface HexMapPanelProps {
  groups: CategoryGroup[]
  className?: string
  backgroundVariant?: 'plain' | 'arcane'
}

export function HexMap({ groups }: HexMapProps) {
  const totalTabs = groups.reduce((sum, g) => sum + g.tabs.length, 0)
  const activeGroups = groups.filter(g => g.tabs.length > 0).length

  return (
    <section className="section section--hexmap">
      <div className="hexmap__container">
        <h2 className="section__heading hexmap__title">The Necropolis</h2>
        <p className="hexmap__subtitle">
          Each hex is a tab. {totalTabs} souls mapped across {activeGroups} districts.
        </p>
        <HexMapPanel groups={groups} backgroundVariant="arcane" />
      </div>
    </section>
  )
}

export function HexMapPanel({ groups, className, backgroundVariant = 'plain' }: HexMapPanelProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const gRef = useRef<SVGGElement>(null)
  const zoomRef = useRef<ZoomBehavior<SVGSVGElement> | null>(null)
  const [mode, setMode] = useState<LayoutMode>('hexbin')
  const [hovered, setHovered] = useState<HexTile | null>(null)
  const [tileHoverCategory, setTileHoverCategory] = useState<string | null>(null)
  const [ledgerHoverCategory, setLedgerHoverCategory] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [hiddenCategories, setHiddenCategories] = useState<Record<string, boolean>>({})

  // Compute layout
  const tiles = useMemo(() => {
    return mode === 'force' ? forceLayout(groups) : hexbinLayout(groups)
  }, [groups, mode])

  // Category centroids for labels
  const categoryLabels = useMemo(() => {
    const map = new Map<string, { xs: number[]; ys: number[]; name: string; count: number }>()
    for (const t of tiles) {
      let entry = map.get(t.category)
      if (!entry) {
        const region = NECROPOLIS_REGIONS.find(r => r.id === t.category)
        entry = { xs: [], ys: [], name: region?.name ?? t.category, count: 0 }
        map.set(t.category, entry)
      }
      entry.xs.push(t.x)
      entry.ys.push(t.y)
      entry.count++
    }
    return Array.from(map.entries()).map(([id, e]) => ({
      id,
      name: e.name,
      count: e.count,
      x: e.xs.reduce((a, b) => a + b, 0) / e.xs.length,
      y: e.ys.reduce((a, b) => a + b, 0) / e.ys.length,
    }))
  }, [tiles])

  // Legend data
  const legendItems = useMemo(() => {
    const counts = new Map<string, { id: string; color: string; name: string; count: number }>()
    for (const t of tiles) {
      const existing = counts.get(t.category)
      if (existing) {
        existing.count++
      } else {
        const region = NECROPOLIS_REGIONS.find(r => r.id === t.category)
        counts.set(t.category, { id: t.category, color: t.color, name: region?.name ?? t.category, count: 1 })
      }
    }
    return Array.from(counts.values()).sort((a, b) => b.count - a.count)
  }, [tiles])

  const hoveredCategory = ledgerHoverCategory ?? tileHoverCategory
  const activeLabelIds = useMemo(() => {
    const ids = new Set<string>()
    if (hoveredCategory) ids.add(hoveredCategory)
    if (selectedCategory) ids.add(selectedCategory)
    return ids
  }, [hoveredCategory, selectedCategory])

  const activeLabels = useMemo(() => {
    return categoryLabels.filter(label => activeLabelIds.has(label.id) && !hiddenCategories[label.id])
  }, [categoryLabels, activeLabelIds, hiddenCategories])

  const handleToggleCategory = (id: string) => {
    setHiddenCategories(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const handleIsolateCategory = (id: string) => {
    const next: Record<string, boolean> = {}
    for (const item of legendItems) {
      next[item.id] = item.id !== id
    }
    setHiddenCategories(next)
    setSelectedCategory(id)
  }

  const handleShowAll = () => {
    setHiddenCategories({})
    setSelectedCategory(null)
  }

  // D3 zoom — default to a closer view
  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    const behavior = zoom<SVGSVGElement>()
      .scaleExtent([0.4, 8])
      .on('zoom', (event: unknown) => {
        const g = gRef.current
        if (!g) return
        const e = event as { transform: { toString: () => string } }
        g.setAttribute('transform', e.transform.toString())
      })
    zoomRef.current = behavior
    const sel = select(svg)
    sel.call(behavior)

    // Apply default zoom centered on content
    const initialTransform = zoomIdentity
      .translate(MAP_W / 2, MAP_H / 2)
      .scale(DEFAULT_ZOOM)
      .translate(-MAP_W / 2, -MAP_H / 2)
    sel.call(behavior.transform, initialTransform)

    return () => { sel.on('.zoom', null); zoomRef.current = null }
  }, [])

  const zoomIn = () => {
    const svg = svgRef.current; const b = zoomRef.current
    if (svg && b) select(svg).call(b.scaleBy, 1.4)
  }
  const zoomOut = () => {
    const svg = svgRef.current; const b = zoomRef.current
    if (svg && b) select(svg).call(b.scaleBy, 1 / 1.4)
  }
  const resetZoom = () => {
    const svg = svgRef.current; const b = zoomRef.current
    if (!svg || !b) return
    const t = zoomIdentity
      .translate(MAP_W / 2, MAP_H / 2)
      .scale(DEFAULT_ZOOM)
      .translate(-MAP_W / 2, -MAP_H / 2)
    select(svg).call(b.transform, t)
  }

  const panelClass = className ? `hexmap__panel ${className}` : 'hexmap__panel'
  const riverPath = useMemo(() => (mode === 'hexbin' ? hexbinRiverPath() : ''), [mode])

  return (
    <div className={panelClass}>
      {/* Top bar */}
      <div className="hexmap__topbar">
        <div className="hexmap__mode-toggle" role="group" aria-label="Hex map layout">
          <button
            className={`hexmap__mode-btn ${mode === 'force' ? 'hexmap__mode-btn--active' : ''}`}
            onClick={() => setMode('force')}
          >
            Force
          </button>
          <button
            className={`hexmap__mode-btn ${mode === 'hexbin' ? 'hexmap__mode-btn--active' : ''}`}
            onClick={() => setMode('hexbin')}
          >
            Hexbin
          </button>
        </div>

        <div className="hexmap__controls" role="group" aria-label="Hex map zoom">
          <button className="hexmap__control" onClick={zoomIn} aria-label="Zoom in">+</button>
          <button className="hexmap__control" onClick={zoomOut} aria-label="Zoom out">−</button>
          <button className="hexmap__control" onClick={resetZoom} aria-label="Reset zoom">⟲</button>
        </div>
      </div>

      <div className="hexmap__content">
        <div className="hexmap__viewport">
          <svg
            ref={svgRef}
            className="hexmap__svg"
            viewBox={`0 0 ${MAP_W} ${MAP_H}`}
            preserveAspectRatio="xMidYMid meet"
          >
            {backgroundVariant === 'arcane' && (
              <defs>
                <radialGradient id="hexmap-stone" cx="50%" cy="85%" r="80%">
                  <stop offset="0%" stopColor="#2a241f" />
                  <stop offset="45%" stopColor="#161312" />
                  <stop offset="100%" stopColor="#070606" />
                </radialGradient>

                <radialGradient id="hexmap-lift" cx="50%" cy="88%" r="55%">
                  <stop offset="0%" stopColor="#c9a86a" stopOpacity="0.25" />
                  <stop offset="60%" stopColor="#c9a86a" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                </radialGradient>

                <radialGradient id="hexmap-vignette" cx="50%" cy="55%" r="70%">
                  <stop offset="0%" stopColor="#000000" stopOpacity="0" />
                  <stop offset="55%" stopColor="#000000" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#000000" stopOpacity="0.9" />
                </radialGradient>

                <filter id="hexmap-stone-noise" x="-20%" y="-20%" width="140%" height="140%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" seed="7" result="noise" />
                  <feColorMatrix in="noise" type="saturate" values="0" result="mono" />
                  <feBlend in="SourceGraphic" in2="mono" mode="soft-light" />
                </filter>

                <filter id="hexmap-mist" x="-20%" y="-20%" width="140%" height="140%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="3" seed="13" result="noise" />
                  <feDisplacementMap in="SourceGraphic" in2="noise" scale="20" />
                  <feGaussianBlur stdDeviation="12" />
                  <feColorMatrix type="matrix" values="
                    1 0 0 0 0
                    1 0 0 0 0
                    1 0 0 0 0
                    0 0 0 0.15 0" />
                </filter>
              </defs>
            )}

            {mode === 'hexbin' && riverPath && (
              <defs>
                <path id="hexmap-river-path" d={riverPath} />
              </defs>
            )}

            {/* Background (viewport-locked) */}
            {backgroundVariant === 'arcane' ? (
              <>
                <rect x={-200} y={-200} width={MAP_W + 400} height={MAP_H + 400} fill="url(#hexmap-stone)" />
                <rect
                  x={-200} y={-200}
                  width={MAP_W + 400} height={MAP_H + 400}
                  fill="#1a1410"
                  opacity={0.35}
                  filter="url(#hexmap-stone-noise)"
                />
                <rect
                  x={-200} y={-200}
                  width={MAP_W + 400} height={MAP_H + 400}
                  fill="url(#hexmap-lift)"
                  opacity={0.35}
                />
                <rect
                  x={-200} y={-200}
                  width={MAP_W + 400} height={MAP_H + 400}
                  fill="#d8d0bf"
                  opacity={0.06}
                  filter="url(#hexmap-mist)"
                />
                <rect x={-200} y={-200} width={MAP_W + 400} height={MAP_H + 400} fill="url(#hexmap-vignette)" />
              </>
            ) : (
              <rect x={-200} y={-200} width={MAP_W + 400} height={MAP_H + 400} fill="#1a1410" />
            )}

            <g ref={gRef}>
              {/* River carve accent (hexbin only) */}
              {mode === 'hexbin' && riverPath && (
                <g className="hexmap__river" aria-hidden="true">
                  <path d={riverPath} className="hexmap__river-line" />
                  <text className="hexmap__river-label">
                    <textPath href="#hexmap-river-path" startOffset="52%" textAnchor="middle">
                      THE STREAM OF SORROWS
                    </textPath>
                  </text>
                </g>
              )}

              {/* Hex tiles */}
              {tiles.map(tile => {
                const isHidden = hiddenCategories[tile.category]
                const isSelected = selectedCategory === tile.category
                const isHovered = hoveredCategory === tile.category
                const isActive = isSelected || isHovered
                const isDimmed = (hoveredCategory || selectedCategory) && !isActive
                return (
                  <g
                    key={tile.id}
                    className={`hex-tile${isHidden ? ' hex-tile--hidden' : ''}${isDimmed ? ' hex-tile--dim' : ''}${isActive ? ' hex-tile--active' : ''}${isSelected ? ' hex-tile--selected' : ''}`}
                    onMouseEnter={() => {
                      setHovered(tile)
                      setTileHoverCategory(tile.category)
                    }}
                    onMouseLeave={() => {
                      setHovered(null)
                      setTileHoverCategory(null)
                    }}
                    onClick={() => window.open(tile.tab.url, '_blank')}
                  >
                    <polygon
                      points={hexPoints(tile.x, tile.y, tile.radius)}
                      fill={tile.color}
                      stroke="#2a1a10"
                      strokeWidth={0.5}
                      opacity={0.85}
                      className="hex-tile__shape"
                    />
                  </g>
                )
              })}

              {/* Category labels — hover/selected only */}
              {activeLabels.map(label => (
                <g key={`label-${label.id}`} className="hexmap__label-group">
                  <text
                    className="hexmap__label-text"
                    x={label.x}
                    y={label.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    {label.name}
                  </text>
                </g>
              ))}

              {/* Tooltip */}
              {hovered && (
                <foreignObject
                  x={Math.max(10, Math.min(hovered.x - 90, MAP_W - 200))}
                  y={hovered.y < 100 ? hovered.y + 16 : hovered.y - 60}
                  width={180}
                  height={60}
                  pointerEvents="none"
                >
                  <div className="hexmap__tooltip">
                    <span className="hexmap__tooltip-domain">{hovered.tab.domain}</span>
                    <span className="hexmap__tooltip-category">
                      {NECROPOLIS_REGIONS.find(r => r.id === hovered.category)?.name ?? hovered.category}
                    </span>
                  </div>
                </foreignObject>
              )}
            </g>
          </svg>
        </div>

        {/* Ritual Ledger */}
        <aside className="hexmap__ledger" aria-label="Ritual Ledger">
          <div className="hexmap__ledger-header">
            <div>
              <p className="hexmap__ledger-kicker">Ritual Ledger</p>
              <p className="hexmap__ledger-subtitle">Hover to reveal. Bind to isolate. Seal to conceal.</p>
            </div>
            <div className="hexmap__ledger-actions">
              <button className="hexmap__ledger-action" onClick={handleShowAll}>Show all</button>
            </div>
          </div>
          <div className="hexmap__ledger-list">
            {legendItems.map(item => {
              const isHidden = hiddenCategories[item.id]
              const isSelected = selectedCategory === item.id
              return (
                <div
                  key={item.id}
                  className={`hexmap__ledger-item${isSelected ? ' hexmap__ledger-item--active' : ''}${isHidden ? ' hexmap__ledger-item--hidden' : ''}`}
                  onMouseEnter={() => setLedgerHoverCategory(item.id)}
                  onMouseLeave={() => setLedgerHoverCategory(null)}
                >
                  <button
                    className="hexmap__ledger-main"
                    onClick={() => setSelectedCategory(prev => (prev === item.id ? null : item.id))}
                    aria-pressed={isSelected}
                  >
                    <span className="hexmap__ledger-swatch" style={{ backgroundColor: item.color }} />
                    <span className="hexmap__ledger-name">{item.name}</span>
                    <span className="hexmap__ledger-count">{item.count}</span>
                  </button>
                  <div className="hexmap__ledger-ops">
                    <button className="hexmap__ledger-op" onClick={() => handleIsolateCategory(item.id)}>Isolate</button>
                    <button className="hexmap__ledger-op" onClick={() => handleToggleCategory(item.id)}>
                      {isHidden ? 'Reveal' : 'Seal'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </aside>
      </div>
    </div>
  )
}
