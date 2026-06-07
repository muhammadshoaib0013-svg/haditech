import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronLeft, Calendar, Clock } from 'lucide-react';
import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import remarkGfm from 'remark-gfm';
import { format, parseISO } from 'date-fns';

import { getAllPosts, getPostBySlug, getRelatedPosts } from '@/lib/blog';
import { siteConfig } from '@/lib/data';
import { Badge } from '@/components/ui/Badge';
import { MDXComponents } from '@/components/mdx/MDXComponents';
import { FadeInSection } from '@/components/animations/FadeInSection';

// Reading Progress Bar Component (Client)
import { ReadingProgress } from '@/components/mdx/ReadingProgress';

interface Props {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export function generateMetadata({ params }: Props): Metadata {
  const post = getPostBySlug(params.slug);
  
  if (!post) {
    return { title: 'Post Not Found' };
  }

  const url = `${siteConfig.siteUrl}/blog/${post.slug}`;
  const ogImage = post.meta.coverImage || '/opengraph-image';

  return {
    title: `${post.meta.title} | ${siteConfig.brandName} Blog`,
    description: post.meta.description,
    alternates: { canonical: url },
    openGraph: {
      title: post.meta.title,
      description: post.meta.description,
      type: "article",
      url,
      publishedTime: post.meta.date,
      authors: [siteConfig.author.name],
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.meta.title,
      description: post.meta.description,
      images: [ogImage],
    },
  };
}

// Extract headings for Table of Contents
function extractHeadings(content: string) {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const headings = [];
  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    // Simple slugify matching rehype-slug
    const slug = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    headings.push({ level, text, slug });
  }
  return headings;
}

export default function BlogPostPage({ params }: Props) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const headings = extractHeadings(post.content);
  const relatedPosts = getRelatedPosts(post.slug, post.meta.tags);

  const prettyCodeOptions = {
    theme: 'github-dark-dimmed',
    keepBackground: true,
    // Add raw code to <pre> so we can copy it later
    onVisitLine(node: any) {
      if (node.children.length === 0) {
        node.children = [{ type: 'text', value: ' ' }];
      }
    },
    onVisitHighlightedLine(node: any) {
      node.properties.className.push('highlighted');
    },
    onVisitHighlightedWord(node: any) {
      node.properties.className = ['word'];
    },
  };

  return (
    <>
      <ReadingProgress />
      <div className="flex flex-col gap-12 pb-16 lg:flex-row relative">
        
        {/* Main Article Content */}
        <article className="flex-1 min-w-0 max-w-4xl mx-auto lg:mx-0 w-full">
          <FadeInSection>
            <div className="pt-4 mb-8">
              <Link href="/blog" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                <ChevronLeft size={16} className="mr-1" /> Back to Blog
              </Link>
            </div>
            
            <div className="space-y-6 mb-12">
              <div className="flex flex-wrap gap-3">
                {post.meta.tags.map(tag => (
                  <Badge key={tag} variant="outline" className="text-primary border-primary/30">{tag}</Badge>
                ))}
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-foreground">
                {post.meta.title}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-muted-foreground pt-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                    {siteConfig.author.name.charAt(0)}
                  </div>
                  <span>{siteConfig.author.name}</span>
                </div>
                <div className="flex items-center gap-2"><Calendar size={14} /> {format(parseISO(post.meta.date), 'MMM dd, yyyy')}</div>
                <div className="flex items-center gap-2"><Clock size={14} /> {post.meta.readingTime}</div>
              </div>
            </div>

            {post.meta.coverImage && (
              <div className="w-full aspect-[2/1] rounded-2xl overflow-hidden mb-12 border border-border shadow-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={post.meta.coverImage} alt={post.meta.title} className="w-full h-full object-cover" />
              </div>
            )}
          </FadeInSection>

          <FadeInSection delay={0.1}>
            <div className="prose prose-invert prose-lg max-w-none prose-headings:scroll-mt-24 prose-img:rounded-xl">
              <MDXRemote 
                source={post.content} 
                components={MDXComponents}
                options={{
                  mdxOptions: {
                    remarkPlugins: [remarkGfm],
                    rehypePlugins: [
                      rehypeSlug,
                      [rehypeAutolinkHeadings, { behavior: 'wrap' }],
                      [rehypePrettyCode, prettyCodeOptions] as any
                    ],
                  }
                }}
              />
            </div>
          </FadeInSection>
        </article>

        {/* Sidebar (Table of Contents) */}
        <aside className="w-full lg:w-[300px] shrink-0">
          <div className="sticky top-24 space-y-12">
            
            {headings.length > 0 && (
              <div className="bg-card/30 border border-border rounded-xl p-6 hidden lg:block">
                <h4 className="font-bold text-lg mb-4 text-foreground">Table of Contents</h4>
                <nav className="flex flex-col gap-2.5">
                  {headings.map((h, i) => (
                    <a 
                      key={i} 
                      href={`#${h.slug}`}
                      className={`text-sm hover:text-primary transition-colors ${h.level === 3 ? 'pl-4 text-muted-foreground' : 'text-foreground font-medium'}`}
                    >
                      {h.text}
                    </a>
                  ))}
                </nav>
              </div>
            )}

            {relatedPosts.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-bold text-lg text-foreground border-b border-border pb-2">Related Articles</h4>
                <div className="flex flex-col gap-4">
                  {relatedPosts.map(rp => (
                    <Link key={rp.slug} href={`/blog/${rp.slug}`} className="group block">
                      <h5 className="font-medium text-sm text-muted-foreground group-hover:text-primary transition-colors line-clamp-2">
                        {rp.meta.title}
                      </h5>
                      <span className="text-xs text-muted-foreground/60">{format(parseISO(rp.meta.date), 'MMM dd')}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </div>
        </aside>

      </div>
    </>
  );
}
