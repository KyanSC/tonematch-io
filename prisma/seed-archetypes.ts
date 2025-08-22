import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const guitarArchetypes = [
  {
    name: "Fender Stratocaster (SSS)",
    brand: "Fender",
    pickupLayout: "SSS",
    switchPositions: ["NECK","NECK+MIDDLE","MIDDLE","MIDDLE+BRIDGE","BRIDGE"],
    volumeKnobs: 1,
    toneKnobs: 2,
    perPickupControls: false,
    coilSplit: false,
    otherSwitches: [],
    notes: "Classic Fender Stratocaster with three single-coil pickups and 5-way selector"
  },
  {
    name: "Fender Stratocaster (HSS)",
    brand: "Fender",
    pickupLayout: "HSS",
    switchPositions: ["NECK","NECK+MIDDLE","MIDDLE","MIDDLE+BRIDGE","BRIDGE"],
    volumeKnobs: 1,
    toneKnobs: 2,
    perPickupControls: false,
    coilSplit: true,
    otherSwitches: [],
    notes: "Stratocaster with humbucker in bridge position, often with coil split"
  },
  {
    name: "Fender Telecaster (SS)",
    brand: "Fender",
    pickupLayout: "SS",
    switchPositions: ["NECK","NECK+BRIDGE","BRIDGE"],
    volumeKnobs: 1,
    toneKnobs: 1,
    perPickupControls: false,
    coilSplit: false,
    otherSwitches: [],
    notes: "Classic Telecaster with neck and bridge single-coil pickups"
  },
  {
    name: "Fender Telecaster (HH)",
    brand: "Fender",
    pickupLayout: "HH",
    switchPositions: ["NECK","NECK+BRIDGE","BRIDGE"],
    volumeKnobs: 1,
    toneKnobs: 1,
    perPickupControls: false,
    coilSplit: true,
    otherSwitches: [],
    notes: "Telecaster with dual humbuckers, often with coil split capability"
  },
  {
    name: "Gibson Les Paul Standard (HH)",
    brand: "Gibson",
    pickupLayout: "HH",
    switchPositions: ["NECK","NECK+BRIDGE","BRIDGE"],
    volumeKnobs: 2,
    toneKnobs: 2,
    perPickupControls: true,
    coilSplit: false,
    otherSwitches: [],
    notes: "Classic Les Paul with independent volume and tone controls per pickup"
  },
  {
    name: "Gibson Les Paul Modern (HH, coil split)",
    brand: "Gibson",
    pickupLayout: "HH",
    switchPositions: ["NECK","NECK+BRIDGE","BRIDGE"],
    volumeKnobs: 2,
    toneKnobs: 2,
    perPickupControls: true,
    coilSplit: true,
    otherSwitches: ["phase","pure-bypass"],
    notes: "Modern Les Paul with coil splits, phase reverse, and pure bypass"
  },
  {
    name: "Gibson Les Paul Junior (P90)",
    brand: "Gibson",
    pickupLayout: "P90",
    switchPositions: ["BRIDGE"],
    volumeKnobs: 1,
    toneKnobs: 1,
    perPickupControls: false,
    coilSplit: false,
    otherSwitches: [],
    notes: "Simple Les Paul Junior with single P90 pickup"
  },
  {
    name: "Gibson SG Standard (HH)",
    brand: "Gibson",
    pickupLayout: "HH",
    switchPositions: ["NECK","NECK+BRIDGE","BRIDGE"],
    volumeKnobs: 2,
    toneKnobs: 2,
    perPickupControls: true,
    coilSplit: false,
    otherSwitches: [],
    notes: "SG with dual humbuckers and independent controls"
  },
  {
    name: "Gibson ES-335 (HH)",
    brand: "Gibson",
    pickupLayout: "HH",
    switchPositions: ["NECK","NECK+BRIDGE","BRIDGE"],
    volumeKnobs: 2,
    toneKnobs: 2,
    perPickupControls: true,
    coilSplit: false,
    otherSwitches: [],
    notes: "Semi-hollow ES-335 with dual humbuckers"
  },
  {
    name: "PRS Custom 24 (HH, coil split)",
    brand: "PRS",
    pickupLayout: "HH",
    switchPositions: ["POSITION_1","POSITION_2","POSITION_3","POSITION_4","POSITION_5"],
    volumeKnobs: 1,
    toneKnobs: 1,
    perPickupControls: false,
    coilSplit: true,
    otherSwitches: [],
    notes: "PRS Custom 24 with 5-way rotary switch and coil splits"
  },
  {
    name: "Ibanez RG (HSH)",
    brand: "Ibanez",
    pickupLayout: "HSH",
    switchPositions: ["NECK","NECK_SPLIT+MIDDLE","MIDDLE","BRIDGE_SPLIT+MIDDLE","BRIDGE"],
    volumeKnobs: 1,
    toneKnobs: 1,
    perPickupControls: false,
    coilSplit: true,
    otherSwitches: [],
    notes: "Ibanez RG with HSH configuration and coil splits"
  },
  {
    name: "Ibanez JEM (HSH)",
    brand: "Ibanez",
    pickupLayout: "HSH",
    switchPositions: ["NECK","NECK_SPLIT+MIDDLE","MIDDLE","BRIDGE_SPLIT+MIDDLE","BRIDGE"],
    volumeKnobs: 1,
    toneKnobs: 1,
    perPickupControls: false,
    coilSplit: true,
    otherSwitches: [],
    notes: "Steve Vai signature JEM with HSH configuration"
  },
  {
    name: "Jackson Soloist (HH)",
    brand: "Jackson",
    pickupLayout: "HH",
    switchPositions: ["NECK","MIDDLE","BRIDGE"],
    volumeKnobs: 1,
    toneKnobs: 1,
    perPickupControls: false,
    coilSplit: true,
    otherSwitches: [],
    notes: "Jackson Soloist with dual humbuckers and 3-way switch"
  },
  {
    name: "Gretsch Duo Jet (FilterTron HH)",
    brand: "Gretsch",
    pickupLayout: "HH",
    switchPositions: ["NECK","NECK+BRIDGE","BRIDGE"],
    volumeKnobs: 3,
    toneKnobs: 0,
    perPickupControls: true,
    coilSplit: false,
    otherSwitches: ["master-tone-switch"],
    notes: "Gretsch Duo Jet with FilterTron pickups and master tone switch"
  },
  {
    name: "Rickenbacker 360 (Hi-Gain)",
    brand: "Rickenbacker",
    pickupLayout: "HH",
    switchPositions: ["NECK","NECK+BRIDGE","BRIDGE"],
    volumeKnobs: 2,
    toneKnobs: 2,
    perPickupControls: true,
    coilSplit: false,
    otherSwitches: ["blend"],
    notes: "Rickenbacker 360 with Hi-Gain pickups and blend control"
  }
]

