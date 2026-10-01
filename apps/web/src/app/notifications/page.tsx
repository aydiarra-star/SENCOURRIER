import type { Metadata } from 'next';
import Link from 'next/link';
import { Bell, Bookmark, Clock, CreditCard, Settings, User } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Notifications',
  description: 'Gérez vos alertes d’actualité urgente, vos notifications d’articles et vos newsletters.',
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

const CHANNELS = [
  {
    id: 'breaking',
    label: 'Actualité urgente',
    description: "Notification immédiate dès qu'une information majeure est confirmée.",
    channels: ['push', 'email'],
  },
  {
    id: 'new-articles',
    label: 'Nouveaux articles des rubriques suivies',
    description: 'Recevez les publications des rubriques que vous suivez, groupées en un envoi.',
    channels: ['email'],
  },
  {
    id: 'authors',
    label: 'Publications des journalistes suivis',
    description: 'Soyez alerté à chaque publication d’un journaliste que vous suivez.',
    channels: ['email'],
  },
  {
    id: 'newsletters',
    label: 'Newsletters',
    description: "L'Essentiel du matin, Économie & entreprises et Diaspora.",
    channels: ['email'],
  },
  {
    id: 'premium',
    label: 'Offres et actualités Premium',
    description: 'Informations sur les évolutions de votre abonnement et les nouvelles offres.',
    channels: ['email'],
  },
];

export default function NotificationsPage() {
  return (
    <div className="mx-auto max-w-screen-2xl px-4 py-10 sm:px-6 lg:px-8">
      <header>
        <p className="font-ui text-xs font-bold uppercase tracking-wider text-sn-green dark:text-sn-green-400">
          Espace personnel
        </p>
        <h1 className="mt-1.5 font-display text-3xl font-extrabold tracking-tight">Notifications</h1>
        <p className="mt-2 max-w-2xl text-sm text-neutral-600 dark:text-neutral-400">
          Choisissez précisément ce que vous souhaitez recevoir. Vous pouvez modifier ces réglages
          à tout moment.
        </p>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        <aside className="lg:col-span-3">
          <nav aria-label="Navigation de l'espace personnel" className="rounded-lg border border-neutral-200 p-2 dark:border-neutral-800">
            <ul>
              {NAV.map(({ href, label, icon: Icon }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className={`flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-neutral-50 hover:text-sn-green dark:hover:bg-neutral-800 ${
                      href === '/notifications'
                        ? 'bg-neutral-50 text-sn-green dark:bg-neutral-800'
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

        <div className="lg:col-span-9">
          <form action="/api/notifications/preferences" method="post" className="space-y-4">
            {CHANNELS.map((channel) => (
              <fieldset
                key={channel.id}
                className="rounded-xl border border-neutral-200 p-5 dark:border-neutral-800"
              >
                <legend className="sr-only">{channel.label}</legend>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="max-w-xl">
                    <p className="text-sm font-semibold">{channel.label}</p>
                    <p className="mt-1 text-xs leading-relaxed text-neutral-500">{channel.description}</p>
                  </div>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-xs font-medium">
                      <input
                        type="checkbox"
                        name={`${channel.id}-email`}
                        defaultChecked={channel.channels.includes('email')}
                        className="h-4 w-4 rounded border-neutral-300 text-sn-green"
                      />
                      Email
                    </label>
                    <label className="flex items-center gap-2 text-xs font-medium">
                      <input
                        type="checkbox"
                        name={`${channel.id}-push`}
                        defaultChecked={channel.channels.includes('push')}
                        className="h-4 w-4 rounded border-neutral-300 text-sn-green"
                      />
                      Notification push
                    </label>
                  </div>
                </div>
              </fieldset>
            ))}

            <button
              type="submit"
              className="rounded-md bg-sn-green px-6 py-2.5 text-sm font-semibold text-white hover:bg-sn-green-700"
            >
              Enregistrer mes préférences
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
