'use client'
import { useState, useEffect, useCallback } from 'react'

interface Video {
  id: string; title: string; platform: string; url: string;
  duration: string; image_src: string; featured: boolean; status: 'draft' | 'published'; created_at: string
}
interface MediaAsset { id: string; file_name: string; file_url: string }

const EMPTY: {
  title: string; platform: string; url: string; duration: string;
  image_src: string; featured: boolean; status: 'draft' | 'published';
} = { title: '', platform: 'YouTube', url: '', duration: '', image_src: '', featured: false, status: 'draft' }

const s: Record<string, React.CSSProperties> = {
  page: { padding: 32, maxWidth: 1100, margin: '0 auto' },
  btn: { padding: '10px 20px', borderRadius: 10, border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s' },
  primaryBtn: { background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)', color: 'white' },
  dangerBtn: { background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' },
  successBtn: { background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' },
  input: { width: '100%', padding: '10px 14px', background: '#1a2744', border: '1px solid #1e3a5f', borderRadius: 10, color: '#f1f5f9', fontSize: 13, outline: 'none', boxSizing: 'border-box' as const },
  label: { color: '#64748b', fontSize: 12, fontWeight: 600, letterSpacing: 1, display: 'block', marginBottom: 6 },
  card: { background: '#0f1729', border: '1px solid #1e3a5f', borderRadius: 14, padding: '20px 24px', marginBottom: 12 },
}

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<Video[]>([])
  const [media, setMedia] = useState<MediaAsset[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(''); const [success, setSuccess] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<Video | null>(null)
  const [showPicker, setShowPicker] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [supabaseConfigured, setSupabaseConfigured] = useState(true)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      const [vRes, mRes] = await Promise.all([fetch('/api/admin/videos'), fetch('/api/admin/media/list')])
      const vJson = await vRes.json(); const mJson = await mRes.json()

      // Detect 503 / missing Supabase config
      if (vRes.status === 503 || mRes.status === 503) {
        setSupabaseConfigured(false)
        setError(vJson.error || mJson.error || 'Supabase is not configured')
        return
      }

      setVideos(vJson.data || []); setMedia(mJson.data || [])
      setSupabaseConfigured(true)
    } catch { setError('Failed to load') } finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  function openAdd() {
    if (!supabaseConfigured) return
    setForm(EMPTY); setEditingId(null); setShowForm(true); setError(''); setSuccess('')
  }
  function openEdit(v: Video) {
    if (!supabaseConfigured) return
    setForm({ title: v.title, platform: v.platform, url: v.url, duration: v.duration, image_src: v.image_src, featured: v.featured, status: v.status })
    setEditingId(v.id); setShowForm(true)
  }

  async function handleSave() {
    if (!form.title.trim()) { setError('Title is required'); return }
    setSaving(true); setError('')
    try {
      const url = editingId ? `/api/admin/videos/${editingId}` : '/api/admin/videos'
      const res = await fetch(url, { method: editingId ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const json = await res.json()
      if (!res.ok) { setError(json.error || 'Save failed'); return }
      setSuccess(editingId ? '✅ Video updated!' : '✅ Video added!'); setShowForm(false); fetchAll()
    } catch { setError('Save failed') } finally { setSaving(false) }
  }

  async function toggleStatus(v: Video) {
    if (!supabaseConfigured) return
    try {
      await fetch(`/api/admin/videos/${v.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: v.status === 'published' ? 'draft' : 'published' }) })
      fetchAll()
    } catch { setError('Update failed') }
  }

  async function handleDelete(v: Video) {
    if (!supabaseConfigured) return
    setConfirmDelete(null)
    try { await fetch(`/api/admin/videos/${v.id}`, { method: 'DELETE' }); setSuccess('🗑️ Video deleted'); fetchAll() }
    catch { setError('Delete failed') }
  }

  return (
    <div style={s.page}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ color: '#f1f5f9', fontSize: 24, fontWeight: 800, margin: 0 }}>▶️ Manage Videos</h1>
          <p style={{ color: '#64748b', fontSize: 14, marginTop: 6 }}>Add YouTube/Vimeo videos. Published videos appear on the public Videos page.</p>
        </div>
        <button
          onClick={openAdd}
          disabled={!supabaseConfigured}
          style={{ ...s.btn, ...s.primaryBtn, opacity: !supabaseConfigured ? 0.45 : 1, cursor: !supabaseConfigured ? 'not-allowed' : 'pointer' }}
        >
          + Add Video
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
                Videos cannot be loaded or saved without a Supabase connection. Add{' '}
                <code>NEXT_PUBLIC_SUPABASE_URL</code>, <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, and{' '}
                <code>SUPABASE_SERVICE_ROLE_KEY</code> to your <code>.env.local</code> file and restart the server.
              </p>
            </div>
          </div>
        </div>
      )}

      {error && supabaseConfigured && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '12px 16px', marginBottom: 16, color: '#ef4444', fontSize: 13 }}>❌ {error}</div>}
      {success && <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 10, padding: '12px 16px', marginBottom: 16, color: '#10b981', fontSize: 13 }}>{success}</div>}

      {loading ? <div style={{ textAlign: 'center', padding: 48, color: '#475569' }}>⏳ Loading...</div> :
        !supabaseConfigured ? (
          <div style={{ textAlign: 'center', padding: 64, color: '#334155', border: '1px dashed #1e293b', borderRadius: 16 }}>
            Supabase is not configured. Video data cannot be loaded.
          </div>
        ) : videos.length === 0 && !showForm ? (
          <div style={{ textAlign: 'center', padding: 64, color: '#334155', border: '1px dashed #1e3a5f', borderRadius: 16 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
            <div style={{ fontSize: 15, fontWeight: 600 }}>No videos yet</div>
            <div style={{ fontSize: 13, marginTop: 6, marginBottom: 20 }}>Click &quot;Add Video&quot; to add your first one</div>
            <button onClick={openAdd} style={{ ...s.btn, ...s.primaryBtn }}>+ Add First Video</button>
          </div>
        ) : !showForm && (
          <div>
            {videos.map(v => (
              <div key={v.id} style={s.card}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                  {v.image_src ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={v.image_src} alt={v.title} style={{ width: 100, height: 62, objectFit: 'cover', borderRadius: 8, border: '1px solid #1e3a5f', flexShrink: 0 }} />
                  ) : (
                    <div style={{ width: 100, height: 62, background: '#1a2744', borderRadius: 8, border: '1px solid #1e3a5f', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>▶️</div>
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{ color: '#f1f5f9', fontWeight: 700 }}>{v.title}</div>
                    <div style={{ color: '#475569', fontSize: 12, marginTop: 4 }}>{v.platform} · {v.duration} · {v.url || 'No URL'}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: v.status === 'published' ? 'rgba(16,185,129,0.15)' : 'rgba(100,116,139,0.15)', color: v.status === 'published' ? '#10b981' : '#64748b', border: `1px solid ${v.status === 'published' ? 'rgba(16,185,129,0.3)' : 'rgba(100,116,139,0.3)'}` }}>
                      {v.status === 'published' ? '🟢 Published' : '⚫ Draft'}
                    </span>
                    <button onClick={() => toggleStatus(v)} style={{ ...s.btn, padding: '6px 14px', fontSize: 12, ...(v.status === 'published' ? s.dangerBtn : s.successBtn) }}>
                      {v.status === 'published' ? 'Unpublish' : 'Publish'}
                    </button>
                    <button onClick={() => openEdit(v)} style={{ ...s.btn, padding: '6px 14px', fontSize: 12, background: 'rgba(59,130,246,0.15)', color: '#93c5fd', border: '1px solid rgba(59,130,246,0.3)' }}>Edit</button>
                    <button onClick={() => setConfirmDelete(v)} style={{ ...s.btn, ...s.dangerBtn, padding: '6px 14px', fontSize: 12 }}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      {showForm && (
        <div style={{ background: '#0f1729', border: '1px solid #1e3a5f', borderRadius: 16, padding: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
            <h2 style={{ color: '#f1f5f9', fontSize: 18, fontWeight: 700, margin: 0 }}>{editingId ? 'Edit Video' : 'Add Video'}</h2>
            <button onClick={() => setShowForm(false)} style={{ ...s.btn, background: '#1a2744', color: '#64748b', border: '1px solid #1e3a5f' }}>✕ Cancel</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ gridColumn: '1/-1' }}>
              <label style={s.label}>TITLE *</label>
              <input style={s.input} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Video title" />
            </div>
            <div>
              <label style={s.label}>PLATFORM</label>
              <select style={s.input} value={form.platform} onChange={e => setForm(f => ({ ...f, platform: e.target.value }))}>
                <option>YouTube</option><option>Vimeo</option><option>Other</option>
              </select>
            </div>
            <div>
              <label style={s.label}>DURATION</label>
              <input style={s.input} value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} placeholder="15:20" />
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <label style={s.label}>VIDEO URL</label>
              <input style={s.input} value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} placeholder="https://youtube.com/watch?v=..." />
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <label style={s.label}>THUMBNAIL IMAGE</label>
              <div style={{ display: 'flex', gap: 10 }}>
                <input style={{ ...s.input, flex: 1 }} value={form.image_src} onChange={e => setForm(f => ({ ...f, image_src: e.target.value }))} placeholder="Paste URL or pick from Media Library" />
                <button onClick={() => setShowPicker(true)} style={{ ...s.btn, background: 'rgba(139,92,246,0.15)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.3)', whiteSpace: 'nowrap' }}>🖼️ Pick</button>
              </div>
              {form.image_src && <img src={form.image_src} alt="thumb" style={{ marginTop: 10, height: 80, borderRadius: 8, border: '1px solid #1e3a5f', objectFit: 'cover' }} />}
            </div>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', gridColumn: '1/-1' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input type="checkbox" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} />
                <span style={{ color: '#94a3b8', fontSize: 13 }}>Featured</span>
              </label>
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as 'draft' | 'published' }))} style={{ ...s.input, width: 160 }}>
                <option value="draft">⚫ Draft</option>
                <option value="published">🟢 Published</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end' }}>
            <button onClick={() => setShowForm(false)} style={{ ...s.btn, background: '#1a2744', color: '#64748b', border: '1px solid #1e3a5f' }}>Cancel</button>
            <button onClick={handleSave} disabled={saving} style={{ ...s.btn, ...s.primaryBtn, opacity: saving ? 0.7 : 1 }}>
              {saving ? '⏳ Saving...' : editingId ? '💾 Save Changes' : '✅ Add Video'}
            </button>
          </div>
        </div>
      )}

      {showPicker && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ background: '#0f1729', border: '1px solid #1e3a5f', borderRadius: 16, padding: 28, width: '90%', maxWidth: 600, maxHeight: '80vh', overflow: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <h3 style={{ color: '#f1f5f9', margin: 0 }}>Pick Thumbnail</h3>
              <button onClick={() => setShowPicker(false)} style={{ ...s.btn, background: '#1a2744', color: '#64748b', border: '1px solid #1e3a5f' }}>✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))', gap: 10 }}>
              {media.map(asset => (
                <div key={asset.id} onClick={() => { setForm(f => ({ ...f, image_src: asset.file_url })); setShowPicker(false) }}
                  style={{ cursor: 'pointer', borderRadius: 8, overflow: 'hidden', border: '2px solid #1e3a5f' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = '#3b82f6')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = '#1e3a5f')}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={asset.file_url} alt={asset.file_name} style={{ width: '100%', height: 100, objectFit: 'cover' }} />
                  <div style={{ padding: '6px 8px', background: '#1a2744', color: '#94a3b8', fontSize: 10, wordBreak: 'break-all' }}>{asset.file_name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ background: '#0f1729', border: '1px solid #1e3a5f', borderRadius: 16, padding: 32, maxWidth: 400, width: '90%' }}>
            <h3 style={{ color: '#f1f5f9', margin: '0 0 12px' }}>Delete Video?</h3>
            <p style={{ color: '#64748b', fontSize: 14, marginBottom: 24 }}>Delete <strong style={{ color: '#e2e8f0' }}>{confirmDelete.title}</strong>? Cannot be undone.</p>
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
