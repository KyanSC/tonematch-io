import { PrismaClient } from '@prisma/client'
import { guitarPresets, computeLayoutCode } from '../src/data/guitarPresets'

const prisma = new PrismaClient()

// Mapping of guitar models to presets (using clean names)
const guitarModelToPreset: Record<string, string> = {
  // Fender Stratocasters
  'Player Stratocaster': 'strat_sss',
  'American Professional II Stratocaster': 'strat_sss',
  'Classic Vibe Stratocaster': 'strat_sss',
  'Player Stratocaster HSS': 'strat_hss',
  'Pacifica 112V': 'strat_hss',
  
  // Fender Telecasters
  'Player Telecaster': 'tele_ss',
  
  // Gibson/Epiphone Les Pauls
  'Les Paul Standard \'50s': 'les_paul_hh',
  'Les Paul Studio': 'les_paul_hh',
  'Les Paul Standard': 'les_paul_hh',
  
  // Gibson/Epiphone SGs
  'SG Standard': 'sg_hh',
  
  // PRS
  'SE Custom 24': 'prs_custom_24',
  
  // Ibanez
  'RG550': 'ibanez_rg_hsh',
  'GRX70QA': 'ibanez_rg_hsh',
  
  // Gretsch
  'G2622 Streamliner': 'gretsch_hh'
}

async function cleanupGuitarData() {
  console.log('🎸 Starting guitar data cleanup...')

  try {
    // Get all guitars
    const guitars = await prisma.guitar.findMany()
    console.log(`Found ${guitars.length} guitars to process`)

    for (const guitar of guitars) {
      console.log(`Processing: ${guitar.brand} ${guitar.model}`)
      
      // Skip if already has structured data
      if (guitar.pickups && guitar.selector && guitar.controls) {
        console.log(`  Skipping - already has structured data`)
        continue
      }

      // Find matching preset
      const presetKey = guitarModelToPreset[guitar.model]
      let updateData: any = {}

      if (presetKey && guitarPresets[presetKey]) {
        const preset = guitarPresets[presetKey]
        console.log(`  Applying preset: ${preset.name}`)
        
        updateData = {
          pickups: preset.pickups,
          selector: preset.selector,
          controls: preset.controls,
          layoutCode: computeLayoutCode(preset.pickups)
        }
      } else {
        console.log(`  No preset found - setting basic structure`)
        // Set basic structure for guitars without presets
        updateData = {
          pickups: [],
          selector: null,
          controls: null,
          layoutCode: ''
        }
      }

      // Update the guitar
      await prisma.guitar.update({
        where: { id: guitar.id },
        data: updateData
      })

      console.log(`  ✅ Updated`)
    }

    console.log('🎉 Guitar data cleanup completed!')
  } catch (error) {
    console.error('Error during cleanup:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the cleanup
cleanupGuitarData() 