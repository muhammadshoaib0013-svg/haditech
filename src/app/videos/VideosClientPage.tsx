'use client'
import React, { useState } from 'react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { SearchInput } from '@/components/ui/SearchInput'
import { FilterPills } from '@/components/ui/FilterPills'
import { VideoThumbnailCard } from '@/components/ui/VideoThumbnailCard'
import { FadeInSection } from '@/components/animations/FadeInSection'
import type { DbVideo } from '@/lib/supabase/content'

interface Props { videos: DbVideo[] }

const CATEGORIES = ['All', 'Featured']

export default function VideosClientPage({ videos }: Props) {
  const [activeFilter, setActiveFilter] = useState('All')
  const [search, setSearch] = useState('')

  const filtered = videos.filter(v => {
    const matchCategory = activeFilter === 'All' || (activeFilter === 'Featured' && v.featured)
    const matchSearch = v.title.toLowerCase().includes(search.toLowerCase())
    return matchCategory && matchSearch
  })

  return (
    <div className="flex flex-col gap-8 pb-12">
      <FadeInSection>
        <SectionHeader badge="Learn" title="Videos &amp; Tutorials" subtitle="Watch our latest guides, tutorials, and technical deep-dives." />
      </FadeInSection>

      <FadeInSection delay={0.1}>
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-card/30 p-4 rounded-2xl border border-border backdrop-blur-sm">
          <FilterPills options={CATEGORIES} active={activeFilter} onChange={setActiveFilter} />
          <div className="w-full md:w-64 shrink-0">
            <SearchInput placeholder="Search videos..." value={search} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)} />
          </div>
        </div>
      </FadeInSection>

      <FadeInSection delay={0.2}>
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg font-medium">No videos found.</p>
            <p className="text-sm mt-2">Add videos in the Admin Panel → Videos.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((vid, i) => (
              <VideoThumbnailCard
                key={vid.id || i}
                title={vid.title}
                duration={vid.duration}
                imageSrc={vid.image_src}
                platform={vid.platform}
                url={vid.url}
              />
            ))}
          </div>
        )}
      </FadeInSection>
    </div>
  )
}
