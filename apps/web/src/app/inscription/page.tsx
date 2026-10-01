import type { Metadata } from 'next';
import Link from 'next/link';
import { Check, ShieldCheck } from 'lucide-react';
import { Logo } from '@/components/layout/logo';

export const metadata: Metadata = {
  title: 'Créer un compte',
  description:
    'Créez votre compte SENCOURRIER gratuit : favoris, historique de lecture et newsletters personnalisées.',
  robots: { index: false, follow: true },
};

const BENEFITS = [
  'Sauvegardez vos articles et retrouvez-les sur tous vos appareils',
  'Suivez les rubriques et les journalistes qui vous intéressent',
  'Recevez les alertes d’actualité urgente et les newsletters',
  'Commentez les articles et participez aux débats',
];

export default function RegisterPage() {
  return (
    <div className="mx-auto grid max-w-5xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
      <div>
        <Link href="/" aria-label="SENCOURRIER — accueil">
          <Logo className="h-9 w-auto" />
        </Link>

        <h1 className="font-display mt-6 text-3xl font-extrabold tracking-tight">
          Créer votre compte SENCOURRIER
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          La création de compte est gratuite et sans engagement. Elle vous donne accès à
          l&apos;ensemble des articles en accès libre et à votre espace personnel.
        </p>

        <ul className="mt-7 space-y-3">
          {BENEFITS.map((benefit) => (
            <li key={benefit} className="flex items-start gap-2.5 text-sm">
              <Check className="text-sn-green mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              <span className="text-neutral-700 dark:text-neutral-300">{benefit}</span>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex items-start gap-3 rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
          <ShieldCheck className="text-sn-green mt-0.5 h-5 w-5 shrink-0" aria-hidden />
          <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
            Vos données sont hébergées dans l&apos;Union européenne et traitées conformément au
            RGPD. Nous ne revendons jamais vos informations à des tiers.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-neutral-200 p-6 sm:p-8 dark:border-neutral-800">
        {/* Lien natif volontaire : une navigation complète est nécessaire pour
            déclencher le flux OAuth géré par NextAuth. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a
          href="/api/auth/signin/google"
          className="flex items-center justify-center gap-3 rounded-md border border-neutral-300 bg-white px-5 py-3 text-sm font-semibold transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1a11 11 0 0 0-9.82 6.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          S&apos;inscrire avec Google
        </a>

        <div className="my-6 flex items-center gap-3">
          <span className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
          <span className="font-ui text-[11px] uppercase tracking-wider text-neutral-400">
            ou par email
          </span>
          <span className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
        </div>

        <form action="/api/auth/register" method="post" className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium">
              Nom complet
            </label>
            <input
              id="fullName"
              name="name"
              type="text"
              required
              autoComplete="name"
              className="focus:border-sn-green focus:ring-sn-green/20 mt-1.5 w-full rounded-md border border-neutral-300 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 dark:border-neutral-700 dark:bg-neutral-950"
            />
          </div>

          <div>
            <label htmlFor="registerEmail" className="block text-sm font-medium">
              Adresse email
            </label>
            <input
              id="registerEmail"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="focus:border-sn-green focus:ring-sn-green/20 mt-1.5 w-full rounded-md border border-neutral-300 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 dark:border-neutral-700 dark:bg-neutral-950"
            />
          </div>

          <div>
            <label htmlFor="registerPassword" className="block text-sm font-medium">
              Mot de passe
            </label>
            <input
              id="registerPassword"
              name="password"
              type="password"
              required
              minLength={10}
              autoComplete="new-password"
              className="focus:border-sn-green focus:ring-sn-green/20 mt-1.5 w-full rounded-md border border-neutral-300 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 dark:border-neutral-700 dark:bg-neutral-950"
            />
            <p className="mt-1.5 text-[11px] text-neutral-500">
              Au moins 10 caractères, avec une majuscule, une minuscule et un chiffre.
            </p>
          </div>

          <label className="flex items-start gap-2 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
            <input
              type="checkbox"
              name="terms"
              required
              className="text-sn-green mt-0.5 h-4 w-4 shrink-0 rounded border-neutral-300"
            />
            <span>
              J&apos;accepte les{' '}
              <Link href="/cgu" className="text-sn-green font-semibold hover:underline">
                conditions générales d&apos;utilisation
              </Link>{' '}
              et la{' '}
              <Link
                href="/politique-confidentialite"
                className="text-sn-green font-semibold hover:underline"
              >
                politique de confidentialité
              </Link>
              .
            </span>
          </label>

          <button
            type="submit"
            className="bg-sn-green hover:bg-sn-green-700 w-full rounded-md px-5 py-3 text-sm font-semibold text-white transition-colors"
          >
            Créer mon compte
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-neutral-600 dark:text-neutral-400">
          Déjà inscrit ?{' '}
          <Link
            href="/connexion"
            className="text-sn-green dark:text-sn-green-400 font-semibold hover:underline"
          >
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
