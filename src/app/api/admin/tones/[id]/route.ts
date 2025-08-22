import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'

// Helper function to validate and prepare tone data (same as POST route)
function validateToneData(formData: any) {
  const {
    songId,
    name,
    slug,
    guitarist,
    role,
    section,
    confidence,
    // Required Archetypes (new)
    sourceGuitarArchetypeId,
    sourceAmpArchetypeId,
    // Source Gear fields
    instrument,
    sourceGuitar,
    sourcePickup,
    sourcePickupType,
    // Original Guitar Settings
    sourcePickupSelector,
    sourceGuitarVolume,
    sourceGuitarTone,
    sourceGuitarVolumeNeck,
    sourceGuitarVolumeBridge,
    sourceGuitarToneNeck,
    sourceGuitarToneBridge,
    sourceCoilSplit,
    sourceOtherSwitches,
    sourceAmp,
    sourceAmpChannel,
    sourceAmpChannelStructured,
    sourceAmpChannelOther,
    sourcePedals,
    sourceNotes,
    // Original Amp Settings (Recorded)
    sourceAmpMasterVolume,
    sourceAmpChannelVolume,
    sourceAmpExtras,
    intent,
    notes
  } = formData

  // Validation
  if (!songId || !name || !slug) {
    throw new Error('Song ID, name, and slug are required')
  }

  // Validate required archetypes
  if (!sourceGuitarArchetypeId) {
    throw new Error('Guitar archetype is required')
  }
  if (!sourceAmpArchetypeId) {
    throw new Error('Amp archetype is required')
  }

  // Block use of "Unspecified" archetypes for new tones
  if (sourceGuitarArchetypeId === 'unspecified-guitar-id' || sourceGuitarArchetypeId.includes('Unspecified')) {
    throw new Error('Please choose a specific guitar archetype (not Unspecified). Use "Add New" if needed.')
  }
  if (sourceAmpArchetypeId === 'unspecified-amp-id' || sourceAmpArchetypeId.includes('Unspecified')) {
    throw new Error('Please choose a specific amp archetype (not Unspecified). Use "Add New" if needed.')
  }

  // Validate role
  const validRoles = ['CLEAN', 'RHYTHM', 'CRUNCH', 'LEAD', 'SOLO']
  if (role && !validRoles.includes(role)) {
    throw new Error('Role must be one of: CLEAN, RHYTHM, CRUNCH, LEAD, SOLO')
  }

  // Validate confidence
  const validConfidences = ['HIGH', 'MEDIUM', 'LOW']
  if (confidence && !validConfidences.includes(confidence)) {
    throw new Error('Confidence must be one of: HIGH, MEDIUM, LOW')
  }

  // Validate instrument
  const validInstruments = ['GUITAR', 'BASS']
  if (instrument && !validInstruments.includes(instrument)) {
    throw new Error('Instrument must be one of: GUITAR, BASS')
  }

  // Validate sourcePickupType
  const validPickupTypes = ['SINGLE_COIL', 'HUMBUCKER', 'P90', 'OTHER']
  if (sourcePickupType && !validPickupTypes.includes(sourcePickupType)) {
    throw new Error('Source pickup type must be one of: SINGLE_COIL, HUMBUCKER, P90, OTHER')
  }

  // Validate structured amp channel
  const validAmpChannels = ['CLEAN', 'CRUNCH', 'LEAD_HIGH_GAIN', 'ACOUSTIC_JC', 'OTHER']
  if (sourceAmpChannelStructured && !validAmpChannels.includes(sourceAmpChannelStructured)) {
    throw new Error('Amp channel must be one of: CLEAN, CRUNCH, LEAD_HIGH_GAIN, ACOUSTIC_JC, OTHER')
  }

  // Validate amp channel other is provided when OTHER is selected
  if (sourceAmpChannelStructured === 'OTHER' && !sourceAmpChannelOther?.trim()) {
    throw new Error('Amp channel "Other" requires a description')
  }

  // Validate guitar volume and tone (single or per-pickup)
  if (sourceGuitarVolume !== undefined && (sourceGuitarVolume < 0 || sourceGuitarVolume > 10)) {
    throw new Error('Guitar volume must be between 0 and 10')
  }
  if (sourceGuitarTone !== undefined && (sourceGuitarTone < 0 || sourceGuitarTone > 10)) {
    throw new Error('Guitar tone must be between 0 and 10')
  }
  if (sourceGuitarVolumeNeck !== undefined && (sourceGuitarVolumeNeck < 0 || sourceGuitarVolumeNeck > 10)) {
    throw new Error('Neck volume must be between 0 and 10')
  }
  if (sourceGuitarVolumeBridge !== undefined && (sourceGuitarVolumeBridge < 0 || sourceGuitarVolumeBridge > 10)) {
    throw new Error('Bridge volume must be between 0 and 10')
  }
  if (sourceGuitarToneNeck !== undefined && (sourceGuitarToneNeck < 0 || sourceGuitarToneNeck > 10)) {
    throw new Error('Neck tone must be between 0 and 10')
  }
  if (sourceGuitarToneBridge !== undefined && (sourceGuitarToneBridge < 0 || sourceGuitarToneBridge > 10)) {
    throw new Error('Bridge tone must be between 0 and 10')
  }

  // Validate amp volume settings
  if (sourceAmpMasterVolume !== undefined && (sourceAmpMasterVolume < 0 || sourceAmpMasterVolume > 10)) {
    throw new Error('Amp master volume must be between 0 and 10')
  }
  if (sourceAmpChannelVolume !== undefined && (sourceAmpChannelVolume < 0 || sourceAmpChannelVolume > 10)) {
    throw new Error('Amp channel volume must be between 0 and 10')
  }

  // Validate intent is valid JSON
  if (!intent) {
    throw new Error('Intent is required')
  }

  let parsedIntent
  try {
    parsedIntent = typeof intent === 'string' ? JSON.parse(intent) : intent
  } catch (error) {
    throw new Error('Intent must be valid JSON')
  }

  return {
    songId,
    name: name.trim(),
    slug: slug.trim(),
    guitarist: guitarist?.trim() || null,
    role: role || null,
    section: section?.trim() || null,
    confidence: confidence || null,
    // Required Archetypes (new)
    sourceGuitarArchetypeId,
    sourceAmpArchetypeId,
    // Source Gear fields
    instrument: instrument || 'GUITAR',
    sourceGuitar: sourceGuitar?.trim() || null,
    sourcePickup: sourcePickup?.trim() || null,
    sourcePickupType: sourcePickupType || null,
    // Original Guitar Settings
    sourcePickupSelector: sourcePickupSelector?.trim() || null,
    sourceGuitarVolume: sourceGuitarVolume || null,
    sourceGuitarTone: sourceGuitarTone || null,
    sourceGuitarVolumeNeck: sourceGuitarVolumeNeck || null,
    sourceGuitarVolumeBridge: sourceGuitarVolumeBridge || null,
    sourceGuitarToneNeck: sourceGuitarToneNeck || null,
    sourceGuitarToneBridge: sourceGuitarToneBridge || null,
    sourceCoilSplit: sourceCoilSplit?.trim() || null,
    sourceOtherSwitches: sourceOtherSwitches?.trim() || null,
    sourceAmp: sourceAmp?.trim() || null,
    sourceAmpChannel: sourceAmpChannel?.trim() || null,
    sourceAmpChannelStructured: sourceAmpChannelStructured || null,
    sourceAmpChannelOther: sourceAmpChannelOther?.trim() || null,
    sourcePedals: sourcePedals?.trim() || null,
    sourceNotes: sourceNotes?.trim() || null,
    // Original Amp Settings (Recorded)
    sourceAmpMasterVolume: sourceAmpMasterVolume || null,
    sourceAmpChannelVolume: sourceAmpChannelVolume || null,
    sourceAmpExtras: sourceAmpExtras || null,
    intent: parsedIntent,
    notes: notes?.trim() || null
  }
}

// PUT /api/admin/tones/[id] - Update a tone
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Validate and prepare tone data
    const toneData = validateToneData(body)

    // Check if slug is unique for this song (excluding current tone)
    const existingTone = await prisma.tone.findFirst({
      where: {
        songId: toneData.songId,
        slug: toneData.slug,
        id: { not: id }
      }
    })

    if (existingTone) {
      return NextResponse.json(
        { error: 'A tone with this slug already exists for this song' },
        { status: 400 }
      )
    }

    const tone = await prisma.tone.update({
      where: { id },
      data: toneData,
      include: {
        sourceGuitarArchetype: true,
        sourceAmpArchetype: true,
        song: true
      }
    })

    return NextResponse.json(tone)
  } catch (error: any) {
    console.error('Error updating tone:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update tone' },
      { status: 400 }
    )
  }
}

// DELETE /api/admin/tones/[id] - Delete a tone
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await prisma.tone.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Tone deleted successfully' })
  } catch (error: any) {
    console.error('Error deleting tone:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete tone' },
      { status: 400 }
    )
  }
} 