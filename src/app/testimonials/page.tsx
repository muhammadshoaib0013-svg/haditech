import type { Metadata } from 'next';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { FadeInSection } from '@/components/animations/FadeInSection';
import { TestimonialCard } from '@/components/ui/TestimonialCard';
import { testimonials, siteConfig } from '@/lib/data';

export function generateMetadata(): Metadata {
  const title = `Testimonials | ${siteConfig.brandName}`;
  const description = `Read what founders and engineering leaders say about working with ${siteConfig.brandName}.`;
  const url = `${siteConfig.siteUrl}/testimonials`;
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

export default function TestimonialsPage() {
  return (
    <div className="flex flex-col gap-12 pb-12">
      <FadeInSection>
        <SectionHeader 
          badge="Reviews" 
          title="What Our Clients Say" 
          subtitle="Don't just take our word for it. Hear from the founders and leaders who have trusted us to build their platforms." 
        />
      </FadeInSection>

      <FadeInSection delay={0.1}>
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {testimonials.map((t, i) => (
            <div key={t.id} className="break-inside-avoid">
              <TestimonialCard {...t} />
            </div>
          ))}
        </div>
      </FadeInSection>
    </div>
  );
}
