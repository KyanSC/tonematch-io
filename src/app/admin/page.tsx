import Link from 'next/link'

export default function AdminPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/admin/guitars">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <h2 className="text-xl font-semibold mb-2">🎸 Manage Guitars</h2>
            <p className="text-gray-700">
              Add, edit, and delete guitars with detailed metadata including pickup types, 
              switch options, and control configurations.
            </p>
          </div>
        </Link>

        <Link href="/admin/amps">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <h2 className="text-xl font-semibold mb-2">🔊 Manage Amps</h2>
            <p className="text-gray-700">
              Add, edit, and delete amps with detailed metadata including amp families, 
              channels, knobs, and features.
            </p>
          </div>
        </Link>

        <Link href="/admin/tones">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <h2 className="text-xl font-semibold mb-2">🎵 Manage Tones</h2>
            <p className="text-gray-700">
              Add, edit, and delete tones with song associations, roles, sections, 
              and detailed intent configurations for tone matching.
            </p>
          </div>
        </Link>

        <Link href="/admin/guitar-archetypes">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <h2 className="text-xl font-semibold mb-2">🎸 Guitar Archetypes</h2>
            <p className="text-gray-700">
              Manage guitar archetypes for tone matching. Create and edit canonical 
              guitar types with pickup layouts and positions.
            </p>
          </div>
        </Link>

        <Link href="/admin/amp-archetypes">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <h2 className="text-xl font-semibold mb-2">🔊 Amp Archetypes</h2>
            <p className="text-gray-700">
              Manage amp archetypes for tone matching. Create and edit canonical 
              amp families with topologies and characteristics.
            </p>
          </div>
        </Link>
      </div>

      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-2">📋 Admin Features</h3>
        <ul className="list-disc list-inside text-gray-800 space-y-1">
          <li>Full CRUD operations for guitars, amps, and tones</li>
          <li>Detailed metadata fields for tone-relevant properties</li>
          <li>Validation for required fields and enum values</li>
          <li>JSON editors for complex configurations</li>
          <li>Multi-select interfaces for arrays</li>
          <li>Song associations and tone role management</li>
          <li>Backward compatibility with existing data</li>
        </ul>
      </div>
    </div>
  )
} 