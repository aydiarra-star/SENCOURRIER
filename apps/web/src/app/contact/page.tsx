import type { Metadata } from 'next';
import { Mail, MapPin, Phone, Clock } from 'lucide-react';
import { JsonLd, breadcrumbSchema } from '@/components/seo/json-ld';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Contactez la rédaction, le service abonnements ou le service publicité de SENCOURRIER.',
  alternates: { canonical: '/contact' },
};

const SERVICES = [
  {
    title: 'Rédaction',
    description: 'Signaler une information, proposer un sujet, exercer un droit de réponse.',
    email: 'redaction@sencourrier.sn',
  },
  {
    title: 'Abonnements',
    description: 'Question sur votre abonnement Premium, facturation, résiliation.',
    email: 'abonnements@sencourrier.sn',
  },
  {
    title: 'Publicité & partenariats',
    description: 'Espaces publicitaires, articles sponsorisés, partenariats éditoriaux.',
    email: 'publicite@sencourrier.sn',
  },
  {
    title: 'Protection des données',
    description: 'Exercice de vos droits RGPD : accès, rectification, effacement.',
    email: 'donnees@sencourrier.sn',
  },
];

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Accueil', url: '/' },
          { name: 'Contact', url: '/contact' },
        ])}
      />

      <div className="border-b border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/50">
        <div className="mx-auto max-w-screen-2xl px-4 py-10 sm:px-6 lg:px-8">
          <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            Contact
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            Notre équipe répond aux messages du lundi au vendredi, de 9 h à 18 h (GMT). Pour les
            demandes urgentes liées à l&apos;actualité, privilégiez l&apos;adresse de la rédaction.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-screen-2xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-3">
          {/* Formulaire */}
          <div className="lg:col-span-2">
            <h2 className="font-display text-xl font-extrabold tracking-tight">
              Envoyer un message
            </h2>
            <form action="/api/contact" method="post" className="mt-5 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-name" className="block text-sm font-medium">
                    Nom complet
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    className="focus:border-sn-green focus:ring-sn-green/20 mt-1.5 w-full rounded-md border border-neutral-300 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 dark:border-neutral-700 dark:bg-neutral-950"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-sm font-medium">
                    Adresse email
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className="focus:border-sn-green focus:ring-sn-green/20 mt-1.5 w-full rounded-md border border-neutral-300 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 dark:border-neutral-700 dark:bg-neutral-950"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-subject" className="block text-sm font-medium">
                  Objet
                </label>
                <select
                  id="contact-subject"
                  name="subject"
                  required
                  className="mt-1.5 w-full rounded-md border border-neutral-300 bg-white px-4 py-2.5 text-sm dark:border-neutral-700 dark:bg-neutral-950"
                >
                  <option value="redaction">Rédaction / information</option>
                  <option value="abonnement">Abonnement Premium</option>
                  <option value="publicite">Publicité / partenariat</option>
                  <option value="donnees">Protection des données (RGPD)</option>
                  <option value="autre">Autre demande</option>
                </select>
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-sm font-medium">
                  Votre message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={7}
                  required
                  className="focus:border-sn-green focus:ring-sn-green/20 mt-1.5 w-full rounded-md border border-neutral-300 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 dark:border-neutral-700 dark:bg-neutral-950"
                />
              </div>

              <label className="flex items-start gap-2 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                <input
                  type="checkbox"
                  name="consent"
                  required
                  className="text-sn-green mt-0.5 h-4 w-4 shrink-0 rounded border-neutral-300"
                />
                <span>
                  J&apos;accepte que mes données soient utilisées pour traiter ma demande,
                  conformément à la politique de confidentialité.
                </span>
              </label>

              <button
                type="submit"
                className="bg-sn-green hover:bg-sn-green-700 rounded-md px-6 py-3 text-sm font-semibold text-white transition-colors"
              >
                Envoyer le message
              </button>
            </form>
          </div>

          {/* Coordonnées */}
          <aside className="space-y-4">
            <div className="rounded-lg border border-neutral-200 p-5 dark:border-neutral-800">
              <h2 className="font-ui text-xs font-bold uppercase tracking-wider text-neutral-500">
                Coordonnées
              </h2>
              <ul className="mt-4 space-y-3.5 text-sm">
                <li className="flex items-start gap-2.5">
                  <MapPin className="text-sn-green mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                  <span>
                    SENCOURRIER
                    <br />
                    Dakar, Sénégal
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Mail className="text-sn-green mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                  <a href="mailto:contact@sencourrier.sn" className="hover:underline">
                    contact@sencourrier.sn
                  </a>
                </li>
                <li className="flex items-start gap-2.5">
                  <Phone className="text-sn-green mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                  <span>+221 33 000 00 00</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Clock className="text-sn-green mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                  <span>
                    Lundi – vendredi
                    <br />9 h – 18 h (GMT)
                  </span>
                </li>
              </ul>
            </div>

            <div className="rounded-lg border border-neutral-200 p-5 dark:border-neutral-800">
              <h2 className="font-ui text-xs font-bold uppercase tracking-wider text-neutral-500">
                Services spécialisés
              </h2>
              <ul className="mt-4 space-y-4">
                {SERVICES.map((service) => (
                  <li key={service.email}>
                    <p className="text-sm font-semibold">{service.title}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-neutral-500">
                      {service.description}
                    </p>
                    <a
                      href={`mailto:${service.email}`}
                      className="text-sn-green dark:text-sn-green-400 mt-1 inline-block text-xs font-semibold hover:underline"
                    >
                      {service.email}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
