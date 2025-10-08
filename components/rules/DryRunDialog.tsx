'use client'

import React, { useMemo } from 'react'
import { X, Users, Video, Info } from 'lucide-react'
import { Rule } from '@/app/videos/rules/page'
import { useAnonMode } from '@/contexts/AnonModeContext'
import { maskedName } from '@/utils/anon'

// Mock patient data with dental hygiene tags
const mockPatientsWithTags = [
  { id: '1', fullName: 'John Smith', tags: ['adult', 'periodontal', 'diabetic'] },
  { id: '2', fullName: 'Mary Johnson', tags: ['new-patient', 'pediatric', 'preventive'] },
  { id: '3', fullName: 'Robert Williams', tags: ['elderly', 'high-caries-risk', 'diabetic'] },
  { id: '4', fullName: 'Jennifer Davis', tags: ['pregnant', 'adult', 'preventive'] },
  { id: '5', fullName: 'Michael Brown', tags: ['adult', 'orthodontic', 'cosmetic'] },
  { id: '6', fullName: 'Sarah Miller', tags: ['pediatric', 'high-caries-risk'] },
  { id: '7', fullName: 'James Wilson', tags: ['elderly', 'periodontal', 'post-treatment'] },
  { id: '8', fullName: 'Patricia Garcia', tags: ['adult', 'cosmetic', 'preventive'] },
]

// Mock dental hygiene video data
const mockVideos = [
  { id: '1', title: 'Proper Brushing Technique' },
  { id: '2', title: 'Flossing Made Easy' },
  { id: '3', title: 'Electric Toothbrush Tips' },
  { id: '4', title: "Caring for Children's Teeth" },
  { id: '5', title: 'Why Fluoride Matters' },
  { id: '6', title: 'Scaling and Root Planing: What to Expect' },
]

interface DryRunDialogProps {
  open: boolean
  onClose: () => void
  rule: Rule | null
}

export default function DryRunDialog({ open, onClose, rule }: DryRunDialogProps) {
  const { anon } = useAnonMode()

  // Calculate which patients would match the rule
  const matchingPatients = useMemo(() => {
    if (!rule) return []
    
    return mockPatientsWithTags.filter(patient => {
      // Check if patient has at least one of the required tags
      return rule.trigger.tags.some(tag => patient.tags.includes(tag))
    })
  }, [rule])

  // Get video titles for the rule
  const selectedVideos = useMemo(() => {
    if (!rule) return []
    
    return rule.action.videoIds
      .map(id => mockVideos.find(v => v.id === id))
      .filter(Boolean) as typeof mockVideos
  }, [rule])

  if (!open || !rule) return null

  const formatDelay = (minutes: number) => {
    if (minutes === 0) return 'immediately'
    if (minutes < 60) return `after ${minutes} minute${minutes > 1 ? 's' : ''}`
    if (minutes < 1440) {
      const hours = Math.floor(minutes / 60)
      return `after ${hours} hour${hours > 1 ? 's' : ''}`
    }
    const days = Math.floor(minutes / 1440)
    return `after ${days} day${days > 1 ? 's' : ''}`
  }

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
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] overflow-hidden glass-card shadow-glass z-50"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dryrun-dialog-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 id="dryrun-dialog-title" className="text-xl font-semibold text-foreground">
            Dry Run Preview
          </h2>
          <button
            onClick={onClose}
            className="p-2.5 min-w-[44px] min-h-[44px] rounded-lg bg-white/[0.05] hover:bg-white/[0.1] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[calc(90vh-140px)] overflow-y-auto">
          {/* Rule Summary */}
          <div className="glass-card p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
              <h3 className="text-sm font-medium text-foreground">Rule: {rule.name}</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              When patients have tags: {rule.trigger.tags.join(', ')}
            </p>
            <p className="text-sm text-muted-foreground">
              Send {selectedVideos.length} video{selectedVideos.length !== 1 ? 's' : ''} via {rule.channel === 'email' ? 'Email' : 'In-app'} {formatDelay(rule.delayMinutes)}
            </p>
          </div>

          {/* Results */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-foreground">
                Simulation Results
              </h3>
              <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium">
                {matchingPatients.length} patient{matchingPatients.length !== 1 ? 's' : ''} would receive {selectedVideos.length} video{selectedVideos.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Matching Patients */}
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4" aria-hidden="true" />
                  Matching Patients ({matchingPatients.length})
                </h4>
                {matchingPatients.length > 0 ? (
                  <div className="space-y-2">
                    {matchingPatients.map(patient => (
                      <div key={patient.id} className="p-3 glass-card rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {maskedName(patient.fullName, anon)}
                            </p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {patient.tags.map(tag => (
                                <span
                                  key={tag}
                                  className={`
                                    inline-block px-2 py-0.5 text-xs rounded-md
                                    ${rule.trigger.tags.includes(tag)
                                      ? 'bg-primary/20 text-primary border border-primary/30'
                                      : 'bg-secondary text-secondary-foreground'
                                    }
                                  `}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                          {!anon && (
                            <span className="text-xs text-muted-foreground">
                              ID: {patient.id}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No patients match the selected tags
                  </p>
                )}
              </div>

              {/* Videos to Send */}
              <div>
                <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                  <Video className="w-4 h-4" aria-hidden="true" />
                  Videos to Send ({selectedVideos.length})
                </h4>
                {selectedVideos.length > 0 ? (
                  <div className="space-y-2">
                    {selectedVideos.map(video => (
                      <div key={video.id} className="p-3 glass-card rounded-lg">
                        <p className="text-sm text-foreground">{video.title}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No videos selected
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Summary Message */}
          {matchingPatients.length > 0 && selectedVideos.length > 0 && (
            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <p className="text-sm text-green-400">
                <strong>Summary:</strong> These {matchingPatients.length} patients would receive {selectedVideos.length} video{selectedVideos.length !== 1 ? 's' : ''} via {rule.channel === 'email' ? 'email' : 'in-app notification'} {formatDelay(rule.delayMinutes)}.
              </p>
            </div>
          )}

          {/* Anonymous Mode Notice */}
          {anon && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
              <p className="text-xs text-amber-200">
                Patient names are hidden in anonymous mode. Contact information is not displayed.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
          <button
            onClick={onClose}
            className="btn-primary"
          >
            Close
          </button>
        </div>
      </div>
    </>
  )
}
