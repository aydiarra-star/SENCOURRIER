import type { Metadata } from 'next';
import { Header, Footer } from '@/components/SiteChrome';
import './globals.css';
const siteUrl=process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
export const metadata: Metadata={metadataBase:new URL(siteUrl),title:{default:'SENCOURRIER — Le Sénégal en perspective',template:'%s | SENCOURRIER'},description:'Actualité, analyses et récits du Sénégal. Une information libre, curieuse et proche de vous.',openGraph:{type:'website',locale:'fr_SN',siteName:'SENCOURRIER',images:['/images/dakar-coast.jpg']},twitter:{card:'summary_large_image'},robots:{index:true,follow:true}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="fr" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{__html:"try{document.documentElement.dataset.theme=localStorage.getItem('theme')||'light'}catch(e){}"}}/></head><body><Header/><main id="contenu">{children}</main><Footer/></body></html>}
