#!/bin/sh
# ═══════════════════════════════════════════════════════════════════════════
# SENCOURRIER — démarrage du conteneur API
#
# Les migrations sont appliquées ici, et non dans le pipeline de build : la
# base n'est joignable qu'à l'exécution. `migrate deploy` est idempotent et
# sans interaction, contrairement à `migrate dev`.
# ═══════════════════════════════════════════════════════════════════════════
set -e

if [ "${RUN_MIGRATIONS:-true}" = "true" ]; then
  echo "[entrypoint] Application des migrations Prisma…"
  npx prisma migrate deploy --schema=packages/database/prisma/schema.prisma
fi

if [ "${RUN_SEED:-false}" = "true" ]; then
  echo "[entrypoint] Chargement du jeu de données de démonstration…"
  node -e "require('tsx/cjs'); require('./packages/database/prisma/seed.ts')" 2>/dev/null \
    || npx tsx packages/database/prisma/seed.ts
fi

echo "[entrypoint] Démarrage : $*"
exec "$@"
