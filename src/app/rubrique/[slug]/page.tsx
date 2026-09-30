import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getState } from '@/lib/store';
import { categories } from '@/lib/content';
import { ArticleCard } from '@/components/Editorial';
import Link from 'next/link';
export const dynamic='force-dynamic';
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params;const c=categories.find(c=>c.slug===slug);return {title:c?.name||'Rubrique',description:c?.description};}
export default async function CategoryPage({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const c=categories.find(c=>c.slug===slug);if(!c)notFound();const state=await getState();const articles=state.articles.filter(a=>a.category===slug&&a.status==='published').sort((a,b)=>b.publishedAt.localeCompare(a.publishedAt));return <><div className="category-hero"><div className="container"><div className="breadcrumb"><Link href="/">Accueil</Link><span>→</span> Rubriques <span>→</span> {c.name}</div><span className="hero-num">{c.icon}</span><h1>{c.name}<span style={{color:'var(--accent)'}}>.</span></h1><p>{c.description}</p></div></div><div className="container page-content"><div className="list-top"><span>TOUS LES ARTICLES / {c.name.toUpperCase()}</span><span>{articles.length} ARTICLE{articles.length>1?'S':''}</span></div>{articles.length?<div className="listing-grid">{articles.map(a=><ArticleCard article={a} key={a.id}/>)}</div>:<div className="empty-state"><h2>De nouvelles histoires arrivent bientôt.</h2></div>}</div></>}
