import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, ChevronLeft, Layers, Quote, Tag } from 'lucide-react';
import { caseStudies, siteConfig } from '@/lib/data';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { GlowCard } from '@/components/ui/GlowCard';
import { Badge } from '@/components/ui/Badge';
import { FadeInSection } from '@/components/animations/FadeInSection';

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const study = caseStudies.find((s) => s.slug === params.slug);
  if (!study) return { title: 'Case Study Not Found' };
  const title = `${study.title} | ${siteConfig.brandName} Case Study`;
  const url = `${siteConfig.siteUrl}/case-studies/${study.slug}`;
  return {
    title,
    description: study.problem,
    alternates: { canonical: url },
    openGraph: { title, description: study.problem, url, type: 'article', images: [{ url: '/opengraph-image', width: 1200, height: 630 }] },
    twitter: { card: 'summary_large_image', title, description: study.problem, images: ['/opengraph-image'] },
  };
}

export default function SingleCaseStudyPage({ params }: Props) {
  const currentIndex = caseStudies.findIndex((s) => s.slug === params.slug);
  const study = caseStudies[currentIndex];
  if (!study) notFound();

  const challengeText = study.challenge || study.problem;
  const solutionText = study.solution;
  const techText = study.techDeepDive || 'The project was engineered using modern software patterns, optimised API calls, and resilient error-recovery mechanisms.';
  const metrics = study.results && study.results.length > 0
    ? study.results
    : [{ metric: 'Outcome', value: study.result }];
  const nextStudy = caseStudies[currentIndex + 1] || caseStudies[0];

  return (
    <div className="max-w-[1100px] mx-auto w-full flex flex-col gap-16 pb-16 px-4">

      {/* Breadcrumb & Hero Text wrapper (900px) */}
      <div className="max-w-[900px] mx-auto w-full space-y-8">
        {/* Back */}
        <div className="pt-4">
          <Link href="/case-studies" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            <ChevronLeft size={16} /> Back to Case Studies
          </Link>
        </div>

        {/* ── HERO ── */}
        <section className="space-y-6">
          <FadeInSection>
            <div className="space-y-5">
              {/* Row 1: small metadata badges */}
              <div className="flex flex-wrap items-center gap-2.5">
                {study.industry && (
                  <span className="badge-category">{study.industry}</span>
                )}
                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                  <Tag size={12} /> Case Study
                </span>
                {study.result && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                    {study.result}
                  </span>
                )}
              </div>

              {/* Row 2: slim premium value statement ribbon */}
              <div className="inline-flex items-start gap-2.5 px-4 py-2.5 rounded-xl border bg-[#EFF6FF] border-[#BFDBFE] text-[#1E3A8A] dark:bg-blue-950/20 dark:border-blue-900/40 dark:text-blue-300 text-xs font-medium leading-relaxed max-w-full">
                <span className="shrink-0 mt-0.5 select-none text-primary dark:text-blue-400">✦</span>
                <span className="break-words">{study.solution || study.problem}</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-[1.1] font-heading">
                {study.title}
              </h1>

              {study.problem && (
                <p className="text-lg text-muted-foreground leading-relaxed prose-premium">
                  {study.problem}
                </p>
              )}
            </div>
          </FadeInSection>
        </section>
      </div>

      {/* Hero — premium dark placeholder, NO result text wall (stretches to full 1100px) */}
      <FadeInSection delay={0.1}>
        <div className="aspect-[21/9] w-full rounded-2xl border border-border bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 overflow-hidden relative flex items-center justify-center select-none shadow-sm">
          {/* Subtle grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:28px_28px] opacity-50" />
          {/* Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-primary/20 rounded-full blur-3xl" />
          {/* Content */}
          <div className="relative z-10 text-center space-y-3 px-8">
            <span className="badge-category">{study.industry}</span>
            <h2 className="text-2xl md:text-4xl font-extrabold text-white font-heading leading-tight max-w-2xl">{study.title}</h2>
            <p className="text-sm text-slate-400 uppercase tracking-widest font-semibold">{siteConfig.brandName} · Case Study</p>
          </div>
        </div>
      </FadeInSection>

      {/* ── CHALLENGE & SOLUTION (900px) ── */}
      <div className="max-w-[900px] mx-auto w-full">
        <section className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <FadeInSection>
            <div className="space-y-4 h-full flex flex-col">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 flex items-center justify-center text-xs font-bold border border-rose-200 dark:border-rose-800 shrink-0">01</span>
                <h3 className="text-lg font-bold font-heading">The Challenge</h3>
              </div>
              <div className="p-6 rounded-2xl bg-card border border-border flex-1 shadow-sm">
                <p className="text-muted-foreground leading-relaxed prose-premium text-sm">
                  {challengeText}
                </p>
              </div>
            </div>
          </FadeInSection>

          <FadeInSection delay={0.1}>
            <div className="space-y-4 h-full flex flex-col">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold border border-primary/20 shrink-0">02</span>
                <h3 className="text-lg font-bold font-heading">The Solution</h3>
              </div>
              <div className="p-6 rounded-2xl bg-card border border-border flex-1 shadow-sm">
                <p className="text-muted-foreground leading-relaxed prose-premium text-sm">
                  {solutionText}
                </p>
              </div>
            </div>
          </FadeInSection>
        </section>
      </div>

      {/* ── RESULTS METRICS (stretches to full 1100px) ── */}
      {study.results && study.results.length > 0 && (
        <section>
          <FadeInSection>
            <SectionHeader badge="Impact" title="Key Performance Outcomes" />
            <div className="grid sm:grid-cols-3 gap-5 mt-8">
              {metrics.map((res, i) => (
                <GlowCard key={i} className="text-center p-8 space-y-2 border-border shadow-sm bg-card">
                  <p className="text-4xl md:text-5xl font-extrabold gradient-text">{res.value}</p>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">{res.metric}</p>
                </GlowCard>
              ))}
            </div>
          </FadeInSection>
        </section>
      )}

      {/* ── TECH STACK & ARCHITECTURE (900px) ── */}
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
                {study.stack.map(tech => (
                  <span key={tech} className="tech-chip">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ── TESTIMONIAL (900px) ── */}
      {study.clientTestimonial && (
        <div className="max-w-[900px] mx-auto w-full">
          <section className="py-4">
            <FadeInSection>
              <figure className="max-w-3xl mx-auto text-center space-y-6">
                <Quote className="w-10 h-10 mx-auto text-primary/20" />
                <blockquote className="text-xl md:text-2xl font-medium leading-relaxed italic text-foreground font-heading">
                  &ldquo;{study.clientTestimonial.quote}&rdquo;
                </blockquote>
                <figcaption className="space-y-1">
                  <div className="font-extrabold text-base">{study.clientTestimonial.name}</div>
                  <div className="text-primary text-xs font-bold uppercase tracking-widest">{study.clientTestimonial.role}</div>
                </figcaption>
              </figure>
            </FadeInSection>
          </section>
        </div>
      )}

      {/* ── NEXT CASE STUDY (stretches to full 1100px) ── */}
      <section className="pt-12 border-t border-border">
        <FadeInSection>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-8 rounded-2xl bg-secondary/35 dark:bg-card border border-border shadow-sm">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Next Case Study</p>
              <h3 className="text-xl font-extrabold font-heading hover:text-primary transition-colors">
                <Link href={`/case-studies/${nextStudy.slug}`}>{nextStudy.title}</Link>
              </h3>
            </div>
            <Link
              href={`/case-studies/${nextStudy.slug}`}
              className="shrink-0 flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold text-sm hover:bg-primary/95 transition-all hover:scale-[1.02] shadow-sm shadow-primary/10"
            >
              View Case Study <ArrowRight size={15} />
            </Link>
          </div>
        </FadeInSection>
      </section>

    </div>
  );
}
