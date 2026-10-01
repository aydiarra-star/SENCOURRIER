import { LegalPage, LegalSection } from '@/components/legal/legal-page';

export const metadata = { title: 'Politique de confidentialité' };

export default function Page() {
  return (
    <LegalPage title="Politique de confidentialité" updatedAt="30 septembre 2026">
      <LegalSection title="Données collectées">
        <p>
          Compte, préférences de lecture, historique de consultation et données techniques de
          navigation. Aucune donnée n'est vendue à des tiers.
        </p>
      </LegalSection>
      <LegalSection title="Finalités">
        <p>
          Fourniture du service, personnalisation éditoriale, mesure d'audience et gestion des
          abonnements.
        </p>
      </LegalSection>
      <LegalSection title="Base légale et durée">
        <p>
          Exécution du contrat et consentement. Les données de compte sont conservées le temps de la
          relation, puis supprimées.
        </p>
      </LegalSection>
      <LegalSection title="Vos droits">
        <p>
          Accès, rectification, effacement, portabilité et opposition. Ces droits s'exercent depuis
          votre espace personnel ou par courriel à contact@sencourrier.sn.
        </p>
      </LegalSection>
      <LegalSection title="Cookies">
        <p>
          Cookies strictement nécessaires au fonctionnement, et cookies de mesure d'audience soumis
          à consentement.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
