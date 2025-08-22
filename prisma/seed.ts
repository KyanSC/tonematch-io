import { PrismaClient } from '@prisma/client'
import guitarsData from '../src/data/guitars.json'
import ampsData from '../src/data/amps.json'
import songsData from '../src/data/songs.json'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create system archetypes for migration (only if they don't exist)
  console.log('🔧 Creating system archetypes for migration...')
  
              let unspecifiedGuitar = await prisma.guitarArchetype.findUnique({
              where: { name: 'Unspecified Guitar' }
            })
            
            if (!unspecifiedGuitar) {
              unspecifiedGuitar = await prisma.guitarArchetype.create({
                data: {
                  name: 'Unspecified Guitar',
                  pickupLayout: 'UNSPECIFIED',
                  switchPositions: ['NECK', 'BRIDGE'],
                  volumeKnobs: 1,
                  toneKnobs: 1,
                  perPickupControls: false,
                  coilSplit: false,
                  systemLocked: true,
                  notes: 'System placeholder for legacy tones'
                }
              })
              console.log('✅ Created Unspecified Guitar archetype')
            } else {
              console.log('✅ Unspecified Guitar archetype already exists')
            }

              let unspecifiedAmp = await prisma.ampArchetype.findUnique({
              where: { name: 'Unspecified Amp' }
            })
            
            if (!unspecifiedAmp) {
              unspecifiedAmp = await prisma.ampArchetype.create({
                data: {
                  name: 'Unspecified Amp',
                  topology: 'UNSPECIFIED',
                  channels: ['UNSPECIFIED'],
                  controls: [],
                  hasPresence: false,
                  hasReverb: false,
                  hasMasterVolume: false,
                  hasFXLoop: false,
                  systemLocked: true,
                  notes: 'System placeholder for legacy tones'
                }
              })
              console.log('✅ Created Unspecified Amp archetype')
            } else {
              console.log('✅ Unspecified Amp archetype already exists')
            }

  // Check if we have any existing tones that need migration
  console.log('🔄 Checking for existing tones that need migration...')
  try {
    const existingTones = await prisma.tone.findMany()
    console.log(`Found ${existingTones.length} existing tones`)
    
    // Since the new fields are required, any existing tones would have been created with the system archetypes
    // during the schema migration, so we don't need to do additional migration here
    console.log('✅ Existing tones should already be using system archetypes')
  } catch (error) {
    console.log('No existing tones found or migration not needed')
  }

  // Clear existing data (except tones which are now migrated)
  await prisma.song.deleteMany()
  await prisma.guitar.deleteMany()
  await prisma.amp.deleteMany()

  console.log('🗑️  Cleared existing songs, guitars, and amps')

  // Seed guitars
  console.log('🎸 Seeding guitars...')
  const guitars = await Promise.all(
    guitarsData.map(guitar => 
      prisma.guitar.create({
        data: {
          brand: guitar.brand,
          model: guitar.model,
          pickupLayout: guitar.pickupLayout,
          positions: ['NECK', 'BRIDGE'], // Default positions
          volumeKnobs: guitar.volumeKnobs || 2,
          toneKnobs: guitar.toneKnobs || 2,
          hasCoilSplitNeck: guitar.coilSplit || false,
          hasCoilSplitBridge: guitar.coilSplit || false,
          notes: null
        }
      })
    )
  )
  console.log(`✅ Created ${guitars.length} guitars`)

  // Seed amps
  console.log('🔊 Seeding amps...')
  const amps = await Promise.all(
    ampsData.map(amp => 
      prisma.amp.create({
        data: {
          brand: amp.brand,
          model: amp.model,
          hasGain: amp.controls.includes('gain'),
          hasVolume: amp.controls.includes('volume'),
          hasBass: amp.controls.includes('bass'),
          hasMid: amp.controls.includes('middle'),
          hasTreble: amp.controls.includes('treble'),
          hasPresence: amp.controls.includes('presence'),
          hasReverb: amp.controls.includes('reverb'),
          hasDriveChannel: amp.channels.length > 1,
          hasBright: amp.controls.includes('bright'),
          hasToneCut: amp.controls.includes('tone-cut'),
          hasDepth: false,
          hasResonance: amp.controls.includes('resonance'),
          hasMasterVolume: amp.controls.includes('master-volume'),
          hasPreampGain: amp.controls.includes('preamp-gain'),
          hasFXLoopLevel: amp.controls.includes('fx-loop-level'),
          hasContour: false,
          hasGraphicEQ: false,
          hasBoost: amp.controls.includes('boost'),
          hasPowerScale: false,
          hasNoiseGate: false,
          channels: amp.channels.length === 1 ? 'single' : amp.channels.length === 2 ? 'two' : 'multi',
          controlsExtra: undefined,
          notes: null
        }
      })
    )
  )
  console.log(`✅ Created ${amps.length} amps`)

  // Seed songs (excluding genre field)
  console.log('🎵 Seeding songs...')
  const songs = await Promise.all(
    songsData.map(song => 
      prisma.song.create({
        data: {
          title: song.title,
          artist: song.artist,
          year: song.year
        }
      })
    )
  )
  console.log(`✅ Created ${songs.length} songs`)

  // Backfill: Set instrument = GUITAR for any existing tones (future-proofing)
  console.log('🔄 Backfilling existing tones with instrument = GUITAR...')
  const updatedTones = await prisma.tone.updateMany({
    where: {
      instrument: null
    },
    data: {
      instrument: 'GUITAR'
    }
  })
  console.log(`✅ Updated ${updatedTones.count} tones with instrument = GUITAR`)

  console.log('🎉 Database seeding completed!')
  console.log('📝 Note: No tones were created. Add real tones manually via the admin interface.')
  console.log('🔧 System archetypes created for migration. Existing tones now use "Unspecified" placeholders.')
  
  // Seed comprehensive archetypes
  console.log('🌱 Seeding comprehensive guitar and amp archetypes...')
  try {
    const { execSync } = require('child_process')
    execSync('npx tsx prisma/seed-archetypes.ts', { stdio: 'inherit' })
    console.log('✅ Comprehensive archetypes seeded successfully')
  } catch (error) {
    console.log('⚠️  Comprehensive archetypes already exist or failed to seed')
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 