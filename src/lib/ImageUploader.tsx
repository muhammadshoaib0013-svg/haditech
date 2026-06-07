'use client'
import { useRef, useState } from 'react'

interface Props {
  label:    string
  value:    string
  onChange: (path: string) => void
  folder?:  string
  accent?:  string
  hint?:    string
}

export default function ImageUploader({
  label, value, onChange,
  folder = 'projects',
  accent = '#3b82f6',
  hint,
}: Props) {
  const PW       = typeof window !== 'undefined' ? sessionStorage.getItem('haditech_admin') || '' : ''
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error,     setError]     = useState('')
  const [preview,   setPreview]   = useState(value || '')

  async function handleFile(file: File) {
    setUploading(true)
    setError('')
    try {
      const fd = new FormData()
      fd.append('file',   file)
      fd.append('folder', folder)

      const res  = await fetch('/api/admin/upload', {
        method:  'POST',
        headers: { 'x-admin-pw': PW },
        body:    fd,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')

      setPreview(data.path)
      onChange(data.path)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setUploading(false)
    }
  }

  function onDrop(ev: React.DragEvent) {
    ev.preventDefault()
    const file = ev.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  function onPaste(ev: React.ClipboardEvent) {
    const file = ev.clipboardData.files[0]
    if (file) handleFile(file)
  }

  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{
        color: '#94a3b8', fontSize: 12, fontWeight: 600,
        display: 'block', marginBottom: hint ? 4 : 8,
      }}>
        {label}
      </label>
      {hint && (
        <p style={{ color: '#475569', fontSize: 11, marginBottom: 8, lineHeight: 1.5 }}>
          {hint}
        </p>
      )}

      {/* Drop / Paste / Click zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={onDrop}
        onDragOver={e => e.preventDefault()}
        onPaste={onPaste}
        tabIndex={0}
        style={{
          border:        `2px dashed ${uploading ? accent : '#1e3a5f'}`,
          borderRadius:  10,
          padding:       preview ? '10px' : '28px 16px',
          textAlign:     'center',
          cursor:        'pointer',
          background:    '#131d35',
          transition:    'border-color .2s',
          position:      'relative',
        }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = accent)}
        onMouseLeave={e => (e.currentTarget.style.borderColor = uploading ? accent : '#1e3a5f')}
      >
        {uploading ? (
          <div style={{ color: accent, fontSize: 13 }}>
            ⏳ Upload ho raha hai...
          </div>
        ) : preview ? (
          <div>
            <img
              src={preview}
              alt="preview"
              style={{
                width: '100%', maxHeight: 160,
                objectFit: 'cover', borderRadius: 8,
                display: 'block',
              }}
              onError={() => setPreview('')}
            />
            <div style={{
              color: '#475569', fontSize: 11, marginTop: 6,
            }}>
              Click, drag, or paste to replace
            </div>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: 28, marginBottom: 8 }}>🖼️</div>
            <div style={{ color: '#94a3b8', fontSize: 13, fontWeight: 500 }}>
              Click karo, Drag karo, ya Paste karo
            </div>
            <div style={{ color: '#334155', fontSize: 11, marginTop: 4 }}>
              JPG · PNG · WebP · max 2MB
            </div>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          style={{ display: 'none' }}
          onChange={e => {
            const f = e.target.files?.[0]
            if (f) handleFile(f)
          }}
        />
      </div>

      {/* Path display */}
      {value && !uploading && (
        <div style={{
          marginTop:    6,
          padding:      '6px 10px',
          background:   '#0a1628',
          borderRadius: 6,
          color:        '#10b981',
          fontSize:     11,
          fontFamily:   'monospace',
          wordBreak:    'break-all',
        }}>
          ✅ {value}
        </div>
      )}

      {error && (
        <div style={{
          marginTop:  6,
          color:      '#ef4444',
          fontSize:   11,
          padding:    '6px 10px',
          background: 'rgba(239,68,68,0.1)',
          borderRadius: 6,
        }}>
          ❌ {error}
        </div>
      )}
    </div>
  )
}
