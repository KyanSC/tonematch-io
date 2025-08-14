import { NextRequest, NextResponse } from 'next/server'
import { getSongWithTones, getGearMatchesForTone } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const songId = searchParams.get('songId')
    const toneId = searchParams.get('toneId')
    const guitarId = searchParams.get('guitarId') || undefined
    const ampId = searchParams.get('ampId') || undefined

    if (songId) {
      const song = await getSongWithTones(songId)
      if (!song) {
        return NextResponse.json(
          { error: 'Song not found' },
          { status: 404 }
        )
      }
      return NextResponse.json(song)
    }

    if (toneId) {
      const gearMatches = await getGearMatchesForTone(toneId, guitarId, ampId)
      return NextResponse.json(gearMatches)
    }

    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error fetching tones:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tones' },
      { status: 500 }
    )
  }
} 