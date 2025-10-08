'use client'

import React, { useRef, useEffect, useState } from 'react'
import { Play, Send, Clock, Eye, CheckCircle, MoreVertical, ListPlus } from 'lucide-react'
import { useAnonMode } from '@/contexts/AnonModeContext'

interface VideoCardProps {
  video: {
    id: string
    title: string
    description?: string
    duration: string
    views: number
    category: string
    thumbnail?: string
    sentCount: number
  }
  onPlay: () => void
  onSend: () => void
  isFocused: boolean
  onFocus: () => void
  index: number
  isCompact?: boolean
  onAddToPlaylist?: () => void
}

export default function VideoCard({ video, onPlay, onSend, isFocused, onFocus, index, isCompact = false, onAddToPlaylist }: VideoCardProps) {
  const { anon } = useAnonMode()
  const cardRef = useRef<HTMLDivElement>(null)
  const [showSendTooltip, setShowSendTooltip] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  useEffect(() => {
    if (isFocused && cardRef.current) {
      cardRef.current.focus()
    }
  }, [isFocused])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'p') {
      e.preventDefault()
      onPlay()
    } else if (e.key === 's' && !anon) {
      e.preventDefault()
      onSend()
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onPlay()
    }
  }

  const categoryColors: Record<string, string> = {
    education: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    prevention: 'bg-green-500/20 text-green-300 border-green-500/30',
    procedure: 'bg-red-500/20 text-red-300 border-red-500/30',
    pediatric: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    periodontics: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    cosmetic: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
    'special-care': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  }

  const categoryLabels: Record<string, string> = {
    education: 'Education',
    prevention: 'Prevention',
    procedure: 'Procedures',
    pediatric: 'Pediatric',
    periodontics: 'Periodontics',
    cosmetic: 'Cosmetic',
    'special-care': 'Special Care',
  }

  return (
    <div
      ref={cardRef}
      className={`
        glass-card group relative
        ${isCompact ? 'p-3' : 'p-4'}
        ${isFocused ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}
        transition-all duration-200 cursor-pointer
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background
        hover:bg-white/[0.08] hover:border-white/[0.15]
      `}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onClick={onPlay}
      onFocus={onFocus}
      role="article"
      aria-label={`Video: ${video.title}`}
    >
      {/* Top Controls */}
      <div className={`absolute ${isCompact ? 'top-1 right-1' : 'top-2 right-2'} z-10 flex items-center gap-2`}>
        {/* Sent Badge */}
        {video.sentCount > 0 && (
          <span className={`flex items-center gap-1 ${isCompact ? 'px-1.5 py-0.5' : 'px-2 py-1'} text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/30 rounded-full`}>
            <CheckCircle className="w-3 h-3" aria-hidden="true" />
            {!isCompact && <span>Sent</span>}
          </span>
        )}
        
        {/* Menu Button */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowMenu(!showMenu)
            }}
            className="p-1.5 rounded-lg hover:bg-white/10 bg-black/50 backdrop-blur-sm transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
            aria-label="Video options"
          >
            <MoreVertical className={`${isCompact ? 'w-4 h-4' : 'w-5 h-5'} text-white`} />
          </button>
          
          {showMenu && (
            <>
              {/* Backdrop to close menu */}
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowMenu(false)}
              />
              
              {/* Menu Dropdown */}
              <div className="absolute right-0 top-full mt-1 z-50 w-48 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    if (onAddToPlaylist) {
                      onAddToPlaylist()
                    }
                    setShowMenu(false)
                  }}
                  disabled={anon}
                  className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-100 flex items-center gap-3 ${
                    anon ? 'text-gray-400 cursor-not-allowed' : 'text-black'
                  }`}
                >
                  <ListPlus className="w-4 h-4" />
                  Add to playlist…
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Thumbnail */}
      <div className={`w-full ${isCompact ? 'h-36' : 'h-48'} bg-white/[0.03] rounded-xl ${isCompact ? 'mb-3' : 'mb-4'} relative overflow-hidden`}>
        {video.thumbnail ? (
          <img 
            src={video.thumbnail} 
            alt=""
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Play className={`${isCompact ? 'w-8 h-8' : 'w-12 h-12'} text-white/30`} aria-hidden="true" />
          </div>
        )}
        
        {/* Duration Badge */}
        <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 backdrop-blur-sm rounded-lg text-xs text-white">
          {video.duration}
        </div>
      </div>

      {/* Content */}
      <div className={`${isCompact ? 'space-y-2' : 'space-y-3'}`}>
        {/* Title */}
        <h3 className={`${isCompact ? 'text-sm' : 'text-lg'} font-medium text-white ${isCompact ? 'line-clamp-1' : 'line-clamp-2'}`}>
          {video.title}
        </h3>
        
        {/* Description (compact only) */}
        {isCompact && video.description && (
          <p className="text-xs text-white/60 line-clamp-1">
            {video.description}
          </p>
        )}

        {/* Category */}
        <div className="flex items-center gap-2">
          <span className={`
            inline-block ${isCompact ? 'px-2 py-0.5' : 'px-2.5 py-1'} text-xs font-medium rounded-full border
            ${categoryColors[video.category] || 'bg-white/10 text-white/80 border-white/20'}
          `}>
            {categoryLabels[video.category] || video.category}
          </span>
        </div>

        {/* Stats */}
        <div className={`flex items-center gap-3 ${isCompact ? 'text-xs' : 'text-sm'} text-white/60`}>
          <div className="flex items-center gap-1">
            <Eye className={`${isCompact ? 'w-3 h-3' : 'w-4 h-4'}`} aria-hidden="true" />
            <span>{video.views}x</span>
          </div>
          {video.sentCount > 0 && (
            <div className="flex items-center gap-1">
              <Send className={`${isCompact ? 'w-3 h-3' : 'w-4 h-4'}`} aria-hidden="true" />
              <span>{video.sentCount}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className={`flex items-center gap-2 ${isCompact ? 'pt-1' : 'pt-2'}`}>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onPlay()
            }}
            className={`btn-primary flex-1 flex items-center justify-center gap-2 min-h-[44px] ${isCompact ? 'text-xs' : ''}`}
            aria-label={`Play video ${video.title}`}
          >
            <Play className={`${isCompact ? 'w-3 h-3' : 'w-4 h-4'}`} aria-hidden="true" />
            <span className={isCompact ? 'sr-only' : ''}>Play</span>
          </button>
          
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation()
                if (!anon) onSend()
              }}
              onMouseEnter={() => anon && setShowSendTooltip(true)}
              onMouseLeave={() => setShowSendTooltip(false)}
              onFocus={() => anon && setShowSendTooltip(true)}
              onBlur={() => setShowSendTooltip(false)}
              disabled={anon}
              className={`
                btn-secondary flex items-center justify-center gap-2 ${isCompact ? 'px-3' : 'px-4'} min-h-[44px] ${isCompact ? 'text-xs' : ''}
                ${anon ? 'opacity-40 cursor-not-allowed' : ''}
              `}
              aria-label={anon ? 'Sending disabled while Anonymous Mode is active' : `Send video ${video.title}`}
            >
              <Send className={`${isCompact ? 'w-3 h-3' : 'w-4 h-4'}`} aria-hidden="true" />
              <span className={isCompact ? 'sr-only' : ''}>Send</span>
            </button>
            
            {/* Tooltip for anonymous mode */}
            {showSendTooltip && anon && (
              <div className="absolute bottom-full mb-2 right-0 z-20 px-3 py-2 text-xs bg-gray-900/95 backdrop-blur-sm text-white rounded-lg shadow-xl pointer-events-none whitespace-nowrap">
                Disabled while Anonymous Mode is active
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}