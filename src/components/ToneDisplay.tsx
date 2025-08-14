'use client'

import { useState, useEffect, useCallback } from 'react'
import { Tone, GearMatch, UserGear } from '@/lib/types'
import KnobVisualizer from './KnobVisualizer'
import { calculateConfidence, getDifficultyColor, getPickupPositionDescription } from '@/lib/toneMatching'

interface ToneDisplayProps {
  tone: Tone
  userGear?: UserGear
}

export default function ToneDisplay({ tone, userGear }: ToneDisplayProps) {
  const [gearMatches, setGearMatches] = useState<GearMatch[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedGearMatch, setSelectedGearMatch] = useState<GearMatch | null>(null)

  const fetchGearMatches = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      params.append('toneId', tone.id)
      
      if (userGear?.guitar?.id) {
        params.append('guitarId', userGear.guitar.id)
      }
      if (userGear?.amp?.id) {
        params.append('ampId', userGear.amp.id)
      }

      const response = await fetch(`/api/tones?${params}`)
      const data = await response.json()
      console.log('Gear matches fetched:', data.length, data)
      setGearMatches(data)
      
      // Select the first match by default
      if (data.length > 0) {
        setSelectedGearMatch(data[0])
      }
    } catch (error) {
      console.error('Error fetching gear matches:', error)
    } finally {
      setLoading(false)
    }
  }, [tone.id, userGear?.guitar?.id, userGear?.amp?.id])

  useEffect(() => {
    fetchGearMatches()
  }, [fetchGearMatches])

  const getConfidenceScore = (gearMatch: GearMatch) => {
    if (!userGear?.guitar || !userGear?.amp) return 50 // Default confidence for any gear
    
    // Check if this is an exact match for user's gear
    if (gearMatch.guitarId === userGear.guitar.id && gearMatch.ampId === userGear.amp.id) {
      return 100
    }
    
    return calculateConfidence(
      tone.baseSettings,
      gearMatch.settings,
      userGear.guitar,
      userGear.amp
    )
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600 bg-green-100'
    if (confidence >= 60) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const copySettings = async () => {
    if (!selectedGearMatch) return
    
    const settingsText = Object.entries(selectedGearMatch.settings)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n')
    
    try {
      await navigator.clipboard.writeText(settingsText)
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to copy settings:', error)
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-4"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Tone Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{tone.name}</h3>
            <p className="text-gray-600">{tone.description}</p>
          </div>
          <div className="flex gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(tone.difficulty)}`}>
              {tone.difficulty}
            </span>
          </div>
        </div>

        {/* Pickup Position Description */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            {getPickupPositionDescription(tone.baseSettings.pickupPosition)}
          </p>
        </div>
      </div>

      {/* Gear Matches */}
      {gearMatches.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-900">Available Gear Matches</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {gearMatches.map((gearMatch) => {
              const confidence = getConfidenceScore(gearMatch)
              const isSelected = selectedGearMatch?.id === gearMatch.id
              
              return (
                <div
                  key={gearMatch.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedGearMatch(gearMatch)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-gray-900">
                        {gearMatch.guitar?.brand} {gearMatch.guitar?.model}
                      </p>
                      <p className="text-sm text-gray-600">
                        {gearMatch.amp?.brand} {gearMatch.amp?.model}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(confidence)}`}>
                      {confidence}%
                    </span>
                  </div>
                  
                  <div className="text-xs text-gray-500 space-y-1">
                    <p>Pickup: {gearMatch.guitar?.pickupType}</p>
                    <p>Amp: {gearMatch.amp?.ampType}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Selected Gear Match Settings */}
      {selectedGearMatch && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-semibold text-gray-900">Settings for Your Gear</h4>
            <button
              onClick={copySettings}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Copy Settings
            </button>
          </div>
          
          <KnobVisualizer
            settings={selectedGearMatch.settings}
            title={`${selectedGearMatch.guitar?.brand} ${selectedGearMatch.guitar?.model} + ${selectedGearMatch.amp?.brand} ${selectedGearMatch.amp?.model}`}
          />
          
          {/* Confidence Score */}
          {userGear?.guitar && userGear?.amp && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Match Confidence</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getConfidenceColor(getConfidenceScore(selectedGearMatch))}`}>
                  {getConfidenceScore(selectedGearMatch)}%
                </span>
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getConfidenceScore(selectedGearMatch)}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* No Gear Matches */}
      {!loading && gearMatches.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600">No gear matches found for this tone.</p>
          <p className="text-sm text-gray-500 mt-1">Try selecting different gear or check back later.</p>
        </div>
      )}
    </div>
  )
} 