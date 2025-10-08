'use client'

import React from 'react'
import { User, Calendar } from 'lucide-react'
import { useAnonMode } from '@/contexts/AnonModeContext'
import { maskedName } from '@/utils/anon'
import { mockPatientAppointments, appointmentTypes } from '@/data/suggestions'

export interface Patient {
  id: string
  fullName: string
  avatarUrl?: string
}

// Mock patient data - 6 items
export const mockPatients: Patient[] = [
  { 
    id: '1', 
    fullName: 'John Smith',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
  },
  { 
    id: '2', 
    fullName: 'Mary Johnson',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mary'
  },
  { 
    id: '3', 
    fullName: 'Robert Williams',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Robert'
  },
  { 
    id: '4', 
    fullName: 'Jennifer Davis'
    // No avatar URL - will show initials
  },
  { 
    id: '5', 
    fullName: 'Michael Brown',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael'
  },
  { 
    id: '6', 
    fullName: 'Sarah Miller',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
  },
]

interface PatientPickerProps {
  selectedIds: string[]
  onSelectionChange: (ids: string[]) => void
}

export default function PatientPicker({ selectedIds, onSelectionChange }: PatientPickerProps) {
  const { anon } = useAnonMode()

  const handleTogglePatient = (patientId: string) => {
    if (selectedIds.includes(patientId)) {
      onSelectionChange(selectedIds.filter(id => id !== patientId))
    } else {
      onSelectionChange([...selectedIds, patientId])
    }
  }

  const handleSelectAll = () => {
    if (selectedIds.length === mockPatients.length) {
      onSelectionChange([])
    } else {
      onSelectionChange(mockPatients.map(p => p.id))
    }
  }

  // Helper to get display name (masked or full)
  const getDisplayName = (patient: Patient) => maskedName(patient.fullName, anon)

  // Helper to get initials for avatar fallback
  const getInitials = (fullName: string) => {
    return fullName
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <div className="space-y-3">
      {/* Select All Checkbox */}
      <div className="flex items-center gap-3 pb-2 border-b border-border">
        <input
          type="checkbox"
          id="select-all-patients"
          checked={selectedIds.length === mockPatients.length}
          onChange={handleSelectAll}
          className="w-5 h-5 rounded border-white/20 bg-transparent text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background cursor-pointer"
          aria-label="Select all patients"
        />
        <label htmlFor="select-all-patients" className="text-sm font-medium text-foreground cursor-pointer select-none">
          Select all ({selectedIds.length} of {mockPatients.length})
        </label>
      </div>

      {/* Patient List */}
      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
        {mockPatients.map(patient => {
          const displayName = getDisplayName(patient)
          const isSelected = selectedIds.includes(patient.id)
          
          return (
            <label
              key={patient.id}
              htmlFor={`patient-${patient.id}`}
              className={`
                flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 cursor-pointer select-none
                ${isSelected 
                  ? 'border-primary bg-primary/10' 
                  : 'border-border hover:bg-secondary/50'
                }
              `}
            >
              {/* Checkbox */}
              <input
                type="checkbox"
                id={`patient-${patient.id}`}
                checked={isSelected}
                onChange={() => handleTogglePatient(patient.id)}
                className="w-5 h-5 rounded border-white/20 bg-transparent text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background cursor-pointer"
                aria-label={`Select patient ${displayName}`}
              />
              
              {/* Avatar */}
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
                {anon || !patient.avatarUrl ? (
                  // Show initials when anonymous or no avatar
                  <span className="text-sm font-bold text-secondary-foreground">
                    {getInitials(patient.fullName)}
                  </span>
                ) : (
                  // Show avatar image when available and not anonymous
                  patient.avatarUrl.startsWith('http') ? (
                    <img 
                      src={patient.avatarUrl} 
                      alt=""
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to initials on image error
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                        const span = document.createElement('span')
                        span.className = 'text-sm font-bold text-secondary-foreground'
                        span.textContent = getInitials(patient.fullName)
                        target.parentElement?.appendChild(span)
                      }}
                    />
                  ) : (
                    // Generic user icon as fallback
                    <User className="w-5 h-5 text-secondary-foreground" aria-hidden="true" />
                  )
                )}
              </div>
              
              {/* Patient Name and Appointment */}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-foreground">
                  {displayName}
                </div>
                {!anon && (() => {
                  const appointment = mockPatientAppointments.find(a => a.patientId === patient.id)
                  const appointmentType = appointment && appointmentTypes.find(t => t.id === appointment.appointmentType)
                  
                  return appointmentType ? (
                    <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3" />
                      {appointmentType.label}
                    </div>
                  ) : (
                    <div className="text-xs text-muted-foreground">
                      ID: {patient.id}
                    </div>
                  )
                })()}
              </div>
              
              {/* Selected indicator (visual feedback) */}
              {isSelected && (
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" aria-hidden="true" />
              )}
            </label>
          )
        })}
      </div>
    </div>
  )
}

// Export the maskedName helper for use in other components
export { maskedName }