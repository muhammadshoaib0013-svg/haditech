'use client'
import { useState, useEffect, useRef, useCallback } from 'react'

interface MediaAsset {
  id: string
  file_name: string
  file_url: string
  file_type: string
  bucket_path: string
  size: number
  created_at: string
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes}B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`
}

export default function MediaLibraryPage() {
  const [assets, setAssets] = useState<MediaAsset[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<MediaAsset | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [supabaseConfigured, setSupabaseConfigured] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchAssets = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/media/list')
      const json = await res.json()
      if (res.status === 503 || (json.error && json.error.includes('Supabase is not configured'))) {
        setSupabaseConfigured(false)
        setError(json.error)
        setLoading(false)
        return
      }
      if (json.data) {
        setAssets(json.data)
        setSupabaseConfigured(true)
      } else {
        setError(json.error || 'Failed to load media')
      }
    } catch {
      setError('Failed to connect to server')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAssets() }, [fetchAssets])

  async function uploadFile(file: File) {
    if (!supabaseConfigured) return
    setUploading(true)
    setError('')
    setSuccess('')
    const formData = new FormData()
    formData.append('file', file)
    try {
      const res = await fetch('/api/admin/media/upload', { method: 'POST', body: formData })
      const json = await res.json()
      if (!res.ok) { setError(json.error || 'Upload failed'); return }
      setSuccess(`✅ "${file.name}" uploaded successfully!`)
      fetchAssets()
    } catch {
      setError('Upload failed — check your Supabase connection')
    } finally {
      setUploading(false)
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!supabaseConfigured) return
    const file = e.target.files?.[0]
    if (file) uploadFile(file)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    if (!supabaseConfigured) return
    const file = e.dataTransfer.files?.[0]
    if (file) uploadFile(file)
  }

  async function handleDelete(asset: MediaAsset) {
    if (!supabaseConfigured) return
    setDeletingId(asset.id)
    setConfirmDelete(null)
    try {
      const res = await fetch('/api/admin/media/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: asset.id, bucketPath: asset.bucket_path }),
      })
      const json = await res.json()
      if (!res.ok) { setError(json.error || 'Delete failed'); return }
      setSuccess('🗑️ File deleted successfully')
      setAssets(prev => prev.filter(a => a.id !== asset.id))
    } catch {
      setError('Delete failed')
    } finally {
      setDeletingId(null)
    }
  }

  async function copyUrl(asset: MediaAsset) {
    await navigator.clipboard.writeText(asset.file_url)
    setCopiedId(asset.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const s: Record<string, React.CSSProperties> = {
    page: { padding: 32, maxWidth: 1200, margin: '0 auto' },
    heading: { color: '#f1f5f9', fontSize: 24, fontWeight: 800, margin: 0 },
    sub: { color: '#64748b', fontSize: 14, marginTop: 6 },
    uploadZone: {
      border: `2px dashed ${!supabaseConfigured ? '#1e293b' : dragOver ? '#3b82f6' : '#1e3a5f'}`,
      borderRadius: 16, padding: '40px 24px', textAlign: 'center',
      background: !supabaseConfigured ? 'rgba(30,58,95,0.02)' : dragOver ? 'rgba(59,130,246,0.08)' : 'rgba(30,58,95,0.15)',
      cursor: !supabaseConfigured || uploading ? 'not-allowed' : 'pointer',
      transition: 'all 0.2s', marginBottom: 28,
      opacity: !supabaseConfigured ? 0.5 : 1,
    },
    btn: {
      padding: '10px 20px', borderRadius: 10, border: 'none',
      fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
    },
    primaryBtn: {
      background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)',
      color: 'white', boxShadow: '0 4px 16px rgba(59,130,246,0.3)',
    },
    dangerBtn: { background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' },
    card: {
      background: '#0f1729', border: '1px solid #1e3a5f',
      borderRadius: 14, overflow: 'hidden', position: 'relative',
    },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 16 },
  }

  return (
    <div style={s.page}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={s.heading}>🖼️ Media Library</h1>
        <p style={s.sub}>Upload images and thumbnails. Click any file to copy its public URL.</p>
      </div>

      {/* Connection warning banner if Supabase not configured */}
      {!supabaseConfigured && (
        <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 12, padding: '20px 24px', marginBottom: 28 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 24 }}>⚠️</span>
            <div>
              <h3 style={{ color: '#ef4444', margin: '0 0 6px', fontSize: 15, fontWeight: 700 }}>Supabase Connection Inactive</h3>
              <p style={{ color: '#94a3b8', margin: 0, fontSize: 13, lineHeight: 1.6 }}>
                The application requires configured Supabase connection keys to list, upload or manage media. Please add <code>NEXT_PUBLIC_SUPABASE_URL</code>, <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, and <code>SUPABASE_SERVICE_ROLE_KEY</code> inside your <code>.env.local</code> file and restart the server.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Status messages */}
      {error && supabaseConfigured && (
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '12px 16px', marginBottom: 20, color: '#ef4444', fontSize: 13 }}>
          ❌ {error} <button onClick={() => setError('')} style={{ marginLeft: 12, background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>✕</button>
        </div>
      )}
      {success && (
        <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 10, padding: '12px 16px', marginBottom: 20, color: '#10b981', fontSize: 13 }}>
          {success} <button onClick={() => setSuccess('')} style={{ marginLeft: 12, background: 'none', border: 'none', color: '#10b981', cursor: 'pointer' }}>✕</button>
        </div>
      )}

      {/* Upload Zone */}
      <div
        style={s.uploadZone}
        onClick={() => supabaseConfigured && !uploading && fileInputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); if (supabaseConfigured) setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} disabled={!supabaseConfigured} />
        {uploading ? (
          <>
            <div style={{ fontSize: 36, marginBottom: 12 }}>⏳</div>
            <div style={{ color: '#93c5fd', fontWeight: 600 }}>Uploading to Supabase...</div>
          </>
        ) : (
          <>
            <div style={{ fontSize: 36, marginBottom: 12 }}>📤</div>
            <div style={{ color: '#93c5fd', fontWeight: 600, fontSize: 15 }}>
              {!supabaseConfigured ? 'Upload disabled — connection inactive' : dragOver ? 'Drop to upload' : 'Click or drag-and-drop to upload'}
            </div>
            <div style={{ color: '#475569', fontSize: 12, marginTop: 6 }}>
              Allowed image formats: JPG, JPEG, PNG, WebP, GIF, SVG. Max size: 10MB.
            </div>
            <button style={{ ...s.btn, ...s.primaryBtn, marginTop: 16, pointerEvents: 'none', opacity: !supabaseConfigured ? 0.5 : 1 }}>
              Choose File
            </button>
          </>
        )}
      </div>

      {/* Media Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 48, color: '#475569' }}>⏳ Loading media library...</div>
      ) : !supabaseConfigured ? (
        <div style={{ textAlign: 'center', padding: 48, color: '#475569', border: '1px dashed #1e293b', borderRadius: 16 }}>
          Supabase is not configured. Media database contents cannot be loaded.
        </div>
      ) : assets.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 64, color: '#334155', border: '1px dashed #1e3a5f', borderRadius: 16 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>No media files yet</div>
          <div style={{ fontSize: 13, marginTop: 6 }}>Upload your first image above</div>
        </div>
      ) : (
        <>
          <div style={{ color: '#475569', fontSize: 13, marginBottom: 16 }}>
            {assets.length} file{assets.length !== 1 ? 's' : ''} in library
          </div>
          <div style={s.grid}>
            {assets.map(asset => (
              <div key={asset.id} style={s.card}>
                {/* Preview */}
                <div style={{ height: 160, background: '#1a2744', overflow: 'hidden', position: 'relative' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={asset.file_url}
                    alt={asset.file_name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                </div>
                {/* Info */}
                <div style={{ padding: '12px 14px' }}>
                  <div style={{ color: '#e2e8f0', fontSize: 12, fontWeight: 600, marginBottom: 4, wordBreak: 'break-all', lineHeight: 1.4 }}>
                    {asset.file_name}
                  </div>
                  <div style={{ color: '#475569', fontSize: 11, marginBottom: 12 }}>
                    {formatSize(asset.size)} • {new Date(asset.created_at).toLocaleDateString()}
                  </div>
                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => copyUrl(asset)}
                      style={{
                        ...s.btn, flex: 1, padding: '8px 10px', fontSize: 12,
                        background: copiedId === asset.id ? 'rgba(16,185,129,0.2)' : 'rgba(59,130,246,0.15)',
                        color: copiedId === asset.id ? '#10b981' : '#93c5fd',
                        border: `1px solid ${copiedId === asset.id ? 'rgba(16,185,129,0.4)' : 'rgba(59,130,246,0.3)'}`,
                      }}
                    >
                      {copiedId === asset.id ? '✅ Copied!' : '📋 Copy URL'}
                    </button>
                    <button
                      onClick={() => setConfirmDelete(asset)}
                      disabled={deletingId === asset.id}
                      style={{ ...s.btn, ...s.dangerBtn, padding: '8px 10px', fontSize: 12 }}
                    >
                      {deletingId === asset.id ? '...' : '🗑️'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50,
        }}>
          <div style={{
            background: '#0f1729', border: '1px solid #1e3a5f', borderRadius: 16,
            padding: 32, maxWidth: 400, width: '90%',
          }}>
            <h3 style={{ color: '#f1f5f9', margin: '0 0 12px' }}>Delete File?</h3>
            <p style={{ color: '#64748b', fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
              Are you sure you want to delete <strong style={{ color: '#e2e8f0' }}>{confirmDelete.file_name}</strong>? This cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setConfirmDelete(null)} style={{ ...s.btn, flex: 1, background: '#1a2744', color: '#94a3b8', border: '1px solid #1e3a5f' }}>
                Cancel
              </button>
              <button onClick={() => handleDelete(confirmDelete)} style={{ ...s.btn, ...s.dangerBtn, flex: 1 }}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
