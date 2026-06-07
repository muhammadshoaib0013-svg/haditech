import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CheckCircle, MessageCircle, MessageSquare, PhoneCall, Share2, Smartphone } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { GlowCard } from '@/components/ui/GlowCard';
import { FadeInSection } from '@/components/animations/FadeInSection';
import { siteConfig } from '@/lib/data';

export const metadata: Metadata = {
  title: `WhatsApp CRM Integration Services | ${siteConfig.brandName}`,
  description: `Automate lead intake from WhatsApp directly into your CRM. Meta WhatsApp Business API setups, automated routing pipelines, and WhatsApp notifications.`,
};

const FEATURES = [
  "Official Meta Cloud API Business Verification Setup",
  "Automated Lead Parsing via LLM (GPT-4) Agents",
  "Real-Time CRM Synchronization (HubSpot, Salesforce, Pipedrive)",
  "Instant Admin Notifications & Routing Pipelines",
  "Interactive WhatsApp Business Templates & Flows",
  "Rate Limiting & Resilient Multi-Agent Fallbacks",
];

const PROCESS = [
  { step: "01", title: "Meta API Account Setup", desc: "We guide you through Meta Business Manager setup, phone verification, and developer app creation." },
  { step: "02", title: "Workflow Mapping", desc: "We map out message flows: parsing data, classifying leads, and assigning next-steps actions." },
  { step: "03", title: "CRM Sync & Webhooks", desc: "We construct webhook endpoints in Node.js/Next.js to process WhatsApp messages in real-time." },
  { step: "04", title: "Sandbox Testing & Launch", desc: "We test webhook latency, parse raw test inquiries, verify CRM fields, and deploy live." },
];

export default function WhatsappCrmServicePage() {
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
            <MessageCircle size={14} /> WhatsApp & CRM Automation
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1] max-w-4xl mx-auto">
            WhatsApp Business <span className="text-primary">CRM Integrations</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed pt-2">
            Capture lead parameters from chat dialogues, automatically sync customer profiles to your CRM pipeline, and notify sales agents instantly on their phones.
          </p>
          <div className="flex justify-center gap-4 pt-6">
            <Link href="/contact?service=AI%20%26%20Automation%20Agent">
              <button className="flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-bold rounded-full hover:scale-105 transition-transform">
                Connect My WhatsApp <ArrowRight size={18} />
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
              <MessageSquare size={24} />
            </div>
            <h3 className="text-xl font-bold">Meta Cloud API Sync</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              We connect your phone lines directly to Meta Cloud API endpoints, enabling official business badges, fast webhooks, and template message pipelines.
            </p>
          </GlowCard>
        </FadeInSection>

        <FadeInSection delay={0.1}>
          <GlowCard className="p-8 h-full space-y-4 border-primary/10">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Share2 size={24} />
            </div>
            <h3 className="text-xl font-bold">CRM Integrations</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Automated agent extractors parse chat messages for buyer parameters (e.g. budgets, locations) and sync them to HubSpot, Zoho, or custom databases.
            </p>
          </GlowCard>
        </FadeInSection>

        <FadeInSection delay={0.2}>
          <GlowCard className="p-8 h-full space-y-4 border-primary/10">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Smartphone size={24} />
            </div>
            <h3 className="text-xl font-bold">Instant Notifications</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Never miss a hot lead. Sales executives receive styled Slack, email, or WhatsApp push alerts with customer brief data the moment they inquiry.
            </p>
          </GlowCard>
        </FadeInSection>
      </section>

      {/* What's included checklist */}
      <section className="border-t border-border pt-16 grid md:grid-cols-2 gap-12">
        <FadeInSection className="space-y-4">
          <SectionHeader badge="Capabilities" title="WhatsApp Business Deliverables" />
          <p className="text-muted-foreground leading-relaxed">
            All pipelines are secured, conform to Meta business templates limits, utilize resilient hosting backends, and scale under massive message volume spikes.
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
          <SectionHeader badge="Workflow" title="WhatsApp Automation Process" />
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
            <h3 className="text-3xl font-extrabold">Ready to convert WhatsApp traffic into leads?</h3>
            <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
              We help you configure official templates, write webhook handlers, and synchronize database leads instantly.
            </p>
            <div className="flex justify-center gap-4 pt-4">
              <Link href="/contact?service=AI%20%26%20Automation%20Agent">
                <button className="px-8 py-4 bg-foreground text-background font-bold rounded-full hover:bg-primary hover:text-white transition-colors">
                  Build WhatsApp CRM
                </button>
              </Link>
            </div>
          </div>
        </FadeInSection>
      </section>

    </div>
  );
}
