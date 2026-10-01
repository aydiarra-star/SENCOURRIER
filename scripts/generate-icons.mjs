#!/usr/bin/env node
/**
 * Génère les icônes de marque à partir de `logo-mark.svg`.
 *
 * Le portail déclare un favicon, une icône Apple et un manifeste PWA
 * (`apps/web/src/app/manifest.ts`) ; les fichiers correspondants doivent donc
 * exister dans `public/`, sinon le navigateur reçoit un 404 et l'installation
 * de l'application échoue.
 *
 * Les deux applications publiques sont servies depuis leur propre `public/` :
 * le script écrit donc dans chacune.
 *
 * Usage : node scripts/generate-icons.mjs
 */
import { mkdir, readFile, writeFile, copyFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE = join(ROOT, 'apps/web/public/logo-mark.svg');
const TARGETS = ['apps/web/public', 'apps/showcase/public'];

// Le fond reprend le gris premium de la charte, sur lequel le « S » blanc du
// logo reste lisible.
const BACKGROUND = '#1F2937';

/** Icônes maskable : Android rogne jusqu'à un cercle de 40 % du rayon, donc
 *  le logo doit tenir dans les 80 % centraux de la toile. */
async function maskable(svg, size) {
  const inner = Math.round(size * 0.6);
  const mark = await sharp(svg, { density: 384 }).resize(inner, inner).png().toBuffer();
  return sharp({
    create: { width: size, height: size, channels: 4, background: BACKGROUND },
  })
    .composite([{ input: mark, gravity: 'center' }])
    .png()
    .toBuffer();
}

async function main() {
  const svg = await readFile(SOURCE);

  for (const target of TARGETS) {
    const dir = join(ROOT, target);
    const icons = join(dir, 'icons');
    await mkdir(icons, { recursive: true });

    // Favicon vectoriel : net à toutes les tailles.
    await copyFile(SOURCE, join(dir, 'favicon.svg'));

    await writeFile(
      join(dir, 'apple-touch-icon.png'),
      await sharp(svg, { density: 384 })
        .resize(180, 180)
        .flatten({ background: BACKGROUND })
        .png()
        .toBuffer(),
    );

    for (const size of [192, 512]) {
      await writeFile(
        join(icons, `icon-${size}.png`),
        await sharp(svg, { density: 384 }).resize(size, size).png().toBuffer(),
      );
    }

    await writeFile(join(icons, 'maskable-512.png'), await maskable(svg, 512));

    console.log(`${target} : favicon.svg, apple-touch-icon.png, icons/icon-192.png, icons/icon-512.png, icons/maskable-512.png`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
