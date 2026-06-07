import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { ADMIN_COOKIE_NAME, ADMIN_COOKIE_VALUE } from '@/lib/admin-auth'
import { getSupabaseEnv } from '@/lib/supabase/env'

function checkAuth(request: NextRequest) {
  const sessionCookie = request.cookies.get(ADMIN_COOKIE_NAME)
  return sessionCookie?.value === ADMIN_COOKIE_VALUE
}

const BUCKET = 'haditech-media'
const MAX_SIZE_MB = 10
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']

function generateSafeFilename(originalName: string): string {
  const ext = originalName.split('.').pop() || 'jpg'
  const base = originalName
    .replace(/\.[^.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 40)
  return `${base}-${Date.now()}.${ext}`
}

export async function POST(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check if Supabase is configured
  if (!getSupabaseEnv().isConfigured) {
    return NextResponse.json(
      { success: false, error: 'Supabase is not configured. Please add NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY in .env.local and restart the dev server.' },
      { status: 503 }
    )
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 })
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `File type "${file.type}" not allowed. Allowed image formats: JPG, JPEG, PNG, WebP, GIF, SVG. Max size: 10MB.` },
        { status: 400 }
      )
    }

    // Validate file size
    const sizeMB = file.size / (1024 * 1024)
    if (sizeMB > MAX_SIZE_MB) {
      return NextResponse.json(
        { error: `File too large (${sizeMB.toFixed(1)}MB). Maximum is ${MAX_SIZE_MB}MB.` },
        { status: 400 }
      )
    }

    const safeFilename = generateSafeFilename(file.name)
    const buffer = Buffer.from(await file.arrayBuffer())

    const supabase = createServerSupabaseClient()
    if (!supabase) throw new Error('Supabase client failed to initialize')

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(safeFilename, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) throw uploadError

    // Get public URL
    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(safeFilename)
    const publicUrl = urlData.publicUrl

    // Save to media_assets table
    const { data: asset, error: dbError } = await supabase
      .from('media_assets')
      .insert({
        file_name: file.name,
        file_url: publicUrl,
        file_type: file.type,
        bucket_path: safeFilename,
        size: file.size,
      })
      .select()
      .single()

    if (dbError) throw dbError

    return NextResponse.json({ success: true, asset })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Upload failed'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
