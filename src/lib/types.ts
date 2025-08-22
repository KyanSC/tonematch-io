export type PickupType = 'single_coil' | 'humbucker' | 'p90' | 'other'
export type AmpFamily = 'fender' | 'marshall' | 'vox' | 'boss' | 'blackstar' | 'orange' | 'peavey' | 'line6' | 'modeling' | 'solid_state' | 'other'
export type SongSection = 'INTRO' | 'VERSE' | 'CHORUS' | 'BRIDGE' | 'SOLO' | 'OUTRO' | 'BREAKDOWN'

export interface Guitar {
  id: string
  brand: string
  model: string
  pickupLayout: string // "HH" | "SSS" | "HSS" | "P90_P90" | "HSH" | ...
  positions: string[] // ordered canonical tokens: NECK, NECK_MIDDLE, MIDDLE, MIDDLE_BRIDGE, BRIDGE, NECK_BRIDGE
  volumeKnobs: number
  toneKnobs: number
  knobMapping?: any // Optional for non-standard wiring
  hasCoilSplitNeck: boolean
  hasCoilSplitBridge: boolean
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface Amp {
  id: string
  brand: string
  model: string
  // Core capability flags
  hasGain: boolean
  hasVolume: boolean
  hasBass: boolean
  hasMid: boolean
  hasTreble: boolean
  hasPresence: boolean
  hasReverb: boolean
  hasDriveChannel: boolean
  // Extended capability flags
  hasBright: boolean
  hasToneCut: boolean
  hasDepth: boolean
  hasResonance: boolean
  hasMasterVolume: boolean
  hasPreampGain: boolean
  hasFXLoopLevel: boolean
  hasContour: boolean
  hasGraphicEQ: boolean
  hasBoost: boolean
  hasPowerScale: boolean
  hasNoiseGate: boolean
  channels?: string // "single" | "two" | "multi"
  controlsExtra?: any // true oddballs go here
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface Song {
  id: string
  title: string
  artist: string
  year?: number
  tones?: Tone[]
  createdAt: Date
  updatedAt: Date
}

export interface GuitarArchetype {
  id: string
  name: string
  brand?: string
  pickupLayout: string
  switchPositions: string[]
  volumeKnobs: number
  toneKnobs: number
  perPickupControls: boolean
  coilSplit: boolean
  otherSwitches?: string[]
  notes?: string
  systemLocked: boolean
  createdAt: Date
  updatedAt: Date
}

export interface AmpArchetype {
  id: string
  name: string
  brand?: string
  topology?: string
  channels: string[]
  controls: AmpControl[]
  hasPresence: boolean
  hasReverb: boolean
  hasMasterVolume: boolean
  hasFXLoop: boolean
  notes?: string
  systemLocked: boolean
  createdAt: Date
  updatedAt: Date
}

export interface AmpControl {
  name: string
  min: number
  max: number
  default: number
  perChannel?: boolean
}

export interface Tone {
  id: string
  songId: string
  name: string
  slug: string
  role?: 'CLEAN' | 'RHYTHM' | 'CRUNCH' | 'LEAD' | 'SOLO'
  section?: string // "intro" | "verse" | "chorus" | "solo 1"
  guitarist?: string
  confidence?: 'HIGH' | 'MEDIUM' | 'LOW'
  
  // Required Archetypes (new)
  sourceGuitarArchetypeId: string
  sourceGuitarArchetype: GuitarArchetype
  sourceAmpArchetypeId: string
  sourceAmpArchetype: AmpArchetype
  
  // Source Gear (original rig) - all optional for backward compatibility
  instrument?: 'GUITAR' | 'BASS'
  sourceGuitar?: string // secondary notes
  sourcePickup?: string
  sourcePickupType?: 'SINGLE_COIL' | 'HUMBUCKER' | 'P90' | 'OTHER'
  
  // Original Guitar Settings
  sourcePickupSelector?: string
  sourceGuitarVolume?: number // deprecated, use per-pickup
  sourceGuitarTone?: number // deprecated, use per-pickup
  sourceGuitarVolumeNeck?: number
  sourceGuitarVolumeBridge?: number
  sourceGuitarToneNeck?: number
  sourceGuitarToneBridge?: number
  sourceCoilSplit?: string
  sourceOtherSwitches?: string
  
  sourceAmp?: string // secondary notes
  sourceAmpChannel?: string // deprecated, use structured
  sourceAmpChannelStructured?: 'CLEAN' | 'CRUNCH' | 'LEAD_HIGH_GAIN' | 'ACOUSTIC_JC' | 'OTHER'
  sourceAmpChannelOther?: string
  sourcePedals?: string
  sourceNotes?: string
  
  // Original Amp Settings (Recorded)
  sourceAmpMasterVolume?: number
  sourceAmpChannelVolume?: number
  sourceAmpExtras?: any // JSON array of advanced controls
  
  intent: any // Complex tone intent object
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface ToneSettings {
  gain: number
  bass: number
  mid: number
  treble: number
  reverb: number
  presence?: number
  master?: number
  volume?: number
  [key: string]: number | undefined
}

export interface GearMatch {
  id: string
  toneId: string
  guitarId?: string
  ampId?: string
  settings: ToneSettings
  guitar?: Guitar
  amp?: Amp
  tone?: Tone
  createdAt: Date
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