import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, ChevronLeft, Quote } from 'lucide-react';
import { caseStudies, siteConfig } from '@/lib/data';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { GlowCard } from '@/components/ui/GlowCard';
import { Badge } from '@/components/ui/Badge';
import { FadeInSection } from '@/components/animations/FadeInSection';

interface Props {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return caseStudies.map((study) => ({
    slug: study.slug,
  }));
}

export function generateMetadata({ params }: Props): Metadata {
  const study = caseStudies.find((s) => s.slug === params.slug);
  
  if (!study) {
    return { title: 'Case Study Not Found' };
  }

  const title = `${study.title} | ${siteConfig.brandName} Case Study`;
  const url = `${siteConfig.siteUrl}/case-studies/${study.slug}`;

  return {
    title,
    description: study.problem,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: study.problem,
      url,
      type: "article",
      images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: study.problem,
      images: ["/opengraph-image"],
    },
  };
}

export default function SingleCaseStudyPage({ params }: Props) {
  const currentIndex = caseStudies.findIndex((s) => s.slug === params.slug);
  const study = caseStudies[currentIndex];

  if (!study) {
    notFound();
  }

  const challengeText = study.challenge || study.problem;
  const solutionText = study.solution;
  const techText = study.techDeepDive || "The project was engineered using modern software patterns, optimized API calls, and resilient error recovery mechanisms.";
  const metrics = study.results && study.results.length > 0 ? study.results : [
    { metric: "Outcome status", value: study.result }
  ];

  const nextStudy = caseStudies[currentIndex + 1] || caseStudies[0];

  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Back Button */}
      <div className="pt-4">
        <Link href="/case-studies" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
          <ChevronLeft size={16} className="mr-1" /> Back to Case Studies
        </Link>
      </div>

      {/* HERO SECTION */}
      <section className="space-y-6">
        <FadeInSection>
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="outline" className="border-primary/30 text-primary">{study.industry}</Badge>
              <Badge variant="success">Case Study Details</Badge>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.1]">
              {study.title}
            </h1>
          </div>
        </FadeInSection>
        <FadeInSection delay={0.1}>
          <div className="aspect-[21/9] w-full rounded-2xl border border-border bg-gradient-to-br from-primary/5 to-primary/20 overflow-hidden relative group flex items-center justify-center">
            <div className="text-center px-4">
              <span className="text-xs uppercase tracking-widest text-primary font-bold block mb-2">Outcome Achieved</span>
              <span className="text-2xl md:text-4xl font-extrabold text-foreground">{study.result}</span>
            </div>
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
      {study.results && study.results.length > 0 && (
        <section>
          <FadeInSection>
            <SectionHeader badge="Impact" title="Key Performance Outcomes" />
            <div className="grid sm:grid-cols-3 gap-6 mt-8">
              {study.results.map((res, i) => (
                <GlowCard key={i} className="text-center p-8 space-y-2 border-primary/20">
                  <p className="text-4xl md:text-5xl font-extrabold text-success">{res.value}</p>
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{res.metric}</p>
                </GlowCard>
              ))}
            </div>
          </FadeInSection>
        </section>
      )}

      {/* TECH DEEP DIVE */}
      <section>
        <FadeInSection>
          <div className="bg-card/50 border border-border rounded-3xl p-8 md:p-12 space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
            <h3 className="text-3xl font-bold">Tech Stack & Integration Details</h3>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-4xl relative z-10">
              {techText}
            </p>
            <div className="flex flex-wrap gap-3 relative z-10">
              {study.stack.map(tech => (
                <div key={tech} className="px-4 py-2 rounded-lg bg-background border border-border text-sm font-semibold shadow-sm flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-primary" /> {tech}
                </div>
              ))}
            </div>
          </div>
        </FadeInSection>
      </section>

      {/* TESTIMONIAL */}
      {study.clientTestimonial && (
        <section>
          <FadeInSection>
            <figure className="max-w-4xl mx-auto text-center space-y-8 py-12">
              <Quote className="w-16 h-16 mx-auto text-primary/20" />
              <blockquote className="text-2xl md:text-3xl font-medium leading-relaxed italic text-foreground">
                "{study.clientTestimonial.quote}"
              </blockquote>
              <figcaption className="space-y-1">
                <div className="font-bold text-lg">{study.clientTestimonial.name}</div>
                <div className="text-primary font-medium">{study.clientTestimonial.role}</div>
              </figcaption>
            </figure>
          </FadeInSection>
        </section>
      )}

      {/* NEXT CASE STUDY NAVIGATION */}
      <section className="pt-12 border-t border-border">
        <FadeInSection>
          <div className="flex flex-col items-center text-center space-y-6">
            <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Next Case Study</span>
            <h3 className="text-4xl font-bold hover:text-primary transition-colors">
              <Link href={`/case-studies/${nextStudy.slug}`}>{nextStudy.title}</Link>
            </h3>
            <Link href={`/case-studies/${nextStudy.slug}`}>
              <button className="flex items-center gap-2 text-primary font-medium hover:underline underline-offset-4">
                View Next Case Study <ArrowRight size={16} />
              </button>
            </Link>
          </div>
        </FadeInSection>
      </section>

    </div>
  );
}
