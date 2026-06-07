export interface SupabaseEnvConfig {
  supabaseUrl: string | undefined
  supabaseAnonKey: string | undefined
  serviceRoleKey: string | undefined
  isConfigured: boolean
}

export function getSupabaseEnv(): SupabaseEnvConfig {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  // Server-only key, won't be available on the client
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  // Determine configuration status
  // On the client, we check for URL and Anon Key.
  // On the server, we check for all three required variables.
  const isServer = typeof window === 'undefined'
  const isConfigured = isServer
    ? !!(supabaseUrl && supabaseAnonKey && serviceRoleKey)
    : !!(supabaseUrl && supabaseAnonKey)

  return {
    supabaseUrl,
    supabaseAnonKey,
    serviceRoleKey,
    isConfigured,
  }
}
