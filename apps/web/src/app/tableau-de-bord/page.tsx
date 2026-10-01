import type { Metadata } from 'next';
import Link from 'next/link';
import { Bell, Bookmark, Clock, Settings, User, CreditCard } from 'lucide-react';
import { ArticleCard } from '@/components/news/article-card';
import { getArticleCards } from '@/lib/queries';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Tableau de bord',
  description:
    'Votre espace personnel SENCOURRIER : favoris, historique de lecture, abonnement et préférences.',
  robots: { index: false, follow: false },
};

const NAV = [
  { href: '/tableau-de-bord', label: 'Vue d’ensemble', icon: User },
  { href: '/profil', label: 'Mon profil', icon: Settings },
  { href: '/profil/favoris', label: 'Mes favoris', icon: Bookmark },
  { href: '/profil/historique', label: 'Historique de lecture', icon: Clock },
  { href: '/notifications', label: 'Notifications', icon: Bell },
  { href: '/abonnement', label: 'Mon abonnement', icon: CreditCard },
];

export default async function DashboardPage() {
  const suggestions = await getArticleCards({ limit: 4 });

  return (
    <div className="mx-auto max-w-screen-2xl px-4 py-10 sm:px-6 lg:px-8">
      <header>
        <p className="font-ui text-sn-green dark:text-sn-green-400 text-xs font-bold uppercase tracking-wider">
          Espace personnel
        </p>
        <h1 className="font-display mt-1.5 text-3xl font-extrabold tracking-tight">
          Tableau de bord
        </h1>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
          Retrouvez vos lectures, vos favoris et les réglages de votre compte.
        </p>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        <aside className="lg:col-span-3">
          <nav
            aria-label="Navigation de l'espace personnel"
            className="rounded-lg border border-neutral-200 p-2 dark:border-neutral-800"
          >
            <ul>
              {NAV.map(({ href, label, icon: Icon }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="hover:text-sn-green flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-800"
                  >
                    <Icon className="h-4 w-4" aria-hidden />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <div className="lg:col-span-9">
          {/* Cartes de statistiques */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'Articles sauvegardés', value: '—' },
              { label: 'Articles lus ce mois', value: '—' },
              { label: 'Rubriques suivies', value: '—' },
              { label: 'Statut abonnement', value: 'Gratuit' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-lg border border-neutral-200 p-5 dark:border-neutral-800"
              >
                <p className="font-ui text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                  {stat.label}
                </p>
                <p className="font-display mt-2 text-2xl font-extrabold tracking-tight">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Invitation Premium */}
          <section className="border-sn-yellow bg-sn-yellow-50 mt-8 overflow-hidden rounded-xl border dark:bg-neutral-900">
            <div className="senegal-rule h-1.5 w-full" aria-hidden />
            <div className="p-6">
              <h2 className="font-display text-xl font-extrabold tracking-tight">
                Passez à SENCOURRIER Premium
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                Accédez aux enquêtes exclusives, aux dossiers spéciaux et aux podcasts premium, et
                naviguez sans aucune publicité.
              </p>
              <Link
                href="/abonnement"
                className="bg-sn-green hover:bg-sn-green-700 mt-4 inline-block rounded-md px-6 py-3 text-sm font-semibold text-white"
              >
                Découvrir les offres
              </Link>
            </div>
          </section>

          {/* Recommandations */}
          <section className="mt-10" aria-labelledby="reco-title">
            <h2
              id="reco-title"
              className="font-display mb-5 border-b-2 border-neutral-900 pb-2 text-lg font-extrabold uppercase tracking-tight dark:border-neutral-100"
            >
              Recommandé pour vous
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {suggestions.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  variant="standard"
                  showExcerpt={false}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
