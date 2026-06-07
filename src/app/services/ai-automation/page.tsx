import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Bot, CheckCircle, Cpu, Database, Network, Zap } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { GlowCard } from '@/components/ui/GlowCard';
import { FadeInSection } from '@/components/animations/FadeInSection';
import { siteConfig } from '@/lib/data';

export const metadata: Metadata = {
  title: `AI & Automation Agent Services | ${siteConfig.brandName}`,
  description: `Integrate custom Large Language Models (LLMs), AI chatbots, automated business pipelines, and RAG document search engines.`,
};

const FEATURES = [
  "Custom LLM API Setup (OpenAI, Anthropic, DeepSeek)",
  "RAG (Retrieval-Augmented Generation) Databases",
  "Intelligent Workflow Automation (Zapier, n8n, custom orchestrators)",
  "Meta API WhatsApp & Telegram bot agents",
  "Automated email response & CRM logging triggers",
  "Cognitive agents with reasoning capabilities",
];

const PROCESS = [
  { step: "01", title: "API Audit & Feasibility", desc: "We study your workflows, evaluate target APIs, and design a custom agent prompt system." },
  { step: "02", title: "Agent Vector Mapping", desc: "We convert knowledge docs into vector embeddings using standard models like Pinecone or pgvector." },
  { step: "03", title: "Integration Build", desc: "We build custom APIs, connect meta chat lines, and handle fallback prompts safely." },
  { step: "04", title: "Fine-tuning & QA", desc: "We test agent behavior under multi-turn prompts, add safety guardrails, and launch." },
];

export default function AIAutomationServicePage() {
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
            <Cpu size={14} /> AI & Agents
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1] max-w-4xl mx-auto">
            AI Integrations & <span className="text-primary">Automation Agents</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed pt-2">
            Supercharge your business with autonomous agents, LLM-based customer support pipelines, and intelligent workflows that reduce operating costs.
          </p>
          <div className="flex justify-center gap-4 pt-6">
            <Link href="/contact?service=AI%20%26%20Automation%20Agent">
              <button className="flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-bold rounded-full hover:scale-105 transition-transform">
                Deploy An Agent <ArrowRight size={18} />
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
              <Bot size={24} />
            </div>
            <h3 className="text-xl font-bold">Intelligent Chat Bots</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              We deploy custom prompt-engineered assistants directly onto WhatsApp, Telegram, or your website dashboard with Meta API connections.
            </p>
          </GlowCard>
        </FadeInSection>

        <FadeInSection delay={0.1}>
          <GlowCard className="p-8 h-full space-y-4 border-primary/10">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Database size={24} />
            </div>
            <h3 className="text-xl font-bold">RAG Document Lookup</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Connect your company knowledge base. Agents reference vector databases (pgvector, Supabase, Pinecone) to answer complex customer FAQs instantly.
            </p>
          </GlowCard>
        </FadeInSection>

        <FadeInSection delay={0.2}>
          <GlowCard className="p-8 h-full space-y-4 border-primary/10">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Network size={24} />
            </div>
            <h3 className="text-xl font-bold">API Workflow Pipelines</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              We map out and automate manual operations: scrapers, auto-responders, cron pipelines, and CRM entry synchronizations.
            </p>
          </GlowCard>
        </FadeInSection>
      </section>

      {/* What's included checklist */}
      <section className="border-t border-border pt-16 grid md:grid-cols-2 gap-12">
        <FadeInSection className="space-y-4">
          <SectionHeader badge="Capabilities" title="AI Capabilities We Deploy" />
          <p className="text-muted-foreground leading-relaxed">
            We integrate LLMs and automation frameworks into your existing stack using clean APIs and secure, private environment configurations.
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
          <SectionHeader badge="Workflow" title="Agent Development Process" />
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
            <h3 className="text-3xl font-extrabold">Ready to automate repetitive operations?</h3>
            <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
              We help you scale customer service, capture leads 24/7, and reduce data-entry labor hours.
            </p>
            <div className="flex justify-center gap-4 pt-4">
              <Link href="/contact?service=AI%20%26%20Automation%20Agent">
                <button className="px-8 py-4 bg-foreground text-background font-bold rounded-full hover:bg-primary hover:text-white transition-colors">
                  Contact Studio
                </button>
              </Link>
            </div>
          </div>
        </FadeInSection>
      </section>

    </div>
  );
}
