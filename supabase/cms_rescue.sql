-- ============================================================
-- HADITECH CMS Emergency Rescue & Repair SQL Script
-- Run this in your Supabase project SQL Editor (New Query)
-- It is completely safe to run multiple times.
-- ============================================================

-- 1. Create/repair portfolio_projects
create table if not exists public.portfolio_projects (
  id                uuid primary key default gen_random_uuid(),
  title             text not null,
  slug              text not null unique,
  description       text not null default '',
  category          text not null default '',
  stack             text[] not null default '{}',
  tags              text[] not null default '{}',
  featured          boolean not null default false,
  status            text not null default 'draft',
  live_url          text not null default '',
  github_url        text not null default '',
  duration          text not null default '',
  result            text not null default '',
  challenge         text not null default '',
  solution          text not null default '',
  tech_deep_dive    text not null default '',
  screenshots       text[] not null default '{}',
  primary_image     text not null default '',
  primary_image_url text not null default '',
  is_case_study     boolean not null default false,
  case_study_order  int not null default 0,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

alter table public.portfolio_projects add column if not exists stack text[] not null default '{}';
alter table public.portfolio_projects add column if not exists tags text[] not null default '{}';
alter table public.portfolio_projects add column if not exists featured boolean not null default false;
alter table public.portfolio_projects add column if not exists live_url text not null default '';
alter table public.portfolio_projects add column if not exists github_url text not null default '';
alter table public.portfolio_projects add column if not exists duration text not null default '';
alter table public.portfolio_projects add column if not exists result text not null default '';
alter table public.portfolio_projects add column if not exists challenge text not null default '';
alter table public.portfolio_projects add column if not exists solution text not null default '';
alter table public.portfolio_projects add column if not exists tech_deep_dive text not null default '';
alter table public.portfolio_projects add column if not exists screenshots text[] not null default '{}';
alter table public.portfolio_projects add column if not exists primary_image text not null default '';
alter table public.portfolio_projects add column if not exists primary_image_url text not null default '';
alter table public.portfolio_projects add column if not exists is_case_study boolean not null default false;
alter table public.portfolio_projects add column if not exists case_study_order int not null default 0;
alter table public.portfolio_projects add column if not exists updated_at timestamptz not null default now();

-- 2. Create/repair portfolio_videos
create table if not exists public.portfolio_videos (
  id         uuid primary key default gen_random_uuid(),
  title      text not null,
  platform   text not null default 'YouTube',
  url        text not null default '',
  duration   text not null default '',
  image_src  text not null default '',
  featured   boolean not null default false,
  status     text not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.portfolio_videos add column if not exists platform text not null default 'YouTube';
alter table public.portfolio_videos add column if not exists url text not null default '';
alter table public.portfolio_videos add column if not exists duration text not null default '';
alter table public.portfolio_videos add column if not exists image_src text not null default '';
alter table public.portfolio_videos add column if not exists featured boolean not null default false;
alter table public.portfolio_videos add column if not exists status text not null default 'published';
alter table public.portfolio_videos add column if not exists updated_at timestamptz not null default now();

-- 3. Create/repair portfolio_testimonials
create table if not exists public.portfolio_testimonials (
  id         uuid primary key default gen_random_uuid(),
  quote      text not null,
  name       text not null,
  role       text not null default '',
  company    text not null default '',
  avatar_url text not null default '',
  rating     int not null default 5,
  featured   boolean not null default false,
  status     text not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.portfolio_testimonials add column if not exists role text not null default '';
alter table public.portfolio_testimonials add column if not exists company text not null default '';
alter table public.portfolio_testimonials add column if not exists avatar_url text not null default '';
alter table public.portfolio_testimonials add column if not exists rating int not null default 5;
alter table public.portfolio_testimonials add column if not exists featured boolean not null default false;
alter table public.portfolio_testimonials add column if not exists status text not null default 'published';
alter table public.portfolio_testimonials add column if not exists updated_at timestamptz not null default now();

-- 4. Create/repair portfolio_services
create table if not exists public.portfolio_services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  category text not null default '',
  description text not null default '',
  short_description text not null default '',
  price_range text not null default '',
  delivery_time text not null default '',
  sort_order integer not null default 0,
  features text[] not null default '{}',
  tier text not null default 'starter',
  icon text not null default 'Code',
  image_url text not null default '',
  popular boolean not null default false,
  featured boolean not null default false,
  status text not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.portfolio_services add column if not exists title text;
alter table public.portfolio_services add column if not exists slug text;
alter table public.portfolio_services add column if not exists category text not null default '';
alter table public.portfolio_services add column if not exists description text not null default '';
alter table public.portfolio_services add column if not exists short_description text not null default '';
alter table public.portfolio_services add column if not exists price_range text not null default '';
alter table public.portfolio_services add column if not exists delivery_time text not null default '';
alter table public.portfolio_services add column if not exists sort_order integer not null default 0;
alter table public.portfolio_services add column if not exists features text[] not null default '{}';
alter table public.portfolio_services add column if not exists tier text not null default 'starter';
alter table public.portfolio_services add column if not exists icon text not null default 'Code';
alter table public.portfolio_services add column if not exists image_url text not null default '';
alter table public.portfolio_services add column if not exists popular boolean not null default false;
alter table public.portfolio_services add column if not exists featured boolean not null default false;
alter table public.portfolio_services add column if not exists status text not null default 'published';
alter table public.portfolio_services add column if not exists updated_at timestamptz not null default now();

-- 2. Create/repair site_settings
create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  site_name text not null default 'HADITECH',
  brand_name text not null default 'HADITECH',
  tagline text not null default '',
  logo_url text not null default '',
  favicon_url text not null default '',
  primary_email text not null default '',
  contact_email text not null default '',
  phone text not null default '',
  whatsapp_number text not null default '',
  whatsapp_link text not null default '',
  address text not null default '',
  facebook_url text not null default '',
  twitter_url text not null default '',
  linkedin_url text not null default '',
  youtube_url text not null default '',
  github_url text not null default '',
  availability_open boolean not null default true,
  availability_message text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.site_settings add column if not exists site_name text not null default 'HADITECH';
alter table public.site_settings add column if not exists brand_name text not null default 'HADITECH';
alter table public.site_settings add column if not exists tagline text not null default '';
alter table public.site_settings add column if not exists logo_url text not null default '';
alter table public.site_settings add column if not exists favicon_url text not null default '';
alter table public.site_settings add column if not exists primary_email text not null default '';
alter table public.site_settings add column if not exists contact_email text not null default '';
alter table public.site_settings add column if not exists phone text not null default '';
alter table public.site_settings add column if not exists whatsapp_number text not null default '';
alter table public.site_settings add column if not exists whatsapp_link text not null default '';
alter table public.site_settings add column if not exists address text not null default '';
alter table public.site_settings add column if not exists facebook_url text not null default '';
alter table public.site_settings add column if not exists twitter_url text not null default '';
alter table public.site_settings add column if not exists linkedin_url text not null default '';
alter table public.site_settings add column if not exists youtube_url text not null default '';
alter table public.site_settings add column if not exists github_url text not null default '';
alter table public.site_settings add column if not exists availability_open boolean not null default true;
alter table public.site_settings add column if not exists availability_message text not null default '';
alter table public.site_settings add column if not exists updated_at timestamptz not null default now();

-- 3. Create/repair page_content
create table if not exists public.page_content (
  id uuid primary key default gen_random_uuid(),
  page_key text not null,
  section_key text not null,
  title text not null default '',
  subtitle text not null default '',
  body text not null default '',
  image_url text not null default '',
  button_label text not null default '',
  button_href text not null default '',
  extra_json jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (page_key, section_key)
);

alter table public.page_content add column if not exists page_key text not null default '';
alter table public.page_content add column if not exists section_key text not null default '';
alter table public.page_content add column if not exists title text not null default '';
alter table public.page_content add column if not exists subtitle text not null default '';
alter table public.page_content add column if not exists body text not null default '';
alter table public.page_content add column if not exists image_url text not null default '';
alter table public.page_content add column if not exists button_label text not null default '';
alter table public.page_content add column if not exists button_href text not null default '';
alter table public.page_content add column if not exists extra_json jsonb not null default '{}'::jsonb;
alter table public.page_content add column if not exists is_active boolean not null default true;
alter table public.page_content add column if not exists updated_at timestamptz not null default now();

-- 4. Create/repair navigation_items
create table if not exists public.navigation_items (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  href text not null,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.navigation_items add column if not exists label text not null default '';
alter table public.navigation_items add column if not exists href text not null default '';
alter table public.navigation_items add column if not exists sort_order int not null default 0;
alter table public.navigation_items add column if not exists is_active boolean not null default true;
alter table public.navigation_items add column if not exists updated_at timestamptz not null default now();

-- 5. Create/repair footer_sections
create table if not exists public.footer_sections (
  id uuid primary key default gen_random_uuid(),
  title text not null default '',
  content text not null default '',
  links jsonb not null default '[]'::jsonb,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.footer_sections add column if not exists title text not null default '';
alter table public.footer_sections add column if not exists content text not null default '';
alter table public.footer_sections add column if not exists links jsonb not null default '[]'::jsonb;
alter table public.footer_sections add column if not exists sort_order int not null default 0;
alter table public.footer_sections add column if not exists is_active boolean not null default true;
alter table public.footer_sections add column if not exists updated_at timestamptz not null default now();

-- 6. Create/repair seo_settings
create table if not exists public.seo_settings (
  id uuid primary key default gen_random_uuid(),
  page_path text not null unique,
  title text not null default '',
  description text not null default '',
  keywords text not null default '',
  og_image text not null default '',
  canonical_url text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.seo_settings add column if not exists page_path text not null unique;
alter table public.seo_settings add column if not exists title text not null default '';
alter table public.seo_settings add column if not exists description text not null default '';
alter table public.seo_settings add column if not exists keywords text not null default '';
alter table public.seo_settings add column if not exists og_image text not null default '';
alter table public.seo_settings add column if not exists canonical_url text not null default '';
alter table public.seo_settings add column if not exists updated_at timestamptz not null default now();

-- 7. Repair media_assets metadata columns
create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  file_name text not null,
  file_url text not null,
  file_type text not null,
  bucket_path text not null,
  size bigint not null default 0,
  usage_type text default 'general',
  page_key text,
  alt_text text,
  title text,
  created_at timestamptz not null default now()
);

alter table public.media_assets
add column if not exists usage_type text default 'general',
add column if not exists page_key text,
add column if not exists alt_text text,
add column if not exists title text;

-- 8. Include Indexes
create index if not exists idx_services_sort on public.portfolio_services(sort_order);
create index if not exists idx_services_status on public.portfolio_services(status);
create index if not exists idx_page_content_key on public.page_content(page_key, section_key);
create index if not exists idx_nav_sort on public.navigation_items(sort_order);

-- 9. Include Public Read RLS Policies
alter table public.portfolio_projects enable row level security;
alter table public.portfolio_videos enable row level security;
alter table public.portfolio_testimonials enable row level security;
alter table public.portfolio_services enable row level security;
alter table public.site_settings enable row level security;
alter table public.page_content enable row level security;
alter table public.navigation_items enable row level security;
alter table public.footer_sections enable row level security;
alter table public.seo_settings enable row level security;
alter table public.media_assets enable row level security;

drop policy if exists "Public read projects" on public.portfolio_projects;
drop policy if exists "Public read videos" on public.portfolio_videos;
drop policy if exists "Public read testimonials" on public.portfolio_testimonials;
drop policy if exists "Public read published services" on public.portfolio_services;
drop policy if exists "Public read site_settings" on public.site_settings;
drop policy if exists "Public read page_content" on public.page_content;
drop policy if exists "Public read navigation_items" on public.navigation_items;
drop policy if exists "Public read footer_sections" on public.footer_sections;
drop policy if exists "Public read seo_settings" on public.seo_settings;
drop policy if exists "Public read media" on public.media_assets;

create policy "Public read projects" on public.portfolio_projects for select using (true);
create policy "Public read videos" on public.portfolio_videos for select using (true);
create policy "Public read testimonials" on public.portfolio_testimonials for select using (true);
create policy "Public read published services" on public.portfolio_services for select using (true);
create policy "Public read site_settings" on public.site_settings for select using (true);
create policy "Public read page_content" on public.page_content for select using (true);
create policy "Public read navigation_items" on public.navigation_items for select using (true);
create policy "Public read footer_sections" on public.footer_sections for select using (true);
create policy "Public read seo_settings" on public.seo_settings for select using (true);
create policy "Public read media" on public.media_assets for select using (true);

-- 10. Final verification query
-- select table_name
-- from information_schema.tables
-- where table_schema = 'public'
-- and table_name in (
--   'portfolio_services',
--   'site_settings',
--   'page_content',
--   'navigation_items',
--   'footer_sections',
--   'seo_settings',
--   'media_assets',
--   'portfolio_projects',
--   'portfolio_videos',
--   'portfolio_testimonials'
-- );
