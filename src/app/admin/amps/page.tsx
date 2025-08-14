'use client'

import { useState, useEffect } from 'react'
import { Listbox } from '@headlessui/react'
import { getAmpFamilyLabel } from '@/data/ampPresets'
import { ampPresets } from '@/data/ampPresets'

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
  createdAt: string
}

export default function AdminAmpsPage() {
  const [amps, setAmps] = useState<Amp[]>([])
  const [loading, setLoading] = useState(true)
  const [editingAmp, setEditingAmp] = useState<Amp | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    ampFamily: '',
    isTube: false,
    channelsList: [] as string[],
    controlsList: [] as Array<{ name: string; max: number }>,
    buttons: [] as Array<{ name: string }>,
    voicings: [] as string[],
    powerSection: null as { wattage: number; tubeTypes: string[] } | null
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
      ampFamily: amp.ampFamily || '',
      isTube: amp.isTube || false,
      channelsList: amp.channelsList || [],
      controlsList: amp.controlsList || [],
      buttons: amp.buttons || [],
      voicings: amp.voicings || [],
      powerSection: amp.powerSection || null
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
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        setShowForm(false)
        setEditingAmp(null)
        setFormData({
          brand: '',
          model: '',
          ampFamily: '',
          isTube: false,
          channelsList: [],
          controlsList: [],
          buttons: [],
          voicings: [],
          powerSection: null
        })
        fetchAmps()
      } else {
        alert('Failed to save amp')
      }
    } catch (error) {
      console.error('Error saving amp:', error)
      alert('Error saving amp')
    }
  }

  const applyPreset = (presetKey: string) => {
    const preset = ampPresets[presetKey]
    if (preset) {
      setFormData({
        ...formData,
        ampFamily: preset.ampFamily,
        isTube: preset.isTube,
        channelsList: preset.channels,
        controlsList: preset.controls,
        buttons: preset.buttons || [],
        voicings: preset.voicings || [],
        powerSection: preset.powerSection
      })
    }
  }

  const addChannel = () => {
    const channelName = prompt('Enter channel name:')
    if (channelName) {
      setFormData({
        ...formData,
        channelsList: [...formData.channelsList, channelName]
      })
    }
  }

  const removeChannel = (index: number) => {
    setFormData({
      ...formData,
      channelsList: formData.channelsList.filter((_, i) => i !== index)
    })
  }

  const addControl = () => {
    const name = prompt('Enter control name:')
    if (name) {
      const max = parseInt(prompt('Enter max value (default 10):') || '10')
      setFormData({
        ...formData,
        controlsList: [...formData.controlsList, { name, max }]
      })
    }
  }

  const removeControl = (index: number) => {
    setFormData({
      ...formData,
      controlsList: formData.controlsList.filter((_, i) => i !== index)
    })
  }

  const addButton = () => {
    const name = prompt('Enter button name:')
    if (name) {
      setFormData({
        ...formData,
        buttons: [...formData.buttons, { name }]
      })
    }
  }

  const removeButton = (index: number) => {
    setFormData({
      ...formData,
      buttons: formData.buttons.filter((_, i) => i !== index)
    })
  }

  const addVoicing = () => {
    const name = prompt('Enter voicing name:')
    if (name) {
      setFormData({
        ...formData,
        voicings: [...formData.voicings, name]
      })
    }
  }

  const removeVoicing = (index: number) => {
    setFormData({
      ...formData,
      voicings: formData.voicings.filter((_, i) => i !== index)
    })
  }

  const setPowerSection = () => {
    const wattage = parseInt(prompt('Enter wattage:') || '0')
    const tubeTypesStr = prompt('Enter tube types (comma-separated):')
    const tubeTypes = tubeTypesStr ? tubeTypesStr.split(',').map(t => t.trim()) : []
    
    setFormData({
      ...formData,
      powerSection: { wattage, tubeTypes }
    })
  }

  const clearPowerSection = () => {
    setFormData({
      ...formData,
      powerSection: null
    })
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
              ampFamily: '',
              isTube: false,
              channelsList: [],
              controlsList: [],
              buttons: [],
              voicings: [],
              powerSection: null
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
                  <label className="block text-sm font-medium mb-1">Brand</label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({...formData, brand: e.target.value})}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Model</label>
                  <input
                    type="text"
                    value={formData.model}
                    onChange={(e) => setFormData({...formData, model: e.target.value})}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
              </div>

              {/* Quick Preset */}
              <div>
                <label className="block text-sm font-medium mb-1">Quick Preset</label>
                <Listbox
                  value=""
                  onChange={(presetKey) => applyPreset(presetKey)}
                >
                  <Listbox.Button className="w-full border rounded px-3 py-2 text-left">
                    Select a preset to auto-fill fields...
                  </Listbox.Button>
                  <Listbox.Options className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                    {Object.entries(ampPresets).map(([key, preset]) => (
                      <Listbox.Option key={key} value={key}>
                        {({ active }) => (
                          <div className={`px-3 py-2 cursor-pointer ${active ? 'bg-blue-100' : ''}`}>
                            {preset.name}
                          </div>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Listbox>
              </div>

              {/* Amp Family & Tube */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Amp Family</label>
                  <select
                    value={formData.ampFamily}
                    onChange={(e) => setFormData({...formData, ampFamily: e.target.value})}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="">Select family...</option>
                    <option value="fender">Fender</option>
                    <option value="marshall">Marshall</option>
                    <option value="vox">Vox</option>
                    <option value="boss">Boss</option>
                    <option value="blackstar">Blackstar</option>
                    <option value="orange">Orange</option>
                    <option value="peavey">Peavey</option>
                    <option value="line6">Line 6</option>
                    <option value="modeling">Modeling</option>
                    <option value="solid_state">Solid State</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tube Amp</label>
                  <input
                    type="checkbox"
                    checked={formData.isTube}
                    onChange={(e) => setFormData({...formData, isTube: e.target.checked})}
                    className="mr-2"
                  />
                  <span>Is tube amp</span>
                </div>
              </div>

              {/* Channels */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium">Channels</label>
                  <button
                    type="button"
                    onClick={addChannel}
                    className="text-blue-500 text-sm"
                  >
                    + Add Channel
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.channelsList.map((channel, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={channel}
                        onChange={(e) => {
                          const newChannels = [...formData.channelsList]
                          newChannels[index] = e.target.value
                          setFormData({...formData, channelsList: newChannels})
                        }}
                        className="flex-1 border rounded px-3 py-2"
                      />
                      <button
                        type="button"
                        onClick={() => removeChannel(index)}
                        className="text-red-500"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Controls */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium">Controls (Front Panel Knobs)</label>
                  <button
                    type="button"
                    onClick={addControl}
                    className="text-blue-500 text-sm"
                  >
                    + Add Control
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.controlsList.map((control, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={control.name}
                        onChange={(e) => {
                          const newControls = [...formData.controlsList]
                          newControls[index] = { ...control, name: e.target.value }
                          setFormData({...formData, controlsList: newControls})
                        }}
                        placeholder="Control name"
                        className="flex-1 border rounded px-3 py-2"
                      />
                      <input
                        type="number"
                        value={control.max}
                        onChange={(e) => {
                          const newControls = [...formData.controlsList]
                          newControls[index] = { ...control, max: parseInt(e.target.value) || 10 }
                          setFormData({...formData, controlsList: newControls})
                        }}
                        placeholder="Max"
                        className="w-20 border rounded px-3 py-2"
                      />
                      <button
                        type="button"
                        onClick={() => removeControl(index)}
                        className="text-red-500"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium">Buttons/Switches</label>
                  <button
                    type="button"
                    onClick={addButton}
                    className="text-blue-500 text-sm"
                  >
                    + Add Button
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.buttons.map((button, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={button.name}
                        onChange={(e) => {
                          const newButtons = [...formData.buttons]
                          newButtons[index] = { name: e.target.value }
                          setFormData({...formData, buttons: newButtons})
                        }}
                        className="flex-1 border rounded px-3 py-2"
                      />
                      <button
                        type="button"
                        onClick={() => removeButton(index)}
                        className="text-red-500"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Voicings */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium">Voicings</label>
                  <button
                    type="button"
                    onClick={addVoicing}
                    className="text-blue-500 text-sm"
                  >
                    + Add Voicing
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.voicings.map((voicing, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={voicing}
                        onChange={(e) => {
                          const newVoicings = [...formData.voicings]
                          newVoicings[index] = e.target.value
                          setFormData({...formData, voicings: newVoicings})
                        }}
                        className="flex-1 border rounded px-3 py-2"
                      />
                      <button
                        type="button"
                        onClick={() => removeVoicing(index)}
                        className="text-red-500"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Power Section */}
              <div>
                <label className="block text-sm font-medium mb-2">Power Section</label>
                {formData.powerSection ? (
                  <div className="border rounded p-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-600">Wattage</label>
                        <input
                          type="number"
                          value={formData.powerSection.wattage}
                          onChange={(e) => setFormData({
                            ...formData,
                            powerSection: {
                              ...formData.powerSection!,
                              wattage: parseInt(e.target.value) || 0
                            }
                          })}
                          className="w-full border rounded px-3 py-2"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600">Tube Types</label>
                        <input
                          type="text"
                          value={formData.powerSection.tubeTypes.join(', ')}
                          onChange={(e) => setFormData({
                            ...formData,
                            powerSection: {
                              ...formData.powerSection!,
                              tubeTypes: e.target.value.split(',').map(t => t.trim()).filter(t => t)
                            }
                          })}
                          placeholder="EL84, ECC83"
                          className="w-full border rounded px-3 py-2"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={clearPowerSection}
                      className="text-red-500 text-sm mt-2"
                    >
                      Clear Power Section
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={setPowerSection}
                    className="text-blue-500 text-sm"
                  >
                    + Add Power Section
                  </button>
                )}
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
  const familyLabel = amp.ampFamily ? getAmpFamilyLabel(amp.ampFamily) : ''
  const tubeLabel = amp.isTube === null ? 'Unknown' : amp.isTube ? 'Tube' : 'Solid State'
  const channelsCount = amp.channelsList?.length || 0
  const controlsCount = amp.controlsList?.length || 0

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold">{amp.brand} {amp.model}</h3>
          <div className="flex gap-2 mt-1">
            {familyLabel && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                {familyLabel}
              </span>
            )}
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
              {tubeLabel}
            </span>
            <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-medium">
              {channelsCount} Channels
            </span>
            <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full font-medium">
              {controlsCount} Controls
            </span>
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
          <strong className="text-gray-800">Family:</strong>
          <p className="text-gray-700">{familyLabel || 'Not set'}</p>
        </div>
        <div>
          <strong className="text-gray-800">Type:</strong>
          <p className="text-gray-700">{tubeLabel}</p>
        </div>
        <div>
          <strong className="text-gray-800">Channels:</strong>
          <p className="text-gray-700">{amp.channelsList?.join(', ') || 'Not set'}</p>
        </div>
        <div>
          <strong className="text-gray-800">Controls:</strong>
          <p className="text-gray-700">{controlsCount} configured</p>
        </div>
      </div>

      {amp.controlsList && amp.controlsList.length > 0 && (
        <div className="mt-4">
          <strong className="text-gray-800 text-sm">Controls:</strong>
          <div className="flex flex-wrap gap-2 mt-1">
            {amp.controlsList.map((control, index) => (
              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                {control.name} (0-{control.max})
              </span>
            ))}
          </div>
        </div>
      )}

      {amp.buttons && amp.buttons.length > 0 && (
        <div className="mt-4">
          <strong className="text-gray-800 text-sm">Buttons:</strong>
          <div className="flex flex-wrap gap-2 mt-1">
            {amp.buttons.map((button, index) => (
              <span key={index} className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                {button.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {amp.voicings && amp.voicings.length > 0 && (
        <div className="mt-4">
          <strong className="text-gray-800 text-sm">Voicings:</strong>
          <div className="flex flex-wrap gap-2 mt-1">
            {amp.voicings.map((voicing, index) => (
              <span key={index} className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded">
                {voicing}
              </span>
            ))}
          </div>
        </div>
      )}

      {amp.powerSection && (
        <div className="mt-4">
          <strong className="text-gray-800 text-sm">Power:</strong>
          <p className="text-gray-700 text-sm">
            {amp.powerSection.wattage}W ({amp.powerSection.tubeTypes.join(', ')})
          </p>
        </div>
      )}

      {/* Legacy fields for backward compatibility */}
      {(amp.ampType || amp.hasReverb !== undefined || amp.channels !== undefined) && (
        <div className="mt-4 p-3 bg-gray-50 rounded">
          <p className="text-xs text-gray-600 mb-2">Legacy fields:</p>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <strong className="text-gray-800">Amp Type:</strong>
              <p className="text-gray-700">{amp.ampType || 'Not set'}</p>
            </div>
            <div>
              <strong className="text-gray-800">Has Reverb:</strong>
              <p className="text-gray-700">{amp.hasReverb === undefined ? 'Not set' : amp.hasReverb ? 'Yes' : 'No'}</p>
            </div>
            <div>
              <strong className="text-gray-800">Channels:</strong>
              <p className="text-gray-700">{amp.channels || 'Not set'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 