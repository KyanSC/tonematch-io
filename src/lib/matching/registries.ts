// Pickup equivalence weights (lower = closer). v0 heuristic.
export const PICKUP_EQUIVALENCE: Record<string, Record<string, number>> = {
  humbucker: { humbucker: 0, filtertron: 1, p90: 2, mini_humbucker: 2, single_coil: 3, other: 3 },
  single_coil: { single_coil: 0, p90: 2, filtertron: 2, humbucker: 3, other: 3 },
  p90: { p90: 0, single_coil: 1.5, humbucker: 2, filtertron: 2, other: 3 },
  filtertron: { filtertron: 0, humbucker: 1, single_coil: 2, p90: 2, other: 3 },
  mini_humbucker: { mini_humbucker: 0, humbucker: 1, p90: 2, single_coil: 2, other: 3 },
  other: { other: 0 }
};

// Simple pickup-type EQ compensation (−2..+2) to nudge toward humbucker warmth or SC brightness.
export const PICKUP_EQ_OFFSETS: Record<string, { bass: number; mids: number; treble: number }> = {
  humbucker_to_single_coil: { bass: +1, mids: +1, treble: -1 },
  single_coil_to_humbucker: { bass: -1, mids: -1, treble: +1 },
  default: { bass: 0, mids: 0, treble: 0 },
};

// Per-amp-family voicing nudges (super light-touch v0).
export const AMP_FAMILY_VOICING: Record<string, { bass: number; mids: number; treble: number; gain: number }> = {
  fender:   { bass: 0, mids: 0, treble: 0, gain: 0 },
  marshall: { bass: 0, mids: +1, treble: 0, gain: +1 },
  vox:      { bass: -1, mids: +1, treble: +1, gain: 0 },
  orange:   { bass: +1, mids: 0, treble: -1, gain: 0 },
  blackstar:{ bass: 0, mids: 0, treble: 0, gain: 0 },
  peavey:   { bass: 0, mids: 0, treble: 0, gain: 0 },
  line6:    { bass: 0, mids: 0, treble: 0, gain: 0 },
  boss:     { bass: 0, mids: 0, treble: 0, gain: 0 },
  modeling: { bass: 0, mids: 0, treble: 0, gain: 0 },
  solid_state:{ bass: 0, mids: 0, treble: 0, gain: 0 },
  other:    { bass: 0, mids: 0, treble: 0, gain: 0 },
};

// Map common generic controls -> actual control names per amp if needed.
// v0: identity (we already store exact labels), but keep structure for later.
export type ControlAliasMap = Record<string, string>;
export const CONTROL_ALIASES: Record<string /* ampId or model key */, ControlAliasMap> = {}; 