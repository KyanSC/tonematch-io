import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type KnobMap = Record<string, number>; // normalized 0..1

function clamp01(n: number) { return Math.max(0, Math.min(1, n)); }

const PICKUP_ORDER = ["NECK", "NECK_MIDDLE", "MIDDLE", "MIDDLE_BRIDGE", "BRIDGE", "NECK_BRIDGE"] as const;

function choosePickup(positions: string[], pickupTarget?: string) {
  // prefer exact match by intent keyword, else pick closest by heuristic
  const target = (pickupTarget || "BRIDGE").toUpperCase();
  // map target to one of our canonical tokens
  const wanted =
    target.includes("NECK_BRIDGE") ? "NECK_BRIDGE" :
    target.includes("NECK_MIDDLE") ? "NECK_MIDDLE" :
    target.includes("MIDDLE_BRIDGE") ? "MIDDLE_BRIDGE" :
    target.includes("NECK") ? "NECK" :
    target.includes("MIDDLE") ? "MIDDLE" :
    "BRIDGE";

  // if guitar supports wanted, use it; else fall back toward BRIDGE > MIDDLE > NECK
  if (positions.includes(wanted)) return wanted;
  if (positions.includes("BRIDGE")) return "BRIDGE";
  if (positions.includes("MIDDLE_BRIDGE")) return "MIDDLE_BRIDGE";
  if (positions.includes("MIDDLE")) return "MIDDLE";
  if (positions.includes("NECK_MIDDLE")) return "NECK_MIDDLE";
  if (positions.includes("NECK")) return "NECK";
  return positions[positions.length - 1] || "BRIDGE";
}

