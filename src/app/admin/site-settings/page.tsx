'use client'
import { useState, useEffect } from 'react'
import { siteConfig } from '@/lib/data'
import { apiGet, apiPut } from '@/lib/admin-api'

type SiteSettings = {
  site_name: string
  tagline: string
  primary_email: string
  whatsapp_number: string
  whatsapp_link: string
  address: string
  logo_url: string
  linkedin_url: string
  github_url: string
  twitter_url: string
  facebook_url: string
}

const SECTION_STYLE: React.CSSProperties = { background: '#0f1729', border: '1px solid #1e3a5f', borderRadius: 16, padding: 28, marginBottom: 24 }
const LABEL: React.CSSProperties = { color: '#64748b', fontSize: 12, fontWeight: 600, letterSpacing: 1, marginBottom: 8, display: 'block', textTransform: 'uppercase' }
const INPUT: React.CSSProperties = { width: '100%', background: '#0a0f1e', border: '1px solid #1e3a5f', borderRadius: 10, padding: '10px 14px', color: '#e2e8f0', fontSize: 14, boxSizing: 'border-box' }
const SAVE_BTN: React.CSSProperties = { background: 'linear-gradient(135deg,#3b82f6,#6366f1)', color: '#fff', border: 'none', borderRadius: 10, padding: '11px 28px', fontWeight: 700, fontSize: 14, cursor: 'pointer' }

const DEFAULTS: SiteSettings = {
  site_name: siteConfig.brandName,
  tagline: siteConfig.tagline,
  primary_email: siteConfig.email,
  whatsapp_number: siteConfig.whatsappNumber,
  whatsapp_link: siteConfig.whatsappLink,
  address: '',
  logo_url: '',
  linkedin_url: siteConfig.socials.linkedin,
  github_url: siteConfig.socials.github,
  twitter_url: siteConfig.socials.twitter,
  facebook_url: siteConfig.socials.facebook,
}

export default function AdminSiteSettingsPage() {
  const [data, setData] = useState<SiteSettings>(DEFAULTS)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)
  const [loading, setLoading] = useState(true)

  async function loadData() {
    try {
      const d = await apiGet<SiteSettings>('/api/admin/site-settings')
      if (d && d.site_name) setData(d)
    } catch (err: any) {
      // Fallback is already DEFAULTS
    }
  }

  useEffect(() => {
    setLoading(true)
    loadData().finally(() => setLoading(false))
  }, [])

  function set(key: keyof SiteSettings, val: string) {
    setData(p => ({ ...p, [key]: val }))
  }

  async function save() {
    setSaving(true)
    setToast(null)
    try {
      await apiPut('/api/admin/site-settings', data)
      setToast({ msg: '✅ Site settings saved!', ok: true })
      // E2E Contract: loadData after saving to guarantee the round-trip database update
      await loadData()
    } catch (e: unknown) {
      setToast({ msg: `❌ ${e instanceof Error ? e.message : String(e)}`, ok: false })
    } finally {
      setSaving(false)
      setTimeout(() => setToast(null), 5000)
    }
  }

  if (loading) return (
    <div style={{ padding: 40, color: '#64748b', textAlign: 'center' }}>
      <div style={{ fontSize: 32, marginBottom: 12 }}>🌐</div>Loading Site Settings…
    </div>
  )

  return (
    <div style={{ padding: '32px 36px', maxWidth: 860, margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ color: '#f1f5f9', fontSize: 26, fontWeight: 800, margin: 0 }}>🌐 Site Settings</h1>
        <p style={{ color: '#64748b', marginTop: 6, fontSize: 14 }}>Global brand configuration — logo, contact info, social links.</p>
      </div>

      {toast && (
        <div style={{ background: toast.ok ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', border: `1px solid ${toast.ok ? '#10b981' : '#ef4444'}`, borderRadius: 10, padding: '12px 18px', marginBottom: 24, color: toast.ok ? '#10b981' : '#ef4444', fontSize: 14, fontWeight: 600 }}>
          {toast.msg}
        </div>
      )}

      {/* Brand */}
      <div style={SECTION_STYLE}>
        <h2 style={{ color: '#3b82f6', fontSize: 15, fontWeight: 700, marginBottom: 20, marginTop: 0 }}>🏷️ Brand Identity</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div>
            <label style={LABEL}>Brand Name</label>
            <input style={INPUT} value={data.site_name} onChange={e => set('site_name', e.target.value)} />
          </div>
          <div>
            <label style={LABEL}>Logo URL (optional)</label>
            <input style={INPUT} value={data.logo_url} onChange={e => set('logo_url', e.target.value)} placeholder="https://..." />
          </div>
        </div>
        <div>
          <label style={LABEL}>Tagline</label>
          <input style={INPUT} value={data.tagline} onChange={e => set('tagline', e.target.value)} />
        </div>
      </div>

      {/* Contact */}
      <div style={SECTION_STYLE}>
        <h2 style={{ color: '#3b82f6', fontSize: 15, fontWeight: 700, marginBottom: 20, marginTop: 0 }}>📞 Contact Details</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div>
            <label style={LABEL}>Primary Email</label>
            <input style={INPUT} type="email" value={data.primary_email} onChange={e => set('primary_email', e.target.value)} />
          </div>
          <div>
            <label style={LABEL}>WhatsApp Number (with country code)</label>
            <input style={INPUT} value={data.whatsapp_number} onChange={e => set('whatsapp_number', e.target.value)} placeholder="+92 301 2475707" />
          </div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={LABEL}>WhatsApp Link (full wa.me URL)</label>
          <input style={INPUT} value={data.whatsapp_link} onChange={e => set('whatsapp_link', e.target.value)} placeholder="https://wa.me/923012475707?text=..." />
        </div>
        <div>
          <label style={LABEL}>Office Address (optional)</label>
          <input style={INPUT} value={data.address} onChange={e => set('address', e.target.value)} placeholder="City, Country" />
        </div>
      </div>

      {/* Social Links */}
      <div style={SECTION_STYLE}>
        <h2 style={{ color: '#3b82f6', fontSize: 15, fontWeight: 700, marginBottom: 20, marginTop: 0 }}>🔗 Social Links</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {(['linkedin_url', 'github_url', 'twitter_url', 'facebook_url'] as const).map(key => (
            <div key={key}>
              <label style={LABEL}>{key.replace('_url', '').replace('_', ' ')}</label>
              <input style={INPUT} value={(data as Record<string, string>)[key]} onChange={e => set(key, e.target.value)} placeholder="https://..." />
            </div>
          ))}
        </div>
      </div>

      <button onClick={save} disabled={saving} style={SAVE_BTN}>
        {saving ? '⏳ Saving…' : '💾 Save Site Settings'}
      </button>
      <p style={{ color: '#334155', fontSize: 12, marginTop: 16 }}>
        💡 WhatsApp number and link control the floating WhatsApp button visible on all public pages.
      </p>
    </div>
  )
}
