import { NextResponse } from 'next/server';
import { updateState } from '@/lib/store';
import { cleanText, error, validEmail } from '@/lib/http';
export async function POST(req:Request) {
 try { const data=await req.json(); const email=cleanText(data.email,254).toLowerCase(); if (!validEmail(email)) return error('Adresse e-mail invalide.');
  const result=await updateState(state=>{ if(state.subscribers.some(s=>s.email===email)) return false; state.subscribers.push({id:crypto.randomUUID(),email,createdAt:new Date().toISOString()}); return true; });
  return NextResponse.json({message:result?'Inscription confirmée. Bienvenue parmi nous !':'Vous êtes déjà inscrit·e à notre newsletter.'});
 } catch { return error('Impossible de traiter la demande.'); }
}
