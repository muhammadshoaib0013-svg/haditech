import type { Metadata } from 'next';
import { siteConfig } from '@/lib/data';

const BASE_URL = siteConfig.siteUrl;

export function generateMetadata(): Metadata {
  const title = `Contact Us | ${siteConfig.brandName}`;
  const description = `Get in touch with ${siteConfig.brandName} to discuss your next SaaS product, web app, or AI automation. We typically respond within 2 hours.`;
  const url = `${BASE_URL}/contact`;
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

/** JSON-LD: ContactPage schema */
const contactPageSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: `Contact ${siteConfig.brandName}`,
  description: `Reach out to ${siteConfig.brandName} for SaaS, web development, AI automation, WhatsApp CRM, and e-commerce solutions.`,
  url: `${BASE_URL}/contact`,
  mainEntity: {
    "@type": "Organization",
    name: siteConfig.brandName,
    email: siteConfig.email,
    telephone: siteConfig.whatsappNumber,
    url: BASE_URL,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: siteConfig.whatsappNumber,
      contactType: "sales",
      email: siteConfig.email,
      availableLanguage: ["English"],
      hoursAvailable: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
        ],
        opens: "09:00",
        closes: "22:00",
      },
    },
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
      />
      {children}
    </>
  );
}
