'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Song, Tone } from '@/lib/types'

export default function AdminTonesPage() {
  const [songs, setSongs] = useState<Song[]>([])
  const [tones, setTones] = useState<Tone[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingTone, setEditingTone] = useState<Tone | null>(null)
  const [formData, setFormData] = useState({
    songId: '',
    name: '',
    slug: '',
    guitarist: '',
    role: '',
    section: '',
    confidence: 'MEDIUM',
    // Required Archetypes (new)
    sourceGuitarArchetypeId: '',
    sourceAmpArchetypeId: '',
    // Source Gear (original rig) - all optional for backward compatibility
    instrument: 'GUITAR',
    sourceGuitar: '',
    sourcePickup: '',
    sourcePickupType: '',
    sourceAmp: '',
    sourceAmpChannel: '', // deprecated
    sourceAmpChannelStructured: '',
    sourceAmpChannelOther: '',
    sourcePedals: '',
    sourceNotes: '',
    // Original Guitar Settings 
    sourcePickupSelector: '',
    knobMode: 'single', // 'single' or 'per-pickup'
    sourceGuitarVolume: 10, // deprecated
    sourceGuitarTone: 10, // deprecated
    sourceGuitarVolumeNeck: 10,
    sourceGuitarVolumeBridge: 10,
    sourceGuitarToneNeck: 10,
    sourceGuitarToneBridge: 10,
    sourceCoilSplit: '',
    sourceOtherSwitches: '',
    // Original Amp Settings (Recorded)
    sourceAmpMasterVolume: 5,
    sourceAmpChannelVolume: 5,
    sourceAmpExtras: [],
    // Tone settings - structured form fields instead of JSON
    pickupTarget: 'bridge',
    gain: 5,
    bass: 5,
    mid: 5,
    treble: 5,
    presence: 5,
    reverb: 0,
    delay: 0,
    notes: ''
  })

  const [guitarArchetypes, setGuitarArchetypes] = useState<any[]>([])
  const [ampArchetypes, setAmpArchetypes] = useState<any[]>([])
  const [showGuitarArchetypeModal, setShowGuitarArchetypeModal] = useState(false)
  const [showAmpArchetypeModal, setShowAmpArchetypeModal] = useState(false)

  // Fetch songs, tones, and archetypes on component mount
  useEffect(() => {
    fetchSongs()
    fetchTones()
    fetchGuitarArchetypes()
    fetchAmpArchetypes()
  }, [])

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

  const fetchTones = async () => {
    try {
      const response = await fetch('/api/admin/tones')
      if (response.ok) {
        const data = await response.json()
        setTones(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error('Error fetching tones:', error)
    }
  }

  const fetchGuitarArchetypes = async () => {
    try {
      const response = await fetch('/api/admin/guitar-archetypes')
      if (response.ok) {
        const data = await response.json()
        setGuitarArchetypes(data)
      } else {
        console.error('Failed to fetch guitar archetypes')
      }
    } catch (error) {
      console.error('Error fetching guitar archetypes:', error)
    }
  }

  const fetchAmpArchetypes = async () => {
    try {
      const response = await fetch('/api/admin/amp-archetypes')
      if (response.ok) {
        const data = await response.json()
        setAmpArchetypes(data)
      } else {
        console.error('Failed to fetch amp archetypes')
      }
    } catch (error) {
      console.error('Error fetching amp archetypes:', error)
    }
  }

  const handleAddTone = () => {
    setEditingTone(null)
    setFormData({
      songId: '',
      name: '',
      slug: '',
      guitarist: '',
      role: '',
      section: '',
      confidence: 'MEDIUM',
      // Required Archetypes (new)
      sourceGuitarArchetypeId: '',
      sourceAmpArchetypeId: '',
      // Source Gear (original rig) - all optional for backward compatibility
      instrument: 'GUITAR',
      sourceGuitar: '',
      sourcePickup: '',
      sourcePickupType: '',
      sourceAmp: '',
      sourceAmpChannel: '',
      sourceAmpChannelStructured: '',
      sourceAmpChannelOther: '',
      sourcePedals: '',
      sourceNotes: '',
      // Original Guitar Settings
      sourcePickupSelector: '',
      knobMode: 'single', // 'single' or 'per-pickup'
      sourceGuitarVolume: 10, // deprecated
      sourceGuitarTone: 10, // deprecated
      sourceGuitarVolumeNeck: 10,
      sourceGuitarVolumeBridge: 10,
      sourceGuitarToneNeck: 10,
      sourceGuitarToneBridge: 10,
      sourceCoilSplit: '',
      sourceOtherSwitches: '',
      // Original Amp Settings (Base Tone)
      sourceAmpMasterVolume: 5,
      sourceAmpChannelVolume: 5,
      sourceAmpExtras: [],
      // Tone settings - structured form fields instead of JSON
      pickupTarget: 'bridge',
      gain: 5,
      bass: 5,
      mid: 5,
      treble: 5,
      presence: 5,
      reverb: 0,
      delay: 0,
      notes: ''
    })
    setShowForm(true)
  }

  const handleEditTone = (tone: Tone) => {
    setEditingTone(tone)
    // Parse the intent JSON to populate form fields
    const intent = typeof tone.intent === 'string' ? JSON.parse(tone.intent) : tone.intent
    
    // Determine knob mode based on whether per-pickup values exist
    const hasPerPickupValues = tone.sourceGuitarVolumeNeck !== undefined || 
                              tone.sourceGuitarVolumeBridge !== undefined || 
                              tone.sourceGuitarToneNeck !== undefined || 
                              tone.sourceGuitarToneBridge !== undefined
    const knobMode = hasPerPickupValues ? 'per-pickup' : 'single'
    
    setFormData({
      songId: tone.songId,
      name: tone.name,
      slug: tone.slug,
      guitarist: tone.guitarist || '',
      role: tone.role || '',
      section: tone.section || '',
      confidence: tone.confidence || 'MEDIUM',
      // Required Archetypes (new)
      sourceGuitarArchetypeId: tone.sourceGuitarArchetypeId || '',
      sourceAmpArchetypeId: tone.sourceAmpArchetypeId || '',
      // Source Gear fields
      instrument: tone.instrument || 'GUITAR',
      sourceGuitar: tone.sourceGuitar || '',
      sourcePickup: tone.sourcePickup || '',
      sourcePickupType: tone.sourcePickupType || '',
      sourceAmp: tone.sourceAmp || '',
      sourceAmpChannel: tone.sourceAmpChannel || '',
      sourceAmpChannelStructured: tone.sourceAmpChannelStructured || '',
      sourceAmpChannelOther: tone.sourceAmpChannelOther || '',
      sourcePedals: tone.sourcePedals || '',
      sourceNotes: tone.sourceNotes || '',
      // Original Guitar Settings
      sourcePickupSelector: tone.sourcePickupSelector || '',
      knobMode: knobMode,
      sourceGuitarVolume: tone.sourceGuitarVolume || 10,
      sourceGuitarTone: tone.sourceGuitarTone || 10,
      sourceGuitarVolumeNeck: tone.sourceGuitarVolumeNeck || 10,
      sourceGuitarVolumeBridge: tone.sourceGuitarVolumeBridge || 10,
      sourceGuitarToneNeck: tone.sourceGuitarToneNeck || 10,
      sourceGuitarToneBridge: tone.sourceGuitarToneBridge || 10,
      sourceCoilSplit: tone.sourceCoilSplit || '',
      sourceOtherSwitches: tone.sourceOtherSwitches || '',
      // Original Amp Settings (Recorded)
      sourceAmpMasterVolume: tone.sourceAmpMasterVolume || 5,
      sourceAmpChannelVolume: tone.sourceAmpChannelVolume || 5,
      sourceAmpExtras: tone.sourceAmpExtras || [],
      // Extract tone settings from intent
      pickupTarget: intent.pickupTarget || 'bridge',
      gain: intent.gain || 5,
      bass: intent.eq?.bass || 5,
      mid: intent.eq?.mid || 5,
      treble: intent.eq?.treble || 5,
      presence: intent.presence || 5,
      reverb: intent.reverb || 0,
      delay: intent.delay || 0,
      notes: tone.notes || ''
    })
    setShowForm(true)
  }

  const handleDeleteTone = async (toneId: string) => {
    if (!confirm('Are you sure you want to delete this tone?')) return

    try {
      const response = await fetch(`/api/admin/tones/${toneId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        fetchTones()
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.name.trim()) {
      alert('Name is required')
      return
    }

    if (!formData.slug.trim()) {
      alert('Slug is required')
      return
    }

    if (!formData.songId) {
      alert('Please select a song')
      return
    }

    // Validate role
    const validRoles = ['CLEAN', 'RHYTHM', 'CRUNCH', 'LEAD', 'SOLO']
    if (formData.role && !validRoles.includes(formData.role)) {
      alert('Role must be one of: CLEAN, RHYTHM, CRUNCH, LEAD, SOLO')
      return
    }

    // Construct intent object from form fields
    const intent = {
      pickupTarget: formData.pickupTarget,
      gain: formData.gain,
      eq: {
        bass: formData.bass,
        mid: formData.mid,
        treble: formData.treble
      },
      presence: formData.presence,
      reverb: formData.reverb,
      delay: formData.delay
    }

    const toneData = {
      songId: formData.songId,
      name: formData.name,
      slug: formData.slug,
      guitarist: formData.guitarist || null,
      role: formData.role || null,
      section: formData.section || null,
      confidence: formData.confidence || null,
      // Source Gear fields
      instrument: formData.instrument,
      sourceGuitar: formData.sourceGuitar || null,
      sourcePickup: formData.sourcePickup || null,
      sourcePickupType: formData.sourcePickupType || null,
      // Original Guitar Settings
      sourcePickupSelector: formData.sourcePickupSelector || null,
      sourceGuitarVolume: formData.knobMode === 'single' ? formData.sourceGuitarVolume : null,
      sourceGuitarTone: formData.knobMode === 'single' ? formData.sourceGuitarTone : null,
      sourceGuitarVolumeNeck: formData.knobMode === 'per-pickup' ? formData.sourceGuitarVolumeNeck : null,
      sourceGuitarVolumeBridge: formData.knobMode === 'per-pickup' ? formData.sourceGuitarVolumeBridge : null,
      sourceGuitarToneNeck: formData.knobMode === 'per-pickup' ? formData.sourceGuitarToneNeck : null,
      sourceGuitarToneBridge: formData.knobMode === 'per-pickup' ? formData.sourceGuitarToneBridge : null,
      sourceCoilSplit: formData.sourceCoilSplit || null,
      sourceOtherSwitches: formData.sourceOtherSwitches || null,
      sourceAmp: formData.sourceAmp || null,
      sourceAmpChannel: formData.sourceAmpChannel || null,
      sourceAmpChannelStructured: formData.sourceAmpChannelStructured || null,
      sourceAmpChannelOther: formData.sourceAmpChannelOther || null,
      sourcePedals: formData.sourcePedals || null,
      sourceNotes: formData.sourceNotes || null,
      // Original Amp Settings (Recorded)
      sourceAmpMasterVolume: formData.sourceAmpMasterVolume || null,
      sourceAmpChannelVolume: formData.sourceAmpChannelVolume || null,
      sourceAmpExtras: formData.sourceAmpExtras || null,
      intent: intent,
      notes: formData.notes || null
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
        fetchTones()
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

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin - Tones</h1>
        <div className="flex gap-4">
          <Link
            href="/admin/tones/import"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Import from Research
          </Link>
          <button
            onClick={handleAddTone}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add New Tone
          </button>
        </div>
      </div>

              {showForm && (
          <ToneForm
            formData={formData}
            setFormData={setFormData}
            songs={songs}
            guitarArchetypes={guitarArchetypes}
            ampArchetypes={ampArchetypes}
            onSubmit={handleSubmit}
            onClose={() => setShowForm(false)}
            editingTone={editingTone}
            onShowGuitarArchetypeModal={() => setShowGuitarArchetypeModal(true)}
            onShowAmpArchetypeModal={() => setShowAmpArchetypeModal(true)}
          />
        )}

        {/* Archetype Modals */}
        <GuitarArchetypeModal
          isOpen={showGuitarArchetypeModal}
          onClose={() => setShowGuitarArchetypeModal(false)}
          onSuccess={(archetype) => {
            setGuitarArchetypes(prev => [...prev, archetype])
            setFormData(prev => ({ ...prev, sourceGuitarArchetypeId: archetype.id }))
            alert(`Guitar archetype "${archetype.name}" created and selected!`)
          }}
        />

        <AmpArchetypeModal
          isOpen={showAmpArchetypeModal}
          onClose={() => setShowAmpArchetypeModal(false)}
          onSuccess={(archetype) => {
            setAmpArchetypes(prev => [...prev, archetype])
            setFormData(prev => ({ ...prev, sourceAmpArchetypeId: archetype.id }))
            alert(`Amp archetype "${archetype.name}" created and selected!`)
          }}
        />

      <div className="grid gap-6">
        {tones.map((tone) => (
          <ToneCard
            key={tone.id}
            tone={tone}
            onEdit={() => handleEditTone(tone)}
            onDelete={() => handleDeleteTone(tone.id)}
          />
        ))}
      </div>
    </div>
  )
}

function ToneCard({ tone, onEdit, onDelete }: { 
  tone: Tone; 
  onEdit: () => void; 
  onDelete: () => void 
}) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold">{tone.name}</h3>
          <div className="flex gap-2 mt-2">
            {tone.role && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                {tone.role}
              </span>
            )}
            {tone.section && (
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                {tone.section}
              </span>
            )}
            {tone.guitarist && (
              <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-medium">
                {tone.guitarist}
              </span>
            )}
            {tone.confidence && (
              <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                tone.confidence === 'HIGH' ? 'bg-green-100 text-green-800' :
                tone.confidence === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {tone.confidence}
              </span>
            )}
          </div>
          <p className="text-gray-500 text-sm mt-1">Slug: {tone.slug}</p>
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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
        <div>
          <strong className="text-gray-800">Song ID:</strong>
          <p className="text-gray-700">{tone.songId}</p>
        </div>
        <div>
          <strong className="text-gray-800">Role:</strong>
          <p className="text-gray-700">{tone.role || 'Not set'}</p>
        </div>
        <div>
          <strong className="text-gray-800">Section:</strong>
          <p className="text-gray-700">{tone.section || 'Not set'}</p>
        </div>
        <div>
          <strong className="text-gray-800">Guitarist:</strong>
          <p className="text-gray-700">{tone.guitarist || 'Not set'}</p>
        </div>
      </div>

      {/* Archetypes Display */}
      {(tone.sourceGuitarArchetype || tone.sourceAmpArchetype) && (
        <div className="mt-4 p-3 bg-blue-50 rounded">
          <p className="text-xs text-gray-600 mb-2 font-medium">Archetypes:</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {tone.sourceGuitarArchetype && (
              <div>
                <span className="text-gray-500">Guitar:</span>
                <span className="ml-1 font-medium">{tone.sourceGuitarArchetype.name}</span>
                <span className="ml-1 px-1 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
                  {tone.sourceGuitarArchetype.pickupLayout}
                </span>
              </div>
            )}
            {tone.sourceAmpArchetype && (
              <div>
                <span className="text-gray-500">Amp:</span>
                <span className="ml-1 font-medium">{tone.sourceAmpArchetype.name}</span>
                <span className="ml-1 px-1 py-0.5 bg-green-100 text-green-800 rounded text-xs">
                  {tone.sourceAmpArchetype.topology}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Additional Notes Display */}
      {(tone.sourceGuitar || tone.sourceAmp || tone.sourceNotes) && (
        <div className="mt-4 p-3 bg-gray-50 rounded">
          <p className="text-xs text-gray-600 mb-2 font-medium">Additional Notes:</p>
          <div className="space-y-1 text-xs">
            {tone.sourceGuitar && (
              <div>
                <span className="text-gray-500">Guitar Notes:</span>
                <span className="ml-1 text-gray-700">{tone.sourceGuitar}</span>
              </div>
            )}
            {tone.sourceAmp && (
              <div>
                <span className="text-gray-500">Amp Notes:</span>
                <span className="ml-1 text-gray-700">{tone.sourceAmp}</span>
              </div>
            )}
            {tone.sourceNotes && (
              <div>
                <span className="text-gray-500">General Notes:</span>
                <span className="ml-1 text-gray-700">{tone.sourceNotes}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Guitar Settings Display */}
      {(tone.sourcePickupSelector || tone.sourceGuitarVolume !== undefined || tone.sourceGuitarTone !== undefined || tone.sourceGuitarVolumeNeck !== undefined || tone.sourceGuitarVolumeBridge !== undefined || tone.sourceGuitarToneNeck !== undefined || tone.sourceGuitarToneBridge !== undefined || tone.sourceCoilSplit || tone.sourceOtherSwitches) && (
        <div className="mt-4 p-3 bg-green-50 rounded">
          <p className="text-xs text-gray-600 mb-2 font-medium">Guitar Settings (Original):</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            {tone.sourcePickupSelector && (
              <div>
                <span className="text-gray-500">Pickup:</span>
                <span className="ml-1 font-medium">{tone.sourcePickupSelector}</span>
              </div>
            )}
            {/* Show per-pickup knobs if they exist, otherwise show single knobs */}
            {tone.sourceGuitarVolumeNeck !== undefined || tone.sourceGuitarVolumeBridge !== undefined ? (
              <>
                {tone.sourceGuitarVolumeNeck !== undefined && (
                  <div>
                    <span className="text-gray-500">Neck Vol:</span>
                    <span className="ml-1 font-medium">{tone.sourceGuitarVolumeNeck}/10</span>
                  </div>
                )}
                {tone.sourceGuitarVolumeBridge !== undefined && (
                  <div>
                    <span className="text-gray-500">Bridge Vol:</span>
                    <span className="ml-1 font-medium">{tone.sourceGuitarVolumeBridge}/10</span>
                  </div>
                )}
                {tone.sourceGuitarToneNeck !== undefined && (
                  <div>
                    <span className="text-gray-500">Neck Tone:</span>
                    <span className="ml-1 font-medium">{tone.sourceGuitarToneNeck}/10</span>
                  </div>
                )}
                {tone.sourceGuitarToneBridge !== undefined && (
                  <div>
                    <span className="text-gray-500">Bridge Tone:</span>
                    <span className="ml-1 font-medium">{tone.sourceGuitarToneBridge}/10</span>
                  </div>
                )}
              </>
            ) : (
              <>
                {tone.sourceGuitarVolume !== undefined && (
                  <div>
                    <span className="text-gray-500">Volume:</span>
                    <span className="ml-1 font-medium">{tone.sourceGuitarVolume}/10</span>
                  </div>
                )}
                {tone.sourceGuitarTone !== undefined && (
                  <div>
                    <span className="text-gray-500">Tone:</span>
                    <span className="ml-1 font-medium">{tone.sourceGuitarTone}/10</span>
                  </div>
                )}
              </>
            )}
            {tone.sourceCoilSplit && (
              <div>
                <span className="text-gray-500">Coil Split:</span>
                <span className="ml-1 font-medium">{tone.sourceCoilSplit}</span>
              </div>
            )}
            {tone.sourceOtherSwitches && (
              <div>
                <span className="text-gray-500">Other:</span>
                <span className="ml-1 font-medium">{tone.sourceOtherSwitches}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Amp Settings Display */}
      {(tone.sourceAmpMasterVolume !== undefined || tone.sourceAmpChannelVolume !== undefined || tone.sourceAmpExtras) && (
        <div className="mt-4 p-3 bg-yellow-50 rounded">
          <p className="text-xs text-gray-600 mb-2 font-medium">Amp Settings (Recorded):</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            {tone.sourceAmpMasterVolume !== undefined && (
              <div>
                <span className="text-gray-500">Master Vol:</span>
                <span className="ml-1 font-medium">{tone.sourceAmpMasterVolume}/10</span>
              </div>
            )}
            {tone.sourceAmpChannelVolume !== undefined && (
              <div>
                <span className="text-gray-500">Channel Vol:</span>
                <span className="ml-1 font-medium">{tone.sourceAmpChannelVolume}/10</span>
              </div>
            )}
          </div>
          {tone.sourceAmpExtras && Array.isArray(tone.sourceAmpExtras) && tone.sourceAmpExtras.length > 0 && (
            <div className="mt-2">
              <span className="text-gray-500 text-xs">Advanced Controls:</span>
              <div className="mt-1 space-y-1">
                {tone.sourceAmpExtras.map((extra: any, index: number) => (
                  <div key={index} className="text-xs text-gray-700">
                    <span className="font-medium">{extra.control}:</span> {extra.value}
                    {extra.units && <span className="text-gray-500"> {extra.units}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

             {/* Tone Settings Display */}
       {tone.intent && (
         <div className="mt-4 p-3 bg-gray-50 rounded">
           <p className="text-xs text-gray-600 mb-2 font-medium">Tone Settings:</p>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
             <div>
               <span className="text-gray-500">Pickup:</span>
               <span className="ml-1 font-medium">{typeof tone.intent === 'object' ? tone.intent.pickupTarget : 'N/A'}</span>
             </div>
             <div>
               <span className="text-gray-500">Gain:</span>
               <span className="ml-1 font-medium">{typeof tone.intent === 'object' ? tone.intent.gain : 'N/A'}</span>
             </div>
             <div>
               <span className="text-gray-500">Bass:</span>
               <span className="ml-1 font-medium">{typeof tone.intent === 'object' && tone.intent.eq ? tone.intent.eq.bass : 'N/A'}</span>
             </div>
             <div>
               <span className="text-gray-500">Mid:</span>
               <span className="ml-1 font-medium">{typeof tone.intent === 'object' && tone.intent.eq ? tone.intent.eq.mid : 'N/A'}</span>
             </div>
             <div>
               <span className="text-gray-500">Treble:</span>
               <span className="ml-1 font-medium">{typeof tone.intent === 'object' && tone.intent.eq ? tone.intent.eq.treble : 'N/A'}</span>
             </div>
             <div>
               <span className="text-gray-500">Presence:</span>
               <span className="ml-1 font-medium">{typeof tone.intent === 'object' ? tone.intent.presence : 'N/A'}</span>
             </div>
             <div>
               <span className="text-gray-500">Reverb:</span>
               <span className="ml-1 font-medium">{typeof tone.intent === 'object' ? tone.intent.reverb : 'N/A'}</span>
             </div>
             <div>
               <span className="text-gray-500">Delay:</span>
               <span className="ml-1 font-medium">{typeof tone.intent === 'object' ? tone.intent.delay : 'N/A'}</span>
             </div>
           </div>
         </div>
       )}

      {/* Notes */}
      {tone.notes && (
        <div className="mt-4 p-3 bg-yellow-50 rounded">
          <p className="text-xs text-gray-600 mb-1">Notes:</p>
          <p className="text-sm text-gray-700">{tone.notes}</p>
        </div>
      )}
    </div>
  )
}

function ToneForm({
  formData,
  setFormData,
  songs,
  guitarArchetypes,
  ampArchetypes,
  onSubmit,
  onClose,
  editingTone,
  onShowGuitarArchetypeModal,
  onShowAmpArchetypeModal
}: {
  formData: any
  setFormData: (data: any) => void
  songs: Song[]
  guitarArchetypes: any[]
  ampArchetypes: any[]
  onSubmit: (e: React.FormEvent) => void
  onClose: () => void
  editingTone: Tone | null
  onShowGuitarArchetypeModal: () => void
  onShowAmpArchetypeModal: () => void
}) {
  const roles = ['CLEAN', 'RHYTHM', 'CRUNCH', 'LEAD', 'SOLO']

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
          {/* Song Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Song *
            </label>
            <select
              value={formData.songId}
              onChange={(e) => setFormData({ ...formData, songId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a song</option>
              {songs.map((song) => (
                <option key={song.id} value={song.id}>
                  {song.title} - {song.artist}
                </option>
              ))}
            </select>
          </div>

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
                Slug *
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="unique-slug-name"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Guitarist (Optional)
              </label>
              <input
                type="text"
                value={formData.guitarist}
                onChange={(e) => setFormData({ ...formData, guitarist: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Don Felder"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select role</option>
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Section (Optional)
            </label>
            <input
              type="text"
              value={formData.section}
              onChange={(e) => setFormData({ ...formData, section: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., intro, verse, chorus, solo 1"
            />
          </div>

          {/* Confidence */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confidence
            </label>
            <select
              value={formData.confidence}
              onChange={(e) => setFormData({ ...formData, confidence: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>

          {/* Source Gear */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Source Gear</h3>
            
            {/* Required Archetypes */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Guitar Archetype *
                </label>
                <div className="flex gap-2">
                  <select
                    value={formData.sourceGuitarArchetypeId}
                    onChange={(e) => setFormData({ ...formData, sourceGuitarArchetypeId: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select guitar archetype</option>
                    {guitarArchetypes
                      .filter(archetype => !archetype.systemLocked)
                      .map((archetype) => (
                        <option key={archetype.id} value={archetype.id}>
                          {archetype.name} ({archetype.pickupLayout})
                        </option>
                      ))}
                  </select>
                  <button
                    type="button"
                    onClick={onShowGuitarArchetypeModal}
                    className="px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm"
                  >
                    Add New
                  </button>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Required. This is the canonical guitar type used on the record (e.g., Les Paul HH, Strat SSS). If the exact model isn't in the list, click Add New to create it now.
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amp Archetype *
                </label>
                <div className="flex gap-2">
                  <select
                    value={formData.sourceAmpArchetypeId}
                    onChange={(e) => setFormData({ ...formData, sourceAmpArchetypeId: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select amp archetype</option>
                    {ampArchetypes
                      .filter(archetype => !archetype.systemLocked)
                      .map((archetype) => (
                        <option key={archetype.id} value={archetype.id}>
                          {archetype.name} ({archetype.topology})
                        </option>
                      ))}
                  </select>
                  <button
                    type="button"
                    onClick={onShowAmpArchetypeModal}
                    className="px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm"
                  >
                    Add New
                  </button>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Required. This is the canonical amp family/model used on the record (e.g., Marshall JCM800, Fender Twin). If it's missing, click Add New.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instrument
                </label>
                <select
                  value={formData.instrument}
                  onChange={(e) => setFormData({ ...formData, instrument: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="GUITAR">Guitar</option>
                  <option value="BASS">Bass</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Source Guitar (Secondary Notes)
                </label>
                <input
                  type="text"
                  value={formData.sourceGuitar}
                  onChange={(e) => setFormData({ ...formData, sourceGuitar: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Gibson Les Paul Standard 1959"
                />
                <p className="text-xs text-gray-600 mt-1">
                  Additional labeling (year/mods/tech notes). Not used for matching.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Source Pickup (Optional)
                </label>
                <input
                  type="text"
                  value={formData.sourcePickup}
                  onChange={(e) => setFormData({ ...formData, sourcePickup: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., EMG 81"
                />
              </div>
                             <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">
                   Source Pickup Type (Optional)
                 </label>
                 <select
                   value={formData.sourcePickupType}
                   onChange={(e) => setFormData({ ...formData, sourcePickupType: e.target.value })}
                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                 >
                   <option value="">Select pickup type</option>
                   <option value="SINGLE_COIL">Single Coil</option>
                   <option value="HUMBUCKER">Humbucker</option>
                   <option value="P90">P90</option>
                   <option value="OTHER">Other</option>
                 </select>
               </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Source Amp (Secondary Notes)
                </label>
                <input
                  type="text"
                  value={formData.sourceAmp}
                  onChange={(e) => setFormData({ ...formData, sourceAmp: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Fender Twin Reverb 1965"
                />
                <p className="text-xs text-gray-600 mt-1">
                  Additional labeling (year/mods/tech notes). Not used for matching.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amp Channel (Optional)
                </label>
                <select
                  value={formData.sourceAmpChannelStructured}
                  onChange={(e) => setFormData({ ...formData, sourceAmpChannelStructured: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select amp channel</option>
                  <option value="CLEAN">Clean</option>
                  <option value="CRUNCH">Crunch</option>
                  <option value="LEAD_HIGH_GAIN">Lead/High Gain</option>
                  <option value="ACOUSTIC_JC">Acoustic/JC</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              {formData.sourceAmpChannelStructured === 'OTHER' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amp Channel (Other)
                  </label>
                  <input
                    type="text"
                    value={formData.sourceAmpChannelOther}
                    onChange={(e) => setFormData({ ...formData, sourceAmpChannelOther: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Channel 2 Orange, OD1"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Source Amp Channel (Deprecated)
                </label>
                <input
                  type="text"
                  value={formData.sourceAmpChannel}
                  onChange={(e) => setFormData({ ...formData, sourceAmpChannel: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Channel 1 (legacy field)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Source Pedals (Optional)
                </label>
                <input
                  type="text"
                  value={formData.sourcePedals}
                  onChange={(e) => setFormData({ ...formData, sourcePedals: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Boss DD-3, MXR M100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Source Notes (Optional)
                </label>
                <textarea
                  value={formData.sourceNotes}
                  onChange={(e) => setFormData({ ...formData, sourceNotes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                  placeholder="Notes about the source gear..."
                />
              </div>
            </div>
          </div>

          {/* Guitar Settings (Original) */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Guitar Settings (Original)</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pickup Selector (Original)
                </label>
                <select
                  value={formData.sourcePickupSelector}
                  onChange={(e) => setFormData({ ...formData, sourcePickupSelector: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select pickup position</option>
                  <option value="Neck">Neck</option>
                  <option value="Neck+Middle">Neck + Middle</option>
                  <option value="Middle">Middle</option>
                  <option value="Middle+Bridge">Middle + Bridge</option>
                  <option value="Bridge">Bridge</option>
                  <option value="Neck+Bridge">Neck + Bridge</option>
                  <option value="All/Other">All/Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Coil Split
                </label>
                <select
                  value={formData.sourceCoilSplit}
                  onChange={(e) => setFormData({ ...formData, sourceCoilSplit: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">None</option>
                  <option value="Neck">Neck</option>
                  <option value="Bridge">Bridge</option>
                  <option value="Both">Both</option>
                </select>
              </div>
            </div>

            {/* Knob Mode Toggle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Knob Mode
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="knobMode"
                    value="single"
                    checked={formData.knobMode === 'single'}
                    onChange={(e) => setFormData({ ...formData, knobMode: e.target.value })}
                    className="mr-2"
                  />
                  Single (default)
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="knobMode"
                    value="per-pickup"
                    checked={formData.knobMode === 'per-pickup'}
                    onChange={(e) => setFormData({ ...formData, knobMode: e.target.value })}
                    className="mr-2"
                  />
                  Per-pickup (Les Paul style)
                </label>
              </div>
            </div>

            {/* Single Knob Mode */}
            {formData.knobMode === 'single' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Guitar Volume: {formData.sourceGuitarVolume}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={formData.sourceGuitarVolume}
                    onChange={(e) => setFormData({ ...formData, sourceGuitarVolume: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0</span>
                    <span>10</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Guitar Tone: {formData.sourceGuitarTone}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={formData.sourceGuitarTone}
                    onChange={(e) => setFormData({ ...formData, sourceGuitarTone: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0</span>
                    <span>10</span>
                  </div>
                </div>
              </div>
            )}

            {/* Per-Pickup Knob Mode */}
            {formData.knobMode === 'per-pickup' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Neck Volume: {formData.sourceGuitarVolumeNeck}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={formData.sourceGuitarVolumeNeck}
                      onChange={(e) => setFormData({ ...formData, sourceGuitarVolumeNeck: parseInt(e.target.value) })}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0</span>
                      <span>10</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bridge Volume: {formData.sourceGuitarVolumeBridge}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={formData.sourceGuitarVolumeBridge}
                      onChange={(e) => setFormData({ ...formData, sourceGuitarVolumeBridge: parseInt(e.target.value) })}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0</span>
                      <span>10</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Neck Tone: {formData.sourceGuitarToneNeck}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={formData.sourceGuitarToneNeck}
                      onChange={(e) => setFormData({ ...formData, sourceGuitarToneNeck: parseInt(e.target.value) })}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0</span>
                      <span>10</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bridge Tone: {formData.sourceGuitarToneBridge}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={formData.sourceGuitarToneBridge}
                      onChange={(e) => setFormData({ ...formData, sourceGuitarToneBridge: parseInt(e.target.value) })}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0</span>
                      <span>10</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Other Switches (Optional)
              </label>
              <input
                type="text"
                value={formData.sourceOtherSwitches}
                onChange={(e) => setFormData({ ...formData, sourceOtherSwitches: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., phase reverse on, series mode"
              />
            </div>
          </div>

          {/* Original Amp Settings (Recorded) */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Original Amp Settings (Recorded)</h3>
            <p className="text-sm text-gray-600">Exact dials as used on the record. These are the base-tone truth.</p>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Master Volume: {formData.sourceAmpMasterVolume}
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={formData.sourceAmpMasterVolume}
                  onChange={(e) => setFormData({ ...formData, sourceAmpMasterVolume: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0</span>
                  <span>10</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Channel Volume / Preamp Level: {formData.sourceAmpChannelVolume}
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={formData.sourceAmpChannelVolume}
                  onChange={(e) => setFormData({ ...formData, sourceAmpChannelVolume: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0</span>
                  <span>10</span>
                </div>
              </div>
            </div>

            {/* Advanced Amp Controls */}
            <div>
              <details className="group">
                <summary className="flex justify-between items-center cursor-pointer list-none">
                  <span className="text-sm font-medium text-gray-700">Advanced Amp Controls (Optional)</span>
                  <span className="transition group-open:rotate-180">
                    ▼
                  </span>
                </summary>
                <div className="mt-4 space-y-4">
                  <p className="text-sm text-gray-600">
                    Add specific amp controls like Bright, Tone Cut, Resonance, etc.
                  </p>
                  <div className="space-y-2">
                    {formData.sourceAmpExtras.map((extra: any, index: number) => (
                      <div key={index} className="grid grid-cols-4 gap-2">
                        <input
                          type="text"
                          placeholder="Control"
                          value={extra.control || ''}
                          onChange={(e) => {
                            const newExtras = [...formData.sourceAmpExtras];
                            newExtras[index] = { ...extra, control: e.target.value };
                            setFormData({ ...formData, sourceAmpExtras: newExtras });
                          }}
                          className="px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Value"
                          value={extra.value || ''}
                          onChange={(e) => {
                            const newExtras = [...formData.sourceAmpExtras];
                            newExtras[index] = { ...extra, value: e.target.value };
                            setFormData({ ...formData, sourceAmpExtras: newExtras });
                          }}
                          className="px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Units (optional)"
                          value={extra.units || ''}
                          onChange={(e) => {
                            const newExtras = [...formData.sourceAmpExtras];
                            newExtras[index] = { ...extra, units: e.target.value };
                            setFormData({ ...formData, sourceAmpExtras: newExtras });
                          }}
                          className="px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newExtras = formData.sourceAmpExtras.filter((_: any, i: number) => i !== index);
                            setFormData({ ...formData, sourceAmpExtras: newExtras });
                          }}
                          className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          sourceAmpExtras: [...formData.sourceAmpExtras, { control: '', value: '', units: '', notes: '' }]
                        });
                      }}
                      className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                    >
                      Add Control
                    </button>
                  </div>
                </div>
              </details>
            </div>
          </div>

          {/* Target Mapping (Optional) */}
          <details className="group" open={false}>
            <summary className="flex justify-between items-center cursor-pointer list-none">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Target Mapping (Optional)</h3>
                <p className="text-sm text-gray-600">Optional normalized mapping seed. If left empty, the match engine computes this from the original settings.</p>
              </div>
              <span className="transition group-open:rotate-180">
                ▼
              </span>
            </summary>
            <div className="mt-4 space-y-4">
            
            {/* Pickup Target */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pickup Target
              </label>
              <select
                value={formData.pickupTarget}
                onChange={(e) => setFormData({ ...formData, pickupTarget: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="bridge">Bridge</option>
                <option value="middle">Middle</option>
                <option value="neck">Neck</option>
                <option value="bridge+middle">Bridge + Middle</option>
                <option value="middle+neck">Middle + Neck</option>
                <option value="neck+tone-rolled">Neck (Tone Rolled)</option>
                <option value="any">Any</option>
              </select>
            </div>

            {/* Gain */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gain: {formData.gain}
              </label>
              <input
                type="range"
                min="0"
                max="10"
                value={formData.gain}
                onChange={(e) => setFormData({ ...formData, gain: parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Clean</span>
                <span>Overdrive</span>
              </div>
            </div>

            {/* EQ Section */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bass: {formData.bass}
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={formData.bass}
                  onChange={(e) => setFormData({ ...formData, bass: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mid: {formData.mid}
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={formData.mid}
                  onChange={(e) => setFormData({ ...formData, mid: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Treble: {formData.treble}
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={formData.treble}
                  onChange={(e) => setFormData({ ...formData, treble: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            {/* Effects */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Presence: {formData.presence}
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={formData.presence}
                  onChange={(e) => setFormData({ ...formData, presence: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reverb: {formData.reverb}
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={formData.reverb}
                  onChange={(e) => setFormData({ ...formData, reverb: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delay: {formData.delay}
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={formData.delay}
                  onChange={(e) => setFormData({ ...formData, delay: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>
        </details>

        {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Additional notes about this tone..."
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

// Guitar Archetype Modal Component
function GuitarArchetypeModal({
  isOpen,
  onClose,
  onSuccess
}: {
  isOpen: boolean
  onClose: () => void
  onSuccess: (archetype: any) => void
}) {
  const [formData, setFormData] = useState({
    name: '',
    pickupLayout: '',
    positions: [] as string[],
    notes: ''
  })

  const pickupLayouts = ['HH', 'SSS', 'SS', 'HSS', 'HS', 'HSH', 'P90', 'Other']
  const positionOptions = ['NECK', 'MIDDLE', 'BRIDGE', 'NECK+MIDDLE', 'MIDDLE+BRIDGE', 'NECK+BRIDGE', 'ALL']

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.pickupLayout || formData.positions.length === 0) {
      alert('Name, pickup layout, and at least one position are required')
      return
    }

    try {
      const response = await fetch('/api/admin/guitar-archetypes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const archetype = await response.json()
        onSuccess(archetype)
        onClose()
        setFormData({ name: '', pickupLayout: '', positions: [], notes: '' })
      } else {
        const error = await response.json()
        alert(`Error creating archetype: ${error.error}`)
      }
    } catch (error) {
      console.error('Error creating guitar archetype:', error)
      alert('Error creating guitar archetype')
    }
  }

  const togglePosition = (position: string) => {
    setFormData(prev => ({
      ...prev,
      positions: prev.positions.includes(position)
        ? prev.positions.filter(p => p !== position)
        : [...prev.positions, position]
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Add Guitar Archetype</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
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
              placeholder="e.g., Les Paul HH"
              required
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
              Positions *
            </label>
            <div className="space-y-2">
              {positionOptions.map(position => (
                <label key={position} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.positions.includes(position)}
                    onChange={() => togglePosition(position)}
                    className="mr-2"
                  />
                  {position}
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
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Create Archetype
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Amp Archetype Modal Component
function AmpArchetypeModal({
  isOpen,
  onClose,
  onSuccess
}: {
  isOpen: boolean
  onClose: () => void
  onSuccess: (archetype: any) => void
}) {
  const [formData, setFormData] = useState({
    name: '',
    topology: '',
    notes: ''
  })

  const topologies = [
    'British Crunch',
    'American Clean',
    'High Gain',
    'British Clean',
    'American Crunch',
    'Modern High Gain',
    'Vintage Clean',
    'Other'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.topology) {
      alert('Name and topology are required')
      return
    }

    try {
      const response = await fetch('/api/admin/amp-archetypes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const archetype = await response.json()
        onSuccess(archetype)
        onClose()
        setFormData({ name: '', topology: '', notes: '' })
      } else {
        const error = await response.json()
        alert(`Error creating archetype: ${error.error}`)
      }
    } catch (error) {
      console.error('Error creating amp archetype:', error)
      alert('Error creating amp archetype')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Add Amp Archetype</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
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
              placeholder="e.g., Marshall JCM800"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Topology *
            </label>
            <select
              value={formData.topology}
              onChange={(e) => setFormData({ ...formData, topology: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select topology</option>
              {topologies.map(topology => (
                <option key={topology} value={topology}>{topology}</option>
              ))}
            </select>
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
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Create Archetype
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 