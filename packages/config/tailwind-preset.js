/**
 * SENCOURRIER Tailwind preset — the single source of truth for the design
 * system. Consumed by apps/web/tailwind.config.ts so that future surfaces
 * (admin, mobile webviews) stay visually identical.
 */
const brandGreen = {
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
  DEFAULT: '#00853F',
};

const brandYellow = {
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
  DEFAULT: '#FCD116',
};

const brandRed = {
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
  DEFAULT: '#E31B23',
};

const premiumSlate = {
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
  DEFAULT: '#1F2937',
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1rem', sm: '1.25rem', lg: '2rem', xl: '2.5rem' },
      screens: { sm: '640px', md: '768px', lg: '1024px', xl: '1280px', '2xl': '1440px' },
    },
    extend: {
      colors: {
        brand: {
          green: brandGreen,
          yellow: brandYellow,
          red: brandRed,
          slate: premiumSlate,
        },
        // Alias court utilisé dans les composants éditoriaux : `sn-green`,
        // `sn-yellow`, `sn-red`, `sn-slate`.
        sn: {
          green: brandGreen,
          yellow: brandYellow,
          red: brandRed,
          slate: premiumSlate,
        },
        senegal: {
          green: '#00853F',
          yellow: '#FCD116',
          red: '#E31B23',
        },
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
        popover: { DEFAULT: 'hsl(var(--popover))', foreground: 'hsl(var(--popover-foreground))' },
        primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
        accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
      },
      fontFamily: {
        display: ['var(--font-montserrat)', 'Montserrat', 'system-ui', 'sans-serif'],
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        ui: ['var(--font-poppins)', 'Poppins', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'headline-xl': ['3.5rem', { lineHeight: '1.05', letterSpacing: '-0.03em', fontWeight: '800' }],
        'headline-lg': ['2.5rem', { lineHeight: '1.1', letterSpacing: '-0.025em', fontWeight: '800' }],
        'headline-md': ['1.875rem', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '700' }],
        'headline-sm': ['1.375rem', { lineHeight: '1.25', letterSpacing: '-0.015em', fontWeight: '700' }],
        kicker: ['0.6875rem', { lineHeight: '1', letterSpacing: '0.09em', fontWeight: '700' }],
        byline: ['0.8125rem', { lineHeight: '1.4', letterSpacing: '0.01em', fontWeight: '500' }],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        xs: 'calc(var(--radius) - 6px)',
      },
      boxShadow: {
        editorial: '0 1px 2px rgba(15, 23, 42, 0.06), 0 8px 24px -12px rgba(15, 23, 42, 0.18)',
        'editorial-lg': '0 2px 4px rgba(15, 23, 42, 0.06), 0 24px 48px -20px rgba(15, 23, 42, 0.28)',
        premium: '0 0 0 1px rgba(252, 209, 22, 0.35), 0 12px 32px -16px rgba(0, 133, 63, 0.45)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'ticker-in': {
          from: { opacity: '0', transform: 'translateY(100%)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        'pulse-live': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.45', transform: 'scale(0.88)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'ticker-in': 'ticker-in 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
        marquee: 'marquee 40s linear infinite',
        'pulse-live': 'pulse-live 1.4s ease-in-out infinite',
        shimmer: 'shimmer 1.6s infinite',
        'fade-up': 'fade-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) both',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            maxWidth: '72ch',
            color: theme('colors.brand.slate.800'),
            fontFamily: theme('fontFamily.sans').join(', '),
            fontSize: '1.125rem',
            lineHeight: '1.75',
            a: { color: theme('colors.brand.green.600'), textDecoration: 'underline', fontWeight: '500' },
            'a:hover': { color: theme('colors.brand.green.700') },
            strong: { color: theme('colors.brand.slate.900'), fontWeight: '700' },
            'h2, h3, h4': {
              fontFamily: theme('fontFamily.display').join(', '),
              color: theme('colors.brand.slate.900'),
              fontWeight: '800',
              letterSpacing: '-0.02em',
            },
            blockquote: {
              borderLeftColor: theme('colors.brand.green.500'),
              borderLeftWidth: '4px',
              fontStyle: 'normal',
              fontWeight: '600',
              color: theme('colors.brand.slate.700'),
              paddingLeft: '1.25rem',
            },
            'figure figcaption': { color: theme('colors.brand.slate.500'), fontSize: '0.875rem' },
            hr: { borderColor: theme('colors.brand.slate.200') },
            'ul > li::marker': { color: theme('colors.brand.green.500') },
          },
        },
        invert: {
          css: {
            color: theme('colors.brand.slate.200'),
            strong: { color: theme('colors.white') },
            'h2, h3, h4': { color: theme('colors.white') },
            a: { color: theme('colors.brand.green.300') },
          },
        },
      }),
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
};
