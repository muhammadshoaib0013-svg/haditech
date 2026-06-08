import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, ChevronLeft, Clock, Layers, Tag } from 'lucide-react'
import { getProjectBySlug, getAllProjectSlugs } from '@/lib/supabase/content'
import { siteConfig } from '@/lib/data'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { GlowCard } from '@/components/ui/GlowCard'
import { Badge } from '@/components/ui/Badge'
import { FadeInSection } from '@/components/animations/FadeInSection'
import ProjectImage from '@/components/ui/ProjectImage'
import { getProjectPrimaryImage, normalizeScreenshots } from '@/lib/project-image-utils'

export const revalidate = 60

interface Props { params: { slug: string } }

export async function generateStaticParams() {
  const slugs = await getAllProjectSlugs()
  return slugs.map(slug => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug)
  if (!project) return { title: 'Project Not Found' }
  const title = `${project.title} Case Study | ${siteConfig.brandName}`
  const url = `${siteConfig.siteUrl}/work/${project.slug}`
  return {
    title,
    description: project.description,
    alternates: { canonical: url },
    openGraph: { title, description: project.description, url, type: 'article', images: [{ url: '/opengraph-image', width: 1200, height: 630 }] },
    twitter: { card: 'summary_large_image', title, description: project.description, images: ['/opengraph-image'] },
  }
}