const ampArchetypes = [
  {
    name: "Fender '65 Twin Reverb",
    brand: "Fender",
    topology: "American Clean Combo",
    channels: ["Normal","Vibrato"],
    controls: [
      {name:"Volume",min:0,max:10,default:5,perChannel:true},
      {name:"Treble",min:0,max:10,default:5,perChannel:true},
      {name:"Middle",min:0,max:10,default:5,perChannel:true},
      {name:"Bass",min:0,max:10,default:5,perChannel:true},
      {name:"Reverb",min:0,max:10,default:3},
      {name:"Tremolo Speed",min:0,max:10,default:5},
      {name:"Tremolo Intensity",min:0,max:10,default:5}
    ],
    hasPresence: false,
    hasReverb: true,
    hasMasterVolume: false,
    hasFXLoop: false,
    notes: "Classic Fender Twin Reverb with lush reverb and tremolo"
  },
  {
    name: "Fender '65 Deluxe Reverb",
    brand: "Fender",
    topology: "American Clean Combo",
    channels: ["Normal","Vibrato"],
    controls: [
      {name:"Volume",min:0,max:10,default:5,perChannel:true},
      {name:"Treble",min:0,max:10,default:5,perChannel:true},
      {name:"Bass",min:0,max:10,default:5,perChannel:true},
      {name:"Reverb",min:0,max:10,default:3},
      {name:"Vibrato Speed",min:0,max:10,default:5},
      {name:"Vibrato Intensity",min:0,max:10,default:5}
    ],
    hasPresence: false,
    hasReverb: true,
    hasMasterVolume: false,
    hasFXLoop: false,
    notes: "Beloved Deluxe Reverb with sweet breakup and reverb"
  },
  {
    name: "Fender Blues Junior",
    brand: "Fender",
    topology: "American Combo",
    channels: ["Single"],
    controls: [
      {name:"Volume",min:0,max:12,default:4},
      {name:"Master",min:0,max:12,default:4},
      {name:"Treble",min:0,max:12,default:5},
      {name:"Middle",min:0,max:12,default:5},
      {name:"Bass",min:0,max:12,default:5},
      {name:"Reverb",min:0,max:12,default:3},
      {name:"Fat Switch",min:0,max:1,default:0}
    ],
    hasPresence: false,
    hasReverb: true,
    hasMasterVolume: true,
    hasFXLoop: false,
    notes: "Compact Blues Junior with fat switch for extra gain"
  },
  {
    name: "Vox AC15C1",
    brand: "Vox",
    topology: "British Chime Combo",
    channels: ["Normal","Top Boost"],
    controls: [
      {name:"Volume (Normal)",min:0,max:10,default:5},
      {name:"Volume (Top Boost)",min:0,max:10,default:5},
      {name:"Treble",min:0,max:10,default:5},
      {name:"Bass",min:0,max:10,default:5},
      {name:"Tone Cut",min:0,max:10,default:5},
      {name:"Master",min:0,max:10,default:5},
      {name:"Reverb",min:0,max:10,default:3},
      {name:"Tremolo Speed",min:0,max:10,default:5},
      {name:"Tremolo Depth",min:0,max:10,default:5}
    ],
    hasPresence: false,
    hasReverb: true,
    hasMasterVolume: true,
    hasFXLoop: false,
    notes: "Vox AC15 with classic British chime and tremolo"
  },
  {
    name: "Vox AC30C2",
    brand: "Vox",
    topology: "British Chime Combo",
    channels: ["Normal","Top Boost"],
    controls: [
      {name:"Volume (Normal)",min:0,max:10,default:5},
      {name:"Volume (Top Boost)",min:0,max:10,default:5},
      {name:"Treble",min:0,max:10,default:5},
      {name:"Bass",min:0,max:10,default:5},
      {name:"Tone Cut",min:0,max:10,default:5},
      {name:"Master",min:0,max:10,default:5},
      {name:"Reverb",min:0,max:10,default:3},
      {name:"Tremolo Speed",min:0,max:10,default:5},
      {name:"Tremolo Depth",min:0,max:10,default:5}
    ],
    hasPresence: false,
    hasReverb: true,
    hasMasterVolume: true,
    hasFXLoop: false,
    notes: "Vox AC30 with more headroom and classic British tone"
  },
  {
    name: "Marshall JCM800 2203",
    brand: "Marshall",
    topology: "British Crunch Head",
    channels: ["Single"],
    controls: [
      {name:"Preamp Gain",min:0,max:10,default:6},
      {name:"Master",min:0,max:10,default:5},
      {name:"Treble",min:0,max:10,default:6},
      {name:"Middle",min:0,max:10,default:6},
      {name:"Bass",min:0,max:10,default:6},
      {name:"Presence",min:0,max:10,default:5}
    ],
    hasPresence: true,
    hasReverb: false,
    hasMasterVolume: true,
    hasFXLoop: false,
    notes: "Classic Marshall JCM800 with legendary crunch tone"
  },
  {
    name: "Marshall 1959SLP Plexi",
    brand: "Marshall",
    topology: "British Plexi Head",
    channels: ["High Treble","Normal"],
    controls: [
      {name:"Volume I",min:0,max:10,default:6},
      {name:"Volume II",min:0,max:10,default:6},
      {name:"Treble",min:0,max:10,default:5},
      {name:"Middle",min:0,max:10,default:5},
      {name:"Bass",min:0,max:10,default:5},
      {name:"Presence",min:0,max:10,default:5}
    ],
    hasPresence: true,
    hasReverb: false,
    hasMasterVolume: false,
    hasFXLoop: false,
    notes: "Legendary Marshall Plexi with no master volume"
  },
  {
    name: "Marshall DSL40",
    brand: "Marshall",
    topology: "British Multi-Channel Combo",
    channels: ["Clean","Crunch","Lead 1","Lead 2"],
    controls: [
      {name:"Gain",min:0,max:10,default:5,perChannel:true},
      {name:"Volume",min:0,max:10,default:5,perChannel:true},
      {name:"Treble",min:0,max:10,default:5},
      {name:"Middle",min:0,max:10,default:5},
      {name:"Bass",min:0,max:10,default:5},
      {name:"Presence",min:0,max:10,default:5},
      {name:"Resonance",min:0,max:10,default:5},
      {name:"Reverb",min:0,max:10,default:3,perChannel:true},
      {name:"Master",min:0,max:10,default:5}
    ],
    hasPresence: true,
    hasReverb: true,
    hasMasterVolume: true,
    hasFXLoop: true,
    notes: "Marshall DSL40 with four channels and modern features"
  },
  {
    name: "Orange Rockerverb 50",
    brand: "Orange",
    topology: "British High-Gain Head/Combo",
    channels: ["Clean","Dirty"],
    controls: [
      {name:"Clean Volume",min:0,max:10,default:5},
      {name:"Dirty Gain",min:0,max:10,default:6},
      {name:"Dirty Volume",min:0,max:10,default:5},
      {name:"Treble",min:0,max:10,default:5},
      {name:"Middle",min:0,max:10,default:5},
      {name:"Bass",min:0,max:10,default:5},
      {name:"Reverb",min:0,max:10,default:3},
      {name:"Master",min:0,max:10,default:5}
    ],
    hasPresence: false,
    hasReverb: true,
    hasMasterVolume: true,
    hasFXLoop: true,
    notes: "Orange Rockerverb with distinctive British high-gain tone"
  },
  {
    name: "Mesa/Boogie Dual Rectifier",
    brand: "Mesa/Boogie",
    topology: "High-Gain Head",
    channels: ["Channel 1","Channel 2","Channel 3"],
    controls: [
      {name:"Gain",min:0,max:10,default:6,perChannel:true},
      {name:"Treble",min:0,max:10,default:5,perChannel:true},
      {name:"Mid",min:0,max:10,default:5,perChannel:true},
      {name:"Bass",min:0,max:10,default:5,perChannel:true},
      {name:"Presence",min:0,max:10,default:5,perChannel:true},
      {name:"Master",min:0,max:10,default:5,perChannel:true},
      {name:"Output",min:0,max:10,default:5},
      {name:"Solo",min:0,max:10,default:5}
    ],
    hasPresence: true,
    hasReverb: false,
    hasMasterVolume: true,
    hasFXLoop: true,
    notes: "Mesa Dual Rectifier with three high-gain channels"
  },
  {
    name: "Mesa/Boogie Mark V",
    brand: "Mesa/Boogie",
    topology: "High-Gain Head/Combo",
    channels: ["Channel 1","Channel 2","Channel 3"],
    controls: [
      {name:"Gain",min:0,max:10,default:5,perChannel:true},
      {name:"Treble",min:0,max:10,default:5,perChannel:true},
      {name:"Mid",min:0,max:10,default:5,perChannel:true},
      {name:"Bass",min:0,max:10,default:5,perChannel:true},
      {name:"Presence",min:0,max:10,default:5,perChannel:true},
      {name:"Master",min:0,max:10,default:5,perChannel:true},
      {name:"5-Band EQ",min:-12,max:12,default:0},
      {name:"Reverb",min:0,max:10,default:3},
      {name:"Output",min:0,max:10,default:5},
      {name:"Solo",min:0,max:10,default:5}
    ],
    hasPresence: true,
    hasReverb: true,
    hasMasterVolume: true,
    hasFXLoop: true,
    notes: "Mesa Mark V with 5-band graphic EQ and three channels"
  },
  {
    name: "Peavey 6505",
    brand: "Peavey",
    topology: "High-Gain Head",
    channels: ["Rhythm","Lead"],
    controls: [
      {name:"Pre Gain",min:0,max:10,default:6,perChannel:true},
      {name:"Post Gain",min:0,max:10,default:5,perChannel:true},
      {name:"Low",min:0,max:10,default:5},
      {name:"Mid",min:0,max:10,default:5},
      {name:"High",min:0,max:10,default:5},
      {name:"Presence",min:0,max:10,default:5},
      {name:"Resonance",min:0,max:10,default:5}
    ],
    hasPresence: true,
    hasReverb: false,
    hasMasterVolume: true,
    hasFXLoop: true,
    notes: "Peavey 6505 with legendary high-gain tone"
  },
  {
    name: "Roland JC-120",
    brand: "Roland",
    topology: "Solid-State Stereo Combo",
    channels: ["Normal","Effects"],
    controls: [
      {name:"Volume",min:0,max:10,default:5,perChannel:true},
      {name:"Treble",min:0,max:10,default:5,perChannel:true},
      {name:"Middle",min:0,max:10,default:5,perChannel:true},
      {name:"Bass",min:0,max:10,default:5,perChannel:true},
      {name:"Chorus/Vibrato Depth",min:0,max:10,default:5},
      {name:"Chorus/Vibrato Speed",min:0,max:10,default:5},
      {name:"Reverb",min:0,max:10,default:3}
    ],
    hasPresence: false,
    hasReverb: true,
    hasMasterVolume: false,
    hasFXLoop: false,
    notes: "Roland JC-120 with legendary chorus and crystal clean tone"
  }
]

