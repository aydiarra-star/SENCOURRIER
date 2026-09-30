import type { MetadataRoute } from 'next';
import { getState } from '@/lib/store';
import { categories } from '@/lib/content';
export const dynamic='force-dynamic';
export default async function sitemap():Promise<MetadataRoute.Sitemap>{const base=process.env.NEXT_PUBLIC_SITE_URL||'http://localhost:3000';const {articles}=await getState();return ['', '/recherche','/tv','/podcasts','/galerie','/newsletter','/a-propos','/contact',...categories.map(c=>`/rubrique/${c.slug}`)].map(url=>({url:base+url,changeFrequency:'weekly' as const})).concat(articles.filter(a=>a.status==='published').map(a=>({url:`${base}/article/${a.slug}`,lastModified:new Date(a.publishedAt),changeFrequency:'weekly' as const})));}
