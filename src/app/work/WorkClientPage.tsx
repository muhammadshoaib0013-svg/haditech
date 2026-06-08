'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { SearchInput } from '@/components/ui/SearchInput'
import { FilterPills } from '@/components/ui/FilterPills'
import { FadeInSection } from '@/components/animations/FadeInSection'
import ProjectImage from '@/components/ui/ProjectImage'
import { getProjectPrimaryImage } from '@/lib/project-image-utils'
import type { DbProject } from '@/lib/supabase/content'

interface Props { projects: DbProject[] }

export default function WorkClientPage({ projects }: Props) {
  const categories = ['All', ...Array.from(new Set(projects.map(p => p.category).filter(Boolean)))]
  const [activeFilter, setActiveFilter] = useState('All')
  const [search, setSearch] = useState('')

  const filtered = projects.filter(p => {
    const matchCategory = activeFilter === 'All' || p.category === activeFilter
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase())
    return matchCategory && matchSearch
  })

  return (
    <div className="flex flex-col gap-8 pb-12">
      <FadeInSection>
        <SectionHeader badge="Portfolio" title="Our Work" subtitle="Explore the latest platforms, dashboards, and systems we've shipped." />
      </FadeInSection>

      <FadeInSection delay={0.1}>
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card p-4 rounded-2xl border border-border shadow-sm">
          <FilterPills options={categories} active={activeFilter} onChange={setActiveFilter} />
          <div className="w-full md:w-64 shrink-0">
            <SearchInput placeholder="Search projects..." value={search} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)} />
          </div>
        </div>
      </FadeInSection>

      <FadeInSection delay={0.2}>
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg font-semibold">No projects found.</p>
            <p className="text-sm mt-2">Try a different filter or add projects in the Admin Panel.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((proj, i) => {
              const heroImg = getProjectPrimaryImage(proj)
              return (
                <Link key={proj.id || i} href={`/projects/${proj.slug}`} className="block group h-full">
                  <div className="relative flex flex-col h-full bg-card border border-border rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary/40">

                    {/* Thumbnail — zero text overlays */}
                    <div className="relative aspect-video w-full overflow-hidden bg-muted">
                      <ProjectImage
                        src={heroImg}
                        title={proj.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Hover overlay: clean CTA only */}
                      <div className="absolute inset-0 bg-slate-950/55 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
                        <span className="flex items-center gap-2 text-white font-bold text-xs bg-primary px-5 py-2.5 rounded-full shadow-md transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                          View Case Study <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 flex flex-col flex-1 gap-3">
                      {/* Category chip */}
                      {proj.category && (
                        <span className="badge-category self-start">{proj.category}</span>
                      )}
                      <div>
                        <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2">
                          {proj.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
                          {proj.description}
                        </p>
                      </div>
                      {/* Tech chips */}
                      <div className="mt-auto pt-3 border-t border-border/60 flex flex-wrap gap-1.5">
                        {(proj.stack || []).slice(0, 4).map((tag: string) => (
                          <span key={tag} className="tech-chip">{tag}</span>
                        ))}
                        {(proj.stack || []).length > 4 && (
                          <span className="tech-chip opacity-60">+{(proj.stack || []).length - 4}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </FadeInSection>
    </div>
  )
}
