import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

const ADMIN_PW = process.env.ADMIN_PASSWORD || 'haditech2025'
const ALLOWED   = ['image/jpeg','image/png','image/webp','image/gif']
const MAX_BYTES = 2 * 1024 * 1024 // 2MB

export async function POST(req: NextRequest) {
  if (req.headers.get('x-admin-pw') !== ADMIN_PW)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const form     = await req.formData()
  const file     = form.get('file') as File | null
  const folder   = (form.get('folder') as string) || 'projects'

  if (!file)
    return NextResponse.json({ error: 'No file' }, { status: 400 })
  if (!ALLOWED.includes(file.type))
    return NextResponse.json({ error: 'Only JPG, PNG, WebP allowed' }, { status: 400 })
  if (file.size > MAX_BYTES)
    return NextResponse.json({ error: 'Max size 2MB' }, { status: 400 })

  // Clean filename
  const ext      = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const base     = file.name
    .replace(/\.[^/.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .slice(0, 40)
  const filename = `${base}-${Date.now()}.${ext}`

  const dir  = path.join(process.cwd(), 'public', 'images', folder)
  const dest = path.join(dir, filename)

  await mkdir(dir, { recursive: true })
  const buffer = Buffer.from(await file.arrayBuffer())
  await writeFile(dest, buffer)

  return NextResponse.json({
    ok:   true,
    path: `/images/${folder}/${filename}`,
    name: filename,
  })
}