export default async function CaseStudyPage({ params }: Props) {
  const project = await getProjectBySlug(params.slug)
  if (!project) notFound()

  const heroImage = getProjectPrimaryImage(project)

  return (
    <div className="max-w-[1100px] mx-auto w-full flex flex-col gap-16 pb-16 px-4">

      {/* Breadcrumb & Hero Text wrapper (900px) */}
      <div className="max-w-[900px] mx-auto w-full space-y-8">
        {/* Back */}
        <div className="pt-4">
          <Link href="/projects" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            <ChevronLeft size={16} /> Back to Projects
          </Link>
        </div>

        {/* ── HERO ── */}
        <section className="space-y-6">
          <FadeInSection>
            <div className="space-y-5">
              {/* Row 1: small metadata badges */}
              <div className="flex flex-wrap items-center gap-2.5">
                {project.category && (
                  <span className="badge-category">{project.category}</span>
                )}
                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                  <Tag size={12} /> Case Study
                </span>
                {project.status && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                    {project.status}
                  </span>
                )}
              </div>

              {/* Row 2: slim premium value statement ribbon */}
              <div className="inline-flex items-start gap-2.5 px-4 py-2.5 rounded-xl border bg-[#EFF6FF] border-[#BFDBFE] text-[#1E3A8A] dark:bg-blue-950/20 dark:border-blue-900/40 dark:text-blue-300 text-xs font-medium leading-relaxed max-w-full">
                <span className="shrink-0 mt-0.5 select-none text-primary dark:text-blue-400">✦</span>
                <span className="break-words">{project.solution || project.description}</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-[1.1] font-heading">
                {project.title}
              </h1>

              {project.description && (
                <p className="text-lg text-muted-foreground leading-relaxed prose-premium">
                  {project.description}
                </p>
              )}
            </div>
          </FadeInSection>
        </section>
      </div>

      {/* Hero image — clean, no overlays (stretches to full 1100px) */}
      <FadeInSection delay={0.1}>
        <div className="aspect-[21/9] w-full rounded-2xl border border-border overflow-hidden relative shadow-sm bg-muted">
          <ProjectImage
            src={heroImage}
            title={project.title}
            className="w-full h-full object-cover"
          />
        </div>
      </FadeInSection>

      {/* ── CHALLENGE & SOLUTION (900px) ── */}
      {(project.challenge || project.solution) && (
        <div className="max-w-[900px] mx-auto w-full">
          <section className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {project.challenge && (
              <FadeInSection>
                <div className="space-y-4 h-full flex flex-col">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 flex items-center justify-center text-xs font-bold border border-rose-200 dark:border-rose-800 shrink-0">01</span>
                    <h3 className="text-lg font-bold font-heading">The Challenge</h3>
                  </div>
                  <div className="p-6 rounded-2xl bg-card border border-border flex-1 shadow-sm">
                    <p className="text-muted-foreground leading-relaxed prose-premium text-sm">
                      {project.challenge}
                    </p>
                  </div>
                </div>
              </FadeInSection>
            )}
            {project.solution && (
              <FadeInSection delay={0.1}>
                <div className="space-y-4 h-full flex flex-col">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold border border-primary/20 shrink-0">02</span>
                    <h3 className="text-lg font-bold font-heading">The Solution</h3>
                  </div>
                  <div className="p-6 rounded-2xl bg-card border border-border flex-1 shadow-sm">
                    <p className="text-muted-foreground leading-relaxed prose-premium text-sm">
                      {project.solution}
                    </p>
                  </div>
                </div>
              </FadeInSection>
            )}
          </section>
        </div>
      )}

      {/* ── RESULTS (stretches to full 1100px) ── */}
      {project.results && project.results.length > 0 && (
        <section>
          <FadeInSection>
            <SectionHeader badge="Impact" title="Measurable Results" />
            <div className="grid sm:grid-cols-3 gap-5 mt-8">
              {project.results.map((res: { value: string; metric: string }, i: number) => (
                <GlowCard key={i} className="text-center p-8 space-y-2 border-border shadow-sm bg-card">
                  <p className="text-4xl md:text-5xl font-extrabold gradient-text">{res.value}</p>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">{res.metric}</p>
                </GlowCard>
              ))}
            </div>
          </FadeInSection>
        </section>
      )}

      {/* ── ARCHITECTURE & TECH STACK (900px) ── */}
      {(project.tech_deep_dive || (project.stack && project.stack.length > 0)) && (
        <div className="max-w-[900px] mx-auto w-full">
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold border border-primary/20 shrink-0">03</span>
              <h3 className="text-xl font-bold font-heading">Architecture & Tech Stack</h3>
            </div>

            <div className="grid md:grid-cols-5 gap-8 bg-card border border-border rounded-2xl p-8 relative overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

              {/* Architecture Overview */}
              <div className="md:col-span-3 space-y-4 z-10">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">System Architecture</h4>
                {project.tech_deep_dive ? (
                  <ul className="space-y-3.5">
                    {project.tech_deep_dive.split('. ').filter(Boolean).map((s: string, idx: number) => {
                      const sentence = s.trim().endsWith('.') ? s.trim() : s.trim() + '.';
                      return (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle2 size={16} className="text-primary shrink-0 mt-0.5" />
                          <span className="text-sm leading-relaxed text-muted-foreground">{sentence}</span>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Developed with clean architectural principles, focusing on modularity, database integrity, and decoupled service layers.
                  </p>
                )}
              </div>

              {/* Tech Stack Chips */}
              <div className="md:col-span-2 space-y-4 border-t md:border-t-0 md:border-l border-border pt-6 md:pt-0 md:pl-8 z-10">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Technology Stack</h4>
                <div className="flex flex-wrap gap-2">
                  {project.stack && project.stack.length > 0 ? (
                    project.stack.map((tech: string) => (
                      <span key={tech} className="tech-chip">
                        {tech}
                      </span>
                    ))
                  ) : (
                    ["Next.js", "React", "Tailwind CSS", "TypeScript"].map((tech: string) => (
                      <span key={tech} className="tech-chip">
                        {tech}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* ── SCREENSHOTS GALLERY (stretches to full 1100px) ── */}
      {(() => {
        const imageScreenshots = normalizeScreenshots(project.screenshots)
        const galleryImages = imageScreenshots.slice(1)
        if (galleryImages.length === 0) return null
        return (
          <section>
            <FadeInSection>
              <SectionHeader badge="Gallery" title="Project Screenshots" />
              <div className="grid sm:grid-cols-2 gap-4 mt-8">
                {galleryImages.map((src: string, i: number) => (
                  <div key={i} className="w-full rounded-xl border border-border overflow-hidden aspect-video bg-muted shadow-sm">
                    <ProjectImage
                      src={src}
                      title={`${project.title} screenshot ${i + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </FadeInSection>
          </section>
        )
      })()}

      {/* ── CTA (stretches to full 1100px) ── */}
      <section className="pt-12 border-t border-border">
        <FadeInSection>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-8 rounded-2xl bg-secondary/35 dark:bg-card border border-border shadow-sm">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Like what you see?</p>
              <h3 className="text-2xl font-extrabold font-heading">Ready to build something similar?</h3>
            </div>
            <Link
              href="/contact"
              className="shrink-0 flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold text-sm hover:bg-primary/95 transition-all hover:scale-[1.02] shadow-sm shadow-primary/10"
            >
              Start Your Project <ArrowRight size={15} />
            </Link>
          </div>
        </FadeInSection>
      </section>

    </div>
  )
}
