'use client'

import { useState, useEffect, useCallback } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { Song } from '@/lib/types'
import Link from 'next/link'

interface SongSearchProps {
  onSongSelect?: (song: Song) => void
}

export default function SongSearch({ onSongSelect }: SongSearchProps) {
  const [search, setSearch] = useState('')
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedGenre, setSelectedGenre] = useState('')
  const [selectedDecade, setSelectedDecade] = useState('')

  const genres = ['Rock', 'Hard Rock', 'Heavy Metal', 'Alternative Rock', 'Britpop', 'Progressive Rock', 'Southern Rock', 'Rock and Roll', 'Grunge']
  const decades = ['1950s', '1960s', '1970s', '1980s', '1990s']

  // Debounced search
  const debouncedSearch = useCallback(
    (() => {
      let timeout: NodeJS.Timeout
      return (searchTerm: string, genre: string, decade: string) => {
        clearTimeout(timeout)
        timeout = setTimeout(async () => {
          if (!searchTerm && !genre && !decade) {
            setSongs([])
            return
          }

          setLoading(true)
          try {
            const params = new URLSearchParams()
            if (searchTerm) params.append('search', searchTerm)
            if (genre) params.append('genre', genre)
            if (decade) params.append('decade', decade)

            const response = await fetch(`/api/songs?${params}`)
            const data = await response.json()
            setSongs(data)
          } catch (error) {
            console.error('Error searching songs:', error)
          } finally {
            setLoading(false)
          }
        }, 300)
      }
    })(),
    []
  )

  useEffect(() => {
    debouncedSearch(search, selectedGenre, selectedDecade)
  }, [search, selectedGenre, selectedDecade, debouncedSearch])

  const clearFilters = () => {
    setSearch('')
    setSelectedGenre('')
    setSelectedDecade('')
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Find Your Song</h2>
        <p className="text-gray-600">Search for songs to get tone settings</p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search songs or artists..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Genre
          </label>
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Genres</option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Decade
          </label>
          <select
            value={selectedDecade}
            onChange={(e) => setSelectedDecade(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Decades</option>
            {decades.map((decade) => (
              <option key={decade} value={decade}>
                {decade}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Clear Filters */}
      {(search || selectedGenre || selectedDecade) && (
        <div className="text-center">
          <button
            onClick={clearFilters}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Results */}
      <div className="space-y-4">
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Searching...</p>
          </div>
        )}

        {!loading && songs.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Found {songs.length} song{songs.length !== 1 ? 's' : ''}
            </p>
            {songs.map((song) => (
              <Link
                key={song.id}
                href={`/tone/${song.id}`}
                className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">{song.title}</h3>
                    <p className="text-gray-600">{song.artist}</p>
                    <div className="flex gap-2 mt-1">
                      {song.genre && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {song.genre}
                        </span>
                      )}
                      {song.year && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {song.year}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-gray-500">
                      {song.tones?.length || 0} tone{song.tones?.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && search && songs.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600">No songs found matching your search.</p>
            <p className="text-sm text-gray-500 mt-1">Try adjusting your search terms or filters.</p>
          </div>
        )}
      </div>
    </div>
  )
} 