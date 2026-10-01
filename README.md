# SENCOURRIER

> **Le média numérique de référence du Sénégal**

Portail d'information de nouvelle génération : actualité politique, société,
économie, sports, technologies, international, diaspora et faits divers, en
continu et en toute indépendance.

---

## Aperçu

SENCOURRIER est un monorepo npm réunissant un portail public performant, une
API REST complète et un système éditorial professionnel.

| | |
| --- | --- |
| Frontend | Next.js 15.5 · React 19 · TypeScript · Tailwind CSS · Framer Motion |
| Backend | NestJS 11 · Node.js 20 |
| Données | PostgreSQL 16 · Prisma 6.19 |
| Cache | Redis 7 |
| Recherche | Trigrammes PostgreSQL (insensible aux accents) |
| Authentification | NextAuth · JWT · OAuth Google · 2FA |
| Médias | Azure Blob Storage |
| IA | Azure OpenAI (RAG, pgvector) |
| Hébergement | Microsoft Azure · CDN Cloudflare |

---

## Démarrage rapide

```bash
npm install
cp .env.example .env
cp .env.example apps/web/.env.local

npm run docker:up          # PostgreSQL, Redis, Elasticsearch
npm run db:generate
npm run db:migrate
npm run db:seed            # jeu de démonstration

npm run dev:api            # API  → http://localhost:3001  (docs : /api/docs)
npm run dev:web            # Web  → http://localhost:3000
```

---

## Structure

```
sencourrier/
├── apps/
│   ├── web/               Portail public (Next.js, App Router)
│   └── api/               API REST /api/v1 (NestJS)
├── packages/
│   ├── database/          Prisma : schéma, migrations, seed
│   ├── config/            Marque, URLs canoniques, routes
│   └── types/             Types partagés
├── infra/docker/          Dockerfiles, entrypoint, docker-compose
├── scripts/               Outils d'exploitation
└── docs/                  Documentation de conception
```

---

## Commandes

| Commande | Rôle |
| --- | --- |
| `npm run dev:web` · `npm run dev:api` | Développement |
| `npm run build` | Construction des deux applications |
| `npm run typecheck` | Vérification des types |
| `npm run lint` | Analyse statique |
| `npm run db:migrate` · `npm run db:seed` | Base de données |
| `npm run docker:up` · `npm run docker:down` | Infrastructure locale |

---

## Documentation

Toute la conception est documentée dans [`docs/`](docs/README.md) :
architecture, modèle de données, UML, design et wireframes, référence d'API,
guide de déploiement et guide utilisateur.

---

## Mise en production

Les images Docker et les chaînes d'intégration et de livraison continues sont
prêtes (`infra/docker/`, `.github/workflows/`). Voir le
[guide de déploiement](docs/exploitation/README.md).

---

**SENCOURRIER Médias** — Dakar, Sénégal
