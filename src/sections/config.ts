export type FlowVariant = 'a' | 'b' | 'c'

export type SectionId =
  | 'landing'
  | 'processing'
  | 'overview'
  | 'personality'
  | 'numbers'
  | 'cemetery'
  | 'worldmap'
  | 'hexmap'
  | 'grimreport'
  | 'share'

export interface SectionDef {
  id:    SectionId
  label: string
}

export const SECTIONS_A: SectionDef[] = [
  { id: 'landing', label: 'Surface' },
  { id: 'processing', label: 'Unearthing' },
  { id: 'personality', label: 'The Verdict' },
  { id: 'numbers', label: 'The Ledger' },
  { id: 'cemetery', label: 'Cemetery' },
  // { id: 'grimreport', label: 'Grim Report' },
  { id: 'share', label: 'Archetype Binding' },
]

export const SECTIONS_B: SectionDef[] = [
  { id: 'landing', label: 'Surface' },
  { id: 'processing', label: 'Unearthing' },
  { id: 'personality', label: 'Archetype' },
  { id: 'numbers', label: 'The Ledger' },
  { id: 'cemetery', label: 'Cemetery' },
  { id: 'worldmap', label: 'The Web' },
  { id: 'share', label: 'Share' },
]

export const SECTIONS_C: SectionDef[] = [
  { id: 'landing', label: 'Surface' },
  { id: 'processing', label: 'Unearthing' },
  { id: 'personality', label: 'The Dead' },
  { id: 'numbers', label: 'The Ledger' },
  { id: 'cemetery', label: 'Cemetery' },
  { id: 'hexmap', label: 'Necropolis' },
  { id: 'share', label: 'Share' },
]
