import raw from '@/data/snapshot.json';
import type {
  AdSlotData,
  Card,
  FullArticle,
  NavCategory,
  Plan,
  Section,
  Show,
  Snapshot,
  TagItem,
  Update,
  VideoItem,
} from '@/lib/types';

/**
 * L'aperçu publié sur GitHub Pages est entièrement statique : ni serveur, ni
 * base de données. Les données proviennent d'un instantané du jeu de
 * démonstration, exporté à la construction par `scripts/export-showcase-data.ts`.
 *
 * Les dates arrivent sous forme de chaînes JSON ; `revive` les convertit en
 * `Date` pour que les composants reçoivent exactement ce qu'ils attendent.
 */
function revive<T>(value: unknown): T {
  if (Array.isArray(value)) return value.map((item) => revive(item)) as T;
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [key, raw] of Object.entries(value as Record<string, unknown>)) {
      out[key] =
        typeof raw === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(raw)
          ? new Date(raw)
          : revive(raw);
    }
    return out as T;
  }
  return value as T;
}

const snapshot = raw as unknown as Snapshot;

export const articles = {
  lead: revive<Card | null>(snapshot.lead),
  secondary: revive<Card[]>(snapshot.secondary),
  featured: revive<Card[]>(snapshot.featured),
  breaking: revive<Update[]>(snapshot.breaking),
  latest: revive<Update[]>(snapshot.latest),
  related: revive<Card[]>(snapshot.related),
  full: revive<FullArticle | null>(snapshot.article),
  sections: revive<Section[]>(snapshot.sections),
};

export const taxonomy = {
  categories: snapshot.categories as NavCategory[],
  tags: revive<TagItem[]>(snapshot.tags),
};

export const media = {
  podcasts: revive<Show[]>(snapshot.podcasts),
  videos: revive<VideoItem[]>(snapshot.videos),
  ad: snapshot.ad as AdSlotData | null,
};

export const commerce = {
  plans: revive<Plan[]>(snapshot.plans),
};

export const meta = {
  generatedAt: new Date(snapshot.generatedAt),
  articleCount: snapshot.sections.reduce((total, section) => total + section.articles.length, 0),
};
