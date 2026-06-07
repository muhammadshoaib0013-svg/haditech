'use client'
import React from 'react'
import { AdminCard } from '@/lib/admin-utils'

export default function ProductionCMSPage() {
  return (
    <div style={{ padding: '36px 40px', maxWidth: 960, margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ color: '#f1f5f9', fontSize: 24, fontWeight: 700, margin: 0 }}>
          🚀 HADITECH Production CMS Roadmap
        </h1>
        <p style={{ color: '#64748b', fontSize: 13, marginTop: 8, lineHeight: 1.6 }}>
          Plan for migrating from local filesystem file-writing (<code style={{ background: '#1a2744', padding: '1px 5px', borderRadius: 4 }}>fs</code>) 
          to a secure, cloud-hosted production content management system (CMS).
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        
        {/* Why this is needed */}
        <AdminCard title="⚠️ Why is this migration required?" color="#f59e0b">
          <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.6, margin: '0 0 12px' }}>
            The current admin dashboard uses Node's filesystem module (<code style={{ background: '#131d35', padding: '2px 5px', borderRadius: 4, color: '#f59e0b' }}>fs</code>) 
            to write directly to <code style={{ background: '#131d35', padding: '2px 5px', borderRadius: 4, color: '#f59e0b' }}>src/lib/data.ts</code>.
            While this is excellent for zero-overhead local development, modern hosting providers (Vercel, Netlify, AWS Amplify):
          </p>
          <ul style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.8, paddingLeft: 20, margin: 0 }}>
            <li>Possess <strong>read-only filesystems</strong> in production serverless runtimes.</li>
            <li>Use ephemeral containers that spin down, resetting any filesystem writes.</li>
            <li>Do not persist changes across standard git deployments.</li>
          </ul>
        </AdminCard>

        {/* Option 1: Supabase */}
        <AdminCard title="Option A: Supabase (PostgreSQL Database) — RECOMMENDED" color="#10b981">
          <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.6, margin: '0 0 12px' }}>
            Supabase is an open-source Firebase alternative based on PostgreSQL. It is highly recommended for HADITECH since it offers robust relational tables, instant REST APIs, and simple Row Level Security (RLS).
          </p>
          <div style={{ background: '#0a1628', borderRadius: 8, padding: 14, marginBottom: 12 }}>
            <h4 style={{ color: '#f1f5f9', margin: '0 0 6px', fontSize: 12 }}>🛠️ Steps to Implement:</h4>
            <ol style={{ color: '#64748b', fontSize: 12, lineHeight: 1.7, paddingLeft: 18, margin: 0 }}>
              <li>Create a free account on <a href="https://supabase.com" target="_blank" rel="noreferrer" style={{ color: '#10b981', textDecoration: 'none' }}>Supabase.com</a> and setup a database instance.</li>
              <li>Create tables matching our schemas: <code style={{ color: '#10b981' }}>projects</code>, <code style={{ color: '#10b981' }}>testimonials</code>, <code style={{ color: '#10b981' }}>services</code>, and <code style={{ color: '#10b981' }}>videos</code>.</li>
              <li>Install the Supabase client: <code style={{ color: '#10b981', background: '#131d35', padding: '1px 4px', borderRadius: 3 }}>npm install @supabase/supabase-js</code>.</li>
              <li>Configure Server Actions or Route handlers to query data directly from Supabase instead of importing static objects from <code style={{ color: '#10b981' }}>data.ts</code>.</li>
              <li>Configure RLS policies so only users authenticated with our admin password can insert/update/delete rows.</li>
            </ol>
          </div>
        </AdminCard>

        {/* Option 2: Sanity.io */}
        <AdminCard title="Option B: Sanity.io (Headless API CMS)" color="#3b82f6">
          <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.6, margin: '0 0 12px' }}>
            Sanity.io is a unified content platform that provides a beautiful, customizable studio interface for managing articles, case studies, and services.
          </p>
          <div style={{ background: '#0a1628', borderRadius: 8, padding: 14, marginBottom: 12 }}>
            <h4 style={{ color: '#f1f5f9', margin: '0 0 6px', fontSize: 12 }}>🛠️ Steps to Implement:</h4>
            <ol style={{ color: '#64748b', fontSize: 12, lineHeight: 1.7, paddingLeft: 18, margin: 0 }}>
              <li>Initialize Sanity in the project using: <code style={{ color: '#3b82f6', background: '#131d35', padding: '1px 4px', borderRadius: 3 }}>npx sanity@latest init</code>.</li>
              <li>Define schemas in the sanity schema folder for projects, services, videos, and testimonials.</li>
              <li>Use the Sanity Studio (deployed separately or hosted on sanity.work) as the user-facing admin portal.</li>
              <li>Fetch content dynamically using the Sanity client and GROQ queries: <code style={{ color: '#3b82f6', background: '#131d35', padding: '1px 4px', borderRadius: 3 }}>client.fetch(...)</code>.</li>
            </ol>
          </div>
        </AdminCard>

        {/* Option 3: Resend & Twilio Integration for Lead Routing */}
        <AdminCard title="📩 Production Lead-Routing Setup" color="#8b5cf6">
          <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.6, margin: '0 0 12px' }}>
            For contact forms and lead capture, the current system supports Resend emails and Twilio WhatsApp alerts.
            In production, ensure these environment variables are added to your hosting panel (e.g. Vercel dashboard):
          </p>
          <ul style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.7, paddingLeft: 18, margin: 0 }}>
            <li><code style={{ color: '#8b5cf6' }}>RESEND_API_KEY</code> — for routing inquiries to your professional email.</li>
            <li><code style={{ color: '#8b5cf6' }}>TWILIO_ACCOUNT_SID</code>, <code style={{ color: '#8b5cf6' }}>TWILIO_AUTH_TOKEN</code>, <code style={{ color: '#8b5cf6' }}>TWILIO_WHATSAPP_NUMBER</code> — for driving WhatsApp alerts.</li>
          </ul>
        </AdminCard>

      </div>
    </div>
  )
}
