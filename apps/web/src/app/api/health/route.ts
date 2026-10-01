import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * Sonde de disponibilité.
 * Utilisée par Azure Front Door et les vérifications de déploiement : elle
 * contrôle réellement la connexion PostgreSQL, pas seulement la vie du
 * processus Node.
 */
export async function GET() {
  const startedAt = Date.now();

  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json(
      {
        status: 'ok',
        service: 'sencourrier-web',
        database: 'up',
        latencyMs: Date.now() - startedAt,
        timestamp: new Date().toISOString(),
      },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch {
    return NextResponse.json(
      {
        status: 'degraded',
        service: 'sencourrier-web',
        database: 'down',
        latencyMs: Date.now() - startedAt,
        timestamp: new Date().toISOString(),
      },
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}
