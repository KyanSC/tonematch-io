import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'

// Helper function to validate and prepare guitar archetype data
function validateGuitarArchetypeData(formData: any) {
  const {
    name,
    brand,
    pickupLayout,
    switchPositions,
    volumeKnobs,
    toneKnobs,
    perPickupControls,
    coilSplit,
    otherSwitches,
    notes
  } = formData

  // Validation
  if (!name || !pickupLayout) {
    throw new Error('Name and pickup layout are required')
  }

  if (!switchPositions || !Array.isArray(switchPositions) || switchPositions.length === 0) {
    throw new Error('At least one switch position must be selected')
  }

  if (volumeKnobs === undefined || volumeKnobs < 0 || volumeKnobs > 4) {
    throw new Error('Volume knobs must be between 0 and 4')
  }

  if (toneKnobs === undefined || toneKnobs < 0 || toneKnobs > 4) {
    throw new Error('Tone knobs must be between 0 and 4')
  }

  return {
    name: name.trim(),
    brand: brand?.trim() || null,
    pickupLayout: pickupLayout.trim(),
    switchPositions: switchPositions,
    volumeKnobs: parseInt(volumeKnobs),
    toneKnobs: parseInt(toneKnobs),
    perPickupControls: Boolean(perPickupControls),
    coilSplit: Boolean(coilSplit),
    otherSwitches: otherSwitches && Array.isArray(otherSwitches) ? otherSwitches : null,
    notes: notes?.trim() || null
  }
}

// POST /api/admin/guitar-archetypes - Create a new guitar archetype
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate and prepare archetype data
    const archetypeData = validateGuitarArchetypeData(body)

    // Check if name is unique
    const existingArchetype = await prisma.guitarArchetype.findUnique({
      where: { name: archetypeData.name }
    })

    if (existingArchetype) {
      return NextResponse.json(
        { error: 'A guitar archetype with this name already exists' },
        { status: 400 }
      )
    }

    const archetype = await prisma.guitarArchetype.create({
      data: archetypeData
    })

    return NextResponse.json(archetype, { status: 201 })
  } catch (error: any) {
    console.error('Error creating guitar archetype:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create guitar archetype' },
      { status: 400 }
    )
  }
}

// GET /api/admin/guitar-archetypes - List all guitar archetypes
export async function GET(request: NextRequest) {
  try {
    const archetypes = await prisma.guitarArchetype.findMany({
      orderBy: [
        { systemLocked: 'asc' }, // System archetypes last
        { name: 'asc' }
      ],
      include: {
        _count: {
          select: { tones: true }
        }
      }
    })

    return NextResponse.json(archetypes)
  } catch (error: any) {
    console.error('Error fetching guitar archetypes:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch guitar archetypes' },
      { status: 500 }
    )
  }
}
