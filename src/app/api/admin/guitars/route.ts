import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'

// Helper function to validate and prepare guitar data
function validateGuitarData(formData: any) {
  const { 
    brand, 
    model, 
    pickupLayout, 
    positions, 
    volumeKnobs, 
    toneKnobs, 
    hasCoilSplitNeck, 
    hasCoilSplitBridge, 
    knobMapping, 
    notes 
  } = formData

  // Validation
  if (!brand || !model || !pickupLayout) {
    throw new Error('Brand, model, and pickup layout are required')
  }

  if (!Array.isArray(positions) || positions.length === 0) {
    throw new Error('At least one pickup position must be selected')
  }

  if (typeof volumeKnobs !== 'number' || volumeKnobs < 0 || volumeKnobs > 4) {
    throw new Error('Volume knobs must be a number between 0 and 4')
  }

  if (typeof toneKnobs !== 'number' || toneKnobs < 0 || toneKnobs > 4) {
    throw new Error('Tone knobs must be a number between 0 and 4')
  }

  // Validate positions are canonical tokens
  const validPositions = ['NECK', 'NECK_MIDDLE', 'MIDDLE', 'MIDDLE_BRIDGE', 'BRIDGE', 'NECK_BRIDGE']
  for (const position of positions) {
    if (!validPositions.includes(position)) {
      throw new Error(`Invalid position: ${position}`)
    }
  }

  return {
    brand,
    model,
    pickupLayout,
    positions,
    volumeKnobs,
    toneKnobs,
    hasCoilSplitNeck: Boolean(hasCoilSplitNeck),
    hasCoilSplitBridge: Boolean(hasCoilSplitBridge),
    knobMapping: knobMapping && Object.keys(knobMapping).length > 0 ? knobMapping : null,
    notes: notes || null
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate and prepare guitar data
    const guitarData = validateGuitarData(body)

    const guitar = await prisma.guitar.create({
      data: guitarData
    })

    return NextResponse.json(guitar)
  } catch (error: any) {
    console.error('Error creating guitar:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create guitar' },
      { status: 400 }
    )
  }
} 