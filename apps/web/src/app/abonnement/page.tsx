import type { Metadata } from 'next';
import Link from 'next/link';
import { Check, Crown, Sparkles } from 'lucide-react';
import { JsonLd, breadcrumbSchema } from '@/components/seo/json-ld';
import { getSubscriptionPlans } from '@/lib/queries';
import { formatCurrency } from '@/lib/format';
import { cn } from '@/lib/utils';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Abonnement Premium',
  description:
    "Abonnez-vous à SENCOURRIER Premium : enquêtes exclusives, dossiers spéciaux, podcasts premium et lecture sans publicité. Paiement par Wave, Orange Money, Free Money ou carte bancaire.",
  alternates: { canonical: '/abonnement' },
  openGraph: { type: 'website', title: 'Abonnement Premium — SENCOURRIER', url: '/abonnement' },
};

const PAYMENT_METHODS = [
  { name: 'Wave', detail: 'Paiement mobile instantané' },
  { name: 'Orange Money', detail: 'Débit direct du solde' },
  { name: 'Free Money', detail: 'Paiement mobile' },
  { name: 'Carte bancaire', detail: 'Visa / Mastercard via Stripe' },
];

export default async function SubscriptionPage() {
  const plans = await getSubscriptionPlans();

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: 'Accueil', url: '/' }, { name: 'Abonnement', url: '/abonnement' }])} />

      <div className="border-b border-neutral-200 bg-gradient-to-b from-sn-green-50 to-white dark:border-neutral-800 dark:from-neutral-900 dark:to-neutral-950">
        <div className="mx-auto max-w-screen-2xl px-4 py-14 text-center sm:px-6 lg:px-8">
          <p className="inline-flex items-center gap-2 rounded-full bg-sn-yellow px-4 py-1.5 font-ui text-xs font-bold uppercase tracking-wider text-neutral-900">
            <Crown className="h-3.5 w-3.5" aria-hidden />
            SENCOURRIER Premium
          </p>
          <h1 className="mx-auto mt-5 max-w-3xl font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            Un journalisme sénégalais exigeant, financé par ses lecteurs
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
            Nos enquêtes demandent des semaines de travail, des déplacements dans les régions et
            des vérifications systématiques. Votre abonnement finance directement cette exigence,
            et vous donne accès à tout.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-screen-2xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => (
            <article
              key={plan.id}
              className={cn(
                'relative flex flex-col rounded-xl border p-6 transition-shadow hover:shadow-lg',
                plan.isPopular
                  ? 'border-sn-yellow bg-white shadow-premium dark:bg-neutral-900'
                  : 'border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900',
              )}
            >
              {plan.isPopular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-sn-yellow px-3 py-1 font-ui text-[10px] font-bold uppercase tracking-wider text-neutral-900">
                  Le plus choisi
                </span>
              )}

              <h2 className="font-display text-lg font-extrabold tracking-tight">{plan.name}</h2>
              {plan.description && (
                <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {plan.description}
                </p>
              )}

              <p className="mt-5 flex items-baseline gap-1.5">
                <span className="font-display text-3xl font-black tracking-tight">
                  {plan.priceAmount === 0 ? 'Gratuit' : formatCurrency(plan.priceAmount)}
                </span>
                {plan.priceAmount > 0 && (
                  <span className="text-xs text-neutral-500">
                    / {plan.interval === 'year' ? 'an' : 'mois'}
                  </span>
                )}
              </p>

              <ul className="mt-5 flex-1 space-y-2.5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-sn-green" aria-hidden />
                    <span className="text-neutral-700 dark:text-neutral-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.priceAmount === 0 ? '/inscription' : `/abonnement/souscrire?plan=${plan.tier}`}
                className={cn(
                  'mt-6 rounded-md px-5 py-3 text-center text-sm font-semibold transition-colors',
                  plan.isPopular
                    ? 'bg-sn-green text-white hover:bg-sn-green-700'
                    : 'border border-neutral-300 hover:border-sn-green hover:text-sn-green dark:border-neutral-700',
                )}
              >
                {plan.priceAmount === 0 ? 'Créer un compte gratuit' : 'Choisir cette offre'}
              </Link>
            </article>
          ))}
        </div>

        {/* Moyens de paiement */}
        <section className="mt-14 rounded-xl border border-neutral-200 p-6 sm:p-8 dark:border-neutral-800" aria-labelledby="payment-title">
          <h2 id="payment-title" className="font-display text-xl font-extrabold tracking-tight">
            Moyens de paiement acceptés
          </h2>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            Payez avec le moyen qui vous convient, en quelques secondes. Aucun engagement,
            résiliation immédiate depuis votre espace personnel.
          </p>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PAYMENT_METHODS.map((method) => (
              <li
                key={method.name}
                className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800"
              >
                <p className="font-semibold">{method.name}</p>
                <p className="mt-1 text-xs text-neutral-500">{method.detail}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* FAQ */}
        <section className="mt-14" aria-labelledby="faq-title">
          <h2 id="faq-title" className="font-display text-xl font-extrabold tracking-tight">
            Questions fréquentes
          </h2>
          <dl className="mt-6 space-y-4">
            {[
              {
                q: 'Puis-je résilier à tout moment ?',
                a: "Oui. La résiliation se fait en un clic depuis votre espace personnel et prend effet à la fin de la période déjà payée. Aucun frais n'est appliqué.",
              },
              {
                q: "L'abonnement donne-t-il accès aux archives ?",
                a: "L'offre Premium donne accès à l'intégralité des archives depuis la création du titre, y compris les dossiers spéciaux et les enquêtes longues.",
              },
              {
                q: 'Le paiement mobile est-il sécurisé ?',
                a: 'Les transactions passent par les interfaces officielles de Wave, Orange Money et Free Money. SENCOURRIER ne stocke jamais vos identifiants de paiement.',
              },
              {
                q: 'Puis-je offrir un abonnement ?',
                a: "Oui, contactez notre service abonnés pour un abonnement cadeau. Une facture nominative vous sera adressée par email.",
              },
            ].map((item) => (
              <div key={item.q} className="rounded-lg border border-neutral-200 p-5 dark:border-neutral-800">
                <dt className="flex items-start gap-2 font-semibold">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-sn-yellow-600" aria-hidden />
                  {item.q}
                </dt>
                <dd className="mt-2 pl-6 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{item.a}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </>
  );
}
