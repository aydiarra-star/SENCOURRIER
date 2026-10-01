import { NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  subject: z.enum(['redaction', 'abonnement', 'publicite', 'donnees', 'autre']),
  message: z.string().min(10).max(5000),
  consent: z.coerce.boolean(),
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
      { error: 'Formulaire incomplet ou invalide.', details: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  try {
    const upstream = await fetch(`${API_URL}/v1/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsed.data),
      signal: AbortSignal.timeout(5000),
    });

    if (!upstream.ok) {
      return NextResponse.json({ error: 'Envoi momentanément indisponible.' }, { status: 502 });
    }

    if (contentType.includes('application/json')) {
      return NextResponse.json({ ok: true }, { status: 201 });
    }
    return NextResponse.redirect(new URL('/contact?envoye=1', request.url), 303);
  } catch {
    return NextResponse.json({ error: 'Service temporairement indisponible.' }, { status: 503 });
  }
}
