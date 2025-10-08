'use client'

import React, { useState, useEffect, useRef } from 'react'
import { X, ListVideo, Check } from 'lucide-react'
import { Playlist } from '@/types/playlist'

// Mock video data
const mockVideos = [
  { id: '1', title: 'Proper Brushing Technique', category: 'education' },
  { id: '2', title: 'Flossing Made Easy', category: 'education' },
  { id: '3', title: 'Electric Toothbrush Tips', category: 'education' },
  { id: '4', title: "Caring for Children's Teeth", category: 'pediatric' },
  { id: '5', title: 'Why Fluoride Matters', category: 'prevention' },
  { id: '6', title: 'Scaling and Root Planing: What to Expect', category: 'procedure' },
  { id: '7', title: 'Periodontal Maintenance at Home', category: 'periodontics' },
  { id: '8', title: 'Sensitivity: Causes and Relief', category: 'education' },
  { id: '9', title: 'Whitening: Safety and Aftercare', category: 'cosmetic' },
  { id: '10', title: 'Diet and Tooth Decay', category: 'prevention' },
  { id: '11', title: 'Oral Care During Pregnancy', category: 'special-care' },
  { id: '12', title: 'Mouthguards: Cleaning and Care', category: 'prevention' },
]

interface PlaylistDialogProps {
  open: boolean
  onClose: () => void
  onSave: (playlist: Playlist) => void
  editingPlaylist?: Playlist | null
}

export default function PlaylistDialog({ open, onClose, onSave, editingPlaylist }: PlaylistDialogProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [selectedVideoIds, setSelectedVideoIds] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const dialogRef = useRef<HTMLDivElement>(null)
  const firstInputRef = useRef<HTMLInputElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  // Initialize form with editing data
  useEffect(() => {
    if (editingPlaylist) {
      setName(editingPlaylist.name)
      setDescription(editingPlaylist.description || '')
      setSelectedVideoIds(editingPlaylist.videoIds)
    } else {
      setName('')
      setDescription('')
      setSelectedVideoIds([])
    }
    setSearchQuery('')
  }, [editingPlaylist, open])

  // Focus management
  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement as HTMLElement
      setTimeout(() => {
        firstInputRef.current?.focus()
      }, 100)
    } else {
      previousFocusRef.current?.focus()
    }
  }, [open])

  // Trap focus and handle escape
  useEffect(() => {
    if (!open) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
      
      // Focus trap
      if (e.key === 'Tab' && dialogRef.current) {
        const focusableElements = dialogRef.current.querySelectorAll(
          'button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        )
        const firstElement = focusableElements[0] as HTMLElement
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  const filteredVideos = mockVideos.filter(video =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleToggleVideo = (videoId: string) => {
    setSelectedVideoIds(prev =>
      prev.includes(videoId)
        ? prev.filter(id => id !== videoId)
        : [...prev, videoId]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim() || selectedVideoIds.length === 0) {
      return
    }

    const now = new Date().toISOString()
    const playlist: Playlist = {
      id: editingPlaylist?.id || `playlist-${Date.now()}`,
      name: name.trim(),
      description: description.trim() || undefined,
      videoIds: selectedVideoIds,
      createdAt: editingPlaylist?.createdAt || now,
      updatedAt: now
    }

    onSave(playlist)
  }

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div 
        ref={dialogRef}
        className="fixed inset-0 z-50 overflow-y-auto"
        aria-hidden={!open}
      >
        <div className="flex items-center justify-center min-h-screen p-4">
          <div 
            className="glass-card w-full max-w-2xl p-6 relative"
            role="dialog"
            aria-modal="true"
            aria-labelledby="playlist-dialog-title"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <ListVideo className="w-5 h-5 text-primary" />
                </div>
                <h2 id="playlist-dialog-title" className="text-xl font-semibold">
                  {editingPlaylist ? 'Edit Playlist' : 'Create Playlist'}
                </h2>
              </div>
              
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Input */}
              <div>
                <label htmlFor="playlist-name" className="block text-sm font-medium mb-2">
                  Playlist Name *
                </label>
                <input
                  ref={firstInputRef}
                  id="playlist-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="glass-input"
                  placeholder="e.g., New Patient Onboarding"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="playlist-description" className="block text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  id="playlist-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="glass-input min-h-[80px] resize-none"
                  placeholder="Brief description of this playlist..."
                  rows={3}
                />
              </div>

              {/* Video Selection */}
              <div>
                <label htmlFor="video-search" className="block text-sm font-medium mb-2">
                  Select Videos * ({selectedVideoIds.length} selected)
                </label>
                
                {/* Search */}
                <input
                  id="video-search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="glass-input mb-3"
                  placeholder="Search videos..."
                />

                {/* Video List */}
                <div className="border border-white/10 rounded-lg overflow-hidden">
                  <div className="max-h-64 overflow-y-auto">
                    {filteredVideos.map(video => (
                      <label
                        key={video.id}
                        className={`flex items-center gap-3 p-3 hover:bg-white/5 cursor-pointer transition-colors ${
                          selectedVideoIds.includes(video.id) ? 'bg-primary/10' : ''
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedVideoIds.includes(video.id)}
                          onChange={() => handleToggleVideo(video.id)}
                          className="w-5 h-5 rounded border-white/20 bg-white/5 text-primary focus:ring-2 focus:ring-primary"
                        />
                        <span className="flex-1 text-sm">{video.title}</span>
                        {selectedVideoIds.includes(video.id) && (
                          <Check className="w-4 h-4 text-primary" />
                        )}
                      </label>
                    ))}
                  </div>
                </div>

                {selectedVideoIds.length === 0 && (
                  <p className="text-xs text-red-400 mt-2">
                    Please select at least one video
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-secondary px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!name.trim() || selectedVideoIds.length === 0}
                  className="btn-primary px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editingPlaylist ? 'Update Playlist' : 'Create Playlist'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
