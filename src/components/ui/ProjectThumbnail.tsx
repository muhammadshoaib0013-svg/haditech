import React from 'react';
import Image from 'next/image';
import { Play } from 'lucide-react';
import { imagePlaceholders } from '@/lib/image-placeholders';

interface ProjectThumbnailProps {
  title: string;
  imageSrc?: string;
  videoSrc?: string; // Future proofing
  priority?: boolean;
}

export const ProjectThumbnail = ({ title, imageSrc, videoSrc, priority = false }: ProjectThumbnailProps) => {
  const isVideo = !!videoSrc;
  // Use pre-generated base64 blurDataURL if the image is in public directory
  const blurDataURL = imageSrc ? imagePlaceholders[imageSrc] : undefined;
  
  return (
    <div className="relative w-full h-full bg-muted overflow-hidden flex items-center justify-center">
      {imageSrc ? (
        <Image 
          src={imageSrc} 
          alt={title}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          placeholder={blurDataURL ? "blur" : "empty"}
          blurDataURL={blurDataURL}
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 border border-primary/10 flex items-center justify-center p-6 relative overflow-hidden select-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:16px_16px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />
          <div className="flex flex-col items-center gap-2 relative z-10 text-center">
            <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs shadow-sm">
              {title.substring(0, 2).toUpperCase()}
            </div>
            <span className="text-sm font-extrabold tracking-tight font-heading text-white max-w-[180px]">
              {title}
            </span>
          </div>
        </div>
      )}
      
      {/* Video Overlay */}
      {isVideo && (
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 group-hover:scale-110 transition-transform">
            <Play fill="currentColor" size={20} className="ml-1" />
          </div>
        </div>
      )}
    </div>
  );
};
