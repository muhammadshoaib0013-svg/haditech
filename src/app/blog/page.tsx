import { Metadata } from 'next';
import Link from 'next/link';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { FadeInSection } from '@/components/animations/FadeInSection';
import { Badge } from '@/components/ui/Badge';
import { GlowCard } from '@/components/ui/GlowCard';
import { getAllPosts } from '@/lib/blog';
import { siteConfig } from '@/lib/data';
import { format, parseISO } from 'date-fns';

export const metadata: Metadata = {
  title: `Engineering Blog | ${siteConfig.brandName}`,
  description: "Insights on SaaS development, AI automation, and Next.js performance.",
};

export default function BlogListPage() {
  const posts = getAllPosts();

  return (
    <div className="flex flex-col gap-12 pb-12">
      <FadeInSection>
        <SectionHeader 
          badge="Blog" 
          title="Engineering Insights" 
          subtitle="Thoughts and tutorials on building highly scalable SaaS platforms and AI agents." 
        />
      </FadeInSection>

      <FadeInSection delay={0.1}>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
              <GlowCard className="flex flex-col h-full overflow-hidden transition-transform duration-300 hover:scale-[1.02]">
                {post.meta.coverImage ? (
                  <div className="w-full h-48 bg-muted overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={post.meta.coverImage} alt={post.meta.title} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-muted flex items-center justify-center">
                    <span className="text-muted-foreground uppercase tracking-widest text-sm font-bold opacity-50">
                      {siteConfig.brandName}
                    </span>
                  </div>
                )}
                
                <div className="p-6 flex flex-col flex-1 gap-4">
                  <div className="flex flex-wrap gap-2">
                    {post.meta.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs bg-muted/50">{tag}</Badge>
                    ))}
                  </div>
                  
                  <div className="space-y-2 flex-1">
                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-2">
                      {post.meta.title}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-3">
                      {post.meta.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs font-medium text-muted-foreground pt-4 border-t border-border mt-auto">
                    <span>{format(parseISO(post.meta.date), 'MMMM dd, yyyy')}</span>
                    <span>{post.meta.readingTime}</span>
                  </div>
                </div>
              </GlowCard>
            </Link>
          ))}
        </div>
      </FadeInSection>
    </div>
  );
}
