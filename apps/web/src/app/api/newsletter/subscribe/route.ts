import { NextResponse } from 'next/server';
import { z } from 'zod';

/**
 * Inscription à la newsletter.
 *
 * En production, la route relaie vers l'API NestJS qui gère la double
 * confirmation et l'envoi via Resend. La validation Zod est appliquée ici pour
 * rejeter les requêtes malformées avant tout appel réseau.
 */
const schema = z.object({
  email: z.string().email(),
  list: z.enum(['essentiel', 'alerte', 'economie', 'diaspora']).optional(),
});

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export async function POST(request: Request) {
  const contentType = request.headers.get('content-type') ?? '';
  const payload = contentType.includes('application/json')
    ? await request.json().catch(() => ({}))
    : Object.fromEntries(await request.formData());

  const parsed = schema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Adresse email invalide.', details: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  try {
    const upstream = await fetch(`${API_URL}/v1/newsletter/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsed.data),
      // Une inscription ne doit jamais bloquer le rendu : on abandonne après 5 s.
      signal: AbortSignal.timeout(5000),
    });

    if (!upstream.ok) {
      return NextResponse.json({ error: 'Inscription momentanément indisponible.' }, { status: 502 });
    }

    if (contentType.includes('application/json')) {
      return NextResponse.json({ ok: true }, { status: 201 });
    }
    return NextResponse.redirect(new URL('/newsletter?inscrit=1', request.url), 303);
  } catch {
    return NextResponse.json({ error: 'Service temporairement indisponible.' }, { status: 503 });
  }
}
