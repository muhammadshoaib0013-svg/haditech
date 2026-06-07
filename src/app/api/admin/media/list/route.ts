import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { ADMIN_COOKIE_NAME, ADMIN_COOKIE_VALUE } from '@/lib/admin-auth'
import { getSupabaseEnv } from '@/lib/supabase/env'

function checkAuth(request: NextRequest) {
  const sessionCookie = request.cookies.get(ADMIN_COOKIE_NAME)
  return sessionCookie?.value === ADMIN_COOKIE_VALUE
}

// GET /api/admin/media/list
export async function GET(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check if Supabase is configured
  if (!getSupabaseEnv().isConfigured) {
    return NextResponse.json(
      { success: false, error: 'Supabase is not configured. Please add NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY in .env.local and restart the dev server.' },
      { status: 503 }
    )
  }

  try {
    const supabase = createServerSupabaseClient()
    if (!supabase) throw new Error('Supabase client failed to initialize')

    const { data, error } = await supabase
      .from('media_assets')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    const BUCKET = 'haditech-media'
    const assets = (data || []).map(item => {
      if (!item.file_url && item.bucket_path) {
        const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(item.bucket_path)
        return { ...item, file_url: urlData?.publicUrl || '' }
      }
      return item
    })

    return NextResponse.json({ data: assets })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to list media'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
