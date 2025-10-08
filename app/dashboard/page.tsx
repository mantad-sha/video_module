'use client'

import React from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import { Video, Calendar, Users, FileText, Package, MessageSquare } from 'lucide-react'
import { useAnonMode } from '@/contexts/AnonModeContext'

const modules = [
  { href: '/videos', label: 'Video Library', icon: Video, description: 'Manage and share educational videos' },
  { href: '/calendar', label: 'Calendar', icon: Calendar, description: 'Schedule appointments and events' },
  { href: '/patients', label: 'Patients', icon: Users, description: 'Manage patient records' },
  { href: '/billing', label: 'Billing', icon: FileText, description: 'Invoices and payments' },
  { href: '/inventory', label: 'Inventory', icon: Package, description: 'Track medical supplies' },
  { href: '/messages', label: 'Messages', icon: MessageSquare, description: 'Communication center' },
]

export default function DashboardPage() {
  const { anon } = useAnonMode()

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className={`${anon ? 'pt-28' : 'pt-16'} p-6 transition-all duration-200`}>
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to Wikident Medical System</p>
        </div>

        {/* Module Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => {
            const Icon = module.icon
            const isAvailable = module.href === '/videos'
            
            return (
              <Link
                key={module.href}
                href={isAvailable ? module.href : '#'}
                className={`
                  glass-card p-6 transition-all duration-200
                  ${isAvailable 
                    ? 'glass-card-hover cursor-pointer' 
                    : 'opacity-50 cursor-not-allowed'
                  }
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background
                `}
                onClick={isAvailable ? undefined : (e) => e.preventDefault()}
                aria-disabled={!isAvailable}
              >
                <div className="flex items-start gap-4">
                  <div className={`
                    p-3 rounded-lg 
                    ${isAvailable ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted-foreground'}
                  `}>
                    <Icon className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      {module.label}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {module.description}
                    </p>
                    {!isAvailable && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Coming soon
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Quick Stats */}
        <div className="mt-12 glass-card p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">System Status</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-muted-foreground">Active Patients</p>
              <p className="text-2xl font-bold text-foreground">
                {anon ? '***' : '156'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Today's Appointments</p>
              <p className="text-2xl font-bold text-foreground">
                {anon ? '**' : '12'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending Tasks</p>
              <p className="text-2xl font-bold text-foreground">
                {anon ? '*' : '5'}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
