import { createClient } from '@supabase/supabase-js'
import { getSupabaseEnv } from './env'

/**
 * Server-only Supabase client with Service Role key.
 * This bypasses Row Level Security — ONLY use in server-side code (API routes, Server Actions).
 * NEVER import this file in client components.
 * Returns null if Supabase environment variables are missing.
 */
export function createServerSupabaseClient() {
  const { supabaseUrl, serviceRoleKey, isConfigured } = getSupabaseEnv()

  if (!isConfigured || !supabaseUrl || !serviceRoleKey) {
    return null
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
