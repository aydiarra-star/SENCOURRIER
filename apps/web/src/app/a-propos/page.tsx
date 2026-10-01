import type { Metadata } from 'next';
import Link from 'next/link';
import { JsonLd, breadcrumbSchema } from '@/components/seo/json-ld';
import { SITE } from '@sencourrier/config';

export const metadata: Metadata = {
  title: 'À propos',
  description:
    "SENCOURRIER, le média numérique de référence du Sénégal. Notre mission, notre rédaction, notre charte éditoriale et nos engagements déontologiques.",
  alternates: { canonical: '/a-propos' },
};

const ISSN = '0000-0000';

const REDACTION = [
  { name: 'Amadou Diarra', role: 'Directeur de publication' },
  { name: 'Fatou Ndiaye', role: 'Rédactrice en chef' },
  { name: 'Moussa Fall', role: 'Journaliste politique' },
  { name: 'Awa Sow', role: 'Journaliste économie' },
  { name: 'Ibrahima Ba', role: 'Chef de rubrique Sports' },
  { name: 'Mariama Diallo', role: 'Journaliste société' },
  { name: 'Nadia Sy', role: 'Journaliste technologies' },
  { name: 'Cheikh Gueye', role: 'Correspondant — Saint-Louis' },
  { name: 'Ousmane Touré', role: 'Correspondant — Diaspora' },
];

const ENGAGEMENTS = [
  {
    title: 'Vérification systématique',
    body: "Toute information est recoupée par au moins deux sources indépendantes avant publication. Les rumeurs et les contenus non vérifiés ne sont jamais publiés comme des faits.",
  },
  {
    title: 'Indépendance éditoriale',
    body: "Les annonceurs et les partenaires commerciaux n'ont aucun droit de regard sur le contenu rédactionnel. Les contenus sponsorisés sont identifiés comme tels, sans ambiguïté.",
  },
  {
    title: 'Droit de réponse',
    body: "Toute personne mise en cause dans un article dispose d'un droit de réponse, publié dans les mêmes conditions de visibilité que l'article initial.",
  },
  {
    title: 'Correction transparente',
    body: "Les erreurs sont corrigées publiquement, avec une note explicite précisant la nature et la date de la correction. Un article n'est jamais supprimé pour masquer une erreur.",
  },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: 'Accueil', url: '/' }, { name: 'À propos', url: '/a-propos' }])} />

      <div className="border-b border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/50">
        <div className="mx-auto max-w-screen-2xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">À propos de SENCOURRIER</h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
            {SITE.tagline}. Fondé à Dakar, SENCOURRIER est un média numérique indépendant qui
            couvre l&apos;actualité sénégalaise et africaine en continu, avec une exigence de
            vérification et de contextualisation.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <section aria-labelledby="mission-title">
          <h2 id="mission-title" className="font-display text-2xl font-extrabold tracking-tight">
            Notre mission
          </h2>
          <div className="mt-4 space-y-4 text-base leading-relaxed text-neutral-700 dark:text-neutral-300">
            <p>
              Le Sénégal dispose d&apos;une scène médiatique dense, mais l&apos;information de
              qualité reste difficile d&apos;accès pour une partie des citoyens. Notre ambition est
              de produire un journalisme rigoureux, lisible et accessible sur tous les supports,
              du téléphone d&apos;entrée de gamme à l&apos;ordinateur.
            </p>
            <p>
              Nous couvrons huit grands domaines : politique, société, économie, sports,
              technologies, international, diaspora et faits divers. À cela s&apos;ajoutent des
              productions propres : podcasts, vidéos et émissions de télévision numérique.
            </p>
            <p>
              Notre modèle repose sur un équilibre entre publicité raisonnée et abonnements
              payants. Ce choix nous permet de ne pas dépendre d&apos;un seul financeur et de
              préserver notre indépendance éditoriale.
            </p>
          </div>
        </section>

        <section className="mt-12" aria-labelledby="engagements-title">
          <h2 id="engagements-title" className="font-display text-2xl font-extrabold tracking-tight">
            Nos engagements déontologiques
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {ENGAGEMENTS.map((item) => (
              <article key={item.title} className="rounded-lg border border-neutral-200 p-5 dark:border-neutral-800">
                <h3 className="font-display text-base font-bold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-12" aria-labelledby="redaction-title">
          <h2 id="redaction-title" className="font-display text-2xl font-extrabold tracking-tight">
            La rédaction
          </h2>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            Une équipe basée à Dakar, appuyée par des correspondants dans les régions et à
            l&apos;étranger.
          </p>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {REDACTION.map((member) => (
              <li key={member.name} className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
                <p className="font-semibold">{member.name}</p>
                <p className="mt-0.5 text-xs text-neutral-500">{member.role}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12 rounded-xl border border-neutral-200 p-6 sm:p-8 dark:border-neutral-800" aria-labelledby="contact-title">
          <h2 id="contact-title" className="font-display text-xl font-extrabold tracking-tight">
            Nous contacter
          </h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="font-ui text-xs font-bold uppercase tracking-wider text-neutral-500">Rédaction</dt>
              <dd className="mt-1 text-sm">
                <a href="mailto:redaction@sencourrier.sn" className="text-sn-green hover:underline dark:text-sn-green-400">
                  redaction@sencourrier.sn
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-ui text-xs font-bold uppercase tracking-wider text-neutral-500">Abonnements</dt>
              <dd className="mt-1 text-sm">
                <a href="mailto:abonnements@sencourrier.sn" className="text-sn-green hover:underline dark:text-sn-green-400">
                  abonnements@sencourrier.sn
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-ui text-xs font-bold uppercase tracking-wider text-neutral-500">Publicité</dt>
              <dd className="mt-1 text-sm">
                <a href="mailto:publicite@sencourrier.sn" className="text-sn-green hover:underline dark:text-sn-green-400">
                  publicite@sencourrier.sn
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-ui text-xs font-bold uppercase tracking-wider text-neutral-500">ISSN</dt>
              <dd className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{ISSN}</dd>
            </div>
          </dl>
          <Link
            href="/contact"
            className="mt-6 inline-block rounded-md bg-sn-green px-6 py-3 text-sm font-semibold text-white hover:bg-sn-green-700"
          >
            Formulaire de contact
          </Link>
        </section>
      </div>
    </>
  );
}
