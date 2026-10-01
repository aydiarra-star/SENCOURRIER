# AGENTS.md — SENCOURRIER

Mémoire technique du dépôt. À consulter avant toute intervention.

---

## Le projet

**SENCOURRIER** — _Le média numérique de référence du Sénégal_.
Monorepo npm : `apps/web` (Next.js 15), `apps/api` (NestJS 11),
`packages/database` (Prisma), `packages/config`, `packages/types`.

Langue du projet : **français** (code, commentaires, documentation, messages).
Fuseau : `Africa/Dakar`. Le contenu éditorial est en français ; les termes
techniques restent en anglais là où c'est l'usage (noms de bibliothèques,
d'API, de types).

Le monorepo est la structure de référence. Une application Next.js avait été
ajoutée à la racine du dépôt (PR #1) : elle a été retirée. Ne pas recréer de
`src/`, `public/` ou `next.config.ts` à la racine — tout code applicatif va
dans `apps/*`, tout code partagé dans `packages/*`.

---

## Commandes utiles

```bash
npm install
npm run docker:up                      # PostgreSQL, Redis, Elasticsearch
npm run db:generate && npm run db:migrate && npm run db:seed
npm run dev:api                        # http://localhost:3001
npm run dev:web                        # http://localhost:3000
npm run typecheck
npm run build --workspace=@sencourrier/web
npm run build --workspace=@sencourrier/api
npm run build:showcase                 # aperçu statique (apps/showcase/out)
npm run check:showcase-links           # vérifie les liens internes de l'aperçu
```

Le serveur Docker nécessite `sudo dockerd` dans cet environnement :
`sudo -n dockerd > /tmp/docker.log 2>&1 &`

---

## Pièges vérifiés (à ne pas redécouvrir)

1. **`next build` exige `NODE_ENV=production`.** Une variable `NODE_ENV`
   exportée dans le shell ou présente dans `apps/web/.env.local` fausse la
   construction (échec `/_error` sur `<Html>`). Le fichier ne doit pas la
   définir ; `unset NODE_ENV` avant de construire.

2. **Une variable d'environnement vide n'active pas le repli `??`.**
   `NEXT_PUBLIC_SITE_URL=` provoque `new URL('')` → exception. Utiliser
   `?.trim() || défaut` (voir `packages/config/src/site.ts`).

3. **Prisma a besoin d'`openssl`** dans l'image d'exécution, sinon il avertit
   qu'il ne sait pas quelle bibliothèque TLS charger.

4. **`chmod +x` ne suffit pas** pour un script copié depuis un fichier en
   `0600` : les bits de lecture manquent et `/bin/sh` ne peut pas le lire.
   Utiliser `chmod 755` (voir `infra/docker/Dockerfile.api`).

5. **La construction de l'image web ne doit pas dépendre de la base.**
   Les routes éditoriales sont en `force-dynamic` ; le shell du site utilise
   `safeQuery` pour se dégrader proprement si la base est injoignable.

6. **L'aperçu GitHub Pages ne génère une page que pour les rubriques ayant au
   moins un article publié.** Un lien vers une rubrique vide renvoie un 404 ;
   la navigation filtre donc ces rubriques. `trailingSlash: true` est requis :
   sans lui, les URL sans extension ne se résolvent pas sur Pages.

7. **GitHub Pages masque les dossiers commençant par `_`.** Sans
   `apps/showcase/public/.nojekyll`, `_next/` disparaît du site publié et la
   page s'affiche sans styles ni scripts.

---

## Recherche éditoriale (ne pas casser)

`unaccent()` est `STABLE`, donc non indexable. La migration
`20260930200000_editorial_search_indexes` crée un emballage `IMMUTABLE`
`public.sencourrier_unaccent(text)`, et **les index comme les requêtes**
utilisent `lower(public.sencourrier_unaccent(col))`. Toute divergence entre les
deux expressions fait perdre l'usage de l'index (vérifier avec `EXPLAIN` :
attendu `Bitmap Index Scan`).

Vérification rapide :

```bash
curl -G --data-urlencode "q=senegal" http://localhost:3001/api/v1/search
curl -G --data-urlencode "q=Sénégal" http://localhost:3001/api/v1/search
# → même nombre de résultats
```

---

## Conventions

- TypeScript strict ; pas de `any` non justifié.
- Commentaires en français, uniquement pour l'intention ou un point non
  évident — jamais pour paraphraser le code.
- Les couleurs, URLs canoniques et routes vivent dans `packages/config` ;
  ne pas les coder en dur ailleurs.
- Le tricolore sénégalais est réservé aux accents ; le gris premium porte la
  typographie et les surfaces.

---

## Documentation

`docs/` contient la conception complète : architecture, base de données, UML,
design et wireframes, API, déploiement, guide utilisateur. Toute évolution
structurelle doit être répercutée dans le document correspondant.
