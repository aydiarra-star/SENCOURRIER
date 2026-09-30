import { NextResponse } from 'next/server';
import { updateState } from '@/lib/store';
import { cleanText, error, validEmail } from '@/lib/http';
export async function POST(req:Request) {
 try { const data=await req.json(); const name=cleanText(data.name,80), email=cleanText(data.email,254), subject=cleanText(data.subject,120), message=cleanText(data.message,4000);
  if(!name || !validEmail(email) || !subject || message.length<10) return error('Veuillez remplir tous les champs correctement.');
  await updateState(state=>{state.messages.push({id:crypto.randomUUID(),name,email,subject,message,createdAt:new Date().toISOString()});});
  return NextResponse.json({message:'Votre message a bien été reçu. Merci !'},{status:201});
 } catch { return error('Impossible de traiter la demande.'); }
}
