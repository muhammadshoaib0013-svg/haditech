import { MetadataRoute } from "next";
import { siteConfig, projects, caseStudies } from "@/lib/data";
import { getAllPosts } from "@/lib/blog";

const BASE_URL = siteConfig.siteUrl;

/** Static routes with their SEO priority and change frequency */
const staticRoutes: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "",                          changeFrequency: "weekly",  priority: 1.0 },
  { path: "/services",                 changeFrequency: "monthly", priority: 0.9 },
  { path: "/services/web-development", changeFrequency: "monthly", priority: 0.85 },
  { path: "/services/ai-automation",   changeFrequency: "monthly", priority: 0.85 },
  { path: "/services/ecommerce",       changeFrequency: "monthly", priority: 0.85 },
  { path: "/services/whatsapp-crm",    changeFrequency: "monthly", priority: 0.85 },
  { path: "/portfolio",                changeFrequency: "weekly",  priority: 0.9 },
  { path: "/case-studies",             changeFrequency: "monthly", priority: 0.8 },
  { path: "/videos",                   changeFrequency: "weekly",  priority: 0.8 },
  { path: "/about",                    changeFrequency: "yearly",  priority: 0.6 },
  { path: "/blog",                     changeFrequency: "weekly",  priority: 0.9 },
  { path: "/testimonials",             changeFrequency: "monthly", priority: 0.7 },
  { path: "/contact",                  changeFrequency: "yearly",  priority: 0.5 },
];

/** Dynamic portfolio routes for /portfolio/[slug] */
const dynamicProjectRoutes: MetadataRoute.Sitemap = projects
  .filter((p) => Boolean(p.slug))
  .map((project) => ({
    url: `${BASE_URL}/portfolio/${project.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

/** Dynamic case study routes for /case-studies/[slug] */
const dynamicCaseStudyRoutes: MetadataRoute.Sitemap = caseStudies
  .filter((s) => Boolean(s.slug))
  .map((study) => ({
    url: `${BASE_URL}/case-studies/${study.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${BASE_URL}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const posts = getAllPosts();
  const dynamicBlogRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.meta.date),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    ...staticEntries,
    ...dynamicProjectRoutes,
    ...dynamicCaseStudyRoutes,
    ...dynamicBlogRoutes,
  ];
}
