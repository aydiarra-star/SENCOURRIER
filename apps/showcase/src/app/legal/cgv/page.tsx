import { LegalPage, LegalSection } from '@/components/legal/legal-page';

export const metadata = { title: 'Conditions générales de vente' };

export default function Page() {
  return (
    <LegalPage title="Conditions générales de vente" updatedAt="30 septembre 2026">
      <LegalSection title="Offres">
        <p>
          L'offre gratuite donne accès à l'actualité générale. L'offre Premium donne accès aux
          contenus exclusifs, aux podcasts premium et supprime la publicité.
        </p>
      </LegalSection>
      <LegalSection title="Prix et paiement">
        <p>
          Les prix sont indiqués en francs CFA (XOF). Le paiement s'effectue par carte bancaire
          (Stripe), Wave, Orange Money ou Free Money.
        </p>
      </LegalSection>
      <LegalSection title="Durée et résiliation">
        <p>
          L'abonnement est mensuel ou annuel. La résiliation s'effectue à tout moment depuis
          l'espace personnel et prend effet à la fin de la période en cours.
        </p>
      </LegalSection>
      <LegalSection title="Droit de rétractation">
        <p>
          Conformément à la réglementation, le droit de rétractation ne s'applique pas aux contenus
          numériques dont l'exécution a commencé avec l'accord du consommateur.
        </p>
      </LegalSection>
      <LegalSection title="Facturation">
        <p>
          Une facture est émise pour chaque paiement et reste consultable depuis l'espace personnel.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
