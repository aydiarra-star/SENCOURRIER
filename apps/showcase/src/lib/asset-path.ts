/**
 * L'aperçu est publié sur GitHub Pages sous `/SENCOURRIER/`. Next.js préfixe
 * automatiquement les routes et les fichiers `_next/`, mais pas les fichiers
 * déclarés dans les métadonnées : sans ce préfixe, le favicon et l'icône Apple
 * pointeraient vers la racine du domaine et renverraient un 404.
 *
 * Le préfixe est injecté à la construction par `next.config.js`.
 */
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

/** Transforme un chemin absolu (`/favicon.svg`) en URL servie par le site. */
export function assetPath(path: string): string {
  return `${BASE_PATH}${path}`;
}
