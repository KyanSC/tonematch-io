import type { PickupVoice } from "./types";

import { PICKUP_EQUIVALENCE } from "./registries";

/** Normalize common selector labels across guitars */
export function normalizeLabel(label?: string | null): string | null {
  if (!label) return null;
  const s = String(label).trim().toLowerCase();
  const map: Record<string, string> = {
    // 5-way blade aliases
    "1": "bridge", "pos1": "bridge",
    "2": "bridge+middle", "pos2": "bridge+middle",
    "3": "middle", "pos3": "middle",
    "4": "neck+middle", "pos4": "neck+middle",
    "5": "neck", "pos5": "neck",
    // 3-way toggle aliases
    "up": "neck", "rhythm": "neck",
    "middle": "both",
    "down": "bridge", "treble": "bridge",
    // direct names
    "neck": "neck",
    "bridge": "bridge",
    "both": "both",
    "neck hb": "neck", "bridge hb": "bridge"
  };
  return map[s] ?? s;
}

/** Neck↔Bridge index (lower = necky, higher = bridgey) */
export function positionIndex(norm: string | null): number {
  switch (norm) {
    case "neck": return 0;
    case "neck+middle": return 1;
    case "both": return 1.5;
    case "middle": return 2;
    case "bridge+middle": return 3;
    case "bridge": return 4;
    default: return 2; // unknown → middle-ish
  }
}

/** Majority pickup type from a voice (fallback to 'other') */
export function majorityType(voice?: PickupVoice): string {
  if (!voice?.active?.length) return "other";
  const counts: Record<string, number> = {};
  for (const a of voice.active) {
    if (a.type) counts[a.type] = (counts[a.type] ?? 0) + 1;
  }
  const sorted = Object.entries(counts).sort((a,b)=>b[1]-a[1]);
  return sorted[0]?.[0] || "other";
}

export type Candidate = {
  label: string;
  voice: PickupVoice | null; // computed from target guitar selector if present
};

export type ScoreDetail = {
  candidateLabel: string;
  typeDistance: number;
  posDistance: number;
  splitPenalty: number;
  total: number;
  notes: string[];
};

/**
 * Score a target position:
 *  total = w_type * typeDistance + w_pos * posDistance + w_split * splitPenalty
 * Lower is better.
 */
export function scoreCandidate(
  baseVoice: PickupVoice | undefined,
  basePositionLabel: string | null,
  candidate: Candidate
): ScoreDetail {
  const w_type = 3.0;
  const w_pos  = 1.5;
  const w_split = 0.5;

  const baseType = majorityType(baseVoice);
  const candType = majorityType(candidate.voice ?? undefined);

  const typeDistance = (PICKUP_EQUIVALENCE[baseType]?.[candType] ?? 3);
  const posDistance = Math.abs(
    positionIndex(normalizeLabel(basePositionLabel)) -
    positionIndex(normalizeLabel(candidate.label))
  );

  // Prefer preserving split/blend if baseVoice has any split true in active
  const baseHasSplit = !!baseVoice?.active?.some(a => a.split);
  const candHasSplit = !!candidate.voice?.active?.some(a => a.split);
  const splitPenalty = baseHasSplit === candHasSplit ? 0 : 1;

  const total = w_type * typeDistance + w_pos * posDistance + w_split * splitPenalty;

  const notes = [
    `baseType=${baseType}, candType=${candType}, typeDistance=${typeDistance.toFixed(2)}`,
    `posDistance=${posDistance.toFixed(2)} (base='${normalizeLabel(basePositionLabel)}' vs cand='${normalizeLabel(candidate.label)}')`,
    `split: base=${baseHasSplit}, cand=${candHasSplit}, penalty=${splitPenalty}`
  ];

  return { candidateLabel: candidate.label, typeDistance, posDistance, splitPenalty, total, notes };
}

/** Choose the best candidate from a list; returns details sorted by best first */
export function chooseBest(
  baseVoice: PickupVoice | undefined,
  basePositionLabel: string | null,
  candidates: Candidate[]
) {
  const scored = candidates.map(c => scoreCandidate(baseVoice, basePositionLabel, c))
                           .sort((a,b) => a.total - b.total);
  return { best: scored[0], ranked: scored };
} 