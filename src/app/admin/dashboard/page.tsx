'use client'
import Link from 'next/link'

const CARDS = [
  {
    href: '/admin/media',
    icon: '🖼️',
    title: 'Media Library',
    desc: 'Upload images and video thumbnails. Get public URLs for your content.',
    color: '#8b5cf6',
    bg: 'rgba(139,92,246,0.1)',
    border: 'rgba(139,92,246,0.3)',
  },
  {
    href: '/admin/projects',
    icon: '🗂️',
    title: 'Manage Projects',
    desc: 'Add, edit, publish and delete portfolio projects. Select images from Media Library.',
    color: '#3b82f6',
    bg: 'rgba(59,130,246,0.1)',
    border: 'rgba(59,130,246,0.3)',
  },
  {
    href: '/admin/videos',
    icon: '▶️',
    title: 'Manage Videos',
    desc: 'Add YouTube/Vimeo videos with thumbnails. Publish to the public Videos page.',
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.1)',
    border: 'rgba(239,68,68,0.3)',
  },
  {
    href: '/admin/testimonials',
    icon: '💬',
    title: 'Testimonials',
    desc: 'Add and manage client testimonials. Feature them on the homepage.',
    color: '#10b981',
    bg: 'rgba(16,185,129,0.1)',
    border: 'rgba(16,185,129,0.3)',
  },
  {
    href: '/admin/settings',
    icon: '⚙️',
    title: 'Settings',
    desc: 'Check Supabase connection status and environment variables.',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.1)',
    border: 'rgba(245,158,11,0.3)',
  },
]

export default function AdminDashboardPage() {
  return (
    <div style={{ padding: 32, maxWidth: 1100, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ color: '#f1f5f9', fontSize: 28, fontWeight: 800, margin: 0 }}>
          Admin Dashboard
        </h1>
        <p style={{ color: '#64748b', fontSize: 14, marginTop: 8 }}>
          Welcome back. Manage your portfolio content below.
        </p>
      </div>

      {/* Quick stats */}
      <div style={{
        background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.2)',
        borderRadius: 14, padding: '16px 24px', marginBottom: 36, display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <span style={{ fontSize: 20 }}>✅</span>
        <div>
          <div style={{ color: '#93c5fd', fontSize: 13, fontWeight: 600 }}>Supabase CMS Active</div>
          <div style={{ color: '#475569', fontSize: 12 }}>
            Content you publish here will appear live on your website automatically.
          </div>
        </div>
      </div>

      {/* Nav cards */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20,
      }}>
        {CARDS.map(card => (
          <Link key={card.href} href={card.href} style={{ textDecoration: 'none' }}>
            <div style={{
              background: card.bg, border: `1px solid ${card.border}`,
              borderRadius: 16, padding: '28px 24px', cursor: 'pointer',
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'
                ;(e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 32px ${card.border}`
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.transform = 'none'
                ;(e.currentTarget as HTMLDivElement).style.boxShadow = 'none'
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 14 }}>{card.icon}</div>
              <div style={{ color: card.color, fontSize: 16, fontWeight: 700, marginBottom: 8 }}>
                {card.title}
              </div>
              <div style={{ color: '#64748b', fontSize: 13, lineHeight: 1.6 }}>
                {card.desc}
              </div>
              <div style={{ color: card.color, fontSize: 12, marginTop: 16, fontWeight: 600 }}>
                Open → 
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Footer */}
      <div style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid #1e3a5f' }}>
        <p style={{ color: '#334155', fontSize: 12, textAlign: 'center' }}>
          HADITECH Admin Panel • Powered by Supabase • Changes publish instantly to the live website
        </p>
      </div>
    </div>
  )
}
