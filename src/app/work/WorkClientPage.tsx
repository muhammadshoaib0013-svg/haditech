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
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-card/30 p-4 rounded-2xl border border-border backdrop-blur-sm">
          <FilterPills options={categories} active={activeFilter} onChange={setActiveFilter} />
          <div className="w-full md:w-64 shrink-0">
            <SearchInput placeholder="Search projects..." value={search} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)} />
          </div>
        </div>
      </FadeInSection>

      <FadeInSection delay={0.2}>
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg font-medium">No projects found.</p>
            <p className="text-sm mt-2">Try a different filter or add projects in the Admin Panel.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((proj, i) => {
              const heroImg = getProjectPrimaryImage(proj)
              return (
                <Link key={proj.id || i} href={`/projects/${proj.slug}`} className="block group h-full">
                  <div className="relative flex flex-col h-full bg-card border border-border rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:border-primary/50">
                    <div className="relative aspect-video w-full overflow-hidden bg-muted">
                      <ProjectImage
                        src={heroImg}
                        title={proj.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {proj.result && (
                        <div className="absolute top-4 left-4 px-3 py-1 bg-success text-success-foreground text-xs font-bold rounded-full shadow-lg z-10">
                          {proj.result}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
                        <span className="flex items-center gap-2 text-primary font-bold text-lg">
                          View case study <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-1 gap-4">
                      <div>
                        <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">{proj.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{proj.description}</p>
                      </div>
                      <div className="mt-auto pt-4 flex flex-wrap gap-2">
                        {(proj.stack || []).slice(0, 4).map((tag: string) => (
                          <span key={tag} className="px-2 py-1 bg-muted text-muted-foreground text-[10px] font-semibold uppercase tracking-wider rounded-md border border-border/50">{tag}</span>
                        ))}
                        {(proj.stack || []).length > 4 && (
                          <span className="px-2 py-1 bg-muted/50 text-muted-foreground text-[10px] font-semibold uppercase tracking-wider rounded-md border border-border/50">+{proj.stack.length - 4}</span>
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
