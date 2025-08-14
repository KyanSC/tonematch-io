'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import GearSelector from '@/components/GearSelector'
import { UserGear } from '@/lib/types'

export default function GearPage() {
  const [userGear, setUserGear] = useState<UserGear>({})
  const [savedGear, setSavedGear] = useState<UserGear>({})
  const router = useRouter()

  useEffect(() => {
    // Load saved gear from localStorage
    const saved = localStorage.getItem('userGear')
    if (saved) {
      try {
        const gear = JSON.parse(saved)
        setSavedGear(gear)
      } catch (error) {
        console.error('Error loading saved gear:', error)
      }
    }
  }, [])

  const handleGearChange = useCallback((gear: UserGear) => {
    setUserGear(gear)
  }, [])

  const handleContinue = () => {
    if (userGear.guitar && userGear.amp) {
      router.push('/search')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to ToneMatch.io
          </h1>
          <p className="text-xl text-gray-600">
            Replicate the tones of your favorite songs with your own gear
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <GearSelector
            onGearChange={handleGearChange}
            initialGear={savedGear}
          />

          <div className="mt-8 text-center">
            <button
              onClick={handleContinue}
              disabled={!userGear.guitar || !userGear.amp}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Continue to Song Search
            </button>
          </div>

          {(!userGear.guitar || !userGear.amp) && (
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-500">
                Please select both a guitar and amp to continue
              </p>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Find Your Song</h3>
            <p className="text-gray-600">Search through thousands of songs to find the perfect tone</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Get Perfect Settings</h3>
            <p className="text-gray-600">Receive optimized settings tailored to your specific gear</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Play Like the Pros</h3>
            <p className="text-gray-600">Replicate the iconic tones from your favorite recordings</p>
          </div>
        </div>
      </div>
    </div>
  )
} 