/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: process.env.NODE_ENV === 'development',
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'img.youtube.com' },
      { protocol: 'https', hostname: '**.amazonaws.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'offhrhxyclchocfccgtd.supabase.co' },
      { protocol: 'https', hostname: '**.supabase.co' },
    ],
  },
  async redirects() {
    return [
      {
        source: '/work',
        destination: '/portfolio',
        permanent: true,
      },
      {
        source: '/work/:slug',
        destination: '/portfolio/:slug',
        permanent: true,
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.youtube.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: blob: https://offhrhxyclchocfccgtd.supabase.co https://*.supabase.co https://img.youtube.com https://*.amazonaws.com https://images.unsplash.com; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://offhrhxyclchocfccgtd.supabase.co https://*.supabase.co; frame-src 'self' https://www.youtube.com https://*.youtube.com; object-src 'none';",
          },
        ],
      },
    ]
  },
}
module.exports = nextConfig

