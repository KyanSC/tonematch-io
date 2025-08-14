'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import ToneDisplay from '@/components/ToneDisplay'
import { Song, Tone, UserGear } from '@/lib/types'

export default function TonePage() {
  const params = useParams()
  const router = useRouter()
  const [song, setSong] = useState<Song | null>(null)
  const [userGear, setUserGear] = useState<UserGear>({})
  const [loading, setLoading] = useState(true)
  const [selectedTone, setSelectedTone] = useState<Tone | null>(null)

  const fetchSongData = useCallback(async () => {
    try {
      const response = await fetch(`/api/tones?songId=${params.songId}`)
      const data = await response.json()
      setSong(data)
      
      // Select the first tone by default
      if (data.tones && data.tones.length > 0) {
        setSelectedTone(data.tones[0])
      }
    } catch (error) {
      console.error('Error fetching song data:', error)
    } finally {
      setLoading(false)
    }
  }, [params.songId])

  useEffect(() => {
    fetchSongData()
    loadUserGear()
  }, [fetchSongData])

  const loadUserGear = () => {
    const saved = localStorage.getItem('userGear')
    if (saved) {
      try {
        const gear = JSON.parse(saved)
        setUserGear(gear)
      } catch (error) {
        console.error('Error loading user gear:', error)
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading song data...</p>
        </div>
      </div>
    )
  }

  if (!song) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Song Not Found</h1>
                      <p className="text-gray-600 mb-6">The song you&apos;re looking for doesn&apos;t exist.</p>
          <button
            onClick={() => router.push('/search')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Search
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <button
                onClick={() => router.push('/search')}
                className="text-blue-600 hover:text-blue-800 mb-4 flex items-center gap-2"
              >
                ← Back to Search
              </button>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{song.title}</h1>
              <p className="text-xl text-gray-600 mb-4">{song.artist}</p>
              <div className="flex gap-2">
                {song.genre && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                    {song.genre}
                  </span>
                )}
                {song.year && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {song.year}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => router.push('/gear')}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Change Gear
            </button>
          </div>

          {/* Current Gear Display */}
          {userGear.guitar && userGear.amp && (
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Your Current Gear</h3>
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Guitar:</span>
                  <span className="font-medium text-gray-900">
                    {userGear.guitar.brand} {userGear.guitar.model}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Amp:</span>
                  <span className="font-medium text-gray-900">
                    {userGear.amp.brand} {userGear.amp.model}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tones List */}
        {song.tones && song.tones.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Tones Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Available Tones</h2>
                <div className="space-y-2">
                  {song.tones.map((tone) => (
                    <button
                      key={tone.id}
                      onClick={() => setSelectedTone(tone)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedTone?.id === tone.id
                          ? 'bg-blue-100 border-blue-500 border'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-900">{tone.name}</h3>
                          <p className="text-sm text-gray-600">{tone.description}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          tone.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                          tone.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {tone.difficulty}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Selected Tone Display */}
            <div className="lg:col-span-2">
              {selectedTone ? (
                <ToneDisplay tone={selectedTone} userGear={userGear} />
              ) : (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <p className="text-gray-600">Select a tone to view settings</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* No Tones Available */}
        {(!song.tones || song.tones.length === 0) && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">No tone added yet</h2>
            <p className="text-gray-600 mb-6">
              We haven&apos;t added any tone settings for this song yet. Check back later or try another song!
            </p>
            <button
              onClick={() => router.push('/search')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Find Another Song
            </button>
          </div>
        )}
      </div>
    </div>
  )
} 