function mapIntentToAmp(intent: any, amp: any, tone: any, guitar: any) {
  const knobs: KnobMap = {};
  const lines: string[] = [];
  let confidenceAdjustment = 0;
  let guidance: string[] = [];

  const gain = typeof intent?.gain === "number" ? intent.gain : 0.5;
  const eq = intent?.eq ?? { bass: 0.5, mid: 0.5, treble: 0.5 };
  const presence = typeof intent?.presence === "number" ? intent.presence : undefined;
  const reverb = typeof intent?.reverb === "number" ? intent.reverb : undefined;

  // Check for instrument mismatch
  if (tone.instrument && tone.instrument !== 'GUITAR') {
    confidenceAdjustment -= 0.2; // Reduce confidence for non-guitar tones
    guidance.push(`Note: This tone was created for ${tone.instrument.toLowerCase()}. Results may vary.`);
  }

  // Check for pickup type mismatch and apply EQ adjustments
  let adjustedEq = { ...eq };
  if (tone.sourcePickupType && guitar.pickupLayout) {
    const sourceType = tone.sourcePickupType;
    const userHasHumbuckers = guitar.pickupLayout.includes('H') || guitar.pickupLayout.includes('HH');
    const userHasSingleCoils = guitar.pickupLayout.includes('S') || guitar.pickupLayout.includes('SSS');
    
    if (sourceType === 'SINGLE_COIL' && userHasHumbuckers) {
      // Source was single coil, user has humbuckers - reduce treble/presence, boost mids
      adjustedEq.treble = Math.max(0, eq.treble - 0.2);
      adjustedEq.mid = Math.min(1, eq.mid + 0.15);
      if (presence !== undefined) {
        adjustedEq.presence = Math.max(0, presence - 0.15);
      }
      lines.push(`EQ adjusted: Reduced treble/presence, boosted mids (single-coil → humbucker)`);
    } else if (sourceType === 'HUMBUCKER' && userHasSingleCoils) {
      // Source was humbucker, user has single coils - boost treble/presence, reduce mids/bass
      adjustedEq.treble = Math.min(1, eq.treble + 0.2);
      adjustedEq.mid = Math.max(0, eq.mid - 0.15);
      adjustedEq.bass = Math.max(0, eq.bass - 0.1);
      if (presence !== undefined) {
        adjustedEq.presence = Math.min(1, presence + 0.15);
      }
      lines.push(`EQ adjusted: Boosted treble/presence, reduced mids/bass (humbucker → single-coil)`);
    }
  }

  // Core knobs
  if (amp.hasGain)    { knobs.gain = clamp01(gain); lines.push(`Gain ≈ ${Math.round(knobs.gain*10)}/10`); }
  if (amp.hasVolume)  { knobs.volume = clamp01(0.5 + (gain - 0.5) * 0.2); lines.push(`Volume ≈ ${Math.round(knobs.volume*10)}/10`); }
  if (amp.hasBass)    { knobs.bass = clamp01(adjustedEq.bass ?? 0.5); lines.push(`Bass ≈ ${Math.round(knobs.bass*10)}/10`); }
  if (amp.hasMid)     { knobs.mid = clamp01(adjustedEq.mid ?? 0.5); lines.push(`Mid ≈ ${Math.round(knobs.mid*10)}/10`); }
  if (amp.hasTreble)  { knobs.treble = clamp01(adjustedEq.treble ?? 0.5); lines.push(`Treble ≈ ${Math.round(knobs.treble*10)}/10`); }
  if (amp.hasPresence && adjustedEq.presence !== undefined) {
    knobs.presence = clamp01(adjustedEq.presence);
    lines.push(`Presence ≈ ${Math.round(knobs.presence*10)}/10`);
  } else if (amp.hasPresence && presence !== undefined) {
    knobs.presence = clamp01(presence);
    lines.push(`Presence ≈ ${Math.round(knobs.presence*10)}/10`);
  }
  if (amp.hasReverb && reverb !== undefined) {
    knobs.reverb = clamp01(reverb);
    lines.push(`Reverb ≈ ${Math.round(knobs.reverb*10)}/10`);
  }

  // Extended/common extras (optional mappings)
  if (amp.hasBright)   lines.push(`Bright: ${gain < 0.5 ? "ON for sparkle" : "OFF to avoid fizz"}`);
  if (amp.hasToneCut && (adjustedEq.presence !== undefined || presence !== undefined)) {
    // Vox Tone Cut is roughly inverse of presence (cut highs after phase inverter)
    const presenceValue = adjustedEq.presence !== undefined ? adjustedEq.presence : presence;
    knobs.toneCut = clamp01(1 - presenceValue);
    lines.push(`Tone Cut ≈ ${Math.round(knobs.toneCut*10)}/10 (inverse of presence target)`);
  }
  if (amp.hasDepth || amp.hasResonance) {
    const low = adjustedEq.bass ?? 0.5;
    knobs.depth = clamp01(low * 0.6 + 0.2);
    lines.push(`Depth/Resonance ≈ ${Math.round(knobs.depth*10)}/10 for low-end weight`);
  }
  if (amp.hasDriveChannel) {
    const driveOn = gain >= 0.55 ? "ON" : "OFF";
    lines.push(`Use Drive channel: ${driveOn}`);
  }

  // Confidence: fraction of requested tone features we could honor
  const available = [
    amp.hasGain, amp.hasVolume, amp.hasBass, amp.hasMid, amp.hasTreble,
    amp.hasPresence, amp.hasReverb, amp.hasDriveChannel,
    amp.hasBright, amp.hasToneCut, amp.hasDepth || amp.hasResonance
  ].filter(Boolean).length;
  const used = Object.keys(knobs).length;
  let confidence = Math.round(((used / Math.max(available, 1)) * 0.7 + 0.3) * 100) / 100;
  
  // Apply confidence adjustments
  confidence = Math.max(0.1, Math.min(1, confidence + confidenceAdjustment));

  return { knobs, lines, confidence, guidance };
}

