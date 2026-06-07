import { Metadata } from 'next';
import { siteConfig } from './data';

export function generatePageMetadata(title: string, description: string, path: string): Metadata {
  const url = `${siteConfig.siteUrl}${path}`;
  const fullTitle = `${title} | ${siteConfig.brandName}`;
  
  return {
    title: fullTitle,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      type: "website",
      images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: ["/opengraph-image"],
    },
  };
}
