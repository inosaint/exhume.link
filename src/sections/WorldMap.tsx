import { useState, useRef } from 'react'
import { getClusteredLocations, type ClusteredLocation } from '../data/mockData'
import './sections.css'

// Simplified world map SVG path (Natural Earth projection style)
const WORLD_PATH = `M 50,120 C 55,110 65,105 80,100 L 120,95 C 140,90 160,85 180,80 L 220,75 C 250,70 280,65 310,60 L 350,55 C 380,50 410,48 440,50 L 480,55 C 510,60 540,70 560,85 L 580,100 C 590,110 595,120 590,135 L 580,155 C 570,170 555,180 535,185 L 500,190 C 470,195 440,198 410,195 L 370,188 C 340,182 310,175 280,180 L 240,190 C 210,200 180,210 150,205 L 120,195 C 95,185 75,170 60,150 L 50,130 Z
M 620,80 C 640,75 660,72 680,75 L 710,82 C 735,90 755,100 770,115 L 780,135 C 785,155 780,175 765,190 L 740,205 C 715,218 685,225 655,220 L 625,210 C 600,198 580,180 575,158 L 578,130 C 585,105 600,88 620,80 Z`

// Convert lat/lng to SVG coordinates (simple equirectangular)
function latLngToXY(lat: number, lng: number): { x: number; y: number } {
  // Map bounds: x: 0-800, y: 0-400
  // Lng: -180 to 180 -> 0 to 800
  // Lat: 90 to -90 -> 0 to 400
  const x = ((lng + 180) / 360) * 800
  const y = ((90 - lat) / 180) * 400
  return { x, y }
}

interface MarkerProps {
  location: ClusteredLocation
  isSelected: boolean
  onSelect: () => void
  onDeselect: () => void
}

function GraveMarker({ location, isSelected, onSelect, onDeselect }: MarkerProps) {
  const { x, y } = latLngToXY(location.lat, location.lng)

  // Size based on total count
  const size = Math.min(8 + Math.log2(location.totalCount + 1) * 4, 24)

  return (
    <g
      className={`map-marker ${isSelected ? 'map-marker--selected' : ''}`}
      transform={`translate(${x}, ${y})`}
      onMouseEnter={onSelect}
      onMouseLeave={onDeselect}
      onClick={onSelect}
    >
      {/* Glow effect */}
      <circle
        className="map-marker__glow"
        cx={0}
        cy={0}
        r={size + 4}
        fill="none"
      />
      {/* Cross/grave marker */}
      <circle
        className="map-marker__base"
        cx={0}
        cy={0}
        r={size / 2}
      />
      <path
        className="map-marker__cross"
        d={`M 0,${-size/3} V ${size/3} M ${-size/3},0 H ${size/3}`}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </g>
  )
}

interface TooltipProps {
  location: ClusteredLocation
}

function Tooltip({ location }: TooltipProps) {
  const { x: svgX, y: svgY } = latLngToXY(location.lat, location.lng)

  // Position tooltip above or below based on y position
  const tooltipY = svgY < 150 ? svgY + 30 : svgY - 80

  return (
    <foreignObject
      x={Math.max(10, Math.min(svgX - 80, 640))}
      y={tooltipY}
      width={160}
      height={100}
      className="map-tooltip"
    >
      <div className="map-tooltip__content">
        <span className="map-tooltip__city">{location.city}</span>
        <span className="map-tooltip__count">{location.totalCount} tabs</span>
        <div className="map-tooltip__domains">
          {location.domains.slice(0, 3).map(d => (
            <span key={d.domain} className="map-tooltip__domain">
              {d.domain} ({d.count})
            </span>
          ))}
          {location.domains.length > 3 && (
            <span className="map-tooltip__more">
              +{location.domains.length - 3} more
            </span>
          )}
        </div>
      </div>
    </foreignObject>
  )
}

export function WorldMap() {
  const [selectedLocation, setSelectedLocation] = useState<ClusteredLocation | null>(null)
  const [scale, setScale] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const svgRef = useRef<SVGSVGElement>(null)

  const locations = getClusteredLocations()

  // Zoom handlers
  const handleZoomIn = () => setScale(s => Math.min(s * 1.5, 4))
  const handleZoomOut = () => setScale(s => Math.max(s / 1.5, 0.5))
  const handleReset = () => {
    setScale(1)
    setPan({ x: 0, y: 0 })
  }

  // Pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    })
  }

  const handleMouseUp = () => setIsDragging(false)

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true)
      setDragStart({
        x: e.touches[0].clientX - pan.x,
        y: e.touches[0].clientY - pan.y,
      })
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return
    setPan({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y,
    })
  }

  const handleTouchEnd = () => setIsDragging(false)

  return (
    <section className="section section--worldmap">
      <div className="worldmap__container">
        <h2 className="section__heading">The Map</h2>
        <p className="worldmap__subtitle">
          Where your tabs came from. Tap markers to see domains.
        </p>

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

        {/* Map SVG */}
        <div className="worldmap__viewport">
          <svg
            ref={svgRef}
            className="worldmap__svg"
            viewBox="0 0 800 400"
            preserveAspectRatio="xMidYMid meet"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
              cursor: isDragging ? 'grabbing' : 'grab',
            }}
          >
            <g
              transform={`translate(${pan.x}, ${pan.y}) scale(${scale})`}
              style={{ transformOrigin: 'center' }}
            >
              {/* World outline */}
              <path
                className="worldmap__land"
                d={WORLD_PATH}
                fill="var(--color-bg-raised)"
                stroke="var(--color-stone)"
                strokeWidth="1"
              />

              {/* Grid lines for visual reference */}
              <g className="worldmap__grid" opacity="0.1">
                {[0, 100, 200, 300, 400].map(y => (
                  <line key={`h${y}`} x1="0" y1={y} x2="800" y2={y} stroke="var(--color-stone)" />
                ))}
                {[0, 100, 200, 300, 400, 500, 600, 700, 800].map(x => (
                  <line key={`v${x}`} x1={x} y1="0" x2={x} y2="400" stroke="var(--color-stone)" />
                ))}
              </g>

              {/* Markers */}
              {locations.map(loc => (
                <GraveMarker
                  key={loc.city}
                  location={loc}
                  isSelected={selectedLocation?.city === loc.city}
                  onSelect={() => setSelectedLocation(loc)}
                  onDeselect={() => setSelectedLocation(null)}
                />
              ))}

              {/* Tooltip */}
              {selectedLocation && (
                <Tooltip location={selectedLocation} />
              )}
            </g>
          </svg>
        </div>

        {/* Legend */}
        <div className="worldmap__legend">
          <span className="worldmap__legend-item">
            <span className="worldmap__legend-marker worldmap__legend-marker--small" />
            1-10 tabs
          </span>
          <span className="worldmap__legend-item">
            <span className="worldmap__legend-marker worldmap__legend-marker--medium" />
            11-50 tabs
          </span>
          <span className="worldmap__legend-item">
            <span className="worldmap__legend-marker worldmap__legend-marker--large" />
            50+ tabs
          </span>
        </div>
      </div>
    </section>
  )
}
