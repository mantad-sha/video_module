/**
 * Utility functions for anonymous mode data masking
 */

/**
 * Masks a full name to initials when in anonymous mode
 * @param fullName - The full name to mask (e.g., "Jan Novák")
 * @param anon - Whether anonymous mode is active
 * @returns The masked name (initials) or original name
 * @example
 * maskedName("Jan Novák", true) // "JN"
 * maskedName("Marie Svobodová", true) // "MS"
 * maskedName("Jan Novák", false) // "Jan Novák"
 */
export function maskedName(fullName: string, anon: boolean): string {
  if (!anon) return fullName
  
  // Split name and get first letter of each part
  const initials = fullName
    .split(' ')
    .map(part => part.charAt(0).toUpperCase())
    .join('')
  
  return initials
}

/**
 * Masks an email address when in anonymous mode
 * @param email - The email to mask
 * @param anon - Whether anonymous mode is active
 * @returns The masked or original email
 */
export function maskedEmail(email: string, anon: boolean): string {
  if (!anon) return email
  
  const parts = email.split('@')
  if (parts.length !== 2) return '***@***.cz'
  return `***@${parts[1]}`
}

/**
 * Masks a phone number when in anonymous mode
 * @param phone - The phone number to mask
 * @param anon - Whether anonymous mode is active
 * @returns The masked or original phone
 */
export function maskedPhone(phone: string, anon: boolean): string {
  if (!anon) return phone
  
  // Keep country code if present
  if (phone.startsWith('+')) {
    const countryCode = phone.substring(0, 4) // e.g., "+420"
    return `${countryCode} *** *** ***`
  }
  
  return '*** *** ***'
}

/**
 * Returns a generic avatar URL or the original based on anonymous mode
 * @param avatarUrl - The original avatar URL (optional)
 * @param anon - Whether anonymous mode is active
 * @returns Generic placeholder or original avatar URL
 */
export function getAvatarUrl(avatarUrl: string | undefined, anon: boolean): string | undefined {
  if (!anon) return avatarUrl
  return undefined // Will show initials instead
}
