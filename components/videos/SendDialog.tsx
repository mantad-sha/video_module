'use client'

import React, { useEffect, useRef, useState } from 'react'
import { X, Send, AlertCircle, Video, ListVideo, Lightbulb, RotateCcw } from 'lucide-react'
import { useAnonMode } from '@/contexts/AnonModeContext'
import { useNudge } from '@/contexts/NudgeContext'
import Select, { SelectOption } from '@/components/Select'
import PatientPicker from './PatientPicker'
import { mockPatientAppointments, appointmentSuggestions, videoMetadata, playlistMetadata } from '@/data/suggestions'

interface SendDialogProps {
  open: boolean
  onClose: () => void
  video: {
    id: string
    title: string
  } | null
  onSend: (patientCount: number) => void
}

// Mock playlists for demonstration
const mockPlaylists = [
  { id: '1', name: 'New Patient Onboarding', videoCount: 4 },
  { id: '2', name: 'Pediatric Care Bundle', videoCount: 2 },
  { id: '3', name: 'Advanced Periodontal Care', videoCount: 2 },
]

const templates: SelectOption[] = [
  { value: 'standard', label: 'Standard education' },
  { value: 'post-visit', label: 'Post-visit care' },
  { value: 'pre-visit', label: 'Pre-visit instructions' },
]

const playlistOptions: SelectOption[] = mockPlaylists.map(p => ({
  value: p.id,
  label: `${p.name} (${p.videoCount} videos)`
}))

// Helper function to generate template text
const getTemplateText = (templateId: string, contentType: 'video' | 'playlist', contentTitle?: string, playlistName?: string): string => {
  const greeting = 'Hello,\n\n'
  const closing = '\n\nBest regards,\nYour healthcare team'
  
  let body = ''
  
  if (contentType === 'video' && contentTitle) {
    switch(templateId) {
      case 'standard':
        body = `We're sending you an educational video "${contentTitle}" to help improve your oral health.`
        break
      case 'post-visit':
        body = `Following your recent visit, please watch "${contentTitle}" for important home care instructions.`
        break
      case 'pre-visit':
        body = `To prepare for your upcoming appointment, please review "${contentTitle}" with important information.`
        break
      default:
        body = `We're sending you the video "${contentTitle}".`
    }
  } else if (contentType === 'playlist' && playlistName) {
    switch(templateId) {
      case 'standard':
        body = `We're sending you a playlist "${playlistName}" with educational videos to help improve your oral health.`
        break
      case 'post-visit':
        body = `Following your recent visit, please watch the playlist "${playlistName}" for important care instructions.`
        break
      case 'pre-visit':
        body = `To prepare for your upcoming appointment, please review the playlist "${playlistName}" with important information.`
        break
      default:
        body = `We're sending you the playlist "${playlistName}".`
    }
  }
  
  return greeting + body + closing
}

