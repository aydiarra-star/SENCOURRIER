import type { Metadata } from 'next';
import Link from 'next/link';
import { Bell, Bookmark, Clock, CreditCard, Settings, User } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Mon profil',
  description:
    'Gérez vos informations personnelles, vos préférences éditoriales et vos notifications.',
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

const PREFERENCES = [
  { id: 'politique', label: 'Politique' },
  { id: 'societe', label: 'Société' },
  { id: 'economie', label: 'Économie' },
  { id: 'sports', label: 'Sports' },
  { id: 'technologies', label: 'Technologies' },
  { id: 'international', label: 'International' },
  { id: 'diaspora', label: 'Diaspora' },
  { id: 'faits-divers', label: 'Faits divers' },
];

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-screen-2xl px-4 py-10 sm:px-6 lg:px-8">
      <header>
        <p className="font-ui text-sn-green dark:text-sn-green-400 text-xs font-bold uppercase tracking-wider">
          Espace personnel
        </p>
        <h1 className="font-display mt-1.5 text-3xl font-extrabold tracking-tight">Mon profil</h1>
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
                    className={`hover:text-sn-green flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800 ${
                      href === '/profil'
                        ? 'text-sn-green bg-neutral-50 dark:bg-neutral-800'
                        : 'text-neutral-700 dark:text-neutral-300'
                    }`}
                  >
                    <Icon className="h-4 w-4" aria-hidden />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <div className="space-y-8 lg:col-span-9">
          {/* Informations personnelles */}
          <section
            className="rounded-xl border border-neutral-200 p-6 dark:border-neutral-800"
            aria-labelledby="infos-title"
          >
            <h2 id="infos-title" className="font-display text-lg font-bold tracking-tight">
              Informations personnelles
            </h2>
            <form action="/api/profile" method="post" className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="profile-name" className="block text-sm font-medium">
                  Nom complet
                </label>
                <input
                  id="profile-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  className="focus:border-sn-green focus:ring-sn-green/20 mt-1.5 w-full rounded-md border border-neutral-300 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 dark:border-neutral-700 dark:bg-neutral-950"
                />
              </div>
              <div>
                <label htmlFor="profile-email" className="block text-sm font-medium">
                  Adresse email
                </label>
                <input
                  id="profile-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="focus:border-sn-green focus:ring-sn-green/20 mt-1.5 w-full rounded-md border border-neutral-300 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 dark:border-neutral-700 dark:bg-neutral-950"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="profile-bio" className="block text-sm font-medium">
                  Présentation <span className="text-neutral-400">(facultatif)</span>
                </label>
                <textarea
                  id="profile-bio"
                  name="bio"
                  rows={3}
                  className="focus:border-sn-green focus:ring-sn-green/20 mt-1.5 w-full rounded-md border border-neutral-300 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 dark:border-neutral-700 dark:bg-neutral-950"
                />
              </div>
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="bg-sn-green hover:bg-sn-green-700 rounded-md px-6 py-2.5 text-sm font-semibold text-white"
                >
                  Enregistrer les modifications
                </button>
              </div>
            </form>
          </section>

          {/* Préférences éditoriales */}
          <section
            className="rounded-xl border border-neutral-200 p-6 dark:border-neutral-800"
            aria-labelledby="prefs-title"
          >
            <h2 id="prefs-title" className="font-display text-lg font-bold tracking-tight">
              Rubriques suivies
            </h2>
            <p className="mt-1.5 text-sm text-neutral-600 dark:text-neutral-400">
              Choisissez les rubriques à mettre en avant dans votre fil personnalisé.
            </p>
            <fieldset className="mt-5">
              <legend className="sr-only">Rubriques</legend>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {PREFERENCES.map((pref) => (
                  <label
                    key={pref.id}
                    className="hover:border-sn-green flex cursor-pointer items-center gap-2.5 rounded-lg border border-neutral-200 px-3.5 py-2.5 text-sm transition-colors dark:border-neutral-800"
                  >
                    <input
                      type="checkbox"
                      name="preferences"
                      value={pref.id}
                      className="text-sn-green h-4 w-4 rounded border-neutral-300"
                    />
                    {pref.label}
                  </label>
                ))}
              </div>
            </fieldset>
          </section>

          {/* Sécurité */}
          <section
            className="rounded-xl border border-neutral-200 p-6 dark:border-neutral-800"
            aria-labelledby="security-title"
          >
            <h2 id="security-title" className="font-display text-lg font-bold tracking-tight">
              Sécurité du compte
            </h2>
            <div className="mt-4 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
                <div>
                  <p className="text-sm font-semibold">Authentification à deux facteurs</p>
                  <p className="mt-0.5 text-xs text-neutral-500">
                    Ajoutez une vérification supplémentaire par code à usage unique.
                  </p>
                </div>
                <button
                  type="button"
                  className="hover:border-sn-green hover:text-sn-green rounded-md border border-neutral-300 px-4 py-2 text-xs font-semibold transition-colors dark:border-neutral-700"
                >
                  Activer
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
                <div>
                  <p className="text-sm font-semibold">Mot de passe</p>
                  <p className="mt-0.5 text-xs text-neutral-500">
                    Dernière modification : inconnue. Changez-le régulièrement.
                  </p>
                </div>
                <button
                  type="button"
                  className="hover:border-sn-green hover:text-sn-green rounded-md border border-neutral-300 px-4 py-2 text-xs font-semibold transition-colors dark:border-neutral-700"
                >
                  Modifier
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-200 p-4 dark:border-red-900/50">
                <div>
                  <p className="text-sn-red text-sm font-semibold">Supprimer mon compte</p>
                  <p className="mt-0.5 text-xs text-neutral-500">
                    Cette action est définitive. Vos données seront effacées sous 30 jours.
                  </p>
                </div>
                <button
                  type="button"
                  className="border-sn-red text-sn-red hover:bg-sn-red rounded-md border px-4 py-2 text-xs font-semibold transition-colors hover:text-white"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
