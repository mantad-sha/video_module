'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import BackButton from '@/components/BackButton'
import StatsCard from '@/components/StatsCard'
import VideoCard from '@/components/videos/VideoCard'
import SendDialog from '@/components/videos/SendDialog'
import SuggestionsPanel from '@/components/videos/SuggestionsPanel'
import HelpModal from '@/components/HelpModal'
import CategoryDropdown from '@/components/CategoryDropdown'
import DensityToggle from '@/components/DensityToggle'
import { Plus, Search, Filter, Video, Grid3X3, Eye, EyeOff } from 'lucide-react'
import { useAnonMode } from '@/contexts/AnonModeContext'
import { useToast } from '@/contexts/ToastContext'

// Mock dental hygiene video data
const mockVideos = [
  { 
    id: '1', 
    title: 'Proper Brushing Technique', 
    description: 'Learn the correct way to brush your teeth for optimal plaque removal',
    duration: '3:00', 
    views: 342, 
    category: 'education', 
    sentCount: 0,
    tags: ['brushing', 'basics'],
    publishedOn: '2024-01-10',
    thumbnail: 'https://via.placeholder.com/320x180/2563eb/ffffff?text=Brushing'
  },
  { 
    id: '2', 
    title: 'Flossing Made Easy', 
    description: 'Master the art of flossing with simple, effective techniques',
    duration: '2:30', 
    views: 189, 
    category: 'education', 
    sentCount: 0,
    tags: ['floss', 'interdental'],
    publishedOn: '2024-01-08',
    thumbnail: 'https://via.placeholder.com/320x180/10b981/ffffff?text=Flossing'
  },
  { 
    id: '3', 
    title: 'Electric Toothbrush Tips', 
    description: 'Maximize your electric toothbrush effectiveness with pro tips',
    duration: '3:30', 
    views: 276, 
    category: 'education', 
    sentCount: 0,
    tags: ['electric', 'technique'],
    publishedOn: '2024-01-05',
    thumbnail: 'https://via.placeholder.com/320x180/8b5cf6/ffffff?text=Electric'
  },
  { 
    id: '4', 
    title: "Caring for Children's Teeth", 
    description: 'Essential tips for maintaining your child\'s oral health',
    duration: '4:00', 
    views: 523, 
    category: 'pediatric', 
    sentCount: 0,
    tags: ['kids', 'habits'],
    publishedOn: '2024-01-12',
    thumbnail: 'https://via.placeholder.com/320x180/f59e0b/ffffff?text=Kids'
  },
  { 
    id: '5', 
    title: 'Why Fluoride Matters', 
    description: 'Understanding the role of fluoride in preventing tooth decay',
    duration: '2:40', 
    views: 167, 
    category: 'prevention', 
    sentCount: 0,
    tags: ['fluoride', 'caries'],
    publishedOn: '2024-01-09',
    thumbnail: 'https://via.placeholder.com/320x180/06b6d4/ffffff?text=Fluoride'
  },
  { 
    id: '6', 
    title: 'Scaling and Root Planing: What to Expect', 
    description: 'A comprehensive guide to deep cleaning procedures',
    duration: '5:00', 
    views: 98, 
    category: 'procedure', 
    sentCount: 0,
    tags: ['deep cleaning', 'perio'],
    publishedOn: '2024-01-07',
    thumbnail: 'https://via.placeholder.com/320x180/ef4444/ffffff?text=Scaling'
  },
  { 
    id: '7', 
    title: 'Periodontal Maintenance at Home', 
    description: 'Daily routines to manage and prevent gum disease',
    duration: '3:50', 
    views: 145, 
    category: 'periodontics', 
    sentCount: 0,
    tags: ['gum disease', 'maintenance'],
    publishedOn: '2024-01-11',
    thumbnail: 'https://via.placeholder.com/320x180/dc2626/ffffff?text=Perio'
  },
  { 
    id: '8', 
    title: 'Sensitivity: Causes and Relief', 
    description: 'Understand tooth sensitivity and learn how to manage it',
    duration: '3:20', 
    views: 412, 
    category: 'education', 
    sentCount: 0,
    tags: ['sensitivity', 'enamel'],
    publishedOn: '2024-01-06',
    thumbnail: 'https://via.placeholder.com/320x180/7c3aed/ffffff?text=Sensitivity'
  },
  { 
    id: '9', 
    title: 'Whitening: Safety and Aftercare', 
    description: 'Safe whitening practices and post-treatment care guide',
    duration: '3:10', 
    views: 634, 
    category: 'cosmetic', 
    sentCount: 0,
    tags: ['whitening', 'care'],
    publishedOn: '2024-01-13',
    thumbnail: 'https://via.placeholder.com/320x180/fbbf24/ffffff?text=Whitening'
  },
  { 
    id: '10', 
    title: 'Diet and Tooth Decay', 
    description: 'How your diet affects your teeth and what to avoid',
    duration: '3:30', 
    views: 287, 
    category: 'prevention', 
    sentCount: 0,
    tags: ['sugar', 'acids'],
    publishedOn: '2024-01-04',
    thumbnail: 'https://via.placeholder.com/320x180/34d399/ffffff?text=Diet'
  },
  { 
    id: '11', 
    title: 'Oral Care During Pregnancy', 
    description: 'Special considerations for dental health during pregnancy',
    duration: '3:40', 
    views: 203, 
    category: 'special-care', 
    sentCount: 0,
    tags: ['pregnancy', 'hormones'],
    publishedOn: '2024-01-14',
    thumbnail: 'https://via.placeholder.com/320x180/ec4899/ffffff?text=Pregnancy'
  },
  { 
    id: '12', 
    title: 'Mouthguards: Cleaning and Care', 
    description: 'Proper maintenance of sports and night guards',
    duration: '3:00', 
    views: 156, 
    category: 'prevention', 
    sentCount: 0,
    tags: ['sports', 'appliances'],
    publishedOn: '2024-01-03',
    thumbnail: 'https://via.placeholder.com/320x180/0ea5e9/ffffff?text=Mouthguards'
  }
]

