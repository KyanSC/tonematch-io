import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function verifyGuitarData() {
  console.log('🔍 Verifying guitar data...')

  try {
    const guitars = await prisma.guitar.findMany()
    console.log(`Found ${guitars.length} guitars:\n`)

    guitars.forEach((guitar, index) => {
      console.log(`${index + 1}. ${guitar.brand} ${guitar.model}`)
      console.log(`   Layout Code: ${guitar.layoutCode || 'Not set'}`)
      console.log(`   Pickups: ${guitar.pickups?.length || 0} configured`)
      console.log(`   Selector: ${guitar.selector?.type || 'Not set'}`)
      console.log(`   Controls: ${guitar.controls ? 'Configured' : 'Not set'}`)
      console.log('')
    })

    // Check for any remaining pickup codes in names
    const guitarsWithCodes = guitars.filter(guitar => 
      guitar.model.includes('(HH)') || 
      guitar.model.includes('(SSS)') || 
      guitar.model.includes('(HSS)') || 
      guitar.model.includes('(HSH)') || 
      guitar.model.includes('(SS)')
    )

    if (guitarsWithCodes.length > 0) {
      console.log('⚠️  Found guitars with pickup codes in names:')
      guitarsWithCodes.forEach(guitar => {
        console.log(`   - ${guitar.brand} ${guitar.model}`)
      })
    } else {
      console.log('✅ All guitar names are clean (no pickup codes)')
    }

    // Check structured data completion
    const guitarsWithStructuredData = guitars.filter(guitar => 
      guitar.pickups && guitar.selector && guitar.controls
    )

    console.log(`\n📊 Data Summary:`)
    console.log(`   - Total guitars: ${guitars.length}`)
    console.log(`   - With structured data: ${guitarsWithStructuredData.length}`)
    console.log(`   - With layout codes: ${guitars.filter(g => g.layoutCode).length}`)

  } catch (error) {
    console.error('Error during verification:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the verification
verifyGuitarData() 