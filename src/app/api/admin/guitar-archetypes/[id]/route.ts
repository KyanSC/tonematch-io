import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'

// Helper function to validate and prepare guitar archetype data
function validateGuitarArchetypeData(formData: any) {
  const {
    name,
    pickupLayout,
    positions,
    notes
  } = formData

  // Validation
  if (!name || !pickupLayout) {
    throw new Error('Name and pickup layout are required')
  }

  if (!positions || !Array.isArray(positions) || positions.length === 0) {
    throw new Error('At least one position must be selected')
  }

  return {
    name: name.trim(),
    pickupLayout: pickupLayout.trim(),
    positions: positions,
    notes: notes?.trim() || null
  }
}

// PUT /api/admin/guitar-archetypes/[id] - Update a guitar archetype
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Validate and prepare archetype data
    const archetypeData = validateGuitarArchetypeData(body)

    // Check if archetype exists and is not system locked
    const existingArchetype = await prisma.guitarArchetype.findUnique({
      where: { id }
    })

    if (!existingArchetype) {
      return NextResponse.json(
        { error: 'Guitar archetype not found' },
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
    const nameConflict = await prisma.guitarArchetype.findFirst({
      where: {
        name: archetypeData.name,
        id: { not: id }
      }
    })

    if (nameConflict) {
      return NextResponse.json(
        { error: 'A guitar archetype with this name already exists' },
        { status: 400 }
      )
    }

    const archetype = await prisma.guitarArchetype.update({
      where: { id },
      data: archetypeData
    })

    return NextResponse.json(archetype)
  } catch (error: any) {
    console.error('Error updating guitar archetype:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update guitar archetype' },
      { status: 400 }
    )
  }
}

// DELETE /api/admin/guitar-archetypes/[id] - Delete a guitar archetype
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Check if archetype exists and is not system locked
    const existingArchetype = await prisma.guitarArchetype.findUnique({
      where: { id },
      include: {
        _count: {
          select: { tones: true }
        }
      }
    })

    if (!existingArchetype) {
      return NextResponse.json(
        { error: 'Guitar archetype not found' },
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

    await prisma.guitarArchetype.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Guitar archetype deleted successfully' })
  } catch (error: any) {
    console.error('Error deleting guitar archetype:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete guitar archetype' },
      { status: 400 }
    )
  }
}
