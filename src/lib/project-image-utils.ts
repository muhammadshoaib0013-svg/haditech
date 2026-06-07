/**
 * Shared URL helper utilities for project image handling.
 * This file has NO 'use client' directive so it can be imported in both
 * Server Components and Client Components.
 */

export function normalizeScreenshots(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter(Boolean).map(String);

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.filter(Boolean).map(String);
      return value.trim() ? [value.trim()] : [];
    } catch {
      return value.trim() ? [value.trim()] : [];
    }
  }

  return [];
}

export function isLikelyImageUrl(url?: string | null): boolean {
  if (!url) return false;

  const value = url.trim();

  if (value.includes('youtube.com/watch') || value.includes('youtu.be/')) {
    return false;
  }

  const clean = value.toLowerCase().split('?')[0];

  return (
    clean.endsWith('.jpg') ||
    clean.endsWith('.jpeg') ||
    clean.endsWith('.png') ||
    clean.endsWith('.webp') ||
    clean.endsWith('.gif') ||
    value.includes('/storage/v1/object/public/')
  );
}

export function isImageUrl(url?: string | null): boolean {
  return isLikelyImageUrl(url);
}

export function isYouTubeUrl(url?: string | null): boolean {
  if (!url) return false;
  return (
    url.includes('youtube.com/watch') ||
    url.includes('youtu.be/') ||
    url.includes('youtube.com/embed')
  );
}

export function getProjectPrimaryImage(project: any): string | null {
  const direct =
    project.primary_image_url ||
    project.primaryImageUrl ||
    project.primaryImage ||
    project.image_url ||
    project.imageUrl ||
    project.thumbnail ||
    project.thumbnailUrl ||
    null;

  if (isLikelyImageUrl(direct)) return direct;

  const screenshots = normalizeScreenshots(project.screenshots);
  return screenshots.find(isLikelyImageUrl) || null;
}
