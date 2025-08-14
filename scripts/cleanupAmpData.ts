import { PrismaClient } from '@prisma/client'
import { ampPresets } from '../src/data/ampPresets'

const prisma = new PrismaClient()

// Map amp models to their preset keys
const ampModelToPreset: Record<string, string> = {
  'Fender Champion 20': 'fender_champion_20',
  'Fender Mustang LT25': 'fender_mustang_lt25',
  'Fender Blues Junior IV': 'fender_blues_junior_iv',
  'Fender Twin Reverb': 'fender_twin_reverb', // This maps to 'Fender \'65 Twin Reverb' preset
  'Marshall MG30GFX': 'marshall_mg30gfx',
  'Marshall DSL40CR': 'marshall_dsl40cr',
  'Marshall Code 50': 'marshall_code_50',
  'Boss Katana 50 MkII': 'boss_katana_50_mkii',
  'Blackstar ID:Core 20 V3': 'blackstar_id_core_20_v3',
  'Blackstar HT-1R MkII': 'blackstar_ht_1r_mkii',
  'Vox AC15C1': 'vox_ac15c1',
  'Vox AC30C2': 'vox_ac30c2',
  'Orange Crush 20RT': 'orange_crush_20rt',
  'Peavey Bandit 112': 'peavey_bandit_112',
  'Line 6 Spider V 60 MkII': 'line6_spider_v_60_mkii'
}

async function cleanupAmpData() {
  console.log('🎵 Starting amp data cleanup...')
  try {
    const amps = await prisma.amp.findMany()
    console.log(`Found ${amps.length} amps to process`)
    
    let updatedCount = 0
    
    for (const amp of amps) {
      // Use brand + model as the key
      const fullName = `${amp.brand} ${amp.model}`
      const presetKey = ampModelToPreset[fullName]
      
      console.log(`\nProcessing: ${fullName}`)
      console.log(`  Looking for preset key: ${presetKey}`)
      
      if (!presetKey) {
        console.log(`⚠️  No preset found for: ${fullName}`)
        continue
      }
      
      const preset = ampPresets[presetKey]
      console.log(`  Found preset: ${preset ? preset.name : 'NOT FOUND'}`)
      
      if (!preset) {
        console.log(`⚠️  Preset not found: ${presetKey}`)
        continue
      }
      
      // Only apply preset if any of the new fields are null
      if (amp.ampFamily === null || amp.isTube === null || amp.channelsList === null || amp.controlsList === null) {
        console.log(`🎵 Applying preset to: ${fullName}`)
        console.log(`  Family: ${preset.ampFamily}`)
        console.log(`  Tube: ${preset.isTube}`)
        console.log(`  Channels: ${preset.channels.join(', ')}`)
        console.log(`  Controls: ${preset.controls.length} knobs`)
        console.log(`  Buttons: ${preset.buttons?.length || 0} buttons`)
        console.log(`  Voicings: ${preset.voicings?.length || 0} voicings`)
        
        await prisma.amp.update({
          where: { id: amp.id },
          data: {
            ampFamily: preset.ampFamily as any,
            isTube: preset.isTube,
            channelsList: preset.channels,
            controlsList: preset.controls,
            buttons: preset.buttons,
            voicings: preset.voicings,
            powerSection: preset.powerSection
          }
        })
        
        updatedCount++
        console.log(`  ✅ Updated`)
      } else {
        console.log(`⏭️  Skipping: ${fullName} (already has structured data)`)
      }
    }
    
    console.log(`🎉 Amp data cleanup completed! Updated ${updatedCount} amps.`)
  } catch (error) {
    console.error('Error during cleanup:', error)
  } finally {
    await prisma.$disconnect()
  }
}

cleanupAmpData() 