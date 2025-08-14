import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { 
      brand, 
      model, 
      pickupTypeEnum, 
      pickupSwitchOptions, 
      volumeKnobs, 
      toneKnobs, 
      otherControls,
      // New structured fields
      pickups,
      selector,
      controls,
      layoutCode
    } = body

    // Validation
    if (!brand || !model) {
      return NextResponse.json(
        { error: 'Brand and model are required' },
        { status: 400 }
      )
    }

    // Validate enum values
    const validPickupTypes = ['single_coil', 'humbucker', 'p90', 'other']
    if (pickupTypeEnum && !validPickupTypes.includes(pickupTypeEnum)) {
      return NextResponse.json(
        { error: 'Invalid pickup type' },
        { status: 400 }
      )
    }

    const guitar = await prisma.guitar.update({
      where: { id: params.id },
      data: {
        brand,
        model,
        pickupTypeEnum: pickupTypeEnum || null,
        pickupSwitchOptions: pickupSwitchOptions || null,
        volumeKnobs: volumeKnobs || null,
        toneKnobs: toneKnobs || null,
        otherControls: otherControls || null,
        // New structured fields
        pickups: pickups || null,
        selector: selector || null,
        controls: controls || null,
        layoutCode: layoutCode || null,
        // Keep legacy fields for backward compatibility
        pickupType: pickupTypeEnum || null,
        toneControls: (volumeKnobs || 0) + (toneKnobs || 0)
      }
    })

    return NextResponse.json(guitar)
  } catch (error) {
    console.error('Error updating guitar:', error)
    return NextResponse.json(
      { error: 'Failed to update guitar' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.guitar.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting guitar:', error)
    return NextResponse.json(
      { error: 'Failed to delete guitar' },
      { status: 500 }
    )
  }
} 