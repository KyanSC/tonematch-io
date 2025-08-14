import { NextRequest, NextResponse } from 'next/server'
import { getSongs } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || undefined
    const genre = searchParams.get('genre') || undefined
    const decade = searchParams.get('decade') || undefined
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined

    const filters = {
      genre,
      decade
    }

    const songs = await getSongs(search, filters, limit)
    
    return NextResponse.json(songs)
  } catch (error) {
    console.error('Error fetching songs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch songs' },
      { status: 500 }
    )
  }
} 