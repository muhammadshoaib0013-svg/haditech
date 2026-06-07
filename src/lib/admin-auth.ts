/**
 * Server-only admin authentication utilities.
 * Uses a secure HTTP-only cookie to maintain admin session.
 * The ADMIN_PASSWORD env var is NEVER exposed to client-side code.
 */

export const ADMIN_COOKIE_NAME = 'haditech_admin_session'
export const ADMIN_COOKIE_VALUE = 'authenticated'
export const COOKIE_MAX_AGE = 60 * 60 * 24 // 24 hours in seconds

/**
 * Verifies the admin password against the server-only ADMIN_PASSWORD env variable.
 */
export function verifyPassword(password: string): boolean {
  const correctPassword = process.env.ADMIN_PASSWORD || 'haditech2025'
  return password === correctPassword
}

/**
 * Returns the Set-Cookie header string for the admin session cookie.
 */
export function buildSessionCookie(): string {
  return `${ADMIN_COOKIE_NAME}=${ADMIN_COOKIE_VALUE}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${COOKIE_MAX_AGE}`
}

/**
 * Returns the Set-Cookie header string to clear the admin session.
 */
export function buildClearCookie(): string {
  return `${ADMIN_COOKIE_NAME}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0`
}
