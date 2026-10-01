import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-screen-2xl flex-col items-center px-4 py-24 text-center sm:px-6 lg:px-8">
      <p className="font-display text-sn-green text-6xl font-black">404</p>
      <h1 className="font-display mt-4 text-2xl font-extrabold tracking-tight">Page introuvable</h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-neutral-500">
        Cette page n&apos;existe pas dans l&apos;aperçu. Le portail complet couvre l&apos;ensemble
        des rubriques, tags, auteurs et formats.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="bg-sn-green hover:bg-sn-green-600 rounded-md px-5 py-3 text-sm font-semibold text-white transition-colors"
        >
          Retour à l&apos;accueil
        </Link>
        <Link
          href="/recherche"
          className="hover:border-sn-green hover:text-sn-green rounded-md border border-neutral-300 px-5 py-3 text-sm font-semibold transition-colors dark:border-neutral-700"
        >
          Rechercher un article
        </Link>
      </div>
    </div>
  );
}
