import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { ADMIN_COOKIE_NAME, ADMIN_COOKIE_VALUE } from '@/lib/admin-auth'
import { getSupabaseEnv } from '@/lib/supabase/env'

function checkAuth(request: NextRequest) {
  const cookie = request.cookies.get(ADMIN_COOKIE_NAME)
  return cookie?.value === ADMIN_COOKIE_VALUE
}

interface Props { params: { id: string } }

const CONFIG_ERROR = {
  success: false,
  error: 'Supabase is not configured. Please add NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY in .env.local and restart the dev server.'
}

export async function PUT(request: NextRequest, { params }: Props) {
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
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq('id', params.id)
      .select()
      .single()
    if (error) throw error
    return NextResponse.json({ data })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: Props) {
  if (!checkAuth(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (!getSupabaseEnv().isConfigured) {
    return NextResponse.json(CONFIG_ERROR, { status: 503 })
  }

  try {
    const supabase = createServerSupabaseClient()
    if (!supabase) throw new Error('Supabase client failed to initialize')

    const { error } = await supabase.from('portfolio_videos').delete().eq('id', params.id)
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed' }, { status: 500 })
  }
}
