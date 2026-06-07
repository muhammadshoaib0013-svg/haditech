import { NextResponse, NextRequest } from 'next/server'
import fs from 'fs'
import path from 'path'
import { ADMIN_COOKIE_NAME, ADMIN_COOKIE_VALUE } from '@/lib/admin-auth'

function checkAuth(request: NextRequest) {
  const cookie = request.cookies.get(ADMIN_COOKIE_NAME)
  return cookie?.value === ADMIN_COOKIE_VALUE
}

export async function GET(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const rescuePath = path.join(process.cwd(), 'supabase', 'cms_rescue.sql')
    const schemaPath = path.join(process.cwd(), 'supabase', 'schema.sql')
    const seedPath = path.join(process.cwd(), 'supabase', 'seed_content.sql')

    const rescue = fs.existsSync(rescuePath) ? fs.readFileSync(rescuePath, 'utf8') : ''
    const schema = fs.existsSync(schemaPath) ? fs.readFileSync(schemaPath, 'utf8') : ''
    const seed = fs.existsSync(seedPath) ? fs.readFileSync(seedPath, 'utf8') : ''

    return NextResponse.json({
      success: true,
      rescue,
      schema,
      seed
    })
  } catch (e: any) {
    return NextResponse.json({ error: 'Failed to read SQL files: ' + e.message }, { status: 500 })
  }
}
