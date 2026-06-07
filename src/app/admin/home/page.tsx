'use client'
import { useState, useEffect } from 'react'
import { heroContent, stats, siteConfig } from '@/lib/data'
import { apiGet, apiPut } from '@/lib/admin-api'

type Stat = { label: string; value: string; suffix: string }

type HomeData = {
  headline: string
  subheadline: string
  primaryCTA: string
  secondaryCTA: string
  whatsappCTA: string
  stats: Stat[]
  availability_open: boolean
  availability_message: string
}

const SECTION_STYLE: React.CSSProperties = {
  background: '#0f1729', border: '1px solid #1e3a5f', borderRadius: 16,
  padding: 28, marginBottom: 24,
}
const LABEL_STYLE: React.CSSProperties = { color: '#64748b', fontSize: 12, fontWeight: 600, letterSpacing: 1, marginBottom: 8, display: 'block', textTransform: 'uppercase' }
const INPUT_STYLE: React.CSSProperties = { width: '100%', background: '#0a0f1e', border: '1px solid #1e3a5f', borderRadius: 10, padding: '10px 14px', color: '#e2e8f0', fontSize: 14, boxSizing: 'border-box' }
const TEXTAREA_STYLE: React.CSSProperties = { ...INPUT_STYLE, minHeight: 90, resize: 'vertical' }
const SAVE_BTN: React.CSSProperties = { background: 'linear-gradient(135deg,#3b82f6,#6366f1)', color: '#fff', border: 'none', borderRadius: 10, padding: '11px 28px', fontWeight: 700, fontSize: 14, cursor: 'pointer', marginTop: 8 }

