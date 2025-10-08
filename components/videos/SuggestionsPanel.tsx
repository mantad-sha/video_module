'use client'

import React, { useState } from 'react'
import { Lightbulb, Send, Video, ListVideo, ChevronDown } from 'lucide-react'
import Select, { SelectOption } from '@/components/Select'
import { appointmentTypes, appointmentSuggestions, videoMetadata, playlistMetadata } from '@/data/suggestions'
import { useAnonMode } from '@/contexts/AnonModeContext'
import { useToast } from '@/contexts/ToastContext'

interface SuggestionsPanelProps {
  onSendVideo: (video: { id: string; title: string }) => void
  onSendPlaylist?: (playlistId: string) => void
}

export default function SuggestionsPanel({ onSendVideo, onSendPlaylist }: SuggestionsPanelProps) {
  const { anon } = useAnonMode()
  const { showToast } = useToast()
  const [selectedType, setSelectedType] = useState<string>('')
  const [isExpanded, setIsExpanded] = useState(false)

  const suggestions = selectedType ? appointmentSuggestions[selectedType] : null

  // Convert appointment types to SelectOption format
  const visitTypeOptions: SelectOption[] = [
    { value: '', label: 'Choose a visit type...', disabled: true },
    ...appointmentTypes.map(type => ({
      value: type.id,
      label: type.label
    }))
  ]

  const handleSendVideo = (videoId: string) => {
    const video = videoMetadata[videoId]
    if (video) {
      onSendVideo({ id: videoId, title: video.title })
    }
  }

  const handleSendPlaylist = (playlistId: string) => {
    if (onSendPlaylist) {
      onSendPlaylist(playlistId)
    } else {
      showToast('Playlist sending coming soon', 'info')
    }
  }

  return (
    <div className="glass-card overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center">
            <Lightbulb className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-left">
            <h3 className="text-sm font-medium">Smart Suggestions</h3>
            <p className="text-xs text-muted-foreground">
              Get video recommendations by visit type
            </p>
          </div>
        </div>
        <ChevronDown 
          className={`w-5 h-5 text-muted-foreground transition-transform ${
            isExpanded ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="p-4 pt-0 border-t border-white/10">
          {/* Visit Type Selector */}
          <div className="mb-4">
            <label htmlFor="visit-type" className="block text-xs font-medium mb-2">
              Select visit type
            </label>
            <Select
              id="visit-type"
              value={selectedType}
              onChange={setSelectedType}
              options={visitTypeOptions}
              placeholder="Choose a visit type..."
              disabled={anon}
              aria-label="Select visit type for suggestions"
              className="text-sm"
            />
            {anon && (
              <p className="text-xs text-yellow-400 mt-1">
                Patient-specific suggestions disabled in Anonymous Mode
              </p>
            )}
          </div>

          {/* Suggestions */}
          {suggestions && (
            <div className="space-y-4">
              {/* Recommended Videos */}
              {suggestions.videos && suggestions.videos.length > 0 && (
                <div>
                  <h4 className="text-xs font-medium text-white/80 mb-2 flex items-center gap-2">
                    <Video className="w-3 h-3" />
                    Recommended Videos
                  </h4>
                  <div className="space-y-2">
                    {suggestions.videos.map(videoId => {
                      const video = videoMetadata[videoId]
                      if (!video) return null
                      return (
                        <div
                          key={videoId}
                          className="flex items-center justify-between p-2 bg-white/5 rounded-lg"
                        >
                          <div className="flex-1">
                            <p className="text-sm">{video.title}</p>
                            <p className="text-xs text-muted-foreground">{video.duration}</p>
                          </div>
                          <button
                            onClick={() => handleSendVideo(videoId)}
                            disabled={anon}
                            className={`p-1.5 rounded-lg bg-primary/20 hover:bg-primary/30 transition-colors ${
                              anon ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            aria-label={`Send ${video.title}`}
                          >
                            <Send className="w-3 h-3" />
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Recommended Playlists */}
              {suggestions.playlists && suggestions.playlists.length > 0 && (
                <div>
                  <h4 className="text-xs font-medium text-white/80 mb-2 flex items-center gap-2">
                    <ListVideo className="w-3 h-3" />
                    Recommended Playlists
                  </h4>
                  <div className="space-y-2">
                    {suggestions.playlists.map(playlistId => {
                      const playlist = playlistMetadata[playlistId]
                      if (!playlist) return null
                      return (
                        <div
                          key={playlistId}
                          className="flex items-center justify-between p-2 bg-white/5 rounded-lg"
                        >
                          <div className="flex-1">
                            <p className="text-sm">{playlist.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {playlist.videoCount} videos
                            </p>
                          </div>
                          <button
                            onClick={() => handleSendPlaylist(playlistId)}
                            disabled={anon}
                            className={`p-1.5 rounded-lg bg-primary/20 hover:bg-primary/30 transition-colors ${
                              anon ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            aria-label={`Send ${playlist.name}`}
                          >
                            <Send className="w-3 h-3" />
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* No selection state */}
          {!selectedType && (
            <div className="text-center py-4 text-sm text-muted-foreground">
              Select a visit type to see recommendations
            </div>
          )}
        </div>
      )}
    </div>
  )
}
