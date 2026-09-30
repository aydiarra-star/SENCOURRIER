import { NextResponse } from 'next/server';
import { getState } from '@/lib/store';
export async function GET(req:Request) { const q=(new URL(req.url).searchParams.get('q')||'').trim().toLowerCase().slice(0,100); const {articles}=await getState(); return NextResponse.json(q ? articles.filter(a=>a.status==='published' && `${a.title} ${a.excerpt} ${a.category} ${a.body}`.toLowerCase().includes(q)).slice(0,30) : []); }
