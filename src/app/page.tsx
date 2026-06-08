import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Code, MessageSquare, Rocket, Layout, Server, Shield, CheckCircle2, Bot, ShoppingBag, MessageCircle, type LucideIcon } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { GlowCard } from '@/components/ui/GlowCard';
import { Hero } from '@/components/sections/Hero';
import { Badge } from '@/components/ui/Badge';
import { ProjectCard } from '@/components/ui/ProjectCard';
import { FadeInSection } from '@/components/animations/FadeInSection';
import { TestimonialsSection } from '@/components/ui/TestimonialsSection';
import { FAQAccordion } from '@/components/ui/FAQAccordion';
import { siteConfig, projects, caseStudies, faq } from '@/lib/data';
import { generatePageMetadata } from '@/lib/metadata';
import { getHomeContent, getPublishedServices } from '@/lib/cms/public-content';

export const dynamic = 'force-dynamic';

export function generateMetadata(): Metadata {
  return generatePageMetadata(
    "SaaS & AI Web App Development Studio",
    siteConfig.siteDescription,
    ""
  );
}

const iconMap: Record<string, LucideIcon> = {
  Rocket, Layout, Server, Code
};

// Trust partner companies / brands styling
const BRANDS = [
  { name: "Y-Combinator", logo: "🚀 Y-Combinator Startup" },
  { name: "Helium Insights", logo: "📊 Helium Insights" },
  { name: "Smart Source CRM", logo: "⚙️ Smart Source" },
  { name: "Global Sales Corp", logo: "🌐 Global Sales" },
  { name: "NextGen SaaS", logo: "💎 NextGen SaaS" }
];

