import Link from 'next/link';
import { Logo } from '@/components/layout/logo';
import { SITE } from '@sencourrier/config';

interface FooterCategory {
  id: string;
  slug: string;
  name: string;
}

const ISSN = '0000-0000';

const SECTIONS_LEGALES = [
  { href: '/legal/mentions-legales', label: 'Mentions légales' },
  { href: '/legal/confidentialite', label: 'Politique de confidentialité' },
  { href: '/legal/cgu', label: "Conditions générales d'utilisation" },
  { href: '/legal/cgv', label: 'Conditions générales de vente' },
];

const SERVICES = [
  { href: '/abonnement', label: 'Abonnement Premium' },
  { href: '/recherche', label: 'Recherche' },
  { href: '/dernieres-minutes', label: 'Dernières minutes' },
];

export function Footer({ categories }: { categories: FooterCategory[] }) {
  return (
    <footer className="border-sn-green mt-16 border-t-4 bg-neutral-900 text-neutral-300 dark:bg-black">
      <div className="mx-auto max-w-screen-2xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" aria-label="SENCOURRIER — accueil">
              <Logo className="h-9 w-auto brightness-0 invert" />
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-neutral-400">
              {SITE.tagline}. Une rédaction indépendante au service de l&apos;information
              sénégalaise et africaine, 24 heures sur 24.
            </p>
            <p className="mt-4 text-xs text-neutral-500">
              ISSN : {ISSN}
              <br />
              Membre du réseau de la presse en ligne du Sénégal.
            </p>
          </div>

          <nav aria-labelledby="footer-rubriques">
            <h2
              id="footer-rubriques"
              className="font-display text-sm font-bold uppercase tracking-wider text-white"
            >
              Rubriques
            </h2>
            <ul className="mt-4 space-y-2.5">
              {categories.slice(0, 8).map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/rubrique/${category.slug}`}
                    className="hover:text-sn-yellow text-sm text-neutral-400 transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-services">
            <h2
              id="footer-services"
              className="font-display text-sm font-bold uppercase tracking-wider text-white"
            >
              Services
            </h2>
            <ul className="mt-4 space-y-2.5">
              {SERVICES.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="hover:text-sn-yellow text-sm text-neutral-400 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-legal">
            <h2
              id="footer-legal"
              className="font-display text-sm font-bold uppercase tracking-wider text-white"
            >
              Informations
            </h2>
            <ul className="mt-4 space-y-2.5">
              {SECTIONS_LEGALES.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="hover:text-sn-yellow text-sm text-neutral-400 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-neutral-800 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-neutral-500">
            © {new Date().getFullYear()} {SITE.name}. Tous droits réservés. ISSN {ISSN}.
          </p>
          <p className="flex items-center gap-2 text-xs text-neutral-500">
            <span className="inline-flex h-3 w-6 overflow-hidden rounded-sm" aria-hidden>
              <span className="bg-sn-green h-full w-1/3" />
              <span className="bg-sn-yellow h-full w-1/3" />
              <span className="bg-sn-red h-full w-1/3" />
            </span>
            Fièrement conçu et hébergé au Sénégal
          </p>
        </div>
      </div>
    </footer>
  );
}
