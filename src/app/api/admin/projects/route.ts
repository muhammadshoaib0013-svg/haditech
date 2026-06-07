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

// GET /api/admin/projects — list all projects
export async function GET(request: NextRequest) {
  if (!checkAuth(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (!getSupabaseEnv().isConfigured) {
    return NextResponse.json(CONFIG_ERROR, { status: 503 })
  }

  try {
    const supabase = createServerSupabaseClient()
    if (!supabase) throw new Error('Supabase client failed to initialize')

    const { data, error } = await supabase
      .from('portfolio_projects')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error

    const mapped = (data || []).map(row => {
      const img = row.primary_image_url || row.primary_image || ''
      return {
        ...row,
        primary_image: img,
        primary_image_url: img,
        primaryImageUrl: img,
      }
    })

    return NextResponse.json({ data: mapped })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed' }, { status: 500 })
  }
}

// POST /api/admin/projects — create project
export async function POST(request: NextRequest) {
  if (!checkAuth(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (!getSupabaseEnv().isConfigured) {
    return NextResponse.json(CONFIG_ERROR, { status: 503 })
  }

  try {
    const body = await request.json()
    const supabase = createServerSupabaseClient()
    if (!supabase) throw new Error('Supabase client failed to initialize')

    const insertObj: any = {
      title: body.title,
      slug: body.slug,
      description: body.description || '',
      category: body.category || '',
      stack: body.stack || [],
      tags: body.tags || [],
      featured: body.featured || false,
      status: body.status || 'draft',
      live_url: body.live_url || '',
      github_url: body.github_url || '',
      duration: body.duration || '',
      result: body.result || '',
      challenge: body.challenge || '',
      solution: body.solution || '',
      tech_deep_dive: body.tech_deep_dive || '',
      screenshots: body.screenshots || [],
      primary_image: body.primary_image || '',
    }

    // Try inserting with primary_image_url column
    let result = await supabase
      .from('portfolio_projects')
      .insert({ ...insertObj, primary_image_url: body.primary_image || '' })
      .select()
      .single()

    // Fall back to standard primary_image if primary_image_url column does not exist
    if (result.error && result.error.message.includes('primary_image_url')) {
      result = await supabase
        .from('portfolio_projects')
        .insert(insertObj)
        .select()
        .single()
    }

    if (result.error) throw result.error
    return NextResponse.json({ data: result.data }, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed' }, { status: 500 })
  }
}
