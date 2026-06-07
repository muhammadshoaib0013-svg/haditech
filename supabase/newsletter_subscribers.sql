-- Idempotent newsletter subscribers table
-- Run this once in your Supabase SQL Editor.

create table if not exists public.newsletter_subscribers (
  id          uuid          primary key default gen_random_uuid(),
  email       text          not null unique,
  source      text          default 'footer_newsletter',
  status      text          default 'active',
  created_at  timestamptz   default now()
);

create index if not exists newsletter_subscribers_created_at_idx
  on public.newsletter_subscribers (created_at desc);

alter table public.newsletter_subscribers enable row level security;

-- No public INSERT policy — inserts are done via the service-role key in API routes.
-- Administrators can read/manage rows directly in Supabase Studio.
