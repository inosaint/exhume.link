/**
 * The Necropolis — A procedural fantasy map of your tab categories.
 *
 * Each category becomes a region on a parchment-style continent.
 * Regions are sized proportionally to tab count, with organic
 * Perlin-noise coastlines, terrain icons, and a hand-drawn aesthetic.
 */
import { type ReactNode, useMemo, useState, useRef, useEffect } from 'react'
import { select } from 'd3-selection'
import { zoom, zoomIdentity, type ZoomBehavior } from 'd3-zoom'
import { seedNoise, noisyPolygon, smoothPath, fbm } from '../lib/noise'
import { NECROPOLIS_REGIONS, type NecropolisRegion } from '../lib/necropolisRegions'
import type { CategoryGroup } from '../data/mockData'
import './necropolis.css'

const MAP_WIDTH = 1000
const MAP_HEIGHT = 700

/* ── Parchment palette ── */
const COLORS = {
  parchment: '#f4e8c1',
  parchmentDark: '#e8d5a8',
  ink: '#3c2415',
  inkLight: '#5a3a22',
  regionActive: '#d4b896',
  regionEmpty: 'rgba(196, 184, 154, 0.3)',
  water: '#8fa5a0',
  waterDeep: '#6b8a84',
  gold: '#c9a84c',
  textDark: '#2a1a0a',
  textLight: '#5a4a30',
}

/* ─────────────────────────────────────────────────
   Terrain icon SVG fragments (geometric placeholders)
   ───────────────────────────────────────────────── */
