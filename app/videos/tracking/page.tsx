'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import BackButton from '@/components/BackButton'
import { Video, Send, Eye, Clock, EyeOff, Download, Bell, BellOff, Settings, AlertCircle, CheckCircle } from 'lucide-react'
import { useAnonMode } from '@/contexts/AnonModeContext'
import { useToast } from '@/contexts/ToastContext'
import { useNudge } from '@/contexts/NudgeContext'

// Mock tracking data for dental hygiene videos
const mockTrackingData = [
  { 
    id: '1', 
    videoTitle: 'Proper Brushing Technique', 
    sentCount: 28, 
    views: 342, 
    lastSentAt: '2024-01-16 14:30',
    lastViewedAt: '2024-01-16 15:45'
  },
  { 
    id: '2', 
    videoTitle: 'Flossing Made Easy', 
    sentCount: 15, 
    views: 189,
    lastSentAt: '2024-01-16 11:20',
    lastViewedAt: '2024-01-16 13:15'
  },
  { 
    id: '3', 
    videoTitle: 'Electric Toothbrush Tips', 
    sentCount: 22, 
    views: 276,
    lastSentAt: '2024-01-15 09:00',
    lastViewedAt: '2024-01-16 10:30'
  },
  { 
    id: '4', 
    videoTitle: "Caring for Children's Teeth", 
    sentCount: 42, 
    views: 523,
    lastSentAt: '2024-01-16 08:15',
    lastViewedAt: '2024-01-16 16:00'
  },
  { 
    id: '5', 
    videoTitle: 'Why Fluoride Matters', 
    sentCount: 11, 
    views: 167,
    lastSentAt: '2024-01-15 15:45',
    lastViewedAt: '2024-01-16 09:30'
  },
  { 
    id: '9', 
    videoTitle: 'Whitening: Safety and Aftercare', 
    sentCount: 56, 
    views: 634,
    lastSentAt: '2024-01-16 12:00',
    lastViewedAt: '2024-01-16 14:20'
  },
]

/**
 * SMOKE TEST for Anonymous Mode Persistence
 * 
 * To verify Anonymous Mode persists across routes:
 * 
 * 1. Navigate to /videos and enable Anonymous Mode (press 'A' or click toggle)
 * 2. Check localStorage: localStorage.getItem('dh-app:anon') should be 'true'
 * 3. Navigate to /videos/tracking - Anonymous badge should still be visible
 * 4. Navigate to /videos/rules - Anonymous badge and disabled states persist
 * 5. Refresh the page - Anonymous Mode state is restored from localStorage
 * 6. Navigate back to /videos - State remains consistent
 * 
 * The state persists because:
 * - AnonModeContext is provided at the root level in ClientLayout
 * - localStorage key 'dh-app:anon' stores the state persistently
 * - Context reads from localStorage on mount and saves on every change
 * - All video pages use the same useAnonMode() hook from the context
 */

