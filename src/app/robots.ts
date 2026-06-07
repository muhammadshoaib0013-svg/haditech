import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/data";

const BASE_URL = siteConfig.siteUrl;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",          // server-side API routes
          "/_next/",        // Next.js internal assets
          "/admin/",        // reserved for future admin panel
        ],
      },
      // Block AI training crawlers
      {
        userAgent: ["GPTBot", "ChatGPT-User", "CCBot", "anthropic-ai"],
        disallow: ["/"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
