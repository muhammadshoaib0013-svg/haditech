'use client'

// ─── Hook: call the admin API ─────────────────────────────────────────────────
export function useAdminSave() {
  async function save(action: string, section: string, payload: any) {
    const PW = typeof window !== 'undefined' ? sessionStorage.getItem('haditech_admin') || '' : ''
    const res = await fetch('/api/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-pw': PW },
      body: JSON.stringify({ action, section, payload }),
    })
    const data = await res.json()
    if (!res.ok || !data.ok) throw new Error(data.error || 'Save failed')
    return data
  }

  async function loadConfig() {
    const PW = typeof window !== 'undefined' ? sessionStorage.getItem('haditech_admin') || '' : ''
    const res = await fetch('/api/admin', { headers: { 'x-admin-pw': PW } })
    const data = await res.json()
    return data.content as string
  }

  return { save, loadConfig }
}

// ─── Field ───────────────────────────────────────────────────────────────────
export function Field({
  label, value, onChange, placeholder = '', hint = '', accent = '#3b82f6', type = 'text',
}: {
  label: string; value: string; onChange: (v: string) => void
  placeholder?: string; hint?: string; accent?: string; type?: string
}) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ color: '#94a3b8', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: hint ? 4 : 7 }}>
        {label}
      </label>
      {hint && <p style={{ color: '#475569', fontSize: 11, marginBottom: 6, lineHeight: 1.5 }}>{hint}</p>}
      <input
        type={type} value={value} placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        style={{ width: '100%', padding: '10px 13px', background: '#1a2744', border: '1.5px solid #1e3a5f', borderRadius: 9, color: '#f1f5f9', fontSize: 13, outline: 'none', boxSizing: 'border-box', transition: 'border-color .15s' }}
        onFocus={e => (e.target.style.borderColor = accent)}
        onBlur={e => (e.target.style.borderColor = '#1e3a5f')}
      />
    </div>
  )
}

// ─── TextArea ─────────────────────────────────────────────────────────────────
export function TextArea({
  label, value, onChange, placeholder = '', hint = '', accent = '#3b82f6', rows = 3,
}: {
  label: string; value: string; onChange: (v: string) => void
  placeholder?: string; hint?: string; accent?: string; rows?: number
}) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ color: '#94a3b8', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: hint ? 4 : 7 }}>
        {label}
      </label>
      {hint && <p style={{ color: '#475569', fontSize: 11, marginBottom: 6, lineHeight: 1.5 }}>{hint}</p>}
      <textarea
        value={value} placeholder={placeholder} rows={rows}
        onChange={e => onChange(e.target.value)}
        style={{ width: '100%', padding: '10px 13px', background: '#1a2744', border: '1.5px solid #1e3a5f', borderRadius: 9, color: '#f1f5f9', fontSize: 13, outline: 'none', resize: 'vertical', fontFamily: 'system-ui', lineHeight: 1.6, boxSizing: 'border-box', transition: 'border-color .15s' }}
        onFocus={e => (e.target.style.borderColor = accent)}
        onBlur={e => (e.target.style.borderColor = '#1e3a5f')}
      />
    </div>
  )
}

// ─── Toggle ───────────────────────────────────────────────────────────────────
export function Toggle({
  label, value, onChange, yes = 'Haan ✅', no = 'Nahi ❌', accent = '#3b82f6',
}: {
  label: string; value: boolean; onChange: (v: boolean) => void
  yes?: string; no?: string; accent?: string
}) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ color: '#94a3b8', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 8 }}>{label}</label>
      <div style={{ display: 'flex', gap: 8 }}>
        {([true, false] as const).map(v => (
          <button key={String(v)} onClick={() => onChange(v)} style={{ padding: '8px 18px', borderRadius: 8, cursor: 'pointer', fontSize: 12, background: value === v ? accent : '#1a2744', border: `1.5px solid ${value === v ? accent : '#1e3a5f'}`, color: value === v ? 'white' : '#475569', transition: 'all .15s' }}>
            {v ? yes : no}
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Card wrapper ─────────────────────────────────────────────────────────────
export function AdminCard({ title, color = '#3b82f6', children }: { title: string; color?: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#0f1729', border: `1px solid #1e3a5f`, borderLeft: `3px solid ${color}`, borderRadius: 13, padding: '22px 24px', marginBottom: 16 }}>
      <div style={{ color, fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 16 }}>{title}</div>
      {children}
    </div>
  )
}

// ─── Save button with states ──────────────────────────────────────────────────
export function SaveButton({
  saving, saved, error, onClick, label = '💾 SAVE KARO — File Automatically Update Hogi', accent = '#3b82f6',
}: {
  saving: boolean; saved: boolean; error: string; onClick: () => void; label?: string; accent?: string
}) {
  const bg = saved ? '#10b981' : error ? '#ef4444' : `linear-gradient(135deg,${accent},${accent}bb)`
  return (
    <div>
      <button
        onClick={onClick} disabled={saving}
        style={{ padding: '13px 32px', background: bg, border: 'none', borderRadius: 10, color: 'white', fontSize: 14, fontWeight: 700, cursor: saving ? 'wait' : 'pointer', opacity: saving ? 0.75 : 1, transition: 'all .2s', letterSpacing: 0.3, width: '100%' }}
      >
        {saving ? '⏳ Save ho raha hai, wait karo...' : saved ? '✅ HO GAYA! data.ts update ho gayi — changes live hain' : error ? '❌ Error — neeche dekho' : label}
      </button>
      {error && (
        <div style={{ color: '#ef4444', fontSize: 12, marginTop: 8, padding: '8px 12px', background: 'rgba(239,68,68,0.1)', borderRadius: 8, border: '1px solid rgba(239,68,68,0.2)' }}>
          ⚠️ {error}
        </div>
      )}
      {saved && (
        <div style={{ color: '#10b981', fontSize: 12, marginTop: 8 }}>
          ✅ data.ts file update ho gayi. Agar <code style={{ background: '#0a1628', padding: '1px 5px', borderRadius: 4 }}>npm run dev</code> chal raha hai toh changes turant dikh jayenge.
        </div>
      )}
    </div>
  )
}
