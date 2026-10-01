import Link from 'next/link';
import { Check, Crown } from 'lucide-react';
import { commerce } from '@/lib/data';
import { formatCurrency } from '@/lib/format';

export default function SubscriptionPage() {
  const plans = commerce.plans;

  return (
    <div className="mx-auto max-w-screen-2xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mx-auto max-w-2xl text-center">
        <span className="rounded-xs from-brand-yellow to-brand-yellow-300 font-ui text-brand-slate-900 inline-flex items-center gap-1.5 bg-gradient-to-r px-2.5 py-1 text-[0.625rem] font-bold uppercase tracking-wider">
          <Crown className="h-3 w-3" aria-hidden />
          Premium
        </span>
        <h1 className="font-display mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
          Soutenez un média indépendant
        </h1>
        <p className="mt-3 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
          L&apos;abonnement finance nos enquêtes, nos correspondants en région et notre production
          audio et vidéo. Sans publicité, sans compromis.
        </p>
      </header>

      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan) => {
          const popular = plan.isPopular;
          return (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-lg border p-6 ${
                popular
                  ? 'border-sn-green shadow-editorial-lg ring-sn-green ring-1'
                  : 'border-neutral-200 dark:border-neutral-800'
              }`}
            >
              {popular && (
                <span className="rounded-xs bg-sn-green font-ui absolute -top-3 left-6 px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-wider text-white">
                  Le plus choisi
                </span>
              )}
              <h2 className="font-display text-lg font-extrabold">{plan.name}</h2>
              <p className="mt-1 text-xs text-neutral-500">
                {plan.interval === 'year' ? 'Facturation annuelle' : 'Facturation mensuelle'}
              </p>

              <p className="font-display mt-4 text-3xl font-extrabold">
                {plan.priceAmount === 0
                  ? 'Gratuit'
                  : formatCurrency(plan.priceAmount, plan.currency)}
                {plan.priceAmount > 0 && (
                  <span className="ml-1 text-sm font-medium text-neutral-500">
                    /{plan.interval === 'year' ? 'an' : 'mois'}
                  </span>
                )}
              </p>

              <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                {plan.description}
              </p>

              <ul className="mt-5 flex-1 space-y-2">
                {plan.features.slice(0, 6).map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="text-sn-green mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/abonnement"
                className={`mt-6 inline-flex items-center justify-center rounded-md px-5 py-3 text-sm font-semibold transition-colors ${
                  popular
                    ? 'bg-sn-green hover:bg-sn-green-600 text-white'
                    : 'hover:border-sn-green hover:text-sn-green border border-neutral-300 dark:border-neutral-700'
                }`}
              >
                {plan.priceAmount === 0 ? 'Créer un compte' : "S'abonner"}
              </Link>
            </div>
          );
        })}
      </div>

      <section className="mx-auto mt-14 max-w-3xl rounded-lg border border-neutral-200 p-6 dark:border-neutral-800">
        <h2 className="font-display text-lg font-extrabold">Moyens de paiement</h2>
        <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          Carte bancaire (Stripe), Wave, Orange Money et Free Money. Résiliation à tout moment
          depuis votre espace personnel ; elle prend effet à la fin de la période en cours.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {['Stripe', 'Wave', 'Orange Money', 'Free Money'].map((provider) => (
            <span
              key={provider}
              className="rounded-full border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-600 dark:border-neutral-700 dark:text-neutral-400"
            >
              {provider}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
