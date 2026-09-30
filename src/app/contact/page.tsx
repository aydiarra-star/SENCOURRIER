import type { Metadata } from 'next';
import { Eyebrow } from '@/components/Editorial';
import { ContactForm } from '@/components/Forms';
export const metadata:Metadata={title:'Contact'};
export default function ContactPage(){return <><div className="container page-hero"><Eyebrow>PARLONS ENSEMBLE</Eyebrow><h1>Une question ?<br/><em>Écrivez-nous.</em></h1><p>Une idée d’histoire, une remarque ou simplement envie de nous dire bonjour ?</p></div><div className="container page-content contact-layout"><div className="contact-info"><h2>Nous sommes à votre écoute.</h2><p>Votre regard compte. Écrivez-nous pour proposer un sujet, partager une réaction ou entrer en contact avec la rédaction.</p><p>Les messages sont enregistrés dans notre espace rédaction. L’envoi d’un e-mail automatique n’est pas configuré.</p><a href="mailto:contact@sencourrier.com">contact@sencourrier.com ↗</a></div><ContactForm/></div></>}
