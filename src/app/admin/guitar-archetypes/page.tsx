'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface GuitarArchetype {
  id: string
  name: string
  brand?: string
  pickupLayout: string
  switchPositions: string[]
  volumeKnobs: number
  toneKnobs: number
  perPickupControls: boolean
  coilSplit: boolean
  otherSwitches?: string[]
  notes?: string
  systemLocked: boolean
  createdAt: Date
  updatedAt: Date
  _count: {
    tones: number
  }
}

export default function AdminGuitarArchetypesPage() {
  const [archetypes, setArchetypes] = useState<GuitarArchetype[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingArchetype, setEditingArchetype] = useState<GuitarArchetype | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    pickupLayout: '',
    switchPositions: [] as string[],
    volumeKnobs: 1,
    toneKnobs: 1,
    perPickupControls: false,
    coilSplit: false,
    otherSwitches: [] as string[],
    notes: ''
  })

  const pickupLayouts = ['HH', 'SSS', 'SS', 'HSS', 'HS', 'HSH', 'P90', 'Other']
  const switchPositionOptions = ['NECK', 'MIDDLE', 'BRIDGE', 'NECK+MIDDLE', 'MIDDLE+BRIDGE', 'NECK+BRIDGE', 'ALL']
  const otherSwitchOptions = ['Phase Reverse', 'Series/Parallel', 'S1 Switch', 'Coil Tap', 'Active/Passive']

  useEffect(() => {
    fetchArchetypes()
  }, [])

  const fetchArchetypes = async () => {
    try {
      const response = await fetch('/api/admin/guitar-archetypes')
      if (response.ok) {
        const data = await response.json()
        setArchetypes(data)
      } else {
        console.error('Failed to fetch guitar archetypes')
      }
    } catch (error) {
      console.error('Error fetching guitar archetypes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddArchetype = () => {
    setEditingArchetype(null)
    setFormData({
      name: '',
      brand: '',
      pickupLayout: '',
      switchPositions: [],
      volumeKnobs: 1,
      toneKnobs: 1,
      perPickupControls: false,
      coilSplit: false,
      otherSwitches: [],
      notes: ''
    })
    setShowForm(true)
  }

  const handleEditArchetype = (archetype: GuitarArchetype) => {
    setEditingArchetype(archetype)
    setFormData({
      name: archetype.name,
      brand: archetype.brand || '',
      pickupLayout: archetype.pickupLayout,
      switchPositions: archetype.switchPositions,
      volumeKnobs: archetype.volumeKnobs,
      toneKnobs: archetype.toneKnobs,
      perPickupControls: archetype.perPickupControls,
      coilSplit: archetype.coilSplit,
      otherSwitches: archetype.otherSwitches || [],
      notes: archetype.notes || ''
    })
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.pickupLayout || formData.switchPositions.length === 0) {
      alert('Name, pickup layout, and at least one switch position are required')
      return
    }

    try {
      const url = editingArchetype 
        ? `/api/admin/guitar-archetypes/${editingArchetype.id}`
        : '/api/admin/guitar-archetypes'
      
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

  const handleDelete = async (archetype: GuitarArchetype) => {
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
      const response = await fetch(`/api/admin/guitar-archetypes/${archetype.id}`, {
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

  const toggleSwitchPosition = (position: string) => {
    setFormData(prev => ({
      ...prev,
      switchPositions: prev.switchPositions.includes(position)
        ? prev.switchPositions.filter(p => p !== position)
        : [...prev.switchPositions, position]
    }))
  }

  const toggleOtherSwitch = (switchName: string) => {
    setFormData(prev => ({
      ...prev,
      otherSwitches: prev.otherSwitches.includes(switchName)
        ? prev.otherSwitches.filter(s => s !== switchName)
        : [...prev.otherSwitches, switchName]
    }))
  }

  const filteredArchetypes = archetypes.filter(archetype =>
    archetype.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    archetype.pickupLayout.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Guitar Archetypes</h1>
          <p className="text-gray-600">Manage guitar archetypes used in tone matching</p>
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
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                    {archetype.pickupLayout}
                  </span>
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
                  <span className="font-medium">Switch Positions:</span> {archetype.switchPositions.join(', ')}
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Controls:</span> {archetype.volumeKnobs}V/{archetype.toneKnobs}T
                  {archetype.perPickupControls && ' (per-pickup)'}
                  {archetype.coilSplit && ', Coil Split'}
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
                  {editingArchetype ? 'Edit Guitar Archetype' : 'Add Guitar Archetype'}
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Les Paul Standard"
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
                  placeholder="e.g., Gibson"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pickup Layout *
                </label>
                <select
                  value={formData.pickupLayout}
                  onChange={(e) => setFormData({ ...formData, pickupLayout: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select pickup layout</option>
                  {pickupLayouts.map(layout => (
                    <option key={layout} value={layout}>{layout}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Switch Positions *
                </label>
                <div className="space-y-2">
                  {switchPositionOptions.map(position => (
                    <label key={position} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.switchPositions.includes(position)}
                        onChange={() => toggleSwitchPosition(position)}
                        className="mr-2"
                      />
                      {position}
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Volume Knobs
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="4"
                    value={formData.volumeKnobs}
                    onChange={(e) => setFormData({ ...formData, volumeKnobs: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tone Knobs
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="4"
                    value={formData.toneKnobs}
                    onChange={(e) => setFormData({ ...formData, toneKnobs: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.perPickupControls}
                    onChange={(e) => setFormData({ ...formData, perPickupControls: e.target.checked })}
                    className="mr-2"
                  />
                  Per-Pickup Controls (Les Paul style)
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.coilSplit}
                    onChange={(e) => setFormData({ ...formData, coilSplit: e.target.checked })}
                    className="mr-2"
                  />
                  Coil Split Support
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Other Switches (Optional)
                </label>
                <div className="space-y-2">
                  {otherSwitchOptions.map(switchName => (
                    <label key={switchName} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.otherSwitches.includes(switchName)}
                        onChange={() => toggleOtherSwitch(switchName)}
                        className="mr-2"
                      />
                      {switchName}
                    </label>
                  ))}
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
