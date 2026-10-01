import type { MetadataRoute } from 'next';
import { SITE } from '@sencourrier/config';

/**
 * Manifeste PWA.
 * Les icônes maskable permettent une intégration propre sur Android ; les
 * raccourcis exposent les rubriques les plus consultées.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE.name} — ${SITE.tagline}`,
    short_name: SITE.name,
    description: SITE.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#FFFFFF',
    theme_color: '#00853F',
    orientation: 'portrait-primary',
    lang: 'fr-SN',
    dir: 'ltr',
    categories: ['news', 'magazines'],
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    shortcuts: [
      { name: 'À la une', url: '/', description: "L'actualité du jour" },
      { name: 'Dernières minutes', url: '/dernieres-minutes', description: "Le fil d'actualité en continu" },
      { name: 'TV en direct', url: '/tv-live', description: 'SENCOURRIER TV' },
      { name: 'Recherche', url: '/recherche', description: 'Rechercher un article' },
    ],
  };
}