function TerrainIcon({ type, x, y, scale = 1 }: {
  type: NecropolisRegion['terrainType']
  x: number
  y: number
  scale?: number
}) {
  const s = scale
  const icons: Record<NecropolisRegion['terrainType'], ReactNode> = {
    books: (
      <g transform={`translate(${x},${y}) scale(${s})`}>
        <rect x={-8} y={-3} width={16} height={3} rx={0.5} fill={COLORS.ink} opacity={0.35} />
        <rect x={-7} y={-7} width={14} height={3} rx={0.5} fill={COLORS.ink} opacity={0.3} />
        <rect x={-9} y={1} width={18} height={3} rx={0.5} fill={COLORS.ink} opacity={0.4} />
      </g>
    ),
    compass: (
      <g transform={`translate(${x},${y}) scale(${s})`}>
        <circle cx={0} cy={0} r={8} fill="none" stroke={COLORS.ink} strokeWidth={1} opacity={0.35} />
        <line x1={0} y1={-6} x2={0} y2={6} stroke={COLORS.ink} strokeWidth={0.8} opacity={0.3} />
        <line x1={-6} y1={0} x2={6} y2={0} stroke={COLORS.ink} strokeWidth={0.8} opacity={0.3} />
        <polygon points="0,-7 -2,0 0,2 2,0" fill={COLORS.ink} opacity={0.3} />
      </g>
    ),
    anvil: (
      <g transform={`translate(${x},${y}) scale(${s})`}>
        <path d="M-8,3 L-6,-3 L6,-3 L8,3 Z" fill={COLORS.ink} opacity={0.3} />
        <rect x={-3} y={-7} width={6} height={4} rx={1} fill={COLORS.ink} opacity={0.25} />
      </g>
    ),
    frame: (
      <g transform={`translate(${x},${y}) scale(${s})`}>
        <rect x={-7} y={-9} width={14} height={18} rx={1} fill="none" stroke={COLORS.ink} strokeWidth={1.2} opacity={0.35} />
        <rect x={-5} y={-7} width={10} height={14} rx={0.5} fill="none" stroke={COLORS.ink} strokeWidth={0.6} opacity={0.25} />
      </g>
    ),
    whisper: (
      <g transform={`translate(${x},${y}) scale(${s})`}>
        <ellipse cx={-3} cy={0} rx={7} ry={5} fill="none" stroke={COLORS.ink} strokeWidth={0.8} opacity={0.3} />
        <ellipse cx={5} cy={-2} rx={5} ry={4} fill="none" stroke={COLORS.ink} strokeWidth={0.8} opacity={0.25} />
        <circle cx={-5} cy={5} r={1.5} fill={COLORS.ink} opacity={0.2} />
        <circle cx={-2} cy={7} r={1} fill={COLORS.ink} opacity={0.15} />
      </g>
    ),
    mask: (
      <g transform={`translate(${x},${y}) scale(${s})`}>
        <ellipse cx={0} cy={0} rx={8} ry={10} fill="none" stroke={COLORS.ink} strokeWidth={1} opacity={0.35} />
        <ellipse cx={-3} cy={-2} rx={2} ry={1.5} fill={COLORS.ink} opacity={0.3} />
        <ellipse cx={3} cy={-2} rx={2} ry={1.5} fill={COLORS.ink} opacity={0.3} />
        <path d="M-3,4 Q0,6 3,4" fill="none" stroke={COLORS.ink} strokeWidth={0.8} opacity={0.25} />
      </g>
    ),
    tower: (
      <g transform={`translate(${x},${y}) scale(${s})`}>
        <rect x={-4} y={-4} width={8} height={12} fill={COLORS.ink} opacity={0.3} />
        <polygon points="-6,-4 0,-10 6,-4" fill={COLORS.ink} opacity={0.35} />
        <rect x={-1} y={2} width={2} height={4} fill={COLORS.parchment} opacity={0.4} />
      </g>
    ),
    stall: (
      <g transform={`translate(${x},${y}) scale(${s})`}>
        <polygon points="-10,-4 10,-4 8,0 -8,0" fill={COLORS.ink} opacity={0.3} />
        <rect x={-7} y={0} width={14} height={6} fill={COLORS.ink} opacity={0.2} />
        <line x1={-8} y1={0} x2={-8} y2={-8} stroke={COLORS.ink} strokeWidth={1} opacity={0.25} />
        <line x1={8} y1={0} x2={8} y2={-8} stroke={COLORS.ink} strokeWidth={1} opacity={0.25} />
      </g>
    ),
    shield: (
      <g transform={`translate(${x},${y}) scale(${s})`}>
        <path d="M0,-9 L7,-4 L5,6 L0,9 L-5,6 L-7,-4 Z" fill="none" stroke={COLORS.ink} strokeWidth={1} opacity={0.35} />
        <line x1={0} y1={-5} x2={0} y2={5} stroke={COLORS.ink} strokeWidth={0.7} opacity={0.2} />
        <line x1={-4} y1={0} x2={4} y2={0} stroke={COLORS.ink} strokeWidth={0.7} opacity={0.2} />
      </g>
    ),
    stones: (
      <g transform={`translate(${x},${y}) scale(${s})`}>
        <rect x={-8} y={-4} width={3} height={8} rx={0.5} fill={COLORS.ink} opacity={0.3} transform="rotate(-5,-6.5,0)" />
        <rect x={-2} y={-6} width={3} height={10} rx={0.5} fill={COLORS.ink} opacity={0.35} />
        <rect x={5} y={-4} width={3} height={8} rx={0.5} fill={COLORS.ink} opacity={0.3} transform="rotate(5,6.5,0)" />
      </g>
    ),
    ship: (
      <g transform={`translate(${x},${y}) scale(${s})`}>
        <path d="M-10,3 Q0,7 10,3 L8,0 L-8,0 Z" fill={COLORS.ink} opacity={0.3} />
        <line x1={0} y1={0} x2={0} y2={-10} stroke={COLORS.ink} strokeWidth={1} opacity={0.3} />
        <polygon points="0,-10 8,-4 0,-3" fill={COLORS.ink} opacity={0.2} />
      </g>
    ),
    'dead-tree': (
      <g transform={`translate(${x},${y}) scale(${s})`}>
        <line x1={0} y1={8} x2={0} y2={-6} stroke={COLORS.ink} strokeWidth={1.5} opacity={0.35} />
        <line x1={0} y1={-2} x2={-6} y2={-8} stroke={COLORS.ink} strokeWidth={1} opacity={0.3} />
        <line x1={0} y1={-4} x2={5} y2={-9} stroke={COLORS.ink} strokeWidth={1} opacity={0.3} />
        <line x1={0} y1={0} x2={-4} y2={-4} stroke={COLORS.ink} strokeWidth={0.8} opacity={0.25} />
      </g>
    ),
  }
  return icons[type] || null
}

