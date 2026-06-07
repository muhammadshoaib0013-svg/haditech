import { Feed } from 'feed';
import { getAllPosts } from '@/lib/blog';
import { siteConfig } from '@/lib/data';

export async function GET() {
  const posts = getAllPosts();

  const feed = new Feed({
    title: `${siteConfig.brandName} Blog`,
    description: siteConfig.siteDescription,
    id: siteConfig.siteUrl,
    link: siteConfig.siteUrl,
    language: 'en',
    image: `${siteConfig.siteUrl}/opengraph-image`,
    favicon: `${siteConfig.siteUrl}/favicon.ico`,
    copyright: `All rights reserved ${new Date().getFullYear()}, ${siteConfig.brandName}`,
    author: {
      name: siteConfig.author.name,
      email: siteConfig.email,
      link: siteConfig.siteUrl,
    },
  });

  posts.forEach((post) => {
    feed.addItem({
      title: post.meta.title,
      id: `${siteConfig.siteUrl}/blog/${post.slug}`,
      link: `${siteConfig.siteUrl}/blog/${post.slug}`,
      description: post.meta.description,
      content: post.meta.description,
      author: [
        {
          name: siteConfig.author.name,
          email: siteConfig.email,
          link: siteConfig.siteUrl,
        },
      ],
      date: new Date(post.meta.date),
      image: post.meta.coverImage ? `${siteConfig.siteUrl}${post.meta.coverImage}` : undefined,
    });
  });

  return new Response(feed.rss2(), {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 's-maxage=86400, stale-while-revalidate',
    },
  });
}
