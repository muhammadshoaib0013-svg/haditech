import type { Metadata } from 'next';
import { siteConfig } from '@/lib/data';

export function generateMetadata(): Metadata {
  const title = `Videos & Tutorials | ${siteConfig.brandName}`;
  const description = `Watch technical deep-dives, Next.js tutorials, and project walkthroughs by ${siteConfig.brandName}.`;
  const url = `${siteConfig.siteUrl}/videos`;
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

export default function VideosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
