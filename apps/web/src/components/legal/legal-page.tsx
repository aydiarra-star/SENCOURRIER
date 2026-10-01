import { SITE } from '@sencourrier/config';

interface LegalPageProps {
  title: string;
  updatedAt: string;
  children: React.ReactNode;
}

/**
 * Gabarit commun aux pages légales : typographie de lecture longue et date de
 * dernière mise à jour en tête de document.
 */
export function LegalPage({ title, updatedAt, children }: LegalPageProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="border-b border-neutral-200 pb-6 dark:border-neutral-800">
        <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h1>
        <p className="mt-2 text-xs text-neutral-500">
          Dernière mise à jour : <time>{updatedAt}</time> · {SITE.name}
        </p>
      </header>

      <div className="mt-8 space-y-8">{children}</div>

      <footer className="mt-12 rounded-lg border border-neutral-200 p-5 text-sm text-neutral-600 dark:border-neutral-800 dark:text-neutral-400">
        <p>
          Pour toute question relative à ce document, écrivez à{' '}
          <a href="mailto:contact@sencourrier.sn" className="font-semibold text-sn-green hover:underline">
            contact@sencourrier.sn
          </a>
          .
        </p>
      </footer>
    </div>
  );
}

/** Section d'un document légal. */
export function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-lg font-bold tracking-tight">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">{children}</div>
    </section>
  );
}
