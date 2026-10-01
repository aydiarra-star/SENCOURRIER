import type { Metadata } from 'next';
import { Mail, Bell, Newspaper, Flame } from 'lucide-react';
import { JsonLd, breadcrumbSchema } from '@/components/seo/json-ld';

export const metadata: Metadata = {
  title: 'Newsletters',
  description:
    "Abonnez-vous aux newsletters de SENCOURRIER : l'essentiel du matin, alertes urgentes, économie et diaspora.",
  alternates: { canonical: '/newsletter' },
};

const NEWSLETTERS = [
  {
    id: 'essentiel',
    icon: Newspaper,
    name: "L'Essentiel du matin",
    frequency: 'Tous les jours à 7 h',
    description:
      'Les dix informations à retenir de la journée écoulée et les rendez-vous à venir, résumés en cinq minutes de lecture.',
    subscribers: '48 200 abonnés',
  },
  {
    id: 'alerte',
    icon: Flame,
    name: 'Alerte urgente',
    frequency: 'En temps réel',
    description:
      "Une notification dès qu'une information majeure est confirmée par la rédaction. Fréquence strictement limitée aux événements d'importance nationale.",
    subscribers: '31 500 abonnés',
  },
  {
    id: 'economie',
    icon: Mail,
    name: 'Économie & entreprises',
    frequency: 'Chaque mardi',
    description:
      "L'analyse des marchés, les levées de fonds des startups sénégalaises, la conjoncture et les décisions qui pèsent sur l'économie réelle.",
    subscribers: '12 800 abonnés',
  },
  {
    id: 'diaspora',
    icon: Bell,
    name: 'Diaspora',
    frequency: 'Chaque vendredi',
    description:
      "Transfers d'argent, politiques migratoires, réussites et initiatives de la diaspora sénégalaise en Europe, en Amérique et en Asie.",
    subscribers: '9 400 abonnés',
  },
];

export default function NewsletterPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Accueil', url: '/' },
          { name: 'Newsletters', url: '/newsletter' },
        ])}
      />

      <div className="border-b border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/50">
        <div className="mx-auto max-w-screen-2xl px-4 py-10 sm:px-6 lg:px-8">
          <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            Newsletters
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            Recevez l&apos;essentiel de l&apos;actualité directement dans votre boîte mail. Gratuit,
            sans publicité, désinscription en un clic depuis chaque envoi.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="space-y-4">
          {NEWSLETTERS.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.id}
                className="flex flex-col gap-4 rounded-xl border border-neutral-200 p-6 sm:flex-row sm:items-start dark:border-neutral-800"
              >
                <span className="bg-sn-green/10 text-sn-green dark:bg-sn-green/20 flex h-11 w-11 shrink-0 items-center justify-center rounded-full">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>

                <div className="flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h2 className="font-display text-lg font-bold tracking-tight">{item.name}</h2>
                    <span className="font-ui text-sn-green dark:text-sn-green-400 text-[11px] font-semibold uppercase tracking-wider">
                      {item.frequency}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                    {item.description}
                  </p>
                  <p className="mt-2 text-xs text-neutral-400">{item.subscribers}</p>
                </div>

                <form
                  action="/api/newsletter/subscribe"
                  method="post"
                  className="flex shrink-0 flex-col gap-2 sm:w-56"
                >
                  <input type="hidden" name="list" value={item.id} />
                  <label htmlFor={`nl-${item.id}`} className="sr-only">
                    Votre adresse email pour {item.name}
                  </label>
                  <input
                    id={`nl-${item.id}`}
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="votre.email@exemple.sn"
                    className="focus:border-sn-green focus:ring-sn-green/20 rounded-md border border-neutral-300 bg-white px-3.5 py-2.5 text-sm outline-none focus:ring-2 dark:border-neutral-700 dark:bg-neutral-950"
                  />
                  <button
                    type="submit"
                    className="bg-sn-green hover:bg-sn-green-700 rounded-md px-4 py-2.5 text-sm font-semibold text-white transition-colors"
                  >
                    S&apos;abonner
                  </button>
                </form>
              </article>
            );
          })}
        </div>

        <p className="mt-8 text-center text-xs leading-relaxed text-neutral-500">
          Vos données ne sont jamais revendues. Vous pouvez vous désinscrire à tout moment depuis le
          lien présent dans chaque email.
        </p>
      </div>
    </>
  );
}
