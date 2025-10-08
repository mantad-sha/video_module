'use client'

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { Check, X, Info } from 'lucide-react'

interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

interface ToastContextType {
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString()
    const newToast: Toast = { id, message, type }
    
    setToasts(prev => [...prev, newToast])
    
    // Auto remove after 4 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 4000)
  }, [])

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast Container */}
      <div 
        className="fixed bottom-6 right-6 z-50 space-y-3"
        role="region" 
        aria-live="polite" 
        aria-label="Oznámení"
      >
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`
              flex items-center gap-3 px-4 py-3 min-w-[300px] max-w-[500px] rounded-lg
              glass-card backdrop-blur-md shadow-glass-sm
              animate-in slide-in-from-bottom-5 fade-in duration-300
              ${toast.type === 'success' ? 'border-green-500/30' : ''}
              ${toast.type === 'error' ? 'border-red-500/30' : ''}
              ${toast.type === 'info' ? 'border-blue-500/30' : ''}
            `}
          >
            {/* Icon */}
            <div className={`
              flex-shrink-0
              ${toast.type === 'success' ? 'text-green-500' : ''}
              ${toast.type === 'error' ? 'text-red-500' : ''}
              ${toast.type === 'info' ? 'text-blue-500' : ''}
            `}>
              {toast.type === 'success' && <Check className="w-5 h-5" aria-hidden="true" />}
              {toast.type === 'error' && <X className="w-5 h-5" aria-hidden="true" />}
              {toast.type === 'info' && <Info className="w-5 h-5" aria-hidden="true" />}
            </div>
            
            {/* Message */}
            <p className="flex-1 text-sm text-foreground">
              {toast.message}
            </p>
            
            {/* Close button */}
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 p-2 min-w-[32px] min-h-[32px] rounded-lg hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              aria-label="Close notification"
            >
              <X className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
