import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { ADMIN_COOKIE_NAME, ADMIN_COOKIE_VALUE } from '@/lib/admin-auth'
import { getSupabaseEnv } from '@/lib/supabase/env'

function checkAuth(request: NextRequest) {
  const sessionCookie = request.cookies.get(ADMIN_COOKIE_NAME)
  return sessionCookie?.value === ADMIN_COOKIE_VALUE
}

const BUCKET = 'haditech-media'

export async function DELETE(request: NextRequest) {
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
    const { id, bucketPath } = await request.json()

    if (!id || !bucketPath) {
      return NextResponse.json({ error: 'id and bucketPath are required.' }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()
    if (!supabase) throw new Error('Supabase client failed to initialize')

    // Delete from storage
    const { error: storageError } = await supabase.storage.from(BUCKET).remove([bucketPath])
    if (storageError) throw storageError

    // Delete from database
    const { error: dbError } = await supabase.from('media_assets').delete().eq('id', id)
    if (dbError) throw dbError

    return NextResponse.json({ success: true })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Delete failed'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
