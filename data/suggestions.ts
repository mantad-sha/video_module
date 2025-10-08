export interface VideoSuggestion {
  videos?: string[]
  playlists?: string[]
}

export const appointmentSuggestions: Record<string, VideoSuggestion> = {
  "SRP": { 
    videos: ["6"], // Scaling and Root Planing: What to Expect
    playlists: ["3"] // Advanced Periodontal Care
  },
  "Prophy": { 
    videos: ["1", "2"], // Proper Brushing Technique, Flossing Made Easy
    playlists: ["1"] // New Patient Onboarding
  },
  "Whitening": { 
    videos: ["9"], // Whitening: Safety and Aftercare
    playlists: []
  },
  "Pediatric": {
    videos: ["4", "5"], // Caring for Children's Teeth, Why Fluoride Matters
    playlists: ["2"] // Pediatric Care Bundle
  },
  "Perio Maintenance": {
    videos: ["7"], // Periodontal Maintenance at Home
    playlists: ["3"] // Advanced Periodontal Care
  },
  "New Patient": {
    videos: ["1", "2", "3"], // Brushing, Flossing, Electric Toothbrush
    playlists: ["1"] // New Patient Onboarding
  },
  "Sensitivity": {
    videos: ["8"], // Sensitivity: Causes and Relief
    playlists: []
  },
  "Pregnancy": {
    videos: ["11"], // Oral Care During Pregnancy
    playlists: []
  }
}

export const appointmentTypes = [
  { id: "SRP", label: "Scaling & Root Planing" },
  { id: "Prophy", label: "Prophylaxis (Cleaning)" },
  { id: "Whitening", label: "Whitening Treatment" },
  { id: "Pediatric", label: "Pediatric Visit" },
  { id: "Perio Maintenance", label: "Periodontal Maintenance" },
  { id: "New Patient", label: "New Patient Exam" },
  { id: "Sensitivity", label: "Sensitivity Treatment" },
  { id: "Pregnancy", label: "Prenatal Consultation" }
]

// Mock patient appointments for demo
export const mockPatientAppointments = [
  { patientId: "1", appointmentType: "SRP", date: "2024-02-15" },
  { patientId: "2", appointmentType: "Pediatric", date: "2024-02-20" },
  { patientId: "3", appointmentType: "Whitening", date: "2024-02-18" },
  { patientId: "4", appointmentType: "Pregnancy", date: "2024-02-22" },
  { patientId: "5", appointmentType: "Prophy", date: "2024-02-16" },
  { patientId: "6", appointmentType: "Perio Maintenance", date: "2024-02-19" }
]

// Video metadata for display
export const videoMetadata: Record<string, { title: string; duration: string }> = {
  "1": { title: "Proper Brushing Technique", duration: "3:00" },
  "2": { title: "Flossing Made Easy", duration: "2:30" },
  "3": { title: "Electric Toothbrush Tips", duration: "3:30" },
  "4": { title: "Caring for Children's Teeth", duration: "4:00" },
  "5": { title: "Why Fluoride Matters", duration: "2:40" },
  "6": { title: "Scaling and Root Planing: What to Expect", duration: "5:00" },
  "7": { title: "Periodontal Maintenance at Home", duration: "3:50" },
  "8": { title: "Sensitivity: Causes and Relief", duration: "3:20" },
  "9": { title: "Whitening: Safety and Aftercare", duration: "3:10" },
  "10": { title: "Diet and Tooth Decay", duration: "3:30" },
  "11": { title: "Oral Care During Pregnancy", duration: "3:40" },
  "12": { title: "Mouthguards: Cleaning and Care", duration: "3:00" }
}

// Playlist metadata for display
export const playlistMetadata: Record<string, { name: string; videoCount: number }> = {
  "1": { name: "New Patient Onboarding", videoCount: 4 },
  "2": { name: "Pediatric Care Bundle", videoCount: 2 },
  "3": { name: "Advanced Periodontal Care", videoCount: 2 }
}
