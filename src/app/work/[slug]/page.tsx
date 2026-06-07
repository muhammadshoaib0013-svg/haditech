import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, ChevronLeft, Quote } from 'lucide-react'
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
    <div className="flex flex-col gap-16 pb-16">
      <div className="pt-4">
        <Link href="/projects" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
          <ChevronLeft size={16} className="mr-1" /> Back to Projects
        </Link>
      </div>

      {/* HERO */}
      <section className="space-y-6">
        <FadeInSection>
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="outline" className="border-primary/30 text-primary">{project.category}</Badge>
              {project.result && <Badge variant="success">{project.result}</Badge>}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.1]">{project.title}</h1>
            <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed">{project.description}</p>
          </div>
        </FadeInSection>
        <FadeInSection delay={0.1}>
          <div className="aspect-[21/9] w-full rounded-2xl border border-border bg-muted/30 overflow-hidden relative group">
            <ProjectImage
              src={heroImage}
              title={project.title}
              className="w-full h-full"
            />
          </div>
        </FadeInSection>
      </section>

      {/* PROBLEM & SOLUTION */}
      {(project.challenge || project.solution) && (
        <section className="grid md:grid-cols-2 gap-8 lg:gap-16">
          {project.challenge && (
            <FadeInSection>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-destructive/10 text-destructive flex items-center justify-center text-sm">01</span>
                  The Challenge
                </h3>
                <p className="text-muted-foreground leading-relaxed text-lg">{project.challenge}</p>
              </div>
            </FadeInSection>
          )}
          {project.solution && (
            <FadeInSection delay={0.1}>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-success/10 text-success flex items-center justify-center text-sm">02</span>
                  The Solution
                </h3>
                <p className="text-muted-foreground leading-relaxed text-lg">{project.solution}</p>
              </div>
            </FadeInSection>
          )}
        </section>
      )}

      {/* RESULTS */}
      {project.results && project.results.length > 0 && (
        <section>
          <FadeInSection>
            <SectionHeader badge="Impact" title="Measurable Results" />
            <div className="grid sm:grid-cols-3 gap-6 mt-8">
              {project.results.map((res, i) => (
                <GlowCard key={i} className="text-center p-8 space-y-2 border-primary/20">
                  <p className="text-4xl md:text-5xl font-extrabold gradient-text">{res.value}</p>
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{res.metric}</p>
                </GlowCard>
              ))}
            </div>
          </FadeInSection>
        </section>
      )}

      {/* TECH DEEP DIVE */}
      {(project.tech_deep_dive || (project.stack && project.stack.length > 0)) && (
        <section>
          <FadeInSection>
            <div className="bg-card/50 border border-border rounded-3xl p-8 md:p-12 space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
              <h3 className="text-3xl font-bold">Architecture &amp; Tech Stack</h3>
              {project.tech_deep_dive && (
                <p className="text-lg text-muted-foreground leading-relaxed max-w-4xl relative z-10">{project.tech_deep_dive}</p>
              )}
              {project.stack && project.stack.length > 0 && (
                <div className="flex flex-wrap gap-3 relative z-10">
                  {project.stack.map(tech => (
                    <div key={tech} className="px-4 py-2 rounded-lg bg-background border border-border text-sm font-semibold shadow-sm flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-primary" /> {tech}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </FadeInSection>
        </section>
      )}

      {/* SCREENSHOTS GALLERY */}
      {(() => {
        const imageScreenshots = normalizeScreenshots(project.screenshots)
        const galleryImages = imageScreenshots.slice(1) // skip index 0 (same as hero)
        if (galleryImages.length === 0) return null
        return (
          <section>
            <FadeInSection>
              <SectionHeader badge="Gallery" title="Project Screenshots" />
              <div className="grid sm:grid-cols-2 gap-4 mt-8">
                {galleryImages.map((src, i) => (
                  <div key={i} className="w-full rounded-xl border border-border overflow-hidden aspect-video">
                    <ProjectImage
                      src={src}
                      title={`${project.title} screenshot ${i + 2}`}
                      className="w-full h-full"
                    />
                  </div>
                ))}
              </div>
            </FadeInSection>
          </section>
        )
      })()}

      {/* CTA */}
      <section className="pt-12 border-t border-border">
        <FadeInSection>
          <div className="flex flex-col items-center text-center space-y-6">
            <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Like What You See?</span>
            <h3 className="text-4xl font-bold">Start Your Project</h3>
            <Link href="/contact">
              <button className="flex items-center gap-2 text-primary font-medium hover:underline underline-offset-4">
                Get In Touch <ArrowRight size={16} />
              </button>
            </Link>
          </div>
        </FadeInSection>
      </section>
    </div>
  )
}
