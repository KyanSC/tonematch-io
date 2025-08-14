import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Function to clean model names by removing pickup codes
function cleanModelName(modelName: string): string {
  return modelName
    .replace(/\s*\(HH\)\s*/g, ' ')
    .replace(/\s*\(SSS\)\s*/g, ' ')
    .replace(/\s*\(HSS\)\s*/g, ' ')
    .replace(/\s*\(HSH\)\s*/g, ' ')
    .replace(/\s*\(SS\)\s*/g, ' ')
    .replace(/\s*\(HH,\s*coil\s*split\)\s*/g, ' ')
    .replace(/\s*\(HSH\)\s*/g, ' ')
    .trim()
}

async function cleanGuitarNames() {
  console.log('🎸 Starting guitar name cleanup...')

  try {
    // Get all guitars
    const guitars = await prisma.guitar.findMany()
    console.log(`Found ${guitars.length} guitars to process`)

    for (const guitar of guitars) {
      const originalName = guitar.model
      const cleanedName = cleanModelName(originalName)
      
      if (originalName !== cleanedName) {
        console.log(`Cleaning: "${originalName}" → "${cleanedName}"`)
        
        await prisma.guitar.update({
          where: { id: guitar.id },
          data: { model: cleanedName }
        })
        
        console.log(`  ✅ Updated`)
      } else {
        console.log(`Skipping: "${originalName}" (already clean)`)
      }
    }

    console.log('🎉 Guitar name cleanup completed!')
  } catch (error) {
    console.error('Error during cleanup:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the cleanup
cleanGuitarNames() 