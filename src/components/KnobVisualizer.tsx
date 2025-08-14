'use client'

import { useState } from 'react'
import { ToneSettings } from '@/lib/types'

interface KnobVisualizerProps {
  settings: ToneSettings
  title?: string
  className?: string
}

export default function KnobVisualizer({ settings, title, className = '' }: KnobVisualizerProps) {
  const [hoveredKnob, setHoveredKnob] = useState<string | null>(null)

  const knobSettings = [
    { key: 'volume', label: 'Volume', color: 'bg-blue-500' },
    { key: 'gain', label: 'Gain', color: 'bg-red-500' },
    { key: 'treble', label: 'Treble', color: 'bg-yellow-500' },
    { key: 'bass', label: 'Bass', color: 'bg-green-500' },
    { key: 'middle', label: 'Middle', color: 'bg-purple-500' },
    { key: 'reverb', label: 'Reverb', color: 'bg-indigo-500' }
  ]

  const getKnobRotation = (value: number) => {
    // Convert 0-10 scale to -135 to 135 degrees
    return ((value / 10) * 270) - 135
  }

  const getKnobColor = (value: number, baseColor: string) => {
    if (value >= 8) return 'bg-red-500'
    if (value >= 6) return 'bg-yellow-500'
    if (value >= 4) return 'bg-green-500'
    return baseColor
  }

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      )}
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {knobSettings.map(({ key, label, color }) => {
          const value = settings[key as keyof ToneSettings] as number
          const rotation = getKnobRotation(value)
          const knobColor = getKnobColor(value, color)
          
          return (
            <div
              key={key}
              className="text-center"
              onMouseEnter={() => setHoveredKnob(key)}
              onMouseLeave={() => setHoveredKnob(null)}
            >
              <div className="relative w-16 h-16 mx-auto mb-2">
                {/* Knob background */}
                <div className="absolute inset-0 bg-gray-200 rounded-full"></div>
                
                {/* Knob indicator */}
                <div
                  className={`absolute inset-1 ${knobColor} rounded-full transition-all duration-300`}
                  style={{
                    transform: `rotate(${rotation}deg)`,
                    transformOrigin: 'center'
                  }}
                ></div>
                
                {/* Knob center */}
                <div className="absolute inset-3 bg-white rounded-full border-2 border-gray-300"></div>
                
                {/* Knob pointer */}
                <div
                  className="absolute top-1 left-1/2 w-0.5 h-6 bg-gray-800 origin-bottom transition-transform duration-300"
                  style={{
                    transform: `translateX(-50%) rotate(${rotation}deg)`
                  }}
                ></div>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-700">{label}</p>
                <p className="text-lg font-bold text-gray-900">{value}</p>
                
                {hoveredKnob === key && (
                  <div className="absolute z-10 bg-gray-900 text-white text-xs rounded px-2 py-1 -mt-8 transform -translate-x-1/2 left-1/2">
                    {value}/10
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Pickup Position */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="text-center">
          <p className="text-sm font-medium text-gray-700 mb-2">Pickup Position</p>
          <div className="flex justify-center space-x-4">
            {['bridge', 'middle', 'neck'].map((position) => (
              <div
                key={position}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  settings.pickupPosition === position
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {position.charAt(0).toUpperCase() + position.slice(1)}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tone Control */}
      <div className="mt-4 text-center">
        <p className="text-sm font-medium text-gray-700 mb-2">Tone Control</p>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(settings.toneControl / 10) * 100}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-1">{settings.toneControl}/10</p>
      </div>
    </div>
  )
} 