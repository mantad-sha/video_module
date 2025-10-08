'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import BackButton from '@/components/BackButton'
import HelpModal from '@/components/HelpModal'
import PlaylistDialog from '@/components/playlists/PlaylistDialog'
import PlaylistCard from '@/components/playlists/PlaylistCard'
import { Plus, ListVideo, Search, EyeOff } from 'lucide-react'
import { useAnonMode } from '@/contexts/AnonModeContext'
import { useToast } from '@/contexts/ToastContext'
import { Playlist } from '@/types/playlist'

// Mock initial playlists
const initialPlaylists: Playlist[] = [
  {
    id: '1',
    name: 'New Patient Onboarding',
    description: 'Essential videos for new patients to understand basic oral hygiene',
    videoIds: ['1', '2', '3', '5'],
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-10T10:00:00Z'
  },
  {
    id: '2',
    name: 'Pediatric Care Bundle',
    description: 'Videos focused on children\'s dental health',
    videoIds: ['4', '5'],
    createdAt: '2024-01-12T14:30:00Z',
    updatedAt: '2024-01-12T14:30:00Z'
  },
  {
    id: '3',
    name: 'Advanced Periodontal Care',
    description: 'Comprehensive guide for patients with gum disease',
    videoIds: ['6', '7'],
    createdAt: '2024-01-14T09:15:00Z',
    updatedAt: '2024-01-14T09:15:00Z'
  }
]

export default function PlaylistsPage() {
  const { anon } = useAnonMode()
  const { showToast } = useToast()
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [helpModalOpen, setHelpModalOpen] = useState(false)
  const [playlistDialogOpen, setPlaylistDialogOpen] = useState(false)
  const [editingPlaylist, setEditingPlaylist] = useState<Playlist | null>(null)

  // Load playlists from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('video-playlists')
    if (saved) {
      try {
        setPlaylists(JSON.parse(saved))
      } catch {
        setPlaylists(initialPlaylists)
      }
    } else {
      setPlaylists(initialPlaylists)
    }
  }, [])

  // Save playlists to localStorage
  useEffect(() => {
    if (playlists.length > 0 || localStorage.getItem('video-playlists')) {
      localStorage.setItem('video-playlists', JSON.stringify(playlists))
    }
  }, [playlists])

  // Filter playlists based on search
  const filteredPlaylists = playlists.filter(playlist =>
    playlist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    playlist.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreatePlaylist = () => {
    setEditingPlaylist(null)
    setPlaylistDialogOpen(true)
  }

  const handleEditPlaylist = (playlist: Playlist) => {
    setEditingPlaylist(playlist)
    setPlaylistDialogOpen(true)
  }

  const handleSavePlaylist = (playlist: Playlist) => {
    if (editingPlaylist) {
      setPlaylists(prev => prev.map(p => 
        p.id === playlist.id ? playlist : p
      ))
      showToast(`Playlist "${playlist.name}" updated`, 'success')
    } else {
      setPlaylists(prev => [...prev, playlist])
      showToast(`Playlist "${playlist.name}" created`, 'success')
    }
    setPlaylistDialogOpen(false)
  }

  const handleDeletePlaylist = (playlistId: string) => {
    const playlist = playlists.find(p => p.id === playlistId)
    setPlaylists(prev => prev.filter(p => p.id !== playlistId))
    showToast(`Playlist "${playlist?.name}" deleted`, 'info')
  }

  const handleSharePlaylist = (playlist: Playlist) => {
    // This would open the send dialog in a real app
    showToast(`Send playlist "${playlist.name}" feature coming soon`, 'info')
  }

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const isInputFocused = document.activeElement?.tagName === 'INPUT' || 
                            document.activeElement?.tagName === 'TEXTAREA'
      
      // Help shortcut (?)
      if (e.key === '?' && !isInputFocused) {
        e.preventDefault()
        setHelpModalOpen(true)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <BackButton href="/videos" />

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-foreground">
              Video Playlists
            </h1>
            {anon && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 rounded-full">
                <EyeOff className="w-3 h-3" />
                Anonymous
              </span>
            )}
          </div>
          <p className="text-muted-foreground">
            Create and manage video playlists for patient education
          </p>
        </div>

        {/* Search and Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Search Input */}
          <div className="flex-1 relative">
            <label htmlFor="search-playlists" className="sr-only">
              Search playlists
            </label>
            <div className="relative">
              <Search 
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" 
                aria-hidden="true"
              />
              <input
                id="search-playlists"
                type="text"
                placeholder="Search playlists…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="glass-input pl-12"
                aria-label="Search playlists"
              />
            </div>
          </div>

          {/* Create Playlist Button */}
          <button
            onClick={handleCreatePlaylist}
            disabled={anon}
            className={`btn-primary flex items-center justify-center gap-2 min-h-[44px] ${
              anon ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            aria-label="Create new playlist"
          >
            <Plus className="w-5 h-5" aria-hidden="true" />
            <span>New playlist</span>
          </button>
        </div>

        {/* Anonymous Mode Warning */}
        {anon && (
          <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <p className="text-sm text-yellow-300">
              Creating and editing playlists is disabled in Anonymous Mode.
            </p>
          </div>
        )}

        {/* Playlists Grid */}
        <section aria-label="Playlists">
          {filteredPlaylists.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPlaylists.map(playlist => (
                <PlaylistCard
                  key={playlist.id}
                  playlist={playlist}
                  onEdit={handleEditPlaylist}
                  onDelete={handleDeletePlaylist}
                  onShare={handleSharePlaylist}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="glass-card p-12">
              <div className="flex flex-col items-center justify-center text-center">
                <ListVideo className="w-16 h-16 text-muted-foreground/50 mb-4" aria-hidden="true" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No playlists found
                </h3>
                <p className="text-muted-foreground mb-6 max-w-sm">
                  {searchQuery 
                    ? `No playlists match "${searchQuery}"`
                    : 'Create your first playlist to organize videos for patients'
                  }
                </p>
                {!searchQuery && !anon && (
                  <button
                    onClick={handleCreatePlaylist}
                    className="btn-primary flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Create your first playlist
                  </button>
                )}
              </div>
            </div>
          )}
        </section>

        {/* Navigation Links */}
        <div className="mt-8 pt-8 border-t border-white/10 flex gap-4 text-sm">
          <Link 
            href="/videos" 
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to Videos
          </Link>
          <Link 
            href="/videos/tracking" 
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Tracking →
          </Link>
          <Link 
            href="/videos/rules" 
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Automation Rules →
          </Link>
        </div>
      </div>

      {/* Playlist Dialog */}
      <PlaylistDialog
        open={playlistDialogOpen}
        onClose={() => setPlaylistDialogOpen(false)}
        onSave={handleSavePlaylist}
        editingPlaylist={editingPlaylist}
      />

      {/* Help Modal */}
      <HelpModal
        open={helpModalOpen}
        onClose={() => setHelpModalOpen(false)}
      />
    </div>
  )
}
