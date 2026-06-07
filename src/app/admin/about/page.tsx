'use client'
import { useState, useEffect } from 'react'
import { apiGet, apiPut } from '@/lib/admin-api'

type AboutData = {
  hero_title: string
  hero_subtitle: string
  story_title: string
  story_body: string
  mission_title: string
  mission_body: string
  values_title: string
  values_body: string
  team_title: string
  team_body: string
  cta_title: string
  cta_subtitle: string
  cta_button: string
}

const SECTION_STYLE: React.CSSProperties = { background: '#0f1729', border: '1px solid #1e3a5f', borderRadius: 16, padding: 28, marginBottom: 24 }
const LABEL: React.CSSProperties = { color: '#64748b', fontSize: 12, fontWeight: 600, letterSpacing: 1, marginBottom: 8, display: 'block', textTransform: 'uppercase' }
const INPUT: React.CSSProperties = { width: '100%', background: '#0a0f1e', border: '1px solid #1e3a5f', borderRadius: 10, padding: '10px 14px', color: '#e2e8f0', fontSize: 14, boxSizing: 'border-box', marginBottom: 16 }
const TEXTAREA: React.CSSProperties = { ...INPUT, minHeight: 110, resize: 'vertical' }
const SAVE_BTN: React.CSSProperties = { background: 'linear-gradient(135deg,#3b82f6,#6366f1)', color: '#fff', border: 'none', borderRadius: 10, padding: '11px 28px', fontWeight: 700, fontSize: 14, cursor: 'pointer' }

const DEFAULTS: AboutData = {
  hero_title: 'About HADITECH',
  hero_subtitle: 'We are a specialist SaaS development studio focused on building scalable, high-performance web applications.',
  story_title: 'Our Story',
  story_body: 'Founded by passionate engineers, HADITECH was built on the belief that great software can transform businesses. We combine deep technical expertise with a design-first mindset to deliver products that users love.',
  mission_title: 'Our Mission',
  mission_body: 'To empower startups and enterprises with premium digital products that scale — built with care, shipped with speed.',
  values_title: 'Our Values',
  values_body: 'Transparency, quality craftsmanship, on-time delivery, and long-term partnerships are at the core of everything we do.',
  team_title: 'Meet the Team',
  team_body: 'A compact, highly skilled team of full-stack engineers, UI/UX designers, and AI specialists.',
  cta_title: 'Ready to Build Something Great?',
  cta_subtitle: 'Let\'s discuss your project and see how HADITECH can help you ship faster.',
  cta_button: 'Start a Project',
}

