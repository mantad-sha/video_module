'use client'

import React, { Suspense } from 'react'
import { AnonModeProvider } from '@/contexts/AnonModeContext'
import { ToastProvider } from '@/contexts/ToastContext'
import { NudgeProvider } from '@/contexts/NudgeContext'
import AnonBanner from '@/components/AnonBanner'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <AnonModeProvider>
        <ToastProvider>
          <NudgeProvider>
            <AnonBanner />
            {children}
          </NudgeProvider>
        </ToastProvider>
      </AnonModeProvider>
    </Suspense>
  )
}
