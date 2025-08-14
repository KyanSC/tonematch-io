import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    const {
      brand,
      model,
      ampFamily,
      isTube,
      channelsList,
      controlsList,
      buttons,
      voicings,
      powerSection
    } = body

    if (!brand || !model) {
      return NextResponse.json(
        { error: 'Brand and model are required' },
        { status: 400 }
      )
    }

    const amp = await prisma.amp.update({
      where: { id: params.id },
      data: {
        brand,
        model,
        ampFamily: ampFamily || null,
        isTube: isTube !== undefined ? isTube : null,
        channelsList: channelsList || null,
        controlsList: controlsList || null,
        buttons: buttons || null,
        voicings: voicings || null,
        powerSection: powerSection || null
      }
    })

    return NextResponse.json(amp)
  } catch (error) {
    console.error('Error updating amp:', error)
    return NextResponse.json(
      { error: 'Failed to update amp' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.amp.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting amp:', error)
    return NextResponse.json(
      { error: 'Failed to delete amp' },
      { status: 500 }
    )
  }
} 