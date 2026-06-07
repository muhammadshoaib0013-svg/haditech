import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ProjectThumbnail } from './ProjectThumbnail';

interface ProjectCardProps {
  project: any;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const visibleTags = project.stack.slice(0, 4);
  const overflowCount = project.stack.length - 4;

  return (
    <Link href={`/portfolio/${project.slug}`} className="block group h-full">
      <div className="relative flex flex-col h-full bg-card border border-border rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:border-primary/50">
        
        {/* Thumbnail Section */}
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          <ProjectThumbnail 
            title={project.title} 
            imageSrc={project.screenshots?.[0]} 
            videoSrc={project.thumbnailType === 'video-placeholder' ? "true" : undefined} 
          />
          
          {/* Result Metric Badge */}
          {project.result && (
            <div className="absolute top-4 left-4 px-3 py-1 bg-success text-success-foreground text-xs font-bold rounded-full shadow-lg z-10">
              {project.result}
            </div>
          )}

          {/* Hover Overlay: "View case study ->" */}
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
            <span className="flex items-center gap-2 text-primary font-bold text-lg">
              View case study <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 flex flex-col flex-1 gap-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                {project.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {project.description}
              </p>
            </div>
          </div>

          <div className="mt-auto pt-4 flex flex-wrap gap-2">
            {visibleTags.map((tag: string) => (
              <span key={tag} className="px-2 py-1 bg-muted text-muted-foreground text-[10px] font-semibold uppercase tracking-wider rounded-md border border-border/50">
                {tag}
              </span>
            ))}
            {overflowCount > 0 && (
              <span className="px-2 py-1 bg-muted/50 text-muted-foreground text-[10px] font-semibold uppercase tracking-wider rounded-md border border-border/50">
                +{overflowCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};
