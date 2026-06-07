import type { Metadata } from 'next';
import { siteConfig } from '@/lib/data';

export function generateMetadata(): Metadata {
  const title = `Projects Portfolio | ${siteConfig.brandName}`;
  const description = `Explore the latest SaaS platforms, web applications, and AI dashboards built by ${siteConfig.brandName}.`;
  const url = `${siteConfig.siteUrl}/projects`;
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

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
