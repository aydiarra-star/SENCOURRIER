import { Controller, Get, Inject } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { HealthCheck, HealthCheckService, MemoryHealthIndicator } from '@nestjs/terminus';
import { PrismaClient } from '@sencourrier/database';
import { Public } from '../../common/decorators/auth.decorators';
import { PRISMA } from '../../infra/prisma/prisma.module';
import { RedisService } from '../../infra/redis/redis.service';

@ApiTags('Supervision')
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly memory: MemoryHealthIndicator,
    @Inject(PRISMA) private readonly prisma: PrismaClient,
    private readonly redis: RedisService,
  ) {}

  @Public()
  @Get()
  @HealthCheck()
  @ApiOperation({ summary: 'Sonde de disponibilité complète' })
  check() {
    return this.health.check([
      () => this.checkDatabase(),
      () => this.memory.checkHeap('memory_heap', 512 * 1024 * 1024),
      () => this.checkRedis(),
    ]);
  }

  @Public()
  @Get('live')
  @ApiOperation({ summary: 'Sonde de vivacité (Kubernetes liveness)' })
  live() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }

  @Public()
  @Get('ready')
  @ApiOperation({ summary: 'Sonde de démarrage (Kubernetes readiness)' })
  async ready() {
    const reachable = await this.redis.ping();
    return {
      status: reachable ? 'ready' : 'degraded',
      checks: { database: true, redis: reachable },
    };
  }

  private async checkDatabase() {
    const started = Date.now();
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { database: { status: 'up' as const, latencyMs: Date.now() - started } };
    } catch (error) {
      return {
        database: {
          status: 'down' as const,
          latencyMs: Date.now() - started,
          message: error instanceof Error ? error.message : 'PostgreSQL injoignable',
        },
      };
    }
  }

  private async checkRedis() {
    const started = Date.now();
    const reachable = await this.redis.ping();
    return {
      redis: {
        status: reachable ? ('up' as const) : ('down' as const),
        latencyMs: Date.now() - started,
      },
    };
  }
}
