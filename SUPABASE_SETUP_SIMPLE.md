# Supabase Setup Guide (Simple)

This guide explains how to connect the HADITECH Admin CMS to Supabase in a few minutes.

---

## Step 1 — Create a Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com) and sign in (or create a free account).
2. Click **New project**, choose your organization, give the project a name (e.g. `haditech`), set a database password, and click **Create new project**.
3. Wait ~1 minute for the project to provision.

---

## Step 2 — Get Your API Keys

1. In your Supabase project dashboard, go to **Project Settings → API** (left sidebar).
2. Copy the following three values:
   - **Project URL** → this is your `NEXT_PUBLIC_SUPABASE_URL`
   - **anon / public key** → this is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role / secret key** → this is your `SUPABASE_SERVICE_ROLE_KEY`

> ⚠️ **Keep the service_role key secret.** Never expose it in client-side code or commit it to git.

---

## Step 3 — Add Variables to `.env.local`

In the root of this project, open (or create) `.env.local` and add:

```env
ADMIN_PASSWORD=your_strong_admin_password

NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...your_anon_key...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...your_service_role_key...
```

Then restart the dev server:

```bash
npm run dev
```

---

## Step 4 — Create the Database Tables

In your Supabase project, go to the **SQL Editor** (left sidebar) and run the following SQL:

```sql
-- Media Library
create table if not exists media_assets (
  id uuid default gen_random_uuid() primary key,
  file_name text not null,
  file_url text not null,
  file_type text,
  bucket_path text,
  size bigint default 0,
  created_at timestamptz default now()
);

-- Projects
create table if not exists projects (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text not null unique,
  description text,
  category text,
  stack text[] default '{}',
  tags text[] default '{}',
  featured boolean default false,
  status text default 'draft',
  live_url text,
  github_url text,
  duration text,
  result text,
  challenge text,
  solution text,
  tech_deep_dive text,
  screenshots text[] default '{}',
  primary_image text,
  created_at timestamptz default now()
);

-- Videos
create table if not exists videos (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  platform text default 'YouTube',
  url text,
  duration text,
  image_src text,
  featured boolean default false,
  status text default 'draft',
  created_at timestamptz default now()
);

-- Testimonials
create table if not exists testimonials (
  id uuid default gen_random_uuid() primary key,
  quote text not null,
  name text not null,
  role text,
  company text,
  avatar_url text,
  rating integer default 5,
  featured boolean default false,
  status text default 'draft',
  created_at timestamptz default now()
);
```

---

## Step 5 — Create the Storage Bucket

1. In your Supabase project, go to **Storage** (left sidebar).
2. Click **New bucket**, name it `media`, and check **Public bucket** (so uploaded images are publicly accessible).
3. Click **Save**.

---

## Step 6 — Verify

Visit your admin panel at `http://localhost:3000/admin` — the ⚠️ warning banners should disappear and all CMS features should work.

If you still see the warning, double-check:
- `.env.local` has all three Supabase variables
- You restarted the dev server after editing `.env.local`
- The project URL does **not** have a trailing slash
