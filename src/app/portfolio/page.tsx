"use client";
import React, { useState } from 'react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SearchInput } from '@/components/ui/SearchInput';
import { FilterPills } from '@/components/ui/FilterPills';
import { ProjectCard } from '@/components/ui/ProjectCard';
import { FadeInSection } from '@/components/animations/FadeInSection';
import { TestimonialCard } from '@/components/ui/TestimonialCard';
import { projects, testimonials } from '@/lib/data';

const categories = ["All", ...Array.from(new Set(projects.map(p => p.category)))];

export default function PortfolioPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filteredProjects = projects.filter(p => {
    const matchCategory = activeFilter === "All" || p.category === activeFilter;
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="flex flex-col gap-8 pb-12">
      <FadeInSection>
        <SectionHeader 
          badge="Portfolio" 
          title="Our Selected Works" 
          subtitle="Explore the latest premium platforms, dashboards, and automated systems we've shipped." 
        />
      </FadeInSection>

      <FadeInSection delay={0.1}>
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-card/30 p-4 rounded-2xl border border-border backdrop-blur-sm">
          <FilterPills 
            options={categories} 
            active={activeFilter} 
            onChange={setActiveFilter} 
          />
          <div className="w-full md:w-64 shrink-0">
            <SearchInput placeholder="Search projects..." value={search} onChange={(e: any) => setSearch(e.target.value)} />
          </div>
        </div>
      </FadeInSection>

      <FadeInSection delay={0.2}>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((proj, i) => {
            const projectTestimonial = testimonials.find(t => t.projectId === proj.slug);
            
            return (
              <div key={i} className="flex flex-col gap-4">
                <div className="flex-1">
                  {/* We will construct ProjectCard with slug leading to /portfolio/[slug] */}
                  <ProjectCard project={{ ...proj, slug: proj.slug }} />
                </div>
                {projectTestimonial && (
                  <div className="mt-auto pt-2">
                    <TestimonialCard 
                      {...projectTestimonial}
                      variant="compact"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </FadeInSection>
    </div>
  );
}
