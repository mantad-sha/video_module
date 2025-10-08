'use client'

import React, { useState } from 'react'
import { Edit2, Trash2, Play, ToggleLeft, ToggleRight, Mail, Smartphone, Clock, Tag } from 'lucide-react'
import { Rule } from '@/app/videos/rules/page'
import { useAnonMode } from '@/contexts/AnonModeContext'

// Mock dental hygiene video data for display
const mockVideos = [
  { id: '1', title: 'Proper Brushing Technique' },
  { id: '2', title: 'Flossing Made Easy' },
  { id: '3', title: 'Electric Toothbrush Tips' },
  { id: '4', title: "Caring for Children's Teeth" },
  { id: '5', title: 'Why Fluoride Matters' },
  { id: '6', title: 'Scaling and Root Planing: What to Expect' },
]

// Mock dental hygiene related tags
const availableTags = [
  'new-patient', 'pediatric', 'adult', 'elderly', 
  'high-caries-risk', 'periodontal', 'pregnant', 'diabetic',
  'orthodontic', 'post-treatment', 'preventive', 'cosmetic'
]

interface RulesListProps {
  rules: Rule[]
  onEdit: (rule: Rule) => void
  onDelete: (ruleId: string) => void
  onToggle: (ruleId: string) => void
  onDryRun: (rule: Rule) => void
}

export default function RulesList({ rules, onEdit, onDelete, onToggle, onDryRun }: RulesListProps) {
  const { anon } = useAnonMode()
  const [hoveredDryRun, setHoveredDryRun] = useState<string | null>(null)

  const getVideoTitles = (videoIds: string[]) => {
    return videoIds
      .map(id => mockVideos.find(v => v.id === id)?.title)
      .filter(Boolean)
      .join(', ')
  }

  const formatDelay = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`
    if (minutes < 1440) return `${Math.floor(minutes / 60)} hour${Math.floor(minutes / 60) > 1 ? 's' : ''}`
    return `${Math.floor(minutes / 1440)} day${Math.floor(minutes / 1440) > 1 ? 's' : ''}`
  }

  if (rules.length === 0) {
    return (
      <div className="glass-card p-12 text-center">
        <div className="max-w-md mx-auto">
          <Play className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" aria-hidden="true" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            No automation rules yet
          </h3>
          <p className="text-muted-foreground text-sm">
            Create your first rule to automatically send videos to patients based on their tags.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {rules.map((rule) => (
        <div
          key={rule.id}
          className={`glass-card p-6 transition-all duration-200 ${
            !rule.enabled ? 'opacity-60' : ''
          }`}
        >
          {/* Rule Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              {/* Enable/Disable Toggle */}
              <button
                onClick={() => !anon && onToggle(rule.id)}
                disabled={anon}
                className={`p-2.5 min-w-[44px] min-h-[44px] rounded-lg bg-white/[0.05] hover:bg-white/[0.1] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${anon ? 'opacity-40 cursor-not-allowed' : ''}`}
                aria-label={anon ? 'Rule toggling disabled while Anonymous Mode is active' : (rule.enabled ? 'Disable rule' : 'Enable rule')}
                title={anon ? 'Disabled while Anonymous Mode is active' : undefined}
              >
                {rule.enabled ? (
                  <ToggleRight className={`w-6 h-6 ${anon ? 'text-gray-400' : 'text-primary'}`} aria-hidden="true" />
                ) : (
                  <ToggleLeft className="w-6 h-6 text-muted-foreground" aria-hidden="true" />
                )}
              </button>

              <div>
                <h3 className="text-lg font-medium text-foreground">
                  {rule.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`
                    px-2 py-0.5 text-xs font-medium rounded-full
                    ${rule.enabled 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                      : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                    }
                  `}>
                    {rule.enabled ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  onClick={() => !anon && onDryRun(rule)}
                  onMouseEnter={() => anon && setHoveredDryRun(rule.id)}
                  onMouseLeave={() => setHoveredDryRun(null)}
                  onFocus={() => anon && setHoveredDryRun(rule.id)}
                  onBlur={() => setHoveredDryRun(null)}
                  disabled={anon}
                  className={`p-2.5 min-w-[44px] min-h-[44px] rounded-lg bg-white/[0.05] hover:bg-white/[0.1] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${anon ? 'opacity-40 cursor-not-allowed' : ''}`}
                  aria-label={anon ? 'Simulation disabled while Anonymous Mode is active' : 'Run simulation'}
                  title={anon ? undefined : 'Dry run'}
                >
                  <Play className="w-4 h-4 text-white" aria-hidden="true" />
                </button>
                
                {/* Tooltip for anonymous mode */}
                {hoveredDryRun === rule.id && anon && (
                  <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 z-20 px-3 py-2 text-xs bg-gray-900/95 backdrop-blur-sm text-white rounded-lg shadow-xl pointer-events-none whitespace-nowrap">
                    Disabled while Anonymous Mode is active
                  </div>
                )}
              </div>
              <button
                onClick={() => onEdit(rule)}
                className="p-2.5 min-w-[44px] min-h-[44px] rounded-lg bg-white/[0.05] hover:bg-white/[0.1] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                aria-label="Edit rule"
              >
                <Edit2 className="w-4 h-4 text-white" aria-hidden="true" />
              </button>
              <button
                onClick={() => onDelete(rule.id)}
                className="p-2.5 min-w-[44px] min-h-[44px] rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                aria-label="Delete rule"
              >
                <Trash2 className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Rule Details */}
          <div className="space-y-3 text-sm">
            {/* Trigger */}
            <div className="flex items-start gap-2">
              <Tag className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" aria-hidden="true" />
              <div>
                <span className="text-muted-foreground">When patient has tags: </span>
                <span className="text-foreground font-medium">
                  {rule.trigger.tags.map((tag, idx) => (
                    <span key={tag}>
                      <span className="inline-block px-2 py-0.5 bg-secondary rounded-md mr-1">
                        {tag}
                      </span>
                      {idx < rule.trigger.tags.length - 1 && ' '}
                    </span>
                  ))}
                </span>
              </div>
            </div>

            {/* Action */}
            <div className="flex items-start gap-2">
              <Play className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" aria-hidden="true" />
              <div>
                <span className="text-muted-foreground">Send videos: </span>
                <span className="text-foreground font-medium">
                  {getVideoTitles(rule.action.videoIds) || 'No videos selected'}
                </span>
              </div>
            </div>

            {/* Channel & Delay */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {rule.channel === 'email' ? (
                  <Mail className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                ) : (
                  <Smartphone className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                )}
                <span className="text-muted-foreground">Via: </span>
                <span className="text-foreground font-medium">
                  {rule.channel === 'email' ? 'Email' : 'In-app'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                <span className="text-muted-foreground">After: </span>
                <span className="text-foreground font-medium">
                  {formatDelay(rule.delayMinutes)}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
