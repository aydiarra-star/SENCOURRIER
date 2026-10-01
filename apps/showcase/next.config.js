const path = require('path');

/**
 * L'aperçu est publié sur GitHub Pages, sous https://<compte>.github.io/SENCOURRIER/.
 * Le site est donc exporté en fichiers statiques et servi depuis un sous-chemin.
 */
const basePath = '/SENCOURRIER';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  output: 'export',
  basePath,
  trailingSlash: true,

  // GitHub Pages ne peut pas exécuter l'optimiseur d'images de Next.js.
  images: { unoptimized: true },

  transpilePackages: ['@sencourrier/types', '@sencourrier/config'],

  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },

  experimental: {
    optimizePackageImports: ['lucide-react', 'date-fns'],
  },

  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@sencourrier/types': path.resolve(__dirname, '../../packages/types/src/index.ts'),
      '@sencourrier/config': path.resolve(__dirname, '../../packages/config/src/index.ts'),
    };
    return config;
  },
};

module.exports = nextConfig;
