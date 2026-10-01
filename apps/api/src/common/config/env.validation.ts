import { z } from 'zod';

/**
 * Validation stricte de l'environnement au démarrage.
 *
 * Le processus refuse de démarrer si une variable obligatoire manque : mieux
 * vaut un échec immédiat et explicite qu'un service en production qui tombe à
 * la première requête sur une clé absente.
 */
const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  API_PORT: z.coerce.number().int().positive().default(3001),
  APP_URL: z.string().url().default('http://localhost:3000'),
  API_PUBLIC_URL: z.string().url().default('http://localhost:3001'),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),

  DATABASE_URL: z.string().min(1, 'DATABASE_URL est obligatoire'),

  REDIS_URL: z.string().default('redis://localhost:6379'),
  REDIS_PASSWORD: z.string().optional().default(''),
  REDIS_TLS: z.coerce.boolean().default(false),

  CORS_ORIGINS: z.string().default('http://localhost:3000'),

  JWT_ACCESS_SECRET: z.string().min(16, 'JWT_ACCESS_SECRET doit faire au moins 16 caractères'),
  JWT_REFRESH_SECRET: z.string().min(16, 'JWT_REFRESH_SECRET doit faire au moins 16 caractères'),
  JWT_ACCESS_TTL: z.string().default('15m'),
  JWT_REFRESH_TTL: z.string().default('30d'),
  JWT_ISSUER: z.string().default('sencourrier.sn'),
  JWT_AUDIENCE: z.string().default('sencourrier-web'),

  GOOGLE_CLIENT_ID: z.string().optional().default(''),
  GOOGLE_CLIENT_SECRET: z.string().optional().default(''),

  TWO_FACTOR_ISSUER: z.string().default('SENCOURRIER'),
  TWO_FACTOR_ENCRYPTION_KEY: z.string().optional().default(''),

  AZURE_STORAGE_ACCOUNT_NAME: z.string().optional().default(''),
  AZURE_STORAGE_ACCOUNT_KEY: z.string().optional().default(''),
  AZURE_STORAGE_CONTAINER_MEDIA: z.string().default('media'),
  AZURE_STORAGE_PUBLIC_BASE_URL: z.string().optional().default(''),

  RESEND_API_KEY: z.string().optional().default(''),
  MAIL_FROM_EMAIL: z.string().default('noreply@sencourrier.sn'),
  MAIL_FROM_NAME: z.string().default('SENCOURRIER'),
  MAIL_REPLY_TO: z.string().default('redaction@sencourrier.sn'),

  ELASTICSEARCH_URL: z.string().default('http://localhost:9200'),
  ELASTICSEARCH_ENABLED: z.coerce.boolean().default(false),

  AZURE_OPENAI_ENDPOINT: z.string().optional().default(''),
  AZURE_OPENAI_API_KEY: z.string().optional().default(''),
  AZURE_OPENAI_DEPLOYMENT_CHAT: z.string().default('gpt-4o'),
  AI_ASSISTANT_ENABLED: z.coerce.boolean().default(false),
  AI_RAG_TOP_K: z.coerce.number().int().positive().default(8),

  STRIPE_SECRET_KEY: z.string().optional().default(''),
  STRIPE_WEBHOOK_SECRET: z.string().optional().default(''),
  WAVE_API_KEY: z.string().optional().default(''),
  WAVE_WEBHOOK_SECRET: z.string().optional().default(''),
  ORANGE_MONEY_CLIENT_ID: z.string().optional().default(''),
  ORANGE_MONEY_CLIENT_SECRET: z.string().optional().default(''),
  FREE_MONEY_API_KEY: z.string().optional().default(''),

  RATE_LIMIT_TTL: z.coerce.number().int().positive().default(60),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(120),
  RATE_LIMIT_AUTH_MAX: z.coerce.number().int().positive().default(10),

  WEB_PUSH_PUBLIC_KEY: z.string().optional().default(''),
  WEB_PUSH_PRIVATE_KEY: z.string().optional().default(''),
  WEB_PUSH_SUBJECT: z.string().default('mailto:redaction@sencourrier.sn'),
});

export type Env = z.infer<typeof schema>;

export function validateEnv(raw: Record<string, unknown>): Env {
  const parsed = schema.safeParse(raw);

  if (!parsed.success) {
    const details = parsed.error.issues
      .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
      .join('\n');
    throw new Error(`Configuration d'environnement invalide :\n${details}`);
  }

  return parsed.data;
}
