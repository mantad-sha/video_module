'use client'

import React from 'react'
import { LayoutGrid, LayoutList } from 'lucide-react'

interface DensityToggleProps {
  density: 'comfortable' | 'compact'
  onChange: (density: 'comfortable' | 'compact') => void
}

export default function DensityToggle({ density, onChange }: DensityToggleProps) {
  return (
    <div className="flex items-center gap-1 p-1 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
      <button
        onClick={() => onChange('comfortable')}
        className={`
          flex items-center gap-2 px-3 py-1.5 rounded-md transition-all duration-200
          min-h-[44px] min-w-[44px]
          ${density === 'comfortable'
            ? 'bg-white/10 text-white shadow-sm'
            : 'text-white/60 hover:text-white hover:bg-white/5'
          }
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background
        `}
        aria-label="Comfortable view"
        aria-pressed={density === 'comfortable'}
        role="button"
      >
        <LayoutGrid className="w-4 h-4" aria-hidden="true" />
        <span className="text-sm hidden sm:inline">Comfortable</span>
      </button>
      
      <button
        onClick={() => onChange('compact')}
        className={`
          flex items-center gap-2 px-3 py-1.5 rounded-md transition-all duration-200
          min-h-[44px] min-w-[44px]
          ${density === 'compact'
            ? 'bg-white/10 text-white shadow-sm'
            : 'text-white/60 hover:text-white hover:bg-white/5'
          }
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background
        `}
        aria-label="Compact view"
        aria-pressed={density === 'compact'}
        role="button"
      >
        <LayoutList className="w-4 h-4" aria-hidden="true" />
        <span className="text-sm hidden sm:inline">Compact</span>
      </button>
    </div>
  )
}
