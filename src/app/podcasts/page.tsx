import type { Metadata } from 'next';
import { Headphones } from 'lucide-react';
import { podcasts } from '@/lib/content';
import { Eyebrow } from '@/components/Editorial';
export const metadata:Metadata={title:'Podcasts'};
export default function PodcastsPage(){return <><div className="container page-hero"><Eyebrow>LES VOIX DE SENCOURRIER</Eyebrow><h1>À écouter<em>.</em></h1><p>Des conversations, des histoires et des idées qui méritent qu’on tende l’oreille.</p></div><div className="container page-content"><div className="list-top"><span>NOS ÉMISSIONS</span><span>{podcasts.length} RENDEZ-VOUS AUDIO</span></div><div className="podcast-grid">{podcasts.map((p,i)=><div className="podcast-card" key={p.title}><div className={`podcast-cover ${p.color}`}><Headphones size={64} strokeWidth={1}/></div><div className="podcast-details"><span className="category-label">{p.tag} / ÉMISSION {String(i+1).padStart(2,'0')}</span><h2>{p.title}</h2><p>{p.description}</p><span>FORMAT · {p.duration}</span></div></div>)}</div><div className="notice">Les émissions sont en préparation. Aucun épisode audio n’est encore disponible à l’écoute : nous annoncerons leur lancement ici.</div></div></>}
