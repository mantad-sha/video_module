'use client'

import React from 'react'
import { X } from 'lucide-react'
import { useAnonMode } from '@/contexts/AnonModeContext'

export default function AnonBanner() {
  const { anon, setAnon } = useAnonMode()

  if (!anon) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-accent/95 backdrop-blur-xl border-b border-accent/30">
      <div className="px-6 py-3 flex items-center justify-between">
        <p className="text-sm font-medium text-white">
          Anonymous mode is active – personal data is hidden.
        </p>
        <button
          onClick={() => setAnon(false)}
          className="px-3 py-1.5 min-h-[32px] min-w-[80px] text-sm font-medium text-white bg-white/20 hover:bg-white/30 rounded-lg transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-accent"
          aria-label="Disable anonymous mode"
        >
          Disable
        </button>
      </div>
    </div>
  )
}