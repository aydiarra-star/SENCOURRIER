-- ═══════════════════════════════════════════════════════════════════════════
-- SENCOURRIER — initialisation PostgreSQL
-- Exécuté une seule fois, à la création du volume de données.
-- ═══════════════════════════════════════════════════════════════════════════

-- pgvector : recherche sémantique de l'assistant IA (architecture RAG).
CREATE EXTENSION IF NOT EXISTS vector;

-- pg_trgm : recherche « floue » sur les titres, pour les suggestions et la
-- détection de doublons éditoriaux.
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- unaccent : rechercher « senegal » et trouver « Sénégal ».
CREATE EXTENSION IF NOT EXISTS unaccent;

-- pg_stat_statements : identification des requêtes lentes en production.
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
