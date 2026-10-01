#!/usr/bin/env node
/**
 * Vérifie que l'aperçu statique publié sur GitHub Pages ne contient aucun lien
 * interne mort. Les pages sont servies depuis le sous-chemin `/SENCOURRIER/`,
 * ce qui rend les chemins relatifs piégeux : un lien vers une rubrique sans
 * article publié, ou vers une route du portail absente de l'aperçu, produirait
 * un 404 silencieux que seule une vérification exhaustive révèle.
 *
 * Usage : node scripts/check-showcase-links.mjs  (après `next build`)
 */
import { readdir, readFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'apps/showcase/out');
const BASE_PATH = '/SENCOURRIER';

if (!existsSync(OUT)) {
  console.error(
    `✖ Sortie introuvable : ${OUT}\n  Lancez d'abord : npm run build --workspace=@sencourrier/showcase`,
  );
  process.exit(1);
}

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else if (entry.name.endsWith('.html')) files.push(full);
  }
  return files;
}

/** Une cible existe-t-elle, en tenant compte du `trailingSlash` de l'export ? */
function targetExists(href) {
  const relative = href.slice(BASE_PATH.length).replace(/^\//, '');
  if (relative === '' || relative.endsWith('/')) {
    return existsSync(path.join(OUT, relative, 'index.html'));
  }
  if (path.extname(relative)) {
    return existsSync(path.join(OUT, relative));
  }
  return existsSync(path.join(OUT, relative, 'index.html')) || existsSync(path.join(OUT, relative));
}

const files = await walk(OUT);
const broken = new Map();
let checked = 0;

for (const file of files) {
  const html = await readFile(file, 'utf8');
  const hrefs = new Set(
    [...html.matchAll(/href="(\/SENCOURRIER[^"#?]*)"/g)].map((match) => match[1]),
  );
  for (const href of hrefs) {
    checked += 1;
    if (!targetExists(href)) {
      const sources = broken.get(href) ?? new Set();
      sources.add(path.relative(ROOT, file));
      broken.set(href, sources);
    }
  }
}

const size = await stat(OUT);
console.log(`Aperçu : ${files.length} pages HTML, ${checked} liens internes vérifiés.`);

if (broken.size > 0) {
  console.error(`\n✖ ${broken.size} lien(s) interne(s) cassé(s) :`);
  for (const [href, sources] of [...broken].sort()) {
    console.error(`  ${href}`);
    for (const source of sources) console.error(`      depuis ${source}`);
  }
  process.exit(1);
}

console.log('✔ Aucun lien interne cassé.');
void size;
