export type PickupType = 'single_coil' | 'humbucker' | 'p90' | 'filtertron' | 'mini_humbucker' | 'lipstick' | 'gold_foil' | 'other';

export type PickupVoice = {
  active: Array<{ pickupId: string; type: PickupType; split: boolean }>;
  blend?: 'series' | 'parallel' | 'n/a';
};

export type MatchPreviewInput = {
  toneId: string;
  targetGuitarId: string;
  targetAmpId: string;
};

export type MatchedPickupChoice = {
  targetPositionLabel: string | null; // e.g., "Neck", "2", "Bridge", etc.
  rationale: string[];
  expectedEQBias: { bass: number; mids: number; treble: number }; // -2..+2
};

export type MappedAmpSettings = {
  controls: Record<string, number>; // 0–10
  mappingNotes: string[];
  appliedOffsets: Array<{ control: string; delta: number; reason: string }>;
};

export type MatchPreview = {
  pickup: MatchedPickupChoice;
  amp: MappedAmpSettings;
  confidenceHint: number; // 0–100 heuristic
  warnings: string[];
}; 