export interface AmpPreset {
  name: string;
  description: string;
  ampFamily: string;
  isTube: boolean;
  channels: string[];
  controls: Array<{
    name: string;
    max: number;
  }>;
  buttons: Array<{
    name: string;
  }> | null;
  voicings: string[] | null;
  powerSection: {
    wattage: number;
    tubeTypes: string[];
  } | null;
}

export const ampPresets: Record<string, AmpPreset> = {
  'fender_champion_20': {
    name: 'Fender Champion 20',
    description: 'Solid-state practice amp with multiple voicings',
    ampFamily: 'fender',
    isTube: false,
    channels: ['single'],
    controls: [
      { name: 'Gain', max: 10 },
      { name: 'Volume', max: 10 },
      { name: 'Voice', max: 10 },
      { name: 'Treble', max: 10 },
      { name: 'Bass', max: 10 },
      { name: 'FX Level', max: 10 }
    ],
    buttons: [
      { name: 'FX Select' },
      { name: 'Tap' }
    ],
    voicings: ['Tweed', 'Blackface', 'British', 'Metal'],
    powerSection: null
  },

  'fender_mustang_lt25': {
    name: 'Fender Mustang LT25',
    description: 'Digital modeling practice amp',
    ampFamily: 'fender',
    isTube: false,
    channels: ['single'],
    controls: [
      { name: 'Gain', max: 10 },
      { name: 'Volume', max: 10 },
      { name: 'Treble', max: 10 },
      { name: 'Bass', max: 10 },
      { name: 'Master', max: 10 }
    ],
    buttons: [
      { name: 'Tap' },
      { name: 'Back' },
      { name: 'Save/Menu' }
    ],
    voicings: null,
    powerSection: null
  },

  'fender_blues_junior_iv': {
    name: 'Fender Blues Junior IV',
    description: 'Tube practice amp with classic Fender tone',
    ampFamily: 'fender',
    isTube: true,
    channels: ['single'],
    controls: [
      { name: 'Volume', max: 12 },
      { name: 'Treble', max: 12 },
      { name: 'Bass', max: 12 },
      { name: 'Middle', max: 12 },
      { name: 'Master', max: 12 },
      { name: 'Reverb', max: 12 }
    ],
    buttons: [
      { name: 'Fat' }
    ],
    voicings: null,
    powerSection: {
      wattage: 15,
      tubeTypes: ['EL84']
    }
  },

  'fender_twin_reverb': {
    name: 'Fender \'65 Twin Reverb',
    description: 'Classic tube amp with vibrato and reverb',
    ampFamily: 'fender',
    isTube: true,
    channels: ['Normal', 'Vibrato'],
    controls: [
      { name: 'Volume', max: 12 },
      { name: 'Treble', max: 12 },
      { name: 'Middle', max: 12 },
      { name: 'Bass', max: 12 },
      { name: 'Reverb', max: 12 },
      { name: 'Speed', max: 12 },
      { name: 'Intensity', max: 12 }
    ],
    buttons: [
      { name: 'Bright (Normal)' },
      { name: 'Bright (Vibrato)' }
    ],
    voicings: null,
    powerSection: {
      wattage: 85,
      tubeTypes: ['6L6']
    }
  },

  'marshall_mg30gfx': {
    name: 'Marshall MG30GFX',
    description: 'Solid-state practice amp with multiple channels',
    ampFamily: 'marshall',
    isTube: false,
    channels: ['Clean', 'Crunch', 'OD1', 'OD2'],
    controls: [
      { name: 'Gain', max: 10 },
      { name: 'Bass', max: 10 },
      { name: 'Middle', max: 10 },
      { name: 'Treble', max: 10 },
      { name: 'Reverb', max: 10 },
      { name: 'Master', max: 10 }
    ],
    buttons: [
      { name: 'Channel Select' },
      { name: 'FX Select' },
      { name: 'Store' },
      { name: 'Tap' }
    ],
    voicings: null,
    powerSection: null
  },

  'marshall_dsl40cr': {
    name: 'Marshall DSL40CR',
    description: 'Tube amp with two gain channels',
    ampFamily: 'marshall',
    isTube: true,
    channels: ['Classic Gain', 'Ultra Gain'],
    controls: [
      { name: 'Gain (Classic)', max: 10 },
      { name: 'Volume (Classic)', max: 10 },
      { name: 'Gain (Ultra)', max: 10 },
      { name: 'Volume (Ultra)', max: 10 },
      { name: 'Treble', max: 10 },
      { name: 'Middle', max: 10 },
      { name: 'Bass', max: 10 },
      { name: 'Presence', max: 10 },
      { name: 'Resonance', max: 10 },
      { name: 'Reverb (Classic)', max: 10 },
      { name: 'Reverb (Ultra)', max: 10 },
      { name: 'Master 1', max: 10 },
      { name: 'Master 2', max: 10 }
    ],
    buttons: [
      { name: 'Channel Select' }
    ],
    voicings: null,
    powerSection: {
      wattage: 40,
      tubeTypes: ['EL34']
    }
  },

  'marshall_code_50': {
    name: 'Marshall Code 50',
    description: 'Digital modeling amp with classic Marshall voicings',
    ampFamily: 'marshall',
    isTube: false,
    channels: ['single'],
    controls: [
      { name: 'Gain', max: 10 },
      { name: 'Bass', max: 10 },
      { name: 'Middle', max: 10 },
      { name: 'Treble', max: 10 },
      { name: 'Presence', max: 10 },
      { name: 'Resonance', max: 10 },
      { name: 'Volume', max: 10 },
      { name: 'Master', max: 10 }
    ],
    buttons: [
      { name: 'AMP' },
      { name: 'MOD' },
      { name: 'DELAY' },
      { name: 'REVERB' },
      { name: 'PRESET/STORE' },
      { name: 'EXIT' },
      { name: 'Tap' }
    ],
    voicings: ['JTM', 'Plexi', 'JCM800', 'JCM2000'],
    powerSection: null
  },

  'boss_katana_50_mkii': {
    name: 'Boss Katana 50 MkII',
    description: 'Digital modeling amp with extensive effects',
    ampFamily: 'boss',
    isTube: false,
    channels: ['single'],
    controls: [
      { name: 'Amp Type', max: 10 },
      { name: 'Gain', max: 10 },
      { name: 'Volume', max: 10 },
      { name: 'Bass', max: 10 },
      { name: 'Middle', max: 10 },
      { name: 'Treble', max: 10 },
      { name: 'Booster/Mod', max: 10 },
      { name: 'Delay/FX', max: 10 },
      { name: 'Reverb', max: 10 },
      { name: 'Presence', max: 10 },
      { name: 'Master', max: 10 }
    ],
    buttons: [
      { name: 'CH1' },
      { name: 'CH2' },
      { name: 'Panel' },
      { name: 'Tap' },
      { name: 'Power Control' }
    ],
    voicings: ['Acoustic', 'Clean', 'Crunch', 'Lead', 'Brown'],
    powerSection: null
  },

  'blackstar_id_core_20_v3': {
    name: 'Blackstar ID:Core 20 V3',
    description: 'Digital modeling amp with ISF technology',
    ampFamily: 'blackstar',
    isTube: false,
    channels: ['single'],
    controls: [
      { name: 'Voice', max: 10 },
      { name: 'Gain', max: 10 },
      { name: 'Volume', max: 10 },
      { name: 'ISF', max: 10 }
    ],
    buttons: [
      { name: 'Mod' },
      { name: 'Delay' },
      { name: 'Reverb' },
      { name: 'Manual/Patch' }
    ],
    voicings: ['Clean Bright', 'Clean Warm', 'Crunch', 'Super Crunch', 'OD1', 'OD2'],
    powerSection: null
  },

  'blackstar_ht_1r_mkii': {
    name: 'Blackstar HT-1R MkII',
    description: 'Low-wattage tube amp for home use',
    ampFamily: 'blackstar',
    isTube: true,
    channels: ['single'],
    controls: [
      { name: 'Gain', max: 10 },
      { name: 'Volume', max: 10 },
      { name: 'ISF', max: 10 },
      { name: 'Reverb', max: 10 }
    ],
    buttons: [
      { name: 'Voice/Channel Select' }
    ],
    voicings: null,
    powerSection: {
      wattage: 1,
      tubeTypes: ['ECC83', 'ECC82']
    }
  },

  'vox_ac15c1': {
    name: 'Vox AC15C1',
    description: 'Classic Vox tube amp with tremolo',
    ampFamily: 'vox',
    isTube: true,
    channels: ['Normal', 'Top Boost'],
    controls: [
      { name: 'Normal Volume', max: 12 },
      { name: 'Top Boost Volume', max: 12 },
      { name: 'Treble', max: 12 },
      { name: 'Bass', max: 12 },
      { name: 'Reverb', max: 12 },
      { name: 'Tremolo Speed', max: 12 },
      { name: 'Tremolo Depth', max: 12 },
      { name: 'Tone Cut', max: 12 },
      { name: 'Master Volume', max: 12 }
    ],
    buttons: null,
    voicings: null,
    powerSection: {
      wattage: 15,
      tubeTypes: ['EL84']
    }
  },

  'vox_ac30c2': {
    name: 'Vox AC30C2',
    description: 'High-powered Vox tube amp',
    ampFamily: 'vox',
    isTube: true,
    channels: ['Normal', 'Top Boost'],
    controls: [
      { name: 'Normal Volume', max: 12 },
      { name: 'Top Boost Volume', max: 12 },
      { name: 'Treble', max: 12 },
      { name: 'Bass', max: 12 },
      { name: 'Reverb', max: 12 },
      { name: 'Tremolo Speed', max: 12 },
      { name: 'Tremolo Depth', max: 12 },
      { name: 'Tone Cut', max: 12 },
      { name: 'Master Volume', max: 12 }
    ],
    buttons: null,
    voicings: null,
    powerSection: {
      wattage: 30,
      tubeTypes: ['EL84']
    }
  },

  'orange_crush_20rt': {
    name: 'Orange Crush 20RT',
    description: 'Solid-state amp with Orange character',
    ampFamily: 'orange',
    isTube: false,
    channels: ['Clean', 'Dirty'],
    controls: [
      { name: 'Clean Volume', max: 10 },
      { name: 'Dirty Gain', max: 10 },
      { name: 'Dirty Volume', max: 10 },
      { name: 'Bass', max: 10 },
      { name: 'Middle', max: 10 },
      { name: 'Treble', max: 10 },
      { name: 'Reverb', max: 10 }
    ],
    buttons: [
      { name: 'Channel' }
    ],
    voicings: null,
    powerSection: null
  },

  'peavey_bandit_112': {
    name: 'Peavey Bandit 112',
    description: 'Solid-state amp with vintage/modern switching',
    ampFamily: 'peavey',
    isTube: false,
    channels: ['Clean', 'Lead'],
    controls: [
      { name: 'Pre Gain (Clean)', max: 10 },
      { name: 'Low (Clean)', max: 10 },
      { name: 'Mid (Clean)', max: 10 },
      { name: 'High (Clean)', max: 10 },
      { name: 'Pre Gain (Lead)', max: 10 },
      { name: 'Post Gain (Lead)', max: 10 },
      { name: 'Low (Lead)', max: 10 },
      { name: 'Mid (Lead)', max: 10 },
      { name: 'High (Lead)', max: 10 },
      { name: 'Presence', max: 10 },
      { name: 'Resonance', max: 10 },
      { name: 'Reverb', max: 10 },
      { name: 'Master', max: 10 }
    ],
    buttons: [
      { name: 'Vintage/Modern switches' }
    ],
    voicings: null,
    powerSection: null
  },

  'line6_spider_v_60_mkii': {
    name: 'Line 6 Spider V 60 MkII',
    description: 'Digital modeling amp with extensive effects',
    ampFamily: 'line6',
    isTube: false,
    channels: ['single'],
    controls: [
      { name: 'Drive', max: 10 },
      { name: 'Bass', max: 10 },
      { name: 'Mid', max: 10 },
      { name: 'Treble', max: 10 },
      { name: 'Volume', max: 10 },
      { name: 'Presence', max: 10 },
      { name: 'Master', max: 10 }
    ],
    buttons: [
      { name: 'FX' },
      { name: 'Tap/Tuner' },
      { name: 'Preset Nav' }
    ],
    voicings: null,
    powerSection: null
  }
};

export function getAmpFamilyLabel(family: string): string {
  const labels: Record<string, string> = {
    'fender': 'Fender',
    'marshall': 'Marshall',
    'vox': 'Vox',
    'boss': 'Boss',
    'blackstar': 'Blackstar',
    'orange': 'Orange',
    'peavey': 'Peavey',
    'line6': 'Line 6',
    'modeling': 'Modeling',
    'solid_state': 'Solid State',
    'other': 'Other'
  };
  return labels[family] || family;
} 