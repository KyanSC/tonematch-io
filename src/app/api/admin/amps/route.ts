import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
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

    const amp = await prisma.amp.create({
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
    console.error('Error creating amp:', error)
    return NextResponse.json(
      { error: 'Failed to create amp' },
      { status: 500 }
    )
  }
} 