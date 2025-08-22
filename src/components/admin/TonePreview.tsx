'use client'

import { useState, useEffect } from 'react'
import { ParsedToneWithId } from './ToneImporter'
import { ArchetypeSelector } from './ArchetypeSelector'

interface TonePreviewProps {
  tones: ParsedToneWithId[]
  onComplete: (tones: ParsedToneWithId[]) => void
  onBack: () => void
}

export function TonePreview({ tones, onComplete, onBack }: TonePreviewProps) {
  const [editableTones, setEditableTones] = useState<ParsedToneWithId[]>(tones)
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({})

  useEffect(() => {
    setEditableTones(tones)
  }, [tones])

  const updateTone = (id: string, updates: Partial<ParsedToneWithId>) => {
    setEditableTones(prev => prev.map(tone => 
      tone.id === id ? { ...tone, ...updates } : tone
    ))
  }

  const validateTones = (): boolean => {
    const errors: Record<string, string[]> = {}
    
    editableTones.forEach(tone => {
      const toneErrors: string[] = []
      
      if (!tone.name?.trim()) {
        toneErrors.push('Name is required')
      }
      
      if (!tone.slug?.trim()) {
        toneErrors.push('Slug is required')
      }
      
      if (!tone.role) {
        toneErrors.push('Role is required')
      }
      
      if (!tone.confidence) {
        toneErrors.push('Confidence is required')
      }
      
      if (!tone.sourceGuitarArchetypeId) {
        toneErrors.push('Guitar Archetype is required')
      }
      
      if (!tone.sourceAmpArchetypeId) {
        toneErrors.push('Amp Archetype is required')
      }
      
      if (toneErrors.length > 0) {
        errors[tone.id] = toneErrors
      }
    })
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleContinue = () => {
    if (validateTones()) {
      onComplete(editableTones)
    }
  }

  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const getArchetypeHint = (pickupTarget?: string): string | null => {
    if (!pickupTarget) return null
    
    const lower = pickupTarget.toLowerCase()
    if (lower.includes('humbucker') || lower.includes('les paul') || lower.includes('lp')) {
      return 'Les Paul HH'
    }
    if (lower.includes('telecaster') || lower.includes('tele') || lower.includes('single-coil')) {
      return 'Telecaster SS'
    }
    if (lower.includes('stratocaster') || lower.includes('strat')) {
      return 'Stratocaster SSS'
    }
    return null
  }

  // Group tones by song
  const tonesBySong = editableTones.reduce((acc, tone) => {
    const songKey = `${tone.song.title} — ${tone.song.artist}`
    if (!acc[songKey]) {
      acc[songKey] = []
    }
    acc[songKey].push(tone)
    return acc
  }, {} as Record<string, ParsedToneWithId[]>)

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Step 2: Preview & Map Archetypes</h2>
          <div className="flex gap-2">
            <button
              onClick={onBack}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={handleContinue}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Continue to Create ({editableTones.length} tones)
            </button>
          </div>
        </div>

        {/* Validation summary */}
        {Object.keys(validationErrors).length > 0 && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <h3 className="text-red-800 font-medium mb-2">Please fix the following issues:</h3>
            <ul className="text-red-700 text-sm space-y-1">
              {Object.entries(validationErrors).map(([toneId, errors]) => {
                const tone = editableTones.find(t => t.id === toneId)
                return errors.map((error, index) => (
                  <li key={`${toneId}-${index}`}>
                    <strong>{tone?.name || 'Unknown tone'}:</strong> {error}
                  </li>
                ))
              })}
            </ul>
          </div>
        )}

        {/* Tones grouped by song */}
        <div className="space-y-8">
          {Object.entries(tonesBySong).map(([songKey, songTones]) => {
            const firstTone = songTones[0]
            return (
              <div key={songKey} className="border border-gray-200 rounded-lg p-4">
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-gray-900">{firstTone.song.title}</h3>
                  <p className="text-gray-600">{firstTone.song.artist} ({firstTone.song.year})</p>
                </div>

                <div className="space-y-4">
                  {songTones.map((tone) => {
                    const errors = validationErrors[tone.id] || []
                    const hasErrors = errors.length > 0
                    const archetypeHint = getArchetypeHint(tone.pickupSelectorOriginal)

                    return (
                      <div 
                        key={tone.id} 
                        className={`border rounded-lg p-4 ${hasErrors ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                      >
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          {/* Left column - Basic info */}
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tone Name *
                              </label>
                              <input
                                type="text"
                                value={tone.name || ''}
                                onChange={(e) => {
                                  const newName = e.target.value
                                  updateTone(tone.id, { 
                                    name: newName,
                                    slug: generateSlug(newName)
                                  })
                                }}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                  hasErrors && !tone.name ? 'border-red-300' : 'border-gray-300'
                                }`}
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Slug *
                              </label>
                              <input
                                type="text"
                                value={tone.slug || ''}
                                onChange={(e) => updateTone(tone.id, { slug: e.target.value })}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                  hasErrors && !tone.slug ? 'border-red-300' : 'border-gray-300'
                                }`}
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Guitarist
                              </label>
                              <input
                                type="text"
                                value={tone.guitarist || ''}
                                onChange={(e) => updateTone(tone.id, { guitarist: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Role *
                              </label>
                              <select
                                value={tone.role || ''}
                                onChange={(e) => updateTone(tone.id, { role: e.target.value as any })}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                  hasErrors && !tone.role ? 'border-red-300' : 'border-gray-300'
                                }`}
                              >
                                <option value="">Select role</option>
                                <option value="CLEAN">Clean</option>
                                <option value="RHYTHM">Rhythm</option>
                                <option value="CRUNCH">Crunch</option>
                                <option value="LEAD">Lead</option>
                                <option value="SOLO">Solo</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Section
                              </label>
                              <input
                                type="text"
                                value={tone.section || ''}
                                onChange={(e) => updateTone(tone.id, { section: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Confidence *
                              </label>
                              <select
                                value={tone.confidence || ''}
                                onChange={(e) => updateTone(tone.id, { confidence: e.target.value as any })}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                  hasErrors && !tone.confidence ? 'border-red-300' : 'border-gray-300'
                                }`}
                              >
                                <option value="">Select confidence</option>
                                <option value="HIGH">High</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="LOW">Low</option>
                              </select>
                            </div>
                          </div>

                          {/* Right column - Archetypes and settings */}
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Guitar Archetype *
                              </label>
                              <ArchetypeSelector
                                type="guitar"
                                value={tone.sourceGuitarArchetypeId}
                                onChange={(value) => updateTone(tone.id, { sourceGuitarArchetypeId: value })}
                                error={hasErrors && !tone.sourceGuitarArchetypeId}
                                hint={archetypeHint}
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Amp Archetype *
                              </label>
                              <ArchetypeSelector
                                type="amp"
                                value={tone.sourceAmpArchetypeId}
                                onChange={(value) => updateTone(tone.id, { sourceAmpArchetypeId: value })}
                                error={hasErrors && !tone.sourceAmpArchetypeId}
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Pickup Target (Original)
                              </label>
                              <input
                                type="text"
                                value={tone.pickupSelectorOriginal || ''}
                                onChange={(e) => updateTone(tone.id, { pickupSelectorOriginal: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., Bridge humbucker"
                              />
                            </div>

                            {/* Amp settings */}
                            <div className="grid grid-cols-2 gap-2">
                              {['gain', 'bass', 'mid', 'treble', 'presence', 'reverb', 'delay'].map((setting) => (
                                <div key={setting}>
                                  <label className="block text-xs font-medium text-gray-700 mb-1 capitalize">
                                    {setting}
                                  </label>
                                  <input
                                    type="text"
                                    value={tone[setting as keyof ParsedToneWithId] || ''}
                                    onChange={(e) => updateTone(tone.id, { [setting]: e.target.value })}
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder="0-10 or text"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Notes and sources */}
                        <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Notes
                            </label>
                            <textarea
                              value={tone.notes || ''}
                              onChange={(e) => updateTone(tone.id, { notes: e.target.value })}
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Sources
                            </label>
                            <textarea
                              value={tone.sources || ''}
                              onChange={(e) => updateTone(tone.id, { sources: e.target.value })}
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
