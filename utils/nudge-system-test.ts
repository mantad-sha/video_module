/**
 * NUDGE REMINDER SYSTEM - Testing Guide
 * 
 * The nudge system automatically sends reminder notifications for unviewed videos/playlists.
 * 
 * HOW TO TEST:
 * 
 * 1. Navigate to /videos/tracking
 *    - You'll see the Nudge Settings panel in the sidebar
 *    - Auto-nudge is ON by default with 48 hours delay
 * 
 * 2. Send a video to patients:
 *    - Go to /videos
 *    - Click "Send" on any video card
 *    - Select one or more patients
 *    - Click "Send"
 *    - This creates a PendingNudge scheduled for 48 hours later
 * 
 * 3. Check pending nudges:
 *    - Go to /videos/tracking
 *    - Look at the "Reminder Nudges" section
 *    - You'll see pending reminders with their due times
 * 
 * 4. Test immediate nudge (for development):
 *    - Change the delay to 0.01 hours (36 seconds) in settings
 *    - Send a video
 *    - Wait 60 seconds (nudges are checked every 60s)
 *    - You'll see a toast notification when the reminder is sent
 * 
 * 5. Test Anonymous Mode:
 *    - Toggle Anonymous Mode ON in the header
 *    - Notice nudge settings are disabled
 *    - No new nudges will be created or sent
 *    - Patient names are masked in the nudges display
 * 
 * DATA PERSISTENCE:
 * - All nudge data is stored in localStorage:
 *   - 'nudge-rule': The active/inactive state and delay hours
 *   - 'pending-nudges': List of scheduled nudges
 *   - 'video-shares': List of sent videos/playlists
 *   - 'total-reminders-sent': Counter of sent reminders
 * 
 * CLEAR DATA (for testing):
 * localStorage.clear()
 * 
 * VIEW DATA:
 * console.log('Nudge Rule:', localStorage.getItem('nudge-rule'))
 * console.log('Pending:', localStorage.getItem('pending-nudges'))
 * console.log('Shares:', localStorage.getItem('video-shares'))
 */

export {}
