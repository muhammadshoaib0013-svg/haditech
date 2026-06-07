export default function NotFound() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      minHeight: '80vh', padding: 32, textAlign: 'center',
      background: '#060d1f', color: '#f1f5f9', fontFamily: 'system-ui, sans-serif',
    }}>
      <div style={{ fontSize: 72, marginBottom: 16, fontWeight: 900, color: '#1e3a5f' }}>404</div>
      <h1 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 12px', color: '#f1f5f9' }}>Page Not Found</h1>
      <p style={{ color: '#64748b', fontSize: 14, marginBottom: 32, lineHeight: 1.6, maxWidth: 360 }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div style={{ display: 'flex', gap: 12 }}>
        <a
          href="/"
          style={{
            padding: '10px 24px', borderRadius: 10, textDecoration: 'none',
            background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)', color: 'white',
            fontSize: 13, fontWeight: 600,
          }}
        >
          ← Back to Home
        </a>
        <a
          href="/admin"
          style={{
            padding: '10px 24px', borderRadius: 10, textDecoration: 'none',
            background: 'rgba(30,58,95,0.5)', border: '1px solid #1e3a5f', color: '#94a3b8',
            fontSize: 13, fontWeight: 600,
          }}
        >
          Admin Panel
        </a>
      </div>
    </div>
  )
}