export default async function Home() {
  const homeContent = await getHomeContent();
  const services = await getPublishedServices();
  
  // Map services to specific page URLs
  const serviceUrls: Record<string, string> = {
    "SaaS MVP Build": "/services/web-development",
    "Custom Web App": "/services/web-development",
    "AI & Automation Agent": "/services/ai-automation",
    "Frontend Revamp": "/services/web-development",
    "Web Designing": "/services/web-development",
  };

  return (
    <div className="flex flex-col gap-24 pb-20">
      
      {/* HERO SECTION */}
      <div>
        <Hero 
          headline={homeContent.headline}
          subheadline={homeContent.subheadline}
          whatsappLink={homeContent.whatsappLink}
          availabilityOpen={homeContent.availabilityOpen}
          availabilityMessage={homeContent.availabilityMessage}
          stats={homeContent.stats}
        />
      </div>

      {/* TRUST METRICS: LOGO TICKER */}
      <section className="-mt-16">
        <FadeInSection>
          <div className="text-center space-y-4">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground/80 font-bold">Backed by Clients & Startup Teams Globally</span>
            <div className="w-full overflow-hidden relative py-5 border-y border-border bg-card/50">
              <div className="flex justify-around flex-wrap gap-x-12 gap-y-6 items-center max-w-5xl mx-auto px-4">
                {BRANDS.map((brand, i) => (
                  <span 
                    key={i} 
                    className="text-muted-foreground/50 hover:text-primary transition-colors font-extrabold text-sm uppercase tracking-wider select-none cursor-default flex items-center gap-2"
                  >
                    {brand.logo}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </FadeInSection>
      </section>

      {/* CORE SERVICES */}
      <section id="services">
        <FadeInSection>
          <SectionHeader badge="Services" title="SaaS & Automation Offerings" subtitle="Productized solutions built to take your product from zero to market leadership." />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {services.map((s, i) => {
              const Icon = iconMap[s.iconName] || Code;
              const linkUrl = serviceUrls[s.title] || "/services";
              return (
                <Link key={i} href={linkUrl} className="group block h-full">
                  <GlowCard className="flex flex-col h-full gap-5 items-start border-border hover:border-primary/30 transition-all duration-300 relative overflow-hidden group">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                      <Icon size={22} />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-lg font-bold group-hover:text-primary transition-colors font-heading">{s.title}</h3>
                      <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground/80">{s.pricingHint} &bull; {s.deliveryTime}</p>
                    </div>
                    <p className="text-muted-foreground text-sm flex-1 leading-relaxed">{s.shortDescription}</p>
                    <div className="flex items-center gap-1.5 text-xs text-primary font-bold pt-2 group-hover:translate-x-1 transition-transform mt-auto">
                      Learn more <ArrowRight size={14} />
                    </div>
                    {s.popular && <Badge variant="default" className="absolute top-4 right-4 uppercase tracking-widest text-[9px] font-bold">Popular</Badge>}
                  </GlowCard>
                </Link>
              );
            })}
          </div>
        </FadeInSection>
      </section>

      {/* DYNAMIC SERVICE LANDING HIGHLIGHTS */}
      <section className="border-t border-border/50 pt-16">
        <FadeInSection>
          <SectionHeader badge="Capabilities" title="Specialized Frameworks" subtitle="Tailored blueprints engineered to meet exact technical specifications." />
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            {/* Custom Web Dev Card */}
            <Link href="/services/web-development" className="block group">
              <GlowCard className="p-8 border-primary/10 hover:border-primary/30 transition-all relative overflow-hidden h-full">
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0"><Layout size={24} /></div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">SaaS Web Platforms</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Custom responsive web apps and administrative dashboards using React Server Components, Tailwind CSS styling systems, and Next.js 14 App Router.
                    </p>
                  </div>
                </div>
              </GlowCard>
            </Link>

            {/* AI Agent Card */}
            <Link href="/services/ai-automation" className="block group">
              <GlowCard className="p-8 border-primary/10 hover:border-primary/30 transition-all relative overflow-hidden h-full">
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0"><Bot size={24} /></div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">AI & Process Automations</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Deep learning agents, OpenAI/Anthropic SDK configurations, RAG document search engines, vector lookups, and cron workflow scripts.
                    </p>
                  </div>
                </div>
              </GlowCard>
            </Link>

            {/* E-Commerce Card */}
            <Link href="/services/ecommerce" className="block group">
              <GlowCard className="p-8 border-primary/10 hover:border-primary/30 transition-all relative overflow-hidden h-full">
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0"><ShoppingBag size={24} /></div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">E-Commerce & Subscriptions</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      High-converting headless storefronts connected to Shopify medusa API, recurring Stripe Billing pipelines, and webhook payment configurations.
                    </p>
                  </div>
                </div>
              </GlowCard>
            </Link>

            {/* WhatsApp CRM Card */}
            <Link href="/services/whatsapp-crm" className="block group">
              <GlowCard className="p-8 border-primary/10 hover:border-primary/30 transition-all relative overflow-hidden h-full">
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0"><MessageCircle size={24} /></div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">WhatsApp & Lead CRM Sync</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Official Meta cloud phone API configurations, automated chatbot lead filters, CRM sync pipelines (HubSpot), and instant push notification builders.
                    </p>
                  </div>
                </div>
              </GlowCard>
            </Link>
          </div>
        </FadeInSection>
      </section>

      {/* CASE STUDIES SUMMARY */}
      <section className="border-t border-border/50 pt-16">
        <FadeInSection>
          <div className="flex justify-between items-end mb-12">
            <SectionHeader badge="Case Studies" title="Engineering Solved Problems" subtitle="How we architect solutions to critical bottlenecks and deliver tangible pipeline improvements." />
            <Link href="/case-studies" className="hidden md:flex text-primary hover:text-white transition-colors items-center gap-1 font-bold text-sm">
              See all case studies &rarr;
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {caseStudies.slice(0, 2).map((study, i) => (
              <GlowCard key={i} className="p-8 border-primary/10 relative flex flex-col justify-between">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="border-primary/20 text-primary">{study.industry}</Badge>
                    <span className="badge-category">{study.result}</span>
                  </div>
                  <h3 className="text-2xl font-extrabold">{study.title}</h3>
                  <div className="space-y-4 pt-2">
                    <div className="space-y-1">
                      <h4 className="text-xs uppercase font-bold text-destructive">The Problem</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{study.problem}</p>
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs uppercase font-bold text-primary">The Solution</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{study.solution}</p>
                    </div>
                  </div>
                </div>
                <div className="pt-6 mt-6 border-t border-border/50 flex justify-end">
                  <Link href={`/case-studies/${study.slug}`} className="flex items-center gap-1 text-sm font-bold text-primary hover:text-white transition-colors">
                    Read Full Case Study <ArrowRight size={14} />
                  </Link>
                </div>
              </GlowCard>
            ))}
          </div>
        </FadeInSection>
      </section>

      {/* FEATURED PROJECTS */}
      <section className="border-t border-border/50 pt-16">
        <FadeInSection>
          <div className="flex justify-between items-end mb-12">
            <SectionHeader badge="Portfolio" title="Featured Project Builds" subtitle="A curation of web portals, custom admin dashboard panels, and systems we've shipped." />
            <Link href="/portfolio" className="hidden md:flex text-primary hover:text-white transition-colors items-center gap-1 font-bold text-sm">
              Explore portfolio <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.filter(p => p.featured).slice(0, 3).map((p, i) => (
              <ProjectCard key={i} project={p} />
            ))}
          </div>
          <div className="mt-8 text-center md:hidden">
            <Link href="/portfolio" className="text-primary font-bold hover:underline">
              Explore portfolio &rarr;
            </Link>
          </div>
        </FadeInSection>
      </section>

      {/* TESTIMONIALS */}
      <section className="border-t border-border/50 pt-16">
        <FadeInSection>
          <SectionHeader badge="Testimonials" title="What Clients Say" subtitle="Read testimonials from client teams whom we helped achieve automated pipelines and SaaS MVPs." />
          <div className="mt-12">
            <TestimonialsSection />
          </div>
        </FadeInSection>
      </section>

      {/* FAQ SECTION */}
      <section className="border-t border-border/50 pt-16">
        <FadeInSection>
          <SectionHeader badge="FAQ" title="Frequently Asked Questions" subtitle="Details on contract terms, delivery speeds, payment processing, and support SLAs." />
          <div className="mt-12 max-w-4xl mx-auto">
            <FAQAccordion faqs={faq} />
          </div>
        </FadeInSection>
      </section>

      {/* CTA BANNER */}
      <section className="border-t border-border/50 pt-16">
        <FadeInSection>
          <div className="relative p-12 md:p-20 rounded-3xl bg-card border border-border overflow-hidden text-center isolate">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent -z-10" />
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            <div className="max-w-2xl mx-auto space-y-8">
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight font-heading">Ready to build something premium?</h2>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                Book a consultation or submit your project parameters. Let's discuss how we can build your productized web application or automate business pipelines.
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
                <Link href="/contact" className="w-full sm:w-auto">
                  <button className="px-8 py-4 w-full sm:w-auto bg-primary text-primary-foreground font-extrabold text-xs uppercase tracking-wider rounded-lg hover:bg-primary/95 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm">
                    Start My Project &rarr;
                  </button>
                </Link>
                <a href={process.env.NEXT_PUBLIC_WHATSAPP_LINK || siteConfig.whatsappLink} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                  <button className="px-8 py-4 w-full sm:w-auto bg-card hover:bg-muted/30 border border-border text-foreground font-extrabold text-xs uppercase tracking-wider rounded-lg transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm">
                    Inquire on WhatsApp
                  </button>
                </a>
              </div>
            </div>
          </div>
        </FadeInSection>
      </section>
    </div>
  );
}
