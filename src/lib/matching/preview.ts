import { PrismaClient } from '@prisma/client';
import { PICKUP_EQUIVALENCE, PICKUP_EQ_OFFSETS, AMP_FAMILY_VOICING } from "./registries";
import type { MatchPreviewInput, MatchPreview, PickupVoice } from "./types";
import { chooseBest, type Candidate } from "./pickup_scorer";

const prisma = new PrismaClient();

// Helpers
function clamp01(x: number) { return Math.max(0, Math.min(10, x)); }

function findPositionLabelMatch(targetSelector: any, desiredLabel: string | null): string | null {
  if (!targetSelector?.positions?.length) return null;
  if (!desiredLabel) return targetSelector.positions[0]?.label ?? null;
  const exact = targetSelector.positions.find((p: any) => p.label === desiredLabel || p.name === desiredLabel);
  return exact ? (exact.label ?? exact.name) : (targetSelector.positions[0]?.label ?? null);
}

function pickupTypeFromVoice(voice?: PickupVoice, baseGuitar?: any): 'humbucker'|'single_coil'|'p90'|'filtertron'|'mini_humbucker'|'lipstick'|'gold_foil'|'other' {
  if (!voice?.active?.length) return 'other';
  
  // If we have base guitar data, look up pickup types by ID
  if (baseGuitar?.pickups) {
    const pickupMap = new Map(baseGuitar.pickups.map((p: any) => [p.id, p.type]));
    const types = voice.active.map(a => pickupMap.get(a.pickupId) || 'other');
    // Return the most common type
    const counts: Record<string, number> = {};
    for (const type of types) {
      if (type) counts[type] = (counts[type] ?? 0) + 1;
    }
    const sorted = Object.entries(counts).sort((a,b)=>b[1]-a[1]);
    return (sorted[0]?.[0] as any) || 'other';
  }
  
  // Fallback: try to get type from voice data
  const counts: Record<string, number> = {};
  for (const a of voice.active) {
    if (a.type) counts[a.type] = (counts[a.type] ?? 0) + 1;
  }
  const sorted = Object.entries(counts).sort((a,b)=>b[1]-a[1]);
  return (sorted[0]?.[0] as any) || 'other';
}

function eqOffset(fromType: string, toType: string) {
  if (fromType === toType) return PICKUP_EQ_OFFSETS.default;
  if (fromType === 'humbucker' && toType === 'single_coil') return PICKUP_EQ_OFFSETS.humbucker_to_single_coil;
  if (fromType === 'single_coil' && toType === 'humbucker') return PICKUP_EQ_OFFSETS.single_coil_to_humbucker;
  return PICKUP_EQ_OFFSETS.default;
}

