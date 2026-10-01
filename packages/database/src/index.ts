import { PrismaClient } from '../generated/client';

/**
 * A single PrismaClient must be reused across hot reloads in development,
 * otherwise every HMR pass opens a new pool and exhausts PostgreSQL connections.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export * from '../generated/client';
export { Prisma } from '../generated/client';
