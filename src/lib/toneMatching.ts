import { Guitar, Amp, ToneSettings } from './types'

export function matchToneToGear(
  baseSettings: ToneSettings,
  guitar: Guitar,
  amp: Amp
): ToneSettings {
  const adaptedSettings = { ...baseSettings }

  // Adjust based on pickup type
  switch (guitar.pickupType) {
    case 'single-coil':
      // Single coils are brighter, reduce treble slightly
      adaptedSettings.treble = Math.max(0, adaptedSettings.treble - 1)
      adaptedSettings.bass = Math.min(10, adaptedSettings.bass + 1)
      break
    case 'humbucker':
      // Humbuckers are warmer, boost treble slightly
      adaptedSettings.treble = Math.min(10, adaptedSettings.treble + 1)
      adaptedSettings.bass = Math.max(0, adaptedSettings.bass - 1)
      break
    case 'p90':
      // P90s are in between, slight treble boost
      adaptedSettings.treble = Math.min(10, adaptedSettings.treble + 0.5)
      break
  }

  // Adjust based on amp type
  switch (amp.ampType) {
    case 'tube':
      // Tube amps are more responsive to gain
      adaptedSettings.gain = Math.min(10, adaptedSettings.gain + 1)
      adaptedSettings.volume = Math.max(0, adaptedSettings.volume - 1)
      break
    case 'solid-state':
      // Solid state amps need more gain for distortion
      adaptedSettings.gain = Math.min(10, adaptedSettings.gain + 2)
      adaptedSettings.volume = Math.max(0, adaptedSettings.volume - 1)
      break
    case 'modeling':
      // Modeling amps are versatile, minimal adjustment
      adaptedSettings.gain = Math.min(10, adaptedSettings.gain + 0.5)
      break
  }

  // Adjust reverb based on amp capability
  if (!amp.hasReverb) {
    adaptedSettings.reverb = 0
  }

  // Ensure all values are within bounds
  Object.keys(adaptedSettings).forEach(key => {
    const settingKey = key as keyof ToneSettings
    if (typeof adaptedSettings[settingKey] === 'number') {
      const value = adaptedSettings[settingKey] as number
      ;(adaptedSettings as Record<string, unknown>)[settingKey] = Math.max(0, Math.min(10, value))
    }
  })

  return adaptedSettings
}

export function calculateConfidence(
  baseSettings: ToneSettings,
  adaptedSettings: ToneSettings,
  guitar: Guitar,
  amp: Amp
): number {
  let confidence = 100

  // Reduce confidence based on gear limitations
  if (!amp.hasReverb && baseSettings.reverb > 0) {
    confidence -= 20
  }

  // Reduce confidence for major setting changes
  const settingChanges = [
    Math.abs(baseSettings.volume - adaptedSettings.volume),
    Math.abs(baseSettings.gain - adaptedSettings.gain),
    Math.abs(baseSettings.treble - adaptedSettings.treble),
    Math.abs(baseSettings.bass - adaptedSettings.bass),
    Math.abs(baseSettings.middle - adaptedSettings.middle)
  ]

  const averageChange = settingChanges.reduce((a, b) => a + b, 0) / settingChanges.length
  confidence -= averageChange * 5

  return Math.max(0, Math.min(100, confidence))
}

export function getPickupPositionDescription(position: string): string {
  switch (position) {
    case 'bridge':
      return 'Bridge pickup - Bright, cutting tone'
    case 'middle':
      return 'Middle pickup - Balanced, versatile tone'
    case 'neck':
      return 'Neck pickup - Warm, smooth tone'
    default:
      return 'Unknown pickup position'
  }
}

export function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case 'beginner':
      return 'text-green-600 bg-green-100'
    case 'intermediate':
      return 'text-yellow-600 bg-yellow-100'
    case 'advanced':
      return 'text-red-600 bg-red-100'
    default:
      return 'text-gray-600 bg-gray-100'
  }
} 