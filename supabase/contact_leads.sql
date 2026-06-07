-- Create contact_leads table idempotently
CREATE TABLE IF NOT EXISTS public.contact_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  service TEXT,
  budget TEXT,
  message TEXT NOT NULL,
  source TEXT DEFAULT 'contact_form',
  email_status TEXT,
  whatsapp_status TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.contact_leads ENABLE ROW LEVEL SECURITY;

-- Note: No anonymous SELECT or INSERT policies are created.
-- Server actions run using the service role client which bypasses RLS securely.
-- Administrators can access this table directly via Supabase Studio.