export async function POST(req: NextRequest) {
  try {
    const { toneId, guitarId, ampId } = await req.json();

    const [tone, guitar, amp] = await Promise.all([
      prisma.tone.findUnique({ 
        where: { id: toneId }, 
        include: { 
          song: true,
          sourceGuitarArchetype: true,
          sourceAmpArchetype: true
        } 
      }),
      prisma.guitar.findUnique({ where: { id: guitarId } }),
      prisma.amp.findUnique({ where: { id: ampId } })
    ]);

    if (!tone || !guitar || !amp) {
      return NextResponse.json({ error: "tone/guitar/amp not found" }, { status: 404 });
    }

    const intent = tone.intent as any;
    const pickup = choosePickup(guitar.positions, intent?.pickupTarget);
    const { knobs, lines, confidence, guidance } = mapIntentToAmp(intent, amp, tone, guitar);

    return NextResponse.json({
      song: `${tone.song.title} — ${tone.song.artist}`,
      tone: { 
        name: tone.name, 
        slug: tone.slug, 
        role: tone.role, 
        section: tone.section, 
        guitarist: tone.guitarist,
        confidence: tone.confidence,
        instrument: tone.instrument,
        // Archetypes
        guitarArchetype: tone.sourceGuitarArchetype ? {
          id: tone.sourceGuitarArchetype.id,
          name: tone.sourceGuitarArchetype.name,
          pickupLayout: tone.sourceGuitarArchetype.pickupLayout,
          positions: tone.sourceGuitarArchetype.positions
        } : null,
        ampArchetype: tone.sourceAmpArchetype ? {
          id: tone.sourceAmpArchetype.id,
          name: tone.sourceAmpArchetype.name,
          topology: tone.sourceAmpArchetype.topology
        } : null,
        // Original Guitar Settings
        originalGuitarSettings: {
          pickupSelector: tone.sourcePickupSelector,
          volume: tone.sourceGuitarVolume,
          tone: tone.sourceGuitarTone,
          volumeNeck: tone.sourceGuitarVolumeNeck,
          volumeBridge: tone.sourceGuitarVolumeBridge,
          toneNeck: tone.sourceGuitarToneNeck,
          toneBridge: tone.sourceGuitarToneBridge,
          coilSplit: tone.sourceCoilSplit,
          otherSwitches: tone.sourceOtherSwitches
        },
        // Original Amp Settings
        originalAmpSettings: {
          masterVolume: tone.sourceAmpMasterVolume,
          channelVolume: tone.sourceAmpChannelVolume,
          channel: tone.sourceAmpChannelStructured,
          channelOther: tone.sourceAmpChannelOther,
          extras: tone.sourceAmpExtras
        },
        // Additional Source Info
        sourceGuitar: tone.sourceGuitar,
        sourcePickup: tone.sourcePickup,
        sourcePickupType: tone.sourcePickupType,
        sourceAmp: tone.sourceAmp,
        sourcePedals: tone.sourcePedals,
        sourceNotes: tone.sourceNotes
      },
      guitar: { brand: guitar.brand, model: guitar.model, pickupLayout: guitar.pickupLayout, positions: guitar.positions, pickupSelected: pickup, hasCoilSplitNeck: guitar.hasCoilSplitNeck, hasCoilSplitBridge: guitar.hasCoilSplitBridge },
      amp: {
        brand: amp.brand, model: amp.model,
        capabilities: {
          hasGain: amp.hasGain, hasVolume: amp.hasVolume, hasBass: amp.hasBass, hasMid: amp.hasMid, hasTreble: amp.hasTreble,
          hasPresence: amp.hasPresence, hasReverb: amp.hasReverb, hasDriveChannel: amp.hasDriveChannel,
          hasBright: amp.hasBright, hasToneCut: amp.hasToneCut, hasDepth: amp.hasDepth, hasResonance: amp.hasResonance,
          hasMasterVolume: amp.hasMasterVolume, hasPreampGain: amp.hasPreampGain, hasFXLoopLevel: amp.hasFXLoopLevel,
          hasContour: amp.hasContour, hasGraphicEQ: amp.hasGraphicEQ, hasBoost: amp.hasBoost, hasPowerScale: amp.hasPowerScale, hasNoiseGate: amp.hasNoiseGate
        },
        channels: amp.channels
      },
      suggestedAmpKnobs: knobs,
      rationale: lines,
      confidence,
      guidance,
      authorNotes: tone.notes ?? null
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "bad request" }, { status: 400 });
  }
} 