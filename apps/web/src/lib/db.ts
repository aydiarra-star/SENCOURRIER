/**
 * Accès unique à la base de données pour le serveur Next.js.
 * Le client est instancié une seule fois par processus (voir @sencourrier/database).
 */
export { prisma } from '@sencourrier/database';
