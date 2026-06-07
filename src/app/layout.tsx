import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { siteConfig } from "@/lib/data";
import { Toaster } from "react-hot-toast";
import { AppLayoutWrapper } from "./AppLayoutWrapper";
import { getSiteSettings, getNavigationItems, getFooterSections } from "@/lib/cms/public-content";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const BASE_URL = siteConfig.siteUrl;

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: `${siteConfig.brandName} | SaaS & AI Web App Development Studio`,
    template: `%s | ${siteConfig.brandName}`,
  },
  description: siteConfig.siteDescription,
  keywords: [
    "SaaS development",
    "Next.js development agency",
    "AI automation agents",
    "custom web app development",
    "React dashboard",
    "WhatsApp bot development",
    siteConfig.brandName,
  ],
  authors: [{ name: siteConfig.author.name, url: BASE_URL }],
  creator: siteConfig.author.name,
  publisher: siteConfig.brandName,
  alternates: { canonical: BASE_URL },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    title: `${siteConfig.brandName} | SaaS & AI Web App Development Studio`,
    description: siteConfig.siteDescription,
    siteName: siteConfig.brandName,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${siteConfig.brandName} — SaaS Development Studio`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.brandName} | SaaS & AI Web App Development Studio`,
    description: siteConfig.siteDescription,
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

/** ─── JSON-LD: Person + WebSite dual schema ──────────────────────────────── */
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: siteConfig.author.name,
  jobTitle: siteConfig.author.jobTitle,
  url: BASE_URL,
  email: `mailto:${siteConfig.email}`,
  sameAs: Object.values(siteConfig.socials).filter(
    (v) => Boolean(v) && v !== "#"
  ),
  worksFor: {
    "@type": "Organization",
    name: siteConfig.brandName,
    url: BASE_URL,
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.brandName,
  url: BASE_URL,
  description: siteConfig.siteDescription,
  publisher: {
    "@type": "Organization",
    name: siteConfig.brandName,
    url: BASE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${BASE_URL}/logo.png`,
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: siteConfig.whatsappNumber,
      contactType: "customer support",
      email: siteConfig.email,
    },
  },
  potentialAction: {
    "@type": "SearchAction",
    target: `${BASE_URL}/portfolio?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

/** ─── JSON-LD: ProfessionalService schema ─────────────────────────────────── */
const professionalServiceSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: siteConfig.brandName,
  url: BASE_URL,
  description: siteConfig.siteDescription,
  email: siteConfig.email,
  telephone: siteConfig.whatsappNumber,
  areaServed: "Worldwide",
  priceRange: "$$-$$$",
  serviceType: [
    "SaaS Development",
    "Next.js Web App Development",
    "AI Agent Development",
    "WhatsApp Automation",
    "E-Commerce Development",
  ],
  address: {
    "@type": "PostalAddress",
    addressCountry: "PK",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: siteConfig.whatsappNumber,
    contactType: "customer service",
    email: siteConfig.email,
    availableLanguage: ["English"],
  },
  sameAs: Object.values(siteConfig.socials).filter(
    (v) => Boolean(v) && v !== "#"
  ),
};

import { testimonials } from "@/lib/data";

const featuredTestimonials = testimonials.filter(t => t.featured);
const reviewSchemas = featuredTestimonials.map(t => ({
  "@context": "https://schema.org",
  "@type": "Review",
  "author": {
    "@type": "Person",
    "name": t.name
  },
  "itemReviewed": {
    "@type": "Organization",
    "name": siteConfig.brandName
  },
  "reviewRating": {
    "@type": "Rating",
    "ratingValue": t.rating,
    "bestRating": "5"
  },
  "reviewBody": t.quote
}));


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [settings, navItems, footerSections] = await Promise.all([
    getSiteSettings(),
    getNavigationItems(),
    getFooterSections(),
  ]);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased min-h-screen text-foreground bg-background`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(professionalServiceSchema) }}
        />
        {reviewSchemas.map((schema, idx) => (
          <script
            key={`review-schema-${idx}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster position="bottom-right" toastOptions={{
            style: { background: '#18181b', color: '#fff', border: '1px solid #27272a' }
          }} />
          <AppLayoutWrapper 
            whatsappNumber={settings.whatsappNumber}
            whatsappLink={settings.whatsappLink}
            brandName={settings.brandName}
            tagline={settings.tagline}
            twitterUrl={settings.twitterUrl}
            githubUrl={settings.githubUrl}
            linkedinUrl={settings.linkedinUrl}
            navItems={navItems}
            footerSections={footerSections}
          >
            {children}
          </AppLayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
