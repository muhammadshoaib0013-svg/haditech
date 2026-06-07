import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { ADMIN_COOKIE_NAME, ADMIN_COOKIE_VALUE } from '@/lib/admin-auth'

function checkAuth(request: NextRequest) {
  const cookie = request.cookies.get(ADMIN_COOKIE_NAME)
  return cookie?.value === ADMIN_COOKIE_VALUE
}

const DEFAULTS = [
  { id: 'static-1', label: 'Work', href: '/work', sort_order: 1, is_active: true },
  { id: 'static-2', label: 'Services', href: '/services', sort_order: 2, is_active: true },
  { id: 'static-3', label: 'Case Studies', href: '/case-studies', sort_order: 3, is_active: true },
  { id: 'static-4', label: 'Videos', href: '/videos', sort_order: 4, is_active: true },
  { id: 'static-5', label: 'About', href: '/about', sort_order: 5, is_active: true },
  { id: 'static-6', label: 'Contact', href: '/contact', sort_order: 6, is_active: true },
]

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()
    if (!supabase) return NextResponse.json({ success: true, data: DEFAULTS })

    const { data, error } = await supabase
      .from('navigation_items')
      .select('*')
      .order('sort_order')

    if (error) {
      if (error.code === 'PGRST205' || error.message?.includes('does not exist')) {
        return NextResponse.json({ success: true, data: DEFAULTS })
      }
      return NextResponse.json({ success: false, error: error.message, code: error.code || 'NAV_GET_FAILED' }, { status: 500 })
    }
    if (!data || data.length === 0) return NextResponse.json({ success: true, data: DEFAULTS })
    return NextResponse.json({ success: true, data })
  } catch (e: unknown) {
    return NextResponse.json({ success: false, error: String(e), code: 'SERVER_ERROR' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ success: false, error: 'Unauthorized — admin session required', code: 'UNAUTHORIZED' }, { status: 401 })
  }

  try {
    const supabase = createServerSupabaseClient()
    if (!supabase) {
      return NextResponse.json({ success: false, error: 'Supabase is not configured.', code: 'SUPABASE_NOT_CONFIGURED' }, { status: 503 })
    }

    const body = await req.json()
    const { data, error } = await supabase
      .from('navigation_items')
      .insert([body])
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST205' || error.message?.includes('does not exist')) {
        return NextResponse.json({
          success: false,
          code: 'NAV_TABLE_MISSING',
          error: 'Table "navigation_items" does not exist in Supabase database. Please go to Settings and run the SQL schema.'
        }, { status: 400 })
      }
      return NextResponse.json({ success: false, error: error.message, code: error.code || 'POST_FAILED' }, { status: 500 })
    }
    return NextResponse.json({ success: true, data })
  } catch (e: unknown) {
    return NextResponse.json({ success: false, error: String(e), code: 'SERVER_ERROR' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ success: false, error: 'Unauthorized — admin session required', code: 'UNAUTHORIZED' }, { status: 401 })
  }

  try {
    const supabase = createServerSupabaseClient()
    if (!supabase) {
      return NextResponse.json({ success: false, error: 'Supabase is not configured.', code: 'SUPABASE_NOT_CONFIGURED' }, { status: 503 })
    }

    const body = await req.json()
    const { id, ...fields } = body

    if (!id) {
      return NextResponse.json({ success: false, error: 'id is required for update', code: 'VALIDATION_ERROR' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('navigation_items')
      .update({ ...fields, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST205' || error.message?.includes('does not exist')) {
        return NextResponse.json({
          success: false,
          code: 'NAV_TABLE_MISSING',
          error: 'Table "navigation_items" does not exist in Supabase database. Please go to Settings and run the SQL schema.'
        }, { status: 400 })
      }
      return NextResponse.json({ success: false, error: error.message, code: error.code || 'PUT_FAILED' }, { status: 500 })
    }
    return NextResponse.json({ success: true, data })
  } catch (e: unknown) {
    return NextResponse.json({ success: false, error: String(e), code: 'SERVER_ERROR' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ success: false, error: 'Unauthorized — admin session required', code: 'UNAUTHORIZED' }, { status: 401 })
  }

  try {
    const supabase = createServerSupabaseClient()
    if (!supabase) {
      return NextResponse.json({ success: false, error: 'Supabase is not configured.', code: 'SUPABASE_NOT_CONFIGURED' }, { status: 503 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ success: false, error: 'id query parameter is required', code: 'VALIDATION_ERROR' }, { status: 400 })
    }

    const { error } = await supabase.from('navigation_items').delete().eq('id', id)
    if (error) {
      if (error.code === 'PGRST205' || error.message?.includes('does not exist')) {
        return NextResponse.json({
          success: false,
          code: 'NAV_TABLE_MISSING',
          error: 'Table "navigation_items" does not exist in Supabase database. Please go to Settings and run the SQL schema.'
        }, { status: 400 })
      }
      return NextResponse.json({ success: false, error: error.message, code: error.code || 'DELETE_FAILED' }, { status: 500 })
    }
    return NextResponse.json({ success: true, data: { id } })
  } catch (e: unknown) {
    return NextResponse.json({ success: false, error: String(e), code: 'SERVER_ERROR' }, { status: 500 })
  }
}
