import type { Metadata } from 'next';
import Link from 'next/link';
import { Logo } from '@/components/layout/logo';

export const metadata: Metadata = {
  title: 'Connexion',
  description: 'Connectez-vous à votre compte SENCOURRIER pour accéder à vos favoris et à votre abonnement.',
  robots: { index: false, follow: true },
};

/**
 * Écran de connexion.
 * Le formulaire poste vers `/api/auth/callback/credentials` (NextAuth), qui
 * délègue la vérification à l'API NestJS. Aucun mot de passe n'est manipulé
 * côté client en dehors de la requête d'authentification.
 */
export default function LoginPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16 sm:px-6">
      <div className="text-center">
        <Link href="/" className="inline-block" aria-label="SENCOURRIER — accueil">
          <Logo className="h-9 w-auto" />
        </Link>
        <h1 className="mt-6 font-display text-2xl font-extrabold tracking-tight">Se connecter</h1>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
          Accédez à vos favoris, votre historique de lecture et votre abonnement.
        </p>
      </div>

      {/* Lien natif volontaire : une navigation complète est nécessaire pour
          déclencher le flux OAuth géré par NextAuth. */}
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <a
        href="/api/auth/signin/google"
        className="mt-8 flex items-center justify-center gap-3 rounded-md border border-neutral-300 bg-white px-5 py-3 text-sm font-semibold transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800"
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
          <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z" />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1a11 11 0 0 0-9.82 6.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        Continuer avec Google
      </a>

      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
        <span className="font-ui text-[11px] uppercase tracking-wider text-neutral-400">ou</span>
        <span className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
      </div>

      <form action="/api/auth/callback/credentials" method="post" className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Adresse email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="votre.email@exemple.sn"
            className="mt-1.5 w-full rounded-md border border-neutral-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-sn-green focus:ring-2 focus:ring-sn-green/20 dark:border-neutral-700 dark:bg-neutral-950"
          />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-medium">
              Mot de passe
            </label>
            <Link href="/mot-de-passe-oublie" className="text-xs font-semibold text-sn-green hover:underline dark:text-sn-green-400">
              Mot de passe oublié ?
            </Link>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="mt-1.5 w-full rounded-md border border-neutral-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-sn-green focus:ring-2 focus:ring-sn-green/20 dark:border-neutral-700 dark:bg-neutral-950"
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
          <input type="checkbox" name="remember" className="h-4 w-4 rounded border-neutral-300 text-sn-green" />
          Rester connecté sur cet appareil
        </label>

        <button
          type="submit"
          className="w-full rounded-md bg-sn-green px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-sn-green-700"
        >
          Se connecter
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-neutral-600 dark:text-neutral-400">
        Pas encore de compte ?{' '}
        <Link href="/inscription" className="font-semibold text-sn-green hover:underline dark:text-sn-green-400">
          Créer un compte gratuit
        </Link>
      </p>

      <p className="mt-4 text-center text-[11px] leading-relaxed text-neutral-400">
        En vous connectant, vous acceptez nos{' '}
        <Link href="/cgu" className="underline">
          conditions générales d&apos;utilisation
        </Link>{' '}
        et notre{' '}
        <Link href="/politique-confidentialite" className="underline">
          politique de confidentialité
        </Link>
        .
      </p>
    </div>
  );
}
