'use client'

import { useState, useEffect } from 'react'
import { Guitar, PickupType } from '@/lib/types'
import { guitarPresets, computeLayoutCode, getSelectorTypeLabel, GuitarPreset } from '@/data/guitarPresets'

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
  const layoutCode = guitar.layoutCode || (guitar.pickups ? computeLayoutCode(guitar.pickups) : '')
  const selectorType = guitar.selector?.type ? getSelectorTypeLabel(guitar.selector.type) : ''

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold">{guitar.brand} {guitar.model}</h3>
          <div className="flex gap-2 mt-1">
            {layoutCode && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                {layoutCode}
              </span>
            )}
            {selectorType && (
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                {selectorType}
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
          <strong className="text-gray-800">Layout Code:</strong>
          <p className="text-gray-700">{layoutCode || 'Not set'}</p>
        </div>
        <div>
          <strong className="text-gray-800">Pickups:</strong>
          <p className="text-gray-700">{guitar.pickups?.length || 0} configured</p>
        </div>
        <div>
          <strong className="text-gray-800">Selector:</strong>
          <p className="text-gray-700">{selectorType || 'Not set'}</p>
        </div>
        <div>
          <strong className="text-gray-800">Controls:</strong>
          <p className="text-gray-700">{guitar.controls ? 'Configured' : 'Not set'}</p>
        </div>
      </div>

      {/* Legacy fields for backward compatibility */}
      {(guitar.pickupTypeEnum || guitar.volumeKnobs || guitar.toneKnobs) && (
        <div className="mt-4 p-3 bg-gray-50 rounded">
          <p className="text-xs text-gray-600 mb-2">Legacy fields:</p>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <strong className="text-gray-800">Pickup Type:</strong>
              <p className="text-gray-700">{guitar.pickupTypeEnum || guitar.pickupType || 'Not set'}</p>
            </div>
            <div>
              <strong className="text-gray-800">Volume Knobs:</strong>
              <p className="text-gray-700">{guitar.volumeKnobs || 'Not set'}</p>
            </div>
            <div>
              <strong className="text-gray-800">Tone Knobs:</strong>
              <p className="text-gray-700">{guitar.toneKnobs || 'Not set'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function GuitarForm({ guitar, onSave, onCancel }: { guitar: Guitar | null; onSave: (data: Partial<Guitar>) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState({
    brand: guitar?.brand || '',
    model: guitar?.model || '',
    pickups: guitar?.pickups || [],
    selector: guitar?.selector || null,
    controls: guitar?.controls || null,
    layoutCode: guitar?.layoutCode || ''
  })

  const [selectedPreset, setSelectedPreset] = useState('')
  const [pickupId, setPickupId] = useState('')
  const [pickupType, setPickupType] = useState('single_coil')
  const [coilSplitCapable, setCoilSplitCapable] = useState(false)

  const pickupTypes = [
    'single_coil', 'humbucker', 'p90', 'filtertron', 
    'mini_humbucker', 'lipstick', 'gold_foil', 'other'
  ]

  const selectorTypes = [
    '3_way_toggle', '5_way_blade', '4_way_blade', 
    'super_switch', 'rotary', 'other'
  ]

  const handlePresetChange = (presetKey: string) => {
    if (presetKey && guitarPresets[presetKey]) {
      const preset = guitarPresets[presetKey]
      setFormData(prev => ({
        ...prev,
        pickups: preset.pickups,
        selector: preset.selector,
        controls: preset.controls,
        layoutCode: computeLayoutCode(preset.pickups)
      }))
    }
  }

  const addPickup = () => {
    if (pickupId && !formData.pickups.find(p => p.id === pickupId)) {
      const newPickup = {
        id: pickupId,
        type: pickupType,
        coilSplitCapable
      }
      setFormData(prev => ({
        ...prev,
        pickups: [...prev.pickups, newPickup],
        layoutCode: computeLayoutCode([...prev.pickups, newPickup])
      }))
      setPickupId('')
      setPickupType('single_coil')
      setCoilSplitCapable(false)
    }
  }

  const removePickup = (id: string) => {
    setFormData(prev => ({
      ...prev,
      pickups: prev.pickups.filter(p => p.id !== id),
      layoutCode: computeLayoutCode(prev.pickups.filter(p => p.id !== id))
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.brand || !formData.model) {
      alert('Brand and model are required')
      return
    }

    onSave({
      ...formData,
      layoutCode: computeLayoutCode(formData.pickups)
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

        {/* Layout Code (read-only) */}
        <div>
          <label className="block text-sm font-medium mb-2">Layout Code (auto-derived)</label>
          <input
            type="text"
            value={formData.layoutCode}
            className="w-full p-2 border rounded-lg bg-gray-50"
            readOnly
          />
          <p className="text-xs text-gray-600 mt-1">
            Automatically computed from pickup configuration
          </p>
        </div>

        {/* Preset Selector */}
        <div>
          <label className="block text-sm font-medium mb-2">Quick Preset</label>
          <select
            value={selectedPreset}
            onChange={(e) => {
              setSelectedPreset(e.target.value)
              handlePresetChange(e.target.value)
            }}
            className="w-full p-2 border rounded-lg"
          >
            <option value="">Select a preset to quickly configure...</option>
            {Object.entries(guitarPresets).map(([key, preset]) => (
              <option key={key} value={key}>{preset.name}</option>
            ))}
          </select>
          <p className="text-xs text-gray-600 mt-1">
            Choose a preset to automatically fill pickups, selector, and controls
          </p>
        </div>

        {/* Pickups Section */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Pickups</h3>
          <p className="text-sm text-gray-600 mb-4">
            Define the physical pickups installed in this guitar
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <input
              type="text"
              placeholder="Pickup ID (neck/middle/bridge)"
              value={pickupId}
              onChange={(e) => setPickupId(e.target.value)}
              className="p-2 border rounded-lg"
            />
            <select
              value={pickupType}
              onChange={(e) => setPickupType(e.target.value)}
              className="p-2 border rounded-lg"
            >
              {pickupTypes.map(type => (
                <option key={type} value={type}>{type.replace('_', ' ')}</option>
              ))}
            </select>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={coilSplitCapable}
                onChange={(e) => setCoilSplitCapable(e.target.checked)}
                className="mr-2"
              />
              Coil Split Capable
            </label>
            <button
              type="button"
              onClick={addPickup}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Add Pickup
            </button>
          </div>

          <div className="space-y-2">
            {formData.pickups.map((pickup, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex items-center gap-4">
                  <span className="font-medium">{pickup.id}</span>
                  <span className="text-gray-600">{pickup.type}</span>
                  {pickup.coilSplitCapable && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Split</span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removePickup(pickup.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Selector Section */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Selector</h3>
          <p className="text-sm text-gray-600 mb-4">
            Configure the pickup selector switch and its positions
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Switch Type</label>
              <select
                value={formData.selector?.type || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  selector: { ...prev.selector, type: e.target.value }
                }))}
                className="w-full p-2 border rounded-lg"
              >
                <option value="">Select switch type</option>
                {selectorTypes.map(type => (
                  <option key={type} value={type}>{getSelectorTypeLabel(type)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Coil Split Control</label>
              <select
                value={formData.selector?.coilSplitControl || 'none'}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  selector: { ...prev.selector, coilSplitControl: e.target.value }
                }))}
                className="w-full p-2 border rounded-lg"
              >
                <option value="none">None</option>
                <option value="global_push_pull">Global Push/Pull</option>
                <option value="per_pickup_push_pull">Per Pickup Push/Pull</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            {formData.selector?.positions?.map((position, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded">
                <div className="flex items-center gap-4 mb-2">
                  <span className="font-medium">{position.name}</span>
                  <span className="text-gray-600">{position.label}</span>
                </div>
                <div className="text-sm text-gray-600">
                  Active: {position.active.map(a => `${a.pickupId}${a.split ? ' (split)' : ''}`).join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Controls Section */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Controls</h3>
          <p className="text-sm text-gray-600 mb-4">
            Configure volume and tone controls for this guitar
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.controls?.masterVolume || false}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    controls: { ...prev.controls, masterVolume: e.target.checked }
                  }))}
                  className="mr-2"
                />
                Master Volume
              </label>
            </div>
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.controls?.masterTone || false}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    controls: { ...prev.controls, masterTone: e.target.checked }
                  }))}
                  className="mr-2"
                />
                Master Tone
              </label>
            </div>
          </div>
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