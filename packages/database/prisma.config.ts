import 'dotenv/config';
import { defineConfig } from 'prisma/config';

/**
 * Prisma 6 configuration. Replaces the deprecated `package.json#prisma` key.
 * Declaring a config file disables Prisma's automatic .env loading, so dotenv
 * is imported explicitly above — without it `prisma migrate` would not see
 * DATABASE_URL in local development.
 */
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    seed: 'tsx prisma/seed.ts',
  },
});
