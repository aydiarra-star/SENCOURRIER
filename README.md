# SENCOURRIER

Portail éditorial du Sénégal construit avec Next.js 15 (App Router), React 19 et TypeScript. Interface responsive, mode sombre, rubriques, articles, recherche, newsletter, TV, podcasts, galerie et espace rédaction.

> **Projet de démonstration éditoriale.** Les 31 articles, 9 profils de journalistes, 6 émissions et 9 visuels d’illustration fournis sont fictifs / générés. Ils ne décrivent pas des événements réels et doivent être remplacés avant une publication journalistique. Aucun flux TV ni épisode audio n’est inclus.

## Démarrer

Prérequis : Node.js 20+ et npm.

```bash
npm ci
cp .env.example .env.local
# Ajuster impérativement ADMIN_PASSWORD dans .env.local
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000). `npm run build` puis `npm run start` lancent la version de production. `npm run typecheck` vérifie TypeScript.

## Configuration

| Variable | Rôle |
| --- | --- |
| `ADMIN_PASSWORD` | Active Basic Auth sur `/admin` et `/api/admin/*`. **Si absent, l’admin est ouvert : ne jamais exposer ainsi en production.** |
| `ADMIN_USER` | Identifiant Basic Auth, `admin` par défaut. |
| `DATABASE_URL` | Connexion PostgreSQL optionnelle. Sans elle, les écritures sont enregistrées dans `data/state.json`. |
| `NEXT_PUBLIC_SITE_URL` | URL publique absolue pour le SEO, le sitemap et le flux RSS. |
| `NEXT_PUBLIC_TV_EMBED_URL` | URL HTTPS d’un lecteur TV iframe autorisé. Sans elle, la page affiche un état d’attente explicite. |

Le fichier `.env.example` est un modèle : `.env.local` est ignoré par Git. En hébergement serverless, **utilisez PostgreSQL** : le stockage sur fichier local n’y est pas persistant. Le serveur crée automatiquement la table `app_state` (une ligne JSONB) définie dans `db/schema.sql`. La création nécessite les droits SQL correspondants. Le stockage JSONB n’est pas un modèle relationnel ni une recherche plein texte PostgreSQL : la recherche actuelle est une recherche textuelle applicative. Pour plusieurs instances et une charge importante, migrer vers des tables relationnelles et une recherche indexée.

## Pages et fonctionnalités

- Accueil magazine, 8 rubriques, page article, recherche (`/recherche?q=...`), TV, podcasts, galerie, newsletter, à propos et contact.
- Articles avec métadonnées Open Graph, JSON-LD `NewsArticle`, partage, commentaires modérés ; `sitemap.xml`, `robots.txt`, flux `/rss.xml`.
- Admin `/admin` : création, modification, brouillon et suppression d’articles ; ajout et suppression de journalistes et fiches utilisateurs ; modération ; consultation des messages et abonnés ; export CSV.
- API publiques : `POST /api/newsletter`, `POST /api/contact`, `GET/POST /api/comments`, `GET /api/search?q=...`. API d’administration protégée : `/api/admin/[resource]` (`GET`, `POST`, `PATCH`, `DELETE` selon ressource).
- Inscription et messages de contact : **enregistrés, non envoyés par e-mail**. Prévoir un prestataire d’envoi et la gestion des consentements/désinscriptions avant un usage réel.
- Les fiches « utilisateurs » sont un annuaire et **ne créent pas de comptes individuels**. L’accès admin repose sur un seul identifiant/mot de passe Basic Auth, à utiliser uniquement derrière HTTPS. Pour une vraie rédaction, intégrer une authentification à comptes et rôles, une journalisation et des protections anti-spam/limitation de débit.

## Structure

- `src/app` : pages et routes HTTP Next.js
- `src/components` : composants éditoriaux, formulaires et tableau de bord
- `src/lib/content.ts` : contenu initial fictif et rubriques
- `src/lib/store.ts` : stockage JSON local ou PostgreSQL JSONB
- `public/images` : 9 illustrations locales générées
- `db/schema.sql` : schéma du stockage opérationnel

Les données initiales sont chargées tant qu’aucune écriture n’a eu lieu. À la première écriture sans PostgreSQL, `data/state.json` est créé et devient la source de vérité. Pour repartir des données initiales localement, supprimez ce fichier **après sauvegarde éventuelle**. Les données créées en production ne doivent pas être traitées comme des fichiers versionnés.
