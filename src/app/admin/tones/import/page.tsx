'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ToneImporter } from '@/components/admin/ToneImporter'

export default function AdminTonesImportPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Import Tones from Research</h1>
          <p className="text-gray-600">Paste your research text to bulk-create tones with archetype mapping</p>
        </div>
        <div className="flex gap-4">
          <Link
            href="/admin/tones"
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Back to Tones
          </Link>
          <Link
            href="/admin"
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Admin Dashboard
          </Link>
        </div>
      </div>

      <ToneImporter />
    </div>
  )
}
