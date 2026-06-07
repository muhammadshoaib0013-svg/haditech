'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[App Error Boundary]', error)
  }, [error])

  return (
    <html>
      <body style={{ margin: 0, background: '#060d1f', color: '#f1f5f9', fontFamily: 'system-ui, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center', maxWidth: 480, padding: 32 }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>⚠️</div>
          <h1 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 12px', color: '#f1f5f9' }}>Something went wrong</h1>
          <p style={{ color: '#64748b', fontSize: 14, marginBottom: 28, lineHeight: 1.6 }}>
            {error.message || 'An unexpected error occurred. Please try again.'}
          </p>
          <button
            onClick={reset}
            style={{
              padding: '12px 28px', borderRadius: 10, border: 'none', cursor: 'pointer',
              background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)', color: 'white',
              fontSize: 14, fontWeight: 600, transition: 'all 0.15s',
            }}
          >
            Try Again
          </button>
          <div style={{ marginTop: 16 }}>
            <a href="/" style={{ color: '#475569', fontSize: 13, textDecoration: 'none' }}>← Back to Home</a>
          </div>
        </div>
      </body>
    </html>
  )
}
