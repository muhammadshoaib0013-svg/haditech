'use client'
import { useState, useEffect, useCallback } from 'react'

interface Testimonial {
  id: string; quote: string; name: string; role: string; company: string;
  avatar_url: string; rating: number; featured: boolean; status: 'draft' | 'published'; created_at: string
}
interface MediaAsset { id: string; file_name: string; file_url: string }

const EMPTY: {
  quote: string; name: string; role: string; company: string;
  avatar_url: string; rating: number; featured: boolean; status: 'draft' | 'published';
} = { quote: '', name: '', role: '', company: '', avatar_url: '', rating: 5, featured: false, status: 'draft' }

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

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([])
  const [media, setMedia] = useState<MediaAsset[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(''); const [success, setSuccess] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<Testimonial | null>(null)
  const [showPicker, setShowPicker] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [supabaseConfigured, setSupabaseConfigured] = useState(true)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      const [tRes, mRes] = await Promise.all([fetch('/api/admin/testimonials'), fetch('/api/admin/media/list')])
      const tJson = await tRes.json(); const mJson = await mRes.json()

      // Detect 503 / missing Supabase config
      if (tRes.status === 503 || mRes.status === 503) {
        setSupabaseConfigured(false)
        setError(tJson.error || mJson.error || 'Supabase is not configured')
        return
      }

      setItems(tJson.data || []); setMedia(mJson.data || [])
      setSupabaseConfigured(true)
    } catch { setError('Failed to load') } finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  function openAdd() {
    if (!supabaseConfigured) return
    setForm(EMPTY); setEditingId(null); setShowForm(true); setError('')
  }
  function openEdit(t: Testimonial) {
    if (!supabaseConfigured) return
    setForm({ quote: t.quote, name: t.name, role: t.role, company: t.company, avatar_url: t.avatar_url, rating: t.rating, featured: t.featured, status: t.status })
    setEditingId(t.id); setShowForm(true)
  }

  async function handleSave() {
    if (!form.quote.trim() || !form.name.trim()) { setError('Quote and Name are required'); return }
    setSaving(true); setError('')
    try {
      const url = editingId ? `/api/admin/testimonials/${editingId}` : '/api/admin/testimonials'
      const res = await fetch(url, { method: editingId ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const json = await res.json()
      if (!res.ok) { setError(json.error || 'Save failed'); return }
      setSuccess(editingId ? '✅ Updated!' : '✅ Added!'); setShowForm(false); fetchAll()
    } catch { setError('Save failed') } finally { setSaving(false) }
  }

  async function toggleStatus(t: Testimonial) {
    if (!supabaseConfigured) return
    try {
      await fetch(`/api/admin/testimonials/${t.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: t.status === 'published' ? 'draft' : 'published' }) })
      fetchAll()
    } catch { setError('Update failed') }
  }

  async function handleDelete(t: Testimonial) {
    if (!supabaseConfigured) return
    setConfirmDelete(null)
    try { await fetch(`/api/admin/testimonials/${t.id}`, { method: 'DELETE' }); setSuccess('🗑️ Deleted'); fetchAll() }
    catch { setError('Delete failed') }
  }

  return (
    <div style={s.page}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ color: '#f1f5f9', fontSize: 24, fontWeight: 800, margin: 0 }}>💬 Testimonials</h1>
          <p style={{ color: '#64748b', fontSize: 14, marginTop: 6 }}>Manage client testimonials shown on the website.</p>
        </div>
        <button
          onClick={openAdd}
          disabled={!supabaseConfigured}
          style={{ ...s.btn, ...s.primaryBtn, opacity: !supabaseConfigured ? 0.45 : 1, cursor: !supabaseConfigured ? 'not-allowed' : 'pointer' }}
        >
          + Add Testimonial
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
                Testimonials cannot be loaded or saved without a Supabase connection. Add{' '}
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
            Supabase is not configured. Testimonial data cannot be loaded.
          </div>
        ) : items.length === 0 && !showForm ? (
          <div style={{ textAlign: 'center', padding: 64, color: '#334155', border: '1px dashed #1e3a5f', borderRadius: 16 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
            <div style={{ fontSize: 15, fontWeight: 600 }}>No testimonials yet</div>
            <button onClick={openAdd} style={{ ...s.btn, ...s.primaryBtn, marginTop: 16 }}>+ Add First Testimonial</button>
          </div>
        ) : !showForm && (
          <div>
            {items.map(t => (
              <div key={t.id} style={s.card}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#1a2744', border: '1px solid #1e3a5f', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                    {t.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={t.avatar_url} alt={t.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : '👤'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: '#f1f5f9', fontWeight: 700 }}>{t.name} <span style={{ color: '#475569', fontWeight: 400, fontSize: 13 }}>— {t.role}{t.company ? `, ${t.company}` : ''}</span></div>
                    <div style={{ color: '#fbbf24', fontSize: 12, marginTop: 2 }}>{'★'.repeat(t.rating)}</div>
                    <div style={{ color: '#94a3b8', fontSize: 13, marginTop: 6, fontStyle: 'italic', lineHeight: 1.5 }}>&ldquo;{t.quote.slice(0, 120)}{t.quote.length > 120 ? '...' : ''}&rdquo;</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: t.status === 'published' ? 'rgba(16,185,129,0.15)' : 'rgba(100,116,139,0.15)', color: t.status === 'published' ? '#10b981' : '#64748b', border: `1px solid ${t.status === 'published' ? 'rgba(16,185,129,0.3)' : 'rgba(100,116,139,0.3)'}` }}>
                      {t.status === 'published' ? '🟢 Published' : '⚫ Draft'}
                    </span>
                    <button onClick={() => toggleStatus(t)} style={{ ...s.btn, padding: '6px 14px', fontSize: 12, ...(t.status === 'published' ? s.dangerBtn : s.successBtn) }}>
                      {t.status === 'published' ? 'Unpublish' : 'Publish'}
                    </button>
                    <button onClick={() => openEdit(t)} style={{ ...s.btn, padding: '6px 14px', fontSize: 12, background: 'rgba(59,130,246,0.15)', color: '#93c5fd', border: '1px solid rgba(59,130,246,0.3)' }}>Edit</button>
                    <button onClick={() => setConfirmDelete(t)} style={{ ...s.btn, ...s.dangerBtn, padding: '6px 14px', fontSize: 12 }}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      {showForm && (
        <div style={{ background: '#0f1729', border: '1px solid #1e3a5f', borderRadius: 16, padding: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
            <h2 style={{ color: '#f1f5f9', fontSize: 18, fontWeight: 700, margin: 0 }}>{editingId ? 'Edit Testimonial' : 'Add Testimonial'}</h2>
            <button onClick={() => setShowForm(false)} style={{ ...s.btn, background: '#1a2744', color: '#64748b', border: '1px solid #1e3a5f' }}>✕ Cancel</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ gridColumn: '1/-1' }}>
              <label style={s.label}>QUOTE *</label>
              <textarea style={{ ...s.input, height: 100, resize: 'vertical' } as React.CSSProperties} value={form.quote} onChange={e => setForm(f => ({ ...f, quote: e.target.value }))} placeholder="Client's testimonial quote..." />
            </div>
            <div>
              <label style={s.label}>CLIENT NAME *</label>
              <input style={s.input} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Sarah Johnson" />
            </div>
            <div>
              <label style={s.label}>ROLE / TITLE</label>
              <input style={s.input} value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} placeholder="CEO" />
            </div>
            <div>
              <label style={s.label}>COMPANY</label>
              <input style={s.input} value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} placeholder="Company Name" />
            </div>
            <div>
              <label style={s.label}>RATING (1–5)</label>
              <select style={s.input} value={form.rating} onChange={e => setForm(f => ({ ...f, rating: Number(e.target.value) }))}>
                {[5,4,3,2,1].map(r => <option key={r} value={r}>{'★'.repeat(r)} ({r})</option>)}
              </select>
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <label style={s.label}>AVATAR IMAGE (optional)</label>
              <div style={{ display: 'flex', gap: 10 }}>
                <input style={{ ...s.input, flex: 1 }} value={form.avatar_url} onChange={e => setForm(f => ({ ...f, avatar_url: e.target.value }))} placeholder="Paste URL or pick from Media Library" />
                <button onClick={() => setShowPicker(true)} style={{ ...s.btn, background: 'rgba(139,92,246,0.15)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.3)', whiteSpace: 'nowrap' }}>🖼️ Pick</button>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', gridColumn: '1/-1' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input type="checkbox" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} />
                <span style={{ color: '#94a3b8', fontSize: 13 }}>Featured on homepage</span>
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
              {saving ? '⏳ Saving...' : editingId ? '💾 Save Changes' : '✅ Add Testimonial'}
            </button>
          </div>
        </div>
      )}

      {showPicker && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ background: '#0f1729', border: '1px solid #1e3a5f', borderRadius: 16, padding: 28, width: '90%', maxWidth: 600, maxHeight: '80vh', overflow: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <h3 style={{ color: '#f1f5f9', margin: 0 }}>Pick Avatar</h3>
              <button onClick={() => setShowPicker(false)} style={{ ...s.btn, background: '#1a2744', color: '#64748b', border: '1px solid #1e3a5f' }}>✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: 10 }}>
              {media.map(asset => (
                <div key={asset.id} onClick={() => { setForm(f => ({ ...f, avatar_url: asset.file_url })); setShowPicker(false) }}
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
            <h3 style={{ color: '#f1f5f9', margin: '0 0 12px' }}>Delete Testimonial?</h3>
            <p style={{ color: '#64748b', fontSize: 14, marginBottom: 24 }}>Delete testimonial from <strong style={{ color: '#e2e8f0' }}>{confirmDelete.name}</strong>?</p>
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
