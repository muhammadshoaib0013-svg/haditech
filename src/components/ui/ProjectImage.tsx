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
        className={`flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 border border-primary/10 text-white p-6 relative overflow-hidden group/img select-none ${className ?? ''}`}
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40" />
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
        <div className="flex flex-col items-center gap-3 relative z-10 text-center">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm tracking-wide shadow-sm">
            {title.substring(0, 2).toUpperCase()}
          </div>
          <span className="text-sm md:text-base font-extrabold tracking-tight font-heading drop-shadow-md max-w-[220px]">
            {title}
          </span>
          <span className="text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-400 border border-slate-700/50">
            Case Study
          </span>
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
