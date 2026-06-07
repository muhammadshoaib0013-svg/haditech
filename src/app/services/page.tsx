import type { Metadata } from 'next';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { FadeInSection } from '@/components/animations/FadeInSection';
import { Code, Layout, Rocket, Server, Zap, Shield, Globe, Database, Cpu, BarChart, type LucideIcon } from 'lucide-react';
import { siteConfig, faq } from '@/lib/data';
import { ServiceTier } from '@/components/ui/ServiceTier';
import { FAQAccordion } from '@/components/ui/FAQAccordion';
import { getPublishedServices } from '@/lib/cms/public-content';

export const dynamic = 'force-dynamic';

export function generateMetadata(): Metadata {
  const title = `Services & Pricing | ${siteConfig.brandName}`;
  const description = `Productized SaaS development packages from ${siteConfig.brandName}: SaaS MVP builds, custom web apps, AI automation agents, and frontend revamps with clear timelines and transparent pricing.`;
  const url = `${siteConfig.siteUrl}/services`;
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

const iconMap: Record<string, LucideIcon> = {
  Rocket, Layout, Server, Code, Zap, Shield, Globe, Database, Cpu, BarChart,
};

// JSON-LD FAQ Schema
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map(f => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: f.answer
    }
  }))
};

export default async function ServicesPage() {
  const services = await getPublishedServices();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="flex flex-col gap-16 pb-12">

        {/* Pricing Tiers Section */}
        <section>
          <FadeInSection>
            <SectionHeader
              badge="Pricing"
              title="Productized Solutions"
              subtitle="Clear deliverables, transparent timelines, and premium quality."
            />
          </FadeInSection>

          <FadeInSection delay={0.1}>
            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mt-12">
              {services.map((pkg, i) => {
                const Icon = iconMap[pkg.iconName] || Code;
                return (
                  <div key={pkg.id || i} className="h-full">
                    <ServiceTier service={pkg} icon={Icon} />
                  </div>
                );
              })}
            </div>
          </FadeInSection>
        </section>

        {/* FAQ Section */}
        <section className="pt-16 border-t border-border">
          <FadeInSection>
            <SectionHeader
              badge="FAQ"
              title="Frequently Asked Questions"
              subtitle="Everything you need to know about the process and deliverables."
            />
          </FadeInSection>

          <FadeInSection delay={0.1}>
            <div className="mt-12">
              <FAQAccordion faqs={faq} />
            </div>
          </FadeInSection>
        </section>

      </div>
    </>
  );
}
