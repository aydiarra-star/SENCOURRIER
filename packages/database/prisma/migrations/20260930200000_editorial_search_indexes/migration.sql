-- ═══════════════════════════════════════════════════════════════════════════
-- SENCOURRIER — Recherche éditoriale insensible aux accents
--
-- Les lecteurs sénégalais saisissent indifféremment « Senegal » ou « Sénégal ».
-- L'API et le site filtrent via des requêtes `ILIKE`, insensibles à la casse
-- mais pas aux diacritiques. Les index d'expression ci-dessous rendent ces
-- recherches indexables grâce à pg_trgm.
--
-- `unaccent(text)` est déclarée STABLE, pas IMMUTABLE : PostgreSQL refuse donc
-- d'indexer son appel direct. On l'enveloppe dans une fonction déclarée
-- immuable — c'est la seule façon d'indexer le résultat.
--
-- IMPORTANT : les requêtes applicatives doivent appeler exactement
-- `lower(public.sencourrier_unaccent(colonne))`. Toute autre forme (appel
-- direct à `unaccent`, absence de `lower()`, schéma différent) ne
-- correspondrait pas à l'index et retomberait sur un parcours complet de table.
-- ═══════════════════════════════════════════════════════════════════════════

-- Les extensions sont déclarées ici plutôt que supposées présentes : la
-- migration doit pouvoir s'appliquer sur une base vierge quelconque (poste de
-- développement, Azure Database for PostgreSQL), et non seulement sur le
-- volume Docker initialisé par infra/docker/initdb.
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;

CREATE OR REPLACE FUNCTION sencourrier_unaccent(value text)
RETURNS text
LANGUAGE sql
IMMUTABLE
PARALLEL SAFE
STRICT
AS $$ SELECT public.unaccent('public.unaccent'::regdictionary, value) $$;

CREATE INDEX IF NOT EXISTS "articles_title_unaccent_trgm_idx"
  ON "articles" USING gin (lower(sencourrier_unaccent("title")) gin_trgm_ops);

CREATE INDEX IF NOT EXISTS "articles_excerpt_unaccent_trgm_idx"
  ON "articles" USING gin (lower(sencourrier_unaccent("excerpt")) gin_trgm_ops);

CREATE INDEX IF NOT EXISTS "tags_name_unaccent_trgm_idx"
  ON "tags" USING gin (lower(sencourrier_unaccent("name")) gin_trgm_ops);
