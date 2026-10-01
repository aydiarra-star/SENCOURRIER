const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  productionBrowserSourceMaps: false,

  // Sortie autonome : l'image Docker n'embarque que le serveur et les
  // dépendances réellement atteintes, sans node_modules complet.
  output: 'standalone',
  outputFileTracingRoot: path.join(__dirname, '../../'),

  transpilePackages: ['@sencourrier/types', '@sencourrier/config', '@sencourrier/database'],

  experimental: {
    optimizePackageImports: ['lucide-react', 'date-fns', 'framer-motion', 'recharts'],
  },

  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 480, 640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 24, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      { protocol: 'https', hostname: '**.blob.core.windows.net' },
      { protocol: 'https', hostname: 'sencourrier.blob.core.windows.net' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'fastly.picsum.photos' },
      { protocol: 'https', hostname: 'i.ytimg.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self), interest-cohort=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
      {
        source: '/:path*\\.(svg|png|jpg|jpeg|webp|avif|woff2|ico)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/sw.js',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
          { key: 'Service-Worker-Allowed', value: '/' },
        ],
      },
    ];
  },

  async redirects() {
    return [
      { source: '/news', destination: '/', permanent: true },
      { source: '/feed', destination: '/rss.xml', permanent: true },
      { source: '/admin', destination: '/redaction/tableau-de-bord', permanent: false },
    ];
  },

  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@sencourrier/types': path.resolve(__dirname, '../../packages/types/src/index.ts'),
      '@sencourrier/config': path.resolve(__dirname, '../../packages/config/src/index.ts'),
      '@sencourrier/database': path.resolve(__dirname, '../../packages/database/src/index.ts'),
    };
    return config;
  },
};

module.exports = nextConfig;
