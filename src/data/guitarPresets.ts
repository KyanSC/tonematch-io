export interface GuitarPreset {
  name: string;
  description: string;
  pickups: Array<{
    id: string;
    type: string;
    coilSplitCapable: boolean;
  }>;
  selector: {
    type: string;
    positions: Array<{
      name: string;
      label: string;
      active: Array<{
        pickupId: string;
        split: boolean;
      }>;
      notes?: string;
    }>;
    coilSplitControl: string;
  };
  controls: {
    masterVolume: boolean;
    masterTone: boolean;
    perPickup: {
      neck?: { volume: boolean; tone: boolean };
      middle?: { volume: boolean; tone: boolean };
      bridge?: { volume: boolean; tone: boolean };
    };
    extra?: string[];
  };
}

export const guitarPresets: Record<string, GuitarPreset> = {
  'strat_sss': {
    name: 'Strat SSS (5-way blade)',
    description: 'Classic Stratocaster with three single-coil pickups',
    pickups: [
      { id: 'neck', type: 'single_coil', coilSplitCapable: false },
      { id: 'middle', type: 'single_coil', coilSplitCapable: false },
      { id: 'bridge', type: 'single_coil', coilSplitCapable: false }
    ],
    selector: {
      type: '5_way_blade',
      positions: [
        { name: '1', label: 'Bridge', active: [{ pickupId: 'bridge', split: false }] },
        { name: '2', label: 'Bridge+Middle', active: [{ pickupId: 'bridge', split: false }, { pickupId: 'middle', split: false }] },
        { name: '3', label: 'Middle', active: [{ pickupId: 'middle', split: false }] },
        { name: '4', label: 'Neck+Middle', active: [{ pickupId: 'neck', split: false }, { pickupId: 'middle', split: false }] },
        { name: '5', label: 'Neck', active: [{ pickupId: 'neck', split: false }] }
      ],
      coilSplitControl: 'none'
    },
    controls: {
      masterVolume: true,
      masterTone: false,
      perPickup: {
        neck: { volume: false, tone: true },
        middle: { volume: false, tone: true },
        bridge: { volume: false, tone: false }
      }
    }
  },

  'strat_hss': {
    name: 'Strat HSS (5-way blade, auto-split in pos 2)',
    description: 'Stratocaster with humbucker bridge and auto-split in position 2',
    pickups: [
      { id: 'neck', type: 'single_coil', coilSplitCapable: false },
      { id: 'middle', type: 'single_coil', coilSplitCapable: false },
      { id: 'bridge', type: 'humbucker', coilSplitCapable: true }
    ],
    selector: {
      type: '5_way_blade',
      positions: [
        { name: '1', label: 'Bridge HB', active: [{ pickupId: 'bridge', split: false }] },
        { name: '2', label: 'Bridge (split)+Middle', active: [{ pickupId: 'bridge', split: true }, { pickupId: 'middle', split: false }] },
        { name: '3', label: 'Middle', active: [{ pickupId: 'middle', split: false }] },
        { name: '4', label: 'Neck+Middle', active: [{ pickupId: 'neck', split: false }, { pickupId: 'middle', split: false }] },
        { name: '5', label: 'Neck', active: [{ pickupId: 'neck', split: false }] }
      ],
      coilSplitControl: 'none'
    },
    controls: {
      masterVolume: true,
      masterTone: false,
      perPickup: {
        neck: { volume: false, tone: true },
        middle: { volume: false, tone: true },
        bridge: { volume: false, tone: false }
      }
    }
  },

  'tele_ss': {
    name: 'Telecaster SS (3-way toggle/blade)',
    description: 'Classic Telecaster with two single-coil pickups',
    pickups: [
      { id: 'neck', type: 'single_coil', coilSplitCapable: false },
      { id: 'bridge', type: 'single_coil', coilSplitCapable: false }
    ],
    selector: {
      type: '3_way_toggle',
      positions: [
        { name: 'Down', label: 'Bridge', active: [{ pickupId: 'bridge', split: false }] },
        { name: 'Middle', label: 'Neck+Bridge (parallel)', active: [{ pickupId: 'neck', split: false }, { pickupId: 'bridge', split: false }] },
        { name: 'Up', label: 'Neck', active: [{ pickupId: 'neck', split: false }] }
      ],
      coilSplitControl: 'none'
    },
    controls: {
      masterVolume: true,
      masterTone: true,
      perPickup: {
        neck: { volume: false, tone: false },
        bridge: { volume: false, tone: false }
      }
    }
  },

  'tele_ss_4way': {
    name: 'Telecaster SS (4-way mod)',
    description: 'Telecaster with 4-way switch including series option',
    pickups: [
      { id: 'neck', type: 'single_coil', coilSplitCapable: false },
      { id: 'bridge', type: 'single_coil', coilSplitCapable: false }
    ],
    selector: {
      type: '4_way_blade',
      positions: [
        { name: '1', label: 'Bridge', active: [{ pickupId: 'bridge', split: false }] },
        { name: '2', label: 'Neck+Bridge (parallel)', active: [{ pickupId: 'neck', split: false }, { pickupId: 'bridge', split: false }] },
        { name: '3', label: 'Neck', active: [{ pickupId: 'neck', split: false }] },
        { name: '4', label: 'Series', active: [{ pickupId: 'neck', split: false }, { pickupId: 'bridge', split: false }], notes: 'series' }
      ],
      coilSplitControl: 'none'
    },
    controls: {
      masterVolume: true,
      masterTone: true,
      perPickup: {
        neck: { volume: false, tone: false },
        bridge: { volume: false, tone: false }
      }
    }
  },

  'les_paul_hh': {
    name: 'Les Paul HH (3-way toggle, 2V2T)',
    description: 'Les Paul with two humbuckers and independent volume/tone controls',
    pickups: [
      { id: 'neck', type: 'humbucker', coilSplitCapable: false },
      { id: 'bridge', type: 'humbucker', coilSplitCapable: false }
    ],
    selector: {
      type: '3_way_toggle',
      positions: [
        { name: 'Up', label: 'Neck', active: [{ pickupId: 'neck', split: false }] },
        { name: 'Middle', label: 'Both', active: [{ pickupId: 'neck', split: false }, { pickupId: 'bridge', split: false }] },
        { name: 'Down', label: 'Bridge', active: [{ pickupId: 'bridge', split: false }] }
      ],
      coilSplitControl: 'none'
    },
    controls: {
      masterVolume: false,
      masterTone: false,
      perPickup: {
        neck: { volume: true, tone: true },
        bridge: { volume: true, tone: true }
      }
    }
  },

  'sg_hh': {
    name: 'SG HH (3-way, 2V2T)',
    description: 'SG with two humbuckers and independent volume/tone controls',
    pickups: [
      { id: 'neck', type: 'humbucker', coilSplitCapable: false },
      { id: 'bridge', type: 'humbucker', coilSplitCapable: false }
    ],
    selector: {
      type: '3_way_toggle',
      positions: [
        { name: 'Up', label: 'Neck', active: [{ pickupId: 'neck', split: false }] },
        { name: 'Middle', label: 'Both', active: [{ pickupId: 'neck', split: false }, { pickupId: 'bridge', split: false }] },
        { name: 'Down', label: 'Bridge', active: [{ pickupId: 'bridge', split: false }] }
      ],
      coilSplitControl: 'none'
    },
    controls: {
      masterVolume: false,
      masterTone: false,
      perPickup: {
        neck: { volume: true, tone: true },
        bridge: { volume: true, tone: true }
      }
    }
  },

  'prs_custom_24': {
    name: 'PRS Custom 24 HH (3-way blade + global push/pull split)',
    description: 'PRS Custom 24 with coil splitting via push/pull',
    pickups: [
      { id: 'neck', type: 'humbucker', coilSplitCapable: true },
      { id: 'bridge', type: 'humbucker', coilSplitCapable: true }
    ],
    selector: {
      type: '3_way_toggle',
      positions: [
        { name: 'Bridge', label: 'Bridge', active: [{ pickupId: 'bridge', split: false }] },
        { name: 'Both', label: 'Both', active: [{ pickupId: 'neck', split: false }, { pickupId: 'bridge', split: false }] },
        { name: 'Neck', label: 'Neck', active: [{ pickupId: 'neck', split: false }] }
      ],
      coilSplitControl: 'global_push_pull'
    },
    controls: {
      masterVolume: true,
      masterTone: true,
      perPickup: {
        neck: { volume: false, tone: false },
        bridge: { volume: false, tone: false }
      }
    }
  },

  'ibanez_rg_hsh': {
    name: 'Ibanez RG HSH (5-way super switch, split combos)',
    description: 'Ibanez RG with HSH configuration and super switch',
    pickups: [
      { id: 'neck', type: 'humbucker', coilSplitCapable: true },
      { id: 'middle', type: 'single_coil', coilSplitCapable: false },
      { id: 'bridge', type: 'humbucker', coilSplitCapable: true }
    ],
    selector: {
      type: 'super_switch',
      positions: [
        { name: '1', label: 'Bridge HB', active: [{ pickupId: 'bridge', split: false }] },
        { name: '2', label: 'Bridge (split inner coil)+Middle', active: [{ pickupId: 'bridge', split: true }, { pickupId: 'middle', split: false }] },
        { name: '3', label: 'Middle SC', active: [{ pickupId: 'middle', split: false }] },
        { name: '4', label: 'Neck (split inner coil)+Middle', active: [{ pickupId: 'neck', split: true }, { pickupId: 'middle', split: false }] },
        { name: '5', label: 'Neck HB', active: [{ pickupId: 'neck', split: false }] }
      ],
      coilSplitControl: 'none'
    },
    controls: {
      masterVolume: true,
      masterTone: true,
      perPickup: {
        neck: { volume: false, tone: false },
        middle: { volume: false, tone: false },
        bridge: { volume: false, tone: false }
      }
    }
  },

  'gretsch_hh': {
    name: 'Gretsch HH (Filter\'Tron) (3-way, master volume + master tone)',
    description: 'Gretsch with Filter\'Tron pickups and master controls',
    pickups: [
      { id: 'neck', type: 'filtertron', coilSplitCapable: false },
      { id: 'bridge', type: 'filtertron', coilSplitCapable: false }
    ],
    selector: {
      type: '3_way_toggle',
      positions: [
        { name: 'Up', label: 'Neck', active: [{ pickupId: 'neck', split: false }] },
        { name: 'Middle', label: 'Both', active: [{ pickupId: 'neck', split: false }, { pickupId: 'bridge', split: false }] },
        { name: 'Down', label: 'Bridge', active: [{ pickupId: 'bridge', split: false }] }
      ],
      coilSplitControl: 'none'
    },
    controls: {
      masterVolume: true,
      masterTone: true,
      perPickup: {
        neck: { volume: false, tone: false },
        bridge: { volume: false, tone: false }
      }
    }
  }
};

export function computeLayoutCode(pickups: any[]): string {
  if (!pickups || pickups.length === 0) return '';
  
  const codes = pickups.map(pickup => {
    switch (pickup.type) {
      case 'single_coil': return 'S';
      case 'humbucker': return 'H';
      case 'p90': return 'P';
      case 'filtertron': return 'F';
      case 'mini_humbucker': return 'M';
      case 'lipstick': return 'L';
      case 'gold_foil': return 'G';
      default: return 'O';
    }
  });
  
  return codes.join('');
}

export function getSelectorTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    '3_way_toggle': '3-way toggle',
    '5_way_blade': '5-way blade',
    '4_way_blade': '4-way blade',
    'super_switch': 'Super switch',
    'rotary': 'Rotary',
    'other': 'Other'
  };
  return labels[type] || type;
} 