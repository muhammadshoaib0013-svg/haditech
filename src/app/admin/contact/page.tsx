'use client'
import { useState, useEffect } from 'react'
import { siteConfig } from '@/lib/data'
import { apiGet, apiPut } from '@/lib/admin-api'

type ContactData = {
  hero_title: string
  hero_subtitle: string
  email: string
  whatsapp_number: string
  whatsapp_link: string
  address: string
  hours: string
  response_time: string
}

const SECTION_STYLE: React.CSSProperties = { background: '#0f1729', border: '1px solid #1e3a5f', borderRadius: 16, padding: 28, marginBottom: 24 }
const LABEL: React.CSSProperties = { color: '#64748b', fontSize: 12, fontWeight: 600, letterSpacing: 1, marginBottom: 8, display: 'block', textTransform: 'uppercase' }
const INPUT: React.CSSProperties = { width: '100%', background: '#0a0f1e', border: '1px solid #1e3a5f', borderRadius: 10, padding: '10px 14px', color: '#e2e8f0', fontSize: 14, boxSizing: 'border-box' }
const SAVE_BTN: React.CSSProperties = { background: 'linear-gradient(135deg,#3b82f6,#6366f1)', color: '#fff', border: 'none', borderRadius: 10, padding: '11px 28px', fontWeight: 700, fontSize: 14, cursor: 'pointer' }

const DEFAULTS: ContactData = {
  hero_title: 'Get In Touch',
  hero_subtitle: "Let's discuss your project. Reach out via WhatsApp or email — we respond within 24 hours.",
  email: siteConfig.email,
  whatsapp_number: siteConfig.whatsappNumber,
  whatsapp_link: siteConfig.whatsappLink,
  address: 'Available Worldwide · Remote First',
  hours: 'Mon–Sat · 9am–7pm PKT',
  response_time: 'Within 24 hours',
}

