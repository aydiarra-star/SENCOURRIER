import { Injectable, Logger, type OnModuleDestroy, type OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

/**
 * Client Redis partagé.
 *
 * Utilisé pour le cache applicatif, la limitation de débit et l'invalidation
 * des pages ISR côté web. La connexion est ouverte au démarrage et fermée
 * proprement à l'arrêt pour ne pas laisser de sockets orphelines.
 */
@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: Redis | null = null;

  constructor(private readonly config: ConfigService) {}

  onModuleInit(): void {
    const url = this.config.get<string>('REDIS_URL', 'redis://localhost:6379');
    const password = this.config.get<string>('REDIS_PASSWORD');

    this.client = new Redis(url, {
      password: password || undefined,
      lazyConnect: false,
      maxRetriesPerRequest: 3,
      enableOfflineQueue: true,
    });

    this.client.on('error', (error: Error) => {
      // Redis est un accélérateur, pas une dépendance dure : on journalise
      // sans interrompre le service.
      this.logger.warn(`Redis indisponible : ${error.message}`);
    });

    this.client.on('connect', () => this.logger.log('Connecté à Redis'));
  }

  async onModuleDestroy(): Promise<void> {
    await this.client?.quit().catch(() => undefined);
  }

  get raw(): Redis {
    if (!this.client) throw new Error('RedisService utilisé avant initialisation');
    return this.client;
  }

  async get<T>(key: string): Promise<T | null> {
    const value = await this.client?.get(key);
    return value ? (JSON.parse(value) as T) : null;
  }

  async set(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
    const payload = JSON.stringify(value);
    if (ttlSeconds) await this.client?.set(key, payload, 'EX', ttlSeconds);
    else await this.client?.set(key, payload);
  }

  async del(...keys: string[]): Promise<void> {
    if (keys.length > 0) await this.client?.del(...keys);
  }

  /** Supprime toutes les clés d'un préfixe logique (invalidation ciblée). */
  async delByPrefix(prefix: string): Promise<number> {
    const stream = this.client?.scanStream({ match: `${prefix}*`, count: 200 });
    if (!stream) return 0;

    let deleted = 0;
    for await (const batch of stream) {
      const keys = batch as string[];
      if (keys.length > 0) deleted += await this.client!.del(...keys);
    }
    return deleted;
  }

  async ping(): Promise<boolean> {
    try {
      return (await this.client?.ping()) === 'PONG';
    } catch {
      return false;
    }
  }
}
