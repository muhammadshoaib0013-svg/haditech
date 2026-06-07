import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'src', 'lib', 'data.ts')
const ADMIN_PW  = process.env.ADMIN_PASSWORD || 'haditech2025'

function auth(req: NextRequest) {
  return req.headers.get('x-admin-pw') === ADMIN_PW
}

// ─── GET: read current data.ts ────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const content = fs.readFileSync(DATA_FILE, 'utf-8')
    return NextResponse.json({ content })
  } catch {
    return NextResponse.json({ error: 'Cannot read data.ts' }, { status: 500 })
  }
}

// ─── POST: add entry OR update siteConfig ────────────────────────────────────
export async function POST(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { action, section, payload } = await req.json()
    let content = fs.readFileSync(DATA_FILE, 'utf-8')

    if (action === 'add')               content = addEntry(content, section, payload)
    else if (action === 'update_config') content = updateConfig(content, payload)
    else if (action === 'delete')        content = deleteEntry(content, section, payload.key)

    fs.writeFileSync(DATA_FILE, content, 'utf-8')
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

// ─── helpers ─────────────────────────────────────────────────────────────────
function e(s: string) {
  return (s ?? '').replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n')
}
function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function addEntry(content: string, section: string, p: any): string {
  let block = ''

  if (section === 'projects') {
    const results = (p.results || []).filter((r: any) => r.metric && r.value)
    const shots   = (p.screenshots || []).filter(Boolean)
    block = `
  {
    title: "${e(p.title)}",
    slug: "${slug(p.title)}",
    description: "${e(p.description)}",
    category: "${e(p.category)}",
    stack: [${(p.stack || []).map((s: string) => `"${s}"`).join(', ')}],
    tags: [${(p.tags || []).map((t: string) => `"${e(t)}"`).join(', ')}],
    difficulty: "${e(p.difficulty || 'Advanced')}",
    featured: ${!!p.featured},
    thumbnailType: "${e(p.thumbnailType || 'video-placeholder')}",${p.thumbnailSrc ? `\n    thumbnailSrc: "${e(p.thumbnailSrc)}",` : ''}
    liveUrl: "${e(p.liveUrl || '#')}",
    githubUrl: "${e(p.githubUrl || '#')}",
    duration: "${e(p.duration || '2:00')}",
    result: "${e(p.result || '')}",
    challenge: "${e(p.challenge || '')}",
    solution: "${e(p.solution || '')}",
    results: [${results.map((r: any) => `\n      { metric: "${e(r.metric)}", value: "${e(r.value)}" }`).join(',')}
    ],
    techDeepDive: "${e(p.techDeepDive || '')}",${p.testimonialQuote ? `
    clientTestimonial: {
      quote: "${e(p.testimonialQuote)}",
      name: "${e(p.testimonialName || '')}",
      role: "${e(p.testimonialRole || '')}"
    },` : ''}
    screenshots: [${shots.map((s: string) => `"${e(s)}"`).join(', ')}]
  },`
  }

  if (section === 'videos') {
    block = `
  {
    title: "${e(p.title)}",
    platform: "${e(p.platform || 'YouTube')}",
    url: "${e(p.url || '#')}",
    featured: ${!!p.featured},
    duration: "${e(p.duration || '')}",
    imageSrc: "${e(p.imageSrc || '')}"
  },`
  }

  if (section === 'testimonials') {
    block = `
  {
    id: "t-${Date.now().toString(36)}",
    name: "${e(p.name)}",
    role: "${e(p.role || '')}",
    company: "${e(p.company || '')}",
    companyUrl: "${e(p.companyUrl || '#')}",
    quote: "${e(p.quote)}",
    rating: ${p.rating ?? 5},
    projectId: ${p.projectId ? `"${e(p.projectId)}"` : 'null'},
    avatarUrl: "${e(p.avatarUrl || '')}",
    featured: ${!!p.featured}
  },`
  }

  if (section === 'services') {
    const feats = (p.features || []).filter(Boolean)
    block = `
  {
    title: "${e(p.title)}",
    shortDescription: "${e(p.shortDescription || '')}",
    features: [${feats.map((f: string) => `"${e(f)}"`).join(', ')}],
    iconName: "${e(p.iconName || 'Rocket')}",
    category: "${e(p.category || '')}",
    pricingHint: "${e(p.pricingHint || '')}",
    deliveryTime: "${e(p.deliveryTime || '')}",
    popular: ${!!p.popular},
    tier: "${e(p.tier || 'starter')}" as const
  },`
  }

  if (!block) throw new Error(`Unknown section: ${section}`)

  // Insert before closing ]; of the section
  const marker   = `export const ${section}`
  const start    = content.indexOf(marker)
  if (start === -1) throw new Error(`Section "${section}" not found in data.ts`)
  const closeIdx = content.indexOf('];', start)
  if (closeIdx === -1) throw new Error(`Closing ]; not found for ${section}`)
  return content.slice(0, closeIdx) + block + '\n' + content.slice(closeIdx)
}

function updateConfig(content: string, p: any): string {
  const replacement = `export const siteConfig = {
  brandName: "${e(p.brandName)}",
  tagline: "${e(p.tagline)}",
  siteDescription:
    "${e(p.siteDescription)}",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "${e(p.siteUrl)}",
  email: "${e(p.email)}",
  whatsappNumber: "${e(p.whatsappNumber)}",
  whatsappLink:
    "${e(p.whatsappLink)}",
  author: {
    name: "${e(p.authorName)}",
    jobTitle: "${e(p.jobTitle)}",
  },
  socials: {
    linkedin: "${e(p.linkedin)}",
    github: "${e(p.github)}",
    twitter: "${e(p.twitter)}",
    facebook: "${e(p.facebook)}",
  },
  availability: {
    open: ${!!p.availabilityOpen},
    message: "${e(p.availabilityMsg)}"
  }
};`

  const start = content.indexOf('export const siteConfig')
  if (start === -1) throw new Error('siteConfig not found')
  const end = content.indexOf('\n};', start) + 3
  return content.slice(0, start) + replacement + content.slice(end)
}

function deleteEntry(content: string, section: string, keyValue: string): string {
  const esc = keyValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  // Remove the object block containing this key value
  const re = new RegExp(
    `\\n  \\{[^{}]*?(?:\\{[^{}]*?\\}[^{}]*?)*?"${esc}"(?:[^{}]*?(?:\\{[^{}]*?\\}[^{}]*?)*?)*?\\},`,
    'gs'
  )
  return content.replace(re, '')
}
