'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useSearchParams } from 'next/navigation'

interface AnonModeContextType {
  anon: boolean
  setAnon: (value: boolean) => void
}

const AnonModeContext = createContext<AnonModeContextType | undefined>(undefined)

const STORAGE_KEY = 'dh-app:anon'

export function AnonModeProvider({ children }: { children: ReactNode }) {
  const [anon, setAnonState] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const searchParams = useSearchParams()

  // Initialize from localStorage and URL params
  useEffect(() => {
    // Development logging for persistence verification
    if (process.env.NODE_ENV === 'development') {
      console.log('[AnonMode] Initializing context...')
    }
    
    // Check URL parameter first
    const urlAnon = searchParams.get('anon')
    if (urlAnon !== null) {
      const shouldBeAnon = urlAnon === '1'
      setAnonState(shouldBeAnon)
      // Save to localStorage when set via URL
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(shouldBeAnon))
        if (process.env.NODE_ENV === 'development') {
          console.log(`[AnonMode] Set from URL param: ${shouldBeAnon}`)
        }
      } catch (e) {
        console.error('Failed to save anonymous mode to localStorage:', e)
      }
    } else {
      // If no URL param, check localStorage
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored !== null) {
          const storedValue = JSON.parse(stored)
          setAnonState(storedValue)
          if (process.env.NODE_ENV === 'development') {
            console.log(`[AnonMode] Restored from localStorage: ${storedValue}`)
          }
        } else if (process.env.NODE_ENV === 'development') {
          console.log('[AnonMode] No stored value, using default: false')
        }
      } catch (e) {
        console.error('Failed to load anonymous mode from localStorage:', e)
      }
    }
    setIsInitialized(true)
  }, [searchParams])

  // Custom setAnon that also updates localStorage
  const setAnon = (value: boolean) => {
    setAnonState(value)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
      if (process.env.NODE_ENV === 'development') {
        console.log(`[AnonMode] State changed to: ${value}, saved to localStorage`)
      }
    } catch (e) {
      console.error('Failed to save anonymous mode to localStorage:', e)
    }
  }

  // Keyboard shortcut for anonymous mode (a)
  useEffect(() => {
    if (!isInitialized) return

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'a' && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
        const target = e.target as HTMLElement
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA' && target.tagName !== 'SELECT') {
          e.preventDefault()
          setAnon(!anon)
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [anon, isInitialized])

  return (
    <AnonModeContext.Provider value={{ anon, setAnon }}>
      {children}
    </AnonModeContext.Provider>
  )
}

export function useAnonMode() {
  const context = useContext(AnonModeContext)
  if (context === undefined) {
    throw new Error('useAnonMode must be used within an AnonModeProvider')
  }
  return context
}
