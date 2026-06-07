import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { services as staticServices } from '@/lib/data'
import { ADMIN_COOKIE_NAME, ADMIN_COOKIE_VALUE } from '@/lib/admin-auth'

function checkAuth(request: NextRequest) {
  const cookie = request.cookies.get(ADMIN_COOKIE_NAME)
  return cookie?.value === ADMIN_COOKIE_VALUE
}

/** Auto-generate a URL-safe slug from a title */
function toSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

/** Map camelCase frontend payload → snake_case DB row */
function toDbRow(body: Record<string, unknown>) {
  const title = String(body.title || '')
  return {
    title,
    slug: String(body.slug || toSlug(title) || `service-${Date.now()}`),
    category: String(body.category || ''),
    description: String(body.description || body.shortDescription || ''),
    short_description: String(body.shortDescription || body.short_description || ''),
    price_range: String(body.pricingHint || body.priceRange || body.price_range || body.price || ''),
    delivery_time: String(body.deliveryTime || body.delivery_time || ''),
    sort_order: Number(body.sortOrder ?? body.sort_order ?? 0),
    features: Array.isArray(body.features)
      ? (body.features as string[]).filter(Boolean)
      : [],
    tier: String(body.tier || 'starter'),
    icon: String(body.iconName || body.icon || 'Code'),
    image_url: String(body.imageUrl || body.image_url || ''),
    popular: Boolean(body.popular),
    featured: Boolean(body.featured),
    status: String(body.status || 'published'),
  }
}

/** Map snake_case DB row → camelCase frontend shape (matches ServiceTier + admin form) */
function toFrontend(row: Record<string, unknown>) {
  const features = Array.isArray(row.features) ? (row.features as string[]) : []
  return {
    id: row.id,
    title: String(row.title || ''),
    slug: String(row.slug || ''),
    category: String(row.category || ''),
    shortDescription: String(row.short_description || row.description || ''),
    description: String(row.description || ''),
    pricingHint: String(row.price_range || ''),
    priceRange: String(row.price_range || ''),
    deliveryTime: String(row.delivery_time || ''),
    sortOrder: Number(row.sort_order ?? 0),
    sort_order: Number(row.sort_order ?? 0),
    features,
    tier: String(row.tier || 'starter'),
    iconName: String(row.icon || 'Code'),
    icon: String(row.icon || 'Code'),
    imageUrl: String(row.image_url || ''),
    image_url: String(row.image_url || ''),
    popular: Boolean(row.popular),
    featured: Boolean(row.featured),
    status: String(row.status || 'published'),
    created_at: row.created_at,
    updated_at: row.updated_at,
  }
}

const TABLE_MISSING_RESPONSE = {
  success: false,
  code: 'PORTFOLIO_SERVICES_TABLE_MISSING',
  error: 'portfolio_services table is missing in the connected Supabase project. Run supabase/cms_rescue.sql in Supabase SQL Editor.',
  nextStep: 'Open /admin/settings and copy cms_rescue.sql'
}

function isTableMissingError(error: { code?: string; message?: string }) {
  return (
    error.code === 'PGRST205' ||
    error.code === '42P01' ||
    error.message?.includes('does not exist') ||
    error.message?.includes('relation') ||
    error.message?.includes('undefined')
  )
}

const STATIC_FRONTEND = staticServices.map((s, index) => ({
  id: `static-${index}`,
  title: s.title,
  slug: s.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
  category: s.category,
  shortDescription: s.shortDescription,
  description: s.shortDescription,
  pricingHint: s.pricingHint,
  priceRange: s.pricingHint,
  deliveryTime: s.deliveryTime,
  sortOrder: index,
  sort_order: index,
  features: s.features,
  tier: s.tier,
  iconName: s.iconName,
  icon: s.iconName,
  imageUrl: '',
  image_url: '',
  popular: s.popular,
  featured: false,
  status: 'published'
}))

