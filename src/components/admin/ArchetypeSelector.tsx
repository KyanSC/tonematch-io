'use client'

import { useState, useEffect } from 'react'

interface Archetype {
  id: string
  name: string
  brand?: string
  pickupLayout?: string
  topology?: string
  systemLocked?: boolean
}

interface ArchetypeSelectorProps {
  type: 'guitar' | 'amp'
  value?: string
  onChange: (value: string) => void
  error?: boolean
  hint?: string | null
}

export function ArchetypeSelector({ type, value, onChange, error, hint }: ArchetypeSelectorProps) {
  const [archetypes, setArchetypes] = useState<Archetype[]>([])
  const [filteredArchetypes, setFilteredArchetypes] = useState<Archetype[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchArchetypes()
  }, [type])

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredArchetypes(archetypes.filter(a => !a.systemLocked))
    } else {
      const filtered = archetypes.filter(archetype => {
        const searchLower = searchTerm.toLowerCase()
        return (
          !archetype.systemLocked &&
          (archetype.name.toLowerCase().includes(searchLower) ||
           (archetype.brand && archetype.brand.toLowerCase().includes(searchLower)) ||
           (archetype.pickupLayout && archetype.pickupLayout.toLowerCase().includes(searchLower)) ||
           (archetype.topology && archetype.topology.toLowerCase().includes(searchLower)))
        )
      })
      setFilteredArchetypes(filtered)
    }
  }, [searchTerm, archetypes])

  const fetchArchetypes = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/${type}-archetypes`)
      if (response.ok) {
        const data = await response.json()
        setArchetypes(data)
      }
    } catch (error) {
      console.error(`Error fetching ${type} archetypes:`, error)
    } finally {
      setIsLoading(false)
    }
  }

  const selectedArchetype = archetypes.find(a => a.id === value)

  const handleSelect = (archetype: Archetype) => {
    onChange(archetype.id)
    setIsOpen(false)
    setSearchTerm('')
  }

  const handleHintClick = () => {
    if (hint) {
      const matchingArchetype = archetypes.find(a => 
        a.name.toLowerCase().includes(hint.toLowerCase()) && !a.systemLocked
      )
      if (matchingArchetype) {
        onChange(matchingArchetype.id)
      }
    }
  }

  const getDisplayText = (archetype: Archetype) => {
    if (type === 'guitar') {
      return `${archetype.name}${archetype.pickupLayout ? ` (${archetype.pickupLayout})` : ''}`
    } else {
      return `${archetype.name}${archetype.topology ? ` (${archetype.topology})` : ''}`
    }
  }

  return (
    <div className="relative">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={selectedArchetype ? getDisplayText(selectedArchetype) : ''}
            onClick={() => setIsOpen(true)}
            readOnly
            placeholder={`Select ${type} archetype...`}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              error ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            ▼
          </button>
        </div>
        {hint && (
          <button
            type="button"
            onClick={handleHintClick}
            className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
            title={`Click to select: ${hint}`}
          >
            {hint}
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          <div className="p-2 border-b border-gray-200">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Search ${type} archetypes...`}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>
          
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">Loading...</div>
          ) : filteredArchetypes.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              {searchTerm ? 'No archetypes found' : 'No archetypes available'}
            </div>
          ) : (
            <div className="py-1">
              {filteredArchetypes.map((archetype) => (
                <button
                  key={archetype.id}
                  type="button"
                  onClick={() => handleSelect(archetype)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                >
                  <div className="font-medium">{archetype.name}</div>
                  <div className="text-sm text-gray-600">
                    {archetype.brand && `${archetype.brand} • `}
                    {type === 'guitar' ? archetype.pickupLayout : archetype.topology}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="mt-1 text-sm text-red-600">This field is required</p>
      )}
    </div>
  )
}
