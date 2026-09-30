import { NextResponse } from 'next/server';
import { getState, updateState } from '@/lib/store';
import { cleanText, error, validEmail } from '@/lib/http';
export async function GET(req:Request) { const articleId=new URL(req.url).searchParams.get('articleId'); if(!articleId) return error('Article requis.'); const state=await getState(); return NextResponse.json(state.comments.filter(c=>c.articleId===articleId && c.approved).map(c=>({id:c.id,articleId:c.articleId,name:c.name,body:c.body,approved:c.approved,createdAt:c.createdAt}))); }
export async function POST(req:Request) {
 try { const data=await req.json(); const articleId=cleanText(data.articleId,100), name=cleanText(data.name,80), email=cleanText(data.email,254).toLowerCase(), body=cleanText(data.body,2000);
  if(!name || !validEmail(email) || body.length<3) return error('Veuillez remplir tous les champs correctement.');
  const accepted=await updateState(state=>{ if(!state.articles.some(a=>a.id===articleId && a.status==='published')) return false; state.comments.push({id:crypto.randomUUID(),articleId,name,email,body,approved:false,createdAt:new Date().toISOString()}); return true; });
  if(!accepted) return error('Article introuvable.',404);
  return NextResponse.json({message:'Merci ! Votre commentaire sera visible après modération.'},{status:201});
 } catch { return error('Impossible de traiter la demande.'); }
}
