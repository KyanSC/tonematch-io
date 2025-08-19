export type PickupType = 'single_coil' | 'humbucker' | 'p90' | 'other'
export type AmpFamily = 'fender' | 'marshall' | 'vox' | 'boss' | 'blackstar' | 'orange' | 'peavey' | 'line6' | 'modeling' | 'solid_state' | 'other'
export type SongSection = 'INTRO' | 'VERSE' | 'CHORUS' | 'BRIDGE' | 'SOLO' | 'OUTRO' | 'BREAKDOWN'

export interface Guitar {
  id: string
  brand: string
  model: string
  // Legacy fields (optional for backward compatibility)
  pickupType?: string
  toneControls?: number
  // New detailed fields
  pickupTypeEnum?: PickupType
  pickupSwitchOptions?: string[]
  volumeKnobs?: number
  toneKnobs?: number
  otherControls?: Record<string, any>
  // New multi-pickup layout fields
  layoutPreset?: string
  pickupLayout?: any
  switchPositions?: any
  controls?: any
  // New structured fields for better organization
  layoutCode?: string // derived tag like "SSS", "HSS", "HH", "HSH"
  pickups?: Array<{
    id: string
    type: string
    coilSplitCapable: boolean
  }>
  selector?: {
    type: string
    positions: Array<{
      name: string
      label: string
      active: Array<{
        pickupId: string
        split: boolean
      }>
      notes?: string
    }>
    coilSplitControl: string
  }
  createdAt: Date
}

export interface Amp {
  id: string
  brand: string
  model: string
  // Legacy fields (optional for backward compatibility)
  ampType?: string
  hasReverb?: boolean
  channels?: number
  controls?: Record<string, { min: number; max: number }>
  // New detailed fields
  ampFamily?: AmpFamily
  isTube?: boolean
  knobs?: Record<string, number> // {"gain": 10, "bass": 10, "treble": 10, "mids": 10, "reverb": 10}
  channelsArray?: string[] // ["clean", "drive"]
  otherFeatures?: Record<string, any> // {"effects_loop": true, "footswitch": true}
  // New structured fields for exact front-panel controls
  channelsList?: string[] // ordered list of channel names as labeled on panel/manual
  controlsList?: Array<{
    name: string
    max: number
  }> // ordered array of front-panel knobs with exact labels
  buttons?: Array<{
    name: string
  }> | null // ordered array of labeled buttons/toggles/switches
  voicings?: string[] | null // ordered names exactly as on product/manual
  powerSection?: {
    wattage: number
    tubeTypes: string[]
  } | null // optional details
  createdAt: Date
}

export interface Song {
  id: string
  title: string
  artist: string
  genre?: string
  year?: number
  tones?: Tone[]
  createdAt: Date
}

export interface Tone {
  id: string
  songId: string
  name: string
  description?: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  baseSettings: ToneSettings
  // New tone authoring fields
  baseGuitarId?: string | null
  baseAmpId?: string | null
  baseGuitar?: Guitar | null
  baseAmp?: Amp | null
  referencePickupPosition?: string | null
  referencePickupVoice?: any | null
  songSection?: SongSection | null
  confidence: number // 0–100
  sourceLinks?: string[] | null
  verified: boolean
  verificationNotes?: string | null
  song: Song
  createdAt: Date
}

export type ToneDTO = {
  id: string
  songId: string
  name: string
  description?: string
  baseGuitarId?: string | null
  baseAmpId?: string | null
  referencePickupPosition?: string | null
  referencePickupVoice?: any | null
  baseSettings: Record<string, number> // 0–10 integers
  songSection?: SongSection | null
  confidence: number // 0–100
  sourceLinks?: string[] | null
  verified: boolean
  verificationNotes?: string | null
}

export interface GearMatch {
  id: string
  toneId: string
  guitarId?: string
  ampId?: string
  settings: ToneSettings
  tone: Tone
  guitar?: Guitar
  amp?: Amp
  createdAt: Date
}

export interface ToneSettings {
  volume: number
  gain: number
  treble: number
  bass: number
  middle: number
  reverb: number
  pickupPosition: 'bridge' | 'middle' | 'neck'
  toneControl: number
}

export interface UserGear {
  guitar?: Guitar
  amp?: Amp
}

export interface SearchFilters {
  genre?: string
  decade?: string
  difficulty?: string
} 