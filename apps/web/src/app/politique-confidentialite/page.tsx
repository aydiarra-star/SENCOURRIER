import type { Metadata } from 'next';
import { LegalPage, LegalSection } from '@/components/legal/legal-page';

export const metadata: Metadata = {
  title: 'Politique de confidentialité',
  description:
    'Comment SENCOURRIER collecte, utilise et protège vos données personnelles, conformément au RGPD et à la loi sénégalaise sur la protection des données.',
  alternates: { canonical: '/politique-confidentialite' },
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage title="Politique de confidentialité" updatedAt="30 septembre 2026">
      <LegalSection title="1. Responsable du traitement">
        <p>
          Le responsable du traitement des données personnelles collectées sur sencourrier.sn est
          SENCOURRIER, établi à Dakar (Sénégal). Pour toute question relative à vos données, écrivez
          à{' '}
          <a
            href="mailto:donnees@sencourrier.sn"
            className="text-sn-green font-semibold hover:underline"
          >
            donnees@sencourrier.sn
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="2. Données collectées">
        <p>Nous collectons uniquement les données nécessaires au fonctionnement du service :</p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            <strong>Compte utilisateur</strong> : nom, adresse email, mot de passe (stocké sous
            forme de condensat bcrypt, jamais en clair), avatar le cas échéant.
          </li>
          <li>
            <strong>Authentification Google</strong> : identifiant unique, nom, email et photo de
            profil transmis par Google si vous choisissez cette méthode de connexion.
          </li>
          <li>
            <strong>Abonnement</strong> : formule souscrite, historique de paiement et identifiant
            de transaction transmis par le prestataire de paiement. Aucune donnée bancaire complète
            n&apos;est stockée sur nos serveurs.
          </li>
          <li>
            <strong>Usage</strong> : pages consultées, articles lus, durée de lecture, rubriques
            suivies, favoris.
          </li>
          <li>
            <strong>Données techniques</strong> : adresse IP (tronquée et condensée pour les
            journaux d&apos;audit), type de navigateur, appareil, fuseau horaire.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="3. Finalités et bases légales">
        <p>Chaque traitement repose sur une base légale précise :</p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            <strong>Exécution du contrat</strong> : création de compte, fourniture de
            l&apos;abonnement Premium, gestion des paiements, service client.
          </li>
          <li>
            <strong>Intérêt légitime</strong> : sécurité du site, prévention de la fraude, mesure
            d&apos;audience agrégée, amélioration éditoriale.
          </li>
          <li>
            <strong>Consentement</strong> : newsletters, notifications push, publicité
            personnalisée, cookies non essentiels.
          </li>
          <li>
            <strong>Obligation légale</strong> : conservation des factures, réponse aux réquisitions
            judiciaires.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Cookies et traceurs">
        <p>Nous utilisons trois catégories de traceurs :</p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            <strong>Strictement nécessaires</strong> : session d&apos;authentification, jeton
            anti-CSRF, préférence de thème. Ils ne requièrent pas de consentement.
          </li>
          <li>
            <strong>Mesure d&apos;audience</strong> : Google Analytics 4, configuré en mode
            respectueux de la vie privée, avec anonymisation des adresses IP.
          </li>
          <li>
            <strong>Publicité</strong> : Google Ad Manager et régies partenaires, uniquement après
            consentement explicite.
          </li>
        </ul>
        <p>
          Vous pouvez modifier vos choix à tout moment depuis le lien « Gérer mes cookies » présent
          en pied de page.
        </p>
      </LegalSection>

      <LegalSection title="5. Partage des données">
        <p>
          Vos données ne sont jamais vendues. Elles peuvent être transmises à des sous-traitants
          strictement nécessaires au service, liés par un contrat de sous-traitance :
        </p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Microsoft Azure — hébergement et stockage des médias</li>
          <li>Cloudflare — diffusion, sécurité et protection contre les attaques</li>
          <li>Resend — envoi des emails transactionnels et des newsletters</li>
          <li>Stripe, Wave, Orange Money, Free Money — traitement des paiements</li>
          <li>Google — mesure d&apos;audience et régie publicitaire</li>
        </ul>
      </LegalSection>

      <LegalSection title="6. Durées de conservation">
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Compte actif : pendant toute la durée de la relation contractuelle.</li>
          <li>Compte inactif : suppression automatique après 36 mois sans connexion.</li>
          <li>Données de facturation : 10 ans, conformément aux obligations comptables.</li>
          <li>Journaux de sécurité : 12 mois maximum.</li>
          <li>Données de mesure d&apos;audience : 14 mois.</li>
        </ul>
      </LegalSection>

      <LegalSection title="7. Vos droits">
        <p>
          Conformément au RGPD et à la loi sénégalaise n° 2008-12 sur la protection des données
          personnelles, vous disposez des droits suivants :
        </p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Droit d&apos;accès à vos données</li>
          <li>Droit de rectification des données inexactes</li>
          <li>Droit à l&apos;effacement (droit à l&apos;oubli)</li>
          <li>Droit à la limitation du traitement</li>
          <li>Droit d&apos;opposition, notamment au profilage publicitaire</li>
          <li>Droit à la portabilité de vos données</li>
          <li>Droit de retirer votre consentement à tout moment</li>
        </ul>
        <p>
          Ces droits s&apos;exercent par email à{' '}
          <a
            href="mailto:donnees@sencourrier.sn"
            className="text-sn-green font-semibold hover:underline"
          >
            donnees@sencourrier.sn
          </a>
          . Nous répondons dans un délai maximum de 30 jours.
        </p>
      </LegalSection>

      <LegalSection title="8. Sécurité">
        <p>
          Les échanges sont chiffrés en transit (TLS 1.3) et les données sensibles chiffrées au
          repos. L&apos;accès aux systèmes est limité aux personnes habilitées, protégé par
          authentification à deux facteurs. Des sauvegardes chiffrées sont réalisées quotidiennement
          et testées régulièrement.
        </p>
      </LegalSection>

      <LegalSection title="9. Mineurs">
        <p>
          Le service n&apos;est pas destiné aux personnes de moins de 16 ans. Nous ne collectons pas
          sciemment de données concernant des mineurs de moins de 16 ans sans le consentement du
          titulaire de l&apos;autorité parentale.
        </p>
      </LegalSection>

      <LegalSection title="10. Réclamation">
        <p>
          Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire une
          réclamation auprès de la Commission de protection des données personnelles du Sénégal
          (CDP) ou, si vous résidez dans l&apos;Union européenne, auprès de l&apos;autorité de
          contrôle de votre pays de résidence.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
