import { NextRequest, NextResponse } from 'next/server'
import { getGuitars, getAmps } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    if (type === 'guitars') {
      const guitars = await getGuitars()
      return NextResponse.json(guitars)
    } else if (type === 'amps') {
      const amps = await getAmps()
      return NextResponse.json(amps)
    } else {
      // Return both if no type specified
      const [guitars, amps] = await Promise.all([getGuitars(), getAmps()])
      return NextResponse.json({ guitars, amps })
    }
  } catch (error: any) {
    console.error('Error fetching gear:', error)
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    })
    return NextResponse.json(
      { error: 'Failed to fetch gear', details: error.message },
      { status: 500 }
    )
  }
} 