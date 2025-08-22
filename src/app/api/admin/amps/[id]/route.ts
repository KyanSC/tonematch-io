import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'

// Helper function to validate and prepare amp data (same as POST route)
function validateAmpData(formData: any) {
  const { 
    brand, 
    model, 
    hasGain,
    hasVolume,
    hasBass,
    hasMid,
    hasTreble,
    hasPresence,
    hasReverb,
    hasDriveChannel,
    hasBright,
    hasToneCut,
    hasDepth,
    hasResonance,
    hasMasterVolume,
    hasPreampGain,
    hasFXLoopLevel,
    hasContour,
    hasGraphicEQ,
    hasBoost,
    hasPowerScale,
    hasNoiseGate,
    channels,
    controlsExtra,
    notes 
  } = formData

  // Validation
  if (!brand || !model) {
    throw new Error('Brand and model are required')
  }

  // Validate channels value
  if (channels && !['single', 'two', 'multi', ''].includes(channels)) {
    throw new Error('Channels must be "single", "two", "multi", or empty')
  }

  return {
    brand,
    model,
    // Core capability flags
    hasGain: Boolean(hasGain),
    hasVolume: Boolean(hasVolume),
    hasBass: Boolean(hasBass),
    hasMid: Boolean(hasMid),
    hasTreble: Boolean(hasTreble),
    hasPresence: Boolean(hasPresence),
    hasReverb: Boolean(hasReverb),
    hasDriveChannel: Boolean(hasDriveChannel),
    // Extended capability flags
    hasBright: Boolean(hasBright),
    hasToneCut: Boolean(hasToneCut),
    hasDepth: Boolean(hasDepth),
    hasResonance: Boolean(hasResonance),
    hasMasterVolume: Boolean(hasMasterVolume),
    hasPreampGain: Boolean(hasPreampGain),
    hasFXLoopLevel: Boolean(hasFXLoopLevel),
    hasContour: Boolean(hasContour),
    hasGraphicEQ: Boolean(hasGraphicEQ),
    hasBoost: Boolean(hasBoost),
    hasPowerScale: Boolean(hasPowerScale),
    hasNoiseGate: Boolean(hasNoiseGate),
    channels: channels || null,
    controlsExtra: controlsExtra || null,
    notes: notes || null
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Validate and prepare amp data
    const ampData = validateAmpData(body)

    const amp = await prisma.amp.update({
      where: { id },
      data: ampData
    })

    return NextResponse.json(amp)
  } catch (error: any) {
    console.error('Error updating amp:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update amp' },
      { status: 400 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    await prisma.amp.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting amp:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete amp' },
      { status: 500 }
    )
  }
} 