/**
 * VIDEO SUGGESTIONS SYSTEM - Testing Guide
 * 
 * The suggestions system recommends relevant videos and playlists based on appointment types.
 * 
 * HOW TO TEST:
 * 
 * 1. Navigate to /videos
 *    - Look for the "Smart Suggestions" panel in the top-right
 *    - Click to expand it
 *    - Select a visit type (e.g., "Scaling & Root Planing")
 *    - See recommended videos and playlists
 *    - Click Send buttons to pre-fill the Send dialog
 * 
 * 2. Test patient appointment suggestions:
 *    - Click "Send" on any video card
 *    - Select patients in the dialog
 *    - Notice that patients with appointments show their type:
 *      - Patient 1: Scaling & Root Planing  
 *      - Patient 2: Pediatric Visit
 *      - Patient 3: Whitening Treatment
 *      - Patient 4: Prenatal Consultation
 *      - Patient 5: Prophylaxis (Cleaning)
 *      - Patient 6: Periodontal Maintenance
 *    - When you select patients, relevant suggestions appear as chips
 *    - Click a suggestion chip to quickly switch to that content
 * 
 * 3. Test Anonymous Mode:
 *    - Toggle Anonymous Mode ON
 *    - Notice that patient appointment types are hidden
 *    - The suggestions panel shows a warning
 *    - Patient-specific suggestions don't appear in Send dialog
 * 
 * APPOINTMENT TYPE MAPPINGS:
 * 
 * - SRP → "Scaling and Root Planing" video + "Advanced Periodontal Care" playlist
 * - Prophy → "Proper Brushing" + "Flossing" videos  
 * - Whitening → "Whitening: Safety and Aftercare" video
 * - Pediatric → "Children's Teeth" + "Fluoride" videos + "Pediatric Bundle" playlist
 * - Perio Maintenance → "Periodontal Maintenance" video + playlist
 * - New Patient → Basic hygiene videos + "New Patient Onboarding" playlist
 * - Sensitivity → "Sensitivity: Causes and Relief" video
 * - Pregnancy → "Oral Care During Pregnancy" video
 * 
 * DATA:
 * - All suggestions are defined in data/suggestions.ts
 * - Mock patient appointments link patients to appointment types
 * - The system matches appointment types to relevant educational content
 * 
 * CLEAR DATA (for testing):
 * localStorage.clear()
 */

export {}
