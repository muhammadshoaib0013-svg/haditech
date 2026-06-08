import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, ChevronLeft, Quote } from 'lucide-react';
import { projects, siteConfig } from '@/lib/data';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { GlowCard } from '@/components/ui/GlowCard';
import { Badge } from '@/components/ui/Badge';
import { FadeInSection } from '@/components/animations/FadeInSection';

interface Props {
  params: {
    slug: string;
  };
}

// 1. Generate Static Params
export function generateStaticParams() {
  return projects.map((p) => ({
    slug: p.slug,
  }));
}

// 2. Generate Metadata
export function generateMetadata({ params }: Props): Metadata {
  const project = projects.find((p) => p.slug === params.slug);
  
  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }

  const title = `${project.title} Case Study | ${siteConfig.brandName}`;
  const url = `${siteConfig.siteUrl}/portfolio/${project.slug}`;

  return {
    title,
    description: project.description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: project.description,
      url,
      type: "article",
      images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: project.description,
      images: ["/opengraph-image"],
    },
  };
}

export default function CaseStudyPage({ params }: Props) {
  const currentIndex = projects.findIndex((p) => p.slug === params.slug);
  const project = projects[currentIndex];

  if (!project) {
    notFound();
  }

  // Fallback content if challenge is missing to prevent breaking on placeholders
  const challengeText = project.challenge || "The client required a specialized development partner to scope, design, and deploy a high-performance build matching industry requirements.";
  const solutionText = project.solution || "We built a customized modern solution utilizing high-performance server architecture, state-of-the-art styling, and standard schema structures.";
  const techText = project.techDeepDive || "The project was developed using React, Next.js, and Tailwind CSS. We implemented clean architecture, virtualized rendering components, and optimized database layouts.";
  const metrics = project.results && project.results.length > 0 ? project.results : [
    { metric: "Build Quality", value: "Premium" },
    { metric: "Mobile Support", value: "100%" },
    { metric: "Security Audit", value: "Passed" }
  ];

  const nextProject = projects[currentIndex + 1] || projects[0];

  return (
    <div className="max-w-[1100px] mx-auto w-full flex flex-col gap-16 pb-16 px-4">
      
      {/* Breadcrumb & Hero Text wrapper (900px) */}
      <div className="max-w-[900px] mx-auto w-full space-y-8">
        {/* Back Button */}
        <div className="pt-4">
          <Link href="/portfolio" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            <ChevronLeft size={16} className="mr-1" /> Back to Portfolio
          </Link>
        </div>

        {/* HERO SECTION */}
        <section className="space-y-6">
          <FadeInSection>
            <div className="space-y-5">
              {/* Row 1: small metadata badges */}
              <div className="flex flex-wrap items-center gap-2.5">
                {project.category && (
                  <span className="badge-category">{project.category}</span>
                )}
                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                  Case Study
                </span>
                {project.difficulty && (
                  <Badge variant="outline" className="bg-primary/5 text-primary border-primary/10 font-bold uppercase tracking-widest text-[9px]">
                    {project.difficulty}
                  </Badge>
                )}
                <span className="text-xs text-muted-foreground ml-auto uppercase tracking-wider font-bold">{project.duration} read</span>
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

      {/* Hero Image / Placeholder (stretches to full 1100px) */}
      <FadeInSection delay={0.1}>
        <div className="aspect-[21/9] w-full rounded-2xl border border-border bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 overflow-hidden relative flex items-center justify-center p-8 group shadow-sm">
          {project.screenshots && project.screenshots.length > 0 ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img 
              src={project.screenshots[0]} 
              alt={`${project.title} screenshot`} 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
            />
          ) : (
            <>
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />
              <div className="text-center px-4 relative z-10 space-y-2">
                <span className="text-[10px] uppercase tracking-widest text-primary font-bold block">Outcome Achieved</span>
                <span className="text-2xl md:text-4xl font-extrabold text-white font-heading">{project.result || "Launch Ready"}</span>
              </div>
            </>
          )}
        </div>
      </FadeInSection>

      {/* PROBLEM & SOLUTION (900px) */}
      <div className="max-w-[900px] mx-auto w-full">
        <section className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <FadeInSection>
            <div className="space-y-4 h-full flex flex-col">
              <h3 className="text-lg font-bold flex items-center gap-3 font-heading">
                <span className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 flex items-center justify-center text-xs font-bold border border-rose-200 dark:border-rose-800 shrink-0">01</span>
                The Challenge
              </h3>
              <div className="p-6 rounded-2xl bg-card border border-border flex-1 shadow-sm">
                <p className="text-muted-foreground leading-relaxed prose-premium text-sm">
                  {challengeText}
                </p>
              </div>
            </div>
          </FadeInSection>
          <FadeInSection delay={0.1}>
            <div className="space-y-4 h-full flex flex-col">
              <h3 className="text-lg font-bold flex items-center gap-3 font-heading">
                <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold border border-primary/20 shrink-0">02</span>
                The Solution
              </h3>
              <div className="p-6 rounded-2xl bg-card border border-border flex-1 shadow-sm">
                <p className="text-muted-foreground leading-relaxed prose-premium text-sm">
                  {solutionText}
                </p>
              </div>
            </div>
          </FadeInSection>
        </section>
      </div>

      {/* RESULTS METRICS (stretches to full 1100px) */}
      <section>
        <FadeInSection>
          <SectionHeader badge="Impact" title="Measurable Results" />
          <div className="grid sm:grid-cols-3 gap-6 mt-8">
            {metrics.map((res, i) => (
              <GlowCard key={i} className="text-center p-8 space-y-2 border-border shadow-sm bg-card">
                <p className="text-4xl md:text-5xl font-extrabold text-primary font-heading">{res.value}</p>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{res.metric}</p>
              </GlowCard>
            ))}
          </div>
        </FadeInSection>
      </section>

      {/* TECH DEEP DIVE / ARCHITECTURE (900px) */}
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
              {techText ? (
                <ul className="space-y-3.5">
                  {techText.split('. ').filter(Boolean).map((s: string, idx: number) => {
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

      {/* TESTIMONIAL (900px) */}
      {project.clientTestimonial && (
        <div className="max-w-[900px] mx-auto w-full">
          <section className="py-8">
            <FadeInSection>
              <figure className="max-w-3xl mx-auto text-center space-y-6">
                <Quote className="w-12 h-12 mx-auto text-primary/10" />
                <blockquote className="text-xl md:text-2xl font-medium leading-relaxed italic text-foreground font-heading">
                  "{project.clientTestimonial.quote}"
                </blockquote>
                <figcaption className="space-y-1">
                  <div className="font-extrabold text-base">{project.clientTestimonial.name}</div>
                  <div className="text-primary text-xs font-bold uppercase tracking-widest">{project.clientTestimonial.role}</div>
                </figcaption>
              </figure>
            </FadeInSection>
          </section>
        </div>
      )}

      {/* NEXT PROJECT NAVIGATION (stretches to full 1100px) */}
      <section className="pt-12 border-t border-border">
        <FadeInSection>
          <div className="flex flex-col items-center text-center space-y-6 bg-secondary/35 dark:bg-card border border-border p-8 rounded-2xl shadow-sm">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Next Project</span>
            <h3 className="text-3xl md:text-4xl font-extrabold hover:text-primary transition-colors font-heading">
              <Link href={`/portfolio/${nextProject.slug}`}>{nextProject.title}</Link>
            </h3>
            <Link href={`/portfolio/${nextProject.slug}`}>
              <button className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-primary/95 transition-all shadow-sm shadow-primary/10">
                View Case Study <ArrowRight size={14} />
              </button>
            </Link>
          </div>
        </FadeInSection>
      </section>

    </div>
  );
}
