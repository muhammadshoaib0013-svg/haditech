import type { Metadata } from 'next';
import ContactForm from './ContactForm';
import { getContactContent, getPublishedServices } from '@/lib/cms/public-content';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const content = await getContactContent();
  const title = `Contact Us | HADITECH`;
  const description = content.heroSubtitle;
  const url = `https://haditech.com/contact`;
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

export default async function ContactPage() {
  const [content, services] = await Promise.all([
    getContactContent(),
    getPublishedServices(),
  ]);

  return <ContactForm content={content} services={services} />;
}
