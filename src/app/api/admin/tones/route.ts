import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// POST /api/admin/tones - Create a new tone
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      songId,
      name,
      description,
      baseGuitarId,
      baseAmpId,
      referencePickupPosition,
      referencePickupVoice,
      baseSettings,
      songSection,
      confidence,
      sourceLinks,
      verified,
      verificationNotes
    } = body

    // Validation
    if (!name || name.trim() === '') {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    if (!songId) {
      return NextResponse.json({ error: 'Song ID is required' }, { status: 400 })
    }

    // Verify song exists
    const song = await prisma.song.findUnique({
      where: { id: songId }
    })
    if (!song) {
      return NextResponse.json({ error: 'Song not found' }, { status: 404 })
    }

    // Validate baseSettings if baseAmpId is provided
    if (baseAmpId && baseSettings) {
      const amp = await prisma.amp.findUnique({
        where: { id: baseAmpId },
        select: { controlsList: true }
      })
      
      if (!amp) {
        return NextResponse.json({ error: 'Base amp not found' }, { status: 404 })
      }

      if (amp.controlsList) {
        const expectedControls = (amp.controlsList as any[]).map(control => control.name)
        const providedControls = Object.keys(baseSettings)
        
        // Check if all provided controls exist in amp's controlsList
        for (const control of providedControls) {
          if (!expectedControls.includes(control)) {
            return NextResponse.json({ 
              error: `Invalid control '${control}'. Expected controls: ${expectedControls.join(', ')}` 
            }, { status: 400 })
          }
        }

        // Validate all values are integers 0-10
        for (const [control, value] of Object.entries(baseSettings)) {
          const numValue = Number(value)
          if (!Number.isInteger(numValue) || numValue < 0 || numValue > 10) {
            return NextResponse.json({ 
              error: `Control '${control}' value must be an integer between 0 and 10` 
            }, { status: 400 })
          }
        }
      }
    }

    // Validate sourceLinks
    if (sourceLinks) {
      if (!Array.isArray(sourceLinks) || sourceLinks.length === 0) {
        return NextResponse.json({ error: 'At least one source link is required' }, { status: 400 })
      }
      
      for (const link of sourceLinks) {
        if (typeof link !== 'string' || link.trim() === '') {
          return NextResponse.json({ error: 'All source links must be non-empty strings' }, { status: 400 })
        }
      }
    }

    // Auto-derive referencePickupVoice if baseGuitarId and referencePickupPosition are provided
    let derivedReferencePickupVoice = referencePickupVoice
    if (baseGuitarId && referencePickupPosition && !referencePickupVoice) {
      const guitar = await prisma.guitar.findUnique({
        where: { id: baseGuitarId },
        select: { selector: true }
      })
      
      if (guitar?.selector) {
        const selector = guitar.selector as any
        const position = selector.positions?.find((p: any) => 
          p.name === referencePickupPosition || p.label === referencePickupPosition
        )
        
        if (position) {
          derivedReferencePickupVoice = {
            active: position.active,
            blend: position.blend || 'n/a'
          }
        }
      }
    }

    const tone = await prisma.tone.create({
      data: {
        songId,
        name: name.trim(),
        description: description?.trim() || null,
        baseGuitarId: baseGuitarId || null,
        baseAmpId: baseAmpId || null,
        referencePickupPosition: referencePickupPosition || null,
        referencePickupVoice: derivedReferencePickupVoice,
        baseSettings,
        songSection: songSection || null,
        confidence: confidence || 70,
        sourceLinks: sourceLinks || null,
        verified: verified || false,
        verificationNotes: verificationNotes?.trim() || null,
        difficulty: 'intermediate' // Default value for existing field
      },
      include: {
        baseGuitar: {
          select: { id: true, brand: true, model: true }
        },
        baseAmp: {
          select: { id: true, brand: true, model: true }
        }
      }
    })

    return NextResponse.json(tone, { status: 201 })
  } catch (error) {
    console.error('Error creating tone:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET /api/admin/tones?songId=... - List tones for a song
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const songId = searchParams.get('songId')

    if (!songId) {
      return NextResponse.json({ error: 'Song ID is required' }, { status: 400 })
    }

    const tones = await prisma.tone.findMany({
      where: { songId },
      include: {
        baseGuitar: {
          select: { id: true, brand: true, model: true }
        },
        baseAmp: {
          select: { id: true, brand: true, model: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(tones)
  } catch (error) {
    console.error('Error fetching tones:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 