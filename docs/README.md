# SENCOURRIER — Documentation

**SENCOURRIER** — *Le média numérique de référence du Sénégal*

---

## Par où commencer

| Document | Public | Contenu |
| --- | --- | --- |
| [Architecture](architecture/README.md) | Technique | Découpage, flux, choix d'architecture |
| [Base de données](database/README.md) | Technique | 47 modèles, relations, index |
| [UML](uml/README.md) | Technique | Cas d'utilisation, classes, séquences, déploiement |
| [Design et wireframes](design/README.md) | Produit / Design | Identité visuelle, maquettes, composants |
| [API REST](api/README.md) | Intégration | Points d'entrée, conventions, codes |
| [Déploiement](exploitation/README.md) | Exploitation | Docker, CI/CD, sécurité, mise en production |
| [Guide utilisateur](utilisateur/README.md) | Lecteurs et rédaction | Usage du site et du système éditorial |

---

## Le projet en bref

| | |
| --- | --- |
| **Nom** | SENCOURRIER |
| **Signature** | Le média numérique de référence du Sénégal |
| **Éditeur** | SENCOURRIER Médias — Dakar |
| **Langue** | Français (fuseau `Africa/Dakar`) |
| **Modèle** | Monorepo npm |

### Pile technique

| Couche | Technologie |
| --- | --- |
| Frontend | Next.js 15.5, React 19, TypeScript, Tailwind CSS, Framer Motion |
| Backend | NestJS 11, Node.js 20 |
| Base de données | PostgreSQL 16 (Prisma 6.19) |
| Cache | Redis 7 |
| Recherche | Trigrammes PostgreSQL, Elasticsearch (à l'échelle) |
| Authentification | NextAuth, JWT, OAuth Google, 2FA |
| Stockage | Azure Blob Storage |
| Courriel | Resend |
| IA | Azure OpenAI (RAG, pgvector) |
| Paiement | Stripe, Wave, Orange Money, Free Money |
| Analytique | Google Analytics 4, Google Tag Manager |
| Hébergement | Microsoft Azure |
| CDN | Cloudflare Enterprise |

### Chiffres clés du dépôt

| Indicateur | Valeur |
| --- | --- |
| Modèles de données | 47 |
| Énumérations | 16 |
| Modules d'API | 14 |
| Points d'entrée REST | 59 |
| Routes web | 38 |
| Composants d'interface | 16 |
| Variables d'environnement | 106 |

---

## Structure du dépôt

```
sencourrier/
├── apps/
│   ├── web/          Next.js — portail public
│   └── api/          NestJS — API REST /api/v1
├── packages/
│   ├── database/     Prisma — schéma, migrations, seed
│   ├── config/       Marque, routes, constantes
│   └── types/        Types partagés
├── infra/docker/     Dockerfiles et docker-compose
├── scripts/          Outils d'exploitation
└── docs/             Cette documentation
```

---

## Commandes essentielles

```bash
npm install             # dépendances
npm run docker:up       # PostgreSQL, Redis, Elasticsearch
npm run db:migrate      # migrations
npm run db:seed         # jeu de démonstration
npm run dev:api         # API  → http://localhost:3001
npm run dev:web         # Web  → http://localhost:3000
npm run build           # construction complète
npm run typecheck       # vérification des types
```
