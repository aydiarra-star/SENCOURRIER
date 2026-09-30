-- Schéma opérationnel : le serveur utilise une ligne JSONB transactionnelle.
CREATE TABLE IF NOT EXISTS app_state (
  id integer PRIMARY KEY,
  data jsonb NOT NULL
);
-- Le fichier local data/state.json est utilisé si DATABASE_URL est absent.
