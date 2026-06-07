'use client'
import { useState, useEffect, useCallback } from 'react'
import { isImageUrl, isYouTubeUrl } from '@/lib/project-image-utils'

interface Project {
  id: string
  title: string
  slug: string
  description: string
  category: string
  stack: string[]
  tags: string[]
  featured: boolean
  status: 'draft' | 'published'
  live_url: string
  github_url: string
  duration: string
  result: string
  challenge: string
  solution: string
  tech_deep_dive: string
  screenshots: string[]
  primary_image: string
  created_at: string
}

interface MediaAsset { id: string; file_name: string; file_url: string }

const EMPTY_FORM: {
  title: string; slug: string; description: string; category: string; stack: string;
  tags: string; featured: boolean; status: 'draft' | 'published';
  live_url: string; github_url: string; duration: string; result: string;
  challenge: string; solution: string; tech_deep_dive: string;
  screenshots: string; primary_image: string;
} = {
  title: '', slug: '', description: '', category: '', stack: '',
  tags: '', featured: false, status: 'draft',
  live_url: '', github_url: '', duration: '', result: '',
  challenge: '', solution: '', tech_deep_dive: '',
  screenshots: '', primary_image: '',
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

const s: Record<string, React.CSSProperties> = {
  page: { padding: 32, maxWidth: 1200, margin: '0 auto' },
  heading: { color: '#f1f5f9', fontSize: 24, fontWeight: 800, margin: 0 },
  btn: { padding: '10px 20px', borderRadius: 10, border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s' },
  primaryBtn: { background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)', color: 'white', boxShadow: '0 4px 16px rgba(59,130,246,0.3)' },
  dangerBtn: { background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' },
  successBtn: { background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' },
  input: {
    width: '100%', padding: '10px 14px', background: '#1a2744',
    border: '1px solid #1e3a5f', borderRadius: 10, color: '#f1f5f9',
    fontSize: 13, outline: 'none', boxSizing: 'border-box' as const,
  },
  label: { color: '#64748b', fontSize: 12, fontWeight: 600, letterSpacing: 1, display: 'block', marginBottom: 6 },
  card: { background: '#0f1729', border: '1px solid #1e3a5f', borderRadius: 14, padding: '20px 24px', marginBottom: 14 },
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [media, setMedia] = useState<MediaAsset[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<Project | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [showMediaPicker, setShowMediaPicker] = useState(false)
  const [pickerTarget, setPickerTarget] = useState<'primary' | 'screenshots'>('primary')
  const [supabaseConfigured, setSupabaseConfigured] = useState(true)
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({})

  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      const [pRes, mRes] = await Promise.all([
        fetch('/api/admin/projects'),
        fetch('/api/admin/media/list'),
      ])
      const pJson = await pRes.json()
      const mJson = await mRes.json()

      // Detect 503 / missing Supabase config
      if (pRes.status === 503 || mRes.status === 503) {
        setSupabaseConfigured(false)
        setError(pJson.error || mJson.error || 'Supabase is not configured')
        return
      }

      setProjects(pJson.data || [])
      setMedia(mJson.data || [])
      setSupabaseConfigured(true)
    } catch { setError('Failed to load data') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  function openAdd() {
    if (!supabaseConfigured) return
    setForm(EMPTY_FORM); setEditingId(null); setShowForm(true); setError(''); setSuccess('')
  }
  function openEdit(p: Project) {
    if (!supabaseConfigured) return
    setForm({
      title: p.title, slug: p.slug, description: p.description,
      category: p.category, stack: p.stack.join(', '), tags: p.tags.join(', '),
      featured: p.featured, status: p.status,
      live_url: p.live_url, github_url: p.github_url, duration: p.duration,
      result: p.result, challenge: p.challenge, solution: p.solution,
      tech_deep_dive: p.tech_deep_dive, screenshots: p.screenshots.join(', '),
      primary_image: p.primary_image || '',
    })
    setEditingId(p.id); setShowForm(true); setError(''); setSuccess('')
  }

  function handleTitleChange(title: string) {
    setForm(f => ({ ...f, title, slug: slugify(title) }))
  }

  async function handleSave() {
    if (!form.title.trim()) { setError('Title is required'); return }
    if (!form.slug.trim()) { setError('Slug is required'); return }
    setSaving(true); setError('')

    // Build screenshot list — reject YouTube URLs and non-image URLs
    const rawScreenshots = form.screenshots.split(',').map(s => s.trim()).filter(Boolean)
    const screenshotWarnings = rawScreenshots.filter(u => isYouTubeUrl(u) || !isImageUrl(u))
    const cleanScreenshots = rawScreenshots.filter(u => isImageUrl(u) && !isYouTubeUrl(u))

    if (screenshotWarnings.length > 0) {
      setError(`⚠️ Removed ${screenshotWarnings.length} invalid screenshot URL(s) (YouTube links or non-image URLs). Screenshots must be image URLs only.`)
    }

    // Build primary_image — use the form field, then fall back to first clean screenshot
    const primaryImage = (isImageUrl(form.primary_image) && !isYouTubeUrl(form.primary_image))
      ? form.primary_image
      : cleanScreenshots[0] || ''

    // Combine into unique list, primary first
    const finalScreenshots = Array.from(
      new Set([primaryImage, ...cleanScreenshots].filter(Boolean))
    )

    const payload = {
      ...form,
      stack: form.stack.split(',').map(s => s.trim()).filter(Boolean),
      tags: form.tags.split(',').map(s => s.trim()).filter(Boolean),
      primary_image: primaryImage,
      screenshots: finalScreenshots,
    }
    try {
      const url = editingId ? `/api/admin/projects/${editingId}` : '/api/admin/projects'
      const method = editingId ? 'PUT' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const json = await res.json()
      if (!res.ok) { setError(json.error || 'Save failed'); return }
      setSuccess(editingId ? '✅ Project updated!' : '✅ Project created!')
      setShowForm(false)
      fetchAll()
    } catch { setError('Save failed') }
    finally { setSaving(false) }
  }

  async function toggleStatus(p: Project) {
    if (!supabaseConfigured) return
    const newStatus = p.status === 'published' ? 'draft' : 'published'
    try {
      await fetch(`/api/admin/projects/${p.id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      fetchAll()
    } catch { setError('Status update failed') }
  }

  async function handleDelete(p: Project) {
    if (!supabaseConfigured) return
    setConfirmDelete(null)
    try {
      await fetch(`/api/admin/projects/${p.id}`, { method: 'DELETE' })
      setSuccess('🗑️ Project deleted')
      fetchAll()
    } catch { setError('Delete failed') }
  }

  function pickMedia(url: string) {
    if (pickerTarget === 'primary') {
      setBrokenImages(prev => ({ ...prev, 'form-preview': false }))
      setForm(f => ({ ...f, primary_image: url }))
    } else {
      setForm(f => ({ ...f, screenshots: f.screenshots ? `${f.screenshots}, ${url}` : url }))
    }
    setShowMediaPicker(false)
  }

  return (
    <div style={s.page}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={s.heading}>🗂️ Manage Projects</h1>
          <p style={{ color: '#64748b', fontSize: 14, marginTop: 6 }}>Create, edit, and publish your portfolio projects.</p>
        </div>
        <button
          onClick={openAdd}
          disabled={!supabaseConfigured}
          style={{ ...s.btn, ...s.primaryBtn, opacity: !supabaseConfigured ? 0.45 : 1, cursor: !supabaseConfigured ? 'not-allowed' : 'pointer' }}
        >
          + Add Project
        </button>
      </div>

      {/* Supabase not configured warning */}
      {!supabaseConfigured && (
        <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 12, padding: '20px 24px', marginBottom: 28 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 24 }}>⚠️</span>
            <div>
              <h3 style={{ color: '#ef4444', margin: '0 0 6px', fontSize: 15, fontWeight: 700 }}>Supabase Connection Inactive</h3>
              <p style={{ color: '#94a3b8', margin: 0, fontSize: 13, lineHeight: 1.6 }}>
                Projects cannot be loaded or saved without a Supabase connection. Add{' '}
                <code>NEXT_PUBLIC_SUPABASE_URL</code>, <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, and{' '}
                <code>SUPABASE_SERVICE_ROLE_KEY</code> to your <code>.env.local</code> file and restart the server.
              </p>
            </div>
          </div>
        </div>
      )}

      {error && supabaseConfigured && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '12px 16px', marginBottom: 16, color: '#ef4444', fontSize: 13 }}>❌ {error}</div>}
      {success && <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 10, padding: '12px 16px', marginBottom: 16, color: '#10b981', fontSize: 13 }}>{success}</div>}

      {/* Project List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 48, color: '#475569' }}>⏳ Loading projects...</div>
      ) : !supabaseConfigured ? (
        <div style={{ textAlign: 'center', padding: 64, color: '#334155', border: '1px dashed #1e293b', borderRadius: 16 }}>
          Supabase is not configured. Project data cannot be loaded.
        </div>
      ) : projects.length === 0 && !showForm ? (
        <div style={{ textAlign: 'center', padding: 64, color: '#334155', border: '1px dashed #1e3a5f', borderRadius: 16 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>No projects yet</div>
          <div style={{ fontSize: 13, marginTop: 6, marginBottom: 20 }}>Click &quot;Add Project&quot; to create your first one</div>
          <button onClick={openAdd} style={{ ...s.btn, ...s.primaryBtn }}>+ Add First Project</button>
        </div>
      ) : (
        !showForm && (
          <div>
            {projects.map(p => (
              <div key={p.id} style={s.card}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                  {p.primary_image && !brokenImages[p.id] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.primary_image}
                      alt={p.title}
                      onError={() => setBrokenImages(prev => ({ ...prev, [p.id]: true }))}
                      style={{ width: 80, height: 56, objectFit: 'cover', borderRadius: 8, border: '1px solid #1e3a5f', flexShrink: 0 }}
                    />
                  ) : (
                    <div style={{
                      width: 80, height: 56, borderRadius: 8, border: '1px solid #1e3a5f', flexShrink: 0,
                      background: 'linear-gradient(135deg, #1e3a5f, #0f1729)', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', color: '#64748b', fontSize: 10, fontWeight: 700, textAlign: 'center',
                      padding: 4, boxSizing: 'border-box'
                    }}>
                      {p.title.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 15 }}>{p.title}</div>
                    <div style={{ color: '#475569', fontSize: 12, marginTop: 4 }}>
                      /{p.slug} · {p.category}
                    </div>
                    <div style={{ color: '#64748b', fontSize: 12, marginTop: 4, lineHeight: 1.5 }}>{p.description}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{
                      padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700,
                      background: p.status === 'published' ? 'rgba(16,185,129,0.15)' : 'rgba(100,116,139,0.15)',
                      color: p.status === 'published' ? '#10b981' : '#64748b',
                      border: `1px solid ${p.status === 'published' ? 'rgba(16,185,129,0.3)' : 'rgba(100,116,139,0.3)'}`,
                    }}>
                      {p.status === 'published' ? '🟢 Published' : '⚫ Draft'}
                    </span>
                    <button onClick={() => toggleStatus(p)} style={{ ...s.btn, padding: '6px 14px', fontSize: 12, ...(p.status === 'published' ? s.dangerBtn : s.successBtn) }}>
                      {p.status === 'published' ? 'Unpublish' : 'Publish'}
                    </button>
                    <button onClick={() => openEdit(p)} style={{ ...s.btn, padding: '6px 14px', fontSize: 12, background: 'rgba(59,130,246,0.15)', color: '#93c5fd', border: '1px solid rgba(59,130,246,0.3)' }}>Edit</button>
                    <button onClick={() => setConfirmDelete(p)} style={{ ...s.btn, ...s.dangerBtn, padding: '6px 14px', fontSize: 12 }}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <div style={{ background: '#0f1729', border: '1px solid #1e3a5f', borderRadius: 16, padding: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <h2 style={{ color: '#f1f5f9', fontSize: 18, fontWeight: 700, margin: 0 }}>
              {editingId ? 'Edit Project' : 'Add New Project'}
            </h2>
            <button onClick={() => setShowForm(false)} style={{ ...s.btn, background: '#1a2744', color: '#64748b', border: '1px solid #1e3a5f' }}>✕ Cancel</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {/* Title */}
            <div style={{ gridColumn: '1/-1' }}>
              <label style={s.label}>TITLE *</label>
              <input style={s.input} value={form.title} onChange={e => handleTitleChange(e.target.value)} placeholder="Project title" />
            </div>
            {/* Slug */}
            <div>
              <label style={s.label}>SLUG *</label>
              <input style={s.input} value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="project-slug" />
            </div>
            {/* Category */}
            <div>
              <label style={s.label}>CATEGORY</label>
              <input style={s.input} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} placeholder="SaaS, AI Agents, Dashboard..." />
            </div>
            {/* Description */}
            <div style={{ gridColumn: '1/-1' }}>
              <label style={s.label}>DESCRIPTION</label>
              <textarea style={{ ...s.input, height: 80, resize: 'vertical' } as React.CSSProperties} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Short project description" />
            </div>
            {/* Primary Image */}
            <div style={{ gridColumn: '1/-1' }}>
              <label style={s.label}>PRIMARY IMAGE</label>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <input style={{ ...s.input, flex: 1 }} value={form.primary_image} onChange={e => { setBrokenImages(prev => ({ ...prev, 'form-preview': false })); setForm(f => ({ ...f, primary_image: e.target.value })) }} placeholder="Paste URL or pick from Media Library" />
                <button onClick={() => { setPickerTarget('primary'); setShowMediaPicker(true) }} style={{ ...s.btn, background: 'rgba(139,92,246,0.15)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.3)', whiteSpace: 'nowrap' }}>
                  🖼️ Pick
                </button>
              </div>
              {form.primary_image && (form.primary_image.includes('youtube.com') || form.primary_image.includes('youtu.be')) ? (
                <div style={{ color: '#ef4444', fontSize: 12, marginTop: 6, padding: '6px 10px', background: 'rgba(239,68,68,0.1)', borderRadius: 6, border: '1px solid rgba(239,68,68,0.3)' }}>
                  ❌ This is a YouTube URL — not a valid image. Please upload an image via Media Library and paste its URL here. YouTube links belong in the Videos CMS.
                </div>
              ) : form.primary_image && !brokenImages['form-preview'] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={form.primary_image}
                  alt="preview"
                  onError={() => setBrokenImages(prev => ({ ...prev, 'form-preview': true }))}
                  style={{ marginTop: 10, height: 80, borderRadius: 8, border: '1px solid #1e3a5f', objectFit: 'cover' }}
                />
              ) : form.primary_image ? (
                <div style={{
                  marginTop: 10, height: 80, width: 120, borderRadius: 8, border: '1px solid #1e3a5f',
                  background: 'linear-gradient(135deg, #1e3a5f, #0f1729)', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', color: '#64748b', fontSize: 12, fontWeight: 700
                }}>
                  Invalid Image
                </div>
              ) : null}
            </div>
            {/* Screenshots */}
            <div style={{ gridColumn: '1/-1' }}>
              <label style={s.label}>SCREENSHOTS (comma-separated URLs)</label>
              <div style={{ display: 'flex', gap: 10 }}>
                <input style={{ ...s.input, flex: 1 }} value={form.screenshots} onChange={e => setForm(f => ({ ...f, screenshots: e.target.value }))} placeholder="https://..., https://..." />
                <button onClick={() => { setPickerTarget('screenshots'); setShowMediaPicker(true) }} style={{ ...s.btn, background: 'rgba(139,92,246,0.15)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.3)', whiteSpace: 'nowrap' }}>
                  🖼️ Add
                </button>
              </div>
              {/* YouTube warning */}
              {form.screenshots && (form.screenshots.includes('youtube.com') || form.screenshots.includes('youtu.be')) && (
                <div style={{ color: '#f59e0b', fontSize: 12, marginTop: 6, padding: '6px 10px', background: 'rgba(245,158,11,0.1)', borderRadius: 6, border: '1px solid rgba(245,158,11,0.3)' }}>
                  ⚠️ Screenshots must be image URLs (JPG, PNG, WebP, etc.) — not YouTube links. YouTube links will be removed on save. Use the <strong>Videos CMS</strong> for video content.
                </div>
              )}
            </div>
            {/* Stack */}
            <div>
              <label style={s.label}>TECH STACK (comma-separated)</label>
              <input style={s.input} value={form.stack} onChange={e => setForm(f => ({ ...f, stack: e.target.value }))} placeholder="Next.js, TypeScript, Supabase" />
            </div>
            {/* Tags */}
            <div>
              <label style={s.label}>TAGS (comma-separated)</label>
              <input style={s.input} value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="SaaS, B2B, E-commerce" />
            </div>
            {/* Live URL */}
            <div>
              <label style={s.label}>LIVE URL</label>
              <input style={s.input} value={form.live_url} onChange={e => setForm(f => ({ ...f, live_url: e.target.value }))} placeholder="https://..." />
            </div>
            {/* GitHub URL */}
            <div>
              <label style={s.label}>GITHUB URL</label>
              <input style={s.input} value={form.github_url} onChange={e => setForm(f => ({ ...f, github_url: e.target.value }))} placeholder="https://github.com/..." />
            </div>
            {/* Result */}
            <div>
              <label style={s.label}>KEY RESULT</label>
              <input style={s.input} value={form.result} onChange={e => setForm(f => ({ ...f, result: e.target.value }))} placeholder="↑ 60% faster load" />
            </div>
            {/* Duration */}
            <div>
              <label style={s.label}>DURATION</label>
              <input style={s.input} value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} placeholder="2:15" />
            </div>
            {/* Challenge */}
            <div style={{ gridColumn: '1/-1' }}>
              <label style={s.label}>THE CHALLENGE</label>
              <textarea style={{ ...s.input, height: 90, resize: 'vertical' } as React.CSSProperties} value={form.challenge} onChange={e => setForm(f => ({ ...f, challenge: e.target.value }))} placeholder="What problem did the client face?" />
            </div>
            {/* Solution */}
            <div style={{ gridColumn: '1/-1' }}>
              <label style={s.label}>THE SOLUTION</label>
              <textarea style={{ ...s.input, height: 90, resize: 'vertical' } as React.CSSProperties} value={form.solution} onChange={e => setForm(f => ({ ...f, solution: e.target.value }))} placeholder="How did you solve it?" />
            </div>
            {/* Tech Deep Dive */}
            <div style={{ gridColumn: '1/-1' }}>
              <label style={s.label}>TECH DEEP DIVE</label>
              <textarea style={{ ...s.input, height: 90, resize: 'vertical' } as React.CSSProperties} value={form.tech_deep_dive} onChange={e => setForm(f => ({ ...f, tech_deep_dive: e.target.value }))} placeholder="Technical implementation details..." />
            </div>
            {/* Status & Featured */}
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', gridColumn: '1/-1' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input type="checkbox" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} />
                <span style={{ color: '#94a3b8', fontSize: 13 }}>Featured project</span>
              </label>
              <select
                value={form.status}
                onChange={e => setForm(f => ({ ...f, status: e.target.value as 'draft' | 'published' }))}
                style={{ ...s.input, width: 160 }}
              >
                <option value="draft">⚫ Draft</option>
                <option value="published">🟢 Published</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 28, justifyContent: 'flex-end' }}>
            <button onClick={() => setShowForm(false)} style={{ ...s.btn, background: '#1a2744', color: '#64748b', border: '1px solid #1e3a5f' }}>Cancel</button>
            <button onClick={handleSave} disabled={saving} style={{ ...s.btn, ...s.primaryBtn, opacity: saving ? 0.7 : 1 }}>
              {saving ? '⏳ Saving...' : editingId ? '💾 Save Changes' : '✅ Create Project'}
            </button>
          </div>
        </div>
      )}

      {/* Media Picker Modal */}
      {showMediaPicker && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ background: '#0f1729', border: '1px solid #1e3a5f', borderRadius: 16, padding: 28, width: '90%', maxWidth: 700, maxHeight: '80vh', overflow: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <h3 style={{ color: '#f1f5f9', margin: 0 }}>Pick from Media Library</h3>
              <button onClick={() => setShowMediaPicker(false)} style={{ ...s.btn, background: '#1a2744', color: '#64748b', border: '1px solid #1e3a5f' }}>✕</button>
            </div>
            {media.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 40, color: '#475569' }}>No media files. Upload some in the Media Library first.</div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 12 }}>
                {media.map(asset => (
                  <div key={asset.id} onClick={() => pickMedia(asset.file_url)} style={{ cursor: 'pointer', borderRadius: 10, overflow: 'hidden', border: '2px solid #1e3a5f', transition: 'border-color 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = '#3b82f6')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = '#1e3a5f')}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={asset.file_url} alt={asset.file_name} style={{ width: '100%', height: 120, objectFit: 'cover', display: 'block' }} />
                    <div style={{ padding: '8px 10px', background: '#1a2744', color: '#94a3b8', fontSize: 11, wordBreak: 'break-all' }}>{asset.file_name}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {confirmDelete && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ background: '#0f1729', border: '1px solid #1e3a5f', borderRadius: 16, padding: 32, maxWidth: 400, width: '90%' }}>
            <h3 style={{ color: '#f1f5f9', margin: '0 0 12px' }}>Delete Project?</h3>
            <p style={{ color: '#64748b', fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
              Delete <strong style={{ color: '#e2e8f0' }}>{confirmDelete.title}</strong>? This cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setConfirmDelete(null)} style={{ ...s.btn, flex: 1, background: '#1a2744', color: '#94a3b8', border: '1px solid #1e3a5f' }}>Cancel</button>
              <button onClick={() => handleDelete(confirmDelete)} style={{ ...s.btn, ...s.dangerBtn, flex: 1 }}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
