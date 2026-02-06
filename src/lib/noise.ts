/**
 * Simple 2D Perlin-style noise for procedural terrain generation.
 * Used by the Necropolis map to generate organic coastlines and terrain.
 */

// Permutation table (classic Perlin)
const P = new Uint8Array(512)
const GRAD = [
  [1, 1], [-1, 1], [1, -1], [-1, -1],
  [1, 0], [-1, 0], [0, 1], [0, -1],
]

function initPermutation(seed: number) {
  const perm = new Uint8Array(256)
  for (let i = 0; i < 256; i++) perm[i] = i
  // Fisher-Yates shuffle with seed
  let s = seed
  for (let i = 255; i > 0; i--) {
    s = (s * 16807 + 0) % 2147483647
    const j = s % (i + 1)
    const tmp = perm[i]
    perm[i] = perm[j]
    perm[j] = tmp
  }
  for (let i = 0; i < 512; i++) P[i] = perm[i & 255]
}

function fade(t: number): number {
  return t * t * t * (t * (t * 6 - 15) + 10)
}

function lerp(a: number, b: number, t: number): number {
  return a + t * (b - a)
}

function grad2(hash: number, x: number, y: number): number {
  const g = GRAD[hash & 7]
  return g[0] * x + g[1] * y
}

/**
 * 2D Perlin noise. Returns value in [-1, 1].
 */
export function noise2d(x: number, y: number): number {
  const xi = Math.floor(x) & 255
  const yi = Math.floor(y) & 255
  const xf = x - Math.floor(x)
  const yf = y - Math.floor(y)

  const u = fade(xf)
  const v = fade(yf)

  const aa = P[P[xi] + yi]
  const ab = P[P[xi] + yi + 1]
  const ba = P[P[xi + 1] + yi]
  const bb = P[P[xi + 1] + yi + 1]

  return lerp(
    lerp(grad2(aa, xf, yf), grad2(ba, xf - 1, yf), u),
    lerp(grad2(ab, xf, yf - 1), grad2(bb, xf - 1, yf - 1), u),
    v
  )
}

/**
 * Fractal Brownian Motion — layered noise for natural-looking terrain.
 * @param x - X coordinate
 * @param y - Y coordinate
 * @param octaves - Number of noise layers (more = more detail)
 * @param lacunarity - Frequency multiplier per octave
 * @param persistence - Amplitude multiplier per octave
 */
export function fbm(
  x: number,
  y: number,
  octaves = 4,
  lacunarity = 2.0,
  persistence = 0.5
): number {
  let value = 0
  let amplitude = 1
  let frequency = 1
  let maxAmplitude = 0

  for (let i = 0; i < octaves; i++) {
    value += noise2d(x * frequency, y * frequency) * amplitude
    maxAmplitude += amplitude
    amplitude *= persistence
    frequency *= lacunarity
  }

  return value / maxAmplitude
}

/**
 * Initialize the noise with a fixed seed for deterministic maps.
 */
export function seedNoise(seed = 42) {
  initPermutation(seed)
}

/**
 * Generate a noisy closed polygon path around a center point.
 * Used for organic region boundaries.
 */
export function noisyPolygon(
  cx: number,
  cy: number,
  baseRadius: number,
  points: number,
  noiseScale: number,
  noiseAmplitude: number,
  offsetX = 0,
  offsetY = 0,
): Array<{ x: number; y: number }> {
  const result: Array<{ x: number; y: number }> = []
  for (let i = 0; i < points; i++) {
    const angle = (i / points) * Math.PI * 2
    const nx = Math.cos(angle) * noiseScale + offsetX
    const ny = Math.sin(angle) * noiseScale + offsetY
    const r = baseRadius + fbm(nx, ny, 3) * noiseAmplitude
    result.push({
      x: cx + Math.cos(angle) * r,
      y: cy + Math.sin(angle) * r,
    })
  }
  return result
}

/**
 * Convert an array of points to a smooth SVG path using cubic bezier curves.
 */
export function smoothPath(points: Array<{ x: number; y: number }>, closed = true): string {
  if (points.length < 3) return ''

  const pts = closed ? [...points, points[0], points[1]] : points
  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`

  for (let i = 1; i < pts.length - 1; i++) {
    const prev = pts[i - 1]
    const curr = pts[i]
    const next = pts[i + 1]

    const cpx = curr.x - (next.x - prev.x) / 6
    const cpy = curr.y - (next.y - prev.y) / 6

    if (i === 1) {
      d += ` Q ${cpx.toFixed(1)} ${cpy.toFixed(1)} ${curr.x.toFixed(1)} ${curr.y.toFixed(1)}`
    } else {
      d += ` S ${cpx.toFixed(1)} ${cpy.toFixed(1)} ${curr.x.toFixed(1)} ${curr.y.toFixed(1)}`
    }
  }

  if (closed) d += ' Z'
  return d
}