/* ─────────────────────────────────────────────────
   Compass Rose (procedural placeholder)
   ───────────────────────────────────────────────── */
function CompassRose({ x, y, size = 60 }: { x: number; y: number; size?: number }) {
  const s = size / 60
  return (
    <g transform={`translate(${x},${y}) scale(${s})`} className="necropolis__compass">
      {/* Outer ring */}
      <circle cx={0} cy={0} r={28} fill="none" stroke={COLORS.ink} strokeWidth={1.5} opacity={0.5} />
      <circle cx={0} cy={0} r={24} fill="none" stroke={COLORS.ink} strokeWidth={0.5} opacity={0.3} />

      {/* Cardinal points */}
      <polygon points="0,-26 -3,-8 0,-4 3,-8" fill={COLORS.ink} opacity={0.6} />
      <polygon points="0,26 -3,8 0,4 3,8" fill={COLORS.ink} opacity={0.35} />
      <polygon points="-26,0 -8,-3 -4,0 -8,3" fill={COLORS.ink} opacity={0.35} />
      <polygon points="26,0 8,-3 4,0 8,3" fill={COLORS.ink} opacity={0.35} />

      {/* Intercardinal */}
      <line x1={-18} y1={-18} x2={18} y2={18} stroke={COLORS.ink} strokeWidth={0.5} opacity={0.2} />
      <line x1={18} y1={-18} x2={-18} y2={18} stroke={COLORS.ink} strokeWidth={0.5} opacity={0.2} />

      {/* Center dot */}
      <circle cx={0} cy={0} r={2} fill={COLORS.ink} opacity={0.5} />

      {/* Labels */}
      <text x={0} y={-32} textAnchor="middle" fontSize={7} fill={COLORS.ink} opacity={0.6}
        fontFamily="'Cinzel', serif" fontWeight={700}>N</text>
      <text x={0} y={38} textAnchor="middle" fontSize={6} fill={COLORS.ink} opacity={0.4}
        fontFamily="'Cinzel', serif">S</text>
      <text x={35} y={2} textAnchor="middle" fontSize={6} fill={COLORS.ink} opacity={0.4}
        fontFamily="'Cinzel', serif">E</text>
      <text x={-35} y={2} textAnchor="middle" fontSize={6} fill={COLORS.ink} opacity={0.4}
        fontFamily="'Cinzel', serif">W</text>
    </g>
  )
}

/* ─────────────────────────────────────────────────
   Edge decorations — wavy lines + "Here be dragons" text
   ───────────────────────────────────────────────── */
function EdgeDecorations() {
  return (
    <g className="necropolis__edges" opacity={0.3}>
      {/* Wavy line patterns in ocean areas */}
      {[80, 130, 180].map(y => (
        <path
          key={`wave-top-${y}`}
          d={`M 30,${y} Q 60,${y - 8} 90,${y} Q 120,${y + 8} 150,${y} Q 180,${y - 6} 210,${y}`}
          fill="none"
          stroke={COLORS.ink}
          strokeWidth={0.6}
          opacity={0.2}
        />
      ))}
      {[500, 550, 600].map(y => (
        <path
          key={`wave-left-${y}`}
          d={`M 20,${y} Q 40,${y - 8} 60,${y} Q 80,${y + 8} 100,${y}`}
          fill="none"
          stroke={COLORS.ink}
          strokeWidth={0.6}
          opacity={0.2}
        />
      ))}
      {[300, 350, 400].map(y => (
        <path
          key={`wave-right-${y}`}
          d={`M 870,${y} Q 900,${y - 6} 930,${y} Q 960,${y + 6} 980,${y}`}
          fill="none"
          stroke={COLORS.ink}
          strokeWidth={0.6}
          opacity={0.2}
        />
      ))}
      {/* "Here be dragons" text */}
      <text
        x={120} y={650}
        fontFamily="'Cinzel', serif"
        fontSize={9}
        fill={COLORS.ink}
        opacity={0.25}
        fontStyle="italic"
        letterSpacing="0.15em"
      >
        Here be dragons
      </text>

      {/* Sea serpent hint — simple wavy line */}
      <path
        d="M 830,600 Q 850,590 860,600 Q 870,610 880,600 Q 890,590 900,600 Q 905,605 910,595"
        fill="none"
        stroke={COLORS.ink}
        strokeWidth={1}
        opacity={0.2}
        strokeLinecap="round"
      />
      {/* Serpent head */}
      <circle cx={910} cy={593} r={2.5} fill={COLORS.ink} opacity={0.2} />
    </g>
  )
}

