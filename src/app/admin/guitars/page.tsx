'use client'

import { useState, useEffect } from 'react'
import { Guitar } from '@/lib/types'

export default function AdminGuitarsPage() {
  const [guitars, setGuitars] = useState<Guitar[]>([])
  const [loading, setLoading] = useState(true)
  const [editingGuitar, setEditingGuitar] = useState<Guitar | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    fetchGuitars()
  }, [])

  const fetchGuitars = async () => {
    try {
      const response = await fetch('/api/gear')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      
      // Handle both array and object responses
      if (Array.isArray(data)) {
        setGuitars(data)
      } else if (data.guitars && Array.isArray(data.guitars)) {
        setGuitars(data.guitars)
      } else {
        console.error('Unexpected API response structure:', data)
        setGuitars([])
      }
    } catch (error) {
      console.error('Error fetching guitars:', error)
      setGuitars([])
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (guitarData: Partial<Guitar>) => {
    try {
      const url = editingGuitar ? `/api/admin/guitars/${editingGuitar.id}` : '/api/admin/guitars'
      const method = editingGuitar ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(guitarData)
      })

      if (!response.ok) {
        throw new Error('Failed to save guitar')
      }

      await fetchGuitars()
      setEditingGuitar(null)
      setIsCreating(false)
    } catch (error) {
      console.error('Error saving guitar:', error)
      alert('Failed to save guitar')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this guitar?')) return

    try {
      const response = await fetch(`/api/admin/guitars/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete guitar')
      }

      await fetchGuitars()
    } catch (error) {
      console.error('Error deleting guitar:', error)
      alert('Failed to delete guitar')
    }
  }

  if (loading) {
    return <div className="p-8">Loading guitars...</div>
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin - Guitars</h1>
        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add New Guitar
        </button>
      </div>

      {(isCreating || editingGuitar) && (
        <GuitarForm
          guitar={editingGuitar}
          onSave={handleSave}
          onCancel={() => {
            setEditingGuitar(null)
            setIsCreating(false)
          }}
        />
      )}

      <div className="grid gap-6">
        {guitars.map((guitar) => (
          <GuitarCard
            key={guitar.id}
            guitar={guitar}
            onEdit={() => setEditingGuitar(guitar)}
            onDelete={() => handleDelete(guitar.id)}
          />
        ))}
      </div>
    </div>
  )
}

function GuitarCard({ guitar, onEdit, onDelete }: { guitar: Guitar; onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold">{guitar.brand} {guitar.model}</h3>
          <div className="flex gap-2 mt-1">
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
              {guitar.pickupLayout}
            </span>
            {(guitar.hasCoilSplitNeck || guitar.hasCoilSplitBridge) && (
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                Coil Split
              </span>
            )}
          </div>
          <p className="text-gray-500 text-sm mt-1">ID: {guitar.id}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <strong className="text-gray-800">Pickup Layout:</strong>
          <p className="text-gray-700">{guitar.pickupLayout}</p>
        </div>
        <div>
          <strong className="text-gray-800">Positions:</strong>
          <p className="text-gray-700">{guitar.positions?.join(', ') || 'Not set'}</p>
        </div>
        <div>
          <strong className="text-gray-800">Volume Knobs:</strong>
          <p className="text-gray-700">{guitar.volumeKnobs}</p>
        </div>
        <div>
          <strong className="text-gray-800">Tone Knobs:</strong>
          <p className="text-gray-700">{guitar.toneKnobs}</p>
        </div>
      </div>

      {/* Coil Split Section */}
      {(guitar.hasCoilSplitNeck || guitar.hasCoilSplitBridge) && (
        <div className="mt-4 p-3 bg-green-50 rounded">
          <p className="text-xs text-gray-600 mb-2">Coil Split Capabilities:</p>
          <div className="flex flex-wrap gap-1">
            {guitar.hasCoilSplitNeck && (
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                Neck
              </span>
            )}
            {guitar.hasCoilSplitBridge && (
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                Bridge
              </span>
            )}
          </div>
        </div>
      )}

      {/* Notes */}
      {guitar.notes && (
        <div className="mt-4 p-3 bg-yellow-50 rounded">
          <p className="text-xs text-gray-600 mb-1">Notes:</p>
          <p className="text-sm text-gray-700">{guitar.notes}</p>
        </div>
      )}
    </div>
  )
}

function GuitarForm({ guitar, onSave, onCancel }: { guitar: Guitar | null; onSave: (data: Partial<Guitar>) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState({
    brand: guitar?.brand || '',
    model: guitar?.model || '',
    pickupLayout: guitar?.pickupLayout || '',
    positions: guitar?.positions || [],
    volumeKnobs: guitar?.volumeKnobs || 0,
    toneKnobs: guitar?.toneKnobs || 0,
    hasCoilSplitNeck: guitar?.hasCoilSplitNeck || false,
    hasCoilSplitBridge: guitar?.hasCoilSplitBridge || false,
    knobMapping: guitar?.knobMapping || {},
    notes: guitar?.notes || ''
  })

  const [knobMappingInputs, setKnobMappingInputs] = useState({
    tone1: '',
    tone2: '',
    volume1: '',
    volume2: ''
  })

  const availablePositions = ['NECK', 'NECK_MIDDLE', 'MIDDLE', 'MIDDLE_BRIDGE', 'BRIDGE', 'NECK_BRIDGE']

  const handlePositionToggle = (position: string) => {
    setFormData(prev => ({
      ...prev,
      positions: prev.positions.includes(position)
        ? prev.positions.filter(p => p !== position)
        : [...prev.positions, position]
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.brand || !formData.model) {
      alert('Brand and model are required')
      return
    }

    // Convert knob mapping inputs to JSON
    const knobMapping: any = {}
    Object.entries(knobMappingInputs).forEach(([key, value]) => {
      if (value.trim()) {
        knobMapping[key] = value.trim()
      }
    })

    onSave({
      ...formData,
      knobMapping: Object.keys(knobMapping).length > 0 ? knobMapping : null
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-2xl font-bold mb-6">
        {guitar ? 'Edit Guitar' : 'Add New Guitar'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Brand *</label>
            <input
              type="text"
              value={formData.brand}
              onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Model *</label>
            <input
              type="text"
              value={formData.model}
              onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
        </div>

        {/* Pickup Layout */}
        <div>
          <label className="block text-sm font-medium mb-2">Pickup Layout *</label>
          <input
            type="text"
            value={formData.pickupLayout}
            onChange={(e) => setFormData(prev => ({ ...prev, pickupLayout: e.target.value }))}
            className="w-full p-2 border rounded-lg"
            placeholder="e.g., HH, SSS, HSS, P90_P90"
            required
          />
          <p className="text-xs text-gray-600 mt-1">
            Standard layout codes: HH, SSS, HSS, P90_P90, HSH, etc.
          </p>
        </div>

        {/* Positions */}
        <div>
          <label className="block text-sm font-medium mb-2">Pickup Positions *</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {availablePositions.map((position) => (
              <button
                key={position}
                type="button"
                onClick={() => handlePositionToggle(position)}
                className={`p-2 border rounded-lg text-sm ${
                  formData.positions.includes(position)
                    ? 'bg-blue-100 border-blue-500 text-blue-800'
                    : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {position}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-600 mt-1">
            Select the pickup positions this guitar supports
          </p>
        </div>

        {/* Knob Counts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Volume Knobs</label>
            <input
              type="number"
              min="0"
              max="4"
              value={formData.volumeKnobs}
              onChange={(e) => setFormData(prev => ({ ...prev, volumeKnobs: parseInt(e.target.value) || 0 }))}
              className="w-full p-2 border rounded-lg"
            />
            <p className="text-xs text-gray-600 mt-1">Number of volume controls (0-4)</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tone Knobs</label>
            <input
              type="number"
              min="0"
              max="4"
              value={formData.toneKnobs}
              onChange={(e) => setFormData(prev => ({ ...prev, toneKnobs: parseInt(e.target.value) || 0 }))}
              className="w-full p-2 border rounded-lg"
            />
            <p className="text-xs text-gray-600 mt-1">Number of tone controls (0-4)</p>
          </div>
        </div>

        {/* Coil Split */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Coil Split Capabilities</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.hasCoilSplitNeck}
                onChange={(e) => setFormData(prev => ({ ...prev, hasCoilSplitNeck: e.target.checked }))}
                className="mr-2"
              />
              Neck Pickup Coil Split
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.hasCoilSplitBridge}
                onChange={(e) => setFormData(prev => ({ ...prev, hasCoilSplitBridge: e.target.checked }))}
                className="mr-2"
              />
              Bridge Pickup Coil Split
            </label>
          </div>
        </div>

        {/* Knob Mapping (Optional) */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Knob Mapping (Optional)</h3>
          <p className="text-sm text-gray-600 mb-4">
            For non-standard wiring (e.g., Strat tone to bridge). Leave empty for standard wiring.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Tone 1</label>
              <input
                type="text"
                value={knobMappingInputs.tone1}
                onChange={(e) => setKnobMappingInputs(prev => ({ ...prev, tone1: e.target.value }))}
                className="w-full p-2 border rounded-lg"
                placeholder="e.g., neck"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Tone 2</label>
              <input
                type="text"
                value={knobMappingInputs.tone2}
                onChange={(e) => setKnobMappingInputs(prev => ({ ...prev, tone2: e.target.value }))}
                className="w-full p-2 border rounded-lg"
                placeholder="e.g., middle"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Volume 1</label>
              <input
                type="text"
                value={knobMappingInputs.volume1}
                onChange={(e) => setKnobMappingInputs(prev => ({ ...prev, volume1: e.target.value }))}
                className="w-full p-2 border rounded-lg"
                placeholder="e.g., master"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Volume 2</label>
              <input
                type="text"
                value={knobMappingInputs.volume2}
                onChange={(e) => setKnobMappingInputs(prev => ({ ...prev, volume2: e.target.value }))}
                className="w-full p-2 border rounded-lg"
                placeholder="e.g., bridge"
              />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium mb-2">Notes (Optional)</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            className="w-full p-2 border rounded-lg"
            rows={3}
            placeholder="Additional notes about this guitar..."
          />
        </div>

        {/* Form Actions */}
        <div className="flex gap-4">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {guitar ? 'Update Guitar' : 'Create Guitar'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
} 