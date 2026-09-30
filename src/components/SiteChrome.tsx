'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowRight, Menu, Moon, Search, Sun, X } from 'lucide-react';
import { categories } from '@/lib/content';
export function Header() {
 const [open,setOpen]=useState(false),[dark,setDark]=useState(false); const path=usePathname();
 useEffect(()=>{setDark(document.documentElement.dataset.theme==='dark');},[]);
 useEffect(()=>{setOpen(false)},[path]);
 function toggleTheme(){const next=!dark; setDark(next); document.documentElement.dataset.theme=next?'dark':'light'; localStorage.setItem('theme',next?'dark':'light');}
 return <>
  <div className="topline"><div className="container topline-inner"><span>LE REGARD QUI COMPTE.</span><span className="topline-right">DAKAR, SÉNÉGAL <i/> INDÉPENDANT. ENGAGÉ. SÉNÉGALAIS.</span></div></div>
  <header className="site-header"><div className="container masthead">
   <button className="icon-button mobile-menu" onClick={()=>setOpen(!open)} aria-label="Ouvrir le menu">{open?<X size={23}/>:<Menu size={23}/>}</button>
   <Link className="wordmark" href="/" aria-label="Sencourrier, accueil"><span className="wordmark-mark">S.</span><span>SEN<span>COURRIER</span><small>LE SÉNÉGAL EN PERSPECTIVE</small></span></Link>
   <div className="masthead-actions"><Link className="header-newsletter" href="/newsletter">La lettre du matin <ArrowRight size={14}/></Link><button className="icon-button" onClick={toggleTheme} aria-label="Changer de thème">{dark?<Sun size={19}/>:<Moon size={19}/>}</button><Link className="icon-button" href="/recherche" aria-label="Rechercher"><Search size={20}/></Link></div>
  </div></header>
  <nav className={`main-nav ${open?'nav-open':''}`} aria-label="Navigation principale"><div className="container nav-inner"><Link href="/" className={path==='/'?'active':''}>À LA UNE</Link>{categories.slice(0,6).map(c=><Link key={c.slug} href={`/rubrique/${c.slug}`} className={path===`/rubrique/${c.slug}`?'active':''}>{c.name.toUpperCase()}</Link>)}<Link href="/tv" className={path==='/tv'?'active':''}>TV DIRECT <span className="live-dot"/></Link><Link href="/podcasts" className={path==='/podcasts'?'active':''}>PODCASTS</Link><Link href="/galerie" className={path==='/galerie'?'active':''}>GALERIE</Link></div></nav>
 </>;
}
export function Footer(){return <footer className="site-footer"><div className="container"><div className="footer-top"><div className="footer-brand"><Link href="/" className="footer-logo">SEN<span>COURRIER</span><b>.</b></Link><p>Une autre façon de voir le Sénégal.<br/>Libre, curieux et proche de vous.</p></div><div className="footer-col"><strong>EXPLORER</strong>{categories.slice(0,4).map(c=><Link key={c.slug} href={`/rubrique/${c.slug}`}>{c.name}</Link>)}</div><div className="footer-col"><strong>DÉCOUVRIR</strong>{categories.slice(4).map(c=><Link key={c.slug} href={`/rubrique/${c.slug}`}>{c.name}</Link>)}</div><div className="footer-col"><strong>SENCOURRIER</strong><Link href="/a-propos">À propos</Link><Link href="/contact">Nous contacter</Link><Link href="/newsletter">Newsletter</Link><Link href="/admin">Espace rédaction</Link></div></div><div className="footer-bottom"><span>© {new Date().getUTCFullYear()} SENCOURRIER. TOUS DROITS RÉSERVÉS.</span><span>FAIT AVEC ATTENTION À DAKAR <span className="footer-sun">✳</span></span></div></div></footer>}
