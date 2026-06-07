import { createServerSupabaseClient } from '@/lib/supabase/server';
import { siteConfig, heroContent, stats as fallbackStats, services as fallbackServices } from '@/lib/data';

// TypeScript interfaces
export interface SiteSettingsData {
  brandName: string;
  tagline: string;
  primaryEmail: string;
  whatsappNumber: string;
  whatsappLink: string;
  address: string;
  twitterUrl: string;
  githubUrl: string;
  linkedinUrl: string;
  facebookUrl: string;
  availability_open: boolean;
  availability_message: string;
}

export interface HomeContent {
  headline: string;
  subheadline: string;
  primaryCTA: string;
  secondaryCTA: string;
  whatsappLink: string;
  availabilityOpen: boolean;
  availabilityMessage: string;
  stats: Array<{ label: string; value: string; suffix: string }>;
}

export interface ServiceItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  shortDescription: string;
  pricingHint: string;
  deliveryTime: string;
  iconName: string;
  features: string[];
  popular: boolean;
  tier: 'starter' | 'professional' | 'enterprise';
}

/**
 * Fetch global site settings from the site_settings table.
 * Falls back safely to siteConfig from src/lib/data.ts.
 */
export async function getSiteSettings(): Promise<SiteSettingsData> {
  const fallback: SiteSettingsData = {
    brandName: siteConfig.brandName,
    tagline: siteConfig.tagline,
    primaryEmail: siteConfig.email,
    whatsappNumber: siteConfig.whatsappNumber,
    whatsappLink: siteConfig.whatsappLink,
    address: '',
    twitterUrl: siteConfig.socials.twitter,
    githubUrl: siteConfig.socials.github,
    linkedinUrl: siteConfig.socials.linkedin,
    facebookUrl: siteConfig.socials.facebook,
    availability_open: siteConfig.availability.open,
    availability_message: siteConfig.availability.message,
  };

  try {
    const supabase = createServerSupabaseClient();
    if (!supabase) return fallback;

    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .limit(1);

    if (error || !data || data.length === 0) return fallback;

    const row = data[0];
    return {
      brandName: row.brand_name || fallback.brandName,
      tagline: row.tagline || fallback.tagline,
      primaryEmail: row.primary_email || fallback.primaryEmail,
      whatsappNumber: row.whatsapp_number || fallback.whatsappNumber,
      whatsappLink: row.whatsapp_link || fallback.whatsappLink,
      address: row.address || fallback.address,
      twitterUrl: row.twitter_url || fallback.twitterUrl,
      githubUrl: row.github_url || fallback.githubUrl,
      linkedinUrl: row.linkedin_url || fallback.linkedinUrl,
      facebookUrl: row.facebook_url || fallback.facebookUrl,
      availability_open: row.availability_open !== undefined ? row.availability_open : fallback.availability_open,
      availability_message: row.availability_message || fallback.availability_message,
    };
  } catch {
    return fallback;
  }
}

/**
 * Fetch home page content (hero, stats, global availability status).
 * Falls back safely to heroContent and stats from src/lib/data.ts.
 */
export async function getHomeContent(): Promise<HomeContent> {
  const settings = await getSiteSettings();

  const fallback: HomeContent = {
    headline: heroContent.headline,
    subheadline: heroContent.subheadline,
    primaryCTA: heroContent.primaryCTA,
    secondaryCTA: heroContent.secondaryCTA,
    whatsappLink: settings.whatsappLink,
    availabilityOpen: settings.availability_open,
    availabilityMessage: settings.availability_message,
    stats: fallbackStats,
  };

  try {
    const supabase = createServerSupabaseClient();
    if (!supabase) return fallback;

    const { data, error } = await supabase
      .from('page_content')
      .select('*')
      .eq('page_key', 'home');

    if (error || !data || data.length === 0) return fallback;

    const heroRow = data.find(row => row.section_key === 'hero');
    const statsRow = data.find(row => row.section_key === 'stats');

    const result = { ...fallback };

    if (heroRow) {
      result.headline = heroRow.title || fallback.headline;
      result.subheadline = heroRow.subtitle || fallback.subheadline;
      result.primaryCTA = heroRow.button_label || fallback.primaryCTA;
      if (heroRow.extra_json && typeof heroRow.extra_json === 'object') {
        const extra = heroRow.extra_json as Record<string, any>;
        if (extra.secondary_button_label) {
          result.secondaryCTA = extra.secondary_button_label;
        }
      }
    }

    if (statsRow && statsRow.extra_json && typeof statsRow.extra_json === 'object') {
      const extra = statsRow.extra_json as Record<string, any>;
      if (Array.isArray(extra.stats)) {
        result.stats = extra.stats.map((s: any) => ({
          label: String(s.label || ''),
          value: String(s.value || ''),
          suffix: String(s.suffix || ''),
        }));
      }
    }

    return result;
  } catch {
    return fallback;
  }
}

