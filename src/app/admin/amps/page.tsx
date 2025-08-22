'use client'

import { useState, useEffect } from 'react'
import { Amp } from '@/lib/types'

export default function AdminAmpsPage() {
  const [amps, setAmps] = useState<Amp[]>([])
  const [loading, setLoading] = useState(true)
  const [editingAmp, setEditingAmp] = useState<Amp | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    // Core capability flags
    hasGain: false,
    hasVolume: true,
    hasBass: true,
    hasMid: true,
    hasTreble: true,
    hasPresence: false,
    hasReverb: false,
    hasDriveChannel: false,
    // Extended capability flags
    hasBright: false,
    hasToneCut: false,
    hasDepth: false,
    hasResonance: false,
    hasMasterVolume: false,
    hasPreampGain: false,
    hasFXLoopLevel: false,
    hasContour: false,
    hasGraphicEQ: false,
    hasBoost: false,
    hasPowerScale: false,
    hasNoiseGate: false,
    channels: '',
    controlsExtra: '',
    notes: ''
  })

  useEffect(() => {
    fetchAmps()
  }, [])

  const fetchAmps = async () => {
    try {
      const response = await fetch('/api/gear')
      if (!response.ok) {
        throw new Error('Failed to fetch amps')
      }
      const data = await response.json()
      
      // Handle both array and object responses
      const ampsData = Array.isArray(data) ? data : (data.amps || [])
      setAmps(ampsData)
    } catch (error) {
      console.error('Error fetching amps:', error)
      setAmps([])
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (amp: Amp) => {
    setEditingAmp(amp)
    setFormData({
      brand: amp.brand,
      model: amp.model,
      // Core capability flags
      hasGain: amp.hasGain,
      hasVolume: amp.hasVolume,
      hasBass: amp.hasBass,
      hasMid: amp.hasMid,
      hasTreble: amp.hasTreble,
      hasPresence: amp.hasPresence,
      hasReverb: amp.hasReverb,
      hasDriveChannel: amp.hasDriveChannel,
      // Extended capability flags
      hasBright: amp.hasBright,
      hasToneCut: amp.hasToneCut,
      hasDepth: amp.hasDepth,
      hasResonance: amp.hasResonance,
      hasMasterVolume: amp.hasMasterVolume,
      hasPreampGain: amp.hasPreampGain,
      hasFXLoopLevel: amp.hasFXLoopLevel,
      hasContour: amp.hasContour,
      hasGraphicEQ: amp.hasGraphicEQ,
      hasBoost: amp.hasBoost,
      hasPowerScale: amp.hasPowerScale,
      hasNoiseGate: amp.hasNoiseGate,
      channels: amp.channels || '',
      controlsExtra: amp.controlsExtra ? JSON.stringify(amp.controlsExtra, null, 2) : '',
      notes: amp.notes || ''
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this amp?')) return
    
    try {
      const response = await fetch(`/api/admin/amps/${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setAmps(amps.filter(amp => amp.id !== id))
      } else {
        alert('Failed to delete amp')
      }
    } catch (error) {
      console.error('Error deleting amp:', error)
      alert('Error deleting amp')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingAmp 
        ? `/api/admin/amps/${editingAmp.id}`
        : '/api/admin/amps'
      
      const method = editingAmp ? 'PUT' : 'POST'
      
      // Parse controlsExtra JSON if provided
      let controlsExtra = null
      if (formData.controlsExtra.trim()) {
        try {
          controlsExtra = JSON.parse(formData.controlsExtra)
        } catch (error) {
          alert('Invalid JSON in Controls Extra field')
          return
        }
      }
      
      const submitData = {
        ...formData,
        controlsExtra: controlsExtra
      }
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      })
      
      if (response.ok) {
        setShowForm(false)
        setEditingAmp(null)
        setFormData({
          brand: '',
          model: '',
          // Core capability flags
          hasGain: false,
          hasVolume: true,
          hasBass: true,
          hasMid: true,
          hasTreble: true,
          hasPresence: false,
          hasReverb: false,
          hasDriveChannel: false,
          // Extended capability flags
          hasBright: false,
          hasToneCut: false,
          hasDepth: false,
          hasResonance: false,
          hasMasterVolume: false,
          hasPreampGain: false,
          hasFXLoopLevel: false,
          hasContour: false,
          hasGraphicEQ: false,
          hasBoost: false,
          hasPowerScale: false,
          hasNoiseGate: false,
          channels: '',
          controlsExtra: '',
          notes: ''
        })
        fetchAmps()
      } else {
        const errorData = await response.json()
        alert(`Failed to save amp: ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error saving amp:', error)
      alert('Error saving amp')
    }
  }

  if (loading) {
    return <div className="p-6">Loading amps...</div>
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin - Amps</h1>
        <button
          onClick={() => {
            setEditingAmp(null)
            setFormData({
              brand: '',
              model: '',
              // Core capability flags
              hasGain: false,
              hasVolume: true,
              hasBass: true,
              hasMid: true,
              hasTreble: true,
              hasPresence: false,
              hasReverb: false,
              hasDriveChannel: false,
              // Extended capability flags
              hasBright: false,
              hasToneCut: false,
              hasDepth: false,
              hasResonance: false,
              hasMasterVolume: false,
              hasPreampGain: false,
              hasFXLoopLevel: false,
              hasContour: false,
              hasGraphicEQ: false,
              hasBoost: false,
              hasPowerScale: false,
              hasNoiseGate: false,
              channels: '',
              controlsExtra: '',
              notes: ''
            })
            setShowForm(true)
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add New Amp
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {editingAmp ? 'Edit Amp' : 'Add New Amp'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Brand *</label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({...formData, brand: e.target.value})}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Model *</label>
                  <input
                    type="text"
                    value={formData.model}
                    onChange={(e) => setFormData({...formData, model: e.target.value})}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
              </div>

              {/* Core Capability Flags */}
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">Core Capabilities</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { key: 'hasGain', label: 'Gain' },
                    { key: 'hasVolume', label: 'Volume' },
                    { key: 'hasBass', label: 'Bass' },
                    { key: 'hasMid', label: 'Mid' },
                    { key: 'hasTreble', label: 'Treble' },
                    { key: 'hasPresence', label: 'Presence' },
                    { key: 'hasReverb', label: 'Reverb' },
                    { key: 'hasDriveChannel', label: 'Drive Channel' }
                  ].map(({ key, label }) => (
                    <label key={key} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData[key as keyof typeof formData] as boolean}
                        onChange={(e) => setFormData({...formData, [key]: e.target.checked})}
                        className="mr-2"
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Extended Capability Flags */}
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">Extended Capabilities</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { key: 'hasBright', label: 'Bright Switch' },
                    { key: 'hasToneCut', label: 'Tone Cut' },
                    { key: 'hasDepth', label: 'Depth' },
                    { key: 'hasResonance', label: 'Resonance' },
                    { key: 'hasMasterVolume', label: 'Master Volume' },
                    { key: 'hasPreampGain', label: 'Preamp Gain' },
                    { key: 'hasFXLoopLevel', label: 'FX Loop Level' },
                    { key: 'hasContour', label: 'Contour' },
                    { key: 'hasGraphicEQ', label: 'Graphic EQ' },
                    { key: 'hasBoost', label: 'Boost' },
                    { key: 'hasPowerScale', label: 'Power Scale' },
                    { key: 'hasNoiseGate', label: 'Noise Gate' }
                  ].map(({ key, label }) => (
                    <label key={key} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData[key as keyof typeof formData] as boolean}
                        onChange={(e) => setFormData({...formData, [key]: e.target.checked})}
                        className="mr-2"
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Channels */}
              <div>
                <label className="block text-sm font-medium mb-1">Channels</label>
                <input
                  type="text"
                  value={formData.channels}
                  onChange={(e) => setFormData({...formData, channels: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                  placeholder="single, two, or multi"
                />
                <p className="text-xs text-gray-600 mt-1">
                  Enter "single", "two", or "multi" to describe channel configuration
                </p>
              </div>

              {/* Controls Extra (JSON) */}
              <div>
                <label className="block text-sm font-medium mb-1">Controls Extra (Optional JSON)</label>
                <textarea
                  value={formData.controlsExtra}
                  onChange={(e) => setFormData({...formData, controlsExtra: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                  rows={4}
                  placeholder='{"uniqueControl": "value", "specialFeature": true}'
                />
                <p className="text-xs text-gray-600 mt-1">
                  Optional JSON for unique controls not covered by standard flags
                </p>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium mb-1">Notes (Optional)</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                  rows={3}
                  placeholder="Additional notes about this amplifier..."
                />
              </div>

              {/* Form Actions */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  {editingAmp ? 'Update Amp' : 'Create Amp'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid gap-6">
        {amps.map((amp) => (
          <AmpCard
            key={amp.id}
            amp={amp}
            onEdit={() => handleEdit(amp)}
            onDelete={() => handleDelete(amp.id)}
          />
        ))}
      </div>
    </div>
  )
}

function AmpCard({ amp, onEdit, onDelete }: { amp: Amp; onEdit: () => void; onDelete: () => void }) {
  // Count capability flags for display
  const coreCapabilities = [
    amp.hasGain && 'Gain',
    amp.hasVolume && 'Volume', 
    amp.hasBass && 'Bass',
    amp.hasMid && 'Mid',
    amp.hasTreble && 'Treble',
    amp.hasPresence && 'Presence',
    amp.hasReverb && 'Reverb',
    amp.hasDriveChannel && 'Drive'
  ].filter(Boolean)

  const extendedCapabilities = [
    amp.hasBright && 'Bright',
    amp.hasToneCut && 'Tone Cut',
    amp.hasDepth && 'Depth',
    amp.hasResonance && 'Resonance',
    amp.hasMasterVolume && 'Master Vol',
    amp.hasPreampGain && 'Preamp Gain',
    amp.hasFXLoopLevel && 'FX Loop',
    amp.hasContour && 'Contour',
    amp.hasGraphicEQ && 'Graphic EQ',
    amp.hasBoost && 'Boost',
    amp.hasPowerScale && 'Power Scale',
    amp.hasNoiseGate && 'Noise Gate'
  ].filter(Boolean)

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold">{amp.brand} {amp.model}</h3>
          <div className="flex gap-2 mt-1">
            {amp.channels && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                {amp.channels} channels
              </span>
            )}
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
              {coreCapabilities.length} Core
            </span>
            {extendedCapabilities.length > 0 && (
              <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-medium">
                {extendedCapabilities.length} Extended
              </span>
            )}
          </div>
          <p className="text-gray-500 text-sm mt-1">ID: {amp.id}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <strong className="text-gray-800">Channels:</strong>
          <p className="text-gray-700">{amp.channels || 'Not specified'}</p>
        </div>
        <div>
          <strong className="text-gray-800">Core Capabilities:</strong>
          <p className="text-gray-700">{coreCapabilities.length}</p>
        </div>
        <div>
          <strong className="text-gray-800">Extended:</strong>
          <p className="text-gray-700">{extendedCapabilities.length}</p>
        </div>
        <div>
          <strong className="text-gray-800">Drive Channel:</strong>
          <p className="text-gray-700">{amp.hasDriveChannel ? 'Yes' : 'No'}</p>
        </div>
      </div>

      {/* Core Capabilities */}
      {coreCapabilities.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 rounded">
          <p className="text-xs text-gray-600 mb-2">Core Capabilities ({coreCapabilities.length}):</p>
          <div className="flex flex-wrap gap-1">
            {coreCapabilities.map((capability, index) => (
              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                {capability}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Extended Capabilities */}
      {extendedCapabilities.length > 0 && (
        <div className="mt-4 p-3 bg-purple-50 rounded">
          <p className="text-xs text-gray-600 mb-2">Extended Capabilities ({extendedCapabilities.length}):</p>
          <div className="flex flex-wrap gap-1">
            {extendedCapabilities.map((capability, index) => (
              <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                {capability}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Controls Extra */}
      {amp.controlsExtra && (
        <div className="mt-4 p-3 bg-gray-50 rounded">
          <p className="text-xs text-gray-600 mb-1">Extra Controls:</p>
          <pre className="text-xs text-gray-700 whitespace-pre-wrap">
            {JSON.stringify(amp.controlsExtra, null, 2)}
          </pre>
        </div>
      )}

      {/* Notes */}
      {amp.notes && (
        <div className="mt-4 p-3 bg-yellow-50 rounded">
          <p className="text-xs text-gray-600 mb-1">Notes:</p>
          <p className="text-sm text-gray-700">{amp.notes}</p>
        </div>
      )}
    </div>
  )
} 