/**
 * Necropolis region definitions — maps tab categories to fantasy regions.
 * Each region has a position on the continent, a name, and terrain attributes.
 */
import type { CategoryId } from '../data/mockData'

export interface NecropolisRegion {
  id: CategoryId
  name: string
  /** Short description for tooltip */
  description: string
  /** Center position in SVG coordinates (1000×700 viewbox) */
  cx: number
  cy: number
  /** Base radius for the region polygon */
  baseRadius: number
  /** Noise offset seed — keeps each region's shape unique */
  noiseSeedX: number
  noiseSeedY: number
  /** Terrain icon motif (simple SVG symbol) */
  terrainType: 'books' | 'compass' | 'anvil' | 'frame' | 'whisper' | 'mask' |
    'tower' | 'stall' | 'shield' | 'stones' | 'ship' | 'dead-tree'
  /** Region fill tint (sepia palette) */
  fillColor: string
}

/**
 * The 12 regions of the Necropolis, arranged roughly as a continent.
 *
 * Layout concept (1000×700 viewbox, continent centered ~500,350):
 *
 *            Herald's Tower (N)
 *       Atelier        Catacombs of Ink
 *   Ossuary Forge         Haunting Grounds
 *       Gallery       Phantom Theatre
 *   Gathering Stones     Bone Market
 *       Guild Hall     The Docks
 *            Wasteland (S)
 */
export const NECROPOLIS_REGIONS: NecropolisRegion[] = [
  {
    id: 'news',
    name: 'The Herald\'s Tower',
    description: 'Where proclamations echo across the land',
    cx: 500, cy: 140,
    baseRadius: 72,
    noiseSeedX: 1.2, noiseSeedY: 3.4,
    terrainType: 'tower',
    fillColor: '#d4b896',
  },
  {
    id: 'design',
    name: 'The Atelier',
    description: 'Workshops of craft and vision',
    cx: 340, cy: 210,
    baseRadius: 78,
    noiseSeedX: 5.6, noiseSeedY: 7.8,
    terrainType: 'compass',
    fillColor: '#d9c4a0',
  },
  {
    id: 'reading',
    name: 'The Catacombs of Ink',
    description: 'Endless corridors of written knowledge',
    cx: 650, cy: 200,
    baseRadius: 82,
    noiseSeedX: 9.0, noiseSeedY: 1.1,
    terrainType: 'books',
    fillColor: '#ceb48e',
  },
  {
    id: 'tools',
    name: 'The Ossuary Forge',
    description: 'Where instruments of power are wrought',
    cx: 280, cy: 320,
    baseRadius: 70,
    noiseSeedX: 2.3, noiseSeedY: 4.5,
    terrainType: 'anvil',
    fillColor: '#c4a882',
  },
  {
    id: 'social',
    name: 'The Haunting Grounds',
    description: 'Restless spirits commune in murmurs',
    cx: 680, cy: 310,
    baseRadius: 75,
    noiseSeedX: 6.7, noiseSeedY: 8.9,
    terrainType: 'whisper',
    fillColor: '#d1b998',
  },
  {
    id: 'portfolios',
    name: 'The Gallery of the Dead',
    description: 'Portraits of the departed, immortalized',
    cx: 360, cy: 400,
    baseRadius: 68,
    noiseSeedX: 3.3, noiseSeedY: 5.5,
    terrainType: 'frame',
    fillColor: '#c9ad88',
  },
  {
    id: 'video',
    name: 'The Phantom Theatre',
    description: 'Flickering projections of spectral scenes',
    cx: 640, cy: 400,
    baseRadius: 72,
    noiseSeedX: 7.7, noiseSeedY: 9.9,
    terrainType: 'mask',
    fillColor: '#d6bf9c',
  },
  {
    id: 'events',
    name: 'The Gathering Stones',
    description: 'Ancient circles where souls convene',
    cx: 300, cy: 490,
    baseRadius: 65,
    noiseSeedX: 4.4, noiseSeedY: 6.6,
    terrainType: 'stones',
    fillColor: '#c0a27e',
  },
  {
    id: 'shopping',
    name: 'The Bone Market',
    description: 'Relics and curios exchanged by lantern-light',
    cx: 660, cy: 500,
    baseRadius: 68,
    noiseSeedX: 8.8, noiseSeedY: 2.2,
    terrainType: 'stall',
    fillColor: '#ccb28c',
  },
  {
    id: 'jobs',
    name: 'The Guild Hall',
    description: 'Contracts sealed in blood and ink',
    cx: 380, cy: 560,
    baseRadius: 62,
    noiseSeedX: 1.5, noiseSeedY: 3.7,
    terrainType: 'shield',
    fillColor: '#c7aa84',
  },
  {
    id: 'travel',
    name: 'The Docks',
    description: 'Ships depart for unknown shores',
    cx: 620, cy: 570,
    baseRadius: 64,
    noiseSeedX: 5.9, noiseSeedY: 7.1,
    terrainType: 'ship',
    fillColor: '#bfa47c',
  },
  {
    id: 'other',
    name: 'The Wasteland',
    description: 'Uncharted reaches beyond the pale',
    cx: 500, cy: 630,
    baseRadius: 75,
    noiseSeedX: 9.2, noiseSeedY: 1.3,
    terrainType: 'dead-tree',
    fillColor: '#b89e78',
  },
]

/**
 * Map a CategoryId to its Necropolis region.
 */
export function getRegionForCategory(categoryId: CategoryId): NecropolisRegion | undefined {
  return NECROPOLIS_REGIONS.find(r => r.id === categoryId)
}
