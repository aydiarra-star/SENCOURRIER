import { LegalPage, LegalSection } from '@/components/legal/legal-page';

export const metadata = { title: "Conditions générales d'utilisation" };

export default function Page() {
  return (
    <LegalPage title="Conditions générales d'utilisation" updatedAt="30 septembre 2026">
      <LegalSection title="Objet">
        <p>
          Les présentes conditions régissent l'accès et l'utilisation du site SENCOURRIER et de ses
          services.
        </p>
      </LegalSection>
      <LegalSection title="Compte utilisateur">
        <p>
          La création d'un compte suppose des informations exactes et la confidentialité des
          identifiants. L'utilisateur est responsable de l'usage fait de son compte.
        </p>
      </LegalSection>
      <LegalSection title="Contenus et commentaires">
        <p>
          Les commentaires sont modérés. Sont interdits les propos diffamatoires, haineux, ou
          contraires à la loi sénégalaise.
        </p>
      </LegalSection>
      <LegalSection title="Disponibilité">
        <p>
          Le service est fourni en l'état. SENCOURRIER s'efforce d'en assurer la continuité sans
          garantie d'absence d'interruption.
        </p>
      </LegalSection>
      <LegalSection title="Droit applicable">
        <p>Les présentes conditions sont soumises au droit sénégalais.</p>
      </LegalSection>
    </LegalPage>
  );
}
