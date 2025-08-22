import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'

// Helper function to validate and prepare amp archetype data
function validateAmpArchetypeData(formData: any) {
  const {
    name,
    topology,
    notes
  } = formData

  // Validation
  if (!name || !topology) {
    throw new Error('Name and topology are required')
  }

  return {
    name: name.trim(),
    topology: topology.trim(),
    notes: notes?.trim() || null
  }
}

// PUT /api/admin/amp-archetypes/[id] - Update an amp archetype
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Validate and prepare archetype data
    const archetypeData = validateAmpArchetypeData(body)

    // Check if archetype exists and is not system locked
    const existingArchetype = await prisma.ampArchetype.findUnique({
      where: { id }
    })

    if (!existingArchetype) {
      return NextResponse.json(
        { error: 'Amp archetype not found' },
        { status: 404 }
      )
    }

    if (existingArchetype.systemLocked) {
      return NextResponse.json(
        { error: 'System archetypes cannot be modified' },
        { status: 400 }
      )
    }

    // Check if name is unique (excluding current archetype)
    const nameConflict = await prisma.ampArchetype.findFirst({
      where: {
        name: archetypeData.name,
        id: { not: id }
      }
    })

    if (nameConflict) {
      return NextResponse.json(
        { error: 'An amp archetype with this name already exists' },
        { status: 400 }
      )
    }

    const archetype = await prisma.ampArchetype.update({
      where: { id },
      data: archetypeData
    })

    return NextResponse.json(archetype)
  } catch (error: any) {
    console.error('Error updating amp archetype:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update amp archetype' },
      { status: 400 }
    )
  }
}

// DELETE /api/admin/amp-archetypes/[id] - Delete an amp archetype
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Check if archetype exists and is not system locked
    const existingArchetype = await prisma.ampArchetype.findUnique({
      where: { id },
      include: {
        _count: {
          select: { tones: true }
        }
      }
    })

    if (!existingArchetype) {
      return NextResponse.json(
        { error: 'Amp archetype not found' },
        { status: 404 }
      )
    }

    if (existingArchetype.systemLocked) {
      return NextResponse.json(
        { error: 'System archetypes cannot be deleted' },
        { status: 400 }
      )
    }

    if (existingArchetype._count.tones > 0) {
      return NextResponse.json(
        { error: `Cannot delete archetype - it is used by ${existingArchetype._count.tones} tone(s)` },
        { status: 400 }
      )
    }

    await prisma.ampArchetype.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Amp archetype deleted successfully' })
  } catch (error: any) {
    console.error('Error deleting amp archetype:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete amp archetype' },
      { status: 400 }
    )
  }
}