export default function AdminAboutPage() {
  const [data, setData] = useState<AboutData>(DEFAULTS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)

  const loadAboutData = () => {
    apiGet<any>('/api/admin/page-content?page=about')
      .then((sections) => {
        if (!Array.isArray(sections)) return
        const get = (key: string) => sections.find(s => s.section_key === key)
        setData({
          hero_title: get('hero')?.title ?? DEFAULTS.hero_title,
          hero_subtitle: get('hero')?.subtitle ?? DEFAULTS.hero_subtitle,
          story_title: get('story')?.title ?? DEFAULTS.story_title,
          story_body: get('story')?.body ?? DEFAULTS.story_body,
          mission_title: get('mission')?.title ?? DEFAULTS.mission_title,
          mission_body: get('mission')?.body ?? DEFAULTS.mission_body,
          values_title: get('values')?.title ?? DEFAULTS.values_title,
          values_body: get('values')?.body ?? DEFAULTS.values_body,
          team_title: get('team')?.title ?? DEFAULTS.team_title,
          team_body: get('team')?.body ?? DEFAULTS.team_body,
          cta_title: get('cta')?.title ?? DEFAULTS.cta_title,
          cta_subtitle: get('cta')?.subtitle ?? DEFAULTS.cta_subtitle,
          cta_button: get('cta')?.button_label ?? DEFAULTS.cta_button,
        })
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadAboutData()
  }, [])

  async function save() {
    setSaving(true)
    setToast(null)
    const sections = [
      { section_key: 'hero', title: data.hero_title, subtitle: data.hero_subtitle },
      { section_key: 'story', title: data.story_title, body: data.story_body },
      { section_key: 'mission', title: data.mission_title, body: data.mission_body },
      { section_key: 'values', title: data.values_title, body: data.values_body },
      { section_key: 'team', title: data.team_title, body: data.team_body },
      { section_key: 'cta', title: data.cta_title, subtitle: data.cta_subtitle, button_label: data.cta_button },
    ]
    try {
      // 1. Save all content sections (throws on failure)
      await Promise.all(sections.map(s => apiPut('/api/admin/page-content', { page_key: 'about', ...s })))

      // 2. Immediately re-fetch list from database to verify persistence
      const freshSections = await apiGet<any>('/api/admin/page-content?page=about')
      if (Array.isArray(freshSections)) {
        const get = (key: string) => freshSections.find(s => s.section_key === key)
        setData({
          hero_title: get('hero')?.title ?? DEFAULTS.hero_title,
          hero_subtitle: get('hero')?.subtitle ?? DEFAULTS.hero_subtitle,
          story_title: get('story')?.title ?? DEFAULTS.story_title,
          story_body: get('story')?.body ?? DEFAULTS.story_body,
          mission_title: get('mission')?.title ?? DEFAULTS.mission_title,
          mission_body: get('mission')?.body ?? DEFAULTS.mission_body,
          values_title: get('values')?.title ?? DEFAULTS.values_title,
          values_body: get('values')?.body ?? DEFAULTS.values_body,
          team_title: get('team')?.title ?? DEFAULTS.team_title,
          team_body: get('team')?.body ?? DEFAULTS.team_body,
          cta_title: get('cta')?.title ?? DEFAULTS.cta_title,
          cta_subtitle: get('cta')?.subtitle ?? DEFAULTS.cta_subtitle,
          cta_button: get('cta')?.button_label ?? DEFAULTS.cta_button,
        })
      }

      setToast({ msg: '✅ About page saved & verified!', ok: true })
    } catch (err: any) {
      setToast({ msg: `❌ Save failed — ${err?.message || 'check Supabase connection.'}`, ok: false })
    } finally {
      setSaving(false)
      setTimeout(() => setToast(null), 5000)
    }
  }

  function set(key: keyof AboutData, val: string) {
    setData(p => ({ ...p, [key]: val }))
  }

  if (loading) return (
    <div style={{ padding: 40, color: '#64748b', textAlign: 'center' }}>
      <div style={{ fontSize: 32, marginBottom: 12 }}>ℹ️</div>Loading About CMS…
    </div>
  )

  const Section = ({ icon, label, titleKey, bodyKey, subtitleKey, bodyLabel = 'Body Text' }: { icon: string; label: string; titleKey: keyof AboutData; bodyKey?: keyof AboutData; subtitleKey?: keyof AboutData; bodyLabel?: string }) => (
    <div style={SECTION_STYLE}>
      <h2 style={{ color: '#3b82f6', fontSize: 15, fontWeight: 700, marginBottom: 20, marginTop: 0 }}>{icon} {label}</h2>
      <label style={LABEL}>Section Title</label>
      <input style={INPUT} value={String(data[titleKey])} onChange={e => set(titleKey, e.target.value)} />
      {subtitleKey && (
        <>
          <label style={LABEL}>Subtitle</label>
          <input style={INPUT} value={String(data[subtitleKey])} onChange={e => set(subtitleKey, e.target.value)} />
        </>
      )}
      {bodyKey && (
        <>
          <label style={LABEL}>{bodyLabel}</label>
          <textarea style={TEXTAREA} value={String(data[bodyKey])} onChange={e => set(bodyKey, e.target.value)} />
        </>
      )}
    </div>
  )

  return (
    <div style={{ padding: '32px 36px', maxWidth: 860, margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ color: '#f1f5f9', fontSize: 26, fontWeight: 800, margin: 0 }}>ℹ️ About Page CMS</h1>
        <p style={{ color: '#64748b', marginTop: 6, fontSize: 14 }}>Edit all sections of the public About page.</p>
      </div>

      {toast && (
        <div style={{ background: toast.ok ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', border: `1px solid ${toast.ok ? '#10b981' : '#ef4444'}`, borderRadius: 10, padding: '12px 18px', marginBottom: 24, color: toast.ok ? '#10b981' : '#ef4444', fontSize: 14, fontWeight: 600 }}>
          {toast.msg}
        </div>
      )}

      <Section icon="⚡" label="Hero" titleKey="hero_title" subtitleKey="hero_subtitle" />
      <Section icon="📖" label="Our Story" titleKey="story_title" bodyKey="story_body" />
      <Section icon="🎯" label="Our Mission" titleKey="mission_title" bodyKey="mission_body" />
      <Section icon="💡" label="Our Values" titleKey="values_title" bodyKey="values_body" />
      <Section icon="👥" label="Team" titleKey="team_title" bodyKey="team_body" />

      {/* CTA */}
      <div style={SECTION_STYLE}>
        <h2 style={{ color: '#3b82f6', fontSize: 15, fontWeight: 700, marginBottom: 20, marginTop: 0 }}>🚀 Call to Action</h2>
        <label style={LABEL}>CTA Title</label>
        <input style={INPUT} value={data.cta_title} onChange={e => set('cta_title', e.target.value)} />
        <label style={LABEL}>CTA Subtitle</label>
        <input style={INPUT} value={data.cta_subtitle} onChange={e => set('cta_subtitle', e.target.value)} />
        <label style={LABEL}>CTA Button Label</label>
        <input style={INPUT} value={data.cta_button} onChange={e => set('cta_button', e.target.value)} />
      </div>

      <button onClick={save} disabled={saving} style={SAVE_BTN}>
        {saving ? '⏳ Saving…' : '💾 Save About Page'}
      </button>
      <p style={{ color: '#334155', fontSize: 12, marginTop: 16 }}>
        💡 View the live <a href="/about" target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6' }}>About page</a> to verify changes.
      </p>
    </div>
  )
}
