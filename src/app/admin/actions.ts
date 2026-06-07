'use server'

/**
 * Server action to securely verify admin password against the server-only environmental variable.
 * This guarantees the password value is never compiled into or exposed in the client-side Javascript bundles.
 */
export async function verifyAdminPassword(password: string): Promise<boolean> {
  const correctPassword = process.env.ADMIN_PASSWORD || 'haditech2025';
  return password === correctPassword;
}
