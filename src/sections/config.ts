export type SectionId = 'landing' | 'processing' | 'overview' | 'cemetery' | 'worldmap'

export interface SectionDef {
  id:    SectionId
  label: string
}

export const SECTIONS: SectionDef[] = [
  { id: 'landing',    label: 'Surface'    },
  { id: 'processing', label: 'Unearthing' },
  { id: 'overview',   label: 'The Dead'   },
  { id: 'cemetery',   label: 'Cemetery'   },
  { id: 'worldmap',   label: 'The Map'    },
]
