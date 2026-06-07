-- ============================================================
-- HADITECH Default Seed Content
-- Run this SQL in your Supabase project SQL Editor AFTER schema.sql
-- ============================================================

-- 1. SITE SETTINGS
insert into site_settings (site_name, primary_email, whatsapp_number, linkedin_url, github_url, twitter_url, facebook_url)
values (
  'HADITECH',
  'haditech313@gmail.com',
  '+92 301 2475707',
  '#',
  '#',
  '#',
  '#'
) on conflict do nothing;

-- 2. NAVIGATION ITEMS
insert into navigation_items (label, href, sort_order, is_active) values
('Home', '/', 1, true),
('Services', '/services', 2, true),
('Projects', '/projects', 3, true),
('Case Studies', '/case-studies', 4, true),
('About', '/about', 5, true),
('Contact', '/contact', 6, true)
on conflict do nothing;

-- 3. FOOTER SECTIONS
insert into footer_sections (title, content, links, sort_order, is_active) values
('Services', '', '[
  {"label": "SaaS MVP Build", "href": "/services/web-development"},
  {"label": "Custom Web App", "href": "/services/web-development"},
  {"label": "AI Automation", "href": "/services/ai-automation"},
  {"label": "WhatsApp CRM Sync", "href": "/services/whatsapp-crm"}
]'::jsonb, 1, true),
('Studio', '', '[
  {"label": "About Us", "href": "/about"},
  {"label": "Case Studies", "href": "/case-studies"},
  {"label": "Contact", "href": "/contact"}
]'::jsonb, 2, true)
on conflict do nothing;

-- 4. PAGE CONTENT
-- Home Hero
insert into page_content (page_key, section_key, title, subtitle, button_label, button_href, extra_json)
values (
  'home',
  'hero',
  'HADITECH — SaaS Development Studio',
  'We build premium SaaS platforms, intelligent automation systems, and high-performance web applications that scale.',
  'See my work',
  '/portfolio',
  '{"secondary_button_label": "Book free call", "secondary_button_href": "/contact", "badge_label": "Currently accepting new projects."}'::jsonb
) on conflict (page_key, section_key) do update set
  title = excluded.title,
  subtitle = excluded.subtitle,
  button_label = excluded.button_label,
  button_href = excluded.button_href,
  extra_json = excluded.extra_json;

-- Home Stats
insert into page_content (page_key, section_key, extra_json)
values (
  'home',
  'stats',
  '{"stats": [
    {"label": "Projects Delivered", "value": "40", "suffix": "+"},
    {"label": "Client Satisfaction", "value": "100", "suffix": "%"},
    {"label": "Lines of Code", "value": "100", "suffix": "k+"},
    {"label": "Support Uptime", "value": "99.9", "suffix": "%"}
  ]}'::jsonb
) on conflict (page_key, section_key) do update set extra_json = excluded.extra_json;

-- About Hero
insert into page_content (page_key, section_key, title, subtitle)
values (
  'about',
  'hero',
  'Engineering Excellence',
  'We are a boutique development studio obsessed with performance, architecture, and premium user experiences.'
) on conflict (page_key, section_key) do update set title = excluded.title, subtitle = excluded.subtitle;

-- About Story
insert into page_content (page_key, section_key, title, body)
values (
  'about',
  'story',
  'Our Story',
  'At HADITECH, we believe that software should be an asset, not a liability. Too many platforms today are bogged down by technical debt, bloated JavaScript bundles, and poor architectural decisions that hinder scalability. We set out to change that.'
) on conflict (page_key, section_key) do update set title = excluded.title, body = excluded.body;

-- About Mission
insert into page_content (page_key, section_key, title, body)
values (
  'about',
  'mission',
  'Our Mission',
  'Our mission is simple: to build high-performance, scalable SaaS applications and AI automation systems that empower businesses to grow without technical friction. We leverage the latest advancements in the Next.js ecosystem, React Server Components, and Edge computing to deliver lightning-fast experiences.'
) on conflict (page_key, section_key) do update set title = excluded.title, body = excluded.body;

-- About Standards / Values
insert into page_content (page_key, section_key, title, extra_json)
values (
  'about',
  'standards',
  'The HADITECH Standard',
  '{"standards": [
    {"title": "Zero Compromise on Performance", "desc": "Every project we ship targets a sub-second Time To Interactive (TTI)."},
    {"title": "Type-Safe by Default", "desc": "End-to-end TypeScript ensures runtime safety and a flawless developer experience."},
    {"title": "Design Meets Engineering", "desc": "We don''t just write code; we obsess over typography, micro-interactions, and premium aesthetics."}
  ]}'::jsonb
) on conflict (page_key, section_key) do update set title = excluded.title, extra_json = excluded.extra_json;

