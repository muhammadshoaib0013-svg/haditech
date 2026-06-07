'use client'
import { useState, useEffect } from 'react'
import { services as staticServices } from '@/lib/data'
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/admin-api'

type Service = {
  id?: string
  title: string
  shortDescription: string
  features: string[]
  iconName: string
  category: string
  pricingHint: string
  deliveryTime: string
  popular: boolean
  tier: string
  sort_order: number
  status: string
}

const ICONS = ['Rocket', 'Layout', 'Server', 'Code', 'Shield', 'Zap', 'Globe', 'Database', 'Cpu', 'BarChart']
const TIERS = ['starter', 'professional', 'enterprise']

const S: React.CSSProperties = { background: '#0f1729', border: '1px solid #1e3a5f', borderRadius: 16, padding: 28, marginBottom: 24 }
const LABEL: React.CSSProperties = { color: '#64748b', fontSize: 12, fontWeight: 600, letterSpacing: 1, marginBottom: 8, display: 'block', textTransform: 'uppercase' }
const INPUT: React.CSSProperties = { width: '100%', background: '#0a0f1e', border: '1px solid #1e3a5f', borderRadius: 10, padding: '10px 14px', color: '#e2e8f0', fontSize: 14, boxSizing: 'border-box' }
const BTN = (color: string, extra?: React.CSSProperties): React.CSSProperties => ({ background: color, border: 'none', borderRadius: 8, padding: '8px 16px', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 13, ...extra })
const PILL = (active: boolean, color = '#8b5cf6'): React.CSSProperties => ({ padding: '5px 12px', borderRadius: 7, cursor: 'pointer', fontSize: 11, fontWeight: 600, background: active ? color : '#1a2744', border: `1.5px solid ${active ? color : '#1e3a5f'}`, color: active ? '#fff' : '#475569' })

