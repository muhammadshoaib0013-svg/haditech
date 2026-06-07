'use client'
import { useState, useEffect } from 'react'
import { apiGet, apiPut } from '@/lib/admin-api'

const PAGES = [
  { path: '/', label: 'Home' },
  { path: '/services', label: 'Services' },
  { path: '/work', label: 'Work / Projects' },
  { path: '/case-studies', label: 'Case Studies' },
  { path: '/about', label: 'About' },
  { path: '/contact', label: 'Contact' },
  { path: '/videos', label: 'Videos' },
]

type SeoEntry = {
  page_path: string
  title: string
  description: string
  keywords: string
  og_image: string
  canonical_url: string
}

const EMPTY = (path: string): SeoEntry => ({ page_path: path, title: '', description: '', keywords: '', og_image: '', canonical_url: '' })

const LABEL: React.CSSProperties = { color: '#64748b', fontSize: 12, fontWeight: 600, letterSpacing: 1, marginBottom: 6, display: 'block', textTransform: 'uppercase' }
const INPUT: React.CSSProperties = { width: '100%', background: '#0a0f1e', border: '1px solid #1e3a5f', borderRadius: 10, padding: '10px 14px', color: '#e2e8f0', fontSize: 14, boxSizing: 'border-box' }
const TEXTAREA: React.CSSProperties = { ...INPUT, minHeight: 80, resize: 'vertical' }
const BTN = (color: string): React.CSSProperties => ({ background: color, border: 'none', borderRadius: 8, padding: '8px 16px', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 13 })