export default function AdminHomePage() {
  const [data, setData] = useState<HomeData>({
    headline: heroContent.headline,
    subheadline: heroContent.subheadline,
    primaryCTA: heroContent.primaryCTA,
    secondaryCTA: heroContent.secondaryCTA,
    whatsappCTA: heroContent.whatsappCTA,
    stats: stats.map(s => ({ ...s })),
    availability_open: siteConfig.availability.open,
    availability_message: siteConfig.availability.message,
  })
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchHomeData = () => {
    Promise.all([
      apiGet<any>('/api/admin/page-content?page=home'),
      apiGet<any>('/api/admin/site-settings'),
    ]).then(([sections, settings]) => {
      const hero = Array.isArray(sections) ? sections.find((s: { section_key: string }) => s.section_key === 'hero') : null
      const statsSection = Array.isArray(sections) ? sections.find((s: { section_key: string }) => s.section_key === 'stats') : null
      setData(prev => ({
        ...prev,
        headline: hero?.title ?? prev.headline,
        subheadline: hero?.subtitle ?? prev.subheadline,
        primaryCTA: hero?.button_label ?? prev.primaryCTA,
        secondaryCTA: hero?.extra_json?.secondaryCTA ?? prev.secondaryCTA,
        whatsappCTA: hero?.extra_json?.whatsappCTA ?? prev.whatsappCTA,
        stats: statsSection?.extra_json?.stats ?? prev.stats,
        availability_open: settings?.availability_open ?? prev.availability_open,
        availability_message: settings?.availability_message ?? prev.availability_message,
      }))
    }).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchHomeData()
  }, [])

  async function save() {
    setSaving(true)
    setToast(null)
    try {
      await Promise.all([
        apiPut('/api/admin/page-content', {
          page_key: 'home', section_key: 'hero',
          title: data.headline, subtitle: data.subheadline,
          button_label: data.primaryCTA,
          extra_json: { secondaryCTA: data.secondaryCTA, whatsappCTA: data.whatsappCTA },
        }),
        apiPut('/api/admin/page-content', {
          page_key: 'home', section_key: 'stats',
          extra_json: { stats: data.stats },
        }),
        apiPut('/api/admin/site-settings', { availability_open: data.availability_open, availability_message: data.availability_message }),
      ])

      // Immediately re-fetch from database to verify persistence
      const [sections, settings] = await Promise.all([
        apiGet<any>('/api/admin/page-content?page=home'),
        apiGet<any>('/api/admin/site-settings'),
      ])

      const hero = Array.isArray(sections) ? sections.find((s: { section_key: string }) => s.section_key === 'hero') : null
      const statsSection = Array.isArray(sections) ? sections.find((s: { section_key: string }) => s.section_key === 'stats') : null
      
      setData(prev => ({
        ...prev,
        headline: hero?.title ?? prev.headline,
        subheadline: hero?.subtitle ?? prev.subheadline,
        primaryCTA: hero?.button_label ?? prev.primaryCTA,
        secondaryCTA: hero?.extra_json?.secondaryCTA ?? prev.secondaryCTA,
        whatsappCTA: hero?.extra_json?.whatsappCTA ?? prev.whatsappCTA,
        stats: statsSection?.extra_json?.stats ?? prev.stats,
        availability_open: settings?.availability_open ?? prev.availability_open,
        availability_message: settings?.availability_message ?? prev.availability_message,
      }))

      setToast({ msg: '✅ Home content saved & verified!', ok: true })
    } catch (err: any) {
      setToast({ msg: `❌ Save failed — ${err?.message || 'check Supabase connection.'}`, ok: false })
    } finally {
      setSaving(false)
      setTimeout(() => setToast(null), 5000)
    }
  }

  function setStat(i: number, key: keyof Stat, value: string) {
    setData(prev => {
      const newStats = [...prev.stats]
      newStats[i] = { ...newStats[i], [key]: value }
      return { ...prev, stats: newStats }
    })
  }

  if (loading) return (
    <div style={{ padding: 40, color: '#64748b', textAlign: 'center' }}>
      <div style={{ fontSize: 32, marginBottom: 12 }}>🏠</div>
      Loading Home CMS…
    </div>
  )

  return (
    <div style={{ padding: '32px 36px', maxWidth: 860, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ color: '#f1f5f9', fontSize: 26, fontWeight: 800, margin: 0 }}>🏠 Home Page CMS</h1>
        <p style={{ color: '#64748b', marginTop: 6, fontSize: 14 }}>Edit hero content, stats, and availability badge shown on the public homepage.</p>
      </div>

      {toast && (
        <div style={{ background: toast.ok ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', border: `1px solid ${toast.ok ? '#10b981' : '#ef4444'}`, borderRadius: 10, padding: '12px 18px', marginBottom: 24, color: toast.ok ? '#10b981' : '#ef4444', fontSize: 14, fontWeight: 600 }}>
          {toast.msg}
        </div>
      )}

      {/* Hero Section */}
      <div style={SECTION_STYLE}>
        <h2 style={{ color: '#3b82f6', fontSize: 15, fontWeight: 700, marginBottom: 20, marginTop: 0 }}>⚡ Hero Section</h2>
        <div style={{ marginBottom: 18 }}>
          <label style={LABEL_STYLE}>Main Headline</label>
          <input style={INPUT_STYLE} value={data.headline} onChange={e => setData(p => ({ ...p, headline: e.target.value }))} />
        </div>
        <div style={{ marginBottom: 18 }}>
          <label style={LABEL_STYLE}>Subheadline / Description</label>
          <textarea style={TEXTAREA_STYLE} value={data.subheadline} onChange={e => setData(p => ({ ...p, subheadline: e.target.value }))} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          <div>
            <label style={LABEL_STYLE}>Primary CTA Button</label>
            <input style={INPUT_STYLE} value={data.primaryCTA} onChange={e => setData(p => ({ ...p, primaryCTA: e.target.value }))} />
          </div>
          <div>
            <label style={LABEL_STYLE}>Secondary CTA Button</label>
            <input style={INPUT_STYLE} value={data.secondaryCTA} onChange={e => setData(p => ({ ...p, secondaryCTA: e.target.value }))} />
          </div>
          <div>
            <label style={LABEL_STYLE}>WhatsApp CTA Button</label>
            <input style={INPUT_STYLE} value={data.whatsappCTA} onChange={e => setData(p => ({ ...p, whatsappCTA: e.target.value }))} />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={SECTION_STYLE}>
        <h2 style={{ color: '#3b82f6', fontSize: 15, fontWeight: 700, marginBottom: 20, marginTop: 0 }}>📊 Stats / Metrics</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {data.stats.map((s, i) => (
            <div key={i} style={{ background: '#0a0f1e', border: '1px solid #1e3a5f', borderRadius: 12, padding: 16 }}>
              <label style={LABEL_STYLE}>Stat #{i + 1}</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px', gap: 8 }}>
                <div>
                  <label style={{ ...LABEL_STYLE, marginBottom: 4 }}>Label</label>
                  <input style={INPUT_STYLE} value={s.label} onChange={e => setStat(i, 'label', e.target.value)} />
                </div>
                <div>
                  <label style={{ ...LABEL_STYLE, marginBottom: 4 }}>Value</label>
                  <input style={INPUT_STYLE} value={s.value} onChange={e => setStat(i, 'value', e.target.value)} />
                </div>
                <div>
                  <label style={{ ...LABEL_STYLE, marginBottom: 4 }}>Suffix</label>
                  <input style={INPUT_STYLE} value={s.suffix} onChange={e => setStat(i, 'suffix', e.target.value)} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div style={SECTION_STYLE}>
        <h2 style={{ color: '#3b82f6', fontSize: 15, fontWeight: 700, marginBottom: 20, marginTop: 0 }}>🟢 Availability Badge</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
          <label style={{ color: '#e2e8f0', fontSize: 14, fontWeight: 600 }}>Status:</label>
          <button
            onClick={() => setData(p => ({ ...p, availability_open: !p.availability_open }))}
            style={{
              background: data.availability_open ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
              border: `1px solid ${data.availability_open ? '#10b981' : '#ef4444'}`,
              color: data.availability_open ? '#10b981' : '#ef4444',
              borderRadius: 8, padding: '6px 16px', fontWeight: 700, cursor: 'pointer', fontSize: 13,
            }}
          >
            {data.availability_open ? '🟢 Open for Projects' : '🔴 Not Available'}
          </button>
        </div>
        <div>
          <label style={LABEL_STYLE}>Availability Message</label>
          <input style={INPUT_STYLE} value={data.availability_message} onChange={e => setData(p => ({ ...p, availability_message: e.target.value }))} />
        </div>
      </div>

      {/* Save */}
      <button onClick={save} disabled={saving} style={SAVE_BTN}>
        {saving ? '⏳ Saving…' : '💾 Save Home Page'}
      </button>

      <p style={{ color: '#334155', fontSize: 12, marginTop: 16 }}>
        💡 Changes will be reflected on the public <a href="/" target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6' }}>homepage</a> after save. Requires Supabase schema tables to be created first.
      </p>
    </div>
  )
}
