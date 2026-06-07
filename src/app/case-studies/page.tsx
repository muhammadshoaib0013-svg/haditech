import type { Metadata } from 'next';
import Link from 'next/link';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { GlowCard } from '@/components/ui/GlowCard';
import { Badge } from '@/components/ui/Badge';
import { FadeInSection } from '@/components/animations/FadeInSection';
import { caseStudies, siteConfig } from '@/lib/data';

export function generateMetadata(): Metadata {
  const title = `Case Studies | ${siteConfig.brandName}`;
  const description = `Deep dives into how ${siteConfig.brandName} solves complex engineering problems with scalable solutions and measurable results.`;
  const url = `${siteConfig.siteUrl}/case-studies`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/opengraph-image"],
    },
  };
}

export default function CaseStudiesPage() {
  return (
    <div className="flex flex-col gap-12 pb-12">
      <FadeInSection>
        <SectionHeader 
          badge="Case Studies" 
          title="Engineering Solutions" 
          subtitle="Real-world problems, scalable solutions, and measurable results." 
        />
      </FadeInSection>

      <div className="grid gap-8">
        {caseStudies.map((study, i) => (
          <FadeInSection key={i} delay={i * 0.1}>
            <GlowCard className="p-8 border-primary/10">
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="col-span-1 space-y-4">
                  <Badge variant="outline">{study.industry}</Badge>
                  <h3 className="text-2xl font-bold">{study.title}</h3>
                  <div className="flex flex-wrap gap-2 pt-2">
                     {study.stack.map(tech => (
                       <Badge key={tech} variant="default" className="text-[10px]">{tech}</Badge>
                     ))}
                  </div>
                </div>
                
                <div className="col-span-2 grid sm:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-destructive">The Problem</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{study.problem}</p>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-success">The Solution</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{study.solution}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                   <div className="px-4 py-2 bg-success/10 text-success rounded-lg font-bold border border-success/20">
                     {study.result}
                   </div>
                   <span className="text-sm font-medium text-muted-foreground">Key Outcome</span>
                </div>
                <Link href={`/case-studies/${study.slug}`} className="text-sm font-medium hover:text-primary transition-colors underline underline-offset-4">
                  Read Full Case Study
                </Link>
              </div>
            </GlowCard>
          </FadeInSection>
        ))}
      </div>
    </div>
  );
}