export default function AdminSeoPage() {
  const [activeTab, setActiveTab] = useState('/')
  const [entries, setEntries] = useState<Record<string, SeoEntry>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)

  function showToast(msg: string, ok: boolean) {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3500)
  }

  async function loadData() {
    try {
      const data = await apiGet<SeoEntry[]>('/api/admin/seo')
      const map: Record<string, SeoEntry> = {}
      if (Array.isArray(data)) {
        data.forEach(d => { map[d.page_path] = d })
      }
      setEntries(map)
    } catch (err: any) {
      showToast(`❌ Loading failed: ${err.message || 'ensure Supabase tables exist.'}`, false)
    }
  }

  useEffect(() => {
    setLoading(true)
    loadData().finally(() => setLoading(false))
  }, [])

  function getCurrent(): SeoEntry {
    return entries[activeTab] ?? EMPTY(activeTab)
  }

  function setField(key: keyof SeoEntry, value: string) {
    setEntries(prev => ({
      ...prev,
      [activeTab]: { ...getCurrent(), [key]: value },
    }))
  }

  async function save() {
    const entry = getCurrent()
    if (!entry.title.trim()) return showToast('Title is required', false)
    setSaving(true)
    try {
      await apiPut('/api/admin/seo', entry)
      showToast(`✅ SEO saved for ${activeTab}!`, true)
      // E2E Contract: loadData after saving to guarantee the round-trip database update
      await loadData()
    } catch (err: any) {
      showToast(`❌ Save failed: ${err.message || 'ensure Supabase tables exist.'}`, false)
    } finally {
      setSaving(false)
    }
  }

  const current = getCurrent()
  const titleLen = current.title.length
  const descLen = current.description.length

  if (loading) return (
    <div style={{ padding: 40, color: '#64748b', textAlign: 'center' }}>
      <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>Loading SEO Settings…
    </div>
  )

  return (
    <div style={{ padding: '32px 36px', maxWidth: 900, margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ color: '#f1f5f9', fontSize: 26, fontWeight: 800, margin: 0 }}>🔍 SEO Settings</h1>
        <p style={{ color: '#64748b', marginTop: 6, fontSize: 14 }}>Manage title tags, meta descriptions, and Open Graph images per page.</p>
      </div>

      {toast && (
        <div style={{ background: toast.ok ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', border: `1px solid ${toast.ok ? '#10b981' : '#ef4444'}`, borderRadius: 10, padding: '12px 18px', marginBottom: 24, color: toast.ok ? '#10b981' : '#ef4444', fontSize: 14, fontWeight: 600 }}>
          {toast.msg}
        </div>
      )}

      {/* Page Tabs */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
        {PAGES.map(p => (
          <button key={p.path} onClick={() => setActiveTab(p.path)} style={{
            padding: '8px 16px', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 600,
            background: activeTab === p.path ? 'rgba(59,130,246,0.15)' : '#0f1729',
            border: `1px solid ${activeTab === p.path ? '#3b82f6' : '#1e3a5f'}`,
            color: activeTab === p.path ? '#3b82f6' : '#64748b',
          }}>
            {p.label}
            {entries[p.path]?.title && <span style={{ marginLeft: 6, width: 6, height: 6, background: '#10b981', borderRadius: '50%', display: 'inline-block' }} />}
          </button>
        ))}
      </div>

      {/* Form */}
      <div style={{ background: '#0f1729', border: '1px solid #1e3a5f', borderRadius: 16, padding: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
          <span style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid #1e3a5f', borderRadius: 6, color: '#3b82f6', fontSize: 12, padding: '3px 10px', fontFamily: 'monospace' }}>
            {activeTab}
          </span>
          <span style={{ color: '#334155', fontSize: 12 }}>— editing SEO metadata</span>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <label style={LABEL}>Page Title (SEO)</label>
            <span style={{ fontSize: 11, color: titleLen > 60 ? '#ef4444' : titleLen > 50 ? '#fbbf24' : '#10b981' }}>
              {titleLen}/60 chars
            </span>
          </div>
          <input style={INPUT} value={current.title} onChange={e => setField('title', e.target.value)} placeholder="HADITECH | SaaS Development Studio" />
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <label style={LABEL}>Meta Description</label>
            <span style={{ fontSize: 11, color: descLen > 160 ? '#ef4444' : descLen > 140 ? '#fbbf24' : '#10b981' }}>
              {descLen}/160 chars
            </span>
          </div>
          <textarea style={TEXTAREA} value={current.description} onChange={e => setField('description', e.target.value)} placeholder="Brief page description for search engines…" />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={LABEL}>Keywords (comma separated)</label>
          <input style={INPUT} value={current.keywords} onChange={e => setField('keywords', e.target.value)} placeholder="next.js development, saas mvp, web app development" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
          <div>
            <label style={LABEL}>OG Image URL</label>
            <input style={INPUT} value={current.og_image} onChange={e => setField('og_image', e.target.value)} placeholder="https://..." />
          </div>
          <div>
            <label style={LABEL}>Canonical URL (optional)</label>
            <input style={INPUT} value={current.canonical_url} onChange={e => setField('canonical_url', e.target.value)} placeholder={`https://haditech.com${activeTab}`} />
          </div>
        </div>

        {/* Preview */}
        {current.title && (
          <div style={{ background: '#0a0f1e', border: '1px solid #1e3a5f', borderRadius: 10, padding: 16, marginBottom: 20 }}>
            <div style={{ color: '#334155', fontSize: 11, marginBottom: 8, fontWeight: 600 }}>🔍 GOOGLE PREVIEW</div>
            <div style={{ color: '#3b82f6', fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{current.title}</div>
            <div style={{ color: '#10b981', fontSize: 12, marginBottom: 4 }}>haditech.com{activeTab}</div>
            <div style={{ color: '#94a3b8', fontSize: 13 }}>{current.description || 'No description set.'}</div>
          </div>
        )}

        <button onClick={save} disabled={saving} style={BTN('linear-gradient(135deg,#3b82f6,#6366f1)')}>
          {saving ? '⏳ Saving…' : `💾 Save SEO for ${activeTab}`}
        </button>
      </div>

      <p style={{ color: '#334155', fontSize: 12, marginTop: 16 }}>
        💡 Green dots on tabs indicate saved entries. Requires Supabase <code>seo_settings</code> table.
      </p>
    </div>
  )
}
