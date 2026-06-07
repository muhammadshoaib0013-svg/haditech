# HADITECH Supabase Setup Guide

## Step 1 — Create Free Supabase Project

1. Go to **[supabase.com](https://supabase.com)** and sign up (free)
2. Click **New Project**
3. Enter a project name (e.g. `haditech-portfolio`)
4. Set a secure database password (save this somewhere)
5. Choose a region closest to you
6. Click **Create new project** and wait ~2 minutes

---

## Step 2 — Run the Database Schema

1. In your Supabase project, click **SQL Editor** in the left sidebar
2. Click **New query**
3. Copy the entire contents of `supabase/schema.sql`
4. Paste it into the editor
5. Click **Run** (▶️)
6. You should see: *Success. No rows returned.*

---

## Step 3 — Create the Storage Bucket

1. Click **Storage** in the left sidebar
2. Click **New bucket**
3. Name it exactly: `haditech-media`
4. Toggle **Public bucket** to **ON** (required for public image URLs)
5. Click **Save**

---

## Step 4 — Copy Your Environment Variables

1. Click **Settings** (gear icon) → **API**
2. Copy these 3 values:

| Variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | "Project URL" |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | "anon public" key |
| `SUPABASE_SERVICE_ROLE_KEY` | "service_role secret" key |

---

## Step 5 — Add to `.env.local`

Open your project's `.env.local` file and add:

```env
ADMIN_PASSWORD=your_secure_admin_password_here
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> ⚠️ Never commit `.env.local` to Git — it's already in `.gitignore`

---

## Step 6 — Restart the Dev Server

```bash
npm run dev
```

---

## Step 7 — Test Everything

1. Open [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
2. Login with your `ADMIN_PASSWORD`
3. Go to **Media Library** → upload an image
4. Go to **Projects** → add a project → publish it
5. Open [http://localhost:3000/work](http://localhost:3000/work) — your project appears!

---

## Deployment to Vercel

1. Push your code to GitHub
2. Import the repo in [vercel.com](https://vercel.com)
3. Add the same 4 environment variables in Vercel → Settings → Environment Variables
4. Deploy

Your Supabase database and storage work perfectly on Vercel — no filesystem limitations.
