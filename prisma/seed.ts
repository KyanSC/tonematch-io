import { PrismaClient } from '@prisma/client'
import guitarsData from '../src/data/guitars.json'
import ampsData from '../src/data/amps.json'
import songsData from '../src/data/songs.json'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Clear existing data
  await prisma.gearMatch.deleteMany()
  await prisma.tone.deleteMany()
  await prisma.song.deleteMany()
  await prisma.guitar.deleteMany()
  await prisma.amp.deleteMany()

  console.log('🗑️  Cleared existing data')

  // Seed guitars
  console.log('🎸 Seeding guitars...')
  const guitars = await Promise.all(
    guitarsData.map(guitar => 
      prisma.guitar.create({
        data: guitar
      })
    )
  )
  console.log(`✅ Created ${guitars.length} guitars`)

  // Seed amps
  console.log('🔊 Seeding amps...')
  const amps = await Promise.all(
    ampsData.map(amp => 
      prisma.amp.create({
        data: amp
      })
    )
  )
  console.log(`✅ Created ${amps.length} amps`)

  // Seed songs
  console.log('🎵 Seeding songs...')
  const songs = await Promise.all(
    songsData.map(song => 
      prisma.song.create({
        data: song
      })
    )
  )
  console.log(`✅ Created ${songs.length} songs`)

  console.log('🎉 Database seeding completed!')
  console.log('📝 Note: No tones or gear matches were created. Add real tones manually.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 