'use client'

import { useState, useEffect } from 'react'
import { Listbox } from '@headlessui/react'
import { getSelectorTypeLabel } from '@/data/guitarPresets'
import { getAmpFamilyLabel } from '@/data/ampPresets'

interface Guitar {
  id: string
  brand: string
  model: string
  pickupType?: string
  toneControls?: number
  pickupTypeEnum?: string
  pickupSwitchOptions?: string[]
  volumeKnobs?: number
  toneKnobs?: number
  otherControls?: any
  layoutPreset?: string
  pickupLayout?: any
  switchPositions?: any
  controls?: any
  layoutCode?: string
  pickups?: Array<{
    id: string
    type: string
    coilSplitCapable: boolean
  }>
  selector?: {
    type: string
    positions: Array<{
      name: string
      label: string
      active: Array<{
        pickupId: string
        split: boolean
      }>
      notes?: string
    }>
    coilSplitControl: string
  }
}

interface Amp {
  id: string
  brand: string
  model: string
  ampType?: string
  hasReverb?: boolean
  channels?: number
  controls?: any
  ampFamily?: string
  isTube?: boolean
  knobs?: any
  channelsArray?: string[]
  otherFeatures?: any
  channelsList?: string[]
  controlsList?: Array<{ name: string; max: number }>
  buttons?: Array<{ name: string }> | null
  voicings?: string[] | null
  powerSection?: { wattage: number; tubeTypes: string[] } | null
}

export default function GearSelector() {
  const [guitars, setGuitars] = useState<Guitar[]>([])
  const [amps, setAmps] = useState<Amp[]>([])
  const [selectedGuitar, setSelectedGuitar] = useState<Guitar | null>(null)
  const [selectedAmp, setSelectedAmp] = useState<Amp | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchGear()
  }, [])

  const fetchGear = async () => {
    try {
      const response = await fetch('/api/gear')
      if (!response.ok) {
        throw new Error('Failed to fetch gear')
      }
      const data = await response.json()
      
      // Handle both array and object responses
      const guitarsData = Array.isArray(data) ? [] : (data.guitars || [])
      const ampsData = Array.isArray(data) ? data : (data.amps || [])
      
      setGuitars(guitarsData)
      setAmps(ampsData)
    } catch (error) {
      console.error('Error fetching gear:', error)
      setGuitars([])
      setAmps([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading gear...</div>
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h2 className="text-2xl font-bold text-center mb-8">Select Your Gear</h2>
      
      {/* Guitar Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Guitar</h3>
        <Listbox value={selectedGuitar} onChange={setSelectedGuitar}>
          <Listbox.Button className="w-full p-3 border border-gray-300 rounded-lg text-left bg-white hover:bg-gray-50">
            {selectedGuitar ? (
              <div className="flex items-center justify-between">
                <span className="font-medium">{selectedGuitar.brand} {selectedGuitar.model}</span>
                {selectedGuitar.layoutCode && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                    {selectedGuitar.layoutCode}
                  </span>
                )}
              </div>
            ) : (
              <span className="text-gray-500">Select a guitar...</span>
            )}
          </Listbox.Button>
          <Listbox.Options className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
            {guitars.map((guitar) => (
              <Listbox.Option key={guitar.id} value={guitar}>
                {({ active }) => (
                  <div className={`p-3 cursor-pointer ${active ? 'bg-blue-100' : ''}`}>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{guitar.brand} {guitar.model}</span>
                      {guitar.layoutCode && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                          {guitar.layoutCode}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Listbox>
        
        {selectedGuitar && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Layout:</strong> {selectedGuitar.layoutCode || 'Not specified'} • 
              <strong> Switch:</strong> {selectedGuitar.selector?.type ? getSelectorTypeLabel(selectedGuitar.selector.type) : 'Not specified'} • 
              <strong> Pickups:</strong> {selectedGuitar.pickups?.length || 0} configured • 
              <strong> Controls:</strong> {selectedGuitar.controls ? 'Master volume/tone' : 'Not specified'}
            </p>
          </div>
        )}
      </div>

      {/* Amp Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Amplifier</h3>
        <Listbox value={selectedAmp} onChange={setSelectedAmp}>
          <Listbox.Button className="w-full p-3 border border-gray-300 rounded-lg text-left bg-white hover:bg-gray-50">
            {selectedAmp ? (
              <div className="flex items-center justify-between">
                <span className="font-medium">{selectedAmp.brand} {selectedAmp.model}</span>
                <div className="flex gap-1">
                  {selectedAmp.ampFamily && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                      {getAmpFamilyLabel(selectedAmp.ampFamily)}
                    </span>
                  )}
                  {selectedAmp.isTube !== null && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                      {selectedAmp.isTube ? 'Tube' : 'Solid State'}
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <span className="text-gray-500">Select an amplifier...</span>
            )}
          </Listbox.Button>
          <Listbox.Options className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
            {amps.map((amp) => (
              <Listbox.Option key={amp.id} value={amp}>
                {({ active }) => (
                  <div className={`p-3 cursor-pointer ${active ? 'bg-blue-100' : ''}`}>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{amp.brand} {amp.model}</span>
                      <div className="flex gap-1">
                        {amp.ampFamily && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                            {getAmpFamilyLabel(amp.ampFamily)}
                          </span>
                        )}
                        {amp.isTube !== null && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                            {amp.isTube ? 'Tube' : 'Solid State'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Listbox>
        
        {selectedAmp && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Family:</strong> {selectedAmp.ampFamily ? getAmpFamilyLabel(selectedAmp.ampFamily) : 'Not specified'} • 
              <strong> Type:</strong> {selectedAmp.isTube === null ? 'Unknown' : selectedAmp.isTube ? 'Tube' : 'Solid State'} • 
              <strong> Channels:</strong> {selectedAmp.channelsList?.join(', ') || 'Not specified'} • 
              <strong> Controls:</strong> {selectedAmp.controlsList?.length || 0} knobs
              {selectedAmp.powerSection && (
                <> • <strong> Power:</strong> {selectedAmp.powerSection.wattage}W</>
              )}
            </p>
          </div>
        )}
      </div>

      {/* Selection Summary */}
      {(selectedGuitar || selectedAmp) && (
        <div className="p-6 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Selected Gear</h3>
          <div className="space-y-2">
            {selectedGuitar && (
              <p><strong>Guitar:</strong> {selectedGuitar.brand} {selectedGuitar.model}</p>
            )}
            {selectedAmp && (
              <p><strong>Amp:</strong> {selectedAmp.brand} {selectedAmp.model}</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
} 