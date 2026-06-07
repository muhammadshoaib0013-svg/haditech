import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { ADMIN_COOKIE_NAME, ADMIN_COOKIE_VALUE } from '@/lib/admin-auth'
import { getSupabaseEnv } from '@/lib/supabase/env'

function checkAuth(request: NextRequest) {
  const cookie = request.cookies.get(ADMIN_COOKIE_NAME)
  return cookie?.value === ADMIN_COOKIE_VALUE
}

const CONFIG_ERROR = {
  success: false,
  error: 'Supabase is not configured. Please add NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY in .env.local and restart the dev server.'
}

// GET /api/admin/videos
export async function GET(request: NextRequest) {
  if (!checkAuth(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (!getSupabaseEnv().isConfigured) {
    return NextResponse.json(CONFIG_ERROR, { status: 503 })
  }

  try {
    const supabase = createServerSupabaseClient()
    if (!supabase) throw new Error('Supabase client failed to initialize')

    const { data, error } = await supabase
      .from('portfolio_videos')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return NextResponse.json({ data })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed' }, { status: 500 })
  }
}

// POST /api/admin/videos
export async function POST(request: NextRequest) {
  if (!checkAuth(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (!getSupabaseEnv().isConfigured) {
    return NextResponse.json(CONFIG_ERROR, { status: 503 })
  }

  try {
    const body = await request.json()
    const supabase = createServerSupabaseClient()
    if (!supabase) throw new Error('Supabase client failed to initialize')

    const { data, error } = await supabase
      .from('portfolio_videos')
      .insert({
        title: body.title,
        platform: body.platform || 'YouTube',
        url: body.url || '',
        duration: body.duration || '',
        image_src: body.image_src || '',
        featured: body.featured || false,
        status: body.status || 'draft',
      })
      .select()
      .single()
    if (error) throw error
    return NextResponse.json({ data }, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed' }, { status: 500 })
  }
}
