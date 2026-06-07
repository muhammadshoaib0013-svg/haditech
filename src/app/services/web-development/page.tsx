import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Code, Layers, Layout, Shield } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { GlowCard } from '@/components/ui/GlowCard';
import { FadeInSection } from '@/components/animations/FadeInSection';
import { siteConfig } from '@/lib/data';

export const metadata: Metadata = {
  title: `Web Development Services | ${siteConfig.brandName}`,
  description: `Premium Next.js 14, React, and TypeScript web development services. We build custom dashboards, SaaS platforms, and high-performance applications.`,
};

const FEATURES = [
  "Next.js 14 App Router Architecture",
  "Tailwind CSS Premium Responsive Design",
  "Strict TypeScript Security",
  "High-Performance Server Components (RSC)",
  "Full Database & API Integration (Prisma, PostgreSQL)",
  "Automated Testing & Vercel Deployment Optimization",
];

const PROCESS = [
  { step: "01", title: "Discovery & Architecture", desc: "We align on your requirements, wireframe user flows, and architect the database schemas." },
  { step: "02", title: "Sleek UI/UX Design", desc: "We design a custom, modern user interface in dark/light mode with premium animations." },
  { step: "03", title: "Clean Engineering", desc: "We write strict, type-safe Next.js code using Server Actions and optimized states." },
  { step: "04", title: "Quality Assurance & Launch", desc: "We run lint checks, test accessibility/performance, and deploy to Vercel production." },
];

export default function WebDevServicePage() {
  return (
    <div className="flex flex-col gap-16 pb-16">
      
      {/* Back to services */}
      <div>
        <Link href="/services" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
          &larr; View All Services
        </Link>
      </div>

      {/* Hero Section */}
      <section className="text-center space-y-6">
        <FadeInSection>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
            <Layout size={14} /> SaaS & Dashboards
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1] max-w-4xl mx-auto">
            High-Performance <span className="text-primary">Web Development</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed pt-2">
            We build state-of-the-art Next.js portals, dashboards, SaaS MVPs, and customized tools that look gorgeous, run lightning-fast, and scale seamlessly.
          </p>
          <div className="flex justify-center gap-4 pt-6">
            <Link href="/contact?service=SaaS%20MVP%20Build">
              <button className="flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-bold rounded-full hover:scale-105 transition-transform">
                Start My Build <ArrowRight size={18} />
              </button>
            </Link>
          </div>
        </FadeInSection>
      </section>

      {/* Grid Features */}
      <section className="grid md:grid-cols-3 gap-8">
        <FadeInSection>
          <GlowCard className="p-8 h-full space-y-4 border-primary/10">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Code size={24} />
            </div>
            <h3 className="text-xl font-bold">Cutting-Edge Tech Stack</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              We leverage React, TypeScript, Next.js 14, Tailwind CSS, Prisma, and database platforms like PostgreSQL or Supabase for robust, modern web architectures.
            </p>
          </GlowCard>
        </FadeInSection>

        <FadeInSection delay={0.1}>
          <GlowCard className="p-8 h-full space-y-4 border-primary/10">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Layers size={24} />
            </div>
            <h3 className="text-xl font-bold">Uncompromising Performance</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Our designs target 95+ Lighthouse performance scores using image compression, server caching, and minimal client-side script payloads.
            </p>
          </GlowCard>
        </FadeInSection>

        <FadeInSection delay={0.2}>
          <GlowCard className="p-8 h-full space-y-4 border-primary/10">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Shield size={24} />
            </div>
            <h3 className="text-xl font-bold">Production-Grade Security</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Every build includes CSP rules, type checks, CSRF protection, secure environment configurations, and auth modules via Auth.js (NextAuth).
            </p>
          </GlowCard>
        </FadeInSection>
      </section>

      {/* What's included checklist */}
      <section className="border-t border-border pt-16 grid md:grid-cols-2 gap-12">
        <FadeInSection className="space-y-4">
          <SectionHeader badge="Checklist" title="What is Included" />
          <p className="text-muted-foreground leading-relaxed">
            Get a premium end-to-end service with zero outsourced components. We handle the full product cycle from layout sketches to live staging server setups.
          </p>
        </FadeInSection>
        <FadeInSection delay={0.1}>
          <ul className="space-y-3">
            {FEATURES.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <CheckCircle size={18} className="text-primary mt-1 shrink-0" />
                <span className="text-foreground font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </FadeInSection>
      </section>

      {/* Process pipeline */}
      <section className="border-t border-border pt-16 space-y-8">
        <FadeInSection>
          <SectionHeader badge="Workflow" title="Our Development Process" />
        </FadeInSection>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {PROCESS.map((p, idx) => (
            <FadeInSection key={idx} delay={idx * 0.1}>
              <div className="space-y-3">
                <div className="text-4xl font-extrabold text-primary/20">{p.step}</div>
                <h4 className="font-bold text-lg text-foreground">{p.title}</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">{p.desc}</p>
              </div>
            </FadeInSection>
          ))}
        </div>
      </section>

      {/* Action CTA */}
      <section className="border-t border-border pt-16">
        <FadeInSection>
          <div className="p-8 md:p-16 rounded-3xl bg-card border border-border text-center space-y-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
            <h3 className="text-3xl font-extrabold">Have a specific SaaS blueprint?</h3>
            <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
              We help you refine requirements, build interactive models, and launch a production MVP in 4 to 6 weeks.
            </p>
            <div className="flex justify-center gap-4 pt-4">
              <Link href="/contact?service=Custom%20Web%20App">
                <button className="px-8 py-4 bg-foreground text-background font-bold rounded-full hover:bg-primary hover:text-white transition-colors">
                  Contact Developer
                </button>
              </Link>
            </div>
          </div>
        </FadeInSection>
      </section>

    </div>
  );
}
