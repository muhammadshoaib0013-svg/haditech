import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ProjectThumbnail } from './ProjectThumbnail';

interface ProjectCardProps {
  project: any;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const visibleTags = (project.stack || []).slice(0, 4);
  const overflowCount = (project.stack || []).length - 4;

  return (
    <Link href={`/portfolio/${project.slug}`} className="block group h-full">
      <div className="relative flex flex-col h-full bg-card border border-border rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary/40">

        {/* Thumbnail — NO text overlays */}
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          <ProjectThumbnail
            title={project.title}
            imageSrc={project.screenshots?.[0]}
          />

          {/* Hover Overlay: clean CTA only */}
          <div className="absolute inset-0 bg-slate-950/55 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
            <span className="flex items-center gap-2 text-white font-bold text-xs bg-primary px-5 py-2.5 rounded-full shadow-md transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
              View Case Study <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 flex flex-col flex-1 gap-3">

          {/* Category chip */}
          {project.category && (
            <span className="badge-category self-start">{project.category}</span>
          )}

          <div>
            <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2">
              {project.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Tech chips */}
          <div className="mt-auto pt-3 border-t border-border/60 flex flex-wrap gap-1.5">
            {visibleTags.map((tag: string) => (
              <span key={tag} className="tech-chip">{tag}</span>
            ))}
            {overflowCount > 0 && (
              <span className="tech-chip opacity-60">+{overflowCount}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};
