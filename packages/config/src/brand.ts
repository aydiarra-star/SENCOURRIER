/**
 * SENCOURRIER brand identity.
 *
 * The four colours are the national colours of Senegal; `slate` is the
 * "premium grey" used for typography and surfaces so the tricolour stays
 * reserved for accents, eyebrows and calls to action.
 */

export const BRAND = {
  name: 'SENCOURRIER',
  shortName: 'SENCOURRIER',
  tagline: 'Le média numérique de référence du Sénégal',
  description:
    'SENCOURRIER est le média numérique de référence du Sénégal : actualité politique, société, économie, sports, technologies, international et diaspora, en continu et en toute indépendance.',
  locale: 'fr_SN',
  language: 'fr',
  country: 'SN',
  timezone: 'Africa/Dakar',
  foundedYear: 2024,
  publisher: 'SENCOURRIER Médias',
  contactEmail: 'contact@sencourrier.sn',
  editorialEmail: 'redaction@sencourrier.sn',
  supportEmail: 'support@sencourrier.sn',
  phone: '+221 33 000 00 00',
  address: {
    street: 'Immeuble SENCOURRIER, Avenue Léopold Sédar Senghor',
    city: 'Dakar',
    postalCode: '11500',
    country: 'Sénégal',
  },
  social: {
    facebook: 'https://www.facebook.com/sencourrier',
    x: 'https://x.com/sencourrier',
    instagram: 'https://www.instagram.com/sencourrier',
    youtube: 'https://www.youtube.com/@sencourrier',
    tiktok: 'https://www.tiktok.com/@sencourrier',
    linkedin: 'https://www.linkedin.com/company/sencourrier',
    whatsapp: 'https://whatsapp.com/channel/sencourrier',
    telegram: 'https://t.me/sencourrier',
  },
} as const;

/** Design tokens — mirrored 1:1 into the Tailwind preset and the CSS variables. */
export const COLORS = {
  green: {
    /** Vert Sénégal */
    DEFAULT: '#00853F',
    50: '#E6F5EC',
    100: '#C2E6D3',
    200: '#8FD3B1',
    300: '#5CBF8E',
    400: '#29AC6C',
    500: '#00853F',
    600: '#007538',
    700: '#00602E',
    800: '#004B24',
    900: '#00361A',
  },
  yellow: {
    /** Jaune Or */
    DEFAULT: '#FCD116',
    50: '#FFFBE6',
    100: '#FFF4BF',
    200: '#FDEA80',
    300: '#FDE040',
    400: '#FCD116',
    500: '#E0B800',
    600: '#B89600',
    700: '#8F7400',
    800: '#665300',
    900: '#3D3100',
  },
  red: {
    /** Rouge */
    DEFAULT: '#E31B23',
    50: '#FDECEC',
    100: '#FAC9CB',
    200: '#F59398',
    300: '#EF5D64',
    400: '#E93B44',
    500: '#E31B23',
    600: '#C4171E',
    700: '#A01319',
    800: '#7C0F13',
    900: '#580B0E',
  },
  slate: {
    /** Gris Premium */
    DEFAULT: '#1F2937',
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1F2937',
    900: '#111827',
    950: '#0B1220',
  },
  white: '#FFFFFF',
} as const;

export const TYPOGRAPHY = {
  /** Display / headlines. */
  display: 'Montserrat',
  /** Body copy — optimised for long-form French reading. */
  body: 'Inter',
  /** UI chrome, labels, badges. */
  ui: 'Poppins',
} as const;

export const FONTS_GOOGLE_URL =
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@600;700;800;900&family=Poppins:wght@400;500;600;700&display=swap';

/** Editorial "kicker" accents used to colour category eyebrows consistently. */
export const CATEGORY_ACCENT_CLASSES: Record<string, { text: string; bg: string; border: string }> =
  {
    green: { text: 'text-brand-green', bg: 'bg-brand-green', border: 'border-brand-green' },
    yellow: { text: 'text-brand-yellow-600', bg: 'bg-brand-yellow', border: 'border-brand-yellow' },
    red: { text: 'text-brand-red', bg: 'bg-brand-red', border: 'border-brand-red' },
    slate: {
      text: 'text-brand-slate-700',
      bg: 'bg-brand-slate-800',
      border: 'border-brand-slate-800',
    },
    blue: { text: 'text-sky-700', bg: 'bg-sky-700', border: 'border-sky-700' },
    violet: { text: 'text-violet-700', bg: 'bg-violet-700', border: 'border-violet-700' },
    orange: { text: 'text-orange-600', bg: 'bg-orange-600', border: 'border-orange-600' },
    teal: { text: 'text-teal-700', bg: 'bg-teal-700', border: 'border-teal-700' },
  };

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;
