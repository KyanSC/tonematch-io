import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/tones?songId=... - Public read-only endpoint for tones
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const songId = searchParams.get('songId')

    if (!songId) {
      return NextResponse.json({ error: 'Song ID is required' }, { status: 400 })
    }

    const tones = await prisma.tone.findMany({
      where: { songId },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(tones)
  } catch (error: any) {
    console.error('Error fetching tones:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 