import { LegalPage, LegalSection } from '@/components/legal/legal-page';

export const metadata = { title: 'Mentions légales' };

export default function Page() {
  return (
    <LegalPage title="Mentions légales" updatedAt="30 septembre 2026">
      <LegalSection title="Éditeur du site">
        <p>
          SENCOURRIER Médias, société de presse en ligne établie à Dakar (Sénégal). Directeur de la
          publication : la direction éditoriale de SENCOURRIER.
        </p>
      </LegalSection>
      <LegalSection title="Siège social">
        <p>Immeuble SENCOURRIER, Avenue Léopold Sédar Senghor, Dakar 11500, Sénégal.</p>
      </LegalSection>
      <LegalSection title="Contact">
        <p>Rédaction : redaction@sencourrier.sn — Publicité : contact@sencourrier.sn.</p>
      </LegalSection>
      <LegalSection title="Propriété intellectuelle">
        <p>
          L'ensemble des contenus (textes, photographies, vidéos, sons, marques et logos) est
          protégé par le droit d'auteur. Toute reproduction sans autorisation écrite préalable est
          interdite.
        </p>
      </LegalSection>
      <LegalSection title="Hébergement">
        <p>La plateforme est hébergée sur Microsoft Azure et diffusée par le réseau Cloudflare.</p>
      </LegalSection>
    </LegalPage>
  );
}
