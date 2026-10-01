/**
 * The editorial taxonomy is the single source of truth shared by the database
 * seed, the public navigation, the SEO sitemap and the AI assistant prompts.
 * Slugs are URL-safe, accent-free and stable — changing one breaks permalinks.
 */

export interface SubCategoryDefinition {
  readonly slug: string;
  readonly name: string;
  readonly description: string;
}

export interface CategoryDefinition {
  readonly slug: string;
  readonly name: string;
  /** Short label used in dense navigation and mobile tab bars. */
  readonly shortName: string;
  readonly description: string;
  /** Tailwind-safe brand accent used for the category eyebrow. */
  readonly accent: 'green' | 'yellow' | 'red' | 'slate' | 'blue' | 'violet' | 'orange' | 'teal';
  /** Google News / sitemap priority hint. */
  readonly priority: number;
  readonly subcategories: readonly SubCategoryDefinition[];
}

export const CATEGORIES: readonly CategoryDefinition[] = [
  {
    slug: 'politique',
    name: 'Politique',
    shortName: 'Politique',
    description:
      "Toute l'actualité politique du Sénégal : présidence, gouvernement, Assemblée nationale, élections et partis politiques.",
    accent: 'green',
    priority: 0.95,
    subcategories: [
      {
        slug: 'presidence',
        name: 'Présidence',
        description: 'Les actes et déplacements du chef de l’État.',
      },
      {
        slug: 'gouvernement',
        name: 'Gouvernement',
        description: 'Conseils des ministres, nominations et politiques publiques.',
      },
      {
        slug: 'assemblee-nationale',
        name: 'Assemblée nationale',
        description: 'Travaux parlementaires, lois et commissions d’enquête.',
      },
      {
        slug: 'elections',
        name: 'Élections',
        description: 'Scrutins, campagnes et résultats électoraux.',
      },
      {
        slug: 'partis-politiques',
        name: 'Partis politiques',
        description: 'Vie des formations politiques et coalitions.',
      },
    ],
  },
  {
    slug: 'societe',
    name: 'Société',
    shortName: 'Société',
    description:
      'Éducation, santé, religion, culture, environnement et jeunesse : les grands enjeux de la société sénégalaise.',
    accent: 'teal',
    priority: 0.9,
    subcategories: [
      {
        slug: 'education',
        name: 'Éducation',
        description: 'École, université, examens et formation professionnelle.',
      },
      {
        slug: 'sante',
        name: 'Santé',
        description: 'Hôpitaux, épidémies, couverture sanitaire et bien-être.',
      },
      {
        slug: 'religion',
        name: 'Religion',
        description: 'Vie religieuse, confréries et événements cultuels.',
      },
      {
        slug: 'culture',
        name: 'Culture',
        description: 'Arts, musique, cinéma, littérature et patrimoine.',
      },
      {
        slug: 'environnement',
        name: 'Environnement',
        description: 'Climat, littoral, pollution et transition écologique.',
      },
      {
        slug: 'jeunesse',
        name: 'Jeunesse',
        description: 'Emploi des jeunes, initiatives et engagement citoyen.',
      },
    ],
  },
  {
    slug: 'economie',
    name: 'Économie',
    shortName: 'Éco',
    description:
      "Entreprises, startups, finances, bourse, agriculture, pêche et énergie : l'économie sénégalaise décryptée.",
    accent: 'yellow',
    priority: 0.9,
    subcategories: [
      {
        slug: 'entreprises',
        name: 'Entreprises',
        description: 'Stratégies, résultats et vie des sociétés.',
      },
      {
        slug: 'startups',
        name: 'Startups',
        description: 'Écosystème tech, levées de fonds et innovation.',
      },
      {
        slug: 'finances',
        name: 'Finances',
        description: 'Banques, microfinance, mobile money et budget de l’État.',
      },
      {
        slug: 'bourse',
        name: 'Bourse',
        description: 'BRVM, marchés financiers et indices régionaux.',
      },
      {
        slug: 'agriculture',
        name: 'Agriculture',
        description: 'Campagnes agricoles, filières et souveraineté alimentaire.',
      },
      {
        slug: 'peche',
        name: 'Pêche',
        description: 'Ressources halieutiques, accords et communautés de pêcheurs.',
      },
      {
        slug: 'energie',
        name: 'Énergie',
        description: 'Pétrole, gaz, électricité et énergies renouvelables.',
      },
    ],
  },
  {
    slug: 'sports',
    name: 'Sports',
    shortName: 'Sports',
    description:
      'Football, lutte, basketball, handball et compétitions africaines et internationales : le sport sénégalais au quotidien.',
    accent: 'blue',
    priority: 0.9,
    subcategories: [
      {
        slug: 'football',
        name: 'Football',
        description: 'Lions de la Teranga, championnat local et transferts.',
      },
      {
        slug: 'lutte',
        name: 'Lutte',
        description: 'Lutte sénégalaise, arènes, écuries et grands combats.',
      },
      {
        slug: 'basketball',
        name: 'Basketball',
        description: 'Ligue sénégalaise, sélections et NBA.',
      },
      {
        slug: 'handball',
        name: 'Handball',
        description: 'Championnats nationaux et compétitions continentales.',
      },
      {
        slug: 'competitions-africaines',
        name: 'Compétitions africaines',
        description: 'CAN, CAF, ligues des champions africaines.',
      },
      {
        slug: 'competitions-internationales',
        name: 'Compétitions internationales',
        description: 'Mondiaux, Jeux olympiques et tournois majeurs.',
      },
    ],
  },
  {
    slug: 'technologies',
    name: 'Technologies',
    shortName: 'Tech',
    description:
      "Intelligence artificielle, innovation, télécoms et cybersécurité : la transformation numérique du Sénégal et de l'Afrique.",
    accent: 'violet',
    priority: 0.85,
    subcategories: [
      {
        slug: 'ia',
        name: 'Intelligence artificielle',
        description: 'IA générative, recherche et usages métiers.',
      },
      {
        slug: 'innovation',
        name: 'Innovation',
        description: 'Laboratoires, prototypes et transfert de technologie.',
      },
      {
        slug: 'telecoms',
        name: 'Télécoms',
        description: 'Opérateurs, fibre, 4G/5G et couverture réseau.',
      },
      {
        slug: 'cybersecurite',
        name: 'Cybersécurité',
        description: 'Menaces, fuites de données et souveraineté numérique.',
      },
    ],
  },
  {
    slug: 'faits-divers',
    name: 'Faits Divers',
    shortName: 'Faits divers',
    description: 'Justice, sécurité, accidents et enquêtes : les faits divers au Sénégal.',
    accent: 'red',
    priority: 0.85,
    subcategories: [
      {
        slug: 'justice',
        name: 'Justice',
        description: 'Procès, décisions de justice et institutions judiciaires.',
      },
      {
        slug: 'securite',
        name: 'Sécurité',
        description: 'Police, gendarmerie et lutte contre la criminalité.',
      },
      {
        slug: 'accidents',
        name: 'Accidents',
        description: 'Routes, incendies et accidents industriels.',
      },
      {
        slug: 'enquetes',
        name: 'Enquêtes',
        description: 'Investigations et révélations exclusives.',
      },
    ],
  },
  {
    slug: 'international',
    name: 'International',
    shortName: 'International',
    description:
      'Afrique, CEDEAO, Europe, Asie, Moyen-Orient et Amériques : le monde vu depuis Dakar.',
    accent: 'slate',
    priority: 0.85,
    subcategories: [
      {
        slug: 'afrique',
        name: 'Afrique',
        description: 'Actualité continentale et intégration africaine.',
      },
      {
        slug: 'cedeao',
        name: 'CEDEAO',
        description: 'Communauté économique des États de l’Afrique de l’Ouest.',
      },
      {
        slug: 'europe',
        name: 'Europe',
        description: 'Union européenne et relations euro-africaines.',
      },
      { slug: 'asie', name: 'Asie', description: 'Chine, Inde, Japon et partenariats asiatiques.' },
      {
        slug: 'moyen-orient',
        name: 'Moyen-Orient',
        description: 'Golfe, Levant et enjeux stratégiques.',
      },
      {
        slug: 'ameriques',
        name: 'Amériques',
        description: 'États-Unis, Canada et Amérique latine.',
      },
    ],
  },
  {
    slug: 'diaspora',
    name: 'Diaspora',
    shortName: 'Diaspora',
    description:
      "La vie des Sénégalais de l'étranger : France, Italie, Espagne, États-Unis et Canada.",
    accent: 'orange',
    priority: 0.8,
    subcategories: [
      { slug: 'france', name: 'France', description: 'Communauté sénégalaise de France.' },
      { slug: 'italie', name: 'Italie', description: 'Communauté sénégalaise d’Italie.' },
      { slug: 'espagne', name: 'Espagne', description: 'Communauté sénégalaise d’Espagne.' },
      {
        slug: 'etats-unis',
        name: 'États-Unis',
        description: 'Communauté sénégalaise des États-Unis.',
      },
      { slug: 'canada', name: 'Canada', description: 'Communauté sénégalaise du Canada.' },
    ],
  },
] as const;

/** Sections that also get a dedicated vertical in the media hub (TV, radio, podcasts). */
export const MEDIA_VERTICALS = ['tv-live', 'podcasts', 'videos'] as const;
export type MediaVertical = (typeof MEDIA_VERTICALS)[number];

export function findCategory(slug: string): CategoryDefinition | undefined {
  return CATEGORIES.find((category) => category.slug === slug);
}

export function allSubCategorySlugs(): string[] {
  return CATEGORIES.flatMap((category) => category.subcategories.map((sub) => sub.slug));
}
