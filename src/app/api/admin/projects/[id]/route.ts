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

// GET /api/admin/projects/[id]
export async function GET(request: NextRequest, { params }: Props) {
  if (!checkAuth(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (!getSupabaseEnv().isConfigured) {
    return NextResponse.json(CONFIG_ERROR, { status: 503 })
  }

  try {
    const supabase = createServerSupabaseClient()
    if (!supabase) throw new Error('Supabase client failed to initialize')

    const { data, error } = await supabase.from('portfolio_projects').select('*').eq('id', params.id).single()
    if (error) throw error

    const img = data.primary_image_url || data.primary_image || ''
    const mapped = {
      ...data,
      primary_image: img,
      primary_image_url: img,
      primaryImageUrl: img,
    }

    return NextResponse.json({ data: mapped })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed' }, { status: 500 })
  }
}

// PUT /api/admin/projects/[id]
export async function PUT(request: NextRequest, { params }: Props) {
  if (!checkAuth(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (!getSupabaseEnv().isConfigured) {
    return NextResponse.json(CONFIG_ERROR, { status: 503 })
  }

  try {
    const body = await request.json()
    const supabase = createServerSupabaseClient()
    if (!supabase) throw new Error('Supabase client failed to initialize')

    // Destructure any frontend alias versions out of direct body payload
    const { primary_image_url, primaryImageUrl, primaryImage, ...updateObj } = body
    const primaryImg = body.primary_image || primary_image_url || primaryImageUrl || primaryImage || ''

    // Try updating with primary_image_url column
    let result = await supabase
      .from('portfolio_projects')
      .update({
        ...updateObj,
        primary_image: primaryImg,
        primary_image_url: primaryImg,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .select()
      .single()

    // Fall back to standard primary_image if primary_image_url column does not exist
    if (result.error && result.error.message.includes('primary_image_url')) {
      result = await supabase
        .from('portfolio_projects')
        .update({
          ...updateObj,
          primary_image: primaryImg,
          updated_at: new Date().toISOString()
        })
        .eq('id', params.id)
        .select()
        .single()
    }

    if (result.error) throw result.error
    return NextResponse.json({ data: result.data })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed' }, { status: 500 })
  }
}

// DELETE /api/admin/projects/[id]
export async function DELETE(request: NextRequest, { params }: Props) {
  if (!checkAuth(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (!getSupabaseEnv().isConfigured) {
    return NextResponse.json(CONFIG_ERROR, { status: 503 })
  }

  try {
    const supabase = createServerSupabaseClient()
    if (!supabase) throw new Error('Supabase client failed to initialize')

    const { error } = await supabase.from('portfolio_projects').delete().eq('id', params.id)
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed' }, { status: 500 })
  }
}
