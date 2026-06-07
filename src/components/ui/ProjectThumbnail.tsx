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
        <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50" />
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