export async function buildMatchPreview(input: MatchPreviewInput): Promise<MatchPreview> {
  const tone = await (prisma as any).tone.findUnique({
    where: { id: input.toneId },
    include: {
      baseAmp: true,
      baseGuitar: true,
      song: true,
    }
  });
  if (!tone) throw new Error("Tone not found");

  const targetGuitar = await (prisma as any).guitar.findUnique({ 
    where: { id: input.targetGuitarId }
  });
  const targetAmp = await (prisma as any).amp.findUnique({ 
    where: { id: input.targetAmpId }
  });

  if (!targetGuitar || !targetAmp) throw new Error("Target gear not found");

  const warnings: string[] = [];
  const notes: string[] = [];

  // --- PICKUP CHOICE ---
  // Desired voice from base tone
  const baseVoice = tone.referencePickupVoice as any | undefined;
  const desiredPosition = tone.referencePickupPosition ?? null;

  // Build candidates from target guitar's selector positions
  const candidates: Candidate[] = [];
  
  if (targetGuitar.selector?.positions?.length) {
    // Use structured selector data
    for (const position of targetGuitar.selector.positions) {
      const label = position.label ?? position.name;
      const voice = position.active ? {
        active: position.active,
        blend: position.blend || 'n/a'
      } : null;
      
      candidates.push({ label, voice });
    }
  } else if (targetGuitar.layoutCode) {
    // Synthesize minimal candidates from layoutCode
    const lc = targetGuitar.layoutCode;
    if (lc === 'HH') {
      candidates.push(
        { label: 'Neck', voice: null },
        { label: 'Both', voice: null },
        { label: 'Bridge', voice: null }
      );
    } else if (lc === 'SSS') {
      candidates.push(
        { label: 'Bridge', voice: null },
        { label: 'Bridge+Middle', voice: null },
        { label: 'Middle', voice: null },
        { label: 'Neck+Middle', voice: null },
        { label: 'Neck', voice: null }
      );
    } else if (lc === 'HSS' || lc === 'SSH') {
      candidates.push(
        { label: 'Bridge', voice: null },
        { label: 'Bridge+Middle', voice: null },
        { label: 'Middle', voice: null },
        { label: 'Neck+Middle', voice: null },
        { label: 'Neck', voice: null }
      );
    } else {
      // Fallback for unknown layouts
      candidates.push({ label: 'Neck', voice: null });
    }
  } else {
    // Last resort
    candidates.push({ label: 'Neck', voice: null });
  }

  // Score and choose best candidate
  const { best, ranked } = chooseBest(baseVoice, desiredPosition, candidates);
  
  // Find the best candidate to get its voice
  const bestCandidate = candidates.find(c => c.label === best.candidateLabel);
  
  // Get pickup type for EQ calculation
  const baseType = pickupTypeFromVoice(baseVoice, tone.baseGuitar);
  const targetType = pickupTypeFromVoice(bestCandidate?.voice || undefined, targetGuitar);
  const pickupEQ = eqOffset(baseType, targetType);
  
  const pickupChoice = {
    targetPositionLabel: best.candidateLabel,
    rationale: [
      ...best.notes,
      ...(ranked.slice(1, 3).map(r => `alt: ${r.candidateLabel} (score=${r.total.toFixed(2)})`))
    ],
    expectedEQBias: pickupEQ
  };

  // --- AMP MAPPING ---
  // Start from base settings (exact control names)
  const base = (tone.baseSettings as Record<string, number>) || {};
  const controlsList = (targetAmp.controlsList as Array<{name:string;max:number}>) ?? [];
  const controlNames = controlsList.map(c => c.name);

  // naive mapping: for each target control name, if base has same key use it, else set midpoint 5.
  const mapped: Record<string, number> = {};
  for (const c of controlNames) {
    const v = base[c] ?? 5;
    mapped[c] = clamp01(v);
  }

  // apply light EQ/gain offsets for pickup difference + amp family voicing
  const fam = targetAmp.ampFamily ?? 'other';
  const famBias = AMP_FAMILY_VOICING[fam] ?? AMP_FAMILY_VOICING.other;

  const appliedOffsets: Array<{ control: string; delta: number; reason: string }> = [];
  const bump = (key: string, delta: number, reason: string) => {
    if (!(key in mapped)) return;
    const before = mapped[key];
    mapped[key] = clamp01(before + delta);
    appliedOffsets.push({ control: key, delta, reason });
  };

  // Pickup EQ bias
  bump('Bass', pickupChoice.expectedEQBias.bass, 'Pickup-type EQ compensation');
  bump('Bass', pickupChoice.expectedEQBias.bass, 'Pickup-type EQ (alt label)'); // in case labels differ later we'll alias
  bump('Middle', pickupChoice.expectedEQBias.mids, 'Pickup-type EQ compensation');
  bump('Mids', pickupChoice.expectedEQBias.mids, 'Pickup-type EQ compensation');
  bump('Treble', pickupChoice.expectedEQBias.treble, 'Pickup-type EQ compensation');

  // Family voicing nudges
  bump('Bass', famBias.bass, `Amp family '${fam}' voicing`);
  bump('Middle', famBias.mids, `Amp family '${fam}' voicing`);
  bump('Mids', famBias.mids, `Amp family '${fam}' voicing`);
  bump('Treble', famBias.treble, `Amp family '${fam}' voicing`);
  bump('Gain', famBias.gain, `Amp family '${fam}' voicing`);
  bump('Drive', famBias.gain, `Amp family '${fam}' voicing`);

  const mappingNotes = [
    `Mapped ${Object.keys(base).length} base controls to ${controlNames.length} target controls (identity v0).`,
    `Applied pickup compensation and amp-family nudges (very light).`
  ];

  // crude confidence heuristic: start from tone.confidence (0–100) and subtract pickup distance*10, clamp 10..95
  const baseConf = typeof tone.confidence === 'number' ? tone.confidence : 70;
  const confidenceHint = Math.max(10, Math.min(95, baseConf - best.typeDistance * 10));

  return {
    pickup: pickupChoice,
    amp: { controls: mapped, mappingNotes, appliedOffsets },
    confidenceHint,
    warnings
  };
} 