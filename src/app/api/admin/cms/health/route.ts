import { NextResponse, NextRequest } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { ADMIN_COOKIE_NAME, ADMIN_COOKIE_VALUE } from '@/lib/admin-auth'

function checkAuth(request: NextRequest) {
  const cookie = request.cookies.get(ADMIN_COOKIE_NAME)
  return cookie?.value === ADMIN_COOKIE_VALUE
}

const TABLES = [
  'media_assets',
  'portfolio_projects',
  'portfolio_videos',
  'portfolio_testimonials',
  'site_settings',
  'navigation_items',
  'footer_sections',
  'page_content',
  'portfolio_services',
  'seo_settings',
  'contact_leads'
]

export async function GET(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServerSupabaseClient()
  if (!supabase) {
    return NextResponse.json({
      success: false,
      configured: false,
      error: 'Supabase is not configured'
    })
  }

  const results: Record<string, { exists: boolean; error?: string }> = {}
  let bucketStatus = { exists: false, isPublic: false, error: '' }
  let mediaColumnsStatus = { healthy: false, error: '' }

  // 1. Check storage bucket "haditech-media"
  try {
    const { data: bucket, error: bucketError } = await supabase.storage.getBucket('haditech-media')
    if (bucketError) {
      bucketStatus.error = bucketError.message
    } else if (bucket) {
      bucketStatus.exists = true
      bucketStatus.isPublic = bucket.public
    }
  } catch (e: any) {
    bucketStatus.error = e.message || 'Unknown storage error'
  }

  // 2. Check all tables existence
  for (const table of TABLES) {
    try {
      const { error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true })

      if (error) {
        results[table] = {
          exists: false,
          canRead: false,
          code: error.code || null,
          error: error.message || null
        } as any
      } else {
        results[table] = {
          exists: true,
          canRead: true,
          code: null,
          error: null
        } as any
      }
    } catch (e: any) {
      results[table] = {
        exists: false,
        canRead: false,
        code: 'EXCEPTION',
        error: e.message || 'Unknown error'
      } as any
    }
  }

  // 3. Check media_assets metadata columns
  if (results['media_assets']?.exists) {
    try {
      const { error } = await supabase
        .from('media_assets')
        .select('id, file_name, file_url, file_type, bucket_path, size, usage_type, page_key, alt_text, title')
        .limit(0)

      if (error) {
        mediaColumnsStatus.error = error.message
      } else {
        mediaColumnsStatus.healthy = true
      }
    } catch (e: any) {
      mediaColumnsStatus.error = e.message || 'Unknown column lookup error'
    }
  } else {
    mediaColumnsStatus.error = 'Table "media_assets" does not exist.'
  }

  const healthy = Object.values(results).every(r => r.exists) && bucketStatus.exists && mediaColumnsStatus.healthy

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  let projectRef = 'Not configured'
  if (supabaseUrl) {
    try {
      const hostname = new URL(supabaseUrl).hostname
      const parts = hostname.split('.')
      if (parts[0]) {
        const ref = parts[0]
        if (ref.length > 8) {
          projectRef = `${ref.substring(0, 5)}...${ref.substring(ref.length - 4)}`
        } else {
          projectRef = ref
        }
      }
    } catch {
      // Fallback
    }
  }

  return NextResponse.json({
    success: true,
    configured: true,
    projectRef,
    healthy,
    storage: bucketStatus,
    mediaColumns: mediaColumnsStatus,
    tables: results
  })
}
