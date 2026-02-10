export type SectionId =
  | 'landing'
  | 'processing'
  | 'personality'
  | 'numbers'
  | 'cemetery'
  | 'grimreport'
  | 'share'

export interface SectionDef {
  id:    SectionId
  label: string
}

export const SECTIONS: SectionDef[] = [
  { id: 'landing', label: 'Surface' },
  { id: 'processing', label: 'Unearthing' },
  { id: 'personality', label: 'The Verdict' },
  { id: 'numbers', label: 'The Ledger' },
  { id: 'cemetery', label: 'Cemetery' },
  { id: 'share', label: 'Archetype Binding' },
]