export default function SendDialog({ open, onClose, video, onSend }: SendDialogProps) {
  const { anon } = useAnonMode()
  const { createVideoShare } = useNudge()
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)
  
  const [selectedPatients, setSelectedPatients] = useState<string[]>([])
  const [selectedTemplateId, setSelectedTemplateId] = useState('standard')
  const [showAnonTooltip, setShowAnonTooltip] = useState(false)
  const [activeTab, setActiveTab] = useState<'video' | 'playlist'>('video')
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null)
  const [message, setMessage] = useState<string>('')
  const [messageDirty, setMessageDirty] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Initialize message and handle focus
  useEffect(() => {
    if (open) {
      previousActiveElement.current = document.activeElement as HTMLElement
      setTimeout(() => {
        closeButtonRef.current?.focus()
      }, 100)
      
      // Initialize message based on content type
      const contentTitle = activeTab === 'video' ? video?.title : undefined
      const playlist = selectedPlaylistId ? mockPlaylists.find(p => p.id === selectedPlaylistId) : null
      const playlistName = playlist?.name
      setMessage(getTemplateText(selectedTemplateId, activeTab, contentTitle, playlistName))
      setMessageDirty(false)
    } else {
      // Restore focus when dialog closes
      previousActiveElement.current?.focus()
      // Reset selections
      setSelectedPatients([])
      setSelectedTemplateId('standard')
      setMessage('')
      setMessageDirty(false)
    }
  }, [open])

  // Focus trap
  useEffect(() => {
    if (!open) return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape closes dialog
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }

      // Tab trap
      if (e.key === 'Tab') {
        const focusableElements = dialogRef.current?.querySelectorAll(
          'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        ) as NodeListOf<HTMLElement>
        
        if (!focusableElements || focusableElements.length === 0) return

        const firstElement = focusableElements[0]
        const lastElement = focusableElements[focusableElements.length - 1]

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault()
            lastElement.focus()
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault()
            firstElement.focus()
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  // Get appointment suggestions for selected patients
  const getPatientSuggestions = () => {
    if (anon || selectedPatients.length === 0) return null
    
    const suggestions = new Set<{ type: string; label: string; videoId?: string; playlistId?: string }>()
    
    selectedPatients.forEach(patientId => {
      const appointment = mockPatientAppointments.find(a => a.patientId === patientId)
      if (appointment) {
        const appointmentSuggestion = appointmentSuggestions[appointment.appointmentType]
        if (appointmentSuggestion) {
          // Add video suggestions
          appointmentSuggestion.videos?.forEach(videoId => {
            const video = videoMetadata[videoId]
            if (video) {
              suggestions.add({
                type: 'video',
                label: video.title,
                videoId
              })
            }
          })
          // Add playlist suggestions  
          appointmentSuggestion.playlists?.forEach(playlistId => {
            const playlist = playlistMetadata[playlistId]
            if (playlist) {
              suggestions.add({
                type: 'playlist',
                label: playlist.name,
                playlistId
              })
            }
          })
        }
      }
    })
    
    return Array.from(suggestions).slice(0, 3) // Limit to 3 suggestions
  }

  const handleSend = () => {
    if (anon || selectedPatients.length === 0) return
    
    // Create video share for nudge tracking
    if (activeTab === 'video' && video) {
      createVideoShare(
        video.id,
        undefined,
        selectedPatients,
        video.title
      )
    } else if (activeTab === 'playlist' && selectedPlaylistId) {
      const playlist = mockPlaylists.find(p => p.id === selectedPlaylistId)
      createVideoShare(
        undefined,
        selectedPlaylistId,
        selectedPatients,
        undefined,
        playlist?.name
      )
    }
    
    onSend(selectedPatients.length)
    onClose()
  }

  const handleAnonHover = () => {
    if (anon) {
      setShowAnonTooltip(true)
      setTimeout(() => setShowAnonTooltip(false), 3000)
    }
  }

  const handleTemplateChange = (newTemplateId: string) => {
    setSelectedTemplateId(newTemplateId)
    if (!messageDirty) {
      const contentTitle = activeTab === 'video' ? video?.title : undefined
      const playlist = selectedPlaylistId ? mockPlaylists.find(p => p.id === selectedPlaylistId) : null
      const playlistName = playlist?.name
      setMessage(getTemplateText(newTemplateId, activeTab, contentTitle, playlistName))
    }
  }

  const handleMessageChange = (newMessage: string) => {
    setMessage(newMessage)
    setMessageDirty(true)
  }

  const handleResetMessage = () => {
    const contentTitle = activeTab === 'video' ? video?.title : undefined
    const playlist = selectedPlaylistId ? mockPlaylists.find(p => p.id === selectedPlaylistId) : null
    const playlistName = playlist?.name
    setMessage(getTemplateText(selectedTemplateId, activeTab, contentTitle, playlistName))
    setMessageDirty(false)
  }

  const handleTabChange = (newTab: 'video' | 'playlist') => {
    setActiveTab(newTab)
    setMessageDirty(false)
    const contentTitle = newTab === 'video' ? video?.title : undefined
    const playlist = selectedPlaylistId ? mockPlaylists.find(p => p.id === selectedPlaylistId) : null
    const playlistName = playlist?.name
    setMessage(getTemplateText(selectedTemplateId, newTab, contentTitle, playlistName))
  }

  const handlePlaylistChange = (newPlaylistId: string) => {
    setSelectedPlaylistId(newPlaylistId)
    const playlist = mockPlaylists.find(p => p.id === newPlaylistId)
    if (!messageDirty && playlist) {
      setMessage(getTemplateText(selectedTemplateId, 'playlist', undefined, playlist.name))
    }
  }

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [message])

  if (!open || !video) return null

  const selectedTemplate = templates.find(t => t.value === selectedTemplateId) || templates[0]

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div 
        ref={dialogRef}
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] overflow-hidden glass-card shadow-glass z-50"
        role="dialog"
        aria-modal="true"
        aria-labelledby="send-dialog-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 id="send-dialog-title" className="text-xl font-semibold text-foreground">
            {activeTab === 'video' ? 'Send video' : 'Send playlist'}
          </h2>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="p-2.5 min-w-[44px] min-h-[44px] rounded-lg bg-white/[0.05] hover:bg-white/[0.1] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[calc(90vh-180px)] overflow-y-auto">
          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
            <button
              onClick={() => handleTabChange('video')}
              disabled={!video}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md transition-all duration-200 ${
                activeTab === 'video'
                  ? 'bg-white/10 text-white shadow-sm'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              } ${
                !video ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Video className="w-4 h-4" />
              Send Video
            </button>
            <button
              onClick={() => handleTabChange('playlist')}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md transition-all duration-200 ${
                activeTab === 'playlist'
                  ? 'bg-white/10 text-white shadow-sm'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <ListVideo className="w-4 h-4" />
              Send Playlist
            </button>
          </div>

          {/* Content based on active tab */}
          {activeTab === 'video' && video ? (
            <div className="glass-card p-4">
              <p className="text-sm text-muted-foreground mb-1">Video to send:</p>
              <p className="text-lg font-medium text-foreground">{video.title}</p>
            </div>
          ) : activeTab === 'playlist' ? (
            <div>
              <label htmlFor="playlist-select" className="block text-sm font-medium text-foreground mb-2">
                Select playlist
              </label>
              <Select
                id="playlist-select"
                value={selectedPlaylistId || ''}
                onChange={handlePlaylistChange}
                options={[
                  { value: '', label: 'Choose a playlist...', disabled: true },
                  ...playlistOptions
                ]}
                placeholder="Choose a playlist..."
                disabled={anon}
                aria-label="Select playlist to send"
              />
            </div>
          ) : null}

          {/* Patient Selection */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Select recipients
            </label>
            <PatientPicker
              selectedIds={selectedPatients}
              onSelectionChange={setSelectedPatients}
            />
          </div>

          {/* Smart Suggestions based on appointments */}
          {(() => {
            const suggestions = getPatientSuggestions()
            if (!suggestions || suggestions.length === 0) return null
            
            return (
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-medium text-amber-300">
                    Suggestions based on upcoming appointments
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        if (suggestion.type === 'video' && suggestion.videoId) {
                          setActiveTab('video')
                          // In a real app, this would select the video
                        } else if (suggestion.type === 'playlist' && suggestion.playlistId) {
                          setActiveTab('playlist')
                          setSelectedPlaylistId(suggestion.playlistId)
                        }
                      }}
                      className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-white/10 hover:bg-white/20 rounded-md transition-colors"
                    >
                      {suggestion.type === 'video' ? (
                        <Video className="w-3 h-3" />
                      ) : (
                        <ListVideo className="w-3 h-3" />
                      )}
                      <span>{suggestion.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )
          })()}

          {/* Template Selection */}
          <div>
            <label htmlFor="message-template" className="block text-sm font-medium text-foreground mb-2">
              Message template
            </label>
            <Select
              id="message-template"
              value={selectedTemplateId}
              onChange={handleTemplateChange}
              options={templates}
              disabled={anon}
              aria-label="Select message template"
            />
          </div>

          {/* Message Preview - Editable */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="message-preview" className="block text-sm font-medium text-foreground">
                Message preview (editable)
              </label>
              {messageDirty && (
                <button
                  onClick={handleResetMessage}
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-white/10 hover:bg-white/20 rounded-md transition-colors"
                  aria-label="Reset message to template"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset to template
                </button>
              )}
            </div>
            <textarea
              ref={textareaRef}
              id="message-preview"
              value={message}
              onChange={(e) => handleMessageChange(e.target.value)}
              className="w-full min-h-[7rem] p-4 bg-white/5 text-white placeholder-gray-400 rounded-xl 
                       border border-white/10 resize-none
                       focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                       transition-all duration-200"
              placeholder="Enter your message..."
              aria-label="Message preview"
            />
            <p className="text-xs text-muted-foreground mt-1">
              You can customize this message before sending.
            </p>
          </div>

          {/* Anonymous Mode Warning */}
          {anon && (
            <div className="flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
              <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" aria-hidden="true" />
              <p className="text-sm text-amber-200">
                Cannot send {activeTab === 'video' ? 'videos' : 'playlists'} to patients while Anonymous Mode is active.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
          <button
            onClick={onClose}
            className="btn-secondary"
          >
            Cancel
          </button>
          
          <div className="relative">
            <button
              onClick={handleSend}
              onMouseEnter={handleAnonHover}
              onMouseLeave={() => setShowAnonTooltip(false)}
              disabled={anon || selectedPatients.length === 0}
              className={`
                btn-primary flex items-center gap-2
                ${(anon || selectedPatients.length === 0) ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              aria-label={anon ? 'Sending disabled in anonymous mode' : `Send video to ${selectedPatients.length} patients`}
            >
              <Send className="w-4 h-4" aria-hidden="true" />
              <span>Send</span>
            </button>
            
            {/* Tooltip for anonymous mode */}
            {showAnonTooltip && anon && (
              <div className="tooltip top-full mt-2 right-0">
                Cannot send while Anonymous Mode is active.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}