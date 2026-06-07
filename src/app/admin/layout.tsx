'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

const NAV = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: '⊞' },
  { href: '/admin/media', label: 'Media Library', icon: '🖼️' },
  { href: '/admin/home', label: 'Home Page CMS', icon: '🏠' },
  { href: '/admin/services', label: 'Services CMS', icon: '💼' },
  { href: '/admin/projects', label: 'Projects CMS', icon: '🗂️' },
  { href: '/admin/testimonials', label: 'Testimonials CMS', icon: '💬' },
  { href: '/admin/videos', label: 'Videos CMS', icon: '▶️' },
  { href: '/admin/about', label: 'About Page CMS', icon: 'ℹ️' },
  { href: '/admin/contact', label: 'Contact Page CMS', icon: '📞' },
  { href: '/admin/navigation', label: 'Navigation CMS', icon: '🧭' },
  { href: '/admin/footer', label: 'Footer CMS', icon: '🦶' },
  { href: '/admin/seo', label: 'SEO Settings', icon: '🔍' },
  { href: '/admin/site-settings', label: 'Site Settings', icon: '🌐' },
  { href: '/admin/settings', label: 'Settings', icon: '⚙️' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [sideOpen, setSideOpen] = useState(true)
  const [loggingOut, setLoggingOut] = useState(false)

  async function handleLogout() {
    setLoggingOut(true)
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }

  // Login page renders its own layout
  if (pathname === '/admin/login') return <>{children}</>

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0f1e', fontFamily: 'system-ui, sans-serif' }}>
      {/* Sidebar */}
      <div style={{
        width: sideOpen ? 240 : 64, background: '#0f1729',
        borderRight: '1px solid #1e3a5f', transition: 'width 0.25s ease',
        display: 'flex', flexDirection: 'column', flexShrink: 0, zIndex: 10,
        height: '100vh', position: 'sticky', top: 0,
      }}>
        {/* Logo */}
        <div style={{
          padding: '20px 16px', borderBottom: '1px solid #1e3a5f',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          {sideOpen && (
            <div>
              <div style={{ color: '#3b82f6', fontWeight: 800, fontSize: 15, letterSpacing: 2 }}>HADITECH</div>
              <div style={{ color: '#334155', fontSize: 10, letterSpacing: 1 }}>ADMIN PANEL</div>
            </div>
          )}
          <button onClick={() => setSideOpen(!sideOpen)} style={{
            background: '#1a2744', border: 'none', borderRadius: 8,
            color: '#64748b', cursor: 'pointer', width: 32, height: 32, fontSize: 14,
          }}>
            {sideOpen ? '◁' : '▷'}
          </button>
        </div>

        {/* View Website */}
        <div style={{ padding: '12px 8px 0', flexShrink: 0 }}>
          <a href="/" target="_blank" rel="noopener noreferrer" style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
            borderRadius: 10, marginBottom: 8, textDecoration: 'none',
            background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)',
            color: '#10b981', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden',
          }}>
            <span style={{ fontSize: 16, flexShrink: 0 }}>🌐</span>
            {sideOpen && <span>View Website</span>}
          </a>
          <div style={{ height: 1, background: '#1e3a5f', marginBottom: 8 }} />
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '0 8px', overflowY: 'auto' }}>
          {NAV.map(n => {
            const active = pathname === n.href || (pathname.startsWith(n.href) && n.href !== '/admin/dashboard')
            return (
              <Link key={n.href} href={n.href} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px',
                borderRadius: 10, marginBottom: 4, textDecoration: 'none',
                background: active ? 'rgba(59,130,246,0.15)' : 'transparent',
                border: active ? '1px solid rgba(59,130,246,0.3)' : '1px solid transparent',
                color: active ? '#3b82f6' : '#64748b', transition: 'all 0.15s',
                whiteSpace: 'nowrap', overflow: 'hidden',
              }}>
                <span style={{ fontSize: 16, flexShrink: 0 }}>{n.icon}</span>
                {sideOpen && <span style={{ fontSize: 13, fontWeight: active ? 600 : 400 }}>{n.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div style={{ padding: '12px 8px', borderTop: '1px solid #1e3a5f' }}>
          <button onClick={handleLogout} disabled={loggingOut} style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px',
            borderRadius: 10, background: 'transparent', border: '1px solid transparent',
            color: '#64748b', cursor: 'pointer', width: '100%', transition: 'all 0.15s',
            whiteSpace: 'nowrap', overflow: 'hidden',
          }}>
            <span style={{ fontSize: 16 }}>🚪</span>
            {sideOpen && <span style={{ fontSize: 13 }}>{loggingOut ? 'Logging out...' : 'Logout'}</span>}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top bar */}
        <div style={{
          padding: '10px 24px', borderBottom: '1px solid #1e3a5f',
          background: '#0b1120', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ color: '#334155', fontSize: 12 }}>
            🛡️ HADITECH Admin — Supabase CMS Active
          </div>
          <a href="/" target="_blank" rel="noopener noreferrer" style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px',
            borderRadius: 8, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)',
            color: '#10b981', fontSize: 12, fontWeight: 600, textDecoration: 'none',
          }}>
            🌐 View Live Website →
          </a>
        </div>

        <div style={{ flex: 1, overflow: 'auto' }}>
          {children}
        </div>
      </div>
    </div>
  )
}
