'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface BackButtonProps {
  href?: string
  label?: string
}

export default function BackButton({ href = '/dashboard', label = 'Back to Dashboard' }: BackButtonProps) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] text-sm font-medium text-white/80 hover:text-white bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 hover:border-white/20 rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      aria-label={label}
    >
      <ArrowLeft className="w-4 h-4" aria-hidden="true" />
      <span>{label}</span>
    </Link>
  )
}