/**
 * Fetch published portfolio services.
 * Normalized to standard camelCase properties matching src/lib/data.ts.
 */
export async function getPublishedServices(): Promise<ServiceItem[]> {
  const fallback = fallbackServices.map((s, index) => ({
    id: `static-${index}`,
    title: s.title,
    slug: s.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    category: s.category,
    shortDescription: s.shortDescription,
    pricingHint: s.pricingHint,
    deliveryTime: s.deliveryTime,
    iconName: s.iconName,
    features: s.features,
    popular: s.popular,
    tier: s.tier as 'starter' | 'professional' | 'enterprise',
  }));

  try {
    const supabase = createServerSupabaseClient();
    if (!supabase) return fallback;

    const { data, error } = await supabase
      .from('portfolio_services')
      .select('*')
      .eq('status', 'published')
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) return fallback;

    return data.map((row: any) => ({
      id: row.id,
      title: row.title || '',
      slug: row.slug || '',
      category: row.category || '',
      shortDescription: row.short_description || row.description || '',
      pricingHint: row.price_range || '',
      deliveryTime: row.delivery_time || '',
      iconName: row.icon || 'Code',
      features: Array.isArray(row.features) ? row.features : [],
      popular: Boolean(row.popular),
      tier: (row.tier || 'starter') as 'starter' | 'professional' | 'enterprise',
    }));
  } catch {
    return fallback;
  }
}

/**
 * Fetch About page content.
 * Falls back safely to DEFAULTS.
 */
export async function getAboutContent(): Promise<{
  heroTitle: string;
  heroSubtitle: string;
  storyTitle: string;
  storyBody: string;
  missionTitle: string;
  missionBody: string;
  valuesTitle: string;
  valuesBody: string;
  teamTitle: string;
  teamBody: string;
  ctaTitle: string;
  ctaSubtitle: string;
  ctaButton: string;
}> {
  const fallback = {
    heroTitle: 'About HADITECH',
    heroSubtitle: 'We are a specialist SaaS development studio focused on building scalable, high-performance web applications.',
    storyTitle: 'Our Story',
    storyBody: 'Founded by passionate engineers, HADITECH was built on the belief that great software can transform businesses. We combine deep technical expertise with a design-first mindset to deliver products that users love.',
    missionTitle: 'Our Mission',
    missionBody: 'To empower startups and enterprises with premium digital products that scale — built with care, shipped with speed.',
    valuesTitle: 'Our Values',
    valuesBody: 'Transparency, quality craftsmanship, on-time delivery, and long-term partnerships are at the core of everything we do.',
    teamTitle: 'Meet the Team',
    teamBody: 'A compact, highly skilled team of full-stack engineers, UI/UX designers, and AI specialists.',
    ctaTitle: 'Ready to Build Something Great?',
    ctaSubtitle: "Let's discuss your project and see how HADITECH can help you ship faster.",
    ctaButton: 'Start a Project',
  };

  try {
    const supabase = createServerSupabaseClient();
    if (!supabase) return fallback;

    const { data, error } = await supabase
      .from('page_content')
      .select('*')
      .eq('page_key', 'about');

    if (error || !data || data.length === 0) return fallback;

    const get = (key: string) => data.find(s => s.section_key === key);
    return {
      heroTitle: get('hero')?.title ?? fallback.heroTitle,
      heroSubtitle: get('hero')?.subtitle ?? fallback.heroSubtitle,
      storyTitle: get('story')?.title ?? fallback.storyTitle,
      storyBody: get('story')?.body ?? fallback.storyBody,
      missionTitle: get('mission')?.title ?? fallback.missionTitle,
      missionBody: get('mission')?.body ?? fallback.missionBody,
      valuesTitle: get('values')?.title ?? fallback.valuesTitle,
      valuesBody: get('values')?.body ?? fallback.valuesBody,
      teamTitle: get('team')?.title ?? fallback.teamTitle,
      teamBody: get('team')?.body ?? fallback.teamBody,
      ctaTitle: get('cta')?.title ?? fallback.ctaTitle,
      ctaSubtitle: get('cta')?.subtitle ?? fallback.ctaSubtitle,
      ctaButton: get('cta')?.button_label ?? fallback.ctaButton,
    };
  } catch {
    return fallback;
  }
}

