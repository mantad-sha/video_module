export interface Playlist {
  id: string
  name: string
  description?: string
  videoIds: string[]
  createdAt: string
  updatedAt: string
}

export interface PlaylistShare {
  id: string
  playlistId: string
  patientId: string
  sentAt: string
  completed: boolean
  watchedCount: number
}
