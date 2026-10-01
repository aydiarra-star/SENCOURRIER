'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, Search, X, ChevronDown, Bell, User, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { Logo } from '@/components/layout/logo';

interface NavCategory {
  id: string;
  slug: string;
  name: string;
  shortName: string | null;
  accent: string;
  children: { id: string; slug: string; name: string }[];
}

export function Header({ categories }: { categories: NavCategory[] }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Toute navigation referme les panneaux ouverts.
  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    setOpenMenu(null);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const isActive = (slug: string) => pathname.startsWith(`/rubrique/${slug}`);

  return (
    <header
      className={cn(
        'sticky top-0 z-30 border-b border-neutral-200 bg-white/95 backdrop-blur transition-shadow dark:border-neutral-800 dark:bg-neutral-950/95',
        scrolled && 'shadow-sm',
      )}
    >
      <div className="mx-auto flex max-w-screen-2xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="-ml-2 rounded-md p-2 text-neutral-700 hover:bg-neutral-100 lg:hidden dark:text-neutral-200 dark:hover:bg-neutral-800"
          aria-label="Ouvrir le menu"
          aria-expanded={mobileOpen}
        >
          <Menu className="h-5 w-5" />
        </button>

        <Link href="/" className="shrink-0" aria-label="SENCOURRIER — accueil">
          <Logo className="h-8 w-auto sm:h-9" />
        </Link>

        <nav
          className="ml-4 hidden flex-1 items-center gap-0.5 lg:flex"
          aria-label="Navigation principale"
        >
          {categories.slice(0, 7).map((category) => (
            <div
              key={category.id}
              className="relative"
              onMouseEnter={() => setOpenMenu(category.id)}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <Link
                href={`/rubrique/${category.slug}`}
                className={cn(
                  'flex items-center gap-0.5 rounded-md px-3 py-2 text-sm font-semibold transition-colors',
                  isActive(category.slug)
                    ? 'text-sn-green dark:text-sn-green-400'
                    : 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800',
                )}
                aria-current={isActive(category.slug) ? 'page' : undefined}
              >
                {category.shortName ?? category.name}
                {category.children.length > 0 && (
                  <ChevronDown className="h-3.5 w-3.5 opacity-60" aria-hidden />
                )}
              </Link>

              {category.children.length > 0 && openMenu === category.id && (
                <div className="absolute left-0 top-full z-40 w-64 pt-1">
                  <ul className="overflow-hidden rounded-lg border border-neutral-200 bg-white py-1.5 shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
                    {category.children.map((child) => (
                      <li key={child.id}>
                        <Link
                          href={`/rubrique/${category.slug}`}
                          className="hover:text-sn-green block px-4 py-2 text-sm text-neutral-700 transition-colors hover:bg-neutral-50 dark:text-neutral-200 dark:hover:bg-neutral-800"
                        >
                          {child.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-0.5">
          <button
            type="button"
            onClick={() => setSearchOpen((v) => !v)}
            className="rounded-md p-2 text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
            aria-label="Rechercher"
            aria-expanded={searchOpen}
          >
            <Search className="h-[18px] w-[18px]" />
          </button>

          <ThemeToggle />

          <Link
            href="/recherche"
            className="relative rounded-md p-2 text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
            aria-label="Notifications"
          >
            <Bell className="h-[18px] w-[18px]" />
          </Link>

          <Link
            href="/abonnement"
            className="hidden rounded-md p-2 text-neutral-700 hover:bg-neutral-100 sm:block dark:text-neutral-200 dark:hover:bg-neutral-800"
            aria-label="Se connecter"
          >
            <User className="h-[18px] w-[18px]" />
          </Link>

          <Link
            href="/abonnement"
            className="bg-sn-green hover:bg-sn-green-700 ml-1 hidden items-center gap-1.5 rounded-md px-3.5 py-2 text-sm font-semibold text-white transition-colors sm:flex"
          >
            <Crown className="h-3.5 w-3.5" aria-hidden />
            Premium
          </Link>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900">
          <form
            action="/recherche"
            method="get"
            className="mx-auto flex max-w-screen-2xl gap-2 px-4 py-3 sm:px-6 lg:px-8"
          >
            <label htmlFor="site-search" className="sr-only">
              Rechercher sur SENCOURRIER
            </label>
            <input
              id="site-search"
              name="q"
              type="search"
              autoFocus
              placeholder="Rechercher une information, un sujet, un auteur…"
              className="focus:border-sn-green focus:ring-sn-green/20 flex-1 rounded-md border border-neutral-300 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 dark:border-neutral-700 dark:bg-neutral-950"
            />
            <button
              type="submit"
              className="bg-sn-green hover:bg-sn-green-700 rounded-md px-5 py-2.5 text-sm font-semibold text-white"
            >
              Rechercher
            </button>
          </form>
        </div>
      )}

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-neutral-900/60"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <div className="absolute inset-y-0 left-0 w-[86%] max-w-sm overflow-y-auto bg-white shadow-2xl dark:bg-neutral-950">
            <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
              <Logo className="h-8 w-auto" />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="rounded-md p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                aria-label="Fermer le menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="px-2 py-3" aria-label="Navigation mobile">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="border-b border-neutral-100 last:border-0 dark:border-neutral-800/60"
                >
                  <Link
                    href={`/rubrique/${category.slug}`}
                    className={cn(
                      'block px-3 py-3 text-base font-semibold',
                      isActive(category.slug)
                        ? 'text-sn-green'
                        : 'text-neutral-800 dark:text-neutral-100',
                    )}
                  >
                    {category.name}
                  </Link>
                  {category.children.length > 0 && (
                    <ul className="pb-2 pl-3">
                      {category.children.map((child) => (
                        <li key={child.id}>
                          <Link
                            href={`/rubrique/${category.slug}`}
                            className="block px-3 py-2 text-sm text-neutral-600 dark:text-neutral-400"
                          >
                            {child.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </nav>

            <div className="flex flex-col gap-2 px-5 pb-8">
              <Link
                href="/abonnement"
                className="bg-sn-green flex items-center justify-center gap-2 rounded-md px-4 py-3 text-sm font-semibold text-white"
              >
                <Crown className="h-4 w-4" aria-hidden />
                S&apos;abonner à Premium
              </Link>
              <Link
                href="/abonnement"
                className="flex items-center justify-center rounded-md border border-neutral-300 px-4 py-3 text-sm font-semibold dark:border-neutral-700"
              >
                Se connecter
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
