import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'

// Helper function to validate and prepare amp archetype data
function validateAmpArchetypeData(formData: any) {
  const {
    name,
    brand,
    topology,
    channels,
    controls,
    hasPresence,
    hasReverb,
    hasMasterVolume,
    hasFXLoop,
    notes
  } = formData

  // Validation
  if (!name) {
    throw new Error('Name is required')
  }

  if (!channels || !Array.isArray(channels) || channels.length === 0) {
    throw new Error('At least one channel must be selected')
  }

  if (!controls || !Array.isArray(controls)) {
    throw new Error('Controls must be an array')
  }

  // Validate each control
  for (const control of controls) {
    if (!control.name || control.min === undefined || control.max === undefined || control.default === undefined) {
      throw new Error('Each control must have name, min, max, and default values')
    }
    if (control.min > control.max) {
      throw new Error('Control min value cannot be greater than max value')
    }
    if (control.default < control.min || control.default > control.max) {
      throw new Error('Control default value must be between min and max')
    }
  }

  return {
    name: name.trim(),
    brand: brand?.trim() || null,
    topology: topology?.trim() || null,
    channels: channels,
    controls: controls,
    hasPresence: Boolean(hasPresence),
    hasReverb: Boolean(hasReverb),
    hasMasterVolume: Boolean(hasMasterVolume),
    hasFXLoop: Boolean(hasFXLoop),
    notes: notes?.trim() || null
  }
}

// POST /api/admin/amp-archetypes - Create a new amp archetype
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate and prepare archetype data
    const archetypeData = validateAmpArchetypeData(body)

    // Check if name is unique
    const existingArchetype = await prisma.ampArchetype.findUnique({
      where: { name: archetypeData.name }
    })

    if (existingArchetype) {
      return NextResponse.json(
        { error: 'An amp archetype with this name already exists' },
        { status: 400 }
      )
    }

    const archetype = await prisma.ampArchetype.create({
      data: archetypeData
    })

    return NextResponse.json(archetype, { status: 201 })
  } catch (error: any) {
    console.error('Error creating amp archetype:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create amp archetype' },
      { status: 400 }
    )
  }
}

// GET /api/admin/amp-archetypes - List all amp archetypes
export async function GET(request: NextRequest) {
  try {
    const archetypes = await prisma.ampArchetype.findMany({
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
    console.error('Error fetching amp archetypes:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch amp archetypes' },
      { status: 500 }
    )
  }
}
