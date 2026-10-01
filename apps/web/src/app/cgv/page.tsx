import type { Metadata } from 'next';
import { LegalPage, LegalSection } from '@/components/legal/legal-page';

export const metadata: Metadata = {
  title: 'Conditions générales de vente',
  description:
    "Conditions générales de vente des abonnements SENCOURRIER Premium : tarifs, paiement, résiliation et droit de rétractation.",
  alternates: { canonical: '/cgv' },
};

export default function SalesTermsPage() {
  return (
    <LegalPage title="Conditions générales de vente" updatedAt="30 septembre 2026">
      <LegalSection title="1. Champ d'application">
        <p>
          Les présentes conditions générales de vente (CGV) régissent la souscription et
          l&apos;exécution des abonnements Premium proposés par SENCOURRIER sur le site
          sencourrier.sn. Toute souscription implique l&apos;acceptation sans réserve des
          présentes CGV.
        </p>
      </LegalSection>

      <LegalSection title="2. Offres et tarifs">
        <p>Les offres d&apos;abonnement sont les suivantes :</p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            <strong>Gratuit</strong> — 0 FCFA : accès aux articles standards, newsletters et
            podcasts publics.
          </li>
          <li>
            <strong>Premium Mensuel</strong> — 2 500 FCFA par mois : accès intégral, sans
            publicité.
          </li>
          <li>
            <strong>Premium Annuel</strong> — 25 000 FCFA par an : mêmes avantages, deux mois
            offerts.
          </li>
          <li>
            <strong>Presse Pro</strong> — 75 000 FCFA par an : cinq comptes, licence de
            reproduction interne et accès API.
          </li>
        </ul>
        <p>
          Les prix sont exprimés en francs CFA (XOF), toutes taxes comprises. SENCOURRIER se
          réserve le droit de modifier ses tarifs ; toute évolution s&apos;applique à compter du
          prochain renouvellement et fait l&apos;objet d&apos;une information préalable de
          trente jours.
        </p>
      </LegalSection>

      <LegalSection title="3. Souscription">
        <p>
          La souscription s&apos;effectue depuis la page Abonnement. Le contrat est conclu dès
          confirmation du paiement par le prestataire concerné. Un email de confirmation
          récapitulant l&apos;offre, le montant et la date d&apos;échéance vous est adressé
          immédiatement.
        </p>
        <p>
          L&apos;abonné garantit être majeur ou disposer de l&apos;autorisation du titulaire de
          l&apos;autorité parentale, et être pleinement capable de contracter.
        </p>
      </LegalSection>

      <LegalSection title="4. Modalités de paiement">
        <p>Les moyens de paiement acceptés sont :</p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Wave</li>
          <li>Orange Money</li>
          <li>Free Money</li>
          <li>Carte bancaire Visa ou Mastercard, via Stripe</li>
        </ul>
        <p>
          Le paiement est exigible immédiatement à la souscription, puis à chaque échéance pour
          les abonnements reconduits. En cas d&apos;échec de paiement au renouvellement,
          l&apos;abonné dispose d&apos;un délai de sept jours pour régulariser, après quoi
          l&apos;accès Premium est suspendu jusqu&apos;à régularisation.
        </p>
      </LegalSection>

      <LegalSection title="5. Durée et reconduction">
        <p>
          L&apos;abonnement mensuel est conclu pour une durée d&apos;un mois et se reconduit
          tacitement. L&apos;abonnement annuel est conclu pour douze mois et se reconduit
          tacitement. La reconduction peut être désactivée à tout moment depuis
          l&apos;espace personnel.
        </p>
      </LegalSection>

      <LegalSection title="6. Droit de rétractation">
        <p>
          Conformément aux règles applicables au commerce électronique, l&apos;abonné dispose
          d&apos;un délai de quatorze jours à compter de la souscription pour se rétracter, sans
          justification.
        </p>
        <p>
          Toutefois, en accédant immédiatement aux contenus Premium, l&apos;abonné demande
          l&apos;exécution du contrat avant l&apos;expiration de ce délai et reconnaît renoncer
          à son droit de rétractation pour la période déjà consommée. Le remboursement est alors
          calculé au prorata des jours restants.
        </p>
      </LegalSection>

      <LegalSection title="7. Résiliation">
        <p>
          La résiliation s&apos;effectue en un clic depuis l&apos;espace personnel, sans
          justification ni frais. Elle prend effet à la fin de la période en cours, déjà payée :
          l&apos;abonné conserve l&apos;accès Premium jusqu&apos;à cette date et ne sera pas
          prélevé à nouveau.
        </p>
        <p>
          Aucun remboursement au prorata n&apos;est effectué en cas de résiliation en cours de
          période, sauf dans le cadre du droit de rétractation défini ci-dessus.
        </p>
      </LegalSection>

      <LegalSection title="8. Suspension et résiliation par SENCOURRIER">
        <p>
          SENCOURRIER peut suspendre ou résilier un abonnement en cas de manquement grave aux CGU
          — notamment le partage d&apos;identifiants, l&apos;extraction massive de contenus ou
          l&apos;usage commercial non autorisé. Dans ce cas, aucun remboursement n&apos;est dû.
        </p>
      </LegalSection>

      <LegalSection title="9. Facturation">
        <p>
          Une facture électronique est mise à disposition dans l&apos;espace personnel à chaque
          paiement. Pour les offres Presse Pro, une facture nominative peut être établie sur bon
          de commande, sur demande auprès du service abonnements.
        </p>
      </LegalSection>

      <LegalSection title="10. Service client et litiges">
        <p>
          Le service abonnements est joignable à{' '}
          <a href="mailto:abonnements@sencourrier.sn" className="font-semibold text-sn-green hover:underline">
            abonnements@sencourrier.sn
          </a>
          . Les réclamations sont traitées dans un délai maximum de quinze jours ouvrés.
        </p>
        <p>
          À défaut de solution amiable, le litige sera porté devant les tribunaux de Dakar, le
          droit sénégalais étant applicable.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
