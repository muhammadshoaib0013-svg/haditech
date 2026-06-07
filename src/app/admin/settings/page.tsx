'use client'
import { useState, useEffect } from 'react'

interface Check { label: string; ok: boolean; note?: string }
interface TableStatus { exists: boolean; error?: string }
interface StorageStatus { exists: boolean; isPublic: boolean; error?: string }
interface ColumnsStatus { healthy: boolean; error?: string }
interface HealthResponse { 
  success: boolean 
  configured: boolean 
  healthy: boolean 
  storage: StorageStatus
  mediaColumns: ColumnsStatus
  tables: Record<string, TableStatus>
  error?: string 
}
interface SqlResponse { success: boolean; rescue: string; schema: string; seed: string }

export default function AdminSettingsPage() {
  const [supabaseStatus, setSupabaseStatus] = useState<'checking' | 'ok' | 'error'>('checking')
  const [supabaseError, setSupabaseError] = useState('')
  const [envChecks, setEnvChecks] = useState<Check[]>([
    { label: 'ADMIN_PASSWORD', ok: false, note: 'Checking...' },
    { label: 'NEXT_PUBLIC_SUPABASE_URL', ok: false, note: 'Checking...' },
    { label: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', ok: false, note: 'Checking...' },
    { label: 'SUPABASE_SERVICE_ROLE_KEY', ok: false, note: 'Checking...' },
    { label: 'RESEND_API_KEY', ok: false, note: 'Checking...' },
    { label: 'META_WHATSAPP_TOKEN', ok: false, note: 'Checking...' },
    { label: 'META_WHATSAPP_PHONE_ID', ok: false, note: 'Checking...' },
    { label: 'WHATSAPP_NOTIFY_TO', ok: false, note: 'Checking...' },
  ])
  const [healthData, setHealthData] = useState<HealthResponse | null>(null)
  const [healthLoading, setHealthLoading] = useState(true)
  const [sqlData, setSqlData] = useState<SqlResponse | null>(null)
  const [copyState, setCopyState] = useState<{ rescue: boolean; schema: boolean; seed: boolean }>({ rescue: false, schema: false, seed: false })
  
  // Notification Health states
  const [whatsappDefaultTo, setWhatsappDefaultTo] = useState('')
  const [whatsappNormalized, setWhatsappNormalized] = useState('')
  const [testResult, setTestResult] = useState<any>(null)
  const [testLoading, setTestLoading] = useState(false)
  const [testError, setTestError] = useState('')

  async function loadData() {
    setHealthLoading(true)
    // 1. Run server env var checks
    try {
      const checkRes = await fetch('/api/admin/settings/check')
      if (checkRes.ok) {
        const checkJson = await checkRes.json()
        if (checkJson.success && checkJson.config) {
          const cfg = checkJson.config
          setEnvChecks([
            { label: 'ADMIN_PASSWORD', ok: cfg.ADMIN_PASSWORD, note: cfg.ADMIN_PASSWORD ? 'Set server-side only ✅' : '❌ Not set — add to .env.local' },
            { label: 'NEXT_PUBLIC_SUPABASE_URL', ok: cfg.NEXT_PUBLIC_SUPABASE_URL, note: cfg.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Not set' },
            { label: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', ok: cfg.NEXT_PUBLIC_SUPABASE_ANON_KEY, note: cfg.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Not set' },
            { label: 'SUPABASE_SERVICE_ROLE_KEY', ok: cfg.SUPABASE_SERVICE_ROLE_KEY, note: cfg.SUPABASE_SERVICE_ROLE_KEY ? 'Server-only — verified ✅' : '❌ Not set' },
            { label: 'RESEND_API_KEY', ok: cfg.RESEND_API_KEY, note: cfg.RESEND_API_KEY ? '✅ Email notifications active' : '❌ Not set — emails will fail' },
            { label: 'META_WHATSAPP_TOKEN', ok: cfg.META_WHATSAPP_ACCESS_TOKEN, note: cfg.META_WHATSAPP_ACCESS_TOKEN ? '✅ WhatsApp token set' : '❌ Missing — WhatsApp will fail' },
            { label: 'META_WHATSAPP_PHONE_ID', ok: cfg.META_WHATSAPP_PHONE_ID, note: cfg.META_WHATSAPP_PHONE_ID ? '✅ Phone number ID set' : '❌ Missing — WhatsApp will fail' },
            { label: 'WHATSAPP_NOTIFY_TO', ok: cfg.WHATSAPP_DEFAULT_TO !== 'missing', note: cfg.WHATSAPP_DEFAULT_TO !== 'missing' ? `✅ Recipient set (normalized: ${cfg.WHATSAPP_DEFAULT_TO_NORMALIZED || '?'})` : '❌ Missing — WhatsApp recipient unknown' },
          ])
          setWhatsappDefaultTo(cfg.WHATSAPP_DEFAULT_TO || 'missing')
          setWhatsappNormalized(cfg.WHATSAPP_DEFAULT_TO_NORMALIZED || '')
        }
      }
    } catch (e) {
      console.error('Failed to load server env configuration status:', e)
    }

    // 2. Fetch full database health check
    try {
      const healthRes = await fetch('/api/admin/cms/health')
      if (healthRes.ok) {
        const json: HealthResponse = await healthRes.json()
        setHealthData(json)
        if (json.success && json.healthy) {
          setSupabaseStatus('ok')
        } else if (json.success && !json.healthy) {
          setSupabaseStatus('error')
          
          let errMsg = 'Missing database tables or storage. See the diagnostics dashboard below.'
          if (json.storage && !json.storage.exists) {
            errMsg = 'Storage bucket "haditech-media" is missing. Please create it in Supabase.'
          } else if (json.mediaColumns && !json.mediaColumns.healthy) {
            errMsg = 'Table "media_assets" is missing required metadata columns (usage_type, page_key, alt_text, title). Please run the SQL schema.'
          }
          setSupabaseError(errMsg)
        } else {
          setSupabaseStatus('error')
          setSupabaseError(json.error || 'Connection failed')
        }
      } else {
        setSupabaseStatus('error')
        setSupabaseError('Server returned status ' + healthRes.status)
      }
    } catch (e) {
      setSupabaseStatus('error')
      setSupabaseError(e instanceof Error ? e.message : 'Unknown error')
    } finally {
      setHealthLoading(false)
    }

    // 3. Fetch SQL contents if tables are missing
    try {
      const sqlRes = await fetch('/api/admin/cms/sql')
      if (sqlRes.ok) {
        const json = await sqlRes.json()
        setSqlData(json)
      }
    } catch (e) {
      console.error('Failed to fetch SQL files:', e)
    }
  }

  async function sendTestNotification() {
    setTestLoading(true)
    setTestError('')
    setTestResult(null)
    try {
      const res = await fetch('/api/admin/notifications/test', {
        method: 'POST',
      })
      const data = await res.json()
      if (res.ok) {
        setTestResult(data)
      } else {
        setTestError(data.error || 'Failed with status ' + res.status)
      }
    } catch (e) {
      setTestError(e instanceof Error ? e.message : 'Unknown network error')
    } finally {
      setTestLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  function handleCopy(type: 'rescue' | 'schema' | 'seed', text: string) {
    navigator.clipboard.writeText(text)
    setCopyState(prev => ({ ...prev, [type]: true }))
    setTimeout(() => {
      setCopyState(prev => ({ ...prev, [type]: false }))
    }, 2000)
  }

  const cmsChecklist = [
    { label: 'Admin Login (/admin/login)', ok: true },
    { label: 'Storage Bucket (haditech-media)', ok: healthData?.storage?.exists && healthData?.storage?.isPublic || false },
    { label: 'Media Columns (usage_type, page_key...)', ok: healthData?.mediaColumns?.healthy || false },
    { label: 'Projects Table (portfolio_projects)', ok: healthData?.tables?.portfolio_projects?.exists || false },
    { label: 'Videos Table (portfolio_videos)', ok: healthData?.tables?.portfolio_videos?.exists || false },
    { label: 'Testimonials Table (portfolio_testimonials)', ok: healthData?.tables?.portfolio_testimonials?.exists || false },
    { label: 'Services Table (portfolio_services)', ok: healthData?.tables?.portfolio_services?.exists || false },
    { label: 'Site Settings Table (site_settings)', ok: healthData?.tables?.site_settings?.exists || false },
    { label: 'Navigation Table (navigation_items)', ok: healthData?.tables?.navigation_items?.exists || false },
    { label: 'Footer Table (footer_sections)', ok: healthData?.tables?.footer_sections?.exists || false },
    { label: 'Page Content Table (page_content)', ok: healthData?.tables?.page_content?.exists || false },
    { label: 'SEO Settings Table (seo_settings)', ok: healthData?.tables?.seo_settings?.exists || false },
    { label: 'Contact Leads Table (contact_leads)', ok: healthData?.tables?.contact_leads?.exists || false },
    { label: 'Newsletter Subscribers Table (newsletter_subscribers)', ok: healthData?.tables?.newsletter_subscribers?.exists || false },
  ]

  const totalTables = 11
  const activeTables = healthData?.tables 
    ? Object.values(healthData.tables).filter(t => t.exists).length 
    : 0

  return (
    <div style={{ padding: 32, maxWidth: 960, margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
          <h1 style={{ color: '#f1f5f9', fontSize: 26, fontWeight: 800, margin: '0 0 8px' }}>⚙️ Settings & CMS Diagnostics</h1>
          <p style={{ color: '#64748b', fontSize: 14, margin: 0 }}>System status, live database health check, and schema verification.</p>
        </div>
        <button 
          onClick={loadData} 
          disabled={healthLoading} 
          style={{ background: '#1e3a5f', border: '1px solid #3b82f6', borderRadius: 8, padding: '8px 16px', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}
        >
          {healthLoading ? '⏳ Refreshing...' : '🔄 Run Health Check'}
        </button>
      </div>

      {/* Supabase Connection Header */}
      <section style={{ background: '#0f1729', border: '1px solid #1e3a5f', borderRadius: 16, padding: 24, marginBottom: 24 }}>
        <h2 style={{ color: '#f1f5f9', fontSize: 16, fontWeight: 700, margin: '0 0 16px' }}>🔌 Supabase Connection Status</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {supabaseStatus === 'checking' && <span style={{ color: '#64748b', fontSize: 14 }}>⏳ Querying database schema cache & storage...</span>}
          {supabaseStatus === 'ok' && (
            <div style={{ width: '100%', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 10, padding: '14px 20px', color: '#10b981', fontSize: 14, fontWeight: 600 }}>
              ✅ Fully Operational — Database connection active, storage bucket "haditech-media" validated, and all {totalTables} tables verified in PostgreSQL schema.
            </div>
          )}
          {supabaseStatus === 'error' && (
            <div style={{ width: '100%', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '14px 20px', color: '#ef4444', fontSize: 14 }}>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>⚠️ CMS Schema Warning: Diagnostics Alert ({activeTables}/{totalTables} Tables Active)</div>
              <div style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.5 }}>
                {supabaseError}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Database Schema Diagnostic Grid */}
      <section style={{ background: '#0f1729', border: '1px solid #1e3a5f', borderRadius: 16, padding: 24, marginBottom: 24 }}>
        <h2 style={{ color: '#f1f5f9', fontSize: 16, fontWeight: 700, margin: '0 0 4px' }}>📊 Schema Diagnostics</h2>
        <p style={{ color: '#64748b', fontSize: 13, marginBottom: 20 }}>Verification of each separate CMS table structure and shared storage bucket.</p>
        
        {/* Bucket Status */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#0a0f1e', borderRadius: 10, border: `1.5px solid ${healthData?.storage?.exists ? '#1e3a5f' : '#ef4444'}` }} className="flex justify-between items-center w-full">
            <div>
              <div style={{ color: '#3b82f6', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', marginBottom: 2 }}>Storage Bucket</div>
              <div style={{ fontFamily: 'monospace', color: '#f1f5f9', fontSize: 13, fontWeight: 600 }}>haditech-media</div>
            </div>
            <span style={{ 
              background: healthData?.storage?.exists ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', 
              color: healthData?.storage?.exists ? '#10b981' : '#ef4444',
              fontSize: 11, 
              fontWeight: 700, 
              padding: '4px 10px', 
              borderRadius: 6,
              textTransform: 'uppercase'
            }}>
              {healthData?.storage?.exists ? (healthData?.storage?.isPublic ? '✅ Public Active' : '⚠️ Private') : '❌ Missing'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#0a0f1e', borderRadius: 10, border: `1.5px solid ${healthData?.mediaColumns?.healthy ? '#1e3a5f' : '#ef4444'}` }} className="flex justify-between items-center w-full">
            <div>
              <div style={{ color: '#3b82f6', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', marginBottom: 2 }}>Media Assets Metadata</div>
              <div style={{ color: '#f1f5f9', fontSize: 13, fontWeight: 600 }}>usage_type, page_key, alt...</div>
            </div>
            <span style={{ 
              background: healthData?.mediaColumns?.healthy ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', 
              color: healthData?.mediaColumns?.healthy ? '#10b981' : '#ef4444',
              fontSize: 11, 
              fontWeight: 700, 
              padding: '4px 10px', 
              borderRadius: 6,
              textTransform: 'uppercase'
            }}>
              {healthData?.mediaColumns?.healthy ? '✅ Operational' : '❌ Column Missing'}
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
          {healthData?.tables ? (
            Object.entries(healthData.tables).map(([table, status]) => (
              <div key={table} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#0a0f1e', borderRadius: 10, border: `1.5px solid ${status.exists ? '#1e3a5f' : '#ef4444'}` }} className="flex justify-between items-center w-full">
                <span style={{ fontFamily: 'monospace', color: '#93c5fd', fontSize: 13, fontWeight: 600 }}>{table}</span>
                <span style={{ 
                  background: status.exists ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', 
                  color: status.exists ? '#10b981' : '#ef4444',
                  fontSize: 11, 
                  fontWeight: 700, 
                  padding: '3px 8px', 
                  borderRadius: 6,
                  textTransform: 'uppercase'
                }}>
                  {status.exists ? '✅ Active' : '❌ Missing'}
                </span>
              </div>
            ))
          ) : (
            <div style={{ color: '#64748b', gridColumn: '1/-1', textAlign: 'center', padding: 20 }}>
              No schema data loaded. Add your keys to .env.local to query database.
            </div>
          )}
        </div>
      </section>

      {/* SQL Setup Panel if any tables are missing */}
      {healthData && (!healthData.healthy || !healthData.storage.exists || !healthData.mediaColumns.healthy) && sqlData && (
        <section style={{ background: '#0a0f1e', border: '2px solid #ca8a04', borderRadius: 18, padding: 28, marginBottom: 28 }}>
          <h2 style={{ color: '#fbbf24', fontSize: 18, fontWeight: 800, margin: '0 0 8px' }}>🛠️ How to Fix: Create or Repair Missing Tables</h2>
          <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.6, marginBottom: 20 }}>
            To activate all CMS operations, copy these SQL queries and execute them inside your **Supabase SQL Editor** (SQL Editor &rarr; New Query &rarr; paste code &rarr; click Run).
          </p>

          {/* 1. cms_rescue.sql */}
          <div style={{ marginBottom: 24, border: '1px solid rgba(239,68,68,0.2)', padding: 16, borderRadius: 12, background: 'rgba(239,68,68,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div>
                <span style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 13, display: 'block' }}>🚨 1️⃣ CMS Emergency Rescue SQL (`supabase/cms_rescue.sql`)</span>
                <span style={{ color: '#ef4444', fontSize: 11, fontWeight: 600 }}>👈 Run this first if any CMS tables or columns are missing! Safe to re-run.</span>
              </div>
              <button 
                onClick={() => handleCopy('rescue', sqlData.rescue)} 
                style={{ background: copyState.rescue ? '#10b981' : '#dc2626', border: 'none', borderRadius: 6, padding: '6px 12px', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
              >
                {copyState.rescue ? '✅ Copied!' : '📋 Copy Rescue SQL'}
              </button>
            </div>
            <textarea 
              readOnly 
              value={sqlData.rescue} 
              style={{ width: '100%', height: 160, background: '#030712', border: '1px solid #dc2626', borderRadius: 10, padding: 12, color: '#f87171', fontFamily: 'monospace', fontSize: 12, boxSizing: 'border-box' }}
            />
          </div>

          {/* 2. schema.sql */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div>
                <span style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 13, display: 'block' }}>2️⃣ Full Database Schema SQL (`supabase/schema.sql`)</span>
                <span style={{ color: '#64748b', fontSize: 11 }}>Complete initial schema layout for reference.</span>
              </div>
              <button 
                onClick={() => handleCopy('schema', sqlData.schema)} 
                style={{ background: copyState.schema ? '#10b981' : '#1e3a5f', border: 'none', borderRadius: 6, padding: '6px 12px', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
              >
                {copyState.schema ? '✅ Copied!' : '📋 Copy Schema SQL'}
              </button>
            </div>
            <textarea 
              readOnly 
              value={sqlData.schema} 
              style={{ width: '100%', height: 160, background: '#030712', border: '1px solid #1e3a5f', borderRadius: 10, padding: 12, color: '#10b981', fontFamily: 'monospace', fontSize: 12, boxSizing: 'border-box' }}
            />
          </div>

          {/* 3. seed_content.sql */}
          <div style={{ border: '1px solid rgba(16,185,129,0.2)', padding: 16, borderRadius: 12, background: 'rgba(16,185,129,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div>
                <span style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 13, display: 'block' }}>3️⃣ Default Seed Content SQL (`supabase/seed_content.sql`)</span>
                <span style={{ color: '#10b981', fontSize: 11, fontWeight: 600 }}>👈 Run this only AFTER the schema is green to load default CMS content!</span>
              </div>
              <button 
                onClick={() => handleCopy('seed', sqlData.seed)} 
                style={{ background: copyState.seed ? '#10b981' : '#10b981', border: 'none', borderRadius: 6, padding: '6px 12px', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
              >
                {copyState.seed ? '✅ Copied!' : '📋 Copy Seed SQL'}
              </button>
            </div>
            <textarea 
              readOnly 
              value={sqlData.seed} 
              style={{ width: '100%', height: 160, background: '#030712', border: '1px solid #10b981', borderRadius: 10, padding: 12, color: '#34d399', fontFamily: 'monospace', fontSize: 12, boxSizing: 'border-box' }}
            />
          </div>
        </section>
      )}

      {/* Environment Variables & System Checklist */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        <section style={{ background: '#0f1729', border: '1px solid #1e3a5f', borderRadius: 16, padding: 24 }}>
          <h2 style={{ color: '#f1f5f9', fontSize: 16, fontWeight: 700, margin: '0 0 16px' }}>🔑 Server Env Status</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {envChecks.map(c => (
              <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: '#0a0f1e', borderRadius: 10, border: '1px solid #1e3a5f' }}>
                <span style={{ fontSize: 16 }}>{c.ok ? '✅' : '❌'}</span>
                <code style={{ color: '#93c5fd', fontSize: 13, flex: 1 }}>{c.label}</code>
              </div>
            ))}
          </div>
        </section>

        <section style={{ background: '#0f1729', border: '1px solid #1e3a5f', borderRadius: 16, padding: 24 }}>
          <h2 style={{ color: '#f1f5f9', fontSize: 16, fontWeight: 700, margin: '0 0 16px' }}>✅ Health Checklist</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {cmsChecklist.map(c => (
              <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 10, color: c.ok ? '#94a3b8' : '#ef4444', fontSize: 13 }}>
                <span>{c.ok ? '✅' : '❌'}</span>
                <span>{c.label}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Notification Health Section */}
      <section style={{ background: '#0f1729', border: '1px solid #1e3a5f', borderRadius: 16, padding: 24, marginBottom: 24 }}>
        <h2 style={{ color: '#f1f5f9', fontSize: 16, fontWeight: 700, margin: '0 0 4px' }}>🔔 Notification Health</h2>
        <p style={{ color: '#64748b', fontSize: 13, marginBottom: 20 }}>Verify email routing (Resend) and Meta WhatsApp Cloud API credentials.</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ padding: 16, background: '#0a0f1e', borderRadius: 12, border: '1px solid #1e3a5f' }}>
              <div style={{ color: '#3b82f6', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>WhatsApp Recipient</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 13, color: '#f1f5f9' }}>Default number: <strong>{whatsappDefaultTo}</strong></span>
                {whatsappNormalized && (
                  <span style={{ fontSize: 11, color: '#10b981' }}>Normalized preview: {whatsappNormalized}</span>
                )}
              </div>
            </div>

            <div style={{ padding: 16, background: '#0a0f1e', borderRadius: 12, border: '1px solid #1e3a5f' }} className="flex justify-between items-center w-full">
              <div>
                <div style={{ color: '#3b82f6', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>Diagnostics Test</div>
                <span style={{ fontSize: 13, color: '#94a3b8' }}>Send test messages to verified contacts</span>
              </div>
              <button
                onClick={sendTestNotification}
                disabled={testLoading}
                style={{
                  background: testLoading ? '#1e293b' : '#10b981',
                  border: 'none',
                  borderRadius: 8,
                  padding: '10px 18px',
                  color: '#fff',
                  fontWeight: 600,
                  cursor: testLoading ? 'not-allowed' : 'pointer',
                  fontSize: 13
                }}
              >
                {testLoading ? '⏳ Sending...' : '✈️ Send Test Notification'}
              </button>
            </div>
          </div>

          {testError && (
            <div style={{ padding: 12, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, color: '#ef4444', fontSize: 13 }}>
              <strong>Error triggering test:</strong> {testError}
            </div>
          )}

          {testResult && (
            <div style={{ padding: 16, background: '#0a0f1e', borderRadius: 12, border: '1px solid #1e3a5f' }}>
              <h3 style={{ margin: '0 0 12px', fontSize: 14, color: '#f1f5f9', fontWeight: 600 }}>Test Delivery Results:</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                {/* Lead Storage */}
                <div style={{ padding: 12, background: testResult.leadStorage?.ok ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)', border: `1px solid ${testResult.leadStorage?.ok ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`, borderRadius: 10 }}>
                  <div style={{ fontWeight: 700, color: testResult.leadStorage?.ok ? '#10b981' : '#ef4444', fontSize: 13 }}>
                    {testResult.leadStorage?.ok ? '✅ contact_leads: OK' : '❌ contact_leads: FAIL'}
                  </div>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>{testResult.leadStorage?.reason || ''}</div>
                </div>
                {/* Newsletter Storage */}
                <div style={{ padding: 12, background: testResult.newsletterStorage?.ok ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)', border: `1px solid ${testResult.newsletterStorage?.ok ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`, borderRadius: 10 }}>
                  <div style={{ fontWeight: 700, color: testResult.newsletterStorage?.ok ? '#10b981' : '#ef4444', fontSize: 13 }}>
                    {testResult.newsletterStorage?.ok ? '✅ newsletter_subscribers: OK' : '❌ newsletter_subscribers: FAIL'}
                  </div>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>{testResult.newsletterStorage?.reason || ''}</div>
                </div>
                {/* Email */}
                <div style={{ padding: 12, background: testResult.email?.ok ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)', border: `1px solid ${testResult.email?.ok ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`, borderRadius: 10 }}>
                  <div style={{ fontWeight: 700, color: testResult.email?.ok ? '#10b981' : '#ef4444', fontSize: 13 }}>
                    {testResult.email?.ok ? '✅ Email: Sent' : '❌ Email: Failed'}
                  </div>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>
                    {testResult.email?.ok ? 'Admin notification dispatched.' : `Reason: ${testResult.email?.reason || 'Unknown'}`}
                  </div>
                </div>
                {/* WhatsApp */}
                <div style={{ padding: 12, background: testResult.whatsapp?.ok ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)', border: `1px solid ${testResult.whatsapp?.ok ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`, borderRadius: 10 }}>
                  <div style={{ fontWeight: 700, color: testResult.whatsapp?.ok ? '#10b981' : '#ef4444', fontSize: 13 }}>
                    {testResult.whatsapp?.ok ? '✅ WhatsApp: Sent' : '❌ WhatsApp: Failed'}
                  </div>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>
                    {testResult.whatsapp?.ok ? 'Meta API message sent.' : `Reason: ${testResult.whatsapp?.reason || 'Unknown'}${testResult.whatsapp?.providerStatus ? ` | HTTP ${testResult.whatsapp.providerStatus}` : ''}`}
                  </div>
                </div>
              </div>
              {/* Env summary */}
              {testResult.env && (
                <div style={{ marginTop: 8, padding: 12, background: '#030712', borderRadius: 8, border: '1px solid #1e3a5f' }}>
                  <div style={{ color: '#64748b', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>Env Keys (set/missing only)</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 4 }}>
                    {Object.entries(testResult.env).map(([k, v]) => (
                      <div key={k} style={{ fontFamily: 'monospace', fontSize: 11, color: v === 'set' ? '#10b981' : v === 'placeholder' ? '#f59e0b' : '#ef4444' }}>
                        {v === 'set' ? '✅' : v === 'placeholder' ? '⚠️' : '❌'} {k}: {String(v)}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <section style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 16, padding: 24 }}>
        <h2 style={{ color: '#93c5fd', fontSize: 16, fontWeight: 700, margin: '0 0 12px' }}>🛡️ Security & Read-Only Policy</h2>
        <ul style={{ color: '#64748b', fontSize: 13, lineHeight: 1.8, margin: 0, paddingLeft: 20 }}>
          <li>Admin password and session checks are verified <strong style={{ color: '#94a3b8' }}>server-side only</strong>.</li>
          <li>All Admin write operations target <strong style={{ color: '#94a3b8' }}>Supabase PostgreSQL exclusively</strong>.</li>
          <li>Local source code files (`src/lib/data.ts`) are **never modified at runtime** by Admin APIs.</li>
          <li>Static fallback files (`src/lib/data.ts`) are only read as an offline read-only backup.</li>
        </ul>
      </section>
    </div>
  )
}
