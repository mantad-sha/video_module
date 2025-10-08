'use client'

import React, { useEffect, useRef } from 'react'
import { X, Keyboard } from 'lucide-react'

interface HelpModalProps {
  open: boolean
  onClose: () => void
}

const shortcuts = [
  { key: 'F', description: 'Focus search input' },
  { key: 'C', description: 'Open category filter' },
  { key: '↑↓←→', description: 'Move between cards', displayKey: 'Arrow keys' },
  { key: 'Enter', description: 'Primary action (Play) on focused card' },
  { key: 'P', description: 'Play video' },
  { key: 'S', description: 'Send video' },
  { key: 'A', description: 'Toggle Anonymous Mode' },
  { key: '?', description: 'Open this help dialog' },
  { key: 'Esc', description: 'Close dialogs and modals' },
]

export default function HelpModal({ open, onClose }: HelpModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)

  // Store previous focus and set initial focus
  useEffect(() => {
    if (open) {
      previousActiveElement.current = document.activeElement as HTMLElement
      setTimeout(() => {
        closeButtonRef.current?.focus()
      }, 100)
    } else {
      // Restore focus when dialog closes
      setTimeout(() => {
        previousActiveElement.current?.focus()
      }, 100)
    }
  }, [open])

  // Handle keyboard events and focus trap
  useEffect(() => {
    if (!open) return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape closes dialog
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }

      // Tab trap - keep focus within dialog
      if (e.key === 'Tab') {
        const focusableElements = dialogRef.current?.querySelectorAll(
          'button:not([disabled]), a:not([disabled]), [tabindex]:not([tabindex="-1"])'
        ) as NodeListOf<HTMLElement>
        
        if (!focusableElements || focusableElements.length === 0) return

        const firstElement = focusableElements[0]
        const lastElement = focusableElements[focusableElements.length - 1]

        if (e.shiftKey) {
          // Shift+Tab: move focus backward
          if (document.activeElement === firstElement) {
            e.preventDefault()
            lastElement.focus()
          }
        } else {
          // Tab: move focus forward
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
        ref={dialogRef}
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg glass-card shadow-glass z-50"
        role="dialog"
        aria-modal="true"
        aria-labelledby="help-dialog-title"
        aria-describedby="help-dialog-description"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <Keyboard className="w-5 h-5 text-primary" aria-hidden="true" />
            <h2 id="help-dialog-title" className="text-xl font-semibold text-foreground">
              Keyboard Shortcuts
            </h2>
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="p-2.5 min-w-[44px] min-h-[44px] rounded-lg bg-white/[0.05] hover:bg-white/[0.1] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            aria-label="Close help dialog"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6" id="help-dialog-description">
          <p className="text-sm text-muted-foreground mb-6">
            Use these keyboard shortcuts to navigate quickly through the application.
          </p>

          <div className="space-y-2">
            {shortcuts.map((shortcut) => (
              <div 
                key={shortcut.key} 
                className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <kbd className="px-2 py-1 min-w-[60px] text-xs font-mono font-medium bg-secondary text-secondary-foreground border border-border rounded text-center">
                    {shortcut.displayKey || shortcut.key}
                  </kbd>
                  <span className="text-sm text-foreground">
                    {shortcut.description}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-primary/10 border border-primary/30 rounded-lg">
            <p className="text-xs text-primary">
              <strong>Tip:</strong> Most shortcuts work when not typing in input fields. 
              Press <kbd className="px-1 py-0.5 text-xs font-mono bg-primary/20 rounded">?</kbd> anytime to open this help.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-6 border-t border-border">
          <button
            onClick={onClose}
            className="btn-primary"
          >
            Got it
          </button>
        </div>
      </div>
    </>
  )
}
