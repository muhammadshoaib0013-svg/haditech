import { createClient } from '@supabase/supabase-js'
import { projects as fallbackProjects, videos as fallbackVideos, testimonials as fallbackTestimonials } from '@/lib/data'
import { normalizeScreenshots } from '@/lib/project-image-utils'

function getPublicSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

export interface DbProject {
  id: string; title: string; slug: string; description: string; category: string;
  stack: string[]; tags: string[]; featured: boolean; status: string;
  live_url: string; github_url: string; duration: string; result: string;
  challenge: string; solution: string; tech_deep_dive: string;
  screenshots: string[]; primary_image: string; created_at: string;
  primary_image_url?: string; primaryImageUrl?: string;
  results?: { metric: string; value: string }[];
}

export interface DbVideo {
  id: string; title: string; platform: string; url: string;
  duration: string; image_src: string; featured: boolean; status: string;
}

export interface DbTestimonial {
  id: string; quote: string; name: string; role: string; company: string;
  avatar_url: string; rating: number; featured: boolean; status: string;
}

export async function getPublishedProjects(): Promise<DbProject[]> {
  const supabase = getPublicSupabase()
  if (!supabase) return fallbackProjects as unknown as DbProject[]
  try {
    const { data, error } = await supabase
      .from('portfolio_projects')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
    if (error || !data || data.length === 0) return fallbackProjects as unknown as DbProject[]
    
    return (data || []).map(row => {
      const img = row.primary_image_url || row.primary_image || ''
      return {
        ...row,
        primary_image: img,
        primary_image_url: img,
        primaryImageUrl: img,
        screenshots: normalizeScreenshots(row.screenshots)
      }
    })
  } catch { return fallbackProjects as unknown as DbProject[] }
}

export async function getProjectBySlug(slug: string): Promise<DbProject | null> {
  const supabase = getPublicSupabase()
  if (!supabase) return (fallbackProjects.find(p => p.slug === slug) as unknown as DbProject) || null
  try {
    const { data, error } = await supabase
      .from('portfolio_projects')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single()
    if (error || !data) return (fallbackProjects.find(p => p.slug === slug) as unknown as DbProject) || null
    
    const img = data.primary_image_url || data.primary_image || ''
    return {
      ...data,
      primary_image: img,
      primary_image_url: img,
      primaryImageUrl: img,
      screenshots: normalizeScreenshots(data.screenshots)
    }
  } catch { return (fallbackProjects.find(p => p.slug === slug) as unknown as DbProject) || null }
}

export async function getPublishedVideos(): Promise<DbVideo[]> {
  const supabase = getPublicSupabase()
  if (!supabase) return fallbackVideos as unknown as DbVideo[]
  try {
    const { data, error } = await supabase
      .from('portfolio_videos')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
    if (error || !data || data.length === 0) return fallbackVideos as unknown as DbVideo[]
    return data
  } catch { return fallbackVideos as unknown as DbVideo[] }
}

export async function getPublishedTestimonials(): Promise<DbTestimonial[]> {
  const supabase = getPublicSupabase()
  if (!supabase) return fallbackTestimonials as unknown as DbTestimonial[]
  try {
    const { data, error } = await supabase
      .from('portfolio_testimonials')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
    if (error || !data || data.length === 0) return fallbackTestimonials as unknown as DbTestimonial[]
    return data
  } catch { return fallbackTestimonials as unknown as DbTestimonial[] }
}

export async function getAllProjectSlugs(): Promise<string[]> {
  const supabase = getPublicSupabase()
  // Always include fallback slugs for static generation
  const fallbackSlugs = fallbackProjects.map(p => p.slug)
  if (!supabase) return fallbackSlugs
  try {
    const { data } = await supabase.from('portfolio_projects').select('slug').eq('status', 'published')
    const dbSlugs = (data || []).map((p: { slug: string }) => p.slug)
    return Array.from(new Set([...fallbackSlugs, ...dbSlugs]))
  } catch { return fallbackSlugs }
}
