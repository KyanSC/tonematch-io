'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import SongSearch from '@/components/SongSearch'
import { UserGear, Song } from '@/lib/types'

export default function SearchPage() {
  const [userGear, setUserGear] = useState<UserGear>({})
  const [popularSongs, setPopularSongs] = useState<Song[]>([])

  useEffect(() => {
    // Load user gear from localStorage
    const saved = localStorage.getItem('userGear')
    if (saved) {
      try {
        const gear = JSON.parse(saved)
        setUserGear(gear)
      } catch (error) {
        console.error('Error loading user gear:', error)
      }
    }

    // Fetch popular songs
    const fetchPopularSongs = async () => {
      try {
        const response = await fetch('/api/songs?limit=6')
        const songs = await response.json()
        setPopularSongs(songs)
      } catch (error) {
        console.error('Error fetching popular songs:', error)
      }
    }

    fetchPopularSongs()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Find Your Song</h1>
              <p className="text-gray-600">Search for songs to get personalized tone settings</p>
            </div>
            <Link
              href="/gear"
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Change Gear
            </Link>
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

        {/* Search Component */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <SongSearch />
        </div>

        {/* Popular Songs */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Songs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularSongs.map((song) => (
              <Link
                key={song.id}
                href={`/tone/${song.id}`}
                className="block bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
              >
                <h3 className="font-semibold text-gray-900">{song.title}</h3>
                <p className="text-gray-600 text-sm">{song.artist}</p>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    {song.tones?.length || 0} tone{(song.tones?.length || 0) !== 1 ? 's' : ''} available
                  </span>
                  <span className="text-blue-600 text-sm font-medium">View →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="mt-12 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Search Tips</h3>
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Try searching by song title or artist name</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Use genre filters to find specific styles</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Filter by decade to find songs from specific eras</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Each song has multiple tones for different sections</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
} 