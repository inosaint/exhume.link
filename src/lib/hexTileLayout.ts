/**
 * Hex tile layout engine — two approaches for comparison.
 *
 * 1. forceLayout(): d3-force simulation clusters hexes by category
 * 2. hexbinLayout(): d3-hexbin places hexes on a regular grid, grouped by category proximity
 */
import {
  forceSimulation,
  forceX,
  forceY,
  forceCollide,
  forceManyBody,
} from 'd3-force'
import { hexbin as d3Hexbin } from 'd3-hexbin'
import type { CategoryGroup, CategoryId, TabEntry } from '../data/mockData'

/* ── Shared types ── */

export interface HexTile {
  id: string
  category: CategoryId
  tab: TabEntry
  x: number
  y: number
  radius: number
  color: string
}

interface ForceNode extends HexTile {
  vx?: number
  vy?: number
  index?: number
}

/* ── Constants ── */

export const MAP_W = 2400
export const MAP_H = 600
const HEX_R = 12 // circumradius
const HEXBIN_RADIUS = HEX_R * 1.8

/* ── Hex-specific colors (dark gothic palette — does NOT modify necropolisRegions) ── */

const HEX_COLORS: Record<CategoryId, string> = {
  reading:    '#6b3a3a', // deep burgundy
  design:     '#3a6b5e', // muted teal
  tools:      '#5a5a5a', // iron gray
  social:     '#5a3a6b', // muted purple
  video:      '#3a4a6b', // dark slate blue
  shopping:   '#6b5a2a', // dark amber
  news:       '#3a5a6b', // ink blue
  portfolios: '#6b5a3a', // warm ochre
  jobs:       '#5a4a3a', // dark bronze
  events:     '#3a5a3a', // moss green
  travel:     '#3a5a5a', // sea teal
  other:      '#4a4440', // ashen gray
}

/* ── Hex-specific center positions (landscape spread, touching clusters) ── */

const HEX_CENTERS: Record<CategoryId, { cx: number; cy: number }> = {
  // Upper band — stretched horizontally
  reading:    { cx: 220, cy: 190 },
  design:     { cx: 620, cy: 170 },
  news:       { cx: 1020, cy: 190 },
  social:     { cx: 1420, cy: 175 },
  video:      { cx: 1820, cy: 205 },
  events:     { cx: 2220, cy: 185 },

  // Lower band — offset for a wide flow
  tools:      { cx: 220, cy: 380 },
  portfolios: { cx: 620, cy: 400 },
  shopping:   { cx: 1020, cy: 370 },
  jobs:       { cx: 1420, cy: 395 },
  travel:     { cx: 1820, cy: 385 },
  other:      { cx: 2220, cy: 365 },
}

/* ── Force layout tuning (pull clusters closer together) ── */

const FORCE_SQUEEZE_X = 0.65
const FORCE_SQUEEZE_Y = 0.7
const FORCE_JITTER = 60
const GLOBAL_GRAVITY_X = 0.05
const GLOBAL_GRAVITY_Y = 0.02

/* ── Hexbin continent mask + river carve ── */

const CONTINENT_RX = MAP_W * 0.48
const CONTINENT_RY = MAP_H * 0.54
const RIVER_BASE_Y = MAP_H * 0.52
const RIVER_AMPLITUDE = 62
const RIVER_SECONDARY = 20
const RIVER_WIDTH = 50

function riverCenterY(x: number): number {
  const t = x / MAP_W
  return RIVER_BASE_Y
    + Math.sin(t * Math.PI * 2 * 0.85 + 0.4) * RIVER_AMPLITUDE
    + Math.sin(t * Math.PI * 4 + 1.1) * RIVER_SECONDARY
}

function riverWidthAt(x: number, width: number): number {
  const t = x / MAP_W
  return width * (0.85 + 0.2 * Math.sin(t * Math.PI * 2 + 0.8))
}

function isInRiver(x: number, y: number, width: number): boolean {
  const cy = riverCenterY(x)
  return Math.abs(y - cy) <= riverWidthAt(x, width)
}

function isInContinent(x: number, y: number): boolean {
  const dx = (x - MAP_W / 2) / CONTINENT_RX
  const dy = (y - MAP_H / 2) / CONTINENT_RY
  const ripple =
    0.08 * Math.sin((x / MAP_W) * Math.PI * 6) +
    0.05 * Math.sin((y / MAP_H) * Math.PI * 4) +
    0.04 * Math.sin(((x + y) / (MAP_W + MAP_H)) * Math.PI * 8)
  return (dx * dx + dy * dy) <= (1 + ripple)
}

