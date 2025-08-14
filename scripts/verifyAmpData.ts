import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function verifyAmpData() {
  console.log('🎵 Verifying amp data...')
  try {
    const amps = await prisma.amp.findMany({
      orderBy: { brand: 'asc' }
    })
    
    console.log(`Found ${amps.length} amps:`)
    console.log('')
    
    for (const amp of amps) {
      console.log(`${amp.brand} ${amp.model}`)
      console.log(`  ID: ${amp.id}`)
      console.log(`  Family: ${amp.ampFamily || 'Not set'}`)
      console.log(`  Tube: ${amp.isTube === null ? 'Not set' : amp.isTube ? 'Yes' : 'No'}`)
      console.log(`  Channels: ${amp.channelsList ? amp.channelsList.join(', ') : 'Not set'}`)
      console.log(`  Controls: ${amp.controlsList ? amp.controlsList.length : 0} knobs`)
      console.log(`  Buttons: ${amp.buttons ? amp.buttons.length : 0} buttons`)
      console.log(`  Voicings: ${amp.voicings ? amp.voicings.length : 0} voicings`)
      console.log(`  Power: ${amp.powerSection ? `${amp.powerSection.wattage}W (${amp.powerSection.tubeTypes.join(', ')})` : 'Not set'}`)
      console.log('')
    }
    
    // Check for any model names that still contain pickup codes
    const ampsWithCodes = amps.filter(amp => 
      amp.model.includes('(HH)') || 
      amp.model.includes('(SSS)') || 
      amp.model.includes('(HSS)') || 
      amp.model.includes('(HSH)') ||
      amp.model.includes('(SS)')
    )
    
    if (ampsWithCodes.length > 0) {
      console.log('⚠️  Amps with pickup codes in names:')
      ampsWithCodes.forEach(amp => console.log(`  ${amp.brand} ${amp.model}`))
    } else {
      console.log('✅ All amp names are clean')
    }
    
    // Summary
    const ampsWithData = amps.filter(amp => 
      amp.ampFamily !== null && 
      amp.isTube !== null && 
      amp.channelsList !== null && 
      amp.controlsList !== null
    )
    
    console.log(`📊 Summary:`)
    console.log(`  Total amps: ${amps.length}`)
    console.log(`  With structured data: ${ampsWithData.length}`)
    console.log(`  Missing data: ${amps.length - ampsWithData.length}`)
    
  } catch (error) {
    console.error('Error during verification:', error)
  } finally {
    await prisma.$disconnect()
  }
}

verifyAmpData() 