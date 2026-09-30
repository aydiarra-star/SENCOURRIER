import { NextRequest, NextResponse } from 'next/server';
import { getState, updateState } from '@/lib/store';
import { adminAuthorized, unauthorized, error, cleanText, slugify, validEmail } from '@/lib/http';
import { categories } from '@/lib/content';
import type { State, Article, Journalist, User } from '@/lib/types';
const resources=['articles','journalists','users','comments','subscribers','messages'] as const;
type Resource=typeof resources[number];
const allowed=(r:string):r is Resource=>resources.includes(r as Resource);
const csvCell=(value:string)=>`"${(/^[=+\-@\t\r]/.test(value)?"'":'')+value.replaceAll('"','""')}"`;
export async function GET(req:NextRequest,{params}:{params:Promise<{resource:string}>}) {
 if(!adminAuthorized(req)) return unauthorized(); const {resource}=await params; if(!allowed(resource)) return error('Ressource inconnue.',404);
 const state=await getState();
 if(resource==='subscribers' && req.nextUrl.searchParams.get('format')==='csv') { const csv='\uFEFFemail,date\n'+state.subscribers.map(s=>`${csvCell(s.email)},${csvCell(s.createdAt)}`).join('\n'); return new NextResponse(csv,{headers:{'Content-Type':'text/csv; charset=utf-8','Content-Disposition':'attachment; filename="abonnes-sencourrier.csv"'}}); }
 return NextResponse.json(state[resource],{headers:{'Cache-Control':'no-store'}});
}
export async function POST(req:NextRequest,{params}:{params:Promise<{resource:string}>}) {
 if(!adminAuthorized(req)) return unauthorized(); const {resource}=await params; if(!['articles','journalists','users'].includes(resource)) return error('Action non autorisée.',405);
 try { const data=await req.json();
  if(resource==='articles') {
   const title=cleanText(data.title,180), excerpt=cleanText(data.excerpt,500), body=cleanText(data.body,20000), category=cleanText(data.category,50), author=cleanText(data.author,100);
   if(!title || !excerpt || !body || !author || !categories.some(c=>c.slug===category)) return error('Titre, résumé, rubrique, auteur et contenu sont requis.');
   const article=await updateState(state=>{ let slug=slugify(title); if(!slug) slug=crypto.randomUUID(); const base=slug; let n=2; while(state.articles.some(a=>a.slug===slug)) slug=`${base}-${n++}`; const item:Article={id:crypto.randomUUID(),slug,title,excerpt,body,category,author,image:cleanText(data.image,300)||'/images/dakar-coast.jpg',publishedAt:new Date().toISOString(),readingTime:Math.max(1,Math.ceil(body.length/900)),featured:false,status:data.status==='draft'?'draft':'published'}; state.articles.unshift(item); return item; });
   return NextResponse.json(article,{status:201});
  }
  if(resource==='journalists') { const name=cleanText(data.name,100), role=cleanText(data.role,100), bio=cleanText(data.bio,1000); if(!name || !role) return error('Nom et fonction requis.'); const item=await updateState(state=>{const j:Journalist={id:crypto.randomUUID(),name,role,bio,initials:name.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase()}; state.journalists.push(j);return j;}); return NextResponse.json(item,{status:201}); }
  const name=cleanText(data.name,100), email=cleanText(data.email,254), role=cleanText(data.role,100); if(!name || !validEmail(email)) return error('Nom et e-mail valides requis.'); const item=await updateState(state=>{const u:User={id:crypto.randomUUID(),name,email,role:role||'Rédacteur'};state.users.push(u);return u;}); return NextResponse.json(item,{status:201});
 } catch { return error('Données invalides.'); }
}
export async function PATCH(req:NextRequest,{params}:{params:Promise<{resource:string}>}) {
 if(!adminAuthorized(req)) return unauthorized(); const {resource}=await params; if(!allowed(resource) || ['subscribers','messages'].includes(resource)) return error('Action non autorisée.',405);
 try { const data=await req.json(); const id=cleanText(data.id,100); if(!id) return error('Identifiant requis.');
  const updated=await updateState(state=>{const list=state[resource as keyof State] as {id:string}[]; const item=list.find(i=>i.id===id); if(!item) return null;
   if(resource==='comments') (item as State['comments'][number]).approved=Boolean(data.approved);
   if(resource==='articles') {const a=item as Article; for(const field of ['title','excerpt','body','author','image'] as const) if(typeof data[field]==='string') a[field]=cleanText(data[field],field==='body'?20000:500); if(data.status==='draft'||data.status==='published') a.status=data.status; if(categories.some(c=>c.slug===data.category)) a.category=data.category; }
   if(resource==='journalists') {const j=item as Journalist; for(const field of ['name','role','bio'] as const) if(typeof data[field]==='string') j[field]=cleanText(data[field],1000);}
   if(resource==='users') {const u=item as User; for(const field of ['name','role'] as const) if(typeof data[field]==='string') u[field]=cleanText(data[field],100);}
   return item;
  }); return updated?NextResponse.json(updated):error('Élément introuvable.',404);
 } catch {return error('Données invalides.');}
}
export async function DELETE(req:NextRequest,{params}:{params:Promise<{resource:string}>}) {
 if(!adminAuthorized(req)) return unauthorized(); const {resource}=await params; if(!allowed(resource)) return error('Ressource inconnue.',404);
 const id=req.nextUrl.searchParams.get('id'); if(!id) return error('Identifiant requis.');
 const deleted=await updateState(state=>{const list=state[resource] as {id:string}[]; const index=list.findIndex(i=>i.id===id); if(index<0) return false; list.splice(index,1); if(resource==='articles') state.comments=state.comments.filter(c=>c.articleId!==id); return true;});
 return deleted?NextResponse.json({ok:true}):error('Élément introuvable.',404);
}
