export interface NudgeRule {
  id: string
  hours: number // Default 48 hours
  active: boolean
}

export interface PendingNudge {
  id: string
  shareId: string
  videoId?: string
  playlistId?: string
  patientId: string
  patientName?: string
  videoTitle?: string
  playlistName?: string
  dueAt: string
  sent: boolean
  createdAt: string
}

export interface VideoShare {
  id: string
  videoId?: string
  playlistId?: string
  patientId: string
  sharedAt: string
  viewed: boolean
  viewedAt?: string
}
