import { timingSafeEqual } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
export function adminAuthorized(req: NextRequest) {
 const password = process.env.ADMIN_PASSWORD;
 if (!password) return true;
 const header = req.headers.get('authorization');
 if (!header?.startsWith('Basic ')) return false;
 try { const [user, pass] = Buffer.from(header.slice(6),'base64').toString('utf8').split(':');
  const a=Buffer.from(pass||''); const b=Buffer.from(password);
  return user === (process.env.ADMIN_USER || 'admin') && a.length === b.length && timingSafeEqual(a,b);
 } catch { return false; }
}
export function unauthorized() { return new NextResponse('Authentification requise',{status:401,headers:{'WWW-Authenticate':'Basic realm="Sencourrier rédaction", charset="UTF-8"'}}); }
export const error = (message:string,status=400) => NextResponse.json({error:message},{status});
export function cleanText(value: unknown, max=5000) { return typeof value==='string' ? value.trim().slice(0,max) : ''; }
export function validEmail(email:string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length<=254; }
export function slugify(value:string) { return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,100); }
