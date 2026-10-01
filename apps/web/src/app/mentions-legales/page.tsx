import type { Metadata } from 'next';
import { LegalPage, LegalSection } from '@/components/legal/legal-page';

export const metadata: Metadata = {
  title: 'Mentions légales',
  description: "Mentions légales de SENCOURRIER : éditeur, directeur de publication, hébergeur et propriété intellectuelle.",
  alternates: { canonical: '/mentions-legales' },
};

export default function LegalNoticePage() {
  return (
    <LegalPage title="Mentions légales" updatedAt="30 septembre 2026">
      <LegalSection title="1. Éditeur du site">
        <p>
          Le site sencourrier.sn est édité par <strong>SENCOURRIER</strong>, média numérique
          indépendant établi à Dakar, République du Sénégal.
        </p>
        <p>
          Numéro d&apos;identification nationale des entreprises (NINEA) : en cours
          d&apos;attribution.
          <br />
          ISSN : 0000-0000 (en cours d&apos;attribution auprès du Centre de documentation
          scientifique et technique).
        </p>
      </LegalSection>

      <LegalSection title="2. Directeur de la publication">
        <p>
          Le directeur de la publication est <strong>Amadou Diarra</strong>, en sa qualité de
          directeur de publication de SENCOURRIER. Il est responsable du contenu éditorial
          publié sur le site, conformément à la loi sénégalaise sur la presse.
        </p>
      </LegalSection>

      <LegalSection title="3. Hébergement">
        <p>
          Le site est hébergé sur l&apos;infrastructure <strong>Microsoft Azure</strong>, dans des
          centres de données situés dans l&apos;Union européenne. La diffusion est accélérée par
          le réseau <strong>Cloudflare</strong>.
        </p>
        <p>
          Microsoft Azure — Microsoft Corporation, One Microsoft Way, Redmond, WA 98052, États-Unis.
        </p>
      </LegalSection>

      <LegalSection title="4. Propriété intellectuelle">
        <p>
          L&apos;ensemble des contenus publiés sur sencourrier.sn — articles, analyses,
          photographies, vidéos, podcasts, graphiques, logotypes et éléments de charte
          graphique — est protégé par le droit d&apos;auteur et demeure la propriété exclusive de
          SENCOURRIER ou de ses auteurs.
        </p>
        <p>
          Toute reproduction, représentation, adaptation ou exploitation, totale ou partielle,
          par quelque procédé que ce soit et sur quelque support que ce soit, est interdite sans
          autorisation écrite préalable, sous réserve des exceptions légales (courte citation
          avec mention de la source et lien hypertexte, revue de presse).
        </p>
        <p>
          La marque <strong>SENCOURRIER</strong> ainsi que le logotype et la signature
          « Le média numérique de référence du Sénégal » sont des marques de SENCOURRIER.
        </p>
      </LegalSection>

      <LegalSection title="5. Crédits photographiques">
        <p>
          Les photographies publiées sont produites par la rédaction, acquises auprès
          d&apos;agences ou utilisées sous licence. Le crédit apparaît systématiquement sous
          l&apos;image concernée. Toute demande de retrait peut être adressée à la rédaction.
        </p>
      </LegalSection>

      <LegalSection title="6. Liens hypertextes">
        <p>
          SENCOURRIER autorise la mise en place de liens hypertextes vers ses pages, à condition
          qu&apos;ils ne portent pas atteinte à l&apos;image du média et qu&apos;ils ne présentent
          pas les contenus comme ceux du site référent.
        </p>
        <p>
          Les liens sortants publiés dans nos articles ne sauraient engager la responsabilité de
          SENCOURRIER quant au contenu des sites tiers.
        </p>
      </LegalSection>

      <LegalSection title="7. Signalement de contenu">
        <p>
          Tout contenu susceptible de porter atteinte à un droit peut être signalé à
          l&apos;adresse{' '}
          <a href="mailto:redaction@sencourrier.sn" className="font-semibold text-sn-green hover:underline">
            redaction@sencourrier.sn
          </a>
          . SENCOURRIER s&apos;engage à examiner chaque signalement dans un délai de
          quarante-huit heures ouvrées.
        </p>
      </LegalSection>

      <LegalSection title="8. Droit applicable">
        <p>
          Les présentes mentions légales sont soumises au droit sénégalais. Tout litige relatif
          à l&apos;utilisation du site relève de la compétence des tribunaux de Dakar.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
