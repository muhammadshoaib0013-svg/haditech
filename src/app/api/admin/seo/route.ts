import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { ADMIN_COOKIE_NAME, ADMIN_COOKIE_VALUE } from '@/lib/admin-auth'

function checkAuth(request: NextRequest) {
  const cookie = request.cookies.get(ADMIN_COOKIE_NAME)
  return cookie?.value === ADMIN_COOKIE_VALUE
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const path = searchParams.get('path')

  try {
    const supabase = createServerSupabaseClient()
    if (!supabase) return NextResponse.json({ success: true, data: [] })

    let query = supabase.from('seo_settings').select('*').order('page_path')
    if (path) query = query.eq('page_path', path)

    const { data, error } = await query
    if (error) {
      if (error.code === 'PGRST205' || error.message?.includes('does not exist')) {
        return NextResponse.json({ success: true, data: [] })
      }
      return NextResponse.json({ success: false, error: error.message, code: 'SEO_GET_FAILED' }, { status: 500 })
    }
    return NextResponse.json({ success: true, data: data ?? [] })
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
      return NextResponse.json({ success: false, error: 'Supabase not configured', code: 'SUPABASE_NOT_CONFIGURED' }, { status: 503 })
    }

    const body = await req.json()
    const { page_path, ...fields } = body
    if (!page_path) {
      return NextResponse.json({ success: false, error: 'page_path is required', code: 'VALIDATION_ERROR' }, { status: 400 })
    }

    const { data: existing, error: checkError } = await supabase
      .from('seo_settings')
      .select('id')
      .eq('page_path', page_path)
      .maybeSingle()

    if (checkError) {
      if (checkError.code === 'PGRST205' || checkError.message?.includes('does not exist')) {
        return NextResponse.json({
          success: false,
          code: 'SEO_TABLE_MISSING',
          error: 'Table "seo_settings" does not exist in Supabase database. Please go to Settings and run the SQL schema.'
        }, { status: 400 })
      }
      return NextResponse.json({ success: false, error: checkError.message, code: checkError.code || 'CHECK_ERROR' }, { status: 500 })
    }

    let result
    if (existing?.id) {
      result = await supabase
        .from('seo_settings')
        .update({ ...fields, updated_at: new Date().toISOString() })
        .eq('id', existing.id)
        .select()
        .single()
    } else {
      result = await supabase
        .from('seo_settings')
        .insert([{ page_path, ...fields }])
        .select()
        .single()
    }

    if (result.error) {
      return NextResponse.json({ success: false, error: result.error.message, code: result.error.code || 'PUT_FAILED' }, { status: 500 })
    }
    return NextResponse.json({ success: true, data: result.data })
  } catch (e: unknown) {
    return NextResponse.json({ success: false, error: String(e), code: 'SERVER_ERROR' }, { status: 500 })
  }
}