export default function VideosPage() {
  const { anon } = useAnonMode()
  const { showToast } = useToast()
  
  // PERSISTENCE TEST: Anonymous Mode state persists across routes
  // Test in browser console: 
  //   localStorage.setItem('dh-app:anon', 'true'); location.reload()
  //   - Verify Anonymous badge appears
  //   - Navigate to /videos/tracking or /videos/rules
  //   - Anonymous Mode remains active
  // Clear test: localStorage.setItem('dh-app:anon', 'false'); location.reload()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [videos, setVideos] = useState(mockVideos)
  const [focusedVideoIndex, setFocusedVideoIndex] = useState(-1)
  const [sendDialogOpen, setSendDialogOpen] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<typeof mockVideos[0] | null>(null)
  const [helpModalOpen, setHelpModalOpen] = useState(false)
  const [addToPlaylistVideo, setAddToPlaylistVideo] = useState<typeof mockVideos[0] | null>(null)
  
  // Density state - default to compact on large screens
  const [density, setDensity] = useState<'comfortable' | 'compact'>(() => {
    // Check if we're on client side and if screen is large
    if (typeof window !== 'undefined') {
      const savedDensity = localStorage.getItem('video-density') as 'comfortable' | 'compact' | null
      if (savedDensity) return savedDensity
      // Default to compact on large screens (>= 1024px)
      return window.innerWidth >= 1024 ? 'compact' : 'comfortable'
    }
    return 'comfortable'
  })
  
  const searchInputRef = useRef<HTMLInputElement>(null)
  const videoGridRef = useRef<HTMLDivElement>(null)

  // Save density preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('video-density', density)
    }
  }, [density])

  const handleDensityChange = (newDensity: 'comfortable' | 'compact') => {
    setDensity(newDensity)
  }

  // Filter videos based on search and category
  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || video.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  useEffect(() => {
    // Keyboard shortcuts
    const handleKeyPress = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      const isInputFocused = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT'

      // Search shortcut (f)
      if (e.key === 'f' && !e.ctrlKey && !e.metaKey && !isInputFocused) {
        e.preventDefault()
        searchInputRef.current?.focus()
      }

      // Category filter shortcut (c)
      if (e.key === 'c' && !e.ctrlKey && !e.metaKey && !isInputFocused) {
        e.preventDefault()
        // Focus the category dropdown button (which will be handled by the component)
        const categoryButton = document.getElementById('category-filter') as HTMLButtonElement
        categoryButton?.focus()
        categoryButton?.click()
      }

      // Help shortcut (?)
      if (e.key === '?' && !isInputFocused) {
        e.preventDefault()
        setHelpModalOpen(true)
      }

      // Arrow key navigation
      if (!isInputFocused && filteredVideos.length > 0) {
        const cols = 3 // Number of columns in the grid
        let newIndex = focusedVideoIndex

        if (e.key === 'ArrowRight') {
          e.preventDefault()
          newIndex = Math.min(focusedVideoIndex + 1, filteredVideos.length - 1)
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault()
          newIndex = Math.max(focusedVideoIndex - 1, 0)
        } else if (e.key === 'ArrowDown') {
          e.preventDefault()
          newIndex = Math.min(focusedVideoIndex + cols, filteredVideos.length - 1)
        } else if (e.key === 'ArrowUp') {
          e.preventDefault()
          newIndex = Math.max(focusedVideoIndex - cols, 0)
        }

        if (newIndex !== focusedVideoIndex && newIndex >= 0) {
          setFocusedVideoIndex(newIndex)
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [focusedVideoIndex, filteredVideos.length])

  // Stats
  const stats = {
    totalVideos: videos.length,
    categories: new Set(videos.map(v => v.category)).size,
    totalViews: videos.reduce((acc, v) => acc + v.views, 0),
  }

  const categories = [
    { value: 'all', label: 'All categories' },
    { value: 'education', label: 'Education' },
    { value: 'prevention', label: 'Prevention' },
    { value: 'procedure', label: 'Procedures' },
    { value: 'pediatric', label: 'Pediatric' },
    { value: 'periodontics', label: 'Periodontics' },
    { value: 'cosmetic', label: 'Cosmetic' },
    { value: 'special-care', label: 'Special Care' },
  ]

  const handlePlay = (video: typeof mockVideos[0]) => {
    showToast(`Playing video: ${video.title}`, 'info')
  }

  const handleSend = (video: typeof mockVideos[0]) => {
    if (anon) {
      showToast('Cannot send videos while Anonymous Mode is active', 'error')
      return
    }
    setSelectedVideo(video)
    setSendDialogOpen(true)
  }

  const handleSendComplete = (patientCount: number) => {
    if (selectedVideo) {
      // Update sent count
      setVideos(prev => prev.map(v => 
        v.id === selectedVideo.id 
          ? { ...v, sentCount: v.sentCount + patientCount }
          : v
      ))
      showToast(`Sent to ${patientCount} patients`, 'success')
    }
    setSendDialogOpen(false)
  }

  const handleAddToPlaylist = (video: typeof mockVideos[0]) => {
    if (anon) {
      showToast('Cannot add to playlist while Anonymous Mode is active', 'warning')
      return
    }
    setAddToPlaylistVideo(video)
    showToast('Add to playlist feature coming soon', 'info')
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className={`${anon ? 'pt-28' : 'pt-16'} p-6 transition-all duration-200`}>
        {/* Back Button */}
        <div className="mb-6">
          <BackButton />
        </div>

        {/* Page Title */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-bold text-foreground">Video Library</h1>
            {anon && (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-sm font-medium">
                <EyeOff className="w-4 h-4" aria-hidden="true" />
                <span>Anonymous</span>
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setHelpModalOpen(true)}
              className="inline-flex items-center px-3 py-1.5 min-h-[44px] text-sm text-white/60 hover:text-white bg-white/[0.05] hover:bg-white/[0.08] rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              aria-label="Open keyboard shortcuts help"
              tabIndex={-1}
            >
              Press <kbd className="px-1.5 py-0.5 text-xs font-mono bg-white/10 rounded">?</kbd> for help
            </button>
            <Link
              href="/videos/playlists"
              className="inline-flex items-center px-3 py-1.5 min-h-[44px] text-sm text-primary hover:text-primary/90 bg-primary/10 hover:bg-primary/20 border border-primary/20 rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              tabIndex={-1}
            >
              Playlists →
            </Link>
            <Link
              href="/videos/tracking"
              className="inline-flex items-center px-3 py-1.5 min-h-[44px] text-sm text-primary hover:text-primary/90 bg-primary/10 hover:bg-primary/20 border border-primary/20 rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              tabIndex={-1}
            >
              Tracking →
            </Link>
            <Link
              href="/videos/rules"
              className="inline-flex items-center px-3 py-1.5 min-h-[44px] text-sm text-primary hover:text-primary/90 bg-primary/10 hover:bg-primary/20 border border-primary/20 rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              tabIndex={-1}
            >
              Automation Rules →
            </Link>
          </div>
        </div>

        {/* Stats and Suggestions */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
          {/* Stats Cards - 3 columns */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatsCard
              title="Total videos"
              value={stats.totalVideos}
              icon={<Video className="w-6 h-6" aria-hidden="true" />}
            />
            <StatsCard
              title="Categories"
              value={stats.categories}
              icon={<Grid3X3 className="w-6 h-6" aria-hidden="true" />}
            />
            <StatsCard
              title="Total views"
              value={stats.totalViews}
              icon={<Eye className="w-6 h-6" aria-hidden="true" />}
            />
          </div>
          
          {/* Suggestions Panel - 1 column */}
          <div className="lg:col-span-1">
            <SuggestionsPanel
              onSendVideo={(video) => {
                setSelectedVideo(video as typeof mockVideos[0])
                setSendDialogOpen(true)
              }}
              onSendPlaylist={(playlistId) => {
                showToast(`Opening playlist ${playlistId} for sending`, 'info')
                // In a real app, this would open SendDialog with playlist tab selected
              }}
            />
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          {/* Search Input and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Search Input */}
            <div className="flex-1 relative">
            <label htmlFor="search-videos" className="sr-only">
              Search videos
            </label>
            <div className="relative">
              <Search 
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" 
                aria-hidden="true"
              />
              <input
                ref={searchInputRef}
                id="search-videos"
                type="text"
                placeholder="Search videos…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="glass-input pl-12"
                aria-label="Search videos"
                aria-describedby="search-hint"
              />
            </div>
            <span id="search-hint" className="sr-only">
              Press F for quick search
            </span>
          </div>

          {/* Category Filter */}
          <CategoryDropdown
            value={selectedCategory}
            onChange={setSelectedCategory}
            options={categories}
          />
          </div>

          {/* Right Controls */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Density Toggle */}
            <DensityToggle density={density} onChange={handleDensityChange} />
            
            {/* Add Video Button */}
            <button
              className="btn-primary flex items-center justify-center gap-2 min-h-[44px]"
              aria-label="Add new video"
              onClick={() => showToast('Video upload will be available soon', 'info')}
            >
              <Plus className="w-5 h-5" aria-hidden="true" />
              <span>Add video</span>
            </button>
          </div>
        </div>

        {/* Videos List Area */}
        <section aria-label="Video list">
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Videos ({filteredVideos.length})
            </h2>
            
            {filteredVideos.length > 0 ? (
              <div 
                ref={videoGridRef}
                className={`grid ${
                  density === 'compact'
                    ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3'
                    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
                }`}
                role="grid"
              >
                {filteredVideos.map((video, index) => (
                  <VideoCard
                    key={video.id}
                    video={video}
                    onPlay={() => handlePlay(video)}
                    onSend={() => handleSend(video)}
                    isFocused={focusedVideoIndex === index}
                    onFocus={() => setFocusedVideoIndex(index)}
                    index={index}
                    isCompact={density === 'compact'}
                    onAddToPlaylist={() => handleAddToPlaylist(video)}
                  />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Video className="w-16 h-16 text-muted-foreground/50 mb-4" aria-hidden="true" />
                <p className="text-muted-foreground text-lg mb-2">
                  {searchQuery || selectedCategory !== 'all' 
                    ? 'No videos match your filter'
                    : 'No videos yet'
                  }
                </p>
                {searchQuery || selectedCategory !== 'all' ? (
                  <button
                    onClick={() => {
                      setSearchQuery('')
                      setSelectedCategory('all')
                    }}
                    className="text-sm text-primary hover:underline"
                  >
                    Clear filters
                  </button>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    Click "Add video" to upload your first video
                  </p>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Send Dialog */}
        <SendDialog
          open={sendDialogOpen}
          onClose={() => setSendDialogOpen(false)}
          video={selectedVideo}
          onSend={handleSendComplete}
        />

        {/* Help Modal */}
        <HelpModal
          open={helpModalOpen}
          onClose={() => setHelpModalOpen(false)}
        />

        {/* Keyboard shortcuts info (visually hidden but available for screen readers) */}
        <div className="sr-only" aria-live="polite">
          <h2>Keyboard shortcuts</h2>
          <ul>
            <li>F - Search</li>
            <li>C - Category filter</li>
            <li>A - Toggle anonymous mode</li>
            <li>P - Play video</li>
            <li>S - Send video</li>
            <li>Arrow keys - Navigate videos</li>
            <li>? - Help</li>
          </ul>
        </div>
      </main>
    </div>
  )
}