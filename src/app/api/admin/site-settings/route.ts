import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { siteConfig } from '@/lib/data'
import { ADMIN_COOKIE_NAME, ADMIN_COOKIE_VALUE } from '@/lib/admin-auth'

function checkAuth(request: NextRequest) {
  const cookie = request.cookies.get(ADMIN_COOKIE_NAME)
  return cookie?.value === ADMIN_COOKIE_VALUE
}

const DEFAULTS = {
  site_name: siteConfig.brandName,
  brand_name: siteConfig.brandName,
  tagline: siteConfig.tagline,
  logo_url: '',
  favicon_url: '',
  primary_email: siteConfig.email,
  contact_email: siteConfig.email,
  phone: '',
  whatsapp_number: siteConfig.whatsappNumber,
  whatsapp_link: siteConfig.whatsappLink,
  address: '',
  facebook_url: siteConfig.socials?.facebook || '',
  twitter_url: siteConfig.socials?.twitter || '',
  linkedin_url: siteConfig.socials?.linkedin || '',
  youtube_url: (siteConfig.socials as any)?.youtube || '',
  github_url: siteConfig.socials?.github || '',
  availability_open: siteConfig.availability?.open ?? true,
  availability_message: siteConfig.availability?.message || '',
}

function isTableMissingError(error: { code?: string; message?: string }) {
  return (
    error.code === 'PGRST205' ||
    error.code === '42P01' ||
    error.message?.includes('does not exist') ||
    error.message?.includes('relation')
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// GET — return current site settings (falls back to static defaults)
// ─────────────────────────────────────────────────────────────────────────────
export async function GET() {
  try {
    const supabase = createServerSupabaseClient()
    if (!supabase) return NextResponse.json({ success: true, data: DEFAULTS })

    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error) {
      if (isTableMissingError(error)) return NextResponse.json({ success: true, data: DEFAULTS })
      // Column missing — return defaults with warning
      return NextResponse.json({ success: true, data: DEFAULTS, _warning: error.message })
    }

    if (!data) return NextResponse.json({ success: true, data: DEFAULTS })

    // Merge with defaults to fill any missing columns
    return NextResponse.json({ success: true, data: { ...DEFAULTS, ...data } })
  } catch {
    return NextResponse.json({ success: true, data: DEFAULTS })
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PUT — upsert settings (one canonical row) with safe merge-on-update
// ─────────────────────────────────────────────────────────────────────────────
export async function PUT(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized — admin session required', code: 'UNAUTHORIZED' },
      { status: 401 }
    )
  }

  try {
    const supabase = createServerSupabaseClient()
    if (!supabase) {
      return NextResponse.json(
        {
          success: false,
          code: 'SUPABASE_NOT_CONFIGURED',
          error: 'Supabase is not configured. Add env variables to .env.local',
        },
        { status: 503 }
      )
    }

    const body = await req.json()

    // 1. Check if a row already exists and fetch ALL its current properties
    const { data: existing, error: checkError } = await supabase
      .from('site_settings')
      .select('*')
      .limit(1)
      .maybeSingle()

    if (checkError) {
      if (isTableMissingError(checkError)) {
        return NextResponse.json(
          {
            success: false,
            code: 'SITE_SETTINGS_TABLE_MISSING',
            error: 'Table "site_settings" is missing. Open /admin/settings and run the SQL schema in Supabase SQL Editor.',
          },
          { status: 400 }
        )
      }
      return NextResponse.json(
        { success: false, error: `Check failed: ${checkError.message}`, code: checkError.code || 'CHECK_FAILED' },
        { status: 500 }
      )
    }

    // 2. Resolve current values (either existing row in database or defaults)
    const currentData = existing || DEFAULTS

    // 3. Build a merged payload: only update fields explicitly passed in req.body
    const payload: Record<string, unknown> = {
      site_name: body.brand_name || body.site_name || currentData.site_name || DEFAULTS.site_name,
      brand_name: body.brand_name || body.site_name || currentData.brand_name || DEFAULTS.brand_name,
      tagline: body.tagline !== undefined ? body.tagline : currentData.tagline,
      logo_url: body.logo_url !== undefined ? body.logo_url : currentData.logo_url,
      favicon_url: body.favicon_url !== undefined ? body.favicon_url : currentData.favicon_url,
      primary_email: body.primary_email !== undefined ? body.primary_email : (body.contact_email !== undefined ? body.contact_email : currentData.primary_email),
      contact_email: body.contact_email !== undefined ? body.contact_email : (body.primary_email !== undefined ? body.primary_email : currentData.contact_email),
      phone: body.phone !== undefined ? body.phone : currentData.phone,
      whatsapp_number: body.whatsapp_number !== undefined ? body.whatsapp_number : currentData.whatsapp_number,
      whatsapp_link: body.whatsapp_link !== undefined ? body.whatsapp_link : currentData.whatsapp_link,
      address: body.address !== undefined ? body.address : currentData.address,
      facebook_url: body.facebook_url !== undefined ? body.facebook_url : currentData.facebook_url,
      twitter_url: body.twitter_url !== undefined ? body.twitter_url : currentData.twitter_url,
      linkedin_url: body.linkedin_url !== undefined ? body.linkedin_url : currentData.linkedin_url,
      youtube_url: body.youtube_url !== undefined ? body.youtube_url : currentData.youtube_url,
      github_url: body.github_url !== undefined ? body.github_url : currentData.github_url,
      availability_open: body.availability_open !== undefined ? body.availability_open : currentData.availability_open,
      availability_message: body.availability_message !== undefined ? body.availability_message : currentData.availability_message,
      updated_at: new Date().toISOString(),
    }

    let result
    if (existing?.id) {
      result = await supabase
        .from('site_settings')
        .update(payload)
        .eq('id', existing.id)
        .select()
        .single()
    } else {
      result = await supabase
        .from('site_settings')
        .insert([payload])
        .select()
        .single()
    }

    if (result.error) {
      const isColMissing = result.error.code === '42703'
      return NextResponse.json(
        {
          success: false,
          error: `Save failed: ${result.error.message}`,
          code: isColMissing ? 'SITE_SETTINGS_COLUMN_MISSING' : (result.error.code || 'UNKNOWN'),
          hint: isColMissing
            ? 'A column is missing. Run supabase/cms_rescue.sql in Supabase SQL Editor.'
            : undefined,
        },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data: { ...DEFAULTS, ...result.data } })
  } catch (e: unknown) {
    return NextResponse.json(
      { success: false, error: String(e), code: 'SERVER_ERROR' },
      { status: 500 }
    )
  }
}
