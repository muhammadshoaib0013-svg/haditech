import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { ADMIN_COOKIE_NAME, ADMIN_COOKIE_VALUE } from '@/lib/admin-auth'
import { getSupabaseEnv } from '@/lib/supabase/env'

function checkAuth(request: NextRequest) {
  const cookie = request.cookies.get(ADMIN_COOKIE_NAME)
  return cookie?.value === ADMIN_COOKIE_VALUE
}

function isImageUrl(url: string): boolean {
  if (!url) return false
  const clean = url.toLowerCase().split('?')[0].split('#')[0]
  return (
    clean.endsWith('.jpg') ||
    clean.endsWith('.jpeg') ||
    clean.endsWith('.png') ||
    clean.endsWith('.webp') ||
    clean.endsWith('.gif') ||
    clean.endsWith('.svg') ||
    clean.includes('/storage/v1/object/public/') ||
    clean.includes('/storage/v1/object/sign/')
  )
}

function isYouTubeUrl(url: string): boolean {
  return url.includes('youtube.com/watch') || url.includes('youtu.be/') || url.includes('youtube.com/embed')
}

function isValidImageUrl(url: string): boolean {
  return !!url && isImageUrl(url) && !isYouTubeUrl(url)
}

/**
 * POST /api/admin/projects/cleanup
 * Scans all projects and removes YouTube/non-image URLs from screenshots + primary_image.
 * Returns { cleaned: number, details: [...] }
 */
export async function POST(request: NextRequest) {
  if (!checkAuth(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (!getSupabaseEnv().isConfigured) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 })
  }

  try {
    const supabase = createServerSupabaseClient()
    if (!supabase) throw new Error('Supabase client failed to initialize')

    const { data: projects, error } = await supabase
      .from('portfolio_projects')
      .select('id, title, slug, screenshots, primary_image')

    if (error) throw error

    const details: { slug: string; title: string; changes: string[] }[] = []
    let cleaned = 0

    for (const project of projects || []) {
      const changes: string[] = []

      // Clean screenshots
      const rawScreenshots: string[] = Array.isArray(project.screenshots) ? project.screenshots : []
      const cleanScreenshots = rawScreenshots.filter(isValidImageUrl)
      const removedScreenshots = rawScreenshots.filter(u => !isValidImageUrl(u))
      if (removedScreenshots.length > 0) {
        changes.push(`Removed ${removedScreenshots.length} invalid screenshot(s): ${removedScreenshots.join(', ')}`)
      }

      // Clean primary_image
      const rawPrimary: string = project.primary_image || ''
      const cleanPrimary = isValidImageUrl(rawPrimary)
        ? rawPrimary
        : cleanScreenshots[0] || ''
      if (rawPrimary !== cleanPrimary) {
        changes.push(`primary_image: "${rawPrimary}" → "${cleanPrimary}"`)
      }

      if (changes.length > 0) {
        const { error: updateError } = await supabase
          .from('portfolio_projects')
          .update({
            screenshots: cleanScreenshots,
            primary_image: cleanPrimary,
            updated_at: new Date().toISOString(),
          })
          .eq('id', project.id)

        if (updateError) {
          changes.push(`❌ Update failed: ${updateError.message}`)
        } else {
          cleaned++
        }
        details.push({ slug: project.slug, title: project.title, changes })
      }
    }

    return NextResponse.json({
      success: true,
      cleaned,
      total: (projects || []).length,
      details,
    })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed' }, { status: 500 })
  }
}