/**
 * Fetch Contact page content.
 * Falls back safely to DEFAULTS.
 */
export async function getContactContent(): Promise<{
  heroTitle: string;
  heroSubtitle: string;
  email: string;
  whatsappNumber: string;
  whatsappLink: string;
  address: string;
  hours: string;
  responseTime: string;
}> {
  const settings = await getSiteSettings();
  const fallback = {
    heroTitle: 'Get In Touch',
    heroSubtitle: "Let's discuss your project. Reach out via WhatsApp or email — we respond within 24 hours.",
    email: settings.primaryEmail || siteConfig.email,
    whatsappNumber: settings.whatsappNumber || siteConfig.whatsappNumber,
    whatsappLink: settings.whatsappLink || siteConfig.whatsappLink,
    address: 'Available Worldwide · Remote First',
    hours: 'Mon–Sat · 9am–7pm PKT',
    responseTime: 'Within 24 hours',
  };

  try {
    const supabase = createServerSupabaseClient();
    if (!supabase) return fallback;

    const { data: sections, error: secError } = await supabase
      .from('page_content')
      .select('*')
      .eq('page_key', 'contact');

    if (secError || !sections) return fallback;

    const hero = sections.find(s => s.section_key === 'hero');
    const info = sections.find(s => s.section_key === 'info');

    return {
      heroTitle: hero?.title ?? fallback.heroTitle,
      heroSubtitle: hero?.subtitle ?? fallback.heroSubtitle,
      email: settings.primaryEmail || fallback.email,
      whatsappNumber: settings.whatsappNumber || fallback.whatsappNumber,
      whatsappLink: settings.whatsappLink || fallback.whatsappLink,
      address: info?.extra_json?.address || settings.address || fallback.address,
      hours: info?.extra_json?.hours || fallback.hours,
      responseTime: info?.extra_json?.response_time || fallback.responseTime,
    };
  } catch {
    return fallback;
  }
}

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  sort_order: number;
  is_active: boolean;
}

/**
 * Fetch active navigation links from the database.
 * Falls back to hardcoded links.
 */
export async function getNavigationItems(): Promise<NavigationItem[]> {
  const fallback: NavigationItem[] = [
    { id: '1', label: 'Home', href: '/', sort_order: 1, is_active: true },
    { id: '2', label: 'Services', href: '/services', sort_order: 2, is_active: true },
    { id: '3', label: 'Projects', href: '/projects', sort_order: 3, is_active: true },
    { id: '4', label: 'Case Studies', href: '/case-studies', sort_order: 4, is_active: true },
    { id: '5', label: 'About', href: '/about', sort_order: 5, is_active: true },
    { id: '6', label: 'Contact', href: '/contact', sort_order: 6, is_active: true },
  ];

  try {
    const supabase = createServerSupabaseClient();
    if (!supabase) return fallback;

    const { data, error } = await supabase
      .from('navigation_items')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) return fallback;

    return data.map((d: any) => ({
      id: d.id,
      label: d.label || '',
      href: d.href || '/',
      sort_order: d.sort_order || 99,
      is_active: Boolean(d.is_active),
    }));
  } catch {
    return fallback;
  }
}

export interface FooterSectionData {
  id: string;
  title: string;
  content: string;
  links: Array<{ label: string; href: string }>;
  sort_order: number;
  is_active: boolean;
}

/**
 * Fetch active footer sections from the database.
 * Falls back to empty list so caller uses static footer elements.
 */
export async function getFooterSections(): Promise<FooterSectionData[]> {
  try {
    const supabase = createServerSupabaseClient();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('footer_sections')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) return [];

    return data.map((d: any) => ({
      id: d.id,
      title: d.title || '',
      content: d.content || '',
      links: Array.isArray(d.links) ? d.links : [],
      sort_order: d.sort_order || 99,
      is_active: Boolean(d.is_active),
    }));
  } catch {
    return [];
  }
}
