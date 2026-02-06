import { useEffect, useMemo, useRef, useState } from 'react'
import { geoMercator, geoPath } from 'd3-geo'
import { select } from 'd3-selection'
import { zoom, zoomIdentity, type ZoomBehavior } from 'd3-zoom'
import { feature } from 'topojson-client'
import type { FeatureCollection, Geometry } from 'geojson'
import type { Topology } from 'topojson-specification'
import { CATEGORY_GROUPS, getClusteredLocations, type ClusteredLocation, type TabEntry } from '../data/mockData'
import './sections.css'

const MAP_WIDTH = 1000
const MAP_HEIGHT = 600

interface MapCluster {
  id: string
  x: number
  y: number
  members: ClusteredLocation[]
  totalCount: number
  domains: { domain: string; count: number }[]
  label: string
  tabs: { tab: TabEntry; location: string }[]
}

interface MarkerProps {
  cluster: MapCluster
  isSelected: boolean
  onSelect: () => void
  onDeselect: () => void
}

function GraveMarker({ cluster, isSelected, onSelect, onDeselect }: MarkerProps) {
  // Size based on total count
  const size = Math.min(8 + Math.log2(cluster.totalCount + 1) * 4, 24)

  return (
    <g
      className={`map-marker ${isSelected ? 'map-marker--selected' : ''}`}
      transform={`translate(${cluster.x}, ${cluster.y})`}
      onMouseEnter={onSelect}
      onMouseLeave={onDeselect}
      onClick={onSelect}
    >
      {/* Glow effect */}
      <circle
        className="map-marker__glow"
        cx={0}
        cy={0}
        r={size + 5}
        fill="none"
      />
      {/* Tiny gravestone */}
      <path
        className="map-marker__stone"
        d={`M ${-size * 0.35} ${size * 0.45}
            V ${-size * 0.1}
            C ${-size * 0.35} ${-size * 0.5} ${-size * 0.15} ${-size * 0.7} 0 ${-size * 0.7}
            C ${size * 0.15} ${-size * 0.7} ${size * 0.35} ${-size * 0.5} ${size * 0.35} ${-size * 0.1}
            V ${size * 0.45} Z`}
      />
      <path
        className="map-marker__cross"
        d={`M 0,${-size * 0.45} V ${-size * 0.1} M ${-size * 0.14},${-size * 0.28} H ${size * 0.14}`}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </g>
  )
}

interface TooltipProps {
  cluster: MapCluster
  debug?: boolean
  onHoverStart: () => void
  onHoverEnd: () => void
  onViewAll: () => void
}

function Tooltip({ cluster, debug, onHoverStart, onHoverEnd, onViewAll }: TooltipProps) {
  const { x: svgX, y: svgY } = cluster

  // Position tooltip above or below based on y position
  const tooltipY = svgY < 150 ? svgY + 30 : svgY - 80

  return (
    <foreignObject
      x={Math.max(10, Math.min(svgX - 80, 640))}
      y={tooltipY}
      width={180}
      height={140}
      className="map-tooltip"
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
    >
      <div className="map-tooltip__content">
        <span className="map-tooltip__city">{cluster.label}</span>
        <span className="map-tooltip__count">{cluster.totalCount} tabs</span>
        <div className="map-tooltip__domains">
          {cluster.domains.slice(0, 3).map(d => (
            <span key={d.domain} className="map-tooltip__domain">
              {d.domain} ({d.count})
            </span>
          ))}
          {cluster.domains.length > 3 && (
            <span className="map-tooltip__more">
              +{cluster.domains.length - 3} more
            </span>
          )}
        </div>
        {cluster.tabs.length > 0 && (
          <button
            type="button"
            className="map-tooltip__button"
            onClick={onViewAll}
          >
            View all links ({cluster.tabs.length})
          </button>
        )}
        {debug && (
          <div className="map-tooltip__debug">
            <span>members: {cluster.members.length}</span>
            <span>x: {Math.round(svgX)} y: {Math.round(svgY)}</span>
            <span>domains: {cluster.domains.length}</span>
            <span>links: {cluster.tabs.length}</span>
          </div>
        )}
      </div>
    </foreignObject>
  )
}

export type WorldMapMode = 'map' | 'web'

interface WorldMapProps {
  locations?: ClusteredLocation[]
  tabs?: TabEntry[]
  title?: string
  subtitle?: string
  mode?: WorldMapMode
}

