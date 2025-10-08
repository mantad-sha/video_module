'use client'

import React, { useState, useEffect } from 'react'
import Header from '@/components/Header'
import BackButton from '@/components/BackButton'
import RulesList from '@/components/rules/RulesList'
import RuleDialog from '@/components/rules/RuleDialog'
import DryRunDialog from '@/components/rules/DryRunDialog'
import HelpModal from '@/components/HelpModal'
import { Plus, EyeOff } from 'lucide-react'
import { useAnonMode } from '@/contexts/AnonModeContext'
import { useToast } from '@/contexts/ToastContext'

export interface Rule {
  id: string
  name: string
  enabled: boolean
  trigger: {
    tags: string[]
  }
  action: {
    videoIds: string[]
  }
  channel: 'in-app' | 'email'
  delayMinutes: number
}

// Mock initial dental hygiene rules
const initialRules: Rule[] = [
  {
    id: '1',
    name: 'New Patient Education',
    enabled: true,
    trigger: { tags: ['new-patient', 'preventive'] },
    action: { videoIds: ['1', '2', '3'] },
    channel: 'email',
    delayMinutes: 60,
  },
  {
    id: '2',
    name: 'Pediatric Care Instructions',
    enabled: false,
    trigger: { tags: ['pediatric', 'high-caries-risk'] },
    action: { videoIds: ['4', '5'] },
    channel: 'in-app',
    delayMinutes: 1440, // 24 hours
  },
]

export default function RulesPage() {
  const { anon } = useAnonMode()
  const { showToast } = useToast()
  const [rules, setRules] = useState<Rule[]>(initialRules)
  const [ruleDialogOpen, setRuleDialogOpen] = useState(false)
  const [editingRule, setEditingRule] = useState<Rule | null>(null)
  const [dryRunRule, setDryRunRule] = useState<Rule | null>(null)
  const [helpModalOpen, setHelpModalOpen] = useState(false)

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      const isInputFocused = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT'

      // Help shortcut (?)
      if (e.key === '?' && !isInputFocused) {
        e.preventDefault()
        setHelpModalOpen(true)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  const handleAddRule = () => {
    setEditingRule(null)
    setRuleDialogOpen(true)
  }

  const handleEditRule = (rule: Rule) => {
    setEditingRule(rule)
    setRuleDialogOpen(true)
  }

  const handleDeleteRule = (ruleId: string) => {
    setRules(rules.filter(r => r.id !== ruleId))
    showToast('Rule deleted successfully', 'success')
  }

  const handleToggleRule = (ruleId: string) => {
    setRules(rules.map(r => 
      r.id === ruleId ? { ...r, enabled: !r.enabled } : r
    ))
  }

  const handleSaveRule = (rule: Rule) => {
    if (editingRule) {
      setRules(rules.map(r => r.id === rule.id ? rule : r))
      showToast('Rule updated successfully', 'success')
    } else {
      setRules([...rules, { ...rule, id: Date.now().toString() }])
      showToast('Rule created successfully', 'success')
    }
    setRuleDialogOpen(false)
  }

  const handleDryRun = (rule: Rule) => {
    setDryRunRule(rule)
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
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold text-foreground">Automation Rules</h1>
              {anon && (
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-sm font-medium">
                  <EyeOff className="w-4 h-4" aria-hidden="true" />
                  <span>Anonymous</span>
                </span>
              )}
            </div>
            <p className="text-muted-foreground">
              Set up automatic video sending based on patient tags
            </p>
          </div>
          
          {/* Add Rule Button */}
          <div className="relative">
            <button
              onClick={() => !anon && handleAddRule()}
              disabled={anon}
              className={`btn-primary flex items-center gap-2 ${anon ? 'opacity-40 cursor-not-allowed' : ''}`}
              aria-label={anon ? 'Creating rules disabled while Anonymous Mode is active' : 'Add new automation rule'}
              title={anon ? 'Disabled while Anonymous Mode is active' : undefined}
            >
              <Plus className="w-5 h-5" aria-hidden="true" />
              <span>New rule</span>
            </button>
          </div>
        </div>

        {/* Anonymous Mode Warning */}
        {anon && (
          <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <p className="text-sm text-amber-300">
              Patient-specific actions are disabled while Anonymous Mode is active. Disable Anonymous Mode to create or manage automation rules.
            </p>
          </div>
        )}

        {/* Rules List */}
        <RulesList
          rules={rules}
          onEdit={handleEditRule}
          onDelete={handleDeleteRule}
          onToggle={handleToggleRule}
          onDryRun={handleDryRun}
        />

        {/* Rule Dialog */}
        <RuleDialog
          open={ruleDialogOpen}
          onClose={() => setRuleDialogOpen(false)}
          onSave={handleSaveRule}
          rule={editingRule}
        />

        {/* Dry Run Dialog */}
        <DryRunDialog
          open={!!dryRunRule}
          onClose={() => setDryRunRule(null)}
          rule={dryRunRule}
        />

        {/* Help Modal */}
        <HelpModal
          open={helpModalOpen}
          onClose={() => setHelpModalOpen(false)}
        />
      </main>
    </div>
  )
}
