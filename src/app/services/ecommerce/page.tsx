import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CheckCircle, CreditCard, ShoppingBag, ShoppingCart, TrendingUp } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { GlowCard } from '@/components/ui/GlowCard';
import { FadeInSection } from '@/components/animations/FadeInSection';
import { siteConfig } from '@/lib/data';

export const metadata: Metadata = {
  title: `E-Commerce Web Services | ${siteConfig.brandName}`,
  description: `Custom e-commerce applications, Shopify headless storefronts, subscription platforms, Stripe payments integration, and optimized checkout funnels.`,
};

const FEATURES = [
  "Custom Headless Storefronts (Next.js + Shopify/Medusa)",
  "Seamless Stripe Subscription & Custom Billing Integrations",
  "High-Converting Checkout Funnels",
  "Product Search & Filter Virtualized Engine",
  "Admin Dashboard for Inventory, Orders, & Analytics",
  "Security Audited SSL & Encrypted Database Handling",
];

const PROCESS = [
  { step: "01", title: "Product & Checkout Audit", desc: "We study your inventory catalogs, review checkout conversion rates, and map custom payment architectures." },
  { step: "02", title: "Conversion UI Design", desc: "We design shopping cart drawers, checkout fields, and product landing pages for speed and clarity." },
  { step: "03", title: "E-comm Pipeline Code", desc: "We connect Stripe/Paypal SDKs, webhook listeners, database ordering pipelines, and emails." },
  { step: "04", title: "Live Checkout Validation", desc: "We perform full Stripe test-card purchases, verify order confirmation webhooks, and launch." },
];

export default function EcommerceServicePage() {
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
            <ShoppingBag size={14} /> Storefronts & Subscriptions
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1] max-w-4xl mx-auto">
            High-Conversion <span className="text-primary">E-Commerce Builds</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed pt-2">
            Build a custom digital storefront or subscription SaaS platform that handles Stripe checkout webhooks and converts window shoppers into paying customers.
          </p>
          <div className="flex justify-center gap-4 pt-6">
            <Link href="/contact?service=Custom%20Web%20App">
              <button className="flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-bold rounded-full hover:scale-105 transition-transform">
                Launch My Store <ArrowRight size={18} />
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
              <ShoppingCart size={24} />
            </div>
            <h3 className="text-xl font-bold">Headless Storefronts</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              We separate storefront rendering from content administration by building custom Next.js frontends connecting to headless Shopify, MedusaJS, or BigCommerce.
            </p>
          </GlowCard>
        </FadeInSection>

        <FadeInSection delay={0.1}>
          <GlowCard className="p-8 h-full space-y-4 border-primary/10">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <CreditCard size={24} />
            </div>
            <h3 className="text-xl font-bold">Stripe Subscriptions</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              We implement robust Stripe Billing logic supporting trial periods, coupon deductions, multi-tier pricing plans, and automatic card fail recoveries.
            </p>
          </GlowCard>
        </FadeInSection>

        <FadeInSection delay={0.2}>
          <GlowCard className="p-8 h-full space-y-4 border-primary/10">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <TrendingUp size={24} />
            </div>
            <h3 className="text-xl font-bold">Optimized Checkout</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              We reduce card abandonment rates using one-click checkouts, local billing methods (Apple Pay, Google Pay), and clean, distraction-free invoice routes.
            </p>
          </GlowCard>
        </FadeInSection>
      </section>

      {/* What's included checklist */}
      <section className="border-t border-border pt-16 grid md:grid-cols-2 gap-12">
        <FadeInSection className="space-y-4">
          <SectionHeader badge="Capabilities" title="E-Commerce Core Deliverables" />
          <p className="text-muted-foreground leading-relaxed">
            Every e-commerce build is responsive, includes structured dynamic sitemaps, schemas for product listings, and secure database backends.
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
          <SectionHeader badge="Workflow" title="Storefront Development Process" />
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
            <h3 className="text-3xl font-extrabold">Ready to start collecting card payments?</h3>
            <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
              We help you integrate secure gateways, set up recurring webhook structures, and build conversion-optimized online stores.
            </p>
            <div className="flex justify-center gap-4 pt-4">
              <Link href="/contact?service=Custom%20Web%20App">
                <button className="px-8 py-4 bg-foreground text-background font-bold rounded-full hover:bg-primary hover:text-white transition-colors">
                  Build Storefront
                </button>
              </Link>
            </div>
          </div>
        </FadeInSection>
      </section>

    </div>
  );
}