-- Contact Info
insert into page_content (page_key, section_key, title, subtitle, extra_json)
values (
  'contact',
  'info',
  'Let''s build something.',
  'Fill out the form below or reach out directly. We typically respond within 2 hours.',
  '{"hours": "Avg. response time: < 2 hours", "secondary_email": "haditech313@gmail.com"}'::jsonb
) on conflict (page_key, section_key) do update set title = excluded.title, subtitle = excluded.subtitle, extra_json = excluded.extra_json;


-- 5. PORTFOLIO SERVICES
insert into public.portfolio_services (
  title,
  slug,
  category,
  description,
  short_description,
  price_range,
  delivery_time,
  tier,
  features,
  icon,
  sort_order,
  popular,
  featured,
  status
)
values
(
  'SaaS MVP Build',
  'saas-mvp-build',
  'SaaS',
  'From concept to a fully functional Minimum Viable Product ready for early users and investors.',
  'From concept to a fully functional Minimum Viable Product ready for early users and investors.',
  '$5k - $10k',
  '4-6 Weeks',
  'starter',
  array['Next.js App Router Setup', 'Authentication (Auth.js)', 'Stripe Integration', 'Premium Dashboard UI'],
  'Rocket',
  1,
  true,
  true,
  'published'
),
(
  'Custom Web App',
  'custom-web-app',
  'Web App',
  'High-performance bespoke web applications tailored exactly to your business logic.',
  'High-performance bespoke web applications tailored exactly to your business logic.',
  '$10k+',
  '6-8 Weeks',
  'professional',
  array['Complex State Management', 'Third-party APIs', 'Admin Panels', 'Performance Optimization'],
  'Layout',
  2,
  false,
  true,
  'published'
),
(
  'AI & Automation Agent',
  'ai-automation-agent',
  'AI',
  'Integrate LLMs, custom chatbots, and automated workflows into your existing ecosystem.',
  'Integrate LLMs, custom chatbots, and automated workflows into your existing ecosystem.',
  'Custom',
  '3-5 Weeks',
  'enterprise',
  array['OpenAI / Anthropic', 'RAG Document Retrieval', 'WhatsApp/Telegram Bots', 'Custom LangChain'],
  'Server',
  3,
  false,
  true,
  'published'
),
(
  'Frontend Revamp',
  'frontend-revamp',
  'Frontend',
  'Upgrade your existing application to a state-of-the-art React/Next.js interface.',
  'Upgrade your existing application to a state-of-the-art React/Next.js interface.',
  '$3k+',
  '2-4 Weeks',
  'starter',
  array['Design System Creation', 'Tailwind Migration', 'Responsive Mobile', 'Framer Motion'],
  'Code',
  4,
  false,
  false,
  'published'
) on conflict (slug) do update set
  title = excluded.title,
  category = excluded.category,
  description = excluded.description,
  short_description = excluded.short_description,
  price_range = excluded.price_range,
  delivery_time = excluded.delivery_time,
  tier = excluded.tier,
  features = excluded.features,
  icon = excluded.icon,
  sort_order = excluded.sort_order,
  popular = excluded.popular,
  featured = excluded.featured,
  status = excluded.status;


-- 6. SEO SETTINGS
insert into seo_settings (page_path, title, description, keywords) values
('/', 'SaaS & AI Web App Development Studio | HADITECH', 'HADITECH is a specialist SaaS development studio. We ship premium Next.js platforms, AI automation agents, custom dashboards, and high-performance web applications for startups and enterprises.', 'SaaS MVP, Next.js, AI automation, React, custom dashboards'),
('/services', 'Services & Pricing | HADITECH', 'Productized SaaS development packages from HADITECH: SaaS MVP builds, custom web apps, AI automation agents, and frontend revamps with clear timelines and transparent pricing.', 'pricing, services, SaaS development, React development'),
('/projects', 'Featured Project Builds | HADITECH', 'A curation of dynamic web portals, custom admin dashboard panels, and systems we have shipped.', 'portfolio, Next.js builds, custom tools'),
('/case-studies', 'Case Studies | HADITECH', 'Read how we architect custom microservices and automate pipeline bottlenecks for startups and enterprises.', 'case studies, system architecture, AWS Lambda'),
('/about', 'About the Studio | HADITECH', 'Learn more about HADITECH, our mission, and the engineering principles that drive our SaaS and AI development.', 'mission, values, Next.js standard'),
('/contact', 'Start Your Project | HADITECH', 'Fill out our inquiry form or reach out via WhatsApp/email. Let us discuss how we can build your premium web application.', 'contact, start project, hire developer')
on conflict (page_path) do update set
  title = excluded.title,
  description = excluded.description,
  keywords = excluded.keywords;