// ─────────────────────────────────────────────────────────────────────────────
// GET — read all services (admin and public use this)
// ─────────────────────────────────────────────────────────────────────────────
export async function GET() {
  try {
    const supabase = createServerSupabaseClient()
    if (!supabase) {
      return NextResponse.json({ success: true, data: STATIC_FRONTEND })
    }

    const { data, error } = await supabase
      .from('portfolio_services')
      .select('*')
      .order('sort_order', { ascending: true })

    if (error) {
      if (isTableMissingError(error)) {
        return NextResponse.json({ success: true, data: STATIC_FRONTEND })
      }
      return NextResponse.json(
        { success: false, error: error.message, code: error.code || 'SERVICES_GET_FAILED' },
        { status: 500 }
      )
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ success: true, data: STATIC_FRONTEND })
    }

    return NextResponse.json({ success: true, data: (data as Record<string, unknown>[]).map(toFrontend) })
  } catch (e: unknown) {
    return NextResponse.json({ success: true, data: STATIC_FRONTEND })
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// POST — create new service
// ─────────────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ success: false, error: 'Unauthorized — admin session required', code: 'UNAUTHORIZED' }, { status: 401 })
  }

  try {
    const supabase = createServerSupabaseClient()
    if (!supabase) {
      return NextResponse.json(
        { success: false, error: 'Supabase is not configured. Add env vars.', code: 'SUPABASE_NOT_CONFIGURED' },
        { status: 503 }
      )
    }

    const body = await req.json()
    if (!body.title?.trim()) {
      return NextResponse.json(
        { success: false, error: 'title is required', code: 'VALIDATION_ERROR' },
        { status: 400 }
      )
    }

    const row = toDbRow(body)

    const { data, error } = await supabase
      .from('portfolio_services')
      .insert([row])
      .select()
      .single()

    if (error) {
      if (isTableMissingError(error)) return NextResponse.json(TABLE_MISSING_RESPONSE, { status: 400 })
      // Handle duplicate slug
      if (error.code === '23505') {
        const retryRow = { ...row, slug: `${row.slug}-${Date.now()}` }
        const retry = await supabase
          .from('portfolio_services')
          .insert([retryRow])
          .select()
          .single()
        if (retry.error) {
          return NextResponse.json(
            { success: false, error: retry.error.message, code: retry.error.code },
            { status: 500 }
          )
        }
        return NextResponse.json({ success: true, data: toFrontend(retry.data as Record<string, unknown>) })
      }
      return NextResponse.json(
        { success: false, error: error.message, code: error.code || 'POST_FAILED' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data: toFrontend(data as Record<string, unknown>) })
  } catch (e: unknown) {
    return NextResponse.json(
      { success: false, error: String(e), code: 'SERVER_ERROR' },
      { status: 500 }
    )
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PUT — update existing service (id in body)
// ─────────────────────────────────────────────────────────────────────────────
export async function PUT(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ success: false, error: 'Unauthorized — admin session required', code: 'UNAUTHORIZED' }, { status: 401 })
  }

  try {
    const supabase = createServerSupabaseClient()
    if (!supabase) {
      return NextResponse.json(
        { success: false, error: 'Supabase is not configured. Add env vars.', code: 'SUPABASE_NOT_CONFIGURED' },
        { status: 503 }
      )
    }

    const body = await req.json()
    const { id } = body
    if (!id) {
      return NextResponse.json({ success: false, error: 'id is required for update', code: 'VALIDATION_ERROR' }, { status: 400 })
    }

    const row = {
      ...toDbRow(body),
      updated_at: new Date().toISOString(),
    }
    const { id: _id, ...updateRow } = { id, ...row }
    void _id

    const { data, error } = await supabase
      .from('portfolio_services')
      .update(updateRow)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (isTableMissingError(error)) return NextResponse.json(TABLE_MISSING_RESPONSE, { status: 400 })
      return NextResponse.json(
        { success: false, error: error.message, code: error.code || 'PUT_FAILED' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data: toFrontend(data as Record<string, unknown>) })
  } catch (e: unknown) {
    return NextResponse.json(
      { success: false, error: String(e), code: 'SERVER_ERROR' },
      { status: 500 }
    )
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// DELETE — delete service (?id=uuid in query string)
// ─────────────────────────────────────────────────────────────────────────────
export async function DELETE(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ success: false, error: 'Unauthorized — admin session required', code: 'UNAUTHORIZED' }, { status: 401 })
  }

  try {
    const supabase = createServerSupabaseClient()
    if (!supabase) {
      return NextResponse.json(
        { success: false, error: 'Supabase is not configured.', code: 'SUPABASE_NOT_CONFIGURED' },
        { status: 503 }
      )
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ success: false, error: 'id query param is required', code: 'VALIDATION_ERROR' }, { status: 400 })
    }

    const { error } = await supabase.from('portfolio_services').delete().eq('id', id)

    if (error) {
      if (isTableMissingError(error)) return NextResponse.json(TABLE_MISSING_RESPONSE, { status: 400 })
      return NextResponse.json(
        { success: false, error: error.message, code: error.code || 'DELETE_FAILED' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data: { id } })
  } catch (e: unknown) {
    return NextResponse.json(
      { success: false, error: String(e), code: 'SERVER_ERROR' },
      { status: 500 }
    )
  }
}
