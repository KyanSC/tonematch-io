'use client'

import { useState, useEffect } from 'react'
import { Listbox } from '@headlessui/react'
import { Song, Tone, Guitar, Amp, SongSection } from '@/lib/types'

interface ToneWithGear extends Omit<Tone, 'baseGuitar' | 'baseAmp'> {
  baseGuitar?: { id: string; brand: string; model: string } | null
  baseAmp?: { id: string; brand: string; model: string } | null
}

export default function AdminTonesPage() {
  const [songs, setSongs] = useState<Song[]>([])
  const [selectedSong, setSelectedSong] = useState<Song | null>(null)
  const [tones, setTones] = useState<ToneWithGear[]>([])
  const [guitars, setGuitars] = useState<Guitar[]>([])
  const [amps, setAmps] = useState<Amp[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingTone, setEditingTone] = useState<ToneWithGear | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    baseGuitarId: '',
    baseAmpId: '',
    referencePickupPosition: '',
    baseSettings: {} as Record<string, number>,
    songSection: '' as SongSection | '',
    confidence: 70,
    sourceLinks: [''] as string[],
    verified: false,
    verificationNotes: ''
  })
  const [selectedAmp, setSelectedAmp] = useState<Amp | null>(null)
  const [selectedGuitar, setSelectedGuitar] = useState<Guitar | null>(null)
  const [pickupPositions, setPickupPositions] = useState<string[]>([])
  const [referencePickupVoicePreview, setReferencePickupVoicePreview] = useState<any>(null)

  // Fetch songs on component mount
  useEffect(() => {
    fetchSongs()
    fetchGuitars()
    fetchAmps()
  }, [])

  // Fetch tones when selected song changes
  useEffect(() => {
    if (selectedSong) {
      fetchTones(selectedSong.id)
    } else {
      setTones([])
    }
  }, [selectedSong])

  const fetchSongs = async () => {
    try {
      const response = await fetch('/api/songs')
      if (response.ok) {
        const data = await response.json()
        setSongs(Array.isArray(data) ? data : data.songs || [])
      }
    } catch (error) {
      console.error('Error fetching songs:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchTones = async (songId: string) => {
    try {
      const response = await fetch(`/api/admin/tones?songId=${songId}`)
      if (response.ok) {
        const data = await response.json()
        setTones(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error('Error fetching tones:', error)
    }
  }

  const fetchGuitars = async () => {
    try {
      const response = await fetch('/api/gear')
      if (response.ok) {
        const data = await response.json()
        setGuitars(Array.isArray(data.guitars) ? data.guitars : [])
      }
    } catch (error) {
      console.error('Error fetching guitars:', error)
    }
  }

  const fetchAmps = async () => {
    try {
      const response = await fetch('/api/gear')
      if (response.ok) {
        const data = await response.json()
        setAmps(Array.isArray(data.amps) ? data.amps : [])
      }
    } catch (error) {
      console.error('Error fetching amps:', error)
    }
  }

  const handleAddTone = () => {
    setEditingTone(null)
    setFormData({
      name: '',
      description: '',
      baseGuitarId: '',
      baseAmpId: '',
      referencePickupPosition: '',
      baseSettings: {},
      songSection: '',
      confidence: 70,
      sourceLinks: [''],
      verified: false,
      verificationNotes: ''
    })
    setSelectedAmp(null)
    setSelectedGuitar(null)
    setPickupPositions([])
    setReferencePickupVoicePreview(null)
    setShowForm(true)
  }

  const handleEditTone = (tone: ToneWithGear) => {
    setEditingTone(tone)
    setFormData({
      name: tone.name,
      description: tone.description || '',
      baseGuitarId: tone.baseGuitarId || '',
      baseAmpId: tone.baseAmpId || '',
      referencePickupPosition: tone.referencePickupPosition || '',
      baseSettings: tone.baseSettings as any,
      songSection: tone.songSection || '',
      confidence: tone.confidence,
      sourceLinks: tone.sourceLinks || [''],
      verified: tone.verified,
      verificationNotes: tone.verificationNotes || ''
    })
    
    // Set selected gear
    if (tone.baseGuitarId) {
      const guitar = guitars.find(g => g.id === tone.baseGuitarId)
      setSelectedGuitar(guitar || null)
      if (guitar?.selector) {
        const positions = (guitar.selector as any).positions?.map((p: any) => p.name || p.label) || []
        setPickupPositions(positions)
      }
    }
    
    if (tone.baseAmpId) {
      const amp = amps.find(a => a.id === tone.baseAmpId)
      setSelectedAmp(amp || null)
    }
    
    setShowForm(true)
  }

  const handleDeleteTone = async (toneId: string) => {
    if (!confirm('Are you sure you want to delete this tone?')) return

    try {
      const response = await fetch(`/api/admin/tones/${toneId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        if (selectedSong) {
          fetchTones(selectedSong.id)
        }
        alert('Tone deleted successfully')
      } else {
        const error = await response.json()
        alert(`Error deleting tone: ${error.error}`)
      }
    } catch (error) {
      console.error('Error deleting tone:', error)
      alert('Error deleting tone')
    }
  }

  const handleGuitarChange = (guitarId: string) => {
    setFormData(prev => ({ ...prev, baseGuitarId: guitarId, referencePickupPosition: '' }))
    setSelectedGuitar(guitars.find(g => g.id === guitarId) || null)
    setPickupPositions([])
    setReferencePickupVoicePreview(null)
    
    if (guitarId) {
      const guitar = guitars.find(g => g.id === guitarId)
      if (guitar?.selector) {
        const positions = (guitar.selector as any).positions?.map((p: any) => p.name || p.label) || []
        setPickupPositions(positions)
      }
    }
  }

  const handleAmpChange = (ampId: string) => {
    setFormData(prev => ({ ...prev, baseAmpId: ampId, baseSettings: {} }))
    setSelectedAmp(amps.find(a => a.id === ampId) || null)
  }

  const handlePickupPositionChange = (position: string) => {
    setFormData(prev => ({ ...prev, referencePickupPosition: position }))
    
    if (selectedGuitar?.selector && position) {
      const selector = selectedGuitar.selector as any
      const selectedPosition = selector.positions?.find((p: any) => 
        p.name === position || p.label === position
      )
      
      if (selectedPosition) {
        setReferencePickupVoicePreview({
          active: selectedPosition.active,
          blend: selectedPosition.blend || 'n/a'
        })
      }
    }
  }

  const handleBaseSettingChange = (controlName: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      baseSettings: { ...prev.baseSettings, [controlName]: value }
    }))
  }

  const handleSourceLinkChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      sourceLinks: prev.sourceLinks.map((link, i) => i === index ? value : link)
    }))
  }

  const addSourceLink = () => {
    setFormData(prev => ({
      ...prev,
      sourceLinks: [...prev.sourceLinks, '']
    }))
  }

  const removeSourceLink = (index: number) => {
    setFormData(prev => ({
      ...prev,
      sourceLinks: prev.sourceLinks.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedSong) {
      alert('Please select a song first')
      return
    }

    // Validation
    if (!formData.name.trim()) {
      alert('Name is required')
      return
    }

    if (formData.sourceLinks.length === 0 || formData.sourceLinks.every(link => !link.trim())) {
      alert('At least one source link is required')
      return
    }

    const toneData = {
      ...formData,
      songId: selectedSong.id,
      sourceLinks: formData.sourceLinks.filter(link => link.trim()),
      referencePickupVoice: referencePickupVoicePreview
    }

    try {
      const url = editingTone 
        ? `/api/admin/tones/${editingTone.id}`
        : '/api/admin/tones'
      
      const response = await fetch(url, {
        method: editingTone ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(toneData)
      })

      if (response.ok) {
        if (selectedSong) {
          fetchTones(selectedSong.id)
        }
        setShowForm(false)
        alert(editingTone ? 'Tone updated successfully' : 'Tone saved successfully')
      } else {
        const error = await response.json()
        alert(`Error saving tone: ${error.error}`)
      }
    } catch (error) {
      console.error('Error saving tone:', error)
      alert('Error saving tone')
    }
  }

  const getSongSectionLabel = (section: SongSection) => {
    return section.charAt(0) + section.slice(1).toLowerCase()
  }

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4">Songs</h2>
        <div className="space-y-2">
          {songs.map((song) => (
            <button
              key={song.id}
              onClick={() => setSelectedSong(song)}
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                selectedSong?.id === song.id
                  ? 'bg-blue-100 text-blue-800 border border-blue-300'
                  : 'hover:bg-gray-100'
              }`}
            >
              <div className="font-medium">{song.title}</div>
              <div className="text-sm text-gray-600">{song.artist}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Panel */}
      <div className="flex-1 flex flex-col">
        {selectedSong ? (
          <>
            {/* Header */}
            <div className="bg-white border-b border-gray-200 p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold">{selectedSong.title}</h1>
                  <p className="text-gray-600">{selectedSong.artist}</p>
                </div>
                <button
                  onClick={handleAddTone}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Add Tone
                </button>
              </div>
            </div>

            {/* Tone List */}
            <div className="flex-1 p-6 overflow-y-auto">
              {tones.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No tones yet — add one.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {tones.map((tone) => (
                    <ToneCard
                      key={tone.id}
                      tone={tone}
                      onEdit={() => handleEditTone(tone)}
                      onDelete={() => handleDeleteTone(tone.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500 text-lg">Select a song to manage its tones</p>
          </div>
        )}
      </div>

      {/* Add/Edit Tone Form */}
      {showForm && (
        <ToneForm
          formData={formData}
          setFormData={setFormData}
          selectedSong={selectedSong}
          guitars={guitars}
          amps={amps}
          selectedGuitar={selectedGuitar}
          selectedAmp={selectedAmp}
          pickupPositions={pickupPositions}
          referencePickupVoicePreview={referencePickupVoicePreview}
          onGuitarChange={handleGuitarChange}
          onAmpChange={handleAmpChange}
          onPickupPositionChange={handlePickupPositionChange}
          onBaseSettingChange={handleBaseSettingChange}
          onSourceLinkChange={handleSourceLinkChange}
          addSourceLink={addSourceLink}
          removeSourceLink={removeSourceLink}
          onSubmit={handleSubmit}
          onClose={() => setShowForm(false)}
          editingTone={editingTone}
        />
      )}
    </div>
  )
}

function ToneCard({ tone, onEdit, onDelete }: { 
  tone: ToneWithGear; 
  onEdit: () => void; 
  onDelete: () => void 
}) {
  const getSongSectionLabel = (section: SongSection) => {
    return section.charAt(0) + section.slice(1).toLowerCase()
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold">{tone.name}</h3>
          {tone.description && (
            <p className="text-gray-600 mt-1">{tone.description}</p>
          )}
          <div className="flex gap-2 mt-2">
            {tone.songSection && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                {getSongSectionLabel(tone.songSection)}
              </span>
            )}
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
              {tone.confidence}% Confidence
            </span>
            {tone.verified && (
              <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-medium">
                Verified
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={onEdit} className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">
            Edit
          </button>
          <button onClick={onDelete} className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <strong className="text-gray-800">Base Guitar:</strong>
          <p className="text-gray-700">
            {tone.baseGuitar ? `${tone.baseGuitar.brand} ${tone.baseGuitar.model}` : 'Not set'}
          </p>
        </div>
        <div>
          <strong className="text-gray-800">Base Amp:</strong>
          <p className="text-gray-700">
            {tone.baseAmp ? `${tone.baseAmp.brand} ${tone.baseAmp.model}` : 'Not set'}
          </p>
        </div>
        {tone.referencePickupPosition && (
          <div>
            <strong className="text-gray-800">Pickup Position:</strong>
            <p className="text-gray-700">{tone.referencePickupPosition}</p>
          </div>
        )}
        <div>
          <strong className="text-gray-800">Controls:</strong>
          <p className="text-gray-700">
            {Object.keys(tone.baseSettings).length} configured
          </p>
        </div>
      </div>
    </div>
  )
}

function ToneForm({
  formData,
  setFormData,
  selectedSong,
  guitars,
  amps,
  selectedGuitar,
  selectedAmp,
  pickupPositions,
  referencePickupVoicePreview,
  onGuitarChange,
  onAmpChange,
  onPickupPositionChange,
  onBaseSettingChange,
  onSourceLinkChange,
  addSourceLink,
  removeSourceLink,
  onSubmit,
  onClose,
  editingTone
}: {
  formData: any
  setFormData: (data: any) => void
  selectedSong: Song | null
  guitars: Guitar[]
  amps: Amp[]
  selectedGuitar: Guitar | null
  selectedAmp: Amp | null
  pickupPositions: string[]
  referencePickupVoicePreview: any
  onGuitarChange: (guitarId: string) => void
  onAmpChange: (ampId: string) => void
  onPickupPositionChange: (position: string) => void
  onBaseSettingChange: (controlName: string, value: number) => void
  onSourceLinkChange: (index: number, value: string) => void
  addSourceLink: () => void
  removeSourceLink: (index: number) => void
  onSubmit: (e: React.FormEvent) => void
  onClose: () => void
  editingTone: ToneWithGear | null
}) {
  const songSections: SongSection[] = ['INTRO', 'VERSE', 'CHORUS', 'BRIDGE', 'SOLO', 'OUTRO', 'BREAKDOWN']

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              {editingTone ? 'Edit Tone' : 'Add Tone'}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              ✕
            </button>
          </div>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Song Section
              </label>
              <select
                value={formData.songSection}
                onChange={(e) => setFormData({ ...formData, songSection: e.target.value as SongSection })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select section</option>
                {songSections.map((section) => (
                  <option key={section} value={section}>
                    {section.charAt(0) + section.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          {/* Base Gear */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Base Guitar
              </label>
              <select
                value={formData.baseGuitarId}
                onChange={(e) => onGuitarChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select guitar</option>
                {guitars.map((guitar) => (
                  <option key={guitar.id} value={guitar.id}>
                    {guitar.brand} {guitar.model}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Base Amp
              </label>
              <select
                value={formData.baseAmpId}
                onChange={(e) => onAmpChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select amp</option>
                {amps.map((amp) => (
                  <option key={amp.id} value={amp.id}>
                    {amp.brand} {amp.model}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Pickup Position */}
          {selectedGuitar && pickupPositions.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reference Pickup Position
              </label>
              <select
                value={formData.referencePickupPosition}
                onChange={(e) => onPickupPositionChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select position</option>
                {pickupPositions.map((position) => (
                  <option key={position} value={position}>
                    {position}
                  </option>
                ))}
              </select>
              
              {referencePickupVoicePreview && (
                <div className="mt-2 p-3 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-600">
                    <strong>Active Pickups:</strong> {referencePickupVoicePreview.active?.map((a: any) => 
                      `${a.pickupId}${a.split ? ' (split)' : ''}`
                    ).join(', ')}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Blend:</strong> {referencePickupVoicePreview.blend}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Base Settings */}
          {selectedAmp && selectedAmp.controlsList && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Base Settings
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {(selectedAmp.controlsList as any[]).map((control) => (
                  <div key={control.name}>
                    <label className="block text-sm text-gray-600 mb-1">
                      {control.name}
                    </label>
                    <input
                      type="number"
                      min="0"
                      max={control.max}
                      value={formData.baseSettings[control.name] || 0}
                      onChange={(e) => onBaseSettingChange(control.name, parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Confidence */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confidence: {formData.confidence}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={formData.confidence}
              onChange={(e) => setFormData({ ...formData, confidence: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>

          {/* Source Links */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Source Links *
            </label>
            {formData.sourceLinks.map((link: string, index: number) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="url"
                  value={link}
                  onChange={(e) => onSourceLinkChange(index, e.target.value)}
                  placeholder="https://..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {formData.sourceLinks.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSourceLink(index)}
                    className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addSourceLink}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              Add Source Link
            </button>
          </div>

          {/* Verification */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.verified}
                  onChange={(e) => setFormData({ ...formData, verified: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">Verified</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Verification Notes
            </label>
            <textarea
              value={formData.verificationNotes}
              onChange={(e) => setFormData({ ...formData, verificationNotes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              {editingTone ? 'Update Tone' : 'Save Tone'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 