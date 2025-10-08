import React from 'react'

interface StatsCardProps {
  title: string
  value: string | number
  icon?: React.ReactNode
}

export default function StatsCard({ title, value, icon }: StatsCardProps) {
  return (
    <div className="glass-card p-6 glass-card-hover" tabIndex={0} aria-label={`${title}: ${value}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-white/60 mb-1">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
        </div>
        {icon && (
          <div className="text-white/40">
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}