/* ─────────────────────────────────────────────────
   Parchment texture overlay (SVG filter + pattern)
   ───────────────────────────────────────────────── */
function ParchmentDefs() {
  return (
    <defs>
      {/* Noise filter for parchment texture */}
      <filter id="parchment-noise" x="0%" y="0%" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" seed="2" result="noise" />
        <feColorMatrix type="saturate" values="0" in="noise" result="gray-noise" />
        <feBlend in="SourceGraphic" in2="gray-noise" mode="multiply" />
      </filter>

      {/* Subtle vignette for aged edges */}
      <radialGradient id="vignette" cx="50%" cy="50%" r="55%">
        <stop offset="0%" stopColor={COLORS.parchment} stopOpacity={0} />
        <stop offset="70%" stopColor={COLORS.parchment} stopOpacity={0} />
        <stop offset="100%" stopColor="#8a7a5a" stopOpacity={0.3} />
      </radialGradient>

      {/* Water gradient */}
      <radialGradient id="water-grad" cx="50%" cy="50%" r="60%">
        <stop offset="0%" stopColor={COLORS.water} stopOpacity={0.4} />
        <stop offset="100%" stopColor={COLORS.waterDeep} stopOpacity={0.6} />
      </radialGradient>

      {/* Region glow filter for hover */}
      <filter id="region-glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="4" result="blur" />
        <feFlood floodColor={COLORS.gold} floodOpacity="0.4" result="gold" />
        <feComposite in="gold" in2="blur" operator="in" result="glow" />
        <feMerge>
          <feMergeNode in="glow" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      {/* Fog pattern for empty regions */}
      <pattern id="fog-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <circle cx="5" cy="5" r="1" fill={COLORS.ink} opacity={0.06} />
        <circle cx="15" cy="12" r="0.8" fill={COLORS.ink} opacity={0.04} />
      </pattern>
    </defs>
  )
}

/* ─────────────────────────────────────────────────
   Continent coastline — union of all region polygons
   expanded outward to form a unified landmass
   ───────────────────────────────────────────────── */
function generateCoastline(
  regions: Array<{ region: NecropolisRegion; count: number }>,
): string {
  // Use a convex-hull-like approach: sample points from all region polygons,
  // then create a smooth outer boundary
  const allPoints: Array<{ x: number; y: number }> = []

  for (const { region, count } of regions) {
    if (count === 0) continue
    const radiusScale = Math.max(0.7, Math.min(1.3, 0.7 + (count / 80) * 0.6))
    const radius = region.baseRadius * radiusScale
    const pts = noisyPolygon(
      region.cx, region.cy,
      radius + 20, // expand slightly beyond region
      24, 2.0, radius * 0.3,
      region.noiseSeedX, region.noiseSeedY
    )
    allPoints.push(...pts)
  }

  // Also add points for regions with 0 count but positioned centrally
  for (const { region, count } of regions) {
    if (count > 0) continue
    allPoints.push(
      { x: region.cx, y: region.cy - 30 },
      { x: region.cx, y: region.cy + 30 },
      { x: region.cx - 30, y: region.cy },
      { x: region.cx + 30, y: region.cy },
    )
  }

  if (allPoints.length < 3) return ''

  // Convex hull (Graham scan)
  const hull = convexHull(allPoints)

  // Add noise to the hull to make it organic
  const noisyHull: Array<{ x: number; y: number }> = []
  const cx = hull.reduce((a, p) => a + p.x, 0) / hull.length
  const cy = hull.reduce((a, p) => a + p.y, 0) / hull.length

  for (let i = 0; i < hull.length; i++) {
    const p = hull[i]
    // Subdivide — add midpoints for smoother coast
    const next = hull[(i + 1) % hull.length]
    const midX = (p.x + next.x) / 2
    const midY = (p.y + next.y) / 2

    // Add noise to the point
    const angle = Math.atan2(p.y - cy, p.x - cx)
    const noise = fbm(angle * 3 + 0.5, 7.7, 3) * 18
    noisyHull.push({
      x: p.x + Math.cos(angle) * noise,
      y: p.y + Math.sin(angle) * noise,
    })

    // Add noisy midpoint
    const midAngle = Math.atan2(midY - cy, midX - cx)
    const midNoise = fbm(midAngle * 3 + 2.2, 5.5, 3) * 14
    noisyHull.push({
      x: midX + Math.cos(midAngle) * midNoise,
      y: midY + Math.sin(midAngle) * midNoise,
    })
  }

  return smoothPath(noisyHull, true)
}