const EMPTY: Service = {
  title: '',
  shortDescription: '',
  features: ['', '', '', ''],
  iconName: 'Code',
  category: '',
  pricingHint: '',
  deliveryTime: '',
  popular: false,
  tier: 'starter',
  sort_order: 99,
  status: 'published',
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Service | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)
  const [tableMissing, setTableMissing] = useState(false)

  function showToast(msg: string, ok: boolean) {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 4000)
  }

  function normalise(s: Record<string, unknown>, i: number): Service {
    return {
      id: (s.id as string) ?? `static-${i}`,
      title: String(s.title ?? ''),
      shortDescription: String(s.shortDescription ?? s.short_description ?? ''),
      features: Array.isArray(s.features) ? (s.features as string[]) : ['', '', '', ''],
      iconName: String(s.iconName ?? s.icon ?? 'Code'),
      category: String(s.category ?? ''),
      pricingHint: String(s.pricingHint ?? s.priceRange ?? s.price_range ?? ''),
      deliveryTime: String(s.deliveryTime ?? s.delivery_time ?? ''),
      popular: Boolean(s.popular),
      tier: String(s.tier ?? 'starter'),
      sort_order: Number(s.sort_order ?? s.sortOrder ?? 0),
      status: String(s.status ?? 'published'),
    }
  }

  function loadServices() {
    setLoading(true)
    apiGet<any>('/api/admin/services')
      .then(d => {
        const list = Array.isArray(d) ? d : staticServices
        setServices((list as Record<string, unknown>[]).map(normalise))
        setTableMissing(false)
      })
      .catch((err: any) => {
        if (err.message?.includes('missing') || err.message?.includes('does not exist')) {
          setTableMissing(true)
        }
        setServices((staticServices as Record<string, unknown>[]).map(normalise))
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadServices()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function startEdit(s: Service) {
    setEditing({ ...s, features: [...(s.features.length ? s.features : ['', '', '', ''])] })
    setIsNew(false)
  }
  function startNew() { setEditing({ ...EMPTY, features: ['', '', '', ''] }); setIsNew(true) }
  function cancel() { setEditing(null) }

  function setField(key: keyof Service, val: unknown) {
    setEditing(p => p ? { ...p, [key]: val } : p)
  }
  function setFeature(i: number, val: string) {
    if (!editing) return
    const f = [...editing.features]
    f[i] = val
    setEditing(p => p ? { ...p, features: f } : p)
  }

  async function save() {
    if (!editing || !editing.title.trim()) return showToast('Title is required', false)
    setSaving(true)
    try {
      const payload = {
        ...(isNew ? {} : { id: editing.id }),
        title: editing.title,
        shortDescription: editing.shortDescription,
        category: editing.category,
        pricingHint: editing.pricingHint,
        deliveryTime: editing.deliveryTime,
        iconName: editing.iconName,
        tier: editing.tier,
        features: editing.features.filter(Boolean),
        popular: editing.popular,
        sort_order: editing.sort_order,
        status: editing.status || 'published',
      }

      if (isNew) {
        await apiPost('/api/admin/services', payload)
      } else {
        await apiPut('/api/admin/services', payload)
      }

      setEditing(null)
      showToast(`✅ Service ${isNew ? 'added' : 'updated'} & verified!`, true)

      // Re-fetch services list to verify persistence
      loadServices()
    } catch (e: unknown) {
      showToast(`${String(e)}`, false)
    } finally {
      setSaving(false)
    }
  }

  async function deleteService(id: string) {
    if (!confirm('Delete this service?')) return
    try {
      await apiDelete(`/api/admin/services?id=${id}`)
      showToast('🗑️ Service deleted & verified!', true)
      loadServices()
    } catch (e: unknown) {
      showToast(`❌ ${String(e)}`, false)
    }
  }

  if (tableMissing) {
    return (
      <div style={{ padding: 40, maxWidth: 640, margin: '40px auto', background: '#0a0f1e', border: '2px solid #ef4444', borderRadius: 18, color: '#f87171', fontFamily: 'system-ui, sans-serif' }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 12px', color: '#f87171' }}>⚠️ Database Setup Required</h2>
        <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
          portfolio_services table is missing in the connected Supabase project. Run cms_rescue.sql from Settings.
        </p>
        <div style={{ display: 'flex', gap: 12 }}>
          <a href="/admin/settings" style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontWeight: 700, cursor: 'pointer', fontSize: 13, textDecoration: 'none', display: 'inline-block' }}>
            Go to Settings &rarr;
          </a>
          <button onClick={() => { setTableMissing(false); loadServices(); }} style={{ background: '#1e293b', color: '#94a3b8', border: 'none', borderRadius: 8, padding: '10px 20px', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>
            Retry Connection
          </button>
        </div>
      </div>
    )
  }

  if (loading) return (
    <div style={{ padding: 40, color: '#64748b', textAlign: 'center' }}>
      <div style={{ fontSize: 32, marginBottom: 12 }}>💼</div>Loading Services CMS…
    </div>
  )

  return (
    <div style={{ padding: '32px 36px', maxWidth: 960, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <h1 style={{ color: '#f1f5f9', fontSize: 26, fontWeight: 800, margin: 0 }}>💼 Services CMS</h1>
          <p style={{ color: '#64748b', marginTop: 6, fontSize: 14 }}>
            Manage pricing cards shown on the public Services page. Requires{' '}
            <code style={{ color: '#3b82f6' }}>portfolio_services</code> table in Supabase.
          </p>
        </div>
        <button onClick={startNew} style={BTN('linear-gradient(135deg,#3b82f6,#6366f1)')}>+ Add Service</button>
      </div>

      {toast && (
        <div style={{
          background: toast.ok ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
          border: `1px solid ${toast.ok ? '#10b981' : '#ef4444'}`,
          borderRadius: 10, padding: '12px 18px', marginBottom: 24,
          color: toast.ok ? '#10b981' : '#ef4444', fontSize: 14, fontWeight: 600,
        }}>
          {toast.msg}
        </div>
      )}

      {/* Edit / Add Form */}
      {editing && (
        <div style={{ background: '#0b1120', border: '1px solid #3b82f6', borderRadius: 18, padding: 28, marginBottom: 28 }}>
          <h2 style={{ color: '#3b82f6', fontSize: 16, fontWeight: 700, marginBottom: 24, marginTop: 0 }}>
            {isNew ? '➕ New Service' : `✏️ Editing: ${editing.title}`}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <label style={LABEL}>Title *</label>
              <input style={INPUT} value={editing.title} onChange={e => setField('title', e.target.value)} placeholder="WordPress Website" />
            </div>
            <div>
              <label style={LABEL}>Category</label>
              <input style={INPUT} value={editing.category} onChange={e => setField('category', e.target.value)} placeholder="FRONTEND / SaaS / AI" />
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={LABEL}>Short Description</label>
            <input style={INPUT} value={editing.shortDescription} onChange={e => setField('shortDescription', e.target.value)} placeholder="One-line summary of this service" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <label style={LABEL}>Price Range</label>
              <input style={INPUT} value={editing.pricingHint} onChange={e => setField('pricingHint', e.target.value)} placeholder="5K-10K" />
            </div>
            <div>
              <label style={LABEL}>Delivery Time</label>
              <input style={INPUT} value={editing.deliveryTime} onChange={e => setField('deliveryTime', e.target.value)} placeholder="4-6 Weeks" />
            </div>
            <div>
              <label style={LABEL}>Sort Order</label>
              <input style={INPUT} type="number" value={editing.sort_order} onChange={e => setField('sort_order', Number(e.target.value))} />
            </div>
          </div>

          {/* Features */}
          <div style={S}>
            <label style={LABEL}>Features (up to 4)</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {editing.features.map((f, i) => (
                <input key={i} style={INPUT} value={f} onChange={e => setFeature(i, e.target.value)} placeholder={`Feature ${i + 1}`} />
              ))}
            </div>
          </div>

          {/* Tier & Icon */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
            <div>
              <label style={LABEL}>Tier</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {TIERS.map(t => (
                  <button key={t} onClick={() => setField('tier', t)} style={PILL(editing.tier === t)}>{t}</button>
                ))}
              </div>
            </div>
            <div>
              <label style={LABEL}>Icon</label>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {ICONS.map(ic => (
                  <button key={ic} onClick={() => setField('iconName', ic)} style={PILL(editing.iconName === ic, '#3b82f6')}>{ic}</button>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
            <button
              onClick={() => setField('popular', !editing.popular)}
              style={{
                background: editing.popular ? 'rgba(251,191,36,0.15)' : 'rgba(100,116,139,0.1)',
                border: `1px solid ${editing.popular ? '#fbbf24' : '#334155'}`,
                borderRadius: 8, color: editing.popular ? '#fbbf24' : '#64748b',
                padding: '8px 16px', cursor: 'pointer', fontWeight: 700, fontSize: 13,
              }}
            >
              {editing.popular ? '⭐ Popular Badge ON' : '☆ Popular Badge OFF'}
            </button>
            <div>
              <label style={{ ...LABEL, marginBottom: 0, marginRight: 8 }}>Status</label>
              <select
                value={editing.status}
                onChange={e => setField('status', e.target.value)}
                style={{ ...INPUT, width: 'auto', padding: '6px 10px' }}
              >
                <option value="published">published</option>
                <option value="draft">draft</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button onClick={save} disabled={saving} style={BTN('linear-gradient(135deg,#3b82f6,#6366f1)', { padding: '11px 28px', fontSize: 14 })}>
              {saving ? '⏳ Saving…' : '💾 Save Service'}
            </button>
            <button onClick={cancel} style={BTN('#334155')}>Cancel</button>
          </div>
        </div>
      )}

      {/* Services List */}
      {services.length === 0 ? (
        <div style={{ ...S, textAlign: 'center', color: '#64748b' }}>
          No services yet. Click <strong style={{ color: '#3b82f6' }}>+ Add Service</strong> to create your first one.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {services.map(s => (
            <div key={s.id} style={{ background: '#0f1729', border: '1px solid #1e3a5f', borderRadius: 14, padding: '18px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <span style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 15 }}>{s.title}</span>
                  {s.popular && <span style={{ background: 'rgba(251,191,36,0.15)', border: '1px solid #fbbf24', borderRadius: 6, color: '#fbbf24', fontSize: 10, padding: '2px 8px', fontWeight: 700 }}>⭐ POPULAR</span>}
                  <span style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid #1e3a5f', borderRadius: 6, color: '#3b82f6', fontSize: 10, padding: '2px 8px' }}>{s.tier}</span>
                  <span style={{ background: s.status === 'published' ? 'rgba(16,185,129,0.1)' : 'rgba(100,116,139,0.1)', border: `1px solid ${s.status === 'published' ? '#10b981' : '#475569'}`, borderRadius: 6, color: s.status === 'published' ? '#10b981' : '#64748b', fontSize: 10, padding: '2px 8px' }}>{s.status}</span>
                </div>
                <div style={{ color: '#64748b', fontSize: 13 }}>{s.shortDescription}</div>
                <div style={{ color: '#334155', fontSize: 12, marginTop: 4 }}>{s.pricingHint && `${s.pricingHint} · `}{s.deliveryTime && `${s.deliveryTime} · `}{s.category}</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => startEdit(s)} style={BTN('#1e3a5f')}>✏️ Edit</button>
                <button onClick={() => deleteService(s.id!)} style={BTN('#7f1d1d')}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <p style={{ color: '#334155', fontSize: 12, marginTop: 24 }}>
        💡 View the live <a href="/services" target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6' }}>Services page</a>.{' '}
        If table is missing → <a href="/admin/settings" style={{ color: '#f59e0b' }}>run schema in Settings</a>.
      </p>
    </div>
  )
}
