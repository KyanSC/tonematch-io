import { z } from 'zod'

export const GuitarArchetypeSchema = z.object({
  id: z.string(),
  name: z.string(),
  brand: z.string().optional(),
  pickupLayout: z.string(),
  switchPositions: z.array(z.string()),
  volumeKnobs: z.number(),
  toneKnobs: z.number(),
  perPickupControls: z.boolean(),
  coilSplit: z.boolean(),
  otherSwitches: z.array(z.string()).optional(),
  notes: z.string().optional(),
  systemLocked: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const AmpControlSchema = z.object({
  name: z.string(),
  min: z.number(),
  max: z.number(),
  default: z.number(),
  perChannel: z.boolean().optional(),
})

export const AmpArchetypeSchema = z.object({
  id: z.string(),
  name: z.string(),
  brand: z.string().optional(),
  topology: z.string().optional(),
  channels: z.array(z.string()),
  controls: z.array(AmpControlSchema),
  hasPresence: z.boolean(),
  hasReverb: z.boolean(),
  hasMasterVolume: z.boolean(),
  hasFXLoop: z.boolean(),
  notes: z.string().optional(),
  systemLocked: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const GuitarSchema = z.object({
  id: z.string(),
  brand: z.string(),
  model: z.string(),
  pickupLayout: z.string(),
  positions: z.array(z.string()),
  volumeKnobs: z.number().min(0).max(4),
  toneKnobs: z.number().min(0).max(4),
  hasCoilSplitNeck: z.boolean(),
  hasCoilSplitBridge: z.boolean(),
  knobMapping: z.any().optional(),
  notes: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const AmpSchema = z.object({
  id: z.string(),
  brand: z.string(),
  model: z.string(),
  hasGain: z.boolean(),
  hasVolume: z.boolean(),
  hasBass: z.boolean(),
  hasMid: z.boolean(),
  hasTreble: z.boolean(),
  hasPresence: z.boolean(),
  hasReverb: z.boolean(),
  hasDriveChannel: z.boolean(),
  hasBright: z.boolean(),
  hasToneCut: z.boolean(),
  hasDepth: z.boolean(),
  hasResonance: z.boolean(),
  hasMasterVolume: z.boolean(),
  hasPreampGain: z.boolean(),
  hasFXLoopLevel: z.boolean(),
  hasContour: z.boolean(),
  hasGraphicEQ: z.boolean(),
  hasBoost: z.boolean(),
  hasPowerScale: z.boolean(),
  hasNoiseGate: z.boolean(),
  channels: z.string(),
  controlsExtra: z.any().optional(),
  notes: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const SongSchema = z.object({
  id: z.string(),
  title: z.string(),
  artist: z.string(),
  year: z.number().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const ToneSchema = z.object({
  id: z.string(),
  songId: z.string(),
  name: z.string(),
  slug: z.string(),
  role: z.enum(["CLEAN", "RHYTHM", "CRUNCH", "LEAD", "SOLO"]).optional(),
  section: z.string().optional(),
  guitarist: z.string().optional(),
  confidence: z.enum(["HIGH", "MEDIUM", "LOW"]).optional(),
  
  // Required Archetypes (new)
  sourceGuitarArchetypeId: z.string(),
  sourceGuitarArchetype: GuitarArchetypeSchema,
  sourceAmpArchetypeId: z.string(),
  sourceAmpArchetype: AmpArchetypeSchema,
  
  // Source Gear (original rig) - all optional for backward compatibility
  instrument: z.enum(["GUITAR", "BASS"]).optional().default("GUITAR"),
  sourceGuitar: z.string().optional(), // secondary notes
  sourcePickup: z.string().optional(),
  sourcePickupType: z.enum(["SINGLE_COIL", "HUMBUCKER", "P90", "OTHER"]).optional(),
  
  // Original Guitar Settings
  sourcePickupSelector: z.string().optional(),
  sourceGuitarVolume: z.number().min(0).max(10).optional(), // deprecated
  sourceGuitarTone: z.number().min(0).max(10).optional(), // deprecated
  sourceGuitarVolumeNeck: z.number().min(0).max(10).optional(),
  sourceGuitarVolumeBridge: z.number().min(0).max(10).optional(),
  sourceGuitarToneNeck: z.number().min(0).max(10).optional(),
  sourceGuitarToneBridge: z.number().min(0).max(10).optional(),
  sourceCoilSplit: z.string().optional(),
  sourceOtherSwitches: z.string().optional(),
  
  sourceAmp: z.string().optional(), // secondary notes
  sourceAmpChannel: z.string().optional(), // deprecated
  sourceAmpChannelStructured: z.enum(["CLEAN", "CRUNCH", "LEAD_HIGH_GAIN", "ACOUSTIC_JC", "OTHER"]).optional(),
  sourceAmpChannelOther: z.string().optional(),
  sourcePedals: z.string().optional(),
  sourceNotes: z.string().optional(),
  
  // Original Amp Settings (Recorded)
  sourceAmpMasterVolume: z.number().min(0).max(10).optional(),
  sourceAmpChannelVolume: z.number().min(0).max(10).optional(),
  sourceAmpExtras: z.array(z.object({
    control: z.string(),
    value: z.string(),
    units: z.string().optional(),
    notes: z.string().optional()
  })).optional(),
  
  intent: z.object({
    gain: z.number().min(0).max(10),
    eq: z.object({
      bass: z.number().min(0).max(10),
      mid: z.number().min(0).max(10),
      treble: z.number().min(0).max(10)
    }),
    reverb: z.number().min(0).max(10).default(0),
    pickupHint: z.enum(["bridge","middle","neck","bridge+middle","middle+neck","neck+tone-rolled","any"]).default("any"),
    notes: z.string().optional(),
  }),
  notes: z.string().optional(),
});

export type Guitar = z.infer<typeof GuitarSchema>;
export type Amp = z.infer<typeof AmpSchema>;
export type Song = z.infer<typeof SongSchema>;
export type Tone = z.infer<typeof ToneSchema>;
export type GuitarArchetype = z.infer<typeof GuitarArchetypeSchema>;
export type AmpArchetype = z.infer<typeof AmpArchetypeSchema>;
