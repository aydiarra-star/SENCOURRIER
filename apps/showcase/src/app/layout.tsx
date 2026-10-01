import type { Metadata, Viewport } from 'next';
import { Inter, Montserrat, Poppins } from 'next/font/google';
import { SITE } from '@sencourrier/config';
import { ShowcaseBanner } from '@/components/layout/showcase-banner';
import { BreakingTicker } from '@/components/layout/breaking-ticker';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { articles, taxonomy } from '@/lib/data';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.name }],
  openGraph: {
    type: 'website',
    locale: 'fr_SN',
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFFFFF' },
    { media: '(prefers-color-scheme: dark)', color: '#0B1220' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // L'aperçu ne génère une page que pour les rubriques ayant au moins un
  // article publié : exposer les autres produirait des liens morts.
  const published = new Set(
    articles.sections
      .filter((section) => section.articles.length > 0)
      .map((section) => section.slug),
  );
  const navCategories = taxonomy.categories.filter((category) => published.has(category.slug));

  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={`${inter.variable} ${montserrat.variable} ${poppins.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('sencourrier-theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark');}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-screen bg-white font-sans text-neutral-900 antialiased dark:bg-neutral-950 dark:text-neutral-100">
        <a
          href="#contenu"
          className="focus:bg-sn-green sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:px-4 focus:py-2 focus:text-white"
        >
          Aller au contenu principal
        </a>
        <ShowcaseBanner />
        <BreakingTicker items={articles.breaking} />
        <Header categories={navCategories} />
        <main id="contenu">{children}</main>
        <Footer categories={navCategories} />
      </body>
    </html>
  );
}
