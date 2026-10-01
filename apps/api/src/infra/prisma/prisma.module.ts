import { Global, Module, type OnModuleDestroy, type OnModuleInit } from '@nestjs/common';
import { prisma, type PrismaClient } from '@sencourrier/database';

export const PRISMA = Symbol('PRISMA');

/**
 * Accès PostgreSQL.
 *
 * Le client provient de `@sencourrier/database` afin que le web et l'API
 * partagent exactement le même schéma généré et la même configuration de pool.
 */
@Global()
@Module({
  providers: [{ provide: PRISMA, useValue: prisma }],
  exports: [PRISMA],
})
export class PrismaModule implements OnModuleInit, OnModuleDestroy {
  /**
   * Azure App Service ne redémarre pas un conteneur dont la base est
   * injoignable : échouer ici fait échouer le déploiement, ce qui vaut mieux
   * qu'un service qui répond 500 sur toutes ses routes.
   */
  async onModuleInit(): Promise<void> {
    await prisma.$queryRaw`SELECT 1`;
  }

  async onModuleDestroy(): Promise<void> {
    await prisma.$disconnect();
  }
}

/** Type du client injecté via le jeton `PRISMA`. */
export type Database = PrismaClient;