async function main() {
  console.log('🌱 Seeding comprehensive guitar and amp archetypes...')

  // Clear existing archetypes (except system ones)
  await prisma.guitarArchetype.deleteMany({
    where: {
      systemLocked: false
    }
  })
  await prisma.ampArchetype.deleteMany({
    where: {
      systemLocked: false
    }
  })

  console.log('🗑️  Cleared existing non-system archetypes')

  // Seed guitar archetypes
  console.log('🎸 Seeding guitar archetypes...')
  for (const archetype of guitarArchetypes) {
    await prisma.guitarArchetype.create({
      data: {
        name: archetype.name,
        brand: archetype.brand,
        pickupLayout: archetype.pickupLayout,
        switchPositions: archetype.switchPositions,
        volumeKnobs: archetype.volumeKnobs,
        toneKnobs: archetype.toneKnobs,
        perPickupControls: archetype.perPickupControls,
        coilSplit: archetype.coilSplit,
        otherSwitches: archetype.otherSwitches,
        notes: archetype.notes,
        systemLocked: false
      }
    })
  }
  console.log(`✅ Created ${guitarArchetypes.length} guitar archetypes`)

  // Seed amp archetypes
  console.log('🔊 Seeding amp archetypes...')
  for (const archetype of ampArchetypes) {
    await prisma.ampArchetype.create({
      data: {
        name: archetype.name,
        brand: archetype.brand,
        topology: archetype.topology,
        channels: archetype.channels,
        controls: archetype.controls,
        hasPresence: archetype.hasPresence,
        hasReverb: archetype.hasReverb,
        hasMasterVolume: archetype.hasMasterVolume,
        hasFXLoop: archetype.hasFXLoop,
        notes: archetype.notes,
        systemLocked: false
      }
    })
  }
  console.log(`✅ Created ${ampArchetypes.length} amp archetypes`)

  console.log('🎉 Comprehensive archetype seeding completed!')
  console.log(`📊 Total: ${guitarArchetypes.length} guitar archetypes, ${ampArchetypes.length} amp archetypes`)
}

main()
  .catch((e) => {
    console.error('Error seeding archetypes:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
