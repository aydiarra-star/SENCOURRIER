import { Mail, CheckCircle2, ShieldCheck } from 'lucide-react';

/**
 * Inscription à la newsletter.
 *
 * Le formulaire poste vers l'API NestJS (`/api/newsletter/subscribe`) qui
 * gère la double confirmation via Resend. Aucune donnée n'est envoyée sans
 * action explicite de l'utilisateur.
 */
export function NewsletterSignup() {
  return (
    <section
      className="overflow-hidden rounded-xl border border-neutral-200 bg-gradient-to-br from-neutral-50 to-white dark:border-neutral-800 dark:from-neutral-900 dark:to-neutral-950"
      aria-labelledby="newsletter-title"
    >
      <div className="senegal-rule h-1.5 w-full" aria-hidden />
      <div className="p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <span className="bg-sn-green/10 text-sn-green dark:bg-sn-green/20 hidden h-11 w-11 shrink-0 items-center justify-center rounded-full sm:flex">
            <Mail className="h-5 w-5" aria-hidden />
          </span>
          <div className="flex-1">
            <h2
              id="newsletter-title"
              className="font-display text-xl font-extrabold tracking-tight sm:text-2xl"
            >
              La lettre d&apos;information SENCOURRIER
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              Chaque matin à 7 h, l&apos;essentiel de l&apos;actualité sénégalaise et africaine,
              sélectionné par la rédaction. Gratuit, sans publicité, désinscription en un clic.
            </p>

            <form
              action="/api/newsletter/subscribe"
              method="post"
              className="mt-5 flex flex-col gap-2.5 sm:flex-row"
            >
              <label htmlFor="newsletter-email" className="sr-only">
                Votre adresse email
              </label>
              <input
                id="newsletter-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="votre.email@exemple.sn"
                className="focus:border-sn-green focus:ring-sn-green/20 flex-1 rounded-md border border-neutral-300 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:ring-2 dark:border-neutral-700 dark:bg-neutral-950"
              />
              <button
                type="submit"
                className="bg-sn-green hover:bg-sn-green-700 rounded-md px-6 py-2.5 text-sm font-semibold text-white transition-colors"
              >
                Je m&apos;abonne
              </button>
            </form>

            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-neutral-500">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="text-sn-green h-3.5 w-3.5" aria-hidden />1 email par jour,
                pas plus
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="text-sn-green h-3.5 w-3.5" aria-hidden />
                Données jamais revendues
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
