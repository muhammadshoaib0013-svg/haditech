"use client";
import React, { useState } from 'react';
import { isImageUrl, isYouTubeUrl } from '@/lib/project-image-utils';

// Re-export shared utilities so existing callers that import from here still work
export { isImageUrl, isYouTubeUrl, normalizeScreenshots, getProjectPrimaryImage } from '@/lib/project-image-utils';

// ─── Component ───────────────────────────────────────────────────────────────

interface ProjectImageProps {
  src?: string | null;
  title: string;
  className?: string;
}

export default function ProjectImage({ src, title, className }: ProjectImageProps) {
  const [failed, setFailed] = useState(false);

  // Lenient check to avoid preemptively rejecting valid/dynamic URLs (like Supabase storage endpoints)
  const isYouTube = src ? (src.includes('youtube.com/watch') || src.includes('youtu.be/') || src.includes('youtube.com/embed')) : false;
  
  const isLikelyImage = src ? (
    src.startsWith('/') ||
    src.startsWith('data:') ||
    src.startsWith('blob:') ||
    src.includes('/storage/v1/object/public/') ||
    src.includes('.supabase.co') ||
    isImageUrl(src)
  ) : false;

  const showFallback = !src || isYouTube || !isLikelyImage || failed;

  if (showFallback) {
    return (
      <div
        className={`flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-600/30 via-slate-900 to-slate-950 text-white p-4 text-center ${className ?? ''}`}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm font-semibold tracking-wide drop-shadow-md select-none">
            {title}
          </span>
          <span className="text-xs text-white/40 select-none">No preview image</span>
        </div>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={title}
      onError={() => setFailed(true)}
      className={`${className ?? ''} object-cover`}
    />
  );
}
