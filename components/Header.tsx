'use client'

import React, { useState, useRef } from 'react'
import { Settings, Sparkles, Search, EyeOff, Eye } from 'lucide-react'
import { useAnonMode } from '@/contexts/AnonModeContext'

export default function Header() {
  const { anon, setAnon } = useAnonMode()
  const [showTooltip, setShowTooltip] = useState(false)
  const tooltipTimeoutRef = useRef<NodeJS.Timeout>()

  const handleMouseEnter = () => {
    tooltipTimeoutRef.current = setTimeout(() => {
      setShowTooltip(true)
    }, 500)
  }

  const handleMouseLeave = () => {
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current)
    }
    setShowTooltip(false)
  }

  return (
    <header className={`fixed right-0 left-0 h-16 glass-card rounded-none border-b border-white/10 px-6 flex items-center justify-between z-40 ${anon ? 'top-12' : 'top-0'} transition-all duration-200`}>
      {/* Left side - App name */}
      <div>
        <h1 className="text-xl font-bold text-white">Wikident</h1>
      </div>

      {/* Right side - Icons */}
      <div className="flex items-center gap-2">
        {/* Settings - Inactive */}
        <button
          className="p-2.5 min-w-[44px] min-h-[44px] rounded-lg text-white/40 cursor-not-allowed opacity-50 bg-white/[0.03]"
          disabled
          aria-label="Settings (inactive)"
          tabIndex={-1}
        >
          <Settings className="w-5 h-5" aria-hidden="true" />
        </button>

        {/* Wizard - Inactive */}
        <button
          className="p-2.5 min-w-[44px] min-h-[44px] rounded-lg text-white/40 cursor-not-allowed opacity-50 bg-white/[0.03]"
          disabled
          aria-label="Wizard (inactive)"
          tabIndex={-1}
        >
          <Sparkles className="w-5 h-5" aria-hidden="true" />
        </button>

        {/* Patient Search - Inactive */}
        <button
          className="p-2.5 min-w-[44px] min-h-[44px] rounded-lg text-white/40 cursor-not-allowed opacity-50 bg-white/[0.03]"
          disabled
          aria-label="Search patient (inactive)"
          tabIndex={-1}
        >
          <Search className="w-5 h-5" aria-hidden="true" />
        </button>

        {/* Anonymous Mode Toggle - Active */}
        <div className="relative flex items-center gap-2">
          {/* ANON Chip */}
          {anon && (
            <span className="px-2 py-1 text-xs font-bold bg-accent text-white rounded animate-pulse">
              ANON
            </span>
          )}

          <button
            className={`
              p-2.5 min-w-[44px] min-h-[44px] rounded-lg transition-all duration-200
              ${anon 
                ? 'bg-accent text-white shadow-sm shadow-accent/20' 
                : 'bg-white/10 text-white hover:bg-white/[0.15] border border-white/20'
              }
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background
            `}
            onClick={() => setAnon(!anon)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            aria-label={anon ? "Disable anonymous mode" : "Enable anonymous mode"}
            aria-pressed={anon}
            aria-describedby="anon-tooltip"
          >
            {anon ? (
              <EyeOff className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Eye className="w-5 h-5" aria-hidden="true" />
            )}
          </button>
          
          {/* Tooltip */}
          {showTooltip && (
            <div 
              id="anon-tooltip"
              className="tooltip top-full mt-2 right-0"
              role="tooltip"
            >
              <div className="text-center">
                <div>{anon ? 'Anonymous mode enabled' : 'Anonymous mode disabled'}</div>
                <div className="text-xs opacity-75 mt-1">Key: A</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}