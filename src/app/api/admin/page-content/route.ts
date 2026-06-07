import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { ADMIN_COOKIE_NAME, ADMIN_COOKIE_VALUE } from '@/lib/admin-auth'

function checkAuth(request: NextRequest) {
  const cookie = request.cookies.get(ADMIN_COOKIE_NAME)
  return cookie?.value === ADMIN_COOKIE_VALUE
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const page = searchParams.get('page')
  const section = searchParams.get('section')

  try {
    const supabase = createServerSupabaseClient()
    if (!supabase) return NextResponse.json({ success: true, data: [] })

    let query = supabase.from('page_content').select('*').order('page_key').order('section_key')
    if (page) query = query.eq('page_key', page)
    if (section) query = query.eq('section_key', section)

    const { data, error } = await query
    if (error) {
      if (error.code === 'PGRST205' || error.message?.includes('does not exist')) {
        return NextResponse.json({
          success: false,
          code: 'PAGE_CONTENT_TABLE_MISSING',
          error: 'Table "page_content" does not exist in Supabase database. Please go to Settings and run the SQL schema.'
        }, { status: 400 })
      }
      return NextResponse.json({
        success: false,
        code: 'PAGE_CONTENT_GET_FAILED',
        error: error.message
      }, { status: 500 })
    }
    return NextResponse.json({ success: true, data: data ?? [] })
  } catch (e: unknown) {
    return NextResponse.json({
      success: false,
      code: 'PAGE_CONTENT_GET_ERROR',
      error: String(e)
    }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({
      success: false,
      code: 'UNAUTHORIZED',
      error: 'Unauthorized — admin session required'
    }, { status: 401 })
  }

  try {
    const supabase = createServerSupabaseClient()
    if (!supabase) {
      return NextResponse.json({
        success: false,
        code: 'SUPABASE_NOT_CONFIGURED',
        error: 'Supabase is not configured. Add environment variables.'
      }, { status: 503 })
    }

    const body = await req.json()
    const { page_key, section_key, ...fields } = body

    if (!page_key || !section_key) {
      return NextResponse.json({
        success: false,
        code: 'VALIDATION_ERROR',
        error: 'page_key and section_key are required'
      }, { status: 400 })
    }

    const { data: existing, error: checkError } = await supabase
      .from('page_content')
      .select('id')
      .eq('page_key', page_key)
      .eq('section_key', section_key)
      .maybeSingle()

    if (checkError) {
      if (checkError.code === 'PGRST205' || checkError.message?.includes('does not exist')) {
        return NextResponse.json({
          success: false,
          code: 'PAGE_CONTENT_TABLE_MISSING',
          error: 'Table "page_content" does not exist in Supabase database. Please go to Settings and run the SQL schema.'
        }, { status: 400 })
      }
      return NextResponse.json({
        success: false,
        code: checkError.code || 'CHECK_ERROR',
        error: checkError.message
      }, { status: 500 })
    }

    let result
    if (existing?.id) {
      result = await supabase
        .from('page_content')
        .update({ ...fields, updated_at: new Date().toISOString() })
        .eq('id', existing.id)
        .select()
        .single()
    } else {
      result = await supabase
        .from('page_content')
        .insert([{ page_key, section_key, ...fields }])
        .select()
        .single()
    }

    if (result.error) {
      return NextResponse.json({
        success: false,
        code: result.error.code || 'UPDATE_ERROR',
        error: result.error.message
      }, { status: 500 })
    }
    return NextResponse.json({ success: true, data: result.data })
  } catch (e: unknown) {
    return NextResponse.json({
      success: false,
      code: 'SERVER_ERROR',
      error: String(e)
    }, { status: 500 })
  }
}
