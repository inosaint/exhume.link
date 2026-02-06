declare module 'd3-geo' {
  export type GeoPoint = [number, number]

  export type GeoProjection = ((coords: GeoPoint) => GeoPoint | null) & {
    fitSize: (size: [number, number], object: unknown) => GeoProjection
  }

  export const geoMercator: () => GeoProjection
  export const geoPath: (projection: GeoProjection) => (object: unknown) => string | null
}

declare module 'd3-selection' {
  export interface Selection<T extends Element = Element> {
    call: <Args extends unknown[]>(
      fn: (selection: Selection<T>, ...args: Args) => unknown,
      ...args: Args
    ) => Selection<T>
    on: (typenames: string, listener: null) => Selection<T>
  }

  export const select: <T extends Element>(element: T) => Selection<T>
}

declare module 'd3-zoom' {
  import type { Selection } from 'd3-selection'

  export interface ZoomTransform {
    translate: (x: number, y: number) => ZoomTransform
    scale: (k: number) => ZoomTransform
    toString: () => string
  }

  export interface ZoomBehavior<T extends Element = Element> {
    (selection: Selection<T>): void
    scaleExtent: (extent: [number, number]) => ZoomBehavior<T>
    on: (typenames: string, listener: (event: unknown) => void) => ZoomBehavior<T>
    transform: (selection: Selection<T>, transform: ZoomTransform) => void
    scaleBy: (selection: Selection<T>, k: number) => void
  }

  export const zoom: <T extends Element = Element>() => ZoomBehavior<T>
  export const zoomIdentity: ZoomTransform
}

declare module 'topojson-client' {
  export const feature: (topology: unknown, object: unknown) => unknown
}

declare module 'geojson' {
  export type Geometry = unknown

  export interface Feature<G = Geometry> {
    type: 'Feature'
    geometry: G
    properties?: Record<string, unknown> | null
  }

  export interface FeatureCollection<G = Geometry> {
    type: 'FeatureCollection'
    features: Array<Feature<G>>
  }
}

declare module 'topojson-specification' {
  export interface Topology {
    objects: Record<string, unknown>
  }
}
