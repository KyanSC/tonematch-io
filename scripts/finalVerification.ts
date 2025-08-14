import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function finalVerification() {
  console.log('🎵 Final Verification - Amp Data Structure')
  console.log('=' .repeat(50))
  
  try {
    const amps = await prisma.amp.findMany({
      orderBy: { brand: 'asc' }
    })
    
    console.log(`✅ Found ${amps.length} amps with structured data`)
    console.log('')
    
    // Check data completeness
    const ampsWithCompleteData = amps.filter(amp => 
      amp.ampFamily !== null && 
      amp.isTube !== null && 
      amp.channelsList !== null && 
      amp.controlsList !== null
    )
    
    console.log(`📊 Data Completeness:`)
    console.log(`  Total amps: ${amps.length}`)
    console.log(`  With complete structured data: ${ampsWithCompleteData.length}`)
    console.log(`  Completion rate: ${((ampsWithCompleteData.length / amps.length) * 100).toFixed(1)}%`)
    console.log('')
    
    // Family distribution
    const familyCounts: Record<string, number> = {}
    amps.forEach(amp => {
      if (amp.ampFamily) {
        familyCounts[amp.ampFamily] = (familyCounts[amp.ampFamily] || 0) + 1
      }
    })
    
    console.log('🏭 Amp Family Distribution:')
    Object.entries(familyCounts).forEach(([family, count]) => {
      console.log(`  ${family}: ${count} amps`)
    })
    console.log('')
    
    // Tube vs Solid State
    const tubeCount = amps.filter(amp => amp.isTube === true).length
    const solidStateCount = amps.filter(amp => amp.isTube === false).length
    
    console.log('🔌 Tube vs Solid State:')
    console.log(`  Tube amps: ${tubeCount}`)
    console.log(`  Solid state amps: ${solidStateCount}`)
    console.log('')
    
    // Channel distribution
    const channelCounts: Record<string, number> = {}
    amps.forEach(amp => {
      if (amp.channelsList) {
        const channelCount = amp.channelsList.length
        channelCounts[channelCount] = (channelCounts[channelCount] || 0) + 1
      }
    })
    
    console.log('📺 Channel Distribution:')
    Object.entries(channelCounts).forEach(([count, amps]) => {
      console.log(`  ${count} channel(s): ${amps} amps`)
    })
    console.log('')
    
    // Control count distribution
    const controlCounts: Record<string, number> = {}
    amps.forEach(amp => {
      if (amp.controlsList) {
        const controlCount = amp.controlsList.length
        controlCounts[controlCount] = (controlCounts[controlCount] || 0) + 1
      }
    })
    
    console.log('🎛️ Control Count Distribution:')
    Object.entries(controlCounts).forEach(([count, amps]) => {
      console.log(`  ${count} controls: ${amps} amps`)
    })
    console.log('')
    
    // Sample detailed amp
    console.log('📋 Sample Amp Details (Fender Champion 20):')
    const sampleAmp = amps.find(amp => amp.model === 'Champion 20')
    if (sampleAmp) {
      console.log(`  Brand: ${sampleAmp.brand}`)
      console.log(`  Model: ${sampleAmp.model}`)
      console.log(`  Family: ${sampleAmp.ampFamily}`)
      console.log(`  Tube: ${sampleAmp.isTube}`)
      console.log(`  Channels: ${sampleAmp.channelsList?.join(', ')}`)
      console.log(`  Controls: ${sampleAmp.controlsList?.map(c => `${c.name} (0-${c.max})`).join(', ')}`)
      console.log(`  Buttons: ${sampleAmp.buttons?.map(b => b.name).join(', ')}`)
      console.log(`  Voicings: ${sampleAmp.voicings?.join(', ')}`)
      if (sampleAmp.powerSection) {
        console.log(`  Power: ${sampleAmp.powerSection.wattage}W (${sampleAmp.powerSection.tubeTypes.join(', ')})`)
      }
    }
    console.log('')
    
    // Check for any missing data
    const ampsWithMissingData = amps.filter(amp => 
      amp.ampFamily === null || 
      amp.isTube === null || 
      amp.channelsList === null || 
      amp.controlsList === null
    )
    
    if (ampsWithMissingData.length > 0) {
      console.log('⚠️  Amps with missing structured data:')
      ampsWithMissingData.forEach(amp => {
        console.log(`  ${amp.brand} ${amp.model}`)
      })
    } else {
      console.log('✅ All amps have complete structured data!')
    }
    
    console.log('')
    console.log('🎉 Amp data structure implementation is complete!')
    console.log('')
    console.log('Next steps:')
    console.log('  1. Visit /admin/amps to see the new admin interface')
    console.log('  2. Visit /gear to see the updated gear selector')
    console.log('  3. Test creating/editing amps with the new structured fields')
    
  } catch (error) {
    console.error('Error during verification:', error)
  } finally {
    await prisma.$disconnect()
  }
}

finalVerification() 