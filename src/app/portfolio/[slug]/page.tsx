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
    <div className="flex flex-col gap-16 pb-16">
      {/* Back Button */}
      <div className="pt-4">
        <Link href="/portfolio" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
          <ChevronLeft size={16} className="mr-1" /> Back to Portfolio
        </Link>
      </div>

      {/* HERO SECTION */}
      <section className="space-y-6">
        <FadeInSection>
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="outline" className="border-primary/30 text-primary">{project.category}</Badge>
              <Badge variant="outline">{project.difficulty}</Badge>
              <span className="text-sm text-muted-foreground ml-auto">{project.duration} read</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.1]">
              {project.title}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed">
              {project.description}
            </p>
          </div>
        </FadeInSection>
        <FadeInSection delay={0.1}>
          <div className="aspect-[21/9] w-full rounded-2xl border border-border bg-muted/30 overflow-hidden relative group">
            {project.screenshots && project.screenshots.length > 0 ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={project.screenshots[0]} 
                alt={`${project.title} screenshot`} 
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
              />
            ) : (
              <>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-muted-foreground font-medium uppercase tracking-widest text-sm">{project.title} Visual Showcase</span>
                </div>
              </>
            )}
          </div>
        </FadeInSection>
      </section>

      {/* PROBLEM & SOLUTION */}
      <section className="grid md:grid-cols-2 gap-8 lg:gap-16">
        <FadeInSection>
          <div className="space-y-4">
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-destructive/10 text-destructive flex items-center justify-center text-sm">01</span>
              The Challenge
            </h3>
            <p className="text-muted-foreground leading-relaxed text-lg">
              {challengeText}
            </p>
          </div>
        </FadeInSection>
        <FadeInSection delay={0.1}>
          <div className="space-y-4">
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-success/10 text-success flex items-center justify-center text-sm">02</span>
              The Solution
            </h3>
            <p className="text-muted-foreground leading-relaxed text-lg">
              {solutionText}
            </p>
          </div>
        </FadeInSection>
      </section>

      {/* RESULTS METRICS */}
      <section>
        <FadeInSection>
          <SectionHeader badge="Impact" title="Measurable Results" />
          <div className="grid sm:grid-cols-3 gap-6 mt-8">
            {metrics.map((res, i) => (
              <GlowCard key={i} className="text-center p-8 space-y-2 border-primary/20">
                <p className="text-4xl md:text-5xl font-extrabold gradient-text">{res.value}</p>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{res.metric}</p>
              </GlowCard>
            ))}
          </div>
        </FadeInSection>
      </section>

      {/* TECH DEEP DIVE */}
      <section>
        <FadeInSection>
          <div className="bg-card/50 border border-border rounded-3xl p-8 md:p-12 space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
            <h3 className="text-3xl font-bold">Architecture & Tech Stack</h3>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-4xl relative z-10">
              {techText}
            </p>
            <div className="flex flex-wrap gap-3 relative z-10">
              {project.stack && project.stack.length > 0 ? (
                project.stack.map(tech => (
                  <div key={tech} className="px-4 py-2 rounded-lg bg-background border border-border text-sm font-semibold shadow-sm flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-primary" /> {tech}
                  </div>
                ))
              ) : (
                ["Next.js", "React", "Tailwind CSS", "TypeScript"].map(tech => (
                  <div key={tech} className="px-4 py-2 rounded-lg bg-background border border-border text-sm font-semibold shadow-sm flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-primary" /> {tech}
                  </div>
                ))
              )}
            </div>
          </div>
        </FadeInSection>
      </section>

      {/* TESTIMONIAL */}
      {project.clientTestimonial && (
        <section>
          <FadeInSection>
            <figure className="max-w-4xl mx-auto text-center space-y-8 py-12">
              <Quote className="w-16 h-16 mx-auto text-primary/20" />
              <blockquote className="text-2xl md:text-3xl font-medium leading-relaxed italic text-foreground">
                "{project.clientTestimonial.quote}"
              </blockquote>
              <figcaption className="space-y-1">
                <div className="font-bold text-lg">{project.clientTestimonial.name}</div>
                <div className="text-primary font-medium">{project.clientTestimonial.role}</div>
              </figcaption>
            </figure>
          </FadeInSection>
        </section>
      )}

      {/* NEXT PROJECT NAVIGATION */}
      <section className="pt-12 border-t border-border">
        <FadeInSection>
          <div className="flex flex-col items-center text-center space-y-6">
            <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Next Project</span>
            <h3 className="text-4xl font-bold hover:text-primary transition-colors">
              <Link href={`/portfolio/${nextProject.slug}`}>{nextProject.title}</Link>
            </h3>
            <Link href={`/portfolio/${nextProject.slug}`}>
              <button className="flex items-center gap-2 text-primary font-medium hover:underline underline-offset-4">
                View Case Study <ArrowRight size={16} />
              </button>
            </Link>
          </div>
        </FadeInSection>
      </section>

    </div>
  );
}
