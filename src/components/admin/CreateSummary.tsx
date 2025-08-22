'use client'

import { useState } from 'react'
import { ParsedToneWithId } from './ToneImporter'
import Link from 'next/link'

interface CreateSummaryProps {
  tones: ParsedToneWithId[]
  createdTones: any[]
  onComplete: (results: any[]) => void
  onBack: () => void
  onReset: () => void
}

export function CreateSummary({ tones, createdTones, onComplete, onBack, onReset }: CreateSummaryProps) {
  const [isCreating, setIsCreating] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)
  const [createResults, setCreateResults] = useState<any[]>([])

  const handleCreateTones = async () => {
    setIsCreating(true)
    setCreateError(null)

    try {
      const response = await fetch('/api/admin/tones/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tones }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create tones')
      }

      const results = await response.json()
      setCreateResults(results.createdTones || [])
      onComplete(results.createdTones || [])
    } catch (error) {
      setCreateError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsCreating(false)
    }
  }

  // Group tones by song for summary
  const tonesBySong = tones.reduce((acc, tone) => {
    const songKey = `${tone.song.title} — ${tone.song.artist}`
    if (!acc[songKey]) {
      acc[songKey] = []
    }
    acc[songKey].push(tone)
    return acc
  }, {} as Record<string, ParsedToneWithId[]>)

  const uniqueSongs = Object.keys(tonesBySong).length

  if (createResults.length > 0) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Tones Created Successfully!</h2>
            <p className="text-gray-600 mb-6">
              Created {createResults.length} tones across {uniqueSongs} songs
            </p>
          </div>

          <div className="space-y-4">
            {createResults.map((tone) => (
              <div key={tone.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">{tone.name}</h3>
                    <p className="text-sm text-gray-600">
                      {tone.song?.title} — {tone.song?.artist}
                    </p>
                    <p className="text-xs text-gray-500">
                      Guitar: {tone.sourceGuitarArchetype?.name} • Amp: {tone.sourceAmpArchetype?.name}
                    </p>
                  </div>
                  <Link
                    href={`/admin/tones/${tone.id}`}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={onReset}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Import More Tones
            </button>
            <Link
              href="/admin/tones"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              View All Tones
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Step 3: Create Tones</h2>
          <div className="flex gap-2">
            <button
              onClick={onBack}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={handleCreateTones}
              disabled={isCreating}
              className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating ? 'Creating...' : `Create ${tones.length} Tones`}
            </button>
          </div>
        </div>

        {createError && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800">{createError}</p>
          </div>
        )}

        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-md p-4">
          <h3 className="text-blue-800 font-medium mb-2">Summary</h3>
          <div className="text-blue-700 text-sm space-y-1">
            <p>• {tones.length} tones will be created</p>
            <p>• {uniqueSongs} songs will be created or found</p>
            <p>• All tones have required archetypes selected</p>
            <p>• Original settings and notes will be preserved</p>
          </div>
        </div>

        {/* Preview of what will be created */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Preview</h3>
          
          {Object.entries(tonesBySong).map(([songKey, songTones]) => {
            const firstTone = songTones[0]
            return (
              <div key={songKey} className="border border-gray-200 rounded-lg p-4">
                <div className="mb-3">
                  <h4 className="font-medium text-gray-900">{firstTone.song.title}</h4>
                  <p className="text-sm text-gray-600">{firstTone.song.artist} ({firstTone.song.year})</p>
                </div>
                
                <div className="space-y-2">
                  {songTones.map((tone) => (
                    <div key={tone.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{tone.name}</div>
                        <div className="text-sm text-gray-600">
                          {tone.guitarist && `${tone.guitarist} • `}
                          {tone.role} • {tone.confidence} confidence
                        </div>
                        <div className="text-xs text-gray-500">
                          Guitar: {tones.find(t => t.id === tone.id)?.sourceGuitarArchetypeId ? 'Selected' : 'Missing'} • 
                          Amp: {tones.find(t => t.id === tone.id)?.sourceAmpArchetypeId ? 'Selected' : 'Missing'}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Ready
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <h3 className="text-yellow-800 font-medium mb-2">What happens next?</h3>
          <div className="text-yellow-700 text-sm space-y-1">
            <p>• Songs will be created if they don't exist (or found if they do)</p>
            <p>• Tones will be created with all the settings you've configured</p>
            <p>• Original guitar/amp settings will be stored as recorded values</p>
            <p>• You'll be able to view and edit all created tones in the admin</p>
          </div>
        </div>
      </div>
    </div>
  )
}