export function hexbinRiverPath(): string {
  const points: Array<{ x: number; y: number }> = []
  const step = 40
  for (let x = -80; x <= MAP_W + 80; x += step) {
    points.push({ x, y: riverCenterY(x) })
  }
  if (points.length === 0) return ''

  let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`
  for (let i = 1; i < points.length; i++) {
    const p = points[i]
    d += ` L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`
  }
  return d
}

/* ── Hex geometry ── */

/** Flat-top hexagon SVG points string */
export function hexPoints(cx: number, cy: number, r: number): string {
  const pts: string[] = []
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 180) * (60 * i)
    pts.push(`${(cx + r * Math.cos(angle)).toFixed(1)},${(cy + r * Math.sin(angle)).toFixed(1)}`)
  }
  return pts.join(' ')
}

/* ── Category center + color lookup ── */

function getCategoryMeta(id: CategoryId): { cx: number; cy: number; color: string } {
  const center = HEX_CENTERS[id]
  const color = HEX_COLORS[id]
  if (center && color) return { cx: center.cx, cy: center.cy, color }
  return { cx: MAP_W / 2, cy: MAP_H / 2, color: '#4a4440' }
}

function getForceMeta(id: CategoryId): { cx: number; cy: number; color: string } {
  const base = getCategoryMeta(id)
  return {
    color: base.color,
    cx: MAP_W / 2 + (base.cx - MAP_W / 2) * FORCE_SQUEEZE_X,
    cy: MAP_H / 2 + (base.cy - MAP_H / 2) * FORCE_SQUEEZE_Y,
  }
}

/* ── Hexbin-specific: use the same horizontal centers/colors ── */

function getHexbinMeta(id: CategoryId): { cx: number; cy: number; color: string } {
  return getCategoryMeta(id)
}

/* ── Layout 1: d3-force ── */

export function forceLayout(groups: CategoryGroup[]): HexTile[] {
  const nodes: ForceNode[] = []
  let idx = 0

  for (const g of groups) {
    const meta = getForceMeta(g.category.id)
    for (const tab of g.tabs) {
      nodes.push({
        id: `${g.category.id}-${idx++}`,
        category: g.category.id,
        tab,
        x: meta.cx + (Math.random() - 0.5) * FORCE_JITTER,
        y: meta.cy + (Math.random() - 0.5) * FORCE_JITTER,
        radius: HEX_R,
        color: meta.color,
      })
    }
  }

  const sim = forceSimulation<ForceNode>(nodes)
    .force('charge', forceManyBody().strength(-1))
    .force('collide', forceCollide<ForceNode>(HEX_R * 1.15).iterations(2))
    .force('x', forceX<ForceNode>(d => getForceMeta(d.category).cx).strength(0.25))
    .force('y', forceY<ForceNode>(d => getForceMeta(d.category).cy).strength(0.25))
    .force('gravity-x', forceX<ForceNode>(MAP_W / 2).strength(GLOBAL_GRAVITY_X))
    .force('gravity-y', forceY<ForceNode>(MAP_H / 2).strength(GLOBAL_GRAVITY_Y))
    .stop()

  // Run synchronously
  for (let i = 0; i < 300; i++) sim.tick()

  return nodes.map(n => ({
    id: n.id,
    category: n.category,
    tab: n.tab,
    x: n.x,
    y: n.y,
    radius: n.radius,
    color: n.color,
  }))
}

/* ── Layout 2: d3-hexbin ── */

export function hexbinLayout(groups: CategoryGroup[]): HexTile[] {
  // Flatten all tabs with their category center targets
  const items: Array<{ tab: TabEntry; category: CategoryId; targetX: number; targetY: number; color: string }> = []
  for (const g of groups) {
    const meta = getHexbinMeta(g.category.id)
    for (const tab of g.tabs) {
      items.push({ tab, category: g.category.id, targetX: meta.cx, targetY: meta.cy, color: meta.color })
    }
  }

  // Create hexbin generator to get a regular hex grid
  const binRadius = HEXBIN_RADIUS
  const generator = d3Hexbin<[number, number]>()
    .x(d => d[0])
    .y(d => d[1])
    .radius(binRadius)
    .extent([[0, 0], [MAP_W, MAP_H]])

  // Generate all possible hex centers covering the map
  const allCenters = generator.centers()

  const filterCenters = (riverWidth: number) => {
    return allCenters.filter(([x, y]) => isInContinent(x, y) && !isInRiver(x, y, riverWidth))
  }

  let riverWidth = RIVER_WIDTH
  let availableCenters = filterCenters(riverWidth)
  while (availableCenters.length < items.length && riverWidth > 18) {
    riverWidth -= 6
    availableCenters = filterCenters(riverWidth)
  }

  // Sort items by category so same-category tabs stay together
  items.sort((a, b) => {
    if (a.category === b.category) return 0
    return a.category < b.category ? -1 : 1
  })

  // For each item, find the closest available hex center to its target
  const usedCenters = new Set<string>()
  const tiles: HexTile[] = []

  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    let bestCenter: [number, number] | null = null
    let bestDist = Infinity

    for (const center of availableCenters) {
      const key = `${center[0].toFixed(1)},${center[1].toFixed(1)}`
      if (usedCenters.has(key)) continue
      const dx = center[0] - item.targetX
      const dy = center[1] - item.targetY
      const dist = dx * dx + dy * dy
      if (dist < bestDist) {
        bestDist = dist
        bestCenter = center
      }
    }

    if (bestCenter) {
      const key = `${bestCenter[0].toFixed(1)},${bestCenter[1].toFixed(1)}`
      usedCenters.add(key)
      tiles.push({
        id: `${item.category}-${i}`,
        category: item.category,
        tab: item.tab,
        x: bestCenter[0],
        y: bestCenter[1],
        radius: binRadius * 0.9,
        color: item.color,
      })
    }
  }

  return tiles
}
