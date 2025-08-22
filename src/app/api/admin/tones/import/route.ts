import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()

// Schema for imported tone data
const ImportToneSchema = z.object({
  song: z.object({
    title: z.string(),
    artist: z.string(),
    year: z.number().optional(),
  }),
  name: z.string(),
  slug: z.string(),
  guitarist: z.string().optional(),
  role: z.enum(['CLEAN', 'RHYTHM', 'CRUNCH', 'LEAD', 'SOLO']).optional(),
  section: z.string().optional(),
  pickupSelectorOriginal: z.string().optional(),
  gain: z.union([z.string(), z.number()]).optional(),
  bass: z.union([z.string(), z.number()]).optional(),
  mid: z.union([z.string(), z.number()]).optional(),
  treble: z.union([z.string(), z.number()]).optional(),
  presence: z.union([z.string(), z.number()]).optional(),
  reverb: z.union([z.string(), z.number()]).optional(),
  delay: z.union([z.string(), z.number()]).optional(),
  notes: z.string().optional(),
  confidence: z.enum(['HIGH', 'MEDIUM', 'LOW']),
  sources: z.string().optional(),
  sourceGuitarArchetypeId: z.string(),
  sourceAmpArchetypeId: z.string(),
})

const ImportRequestSchema = z.object({
  tones: z.array(ImportToneSchema),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { tones } = ImportRequestSchema.parse(body)

    const createdTones = []
    const errors = []

    for (const toneData of tones) {
      try {
        // Find or create song
        let song = await prisma.song.findFirst({
          where: {
            title: toneData.song.title,
            artist: toneData.song.artist,
          },
        })

        if (!song) {
          song = await prisma.song.create({
            data: {
              title: toneData.song.title,
              artist: toneData.song.artist,
              year: toneData.song.year || null,
            },
          })
        }

        // Validate archetypes exist and are not "Unspecified"
        const guitarArchetype = await prisma.guitarArchetype.findUnique({
          where: { id: toneData.sourceGuitarArchetypeId },
        })

        const ampArchetype = await prisma.ampArchetype.findUnique({
          where: { id: toneData.sourceAmpArchetypeId },
        })

        if (!guitarArchetype || guitarArchetype.systemLocked) {
          throw new Error(`Invalid guitar archetype: ${toneData.sourceGuitarArchetypeId}`)
        }

        if (!ampArchetype || ampArchetype.systemLocked) {
          throw new Error(`Invalid amp archetype: ${toneData.sourceAmpArchetypeId}`)
        }

        // Parse numeric values
        const parseValue = (value: string | number | undefined): number | null => {
          if (value === undefined || value === null) return null
          if (typeof value === 'number') return value
          if (typeof value === 'string') {
            if (value.toLowerCase() === 'off' || value.toLowerCase() === 'n/a') return null
            const num = parseFloat(value)
            return isNaN(num) ? null : num
          }
          return null
        }

        // Create tone
        const tone = await prisma.tone.create({
          data: {
            songId: song.id,
            name: toneData.name,
            slug: toneData.slug,
            guitarist: toneData.guitarist,
            role: toneData.role,
            section: toneData.section,
            confidence: toneData.confidence,
            
            // Required archetypes
            sourceGuitarArchetypeId: toneData.sourceGuitarArchetypeId,
            sourceAmpArchetypeId: toneData.sourceAmpArchetypeId,
            
            // Original guitar settings
            sourcePickupSelector: toneData.pickupSelectorOriginal,
            
            // Original amp settings (recorded)
            sourceAmpMasterVolume: parseValue(toneData.gain),
            sourceAmpChannelVolume: parseValue(toneData.gain), // Use gain as channel volume
            sourceAmpExtras: [
              ...(toneData.bass !== undefined ? [{ control: 'Bass', value: String(toneData.bass), units: '0-10' }] : []),
              ...(toneData.mid !== undefined ? [{ control: 'Mid', value: String(toneData.mid), units: '0-10' }] : []),
              ...(toneData.treble !== undefined ? [{ control: 'Treble', value: String(toneData.treble), units: '0-10' }] : []),
              ...(toneData.presence !== undefined ? [{ control: 'Presence', value: String(toneData.presence), units: '0-10' }] : []),
              ...(toneData.reverb !== undefined ? [{ control: 'Reverb', value: String(toneData.reverb), units: '0-10' }] : []),
              ...(toneData.delay !== undefined ? [{ control: 'Delay', value: String(toneData.delay), units: 'ms' }] : []),
            ],
            
            // Intent (default values based on role)
            intent: {
              gain: parseValue(toneData.gain) || 5,
              eq: {
                bass: parseValue(toneData.bass) || 5,
                mid: parseValue(toneData.mid) || 5,
                treble: parseValue(toneData.treble) || 5,
              },
              reverb: parseValue(toneData.reverb) || 0,
              pickupHint: 'any',
              notes: toneData.notes,
            },
            
            // Notes and sources
            notes: toneData.notes,
            sourceNotes: toneData.sources,
          },
          include: {
            song: true,
            sourceGuitarArchetype: true,
            sourceAmpArchetype: true,
          },
        })

        createdTones.push(tone)
      } catch (error) {
        errors.push({
          tone: toneData.name,
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }

    if (errors.length > 0) {
      return NextResponse.json(
        {
          error: 'Some tones failed to create',
          createdTones,
          errors,
        },
        { status: 207 } // Multi-status
      )
    }

    return NextResponse.json({
      success: true,
      createdTones,
      message: `Successfully created ${createdTones.length} tones`,
    })
  } catch (error) {
    console.error('Error importing tones:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to import tones',
      },
      { status: 400 }
    )
  }
}