export default function TrackingPage() {
  const { anon } = useAnonMode()
  const { showToast } = useToast()
  const { 
    nudgeRule, 
    updateNudgeRule, 
    pendingNudges, 
    sentNudges, 
    totalRemindersSent 
  } = useNudge()
  const [showExportTooltip, setShowExportTooltip] = useState(false)
  const [showSettingsPanel, setShowSettingsPanel] = useState(false)

  const formatDateTime = (dateTime: string) => {
    if (anon) return '**:**'
    return dateTime
  }

  /**
   * Generate and download CSV file from tracking data
   * Respects Anonymous Mode by disabling export when active
   * 
   * TEST IN BROWSER:
   * 1. Open DevTools Console
   * 2. Run: document.querySelector('[aria-label*="Export"]').click()
   * 3. Verify CSV downloads as "videos-tracking.csv"
   * 
   * TEST ANONYMOUS MODE:
   * 1. Enable Anonymous Mode: localStorage.setItem('dh-app:anon', 'true'); location.reload()
   * 2. Try to export - button should be disabled
   * 3. Disable: localStorage.setItem('dh-app:anon', 'false'); location.reload()
   * 4. Export should work again
   */
  const handleExportCSV = () => {
    if (anon) return // Don't export in anonymous mode

    // CSV Headers
    const headers = ['Video Title', 'Sent Count', 'Views', 'Last Sent', 'Last Viewed']
    
    // Generate CSV rows
    const rows = mockTrackingData.map(item => [
      item.videoTitle,
      item.sentCount.toString(),
      item.views.toString(),
      formatDateTime(item.lastSentAt),
      formatDateTime(item.lastViewedAt)
    ])

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    link.setAttribute('href', url)
    link.setAttribute('download', 'videos-tracking.csv')
    link.style.visibility = 'hidden'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    // Clean up URL
    URL.revokeObjectURL(url)
    
    // Show success toast
    showToast('CSV file exported successfully', 'success')
    console.log('[Export] CSV file downloaded: videos-tracking.csv')
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className={`${anon ? 'pt-28' : 'pt-16'} p-6 transition-all duration-200`}>
        {/* Back Button */}
        <div className="mb-6">
          <BackButton href="/videos" label="Back to Videos" />
        </div>

        {/* Page Title */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-bold text-foreground">Video Tracking</h1>
            {anon && (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-sm font-medium">
                <EyeOff className="w-4 h-4" aria-hidden="true" />
                <span>Anonymous</span>
              </span>
            )}
          </div>
          
          {/* Navigation Links */}
          <div className="flex items-center gap-4">
            <Link
              href="/videos"
              className="text-sm text-primary hover:text-primary/90 hover:underline transition-colors"
            >
              ← Video Library
            </Link>
            <Link
              href="/videos/rules"
              className="text-sm text-primary hover:text-primary/90 hover:underline transition-colors"
            >
              Automation Rules →
            </Link>
          </div>
        </div>

        {/* Anonymous Mode Warning */}
        {anon && (
          <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <p className="text-sm text-amber-300">
              Detailed timestamps are hidden while Anonymous Mode is active. Patient-specific data is masked for privacy.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content - 3 columns */}
          <div className="lg:col-span-3 space-y-6">
            {/* Tracking Table */}
            <div className="glass-card overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-lg font-semibold text-foreground">Video Analytics</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-6 py-4 text-left text-sm font-medium text-white/60">Video Title</th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-white/60">
                    <div className="flex items-center justify-center gap-1">
                      <Send className="w-4 h-4" />
                      <span>Sent Count</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-white/60">
                    <div className="flex items-center justify-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>Views</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-white/60">
                    <div className="flex items-center justify-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>Last Sent</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-white/60">
                    <div className="flex items-center justify-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>Last Viewed</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockTrackingData.map((item, index) => (
                  <tr 
                    key={item.id} 
                    className={`border-b border-white/5 hover:bg-white/[0.02] transition-colors ${
                      index % 2 === 0 ? 'bg-white/[0.01]' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Video className="w-4 h-4 text-white/40" />
                        <span className="text-sm font-medium text-white">{item.videoTitle}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center px-2.5 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium">
                        {item.sentCount}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center px-2.5 py-1 bg-green-500/20 text-green-300 rounded-full text-sm font-medium">
                        {item.views}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-white/60">
                      {formatDateTime(item.lastSentAt)}
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-white/60">
                      {formatDateTime(item.lastViewedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Export Button */}
          <div className="p-4 border-t border-white/10 flex justify-end">
            <div className="relative">
              <button
                onClick={handleExportCSV}
                onMouseEnter={() => anon && setShowExportTooltip(true)}
                onMouseLeave={() => setShowExportTooltip(false)}
                onFocus={() => anon && setShowExportTooltip(true)}
                onBlur={() => setShowExportTooltip(false)}
                disabled={anon}
                className={`inline-flex items-center gap-2 px-4 py-2 min-h-[44px] bg-primary/10 text-primary border border-primary/20 rounded-lg hover:bg-primary/20 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                  anon ? 'opacity-40 cursor-not-allowed' : ''
                }`}
                aria-label={anon ? 'CSV export disabled while Anonymous Mode is active' : 'Export data as CSV'}
              >
                <Download className="w-4 h-4" aria-hidden="true" />
                <span>Export CSV</span>
              </button>
              
              {/* Tooltip for anonymous mode */}
              {showExportTooltip && anon && (
                <div className="absolute bottom-full mb-2 right-0 z-20 px-3 py-2 text-xs bg-gray-900/95 backdrop-blur-sm text-white rounded-lg shadow-xl pointer-events-none whitespace-nowrap">
                  Disabled while Anonymous Mode is active
                </div>
              )}
            </div>
          </div>
        </div>

            {/* Nudges Section */}
            <div className="glass-card overflow-hidden">
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Reminder Nudges
                </h2>
                <div className="text-sm text-muted-foreground">
                  Total sent: <span className="font-medium text-foreground">{totalRemindersSent}</span>
                </div>
              </div>
              
              <div className="p-6">
                {/* Pending Nudges */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-white/80 mb-3">
                    Pending Reminders ({pendingNudges.length})
                  </h3>
                  {pendingNudges.length > 0 ? (
                    <div className="space-y-2">
                      {pendingNudges.slice(0, 5).map(nudge => (
                        <div key={nudge.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Clock className="w-4 h-4 text-yellow-500" />
                            <div>
                              <p className="text-sm">
                                {anon ? 'Patient' : nudge.patientName} - {nudge.videoTitle || nudge.playlistName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Due: {new Date(nudge.dueAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                      {pendingNudges.length > 5 && (
                        <p className="text-xs text-muted-foreground mt-2">
                          +{pendingNudges.length - 5} more pending
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No pending reminders</p>
                  )}
                </div>

                {/* Sent Nudges */}
                <div>
                  <h3 className="text-sm font-medium text-white/80 mb-3">
                    Sent Reminders ({sentNudges.length})
                  </h3>
                  {sentNudges.length > 0 ? (
                    <div className="space-y-2">
                      {sentNudges.slice(-3).reverse().map(nudge => (
                        <div key={nudge.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg opacity-60">
                          <div className="flex items-center gap-3">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <div>
                              <p className="text-sm">
                                {anon ? 'Patient' : nudge.patientName} - {nudge.videoTitle || nudge.playlistName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Sent: {new Date(nudge.dueAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No reminders sent yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Settings Panel */}
          <div className="lg:col-span-1">
            <div className="glass-card overflow-hidden sticky top-20">
              <div className="p-4 border-b border-white/10">
                <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Nudge Settings
                </h2>
              </div>
              
              <div className="p-4 space-y-4">
                {/* Auto-nudge toggle */}
                <div className="flex items-center justify-between">
                  <label htmlFor="auto-nudge" className="text-sm font-medium">
                    Auto-nudge
                  </label>
                  <button
                    id="auto-nudge"
                    onClick={() => !anon && updateNudgeRule({ active: !nudgeRule.active })}
                    disabled={anon}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      nudgeRule.active && !anon ? 'bg-primary' : 'bg-white/20'
                    } ${anon ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                    role="switch"
                    aria-checked={nudgeRule.active}
                    aria-label="Toggle auto-nudge"
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      nudgeRule.active ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                {/* Delay input */}
                <div>
                  <label htmlFor="nudge-delay" className="block text-sm font-medium mb-2">
                    Reminder delay
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      id="nudge-delay"
                      type="number"
                      min="1"
                      max="168"
                      value={nudgeRule.hours}
                      onChange={(e) => !anon && updateNudgeRule({ hours: parseInt(e.target.value) || 48 })}
                      disabled={anon || !nudgeRule.active}
                      className="glass-input flex-1"
                    />
                    <span className="text-sm text-muted-foreground">hours</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Default: 48 hours (2 days)
                  </p>
                </div>

                {/* Status */}
                <div className="pt-2 border-t border-white/10">
                  <div className="flex items-center gap-2 text-sm">
                    {nudgeRule.active && !anon ? (
                      <>
                        <Bell className="w-4 h-4 text-green-500" />
                        <span className="text-green-400">Active</span>
                      </>
                    ) : anon ? (
                      <>
                        <BellOff className="w-4 h-4 text-yellow-500" />
                        <span className="text-yellow-400">Disabled in Anon Mode</span>
                      </>
                    ) : (
                      <>
                        <BellOff className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Inactive</span>
                      </>
                    )}
                  </div>
                  {anon && (
                    <p className="text-xs text-yellow-400 mt-2">
                      Nudges cannot be sent while Anonymous Mode is active
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