function closedPath(points: Array<{ x: number; y: number }>): string {
  if (points.length === 0) return ''
  let d = `M ${points[0].x} ${points[0].y}`
  for (let i = 1; i < points.length; i++) {
    d += ` L ${points[i].x} ${points[i].y}`
  }
  return d + ' Z'
}

export function WorldMap({
  locations: locationsProp,
  tabs: tabsProp,
  title = 'The Map',
  subtitle = 'Where your tabs came from. Tap markers to see domains. Larger marker = more tabs.',
  mode = 'map',
}: WorldMapProps) {
  const [hoveredCluster, setHoveredCluster] = useState<MapCluster | null>(null)
  const [selectedCluster, setSelectedCluster] = useState<MapCluster | null>(null)
  const [linksCluster, setLinksCluster] = useState<MapCluster | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const gRef = useRef<SVGGElement>(null)
  const zoomBehaviorRef = useRef<ZoomBehavior | null>(null)
  const [landFeature, setLandFeature] = useState<FeatureCollection<Geometry> | null>(null)

  const locations = useMemo(
    () => locationsProp ?? getClusteredLocations(),
    [locationsProp]
  )
  const allTabs = useMemo(
    () => tabsProp ?? CATEGORY_GROUPS.flatMap((g) => g.tabs),
    [tabsProp]
  )
  const debug = typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('mapdebug')

  useEffect(() => {
    let cancelled = false
    fetch('/land-50m.json')
      .then((res) => res.json())
      .then((topology: Topology) => {
        if (cancelled) return
        const land = feature(topology, topology.objects.land) as FeatureCollection<Geometry>
        setLandFeature(land)
      })
      .catch((error) => {
        console.error('Failed to load land-50m.json:', error)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const projection = useMemo(() => {
    if (!landFeature) return null
    return geoMercator().fitSize([MAP_WIDTH, MAP_HEIGHT], landFeature)
  }, [landFeature])

  const landPath = useMemo(() => {
    if (!landFeature || !projection) return ''
    return geoPath(projection)(landFeature) || ''
  }, [landFeature, projection])

  const domainTabs = useMemo(() => {
    const map = new Map<string, TabEntry[]>()
    for (const tab of allTabs) {
      const list = map.get(tab.domain) || []
      list.push(tab)
      map.set(tab.domain, list)
    }
    return map
  }, [allTabs])

  const clusters = useMemo<MapCluster[]>(() => {
    if (!projection) return []

    const threshold = 26
    const result: MapCluster[] = []

    for (const loc of locations) {
      const point = projection([loc.lng, loc.lat])
      if (!point) continue
      const [x, y] = point

      let assigned: MapCluster | null = null
      for (const cluster of result) {
        const dx = cluster.x - x
        const dy = cluster.y - y
        if (Math.hypot(dx, dy) < threshold) {
          assigned = cluster
          break
        }
      }

      if (!assigned) {
        const tabs: { tab: TabEntry; location: string }[] = []
        for (const domain of loc.domains) {
          const domainList = domainTabs.get(domain.domain) || []
          for (const tab of domainList) {
            tabs.push({ tab, location: loc.city })
          }
        }
        result.push({
          id: loc.city,
          x,
          y,
          members: [loc],
          totalCount: loc.totalCount,
          domains: [...loc.domains],
          label: loc.city,
          tabs,
        })
        continue
      }

      assigned.members.push(loc)
      assigned.totalCount += loc.totalCount
      assigned.x = (assigned.x * (assigned.members.length - 1) + x) / assigned.members.length
      assigned.y = (assigned.y * (assigned.members.length - 1) + y) / assigned.members.length

      const domainCounts = new Map<string, number>()
      for (const entry of assigned.domains) {
        domainCounts.set(entry.domain, entry.count)
      }
      for (const entry of loc.domains) {
        domainCounts.set(entry.domain, (domainCounts.get(entry.domain) || 0) + entry.count)
      }
      assigned.domains = Array.from(domainCounts.entries())
        .map(([domain, count]) => ({ domain, count }))
        .sort((a, b) => b.count - a.count)

      const tabMap = new Map<string, { tab: TabEntry; location: string }>()
      for (const member of assigned.members) {
        for (const domain of member.domains) {
          const domainList = domainTabs.get(domain.domain) || []
          for (const tab of domainList) {
            tabMap.set(tab.url, { tab, location: member.city })
          }
        }
      }
      assigned.tabs = Array.from(tabMap.values())

      assigned.label = assigned.members.length === 1
        ? assigned.members[0].city
        : `${assigned.members.length} places`
    }

    return result
  }, [locations, projection, domainTabs])

  const web = useMemo(() => {
    if (mode !== 'web') return null
    if (clusters.length < 3) return null

    const centerX = clusters.reduce((acc, c) => acc + c.x, 0) / clusters.length
    const centerY = clusters.reduce((acc, c) => acc + c.y, 0) / clusters.length

    const ordered = [...clusters].sort((a, b) => {
      const aAngle = Math.atan2(a.y - centerY, a.x - centerX)
      const bAngle = Math.atan2(b.y - centerY, b.x - centerX)
      return aAngle - bAngle
    })

    const base = ordered.map((c) => ({ x: c.x, y: c.y }))
    const rings = [0.66, 0.33].map((scale) =>
      base.map((p) => ({
        x: centerX + (p.x - centerX) * scale,
        y: centerY + (p.y - centerY) * scale,
      }))
    )

    const rays = base.map((p) => ({
      x1: centerX,
      y1: centerY,
      x2: p.x,
      y2: p.y,
    }))

    return {
      ring: closedPath(base),
      rings: rings.map((points) => closedPath(points)),
      rays,
    }
  }, [mode, clusters])

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    const behavior = zoom()
      .scaleExtent([0.5, 4])
      .on('zoom', (event: unknown) => {
        const maybe = event as { transform?: { toString?: () => string } } | null
        const t = maybe?.transform
        if (!t || typeof t.toString !== 'function') return
        const g = gRef.current
        if (!g) return
        g.setAttribute('transform', t.toString())
      })

    zoomBehaviorRef.current = behavior

    const selection = select(svg)
    selection.call(behavior)
    return () => {
      selection.on('.zoom', null)
      zoomBehaviorRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!projection || clusters.length === 0) return
    const behavior = zoomBehaviorRef.current
    if (!behavior) return
    const points = clusters.map((cluster) => [cluster.x, cluster.y] as [number, number])
    if (points.length === 0) return

    let minX = Infinity
    let minY = Infinity
    let maxX = -Infinity
    let maxY = -Infinity
    for (const [x, y] of points) {
      minX = Math.min(minX, x)
      minY = Math.min(minY, y)
      maxX = Math.max(maxX, x)
      maxY = Math.max(maxY, y)
    }

    const padding = 40
    minX -= padding
    minY -= padding
    maxX += padding
    maxY += padding

    const boundsWidth = Math.max(1, maxX - minX)
    const boundsHeight = Math.max(1, maxY - minY)
    const fitScale = Math.min(MAP_WIDTH / boundsWidth, MAP_HEIGHT / boundsHeight)
    const targetScale = Math.min(4, fitScale)

    const boundsCenterX = (minX + maxX) / 2
    const boundsCenterY = (minY + maxY) / 2
    const translateX = MAP_WIDTH / 2 - boundsCenterX * targetScale
    const translateY = MAP_HEIGHT / 2 - boundsCenterY * targetScale

    const transform = zoomIdentity.translate(translateX, translateY).scale(targetScale)
    const svg = svgRef.current
    if (gRef.current) {
      gRef.current.setAttribute('transform', transform.toString())
    }
    if (svg) {
      select(svg).call(behavior.transform, transform)
    }
  }, [projection, clusters])

  // Zoom handlers
  const handleZoomIn = () => {
    const svg = svgRef.current
    const behavior = zoomBehaviorRef.current
    if (!svg || !behavior) return
    select(svg).call(behavior.scaleBy, 1.5)
  }

  const handleZoomOut = () => {
    const svg = svgRef.current
    const behavior = zoomBehaviorRef.current
    if (!svg || !behavior) return
    select(svg).call(behavior.scaleBy, 1 / 1.5)
  }

  const handleReset = () => {
    const svg = svgRef.current
    const behavior = zoomBehaviorRef.current
    if (!svg || !behavior) return
    select(svg).call(behavior.transform, zoomIdentity)
  }

	  return (
	    <section className="section section--worldmap">
	      <div className="worldmap__container">
	        <h2 className="section__heading">{title}</h2>
	        <p className="worldmap__subtitle">{subtitle}</p>

        {/* Map SVG */}
        <div className="worldmap__viewport">
          {/* Zoom controls */}
          <div className="worldmap__controls">
            <button
              className="worldmap__control"
              onClick={handleZoomIn}
              aria-label="Zoom in"
            >
              +
            </button>
            <button
              className="worldmap__control"
              onClick={handleZoomOut}
              aria-label="Zoom out"
            >
              −
            </button>
            <button
              className="worldmap__control worldmap__control--reset"
              onClick={handleReset}
              aria-label="Reset view"
            >
              ⟲
            </button>
          </div>
          <svg
            ref={svgRef}
            className="worldmap__svg"
            viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
            preserveAspectRatio="xMidYMid meet"
          >
            <g ref={gRef}>
              {/* World outline (D3 geo) */}
              {landPath && (
                <path
                  className="worldmap__land"
                  d={landPath}
                />
              )}

	              {/* Grid lines for visual reference */}
	              {mode === 'map' && (
	                <g className="worldmap__grid" opacity="0.1">
	                  {[0, 150, 300, 450, 600].map(y => (
	                    <line key={`h${y}`} x1="0" y1={y} x2={MAP_WIDTH} y2={y} stroke="var(--color-stone)" />
	                  ))}
	                  {[0, 200, 400, 600, 800, 1000].map(x => (
	                    <line key={`v${x}`} x1={x} y1="0" x2={x} y2={MAP_HEIGHT} stroke="var(--color-stone)" />
	                  ))}
	                </g>
	              )}

	              {/* Web overlay */}
	              {mode === 'web' && web && (
	                <g className="worldmap__web">
	                  {web.rings.map((d, i) => (
	                    <path key={`ring${i}`} className="worldmap__web-ring" d={d} />
	                  ))}
	                  <path className="worldmap__web-ring worldmap__web-ring--outer" d={web.ring} />
	                  {web.rays.map((ray, i) => (
	                    <line
	                      key={`ray${i}`}
	                      className="worldmap__web-ray"
	                      x1={ray.x1}
	                      y1={ray.y1}
	                      x2={ray.x2}
	                      y2={ray.y2}
	                    />
	                  ))}
	                </g>
	              )}

              {/* Markers */}
              {projection && clusters.map(cluster => (
                <GraveMarker
                  key={cluster.id}
                  cluster={cluster}
                  isSelected={selectedCluster?.id === cluster.id}
                  onSelect={() => setSelectedCluster((current) => current?.id === cluster.id ? null : cluster)}
                  onDeselect={() => setHoveredCluster((current) => current?.id === cluster.id ? null : current)}
                />
              ))}

              {/* Tooltip */}
              {(selectedCluster || hoveredCluster) && (
                <Tooltip
                  cluster={selectedCluster || hoveredCluster!}
                  debug={debug}
                  onHoverStart={() => setHoveredCluster(selectedCluster || hoveredCluster!)}
                  onHoverEnd={() => setHoveredCluster(null)}
                  onViewAll={() => {
                    const active = selectedCluster || hoveredCluster
                    if (!active) return
                    setSelectedCluster(active)
                    setLinksCluster(active)
                  }}
                />
              )}
            </g>
          </svg>
        </div>

        {/* Legend removed (size is described in subtitle) */}
        {linksCluster && (
          <div className="map-links-modal" onClick={() => setLinksCluster(null)}>
            <div className="map-links-panel" onClick={(e) => e.stopPropagation()}>
              <button
                className="map-links-close"
                onClick={() => setLinksCluster(null)}
                aria-label="Close links"
              >
                ×
              </button>
              <h3 className="map-links-title">{linksCluster.label}</h3>
              <p className="map-links-subtitle">
                Showing {linksCluster.tabs.length} links from mapped domains.
              </p>
              <div className="map-links-list">
	                {linksCluster.tabs.map(({ tab, location }, i) => (
	                  <a
	                    key={`${tab.url}:${location}:${i}`}
	                    className="map-links-item"
	                    href={tab.url}
	                    target="_blank"
	                    rel="noreferrer"
                  >
                    <span className="map-links-domain">{tab.domain}</span>
                    <span className="map-links-title-text">{tab.title || tab.url}</span>
                    <span className="map-links-location">{location}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
