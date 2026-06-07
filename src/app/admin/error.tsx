'use client'

import { useEffect } from 'react'

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[Admin Error Boundary]', error)
  }, [error])

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      minHeight: '60vh', padding: 32, textAlign: 'center',
    }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
      <h2 style={{ color: '#f1f5f9', fontSize: 20, fontWeight: 700, margin: '0 0 10px' }}>Admin Panel Error</h2>
      <p style={{ color: '#64748b', fontSize: 14, marginBottom: 24, lineHeight: 1.6, maxWidth: 420 }}>
        {error.message || 'An unexpected error occurred in the admin panel. Please try again.'}
      </p>
      <div style={{ display: 'flex', gap: 12 }}>
        <button
          onClick={reset}
          style={{
            padding: '10px 24px', borderRadius: 10, border: 'none', cursor: 'pointer',
            background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)', color: 'white',
            fontSize: 13, fontWeight: 600,
          }}
        >
          Try Again
        </button>
        <a
          href="/admin/dashboard"
          style={{
            padding: '10px 24px', borderRadius: 10, textDecoration: 'none',
            background: 'rgba(30,58,95,0.5)', border: '1px solid #1e3a5f', color: '#94a3b8',
            fontSize: 13, fontWeight: 600,
          }}
        >
          Dashboard
        </a>
      </div>
    </div>
  )
}
