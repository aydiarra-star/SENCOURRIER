# SENCOURRIER — Identité visuelle, wireframes et UI

---

## 1. Identité de marque

**Nom** : SENCOURRIER
**Signature** : _Le média numérique de référence du Sénégal_
**Éditeur** : SENCOURRIER Médias — Dakar, Sénégal

### Palette officielle

| Rôle         | Couleur                                                 | Code      | Usage                                 |
| ------------ | ------------------------------------------------------- | --------- | ------------------------------------- |
| Vert Sénégal | ![#00853F](https://img.shields.io/badge/-00853F-00853F) | `#00853F` | Couleur primaire, navigation, CTA     |
| Jaune Or     | ![#FCD116](https://img.shields.io/badge/-FCD116-FCD116) | `#FCD116` | Accents, badges, surlignage           |
| Rouge        | ![#E31B23](https://img.shields.io/badge/-E31B23-E31B23) | `#E31B23` | Urgence, « dernière minute », alertes |
| Blanc        | ![#FFFFFF](https://img.shields.io/badge/-FFFFFF-FFFFFF) | `#FFFFFF` | Fonds, respiration                    |
| Gris Premium | ![#1F2937](https://img.shields.io/badge/-1F2937-1F2937) | `#1F2937` | Texte, surfaces, hiérarchie           |

Le tricolore est **réservé aux accents** (filets, eyebrows, badges, appels à
l'action). Le gris premium porte la typographie et les surfaces, afin de
préserver le caractère institutionnel et premium.

Les jetons sont définis une seule fois dans `packages/config/src/brand.ts`
(`COLORS`), puis reflétés dans le preset Tailwind et les variables CSS.

### Typographies

| Police         | Rôle                            |
| -------------- | ------------------------------- |
| **Montserrat** | Titres, une, rubriques          |
| **Inter**      | Corps de texte, interface       |
| **Poppins**    | Accents, chiffres, micro-titres |

Chargées via `next/font/google` avec `display: 'swap'` — aucune requête
bloquante vers un domaine tiers, aucun décalage de mise en page.

### Modes

- **Clair** : fond blanc, texte gris premium.
- **Sombre** : fond `#0B1220`, texte clair.
- Le thème est appliqué **avant le premier rendu** par un script en ligne dans
  `<head>`, ce qui évite tout flash de thème clair.

### Déclinaisons produites

- Logo SVG (complet, compact, monochrome)
- Favicons (16/32/180/192/512)
- Manifeste PWA (`/manifest.webmanifest`)
- Image OpenGraph par défaut

---

## 2. Grille et points de rupture

| Palier   | Largeur      | Usage                                |
| -------- | ------------ | ------------------------------------ |
| Mobile   | < 640 px     | Une colonne, navigation en tiroir    |
| Tablette | 640–1024 px  | Deux colonnes                        |
| Bureau   | 1024–1440 px | Trois colonnes, barre latérale       |
| Large    | > 1440 px    | Conteneur centré, respiration accrue |

Approche **mobile first** : la mise en page mobile est la référence, les paliers
supérieurs ajoutent des colonnes sans réorganiser la hiérarchie.

---

## 3. Wireframes

### 3.1 Accueil — mobile

```
┌─────────────────────────────┐
│ ☰  SENCOURRIER   🔍 🔔 [S'abonner] │
├─────────────────────────────┤
│ 🔴 DERNIÈRE MINUTE — bandeau défilant │
├─────────────────────────────┤
│ ┌─────────────────────────┐ │
│ │        IMAGE UNE        │ │
│ └─────────────────────────┘ │
│ RUBRIQUE · 3 min de lecture │
│ Titre principal de la une   │
│ Chapô de synthèse…          │
│ Par Aïssatou Diop          │
├─────────────────────────────┤
│ DERNIÈRES MINUTES           │
│ • 14:32 Titre…              │
│ • 14:05 Titre…              │
├─────────────────────────────┤
│ POLITIQUE                   │
│ ┌────────┐ Titre           │
│ │ image  │ Résumé · 4 min  │
│ └────────┘                  │
│ ┌────────┐ Titre           │
│ └────────┘                  │
├─────────────────────────────┤
│ SOCIÉTÉ  ·  ÉCONOMIE        │
│ (même structure, répétée)   │
├─────────────────────────────┤
│ PODCASTS                    │
│ ▶ Émission · durée          │
├─────────────────────────────┤
│ TV LIVE                     │
│ ┌─────────────────────────┐ │
│ │      ▶ Direct          │ │
│ └─────────────────────────┘ │
├─────────────────────────────┤
│ NEWSLETTER                  │
│ [ email ]  [ S'inscrire ]   │
├─────────────────────────────┤
│ TENDANCES                   │
│ #tag #tag #tag              │
├─────────────────────────────┤
│ [ ESPACE PUBLICITAIRE ]     │
├─────────────────────────────┤
│ FOOTER                      │
└─────────────────────────────┘
```

### 3.2 Accueil — bureau

```
┌───────────────────────────────────────────────────────────────┐
│ LOGO      Politique Société Économie Sports Tech Intl Diaspora │
│                            🔍 Recherche IA  🔔  👤  [Premium]  │
├───────────────────────────────────────────────────────────────┤
│ 🔴 DERNIÈRE MINUTE — bandeau défilant                          │
├───────────────────────────────────┬───────────────────────────┤
│                                   │ ACTUALITÉS SECONDAIRES    │
│         IMAGE UNE (16/9)          │ ┌──────┐ Titre            │
│                                   │ │ img  │ Résumé           │
│  RUBRIQUE · 3 min                 │ └──────┘                  │
│  Titre principal                  │ ┌──────┐ Titre            │
│  Chapô de synthèse                │ └──────┘                  │
│  Par Aïssatou Diop                │                           │
├───────────────────────────────────┴───────────────────────────┤
│ DERNIÈRES MINUTES                                             │
├──────────────┬──────────────┬──────────────┬──────────────────┤
│ POLITIQUE    │ SOCIÉTÉ      │ ÉCONOMIE     │ [PUBLICITÉ]      │
│ carte+liste  │ carte+liste  │ carte+liste  │                  │
├──────────────┴──────────────┴──────────────┴──────────────────┤
│ SPORTS      │ TECHNOLOGIES │ INTERNATIONAL │ DIASPORA        │
├───────────────────────────────────────────────────────────────┤
│ PODCASTS                              │ TV LIVE ▶            │
├───────────────────────────────────────┴───────────────────────┤
│ NEWSLETTER                                                    │
├───────────────────────────────────────────────────────────────┤
│ TENDANCES   #tag  #tag  #tag                                  │
├───────────────────────────────────────────────────────────────┤
│ FOOTER (rubriques · société · légal · réseaux · newsletter)    │
└───────────────────────────────────────────────────────────────┘
```

### 3.3 Article

```
┌───────────────────────────────────────────────┐
│ Fil d'Ariane : Accueil › Politique › Titre    │
├───────────────────────────────────────────────┤
│ RUBRIQUE · 3 min de lecture                   │
│ Titre de l'article                            │
│ Chapô                                         │
│ Par Aïssatou Diop · publié le 30/09 à 14:32   │
├───────────────────────────────────────────────┤
│         IMAGE PRINCIPALE + légende            │
├───────────────────────────────────────────────┤
│ Corps de l'article…                           │
│ [ ENCARTS PUBLICITAIRES INTERCALÉS ]          │
│ Articles liés                                 │
├───────────────────────────────────────────────┤
│ Commentaires (modérés)                        │
└───────────────────────────────────────────────┘
```

### 3.4 Recherche

```
┌───────────────────────────────────────────────┐
│ 🔍 [ senegal                    ] [Chercher]  │
├───────────────────────────────────────────────┤
│ 12 résultats · 0,04 s                         │
│ Filtres : [Rubrique ▾] [Date ▾] [Type ▾]      │
├───────────────────────────────────────────────┤
│ Résultat : titre, chapô, rubrique, date       │
│ …                                             │
└───────────────────────────────────────────────┘
```

### 3.5 Tableau de bord rédaction

```
┌───────────────┬───────────────────────────────┐
│ Menu          │ Vue d'ensemble                │
│ • Articles    │ ┌─────────┬─────────┐         │
│ • Planification│ │Visiteurs│ Pages   │         │
│ • Médias      │ ├─────────┼─────────┤         │
│ • Commentaires│ │Abonnés  │ Recettes│         │
│ • Analytics   │ └─────────┴─────────┘         │
│ • Utilisateurs│ Articles populaires            │
│ • Réglages    │ Origine du trafic              │
└───────────────┴───────────────────────────────┘
```

---

## 4. Composants d'interface

| Composant          | Fichier                                  | Rôle                          |
| ------------------ | ---------------------------------------- | ----------------------------- |
| `Header`           | `components/layout/header.tsx`           | Navigation, recherche, compte |
| `Footer`           | `components/layout/footer.tsx`           | Liens, société, légal         |
| `BreakingTicker`   | `components/layout/breaking-ticker.tsx`  | Bandeau « dernière minute »   |
| `Logo`             | `components/layout/logo.tsx`             | Logo SVG                      |
| `ThemeToggle`      | `components/layout/theme-toggle.tsx`     | Bascule clair/sombre          |
| `ArticleCard`      | `components/news/article-card.tsx`       | Carte d'article               |
| `SearchResultCard` | `components/news/search-result-card.tsx` | Résultat de recherche         |
| `CategoryBadge`    | `components/news/category-badge.tsx`     | Badge de rubrique             |
| `AdSlot`           | `components/news/ad-slot.tsx`            | Espace publicitaire           |
| `LatestUpdates`    | `components/home/latest-updates.tsx`     | Fil « dernières minutes »     |
| `TrendingTopics`   | `components/home/trending-topics.tsx`    | Tendances                     |
| `PodcastSection`   | `components/home/podcast-section.tsx`    | Bloc podcasts                 |
| `VideoSection`     | `components/home/video-section.tsx`      | Bloc vidéos                   |
| `NewsletterSignup` | `components/home/newsletter-signup.tsx`  | Inscription newsletter        |
| `JsonLd`           | `components/seo/json-ld.tsx`             | Données structurées           |

---

## 5. Accessibilité

- Contrastes conformes **WCAG AA** (le vert `#00853F` sur blanc atteint 4,6:1).
- Navigation clavier complète, focus visible.
- Lien d'évitement « Aller au contenu principal ».
- Attributs ARIA sur les composants interactifs.
- `prefers-reduced-motion` respecté pour les animations Framer Motion.
- Textes alternatifs obligatoires sur les médias éditoriaux.
- Objectif : score Lighthouse **Accessibilité 100**.

---

## 6. Performance perçue

- Squelettes de chargement (`Suspense`) sur les blocs dépendants de la base.
- Images en `next/image` : formats modernes, `sizes` explicites, chargement
  paresseux hors du premier écran.
- Animations limitées à l'opacité et à la transformation.
- Polices auto-hébergées par Next.js — zéro requête bloquante tierce.
