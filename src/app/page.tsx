'use client'

import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Replicate Guitar Tones
              <br />
              <span className="text-blue-200">Like a Pro</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Input your guitar and amp, search for your favorite songs, and get optimized settings 
              tailored to your specific equipment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push('/gear')}
                className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold text-lg hover:bg-blue-50 hover:shadow-lg hover:scale-105 transition-all duration-200 border-2 border-transparent hover:border-blue-200"
              >
                Get Started
              </button>
              <button
                onClick={() => router.push('/search')}
                className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 hover:shadow-lg hover:scale-105 transition-all duration-200"
              >
                Browse Songs
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Three simple steps to get the perfect tone for any song
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Select Your Gear</h3>
              <p className="text-gray-600">
                Choose your guitar and amplifier from our extensive database of popular gear.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Find Your Song</h3>
              <p className="text-gray-600">
                Search through thousands of songs and find the perfect tone you want to replicate.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Get Perfect Settings</h3>
              <p className="text-gray-600">
                Receive optimized amp and guitar settings tailored specifically to your gear.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">20+</div>
              <div className="text-gray-600">Popular Songs</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">50+</div>
              <div className="text-gray-600">Tone Settings</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">10</div>
              <div className="text-gray-600">Guitar Models</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">10</div>
              <div className="text-gray-600">Amp Models</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Find Your Perfect Tone?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of guitarists who are already using ToneMatch.io to replicate 
            their favorite song tones.
          </p>
          <button
            onClick={() => router.push('/gear')}
            className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            Start Matching Tones
          </button>
        </div>
      </div>
    </div>
  )
}