export default function AdminContactPage() {
  const [data, setData] = useState<ContactData>(DEFAULTS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)

  const loadContactData = () => {
    Promise.all([
      apiGet<any>('/api/admin/page-content?page=contact'),
      apiGet<any>('/api/admin/site-settings'),
    ]).then(([sections, settings]) => {
      const hero = Array.isArray(sections) ? sections.find((s: { section_key: string }) => s.section_key === 'hero') : null
      const info = Array.isArray(sections) ? sections.find((s: { section_key: string }) => s.section_key === 'info') : null
      setData({
        hero_title: hero?.title ?? DEFAULTS.hero_title,
        hero_subtitle: hero?.subtitle ?? DEFAULTS.hero_subtitle,
        email: settings?.primary_email ?? DEFAULTS.email,
        whatsapp_number: settings?.whatsapp_number ?? DEFAULTS.whatsapp_number,
        whatsapp_link: settings?.whatsapp_link ?? DEFAULTS.whatsapp_link,
        address: info?.extra_json?.address ?? settings?.address ?? DEFAULTS.address,
        hours: info?.extra_json?.hours ?? DEFAULTS.hours,
        response_time: info?.extra_json?.response_time ?? DEFAULTS.response_time,
      })
    }).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(() => {
    loadContactData()
  }, [])

  function set(key: keyof ContactData, val: string) {
    setData(p => ({ ...p, [key]: val }))
  }

  async function save() {
    setSaving(true)
    setToast(null)
    try {
      // 1. Save all details to page content & site settings (throws on failure)
      await Promise.all([
        apiPut('/api/admin/page-content', { page_key: 'contact', section_key: 'hero', title: data.hero_title, subtitle: data.hero_subtitle }),
        apiPut('/api/admin/page-content', { page_key: 'contact', section_key: 'info', extra_json: { address: data.address, hours: data.hours, response_time: data.response_time } }),
        apiPut('/api/admin/site-settings', { primary_email: data.email, whatsapp_number: data.whatsapp_number, whatsapp_link: data.whatsapp_link, address: data.address }),
      ])

      // 2. Immediately re-fetch from Supabase to verify persistence
      const [sections, settings] = await Promise.all([
        apiGet<any>('/api/admin/page-content?page=contact'),
        apiGet<any>('/api/admin/site-settings'),
      ])

      const hero = Array.isArray(sections) ? sections.find((s: { section_key: string }) => s.section_key === 'hero') : null
      const info = Array.isArray(sections) ? sections.find((s: { section_key: string }) => s.section_key === 'info') : null
      
      setData({
        hero_title: hero?.title ?? DEFAULTS.hero_title,
        hero_subtitle: hero?.subtitle ?? DEFAULTS.hero_subtitle,
        email: settings?.primary_email ?? DEFAULTS.email,
        whatsapp_number: settings?.whatsapp_number ?? DEFAULTS.whatsapp_number,
        whatsapp_link: settings?.whatsapp_link ?? DEFAULTS.whatsapp_link,
        address: info?.extra_json?.address ?? settings?.address ?? DEFAULTS.address,
        hours: info?.extra_json?.hours ?? DEFAULTS.hours,
        response_time: info?.extra_json?.response_time ?? DEFAULTS.response_time,
      })

      setToast({ msg: '✅ Contact page saved & verified!', ok: true })
    } catch (err: any) {
      setToast({ msg: `❌ Save failed — ${err?.message || 'check Supabase connection.'}`, ok: false })
    } finally {
      setSaving(false)
      setTimeout(() => setToast(null), 5000)
    }
  }

  if (loading) return (
    <div style={{ padding: 40, color: '#64748b', textAlign: 'center' }}>
      <div style={{ fontSize: 32, marginBottom: 12 }}>📞</div>Loading Contact CMS…
    </div>
  )

  return (
    <div style={{ padding: '32px 36px', maxWidth: 860, margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ color: '#f1f5f9', fontSize: 26, fontWeight: 800, margin: 0 }}>📞 Contact Page CMS</h1>
        <p style={{ color: '#64748b', marginTop: 6, fontSize: 14 }}>Edit contact info, WhatsApp link, office hours, and hero text.</p>
      </div>

      {toast && (
        <div style={{ background: toast.ok ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', border: `1px solid ${toast.ok ? '#10b981' : '#ef4444'}`, borderRadius: 10, padding: '12px 18px', marginBottom: 24, color: toast.ok ? '#10b981' : '#ef4444', fontSize: 14, fontWeight: 600 }}>
          {toast.msg}
        </div>
      )}

      {/* Hero */}
      <div style={SECTION_STYLE}>
        <h2 style={{ color: '#3b82f6', fontSize: 15, fontWeight: 700, marginBottom: 20, marginTop: 0 }}>⚡ Hero Section</h2>
        <label style={LABEL}>Title</label>
        <input style={{ ...INPUT, marginBottom: 16 }} value={data.hero_title} onChange={e => set('hero_title', e.target.value)} />
        <label style={LABEL}>Subtitle</label>
        <input style={INPUT} value={data.hero_subtitle} onChange={e => set('hero_subtitle', e.target.value)} />
      </div>

      {/* Contact Details */}
      <div style={SECTION_STYLE}>
        <h2 style={{ color: '#3b82f6', fontSize: 15, fontWeight: 700, marginBottom: 20, marginTop: 0 }}>📬 Contact Details</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div>
            <label style={LABEL}>Email Address</label>
            <input style={INPUT} type="email" value={data.email} onChange={e => set('email', e.target.value)} />
          </div>
          <div>
            <label style={LABEL}>WhatsApp Number</label>
            <input style={INPUT} value={data.whatsapp_number} onChange={e => set('whatsapp_number', e.target.value)} />
          </div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={LABEL}>WhatsApp Link (full URL)</label>
          <input style={INPUT} value={data.whatsapp_link} onChange={e => set('whatsapp_link', e.target.value)} placeholder="https://wa.me/923012475707?text=..." />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={LABEL}>Office / Location</label>
          <input style={INPUT} value={data.address} onChange={e => set('address', e.target.value)} placeholder="City, Country or Remote" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label style={LABEL}>Working Hours</label>
            <input style={INPUT} value={data.hours} onChange={e => set('hours', e.target.value)} placeholder="Mon–Sat · 9am–7pm PKT" />
          </div>
          <div>
            <label style={LABEL}>Response Time</label>
            <input style={INPUT} value={data.response_time} onChange={e => set('response_time', e.target.value)} placeholder="Within 24 hours" />
          </div>
        </div>
      </div>

      <div style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.3)', borderRadius: 12, padding: '14px 18px', marginBottom: 24 }}>
        <p style={{ margin: 0, color: '#fbbf24', fontSize: 13 }}>
          ⚠️ <strong>WhatsApp Link</strong> controls the floating WhatsApp button visible site-wide. Update it carefully.
        </p>
      </div>

      <button onClick={save} disabled={saving} style={SAVE_BTN}>
        {saving ? '⏳ Saving…' : '💾 Save Contact Page'}
      </button>
      <p style={{ color: '#334155', fontSize: 12, marginTop: 16 }}>
        💡 View <a href="/contact" target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6' }}>Contact page</a> to verify.
      </p>
    </div>
  )
}
