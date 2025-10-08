'use client'

import React, { useState } from 'react'
import { ListVideo, Edit2, Trash2, Share2, MoreVertical, Clock, CheckCircle } from 'lucide-react'
import { Playlist } from '@/types/playlist'
import { useAnonMode } from '@/contexts/AnonModeContext'

// Mock video data for getting titles
const mockVideos = [
  { id: '1', title: 'Proper Brushing Technique' },
  { id: '2', title: 'Flossing Made Easy' },
  { id: '3', title: 'Electric Toothbrush Tips' },
  { id: '4', title: "Caring for Children's Teeth" },
  { id: '5', title: 'Why Fluoride Matters' },
  { id: '6', title: 'Scaling and Root Planing: What to Expect' },
  { id: '7', title: 'Periodontal Maintenance at Home' },
  { id: '8', title: 'Sensitivity: Causes and Relief' },
  { id: '9', title: 'Whitening: Safety and Aftercare' },
  { id: '10', title: 'Diet and Tooth Decay' },
  { id: '11', title: 'Oral Care During Pregnancy' },
  { id: '12', title: 'Mouthguards: Cleaning and Care' },
]

interface PlaylistCardProps {
  playlist: Playlist
  onEdit: (playlist: Playlist) => void
  onDelete: (playlistId: string) => void
  onShare: (playlist: Playlist) => void
}

export default function PlaylistCard({ playlist, onEdit, onDelete, onShare }: PlaylistCardProps) {
  const { anon } = useAnonMode()
  const [showMenu, setShowMenu] = useState(false)

  const videoTitles = playlist.videoIds
    .map(id => mockVideos.find(v => v.id === id)?.title)
    .filter(Boolean)
    .slice(0, 3)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    })
  }

  // Mock progress data (would come from PlaylistShare in real app)
  const mockProgress = { watched: Math.floor(Math.random() * playlist.videoIds.length), total: playlist.videoIds.length }
  const isCompleted = mockProgress.watched === mockProgress.total

  return (
    <div className="glass-card p-5 group relative hover:shadow-xl transition-all duration-200">
      {/* Menu Button */}
      <div className="absolute top-4 right-4">
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
            aria-label="Playlist options"
          >
            <MoreVertical className="w-5 h-5" />
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
                  onClick={() => {
                    onEdit(playlist)
                    setShowMenu(false)
                  }}
                  disabled={anon}
                  className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-100 flex items-center gap-3 ${
                    anon ? 'text-gray-400 cursor-not-allowed' : 'text-black'
                  }`}
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                
                <button
                  onClick={() => {
                    onShare(playlist)
                    setShowMenu(false)
                  }}
                  disabled={anon}
                  className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-100 flex items-center gap-3 ${
                    anon ? 'text-gray-400 cursor-not-allowed' : 'text-black'
                  }`}
                >
                  <Share2 className="w-4 h-4" />
                  Send to Patients
                </button>
                
                <hr className="border-gray-200" />
                
                <button
                  onClick={() => {
                    if (window.confirm(`Delete playlist "${playlist.name}"?`)) {
                      onDelete(playlist.id)
                    }
                    setShowMenu(false)
                  }}
                  disabled={anon}
                  className={`w-full px-4 py-2.5 text-left text-sm hover:bg-red-50 flex items-center gap-3 ${
                    anon ? 'text-gray-400 cursor-not-allowed' : 'text-red-600'
                  }`}
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Icon */}
      <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-4">
        <ListVideo className="w-6 h-6 text-primary" />
      </div>

      {/* Title & Description */}
      <h3 className="text-lg font-semibold text-white mb-2 pr-8">
        {playlist.name}
      </h3>
      
      {playlist.description && (
        <p className="text-sm text-white/60 mb-4 line-clamp-2">
          {playlist.description}
        </p>
      )}

      {/* Video Count & Progress */}
      <div className="flex items-center gap-4 mb-4">
        <span className="text-sm text-white/80">
          {playlist.videoIds.length} {playlist.videoIds.length === 1 ? 'video' : 'videos'}
        </span>
        
        {/* Progress Pill */}
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border ${
          isCompleted
            ? 'bg-green-500/20 text-green-300 border-green-500/30'
            : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
        }`}>
          {isCompleted ? (
            <>
              <CheckCircle className="w-3 h-3" />
              Completed
            </>
          ) : (
            <>
              <Clock className="w-3 h-3" />
              {mockProgress.watched}/{mockProgress.total} watched
            </>
          )}
        </div>
      </div>

      {/* Video List Preview */}
      {videoTitles.length > 0 && (
        <div className="space-y-1 mb-4">
          {videoTitles.map((title, idx) => (
            <div key={idx} className="text-xs text-white/50 truncate">
              • {title}
            </div>
          ))}
          {playlist.videoIds.length > 3 && (
            <div className="text-xs text-white/40">
              +{playlist.videoIds.length - 3} more
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="pt-3 border-t border-white/10 text-xs text-white/40">
        Updated {formatDate(playlist.updatedAt)}
      </div>
    </div>
  )
}
