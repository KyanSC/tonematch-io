'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface AmpArchetype {
  id: string
  name: string
  brand?: string
  topology?: string
  channels: string[]
  controls: AmpControl[]
  hasPresence: boolean
  hasReverb: boolean
  hasMasterVolume: boolean
  hasFXLoop: boolean
  notes?: string
  systemLocked: boolean
  createdAt: Date
  updatedAt: Date
  _count: {
    tones: number
  }
}

interface AmpControl {
  name: string
  min: number
  max: number
  default: number
}

export default function AdminAmpArchetypesPage() {
  const [archetypes, setArchetypes] = useState<AmpArchetype[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingArchetype, setEditingArchetype] = useState<AmpArchetype | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    topology: '',
    channels: [] as string[],
    controls: [] as AmpControl[],
    hasPresence: false,
    hasReverb: false,
    hasMasterVolume: false,
    hasFXLoop: false,
    notes: ''
  })

  const topologies = [
    'Combo',
    'Head',
    'Digital',
    'Hybrid',
    'Other'
  ]

  const channelOptions = [
    'Clean',
    'Crunch',
    'Lead',
    'High Gain',
    'Acoustic',
    'JC Clean',
    'Other'
  ]

  const defaultControls = [
    { name: 'Gain', min: 0, max: 10, default: 5 },
    { name: 'Bass', min: 0, max: 10, default: 5 },
    { name: 'Mid', min: 0, max: 10, default: 5 },
    { name: 'Treble', min: 0, max: 10, default: 5 },
    { name: 'Volume', min: 0, max: 10, default: 5 },
    { name: 'Master', min: 0, max: 10, default: 5 },
    { name: 'Presence', min: 0, max: 10, default: 5 },
    { name: 'Reverb', min: 0, max: 10, default: 0 }
  ]

  useEffect(() => {
    fetchArchetypes()
  }, [])

  const fetchArchetypes = async () => {
    try {
      const response = await fetch('/api/admin/amp-archetypes')
      if (response.ok) {
        const data = await response.json()
        setArchetypes(data)
      } else {
        console.error('Failed to fetch amp archetypes')
      }
    } catch (error) {
      console.error('Error fetching amp archetypes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddArchetype = () => {
    setEditingArchetype(null)
    setFormData({
      name: '',
      brand: '',
      topology: '',
      channels: [],
      controls: [],
      hasPresence: false,
      hasReverb: false,
      hasMasterVolume: false,
      hasFXLoop: false,
      notes: ''
    })
    setShowForm(true)
  }

  const handleEditArchetype = (archetype: AmpArchetype) => {
    setEditingArchetype(archetype)
    setFormData({
      name: archetype.name,
      brand: archetype.brand || '',
      topology: archetype.topology || '',
      channels: archetype.channels,
      controls: archetype.controls,
      hasPresence: archetype.hasPresence,
      hasReverb: archetype.hasReverb,
      hasMasterVolume: archetype.hasMasterVolume,
      hasFXLoop: archetype.hasFXLoop,
      notes: archetype.notes || ''
    })
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name) {
      alert('Name is required')
      return
    }

    if (formData.channels.length === 0) {
      alert('At least one channel must be selected')
      return
    }

    try {
      const url = editingArchetype 
        ? `/api/admin/amp-archetypes/${editingArchetype.id}`
        : '/api/admin/amp-archetypes'
      
      const response = await fetch(url, {
        method: editingArchetype ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        await fetchArchetypes()
        setShowForm(false)
        setEditingArchetype(null)
        alert(editingArchetype ? 'Archetype updated successfully!' : 'Archetype created successfully!')
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error('Error saving archetype:', error)
      alert('Error saving archetype')
    }
  }

  const handleDelete = async (archetype: AmpArchetype) => {
    if (archetype.systemLocked) {
      alert('System archetypes cannot be deleted')
      return
    }

    if (archetype._count.tones > 0) {
      alert(`Cannot delete archetype "${archetype.name}" - it is used by ${archetype._count.tones} tone(s)`)
      return
    }

    if (!confirm(`Are you sure you want to delete "${archetype.name}"?`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/amp-archetypes/${archetype.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchArchetypes()
        alert('Archetype deleted successfully!')
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error('Error deleting archetype:', error)
      alert('Error deleting archetype')
    }
  }

  const toggleChannel = (channel: string) => {
    setFormData(prev => ({
      ...prev,
      channels: prev.channels.includes(channel)
        ? prev.channels.filter(c => c !== channel)
        : [...prev.channels, channel]
    }))
  }

  const addControl = () => {
    setFormData(prev => ({
      ...prev,
      controls: [...prev.controls, { name: '', min: 0, max: 10, default: 5 }]
    }))
  }

  const updateControl = (index: number, field: keyof AmpControl, value: any) => {
    setFormData(prev => ({
      ...prev,
      controls: prev.controls.map((control, i) => 
        i === index ? { ...control, [field]: value } : control
      )
    }))
  }

  const removeControl = (index: number) => {
    setFormData(prev => ({
      ...prev,
      controls: prev.controls.filter((_, i) => i !== index)
    }))
  }

  const addDefaultControls = () => {
    setFormData(prev => ({
      ...prev,
      controls: [...prev.controls, ...defaultControls]
    }))
  }

  const filteredArchetypes = archetypes.filter(archetype =>
    archetype.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (archetype.topology && archetype.topology.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Amp Archetypes</h1>
          <p className="text-gray-600">Manage amp archetypes used in tone matching</p>
        </div>
        <div className="flex gap-4">
          <Link
            href="/admin"
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Back to Admin
          </Link>
          <button
            onClick={handleAddArchetype}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Add Archetype
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search archetypes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Archetypes List */}
      <div className="grid gap-4">
        {filteredArchetypes.map((archetype) => (
          <div
            key={archetype.id}
            className={`p-4 border rounded-lg ${archetype.systemLocked ? 'bg-yellow-50 border-yellow-200' : 'bg-white border-gray-200'}`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-medium text-gray-900">{archetype.name}</h3>
                  {archetype.brand && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                      {archetype.brand}
                    </span>
                  )}
                  {archetype.topology && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                      {archetype.topology}
                    </span>
                  )}
                  {archetype.systemLocked && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm">
                      System Locked
                    </span>
                  )}
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm">
                    {archetype._count.tones} tone(s)
                  </span>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Channels:</span> {archetype.channels.join(', ')}
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Controls:</span> {archetype.controls.length} knobs
                  {archetype.hasPresence && ', Presence'}
                  {archetype.hasReverb && ', Reverb'}
                  {archetype.hasMasterVolume && ', Master Volume'}
                  {archetype.hasFXLoop && ', FX Loop'}
                </div>
                {archetype.notes && (
                  <p className="text-sm text-gray-600">{archetype.notes}</p>
                )}
              </div>
              <div className="flex gap-2">
                {!archetype.systemLocked && (
                  <>
                    <button
                      onClick={() => handleEditArchetype(archetype)}
                      className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(archetype)}
                      className="px-3 py-1 text-sm border border-red-300 text-red-700 rounded hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">
                  {editingArchetype ? 'Edit Amp Archetype' : 'Add Amp Archetype'}
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Basic Info Section */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Marshall JCM800"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brand (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Marshall"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Topology (Optional)
                  </label>
                  <select
                    value={formData.topology}
                    onChange={(e) => setFormData({ ...formData, topology: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select topology</option>
                    {topologies.map(topology => (
                      <option key={topology} value={topology}>{topology}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Channels Section */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Channels *</h3>
                <div className="space-y-2">
                  {channelOptions.map(channel => (
                    <label key={channel} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.channels.includes(channel)}
                        onChange={() => toggleChannel(channel)}
                        className="mr-2"
                      />
                      {channel}
                    </label>
                  ))}
                </div>
              </div>

              {/* Controls Section */}
              <div className="border-b border-gray-200 pb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Controls</h3>
                  <div className="space-x-2">
                    <button
                      type="button"
                      onClick={addDefaultControls}
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      Add Defaults
                    </button>
                    <button
                      type="button"
                      onClick={addControl}
                      className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200"
                    >
                      Add Control
                    </button>
                  </div>
                </div>
                
                {formData.controls.map((control, index) => (
                  <div key={index} className="grid grid-cols-5 gap-2 mb-2">
                    <input
                      type="text"
                      value={control.name}
                      onChange={(e) => updateControl(index, 'name', e.target.value)}
                      placeholder="Control name"
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                    <input
                      type="number"
                      value={control.min}
                      onChange={(e) => updateControl(index, 'min', parseInt(e.target.value) || 0)}
                      placeholder="Min"
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                    <input
                      type="number"
                      value={control.max}
                      onChange={(e) => updateControl(index, 'max', parseInt(e.target.value) || 10)}
                      placeholder="Max"
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                    <input
                      type="number"
                      value={control.default}
                      onChange={(e) => updateControl(index, 'default', parseInt(e.target.value) || 5)}
                      placeholder="Default"
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeControl(index)}
                      className="px-2 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              {/* Features Section */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Features</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.hasPresence}
                      onChange={(e) => setFormData({ ...formData, hasPresence: e.target.checked })}
                      className="mr-2"
                    />
                    Has Presence Control
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.hasReverb}
                      onChange={(e) => setFormData({ ...formData, hasReverb: e.target.checked })}
                      className="mr-2"
                    />
                    Has Reverb
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.hasMasterVolume}
                      onChange={(e) => setFormData({ ...formData, hasMasterVolume: e.target.checked })}
                      className="mr-2"
                    />
                    Has Master Volume
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.hasFXLoop}
                      onChange={(e) => setFormData({ ...formData, hasFXLoop: e.target.checked })}
                      className="mr-2"
                    />
                    Has FX Loop
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Additional notes about this archetype..."
                />
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  {editingArchetype ? 'Update Archetype' : 'Create Archetype'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
