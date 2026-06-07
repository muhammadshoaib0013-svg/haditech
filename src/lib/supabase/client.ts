import { createClient } from '@supabase/supabase-js'
import { getSupabaseEnv } from './env'

const { supabaseUrl, supabaseAnonKey, isConfigured } = getSupabaseEnv()

// Guard against crash on missing config (e.g. during build or initial setup)
export const supabase = isConfigured && supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null
