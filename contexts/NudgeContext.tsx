'use client'

import React, { createContext, useContext, useState, useEffect, useRef } from 'react'
import { NudgeRule, PendingNudge, VideoShare } from '@/types/nudge'
import { useToast } from './ToastContext'
import { useAnonMode } from './AnonModeContext'

interface NudgeContextType {
  nudgeRule: NudgeRule
  updateNudgeRule: (rule: Partial<NudgeRule>) => void
  pendingNudges: PendingNudge[]
  sentNudges: PendingNudge[]
  videoShares: VideoShare[]
  createVideoShare: (videoId: string | undefined, playlistId: string | undefined, patientIds: string[], videoTitle?: string, playlistName?: string) => void
  markShareViewed: (shareId: string) => void
  totalRemindersSent: number
}

const NudgeContext = createContext<NudgeContextType | null>(null)

export function useNudge() {
  const context = useContext(NudgeContext)
  if (!context) {
    throw new Error('useNudge must be used within NudgeProvider')
  }
  return context
}

// Mock patient names for demo
const mockPatients = [
  { id: '1', name: 'John Smith' },
  { id: '2', name: 'Mary Johnson' },
  { id: '3', name: 'Robert Williams' },
  { id: '4', name: 'Jennifer Davis' },
  { id: '5', name: 'Michael Brown' },
  { id: '6', name: 'Sarah Miller' },
]

export function NudgeProvider({ children }: { children: React.ReactNode }) {
  const { showToast } = useToast()
  const { anon } = useAnonMode()
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Load initial state from localStorage
  const [nudgeRule, setNudgeRule] = useState<NudgeRule>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('nudge-rule')
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch {
          // Invalid data
        }
      }
    }
    return {
      id: 'default',
      hours: 48,
      active: true
    }
  })

  const [pendingNudges, setPendingNudges] = useState<PendingNudge[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pending-nudges')
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch {
          return []
        }
      }
    }
    return []
  })

  const [videoShares, setVideoShares] = useState<VideoShare[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('video-shares')
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch {
          return []
        }
      }
    }
    return []
  })

  const [totalRemindersSent, setTotalRemindersSent] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('total-reminders-sent')
      return saved ? parseInt(saved, 10) : 0
    }
    return 0
  })

  // Save to localStorage when state changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('nudge-rule', JSON.stringify(nudgeRule))
    }
  }, [nudgeRule])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('pending-nudges', JSON.stringify(pendingNudges))
    }
  }, [pendingNudges])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('video-shares', JSON.stringify(videoShares))
    }
  }, [videoShares])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('total-reminders-sent', totalRemindersSent.toString())
    }
  }, [totalRemindersSent])

  const updateNudgeRule = (update: Partial<NudgeRule>) => {
    setNudgeRule(prev => ({ ...prev, ...update }))
  }

  const createVideoShare = (
    videoId: string | undefined, 
    playlistId: string | undefined, 
    patientIds: string[], 
    videoTitle?: string,
    playlistName?: string
  ) => {
    if (!nudgeRule.active || anon) return

    const now = new Date()
    const newShares: VideoShare[] = []
    const newNudges: PendingNudge[] = []

    patientIds.forEach(patientId => {
      const shareId = `share-${Date.now()}-${patientId}`
      const patient = mockPatients.find(p => p.id === patientId)
      
      // Create video share
      const share: VideoShare = {
        id: shareId,
        videoId,
        playlistId,
        patientId,
        sharedAt: now.toISOString(),
        viewed: false
      }
      newShares.push(share)

      // Create pending nudge
      const dueDate = new Date(now.getTime() + nudgeRule.hours * 60 * 60 * 1000)
      const nudge: PendingNudge = {
        id: `nudge-${Date.now()}-${patientId}`,
        shareId,
        videoId,
        playlistId,
        patientId,
        patientName: patient?.name,
        videoTitle,
        playlistName,
        dueAt: dueDate.toISOString(),
        sent: false,
        createdAt: now.toISOString()
      }
      newNudges.push(nudge)
    })

    setVideoShares(prev => [...prev, ...newShares])
    setPendingNudges(prev => [...prev, ...newNudges])
  }

  const markShareViewed = (shareId: string) => {
    setVideoShares(prev => prev.map(share =>
      share.id === shareId
        ? { ...share, viewed: true, viewedAt: new Date().toISOString() }
        : share
    ))
  }

  const checkAndSendNudges = () => {
    if (!nudgeRule.active || anon) return

    const now = new Date()
    let sentCount = 0

    setPendingNudges(prev => {
      return prev.map(nudge => {
        // Skip if already sent or not due yet
        if (nudge.sent || new Date(nudge.dueAt) > now) {
          return nudge
        }

        // Check if the share has been viewed
        const share = videoShares.find(s => s.id === nudge.shareId)
        if (share?.viewed) {
          // Mark as sent (but don't actually send since it was viewed)
          return { ...nudge, sent: true }
        }

        // Send reminder (simulate)
        sentCount++
        const itemName = nudge.videoTitle || nudge.playlistName || 'content'
        const patientName = nudge.patientName || 'Patient'
        showToast(
          `Reminder sent to ${patientName} for "${itemName}"`,
          'info'
        )

        return { ...nudge, sent: true }
      })
    })

    if (sentCount > 0) {
      setTotalRemindersSent(prev => prev + sentCount)
    }
  }

  // Check nudges on mount and every 60 seconds
  useEffect(() => {
    // Initial check
    checkAndSendNudges()

    // Set up interval
    checkIntervalRef.current = setInterval(() => {
      checkAndSendNudges()
    }, 60000) // 60 seconds

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current)
      }
    }
  }, [nudgeRule.active, anon, videoShares])

  const sentNudges = pendingNudges.filter(n => n.sent)

  return (
    <NudgeContext.Provider 
      value={{
        nudgeRule,
        updateNudgeRule,
        pendingNudges: pendingNudges.filter(n => !n.sent),
        sentNudges,
        videoShares,
        createVideoShare,
        markShareViewed,
        totalRemindersSent
      }}
    >
      {children}
    </NudgeContext.Provider>
  )
}