/**
 * Simple convex hull using Graham scan.
 */
function convexHull(points: Array<{ x: number; y: number }>): Array<{ x: number; y: number }> {
  if (points.length < 3) return [...points]

  // Find lowest-rightmost point
  let lowest = 0
  for (let i = 1; i < points.length; i++) {
    if (points[i].y > points[lowest].y ||
      (points[i].y === points[lowest].y && points[i].x < points[lowest].x)) {
      lowest = i
    }
  }

  const pivot = points[lowest]
  const sorted = points
    .filter((_, i) => i !== lowest)
    .sort((a, b) => {
      const angleA = Math.atan2(a.y - pivot.y, a.x - pivot.x)
      const angleB = Math.atan2(b.y - pivot.y, b.x - pivot.x)
      if (angleA !== angleB) return angleA - angleB
      const distA = (a.x - pivot.x) ** 2 + (a.y - pivot.y) ** 2
      const distB = (b.x - pivot.x) ** 2 + (b.y - pivot.y) ** 2
      return distA - distB
    })

  const stack: Array<{ x: number; y: number }> = [pivot, sorted[0]]

  for (let i = 1; i < sorted.length; i++) {
    while (stack.length > 1) {
      const a = stack[stack.length - 2]
      const b = stack[stack.length - 1]
      const c = sorted[i]
      const cross = (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x)
      if (cross <= 0) stack.pop()
      else break
    }
    stack.push(sorted[i])
  }

  return stack
}

/* ─────────────────────────────────────────────────
   Region tooltip
   ───────────────────────────────────────────────── */
interface RegionTooltipProps {
  region: NecropolisRegion
  count: number
  tabs: Array<{ url: string; domain: string }>
  svgX: number
  svgY: number
}

