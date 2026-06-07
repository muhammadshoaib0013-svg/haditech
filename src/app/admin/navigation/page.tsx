'use client'
import { useState, useEffect } from 'react'
import { apiGet, apiPut, apiPost, apiDelete } from '@/lib/admin-api'

type NavItem = { id: string; label: string; href: string; sort_order: number; is_active: boolean }

const INPUT: React.CSSProperties = { background: '#0a0f1e', border: '1px solid #1e3a5f', borderRadius: 8, padding: '8px 12px', color: '#e2e8f0', fontSize: 13, width: '100%', boxSizing: 'border-box' }
const BTN = (color: string): React.CSSProperties => ({ background: color, border: 'none', borderRadius: 8, padding: '7px 14px', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 12 })

const EMPTY: Omit<NavItem, 'id'> = { label: '', href: '/', sort_order: 99, is_active: true }

export default function AdminNavigationPage() {
  const [items, setItems] = useState<NavItem[]>([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [newItem, setNewItem] = useState({ ...EMPTY })
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)
  const [savingId, setSavingId] = useState<string | null>(null)

  function showToast(msg: string, ok: boolean) {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3000)
  }

  async function loadData() {
    setLoading(true)
    const d = await apiGet('/api/admin/navigation')
    setItems(Array.isArray(d) ? d : [])
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  async function saveItem(item: NavItem) {
    setSavingId(item.id)
    try {
      await apiPut('/api/admin/navigation', item)
      await loadData()
      showToast('✅ Nav item saved!', true)
    } catch {
      showToast('❌ Save failed', false)
    } finally {
      setSavingId(null)
    }
  }

  async function deleteItem(id: string) {
    if (!confirm('Delete this nav item?')) return
    try {
      await apiDelete(`/api/admin/navigation?id=${id}`)
      await loadData()
      showToast('🗑️ Deleted', true)
    } catch {
      showToast('❌ Delete failed', false)
    }
  }

  async function addItem() {
    if (!newItem.label || !newItem.href) return showToast('Label and href are required', false)
    try {
      await apiPost('/api/admin/navigation', newItem)
      await loadData()
      setNewItem({ ...EMPTY })
      setAdding(false)
      showToast('✅ Nav item added!', true)
    } catch {
      showToast('❌ Add failed — ensure Supabase tables are created.', false)
    }
  }

  function updateLocal(id: string, key: keyof NavItem, value: string | number | boolean) {
    setItems(prev => prev.map(i => i.id === id ? { ...i, [key]: value } : i))
  }

  if (loading && items.length === 0) return (
    <div style={{ padding: 40, color: '#64748b', textAlign: 'center' }}>
      <div style={{ fontSize: 32, marginBottom: 12 }}>🧭</div>Loading Navigation CMS…
    </div>
  )

  return (
    <div style={{ padding: '32px 36px', maxWidth: 800, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <h1 style={{ color: '#f1f5f9', fontSize: 26, fontWeight: 800, margin: 0 }}>🧭 Navigation CMS</h1>
          <p style={{ color: '#64748b', marginTop: 6, fontSize: 14 }}>Manage header menu links — label, href, order, and visibility.</p>
        </div>
        <button onClick={() => setAdding(a => !a)} style={BTN('#3b82f6')}>
          {adding ? '✕ Cancel' : '+ Add Item'}
        </button>
      </div>

      {toast && (
        <div style={{ background: toast.ok ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', border: `1px solid ${toast.ok ? '#10b981' : '#ef4444'}`, borderRadius: 10, padding: '11px 16px', marginBottom: 20, color: toast.ok ? '#10b981' : '#ef4444', fontSize: 13, fontWeight: 600 }}>
          {toast.msg}
        </div>
      )}

      {/* Add Form */}
      {adding && (
        <div style={{ background: '#0f1729', border: '1px solid #3b82f6', borderRadius: 14, padding: 20, marginBottom: 20 }}>
          <h3 style={{ color: '#3b82f6', margin: '0 0 16px', fontSize: 14, fontWeight: 700 }}>➕ New Nav Item</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 80px', gap: 12, marginBottom: 12 }}>
            <div>
              <label style={{ color: '#64748b', fontSize: 11, display: 'block', marginBottom: 4 }}>LABEL</label>
              <input style={INPUT} placeholder="Services" value={newItem.label} onChange={e => setNewItem(p => ({ ...p, label: e.target.value }))} />
            </div>
            <div>
              <label style={{ color: '#64748b', fontSize: 11, display: 'block', marginBottom: 4 }}>HREF</label>
              <input style={INPUT} placeholder="/services" value={newItem.href} onChange={e => setNewItem(p => ({ ...p, href: e.target.value }))} />
            </div>
            <div>
              <label style={{ color: '#64748b', fontSize: 11, display: 'block', marginBottom: 4 }}>ORDER</label>
              <input style={INPUT} type="number" value={newItem.sort_order} onChange={e => setNewItem(p => ({ ...p, sort_order: Number(e.target.value) }))} />
            </div>
          </div>
          <button onClick={addItem} style={BTN('linear-gradient(135deg,#3b82f6,#6366f1)')}>✅ Add</button>
        </div>
      )}

      {/* Items List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {items.length === 0 && !loading && (
          <div style={{ background: '#0f1729', border: '1px solid #1e3a5f', borderRadius: 14, padding: 32, textAlign: 'center', color: '#334155' }}>
            No nav items found. Run supabase/seed_content.sql to seed defaults, or add items above.
          </div>
        )}
        {items.sort((a, b) => a.sort_order - b.sort_order).map(item => (
          <div key={item.id} style={{ background: '#0f1729', border: '1px solid #1e3a5f', borderRadius: 14, padding: 18, display: 'grid', gridTemplateColumns: '1fr 1fr 60px 80px auto auto', gap: 12, alignItems: 'center' }}>
            <div>
              <label style={{ color: '#334155', fontSize: 10, display: 'block', marginBottom: 4 }}>LABEL</label>
              <input style={INPUT} value={item.label} onChange={e => updateLocal(item.id, 'label', e.target.value)} />
            </div>
            <div>
              <label style={{ color: '#334155', fontSize: 10, display: 'block', marginBottom: 4 }}>HREF</label>
              <input style={INPUT} value={item.href} onChange={e => updateLocal(item.id, 'href', e.target.value)} />
            </div>
            <div>
              <label style={{ color: '#334155', fontSize: 10, display: 'block', marginBottom: 4 }}>ORDER</label>
              <input style={INPUT} type="number" value={item.sort_order} onChange={e => updateLocal(item.id, 'sort_order', Number(e.target.value))} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <label style={{ color: '#334155', fontSize: 10, display: 'block', marginBottom: 6 }}>VISIBLE</label>
              <button
                onClick={() => updateLocal(item.id, 'is_active', !item.is_active)}
                style={{ background: item.is_active ? 'rgba(16,185,129,0.15)' : 'rgba(100,116,139,0.15)', border: `1px solid ${item.is_active ? '#10b981' : '#334155'}`, borderRadius: 6, color: item.is_active ? '#10b981' : '#64748b', padding: '4px 10px', cursor: 'pointer', fontSize: 11, fontWeight: 700 }}
              >
                {item.is_active ? 'ON' : 'OFF'}
              </button>
            </div>
            <button onClick={() => saveItem(item)} disabled={savingId === item.id} style={BTN('#10b981')}>
              {savingId === item.id ? '…' : '💾'}
            </button>
            <button onClick={() => deleteItem(item.id)} style={BTN('#ef4444')}>🗑️</button>
          </div>
        ))}
      </div>

      <p style={{ color: '#334155', fontSize: 12, marginTop: 24 }}>
        💡 Changes apply to the public Navbar after save. Requires Supabase <code>navigation_items</code> table.
      </p>
    </div>
  )
}
