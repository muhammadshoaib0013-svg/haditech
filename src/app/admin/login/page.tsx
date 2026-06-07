'use client'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function AdminLoginForm() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const nextUrl = searchParams.get('next')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!password.trim()) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error || 'Login failed. Please try again.')
      } else {
        router.push(nextUrl || '/admin/dashboard')
        router.refresh()
      }
    } catch {
      setError('Connection error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #0a0f1e 0%, #0d1628 100%)',
      fontFamily: "'JetBrains Mono', 'Courier New', monospace",
    }}>
      {/* Background glow */}
      <div style={{
        position: 'fixed', top: '30%', left: '50%', transform: 'translateX(-50%)',
        width: 600, height: 600, background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        background: '#0f1729', border: '1px solid #1e3a5f', borderRadius: 20,
        padding: '48px 44px', width: 400, maxWidth: '90vw',
        boxShadow: '0 0 80px rgba(59,130,246,0.12), 0 32px 64px rgba(0,0,0,0.4)',
        position: 'relative',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            width: 60, height: 60, background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)',
            borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 26, margin: '0 auto 20px', boxShadow: '0 8px 32px rgba(59,130,246,0.4)',
          }}>🛡️</div>
          <div style={{ color: '#f1f5f9', fontSize: 22, fontWeight: 800, letterSpacing: 3 }}>HADITECH</div>
          <div style={{ color: '#3b82f6', fontSize: 11, marginTop: 4, letterSpacing: 4, fontWeight: 600 }}>ADMIN PANEL</div>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ color: '#64748b', fontSize: 11, letterSpacing: 2, display: 'block', marginBottom: 8, fontWeight: 600 }}>
              ADMIN PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError('') }}
              placeholder="Enter your admin password"
              autoFocus
              disabled={loading}
              style={{
                width: '100%', padding: '13px 16px',
                background: '#1a2744', border: error ? '1.5px solid #ef4444' : '1.5px solid #1e3a5f',
                borderRadius: 12, color: '#f1f5f9', fontSize: 14,
                outline: 'none', boxSizing: 'border-box', letterSpacing: 2,
                transition: 'border-color 0.2s',
              }}
              onFocus={e => { if (!error) e.target.style.borderColor = '#3b82f6' }}
              onBlur={e => { if (!error) e.target.style.borderColor = '#1e3a5f' }}
            />
            {error && (
              <div style={{ color: '#ef4444', fontSize: 12, marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                ❌ {error}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !password.trim()}
            style={{
              width: '100%', padding: '14px',
              background: loading ? '#1e3a5f' : 'linear-gradient(135deg,#3b82f6,#1d4ed8)',
              border: 'none', borderRadius: 12, color: 'white',
              fontSize: 13, fontWeight: 700, letterSpacing: 2,
              cursor: loading || !password.trim() ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 4px 20px rgba(59,130,246,0.4)',
              transition: 'all 0.2s', opacity: !password.trim() ? 0.5 : 1,
            }}
          >
            {loading ? '⏳ VERIFYING...' : 'LOGIN →'}
          </button>
        </form>

        <div style={{ color: '#334155', fontSize: 11, textAlign: 'center', marginTop: 24, lineHeight: 1.7 }}>
          Set <code style={{ color: '#3b82f6', background: 'rgba(59,130,246,0.1)', padding: '1px 6px', borderRadius: 4 }}>ADMIN_PASSWORD</code> in your <code style={{ color: '#64748b' }}>.env.local</code> file.<br/>
          Authorized access only.
        </div>
      </div>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #0a0f1e 0%, #0d1628 100%)',
        color: '#64748b', fontFamily: "'JetBrains Mono', 'Courier New', monospace",
        fontSize: 14
      }}>
        ⏳ INITIALIZING SECURE PANEL...
      </div>
    }>
      <AdminLoginForm />
    </Suspense>
  )
}
