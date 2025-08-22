'use client'

import { useState } from 'react'
import { ParsedTone } from './ToneImporter'

interface ResearchParserProps {
  onParseComplete: (tones: ParsedTone[]) => void
}

export function ResearchParser({ onParseComplete }: ResearchParserProps) {
  const [researchText, setResearchText] = useState('')
  const [isParsing, setIsParsing] = useState(false)
  const [parseError, setParseError] = useState<string | null>(null)

  const parseResearchText = (text: string): ParsedTone[] => {
    const tones: ParsedTone[] = []
    const lines = text.split('\n')
    
    let currentSong: { title: string; artist: string; year?: number } | null = null
    let currentTone: Partial<ParsedTone> | null = null
    let inToneSettings = false
    let inNotes = false
    let inSources = false
    let notesLines: string[] = []
    let sourcesLines: string[] = []

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      
      // Skip empty lines
      if (!line) {
        // If we were in notes/sources, end them
        if (inNotes) {
          if (currentTone) {
            currentTone.notes = notesLines.join('\n').trim()
            notesLines = []
            inNotes = false
          }
        }
        if (inSources) {
          if (currentTone) {
            currentTone.sources = sourcesLines.join('\n').trim()
            sourcesLines = []
            inSources = false
          }
        }
        continue
      }

      // Check for song header: "Title — Artist (Year)"
      const songMatch = line.match(/^(.+?)\s*—\s*(.+?)\s*\((\d{4})\)$/)
      if (songMatch) {
        // Save previous tone if exists
        if (currentTone && currentSong) {
          const tone = finalizeTone(currentTone, currentSong)
          if (tone) tones.push(tone)
        }
        
        currentSong = {
          title: songMatch[1].trim(),
          artist: songMatch[2].trim(),
          year: parseInt(songMatch[3])
        }
        currentTone = null
        inToneSettings = false
        inNotes = false
        inSources = false
        continue
      }

      // Check for tone name
      if (line.toLowerCase().startsWith('tone name:')) {
        // Save previous tone if exists
        if (currentTone && currentSong) {
          const tone = finalizeTone(currentTone, currentSong)
          if (tone) tones.push(tone)
        }
        
        const toneName = line.substring('tone name:'.length).trim()
        currentTone = {
          name: toneName,
          slug: generateSlug(toneName),
          confidence: 'MEDIUM' as const
        }
        inToneSettings = false
        inNotes = false
        inSources = false
        continue
      }

      if (!currentTone || !currentSong) continue

      // Parse tone fields
      const lowerLine = line.toLowerCase()
      
      if (lowerLine.startsWith('slug:')) {
        currentTone.slug = line.substring('slug:'.length).trim()
      } else if (lowerLine.startsWith('guitarist:')) {
        currentTone.guitarist = line.substring('guitarist:'.length).trim()
      } else if (lowerLine.startsWith('role:')) {
        const roleText = line.substring('role:'.length).trim()
        currentTone.role = parseRole(roleText)
      } else if (lowerLine.startsWith('section:')) {
        currentTone.section = line.substring('section:'.length).trim()
      } else if (lowerLine.startsWith('tone settings:')) {
        inToneSettings = true
        inNotes = false
        inSources = false
      } else if (lowerLine.startsWith('notes:')) {
        inToneSettings = false
        inNotes = true
        inSources = false
        notesLines = []
      } else if (lowerLine.startsWith('sources:')) {
        inToneSettings = false
        inNotes = false
        inSources = true
        sourcesLines = []
      } else if (inToneSettings) {
        // Parse tone settings
        if (lowerLine.startsWith('pickup target:')) {
          currentTone.pickupSelectorOriginal = line.substring('pickup target:'.length).trim()
        } else if (lowerLine.startsWith('gain:')) {
          currentTone.gain = parseValue(line.substring('gain:'.length).trim())
        } else if (lowerLine.startsWith('bass:')) {
          currentTone.bass = parseValue(line.substring('bass:'.length).trim())
        } else if (lowerLine.startsWith('mid:')) {
          currentTone.mid = parseValue(line.substring('mid:'.length).trim())
        } else if (lowerLine.startsWith('treble:')) {
          currentTone.treble = parseValue(line.substring('treble:'.length).trim())
        } else if (lowerLine.startsWith('presence:')) {
          currentTone.presence = parseValue(line.substring('presence:'.length).trim())
        } else if (lowerLine.startsWith('reverb:')) {
          currentTone.reverb = parseValue(line.substring('reverb:'.length).trim())
        } else if (lowerLine.startsWith('delay:')) {
          currentTone.delay = parseValue(line.substring('delay:'.length).trim())
        }
      } else if (inNotes) {
        // Check for confidence in notes
        const confidenceMatch = line.match(/confidence:\s*(high|medium|low)/i)
        if (confidenceMatch) {
          currentTone.confidence = confidenceMatch[1].toUpperCase() as 'HIGH' | 'MEDIUM' | 'LOW'
        } else {
          notesLines.push(line)
        }
      } else if (inSources) {
        sourcesLines.push(line)
      }
    }

    // Save final tone
    if (currentTone && currentSong) {
      const tone = finalizeTone(currentTone, currentSong)
      if (tone) tones.push(tone)
    }

    return tones
  }

  const finalizeTone = (tone: Partial<ParsedTone>, song: { title: string; artist: string; year?: number }): ParsedTone | null => {
    if (!tone.name) return null

    return {
      song,
      name: tone.name,
      slug: tone.slug || generateSlug(tone.name),
      guitarist: tone.guitarist,
      role: tone.role,
      section: tone.section,
      pickupSelectorOriginal: tone.pickupSelectorOriginal,
      gain: tone.gain,
      bass: tone.bass,
      mid: tone.mid,
      treble: tone.treble,
      presence: tone.presence,
      reverb: tone.reverb,
      delay: tone.delay,
      notes: tone.notes,
      confidence: tone.confidence || 'MEDIUM',
      sources: tone.sources
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

  const parseRole = (roleText: string): 'CLEAN' | 'RHYTHM' | 'CRUNCH' | 'LEAD' | 'SOLO' | undefined => {
    const lower = roleText.toLowerCase()
    if (lower.includes('clean')) return 'CLEAN'
    if (lower.includes('rhythm')) return 'RHYTHM'
    if (lower.includes('crunch')) return 'CRUNCH'
    if (lower.includes('lead')) return 'LEAD'
    if (lower.includes('solo')) return 'SOLO'
    return undefined
  }

  const parseValue = (value: string): string | number => {
    const trimmed = value.trim()
    if (trimmed === 'off' || trimmed === 'n/a') return trimmed
    const num = parseFloat(trimmed)
    return isNaN(num) ? trimmed : num
  }

  const handleParse = async () => {
    if (!researchText.trim()) {
      setParseError('Please paste some research text to parse')
      return
    }

    setIsParsing(true)
    setParseError(null)

    try {
      const tones = parseResearchText(researchText)
      
      if (tones.length === 0) {
        setParseError('No tones found in the research text. Please check the format.')
        return
      }

      onParseComplete(tones)
    } catch (error) {
      setParseError('Error parsing research text. Please check the format and try again.')
      console.error('Parse error:', error)
    } finally {
      setIsParsing(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Step 1: Paste Research Text</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Research Text
            </label>
            <textarea
              value={researchText}
              onChange={(e) => setResearchText(e.target.value)}
              placeholder="Paste your research text here..."
              className="w-full h-96 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            />
          </div>

          {parseError && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-800">{parseError}</p>
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={handleParse}
              disabled={isParsing || !researchText.trim()}
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isParsing ? 'Parsing...' : 'Parse Research'}
            </button>
          </div>
        </div>

        <div className="mt-6 bg-gray-50 rounded-md p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Expected Format:</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p>• Song Title — Artist (Year)</p>
            <p>• Tone Name: [name]</p>
            <p>• Slug: [slug] (optional, auto-generated)</p>
            <p>• Guitarist: [name]</p>
            <p>• Role: [CLEAN/RHYTHM/CRUNCH/LEAD/SOLO]</p>
            <p>• Section: [description]</p>
            <p>• Tone Settings: (followed by gain, bass, mid, treble, etc.)</p>
            <p>• Notes: [description]</p>
            <p>• Sources: [list of sources]</p>
          </div>
        </div>
      </div>
    </div>
  )
}
