import type { Metadata } from 'next';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { FadeInSection } from '@/components/animations/FadeInSection';
import { GlowCard } from '@/components/ui/GlowCard';
import { GradientButton } from '@/components/ui/GradientButton';
import { siteConfig } from '@/lib/data';
import { generatePageMetadata } from '@/lib/metadata';
import { getAboutContent } from '@/lib/cms/public-content';
import { Target, Lightbulb, Heart, CheckCircle, Rocket } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export function generateMetadata(): Metadata {
  return generatePageMetadata(
    "About the Studio",
    `Learn more about ${siteConfig.brandName}, our mission, and the engineering principles that drive our SaaS and AI development.`,
    "/about"
  );
}

const values = [
  { icon: Target, title: 'Precision', desc: 'Every pixel and every function built with intent and purpose.' },
  { icon: Lightbulb, title: 'Innovation', desc: 'We stay ahead of the curve — Next.js, AI, edge infrastructure.' },
  { icon: Heart, title: 'Partnership', desc: 'We become invested in your success, not just your contract.' },
  { icon: CheckCircle, title: 'Delivery', desc: 'On-time delivery is non-negotiable. We ship what we promise.' },
];

export default async function AboutPage() {
  const content = await getAboutContent();

  const heroTitle    = content.heroTitle;
  const heroSubtitle = content.heroSubtitle;
  const storyTitle   = content.storyTitle;
  const storyBody    = content.storyBody;
  const missionTitle = content.missionTitle;
  const missionBody  = content.missionBody;
  const valuesTitle  = content.valuesTitle;
  const teamTitle    = content.teamTitle;
  const teamBody     = content.teamBody;
  const ctaTitle     = content.ctaTitle;
  const ctaSubtitle  = content.ctaSubtitle;
  const ctaButton    = content.ctaButton;

  return (
    <div className="flex flex-col gap-20 pb-16">

      {/* Hero */}
      <FadeInSection>
        <SectionHeader
          badge="About Us"
          title={heroTitle}
          subtitle={heroSubtitle}
        />
      </FadeInSection>

      {/* Story + Mission */}
      <section className="grid md:grid-cols-2 gap-8">
        <FadeInSection delay={0.1}>
          <GlowCard className="p-8 h-full">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6 border border-primary/20">
              <Rocket size={24} />
            </div>
            <h2 className="text-2xl font-bold mb-4 font-heading">{storyTitle}</h2>
            <p className="text-muted-foreground leading-relaxed text-justify max-w-[72ch]">{storyBody}</p>
          </GlowCard>
        </FadeInSection>

        <FadeInSection delay={0.2}>
          <GlowCard className="p-8 h-full">
            <div className="w-12 h-12 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center mb-6 border border-violet-500/20">
              <Target size={24} />
            </div>
            <h2 className="text-2xl font-bold mb-4 font-heading">{missionTitle}</h2>
            <p className="text-muted-foreground leading-relaxed text-justify max-w-[72ch]">{missionBody}</p>
          </GlowCard>
        </FadeInSection>
      </section>

      {/* Values */}
      <section>
        <FadeInSection>
          <SectionHeader
            badge="Values"
            title={valuesTitle}
            subtitle="The principles that guide every line of code we write."
          />
        </FadeInSection>
        <FadeInSection delay={0.1}>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            {values.map((v, i) => (
              <GlowCard key={i} className="p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4 border border-primary/20">
                  <v.icon size={22} />
                </div>
                <h3 className="font-bold text-lg mb-2 font-heading">{v.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{v.desc}</p>
              </GlowCard>
            ))}
          </div>
        </FadeInSection>
      </section>

      {/* Team */}
      <section>
        <FadeInSection>
          <SectionHeader
            badge="Team"
            title={teamTitle}
            subtitle={teamBody}
          />
        </FadeInSection>
        <FadeInSection delay={0.1}>
          <div className="mt-10 flex justify-center">
            <GlowCard className="p-8 max-w-md text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center mx-auto mb-4 text-3xl shadow-sm border border-primary/20">
                👨‍💻
              </div>
              <h3 className="text-xl font-bold mb-1 font-heading">{siteConfig.author.name}</h3>
              <p className="text-primary text-sm font-semibold mb-3">{siteConfig.author.jobTitle}</p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Building premium SaaS platforms, AI automation agents, and high-performance web applications for global clients.
              </p>
              <div className="flex justify-center gap-4 mt-6">
                {siteConfig.socials.linkedin !== '#' && (
                  <a href={siteConfig.socials.linkedin} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors text-xs font-bold uppercase tracking-wider">LinkedIn</a>
                )}
                {siteConfig.socials.github !== '#' && (
                  <a href={siteConfig.socials.github} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors text-xs font-bold uppercase tracking-wider">GitHub</a>
                )}
              </div>
            </GlowCard>
          </div>
        </FadeInSection>
      </section>

      {/* Stats */}
      <section className="border-t border-border pt-16">
        <FadeInSection>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: '40+', label: 'Projects Delivered' },
              { value: '100%', label: 'Client Satisfaction' },
              { value: '100k+', label: 'Lines of Code' },
              { value: '99.9%', label: 'Support Uptime' },
            ].map((stat, i) => (
              <div key={i} className="p-6 rounded-2xl bg-muted/30 border border-border">
                <div className="text-3xl font-black text-primary mb-2">{stat.value}</div>
                <div className="text-muted-foreground text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </FadeInSection>
      </section>

      {/* CTA */}
      <section className="border-t border-border pt-16 text-center">
        <FadeInSection>
          <h2 className="text-3xl md:text-4xl font-black mb-4">{ctaTitle}</h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">{ctaSubtitle}</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/contact">
              <GradientButton>{ctaButton}</GradientButton>
            </Link>
            <Link href="/work">
              <button className="px-8 py-3 rounded-xl border border-border hover:border-primary/50 text-muted-foreground hover:text-foreground transition-all font-semibold">
                View Work →
              </button>
            </Link>
          </div>
        </FadeInSection>
      </section>

    </div>
  );
}
