'use client'

import React, { useEffect, useState } from 'react'
import { X, Tag, Video, Mail, Smartphone, Clock } from 'lucide-react'
import { Rule } from '@/app/videos/rules/page'

// Mock dental hygiene data
const availableTags = [
  'new-patient', 'pediatric', 'adult', 'elderly', 
  'high-caries-risk', 'periodontal', 'pregnant', 'diabetic',
  'orthodontic', 'post-treatment', 'preventive', 'cosmetic'
]

const mockVideos = [
  { id: '1', title: 'Proper Brushing Technique' },
  { id: '2', title: 'Flossing Made Easy' },
  { id: '3', title: 'Electric Toothbrush Tips' },
  { id: '4', title: "Caring for Children's Teeth" },
  { id: '5', title: 'Why Fluoride Matters' },
  { id: '6', title: 'Scaling and Root Planing: What to Expect' },
]

interface RuleDialogProps {
  open: boolean
  onClose: () => void
  onSave: (rule: Rule) => void
  rule: Rule | null
}

export default function RuleDialog({ open, onClose, onSave, rule }: RuleDialogProps) {
  const [formData, setFormData] = useState<Omit<Rule, 'id'>>({
    name: '',
    enabled: true,
    trigger: { tags: [] },
    action: { videoIds: [] },
    channel: 'email',
    delayMinutes: 60,
  })

  useEffect(() => {
    if (rule) {
      setFormData({
        name: rule.name,
        enabled: rule.enabled,
        trigger: { tags: [...rule.trigger.tags] },
        action: { videoIds: [...rule.action.videoIds] },
        channel: rule.channel,
        delayMinutes: rule.delayMinutes,
      })
    } else {
      setFormData({
        name: '',
        enabled: true,
        trigger: { tags: [] },
        action: { videoIds: [] },
        channel: 'email',
        delayMinutes: 60,
      })
    }
  }, [rule, open])

  const handleToggleTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      trigger: {
        tags: prev.trigger.tags.includes(tag)
          ? prev.trigger.tags.filter(t => t !== tag)
          : [...prev.trigger.tags, tag]
      }
    }))
  }

  const handleToggleVideo = (videoId: string) => {
    setFormData(prev => ({
      ...prev,
      action: {
        videoIds: prev.action.videoIds.includes(videoId)
          ? prev.action.videoIds.filter(v => v !== videoId)
          : [...prev.action.videoIds, videoId]
      }
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) return
    if (formData.trigger.tags.length === 0) return
    if (formData.action.videoIds.length === 0) return

    onSave({
      id: rule?.id || Date.now().toString(),
      ...formData
    })
  }

  if (!open) return null

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
        aria-labelledby="rule-dialog-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 id="rule-dialog-title" className="text-xl font-semibold text-foreground">
            {rule ? 'Edit Rule' : 'New Automation Rule'}
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
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(90vh-180px)] overflow-y-auto">
          {/* Rule Name */}
          <div>
            <label htmlFor="rule-name" className="block text-sm font-medium text-foreground mb-2">
              Rule Name
            </label>
            <input
              id="rule-name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="glass-input"
              placeholder="e.g., Post-Surgery Education"
              required
            />
          </div>

          {/* Trigger - Tags */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-3">
              <Tag className="w-4 h-4" aria-hidden="true" />
              Trigger: When a patient has tags...
            </label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleToggleTag(tag)}
                  className={`
                    px-3 py-1.5 rounded-lg border transition-all duration-200
                    ${formData.trigger.tags.includes(tag)
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-secondary text-secondary-foreground border-border hover:bg-secondary/80'
                    }
                  `}
                  aria-pressed={formData.trigger.tags.includes(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
            {formData.trigger.tags.length === 0 && (
              <p className="text-xs text-red-400 mt-1">Select at least one tag</p>
            )}
          </div>

          {/* Action - Videos */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-3">
              <Video className="w-4 h-4" aria-hidden="true" />
              Action: Send video(s)...
            </label>
            <div className="space-y-2">
              {mockVideos.map((video) => (
                <label
                  key={video.id}
                  className={`
                    flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-200
                    ${formData.action.videoIds.includes(video.id)
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:bg-secondary/50'
                    }
                  `}
                >
                  <input
                    type="checkbox"
                    checked={formData.action.videoIds.includes(video.id)}
                    onChange={() => handleToggleVideo(video.id)}
                    className="w-5 h-5 rounded border-white/20 bg-transparent text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                  />
                  <span className="text-sm text-foreground">{video.title}</span>
                </label>
              ))}
            </div>
            {formData.action.videoIds.length === 0 && (
              <p className="text-xs text-red-400 mt-1">Select at least one video</p>
            )}
          </div>

          {/* Channel */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Channel
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 rounded-lg border border-border cursor-pointer hover:bg-secondary/50 transition-colors">
                <input
                  type="radio"
                  name="channel"
                  value="email"
                  checked={formData.channel === 'email'}
                  onChange={(e) => setFormData({ ...formData, channel: e.target.value as 'email' | 'in-app' })}
                  className="w-5 h-5"
                />
                <Mail className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                <span className="text-sm text-foreground">Email</span>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-lg border border-border cursor-pointer hover:bg-secondary/50 transition-colors">
                <input
                  type="radio"
                  name="channel"
                  value="in-app"
                  checked={formData.channel === 'in-app'}
                  onChange={(e) => setFormData({ ...formData, channel: e.target.value as 'email' | 'in-app' })}
                  className="w-5 h-5"
                />
                <Smartphone className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                <span className="text-sm text-foreground">In-app</span>
              </label>
            </div>
          </div>

          {/* Delay */}
          <div>
            <label htmlFor="delay-minutes" className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
              <Clock className="w-4 h-4" aria-hidden="true" />
              Delay (minutes)
            </label>
            <input
              id="delay-minutes"
              type="number"
              min="0"
              value={formData.delayMinutes}
              onChange={(e) => setFormData({ ...formData, delayMinutes: parseInt(e.target.value) || 0 })}
              className="glass-input"
              placeholder="60"
            />
            <p className="text-xs text-muted-foreground mt-1">
              How long to wait after the trigger before sending videos
            </p>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!formData.name.trim() || formData.trigger.tags.length === 0 || formData.action.videoIds.length === 0}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {rule ? 'Update Rule' : 'Create Rule'}
          </button>
        </div>
      </div>
    </>
  )
}
