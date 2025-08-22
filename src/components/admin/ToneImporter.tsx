'use client'

import { useState } from 'react'
import { ResearchParser } from './ResearchParser'
import { TonePreview } from './TonePreview'
import { CreateSummary } from './CreateSummary'

export type ParsedTone = {
  song: { title: string; artist: string; year?: number }
  name: string
  slug: string
  guitarist?: string
  role?: 'CLEAN' | 'RHYTHM' | 'CRUNCH' | 'LEAD' | 'SOLO'
  section?: string
  // Original guitar settings
  pickupSelectorOriginal?: string
  // Original amp settings
  gain?: string | number
  bass?: string | number
  mid?: string | number
  treble?: string | number
  presence?: string | number
  reverb?: string | number
  delay?: string | number
  // Meta
  notes?: string
  confidence: 'HIGH' | 'MEDIUM' | 'LOW'
  sources?: string
  // Archetype selections (initially empty)
  sourceGuitarArchetypeId?: string
  sourceAmpArchetypeId?: string
}

export type ParsedToneWithId = ParsedTone & {
  id: string // Temporary ID for UI management
}

export function ToneImporter() {
  const [step, setStep] = useState<'parse' | 'preview' | 'create'>('parse')
  const [parsedTones, setParsedTones] = useState<ParsedToneWithId[]>([])
  const [createdTones, setCreatedTones] = useState<any[]>([])

  const handleParseComplete = (tones: ParsedTone[]) => {
    // Add temporary IDs for UI management
    const tonesWithIds = tones.map((tone, index) => ({
      ...tone,
      id: `temp-${index}`
    }))
    setParsedTones(tonesWithIds)
    setStep('preview')
  }

  const handlePreviewComplete = (updatedTones: ParsedToneWithId[]) => {
    setParsedTones(updatedTones)
    setStep('create')
  }

  const handleCreateComplete = (results: any[]) => {
    setCreatedTones(results)
    setStep('create')
  }

  const reset = () => {
    setParsedTones([])
    setCreatedTones([])
    setStep('parse')
  }

  return (
    <div className="space-y-6">
      {/* Step indicator */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-4">
          <div className={`flex items-center ${step === 'parse' ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
              step === 'parse' ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'
            }`}>
              1
            </div>
            <span className="ml-2 font-medium">Parse Research</span>
          </div>
          <div className="w-8 h-1 bg-gray-300"></div>
          <div className={`flex items-center ${step === 'preview' ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
              step === 'preview' ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'
            }`}>
              2
            </div>
            <span className="ml-2 font-medium">Preview & Map</span>
          </div>
          <div className="w-8 h-1 bg-gray-300"></div>
          <div className={`flex items-center ${step === 'create' ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
              step === 'create' ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'
            }`}>
              3
            </div>
            <span className="ml-2 font-medium">Create Tones</span>
          </div>
        </div>
      </div>

      {/* Step content */}
      {step === 'parse' && (
        <ResearchParser onParseComplete={handleParseComplete} />
      )}

      {step === 'preview' && (
        <TonePreview 
          tones={parsedTones}
          onComplete={handlePreviewComplete}
          onBack={() => setStep('parse')}
        />
      )}

      {step === 'create' && (
        <CreateSummary 
          tones={parsedTones}
          createdTones={createdTones}
          onComplete={handleCreateComplete}
          onBack={() => setStep('preview')}
          onReset={reset}
        />
      )}
    </div>
  )
}
