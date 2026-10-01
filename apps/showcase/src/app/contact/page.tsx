import { LegalPage, LegalSection } from '@/components/legal/legal-page';
import { BRAND } from '@sencourrier/config';

export const metadata = { title: 'Contact' };

export default function ContactPage() {
  return (
    <LegalPage title="Contact" updatedAt="30 septembre 2026">
      <LegalSection title="Rédaction">
        <p>
          Vous souhaitez proposer un sujet, signaler une erreur ou réagir à un article :{' '}
          <a
            href={`mailto:${BRAND.editorialEmail}`}
            className="text-sn-green font-semibold hover:underline"
          >
            {BRAND.editorialEmail}
          </a>
        </p>
      </LegalSection>

      <LegalSection title="Publicité et partenariats">
        <p>
          Espaces publicitaires, articles sponsorisés et partenariats :{' '}
          <a
            href={`mailto:${BRAND.contactEmail}`}
            className="text-sn-green font-semibold hover:underline"
          >
            {BRAND.contactEmail}
          </a>
        </p>
      </LegalSection>

      <LegalSection title="Abonnements">
        <p>
          Question sur votre abonnement Premium ou votre facturation :{' '}
          <a
            href={`mailto:${BRAND.supportEmail}`}
            className="text-sn-green font-semibold hover:underline"
          >
            {BRAND.supportEmail}
          </a>
        </p>
      </LegalSection>

      <LegalSection title="Adresse">
        <p>
          {BRAND.address.street}
          <br />
          {BRAND.address.postalCode} {BRAND.address.city}, {BRAND.address.country}
          <br />
          {BRAND.phone}
        </p>
      </LegalSection>

      <p className="rounded-lg border border-neutral-200 p-4 text-xs text-neutral-500 dark:border-neutral-800">
        Sur le portail complet, ce formulaire est relié à l&apos;API NestJS (
        <code>POST /api/v1/contact</code>) et les messages sont enregistrés puis notifiés à la
        rédaction.
      </p>
    </LegalPage>
  );
}