function RegionTooltip({ region, count, tabs, svgX, svgY }: RegionTooltipProps) {
  const tooltipY = svgY < 200 ? svgY + 40 : svgY - 90
  const topDomains = useMemo(() => {
    const domainCounts = new Map<string, number>()
    for (const t of tabs) {
      domainCounts.set(t.domain, (domainCounts.get(t.domain) ?? 0) + 1)
    }
    return Array.from(domainCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
  }, [tabs])

  return (
    <foreignObject
      x={Math.max(10, Math.min(svgX - 90, MAP_WIDTH - 200))}
      y={tooltipY}
      width={200}
      height={160}
      className="necropolis__tooltip-fo"
    >
      <div className="necropolis__tooltip">
        <span className="necropolis__tooltip-name">{region.name}</span>
        <span className="necropolis__tooltip-desc">{region.description}</span>
        <span className="necropolis__tooltip-count">{count} tab{count !== 1 ? 's' : ''} interred</span>
        {topDomains.length > 0 && (
          <div className="necropolis__tooltip-domains">
            {topDomains.map(([domain, n]) => (
              <span key={domain} className="necropolis__tooltip-domain">
                {domain} ({n})
              </span>
            ))}
          </div>
        )}
      </div>
    </foreignObject>
  )
}

/* ─────────────────────────────────────────────────
   Main Necropolis Map Component
   ───────────────────────────────────────────────── */
interface NecropolisMapProps {
  groups: CategoryGroup[]
}

export function NecropolisMap({ groups }: NecropolisMapProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const gRef = useRef<SVGGElement>(null)
  const zoomBehaviorRef = useRef<ZoomBehavior<SVGSVGElement> | null>(null)
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null)

  // Initialize noise with fixed seed for deterministic maps
  useMemo(() => { seedNoise(42) }, [])

  // Build region data: merge category counts with region definitions
  const regionData = useMemo(() => {
    const countMap = new Map<string, { count: number; tabs: Array<{ url: string; domain: string }> }>()
    for (const g of groups) {
      countMap.set(g.category.id, {
        count: g.count,
        tabs: g.tabs.map(t => ({ url: t.url, domain: t.domain })),
      })
    }

    return NECROPOLIS_REGIONS.map(region => {
      const data = countMap.get(region.id)
      return {
        region,
        count: data?.count ?? 0,
        tabs: data?.tabs ?? [],
      }
    })
  }, [groups])

  // Generate continent coastline path
  const coastlinePath = useMemo(() => {
    return generateCoastline(regionData)
  }, [regionData])

  // Generate individual region polygons
  const regionPolygons = useMemo(() => {
    return regionData.map(({ region, count }) => {
      const radiusScale = Math.max(0.7, Math.min(1.3, 0.7 + (count / 80) * 0.6))
      const radius = region.baseRadius * radiusScale
      const points = noisyPolygon(
        region.cx, region.cy,
        radius, 32, 2.5, radius * 0.25,
        region.noiseSeedX, region.noiseSeedY
      )
      return {
        region,
        count,
        path: smoothPath(points, true),
      }
    })
  }, [regionData])

  // Generate scatter terrain icons for each region
  const terrainIcons = useMemo(() => {
    const icons: Array<{ key: string; type: NecropolisRegion['terrainType']; x: number; y: number; scale: number }> = []

    for (const { region, count } of regionData) {
      if (count === 0) continue
      // Place 1-4 terrain icons within the region, more for higher counts
      const numIcons = Math.min(4, Math.max(1, Math.floor(count / 20)))
      for (let i = 0; i < numIcons; i++) {
        const angle = (i / numIcons) * Math.PI * 2 + region.noiseSeedX
        const dist = region.baseRadius * 0.3 + fbm(region.noiseSeedX + i, region.noiseSeedY + i, 2) * 15
        icons.push({
          key: `${region.id}-${i}`,
          type: region.terrainType,
          x: region.cx + Math.cos(angle) * dist,
          y: region.cy + Math.sin(angle) * dist,
          scale: 0.7 + Math.random() * 0.3,
        })
      }
    }
    return icons
  }, [regionData])

  // Generate mountain-range border marks between regions
  const borderMarks = useMemo(() => {
    const marks: Array<{ x: number; y: number; rotation: number }> = []
    // Place small mountain triangles along borders of adjacent regions
    for (let i = 0; i < regionData.length; i++) {
      for (let j = i + 1; j < regionData.length; j++) {
        const a = regionData[i].region
        const b = regionData[j].region
        const dist = Math.hypot(a.cx - b.cx, a.cy - b.cy)
        if (dist < 200) { // Adjacent regions
          const midX = (a.cx + b.cx) / 2
          const midY = (a.cy + b.cy) / 2
          const angle = Math.atan2(b.cy - a.cy, b.cx - a.cx)
          // Add 2-3 small mountain marks along the border
          for (let k = -1; k <= 1; k++) {
            const perpAngle = angle + Math.PI / 2
            marks.push({
              x: midX + Math.cos(perpAngle) * k * 12,
              y: midY + Math.sin(perpAngle) * k * 12,
              rotation: (angle * 180 / Math.PI) + 90,
            })
          }
        }
      }
    }
    return marks
  }, [regionData])

  // D3 zoom setup
  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    const behavior = zoom<SVGSVGElement>()
      .scaleExtent([0.5, 3])
      .on('zoom', (event: unknown) => {
        const g = gRef.current
        if (!g) return
        const e = event as { transform: { toString: () => string } }
        g.setAttribute('transform', e.transform.toString())
      })

    zoomBehaviorRef.current = behavior
    const selection = select(svg)
    selection.call(behavior)

    return () => {
      selection.on('.zoom', null)
      zoomBehaviorRef.current = null
    }
  }, [])

  const handleZoomIn = () => {
    const svg = svgRef.current
    const behavior = zoomBehaviorRef.current
    if (!svg || !behavior) return
    select(svg).call(behavior.scaleBy, 1.4)
  }

  const handleZoomOut = () => {
    const svg = svgRef.current
    const behavior = zoomBehaviorRef.current
    if (!svg || !behavior) return
    select(svg).call(behavior.scaleBy, 1 / 1.4)
  }

  const handleReset = () => {
    const svg = svgRef.current
    const behavior = zoomBehaviorRef.current
    if (!svg || !behavior) return
    select(svg).call(behavior.transform, zoomIdentity)
  }

  const hoveredData = regionData.find(d => d.region.id === hoveredRegion)

  return (
    <section className="section section--necropolis">
      <div className="necropolis__container">
        <h2 className="section__heading necropolis__title">The Necropolis</h2>
        <p className="necropolis__subtitle">
          A cartography of your digital remains. Each region holds the tabs of its kind.
        </p>

        <div className="necropolis__viewport">
          {/* Zoom controls */}
          <div className="necropolis__controls">
            <button className="necropolis__control" onClick={handleZoomIn} aria-label="Zoom in">+</button>
            <button className="necropolis__control" onClick={handleZoomOut} aria-label="Zoom out">−</button>
            <button className="necropolis__control necropolis__control--reset" onClick={handleReset} aria-label="Reset view">⟲</button>
          </div>

          <svg
            ref={svgRef}
            className="necropolis__svg"
            viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
            preserveAspectRatio="xMidYMid meet"
          >
            <ParchmentDefs />

            <g ref={gRef}>
              {/* Background — ocean/water */}
              <rect
                x={-50} y={-50}
                width={MAP_WIDTH + 100} height={MAP_HEIGHT + 100}
                fill={COLORS.water}
                opacity={0.25}
              />

              {/* Parchment background for the continent */}
              {coastlinePath && (
                <path
                  className="necropolis__continent"
                  d={coastlinePath}
                  fill={COLORS.parchment}
                  stroke={COLORS.ink}
                  strokeWidth={2}
                  opacity={0.95}
                  filter="url(#parchment-noise)"
                />
              )}

              {/* Coastline hatching — repeated inner strokes for hand-drawn feel */}
              {coastlinePath && (
                <>
                  <path
                    d={coastlinePath}
                    fill="none"
                    stroke={COLORS.ink}
                    strokeWidth={0.5}
                    strokeDasharray="4 6"
                    opacity={0.15}
                    transform="scale(0.98) translate(10, 7)"
                  />
                </>
              )}

              {/* Border mountain marks */}
              {borderMarks.map((mark, i) => (
                <polygon
                  key={`border-${i}`}
                  points="-3,2 0,-4 3,2"
                  transform={`translate(${mark.x},${mark.y}) rotate(${mark.rotation}) scale(0.6)`}
                  fill={COLORS.ink}
                  opacity={0.12}
                />
              ))}

              {/* Region polygons */}
              {regionPolygons.map(({ region, count, path }) => {
                const isEmpty = count === 0
                const isHovered = hoveredRegion === region.id
                return (
                  <g
                    key={region.id}
                    className={`necropolis__region ${isEmpty ? 'necropolis__region--empty' : ''} ${isHovered ? 'necropolis__region--hover' : ''}`}
                    onMouseEnter={() => setHoveredRegion(region.id)}
                    onMouseLeave={() => setHoveredRegion(null)}
                  >
                    <path
                      d={path}
                      fill={isEmpty ? COLORS.regionEmpty : region.fillColor}
                      stroke={COLORS.ink}
                      strokeWidth={isEmpty ? 0.5 : 1.2}
                      opacity={isEmpty ? 0.5 : 0.85}
                      filter={isHovered && !isEmpty ? 'url(#region-glow)' : undefined}
                    />
                    {isEmpty && (
                      <path
                        d={path}
                        fill="url(#fog-pattern)"
                        stroke="none"
                        opacity={0.5}
                      />
                    )}
                  </g>
                )
              })}

              {/* Terrain scatter icons */}
              {terrainIcons.map(icon => (
                <TerrainIcon
                  key={icon.key}
                  type={icon.type}
                  x={icon.x}
                  y={icon.y}
                  scale={icon.scale}
                />
              ))}

              {/* Region labels */}
              {regionData.map(({ region, count }) => {
                const isEmpty = count === 0
                return (
                  <g
                    key={`label-${region.id}`}
                    className={`necropolis__label ${isEmpty ? 'necropolis__label--empty' : ''}`}
                    onMouseEnter={() => setHoveredRegion(region.id)}
                    onMouseLeave={() => setHoveredRegion(null)}
                  >
                    <text
                      x={region.cx}
                      y={region.cy - region.baseRadius * 0.5 - 8}
                      textAnchor="middle"
                      className="necropolis__label-text"
                      fill={isEmpty ? COLORS.textLight : COLORS.textDark}
                      opacity={isEmpty ? 0.4 : 0.85}
                    >
                      {region.name}
                    </text>
                    {count > 0 && (
                      <text
                        x={region.cx}
                        y={region.cy - region.baseRadius * 0.5 + 4}
                        textAnchor="middle"
                        className="necropolis__label-count"
                        fill={COLORS.textLight}
                        opacity={0.6}
                      >
                        {count} tab{count !== 1 ? 's' : ''}
                      </text>
                    )}
                  </g>
                )
              })}

              {/* Edge decorations */}
              <EdgeDecorations />

              {/* Compass rose */}
              <CompassRose x={900} y={620} size={55} />

              {/* Map title cartouche */}
              <g className="necropolis__cartouche" transform="translate(500, 42)">
                <rect
                  x={-130} y={-18}
                  width={260} height={36}
                  rx={4}
                  fill={COLORS.parchment}
                  stroke={COLORS.ink}
                  strokeWidth={1.5}
                  opacity={0.9}
                />
                <rect
                  x={-126} y={-14}
                  width={252} height={28}
                  rx={2}
                  fill="none"
                  stroke={COLORS.ink}
                  strokeWidth={0.5}
                  opacity={0.3}
                />
                <text
                  x={0} y={5}
                  textAnchor="middle"
                  fontFamily="'Cinzel', serif"
                  fontSize={14}
                  fontWeight={700}
                  fill={COLORS.textDark}
                  letterSpacing="0.2em"
                >
                  THE NECROPOLIS
                </text>
              </g>

              {/* Tooltip for hovered region */}
              {hoveredData && hoveredData.count > 0 && (
                <RegionTooltip
                  region={hoveredData.region}
                  count={hoveredData.count}
                  tabs={hoveredData.tabs}
                  svgX={hoveredData.region.cx}
                  svgY={hoveredData.region.cy}
                />
              )}
            </g>
          </svg>
        </div>

        {/* Legend */}
        <div className="necropolis__legend">
          {regionData
            .filter(d => d.count > 0)
            .sort((a, b) => b.count - a.count)
            .map(({ region, count }) => (
            <div
              key={region.id}
              className={`necropolis__legend-item ${hoveredRegion === region.id ? 'necropolis__legend-item--active' : ''}`}
              onMouseEnter={() => setHoveredRegion(region.id)}
              onMouseLeave={() => setHoveredRegion(null)}
            >
              <span
                className="necropolis__legend-swatch"
                style={{ backgroundColor: region.fillColor }}
              />
              <span className="necropolis__legend-name">{region.name}</span>
              <span className="necropolis__legend-count">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
