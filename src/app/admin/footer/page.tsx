'use client'
import { useState, useEffect, useCallback } from 'react'
import { apiGet, apiPut, apiPost, apiDelete } from '@/lib/admin-api'

type FooterSection = {
  id: string
  title: string
  content: string
  links: { label: string; href: string }[]
  sort_order: number
  is_active: boolean
}

const SECTION_STYLE: React.CSSProperties = { background: '#0f1729', border: '1px solid #1e3a5f', borderRadius: 16, padding: 24, marginBottom: 16 }
const LABEL: React.CSSProperties = { color: '#64748b', fontSize: 12, fontWeight: 600, letterSpacing: 1, marginBottom: 6, display: 'block', textTransform: 'uppercase' }
const INPUT: React.CSSProperties = { width: '100%', background: '#0a0f1e', border: '1px solid #1e3a5f', borderRadius: 8, padding: '9px 12px', color: '#e2e8f0', fontSize: 13, boxSizing: 'border-box' }
const BTN = (color: string): React.CSSProperties => ({ background: color, border: 'none', borderRadius: 8, padding: '7px 14px', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 12 })

export default function AdminFooterPage() {
  const [sections, setSections] = useState<FooterSection[]>([])
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)
  const [adding, setAdding] = useState(false)
  const [newSection, setNewSection] = useState({ title: '', content: '', sort_order: 99, is_active: true })

  function showToast(msg: string, ok: boolean) {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3500)
  }

  const loadSections = useCallback(async () => {
    try {
      const body = await apiGet<FooterSection[]>('/api/admin/footer')
      const list: FooterSection[] = Array.isArray(body) ? body : []
      setSections(list.map(s => ({ ...s, links: Array.isArray(s.links) ? s.links : [] })))
    } catch {
      setSections([])
    }
  }, [])

  useEffect(() => {
    setLoading(true)
    loadSections().finally(() => setLoading(false))
  }, [loadSections])

  function updateSection(id: string, key: keyof FooterSection, value: unknown) {
    setSections(prev => prev.map(s => s.id === id ? { ...s, [key]: value } : s))
  }

  function updateLink(sectionId: string, linkIdx: number, key: 'label' | 'href', value: string) {
    setSections(prev => prev.map(s => {
      if (s.id !== sectionId) return s
      const links = [...s.links]
      links[linkIdx] = { ...links[linkIdx], [key]: value }
      return { ...s, links }
    }))
  }

  function addLink(sectionId: string) {
    setSections(prev => prev.map(s =>
      s.id === sectionId ? { ...s, links: [...s.links, { label: '', href: '/' }] } : s
    ))
  }

  function removeLink(sectionId: string, linkIdx: number) {
    setSections(prev => prev.map(s =>
      s.id === sectionId ? { ...s, links: s.links.filter((_, i) => i !== linkIdx) } : s
    ))
  }

  async function saveSection(section: FooterSection) {
    setSavingId(section.id)
    try {
      await apiPut('/api/admin/footer', section)
      showToast('✅ Footer section saved!', true)
      await loadSections() // re-fetch from DB to confirm persistence
    } catch (e: any) {
      showToast(`❌ ${e.message || 'Save failed — ensure Supabase tables are created.'}`, false)
    } finally {
      setSavingId(null)
    }
  }

  async function deleteSection(id: string) {
    if (!confirm('Delete this footer section?')) return
    try {
      await apiDelete(`/api/admin/footer?id=${id}`)
      showToast('🗑️ Deleted', true)
      await loadSections() // re-fetch from DB
    } catch (e: any) {
      showToast(`❌ ${e.message || 'Delete failed'}`, false)
    }
  }

  async function addNewSection() {
    if (!newSection.title.trim()) return showToast('Title required', false)
    try {
      await apiPost('/api/admin/footer', { ...newSection, links: [] })
      setNewSection({ title: '', content: '', sort_order: 99, is_active: true })
      setAdding(false)
      showToast('✅ Section added!', true)
      await loadSections() // re-fetch from DB
    } catch (e: any) {
      showToast(`❌ ${e.message || 'Add failed — ensure Supabase tables are created.'}`, false)
    }
  }

  if (loading && sections.length === 0) return (
    <div style={{ padding: 40, color: '#64748b', textAlign: 'center' }}>
      <div style={{ fontSize: 32, marginBottom: 12 }}>🦶</div>Loading Footer CMS…
    </div>
  )

  return (
    <div style={{ padding: '32px 36px', maxWidth: 900, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <h1 style={{ color: '#f1f5f9', fontSize: 26, fontWeight: 800, margin: 0 }}>🦶 Footer CMS</h1>
          <p style={{ color: '#64748b', marginTop: 6, fontSize: 14 }}>Manage footer column blocks and their link lists.</p>
        </div>
        <button onClick={() => setAdding(a => !a)} style={BTN('#3b82f6')}>{adding ? '✕ Cancel' : '+ Add Section'}</button>
      </div>

      {toast && (
        <div style={{ background: toast.ok ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', border: `1px solid ${toast.ok ? '#10b981' : '#ef4444'}`, borderRadius: 10, padding: '11px 16px', marginBottom: 20, color: toast.ok ? '#10b981' : '#ef4444', fontSize: 13, fontWeight: 600 }}>
          {toast.msg}
        </div>
      )}

      {/* Add new */}
      {adding && (
        <div style={{ background: '#0b1120', border: '1px solid #3b82f6', borderRadius: 14, padding: 20, marginBottom: 20 }}>
          <h3 style={{ color: '#3b82f6', margin: '0 0 16px', fontSize: 14, fontWeight: 700 }}>➕ New Footer Section</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 80px', gap: 12, marginBottom: 12 }}>
            <div>
              <label style={LABEL}>Column Title</label>
              <input style={INPUT} placeholder="Services" value={newSection.title} onChange={e => setNewSection(p => ({ ...p, title: e.target.value }))} />
            </div>
            <div>
              <label style={LABEL}>Description (optional)</label>
              <input style={INPUT} placeholder="Brief column desc" value={newSection.content} onChange={e => setNewSection(p => ({ ...p, content: e.target.value }))} />
            </div>
            <div>
              <label style={LABEL}>Order</label>
              <input style={INPUT} type="number" value={newSection.sort_order} onChange={e => setNewSection(p => ({ ...p, sort_order: Number(e.target.value) }))} />
            </div>
          </div>
          <button onClick={addNewSection} style={BTN('linear-gradient(135deg,#3b82f6,#6366f1)')}>✅ Add Section</button>
        </div>
      )}

      {/* Sections */}
      {sections.length === 0 && !loading && (
        <div style={{ background: '#0f1729', border: '1px solid #1e3a5f', borderRadius: 14, padding: 32, textAlign: 'center', color: '#334155' }}>
          No footer sections found. Run supabase/seed_content.sql or add a section above.
        </div>
      )}
      {sections.sort((a, b) => a.sort_order - b.sort_order).map(section => (
        <div key={section.id} style={SECTION_STYLE}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <input style={{ ...INPUT, width: 200, marginRight: 12 }} value={section.title} onChange={e => updateSection(section.id, 'title', e.target.value)} placeholder="Column title" />
              <button
                onClick={() => updateSection(section.id, 'is_active', !section.is_active)}
                style={{ background: section.is_active ? 'rgba(16,185,129,0.15)' : 'rgba(100,116,139,0.1)', border: `1px solid ${section.is_active ? '#10b981' : '#334155'}`, borderRadius: 6, color: section.is_active ? '#10b981' : '#64748b', padding: '4px 10px', cursor: 'pointer', fontSize: 11, fontWeight: 700 }}
              >
                {section.is_active ? 'VISIBLE' : 'HIDDEN'}
              </button>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => saveSection(section)} disabled={savingId === section.id} style={BTN('#10b981')}>
                {savingId === section.id ? '⏳ Saving…' : '💾 Save'}
              </button>
              <button onClick={() => deleteSection(section.id)} style={BTN('#ef4444')}>🗑️</button>
            </div>
          </div>

          {section.content !== undefined && (
            <div style={{ marginBottom: 14 }}>
              <label style={LABEL}>Column Description</label>
              <input style={INPUT} value={section.content} onChange={e => updateSection(section.id, 'content', e.target.value)} placeholder="Brief column description..." />
            </div>
          )}

          {/* Links */}
          <label style={LABEL}>Footer Links</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 10 }}>
            {section.links.map((link, li) => (
              <div key={li} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 8, alignItems: 'center' }}>
                <input style={INPUT} value={link.label} onChange={e => updateLink(section.id, li, 'label', e.target.value)} placeholder="Link label" />
                <input style={INPUT} value={link.href} onChange={e => updateLink(section.id, li, 'href', e.target.value)} placeholder="/path or https://..." />
                <button onClick={() => removeLink(section.id, li)} style={BTN('#7f1d1d')}>✕</button>
              </div>
            ))}
          </div>
          <button onClick={() => addLink(section.id)} style={{ ...BTN('#1e3a5f'), fontSize: 12, padding: '6px 12px' }}>
            + Add Link
          </button>
        </div>
      ))}

      <p style={{ color: '#334155', fontSize: 12, marginTop: 24 }}>
        💡 Footer layout reflects on all public pages. Requires Supabase <code>footer_sections</code> table.
      </p>
    </div>
  )
}
