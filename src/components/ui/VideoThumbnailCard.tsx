import React from 'react';
import { Play } from 'lucide-react';
import { ProjectThumbnail } from './ProjectThumbnail';

interface VideoCardProps {
  title: string;
  duration: string;
  imageSrc?: string;
  platform?: string;
  url?: string;
}

export const VideoThumbnailCard = ({ title, duration, imageSrc, platform, url = '#' }: VideoCardProps) => {
  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="group relative flex flex-col h-full bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 cursor-pointer"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-muted flex items-center justify-center">
        {imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageSrc} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <ProjectThumbnail title={title} videoSrc="true" />
        )}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center text-primary-foreground transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <Play fill="currentColor" size={24} className="ml-1" />
          </div>
        </div>
        <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/80 text-white text-xs font-bold rounded">
          {duration}
        </div>
      </div>
      <div className="p-5 flex flex-col gap-2 flex-1">
        <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">{title}</h3>
        {platform && <p className="text-muted-foreground text-sm mt-auto">{platform}</p>}
      </div>
    </a>
  );
};
