import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDir = path.join(process.cwd(), 'src/content/blog');

export interface BlogPostMeta {
  title: string;
  description: string;
  date: string;
  tags: string[];
  coverImage?: string;
  featured?: boolean;
  readingTime: string;
}

export interface BlogPost {
  slug: string;
  meta: BlogPostMeta;
  content: string;
}

export function getPostSlugs(): string[] {
  if (!fs.existsSync(contentDir)) return [];
  return fs.readdirSync(contentDir).filter(file => file.endsWith('.mdx'));
}

export function getPostBySlug(slug: string): BlogPost | null {
  try {
    const realSlug = slug.replace(/\.mdx$/, '');
    const fullPath = path.join(contentDir, `${realSlug}.mdx`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    
    const { data, content } = matter(fileContents);

    return {
      slug: realSlug,
      meta: data as BlogPostMeta,
      content
    };
  } catch (error) {
    return null;
  }
}

export function getAllPosts(): BlogPost[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map(slug => getPostBySlug(slug))
    .filter((post): post is BlogPost => post !== null)
    .sort((post1, post2) => (post1.meta.date > post2.meta.date ? -1 : 1));
  return posts;
}

export function getRelatedPosts(currentSlug: string, tags: string[], max: number = 3): BlogPost[] {
  const allPosts = getAllPosts().filter(post => post.slug !== currentSlug);
  
  // Sort by number of matching tags
  const related = allPosts.sort((a, b) => {
    const aMatches = a.meta.tags.filter(tag => tags.includes(tag)).length;
    const bMatches = b.meta.tags.filter(tag => tags.includes(tag)).length;
    return bMatches - aMatches;
  });

  return related.slice(0, max);
}
