import type { Metadata } from 'next';
import { LegalPage, LegalSection } from '@/components/legal/legal-page';

export const metadata: Metadata = {
  title: "Conditions générales d'utilisation",
  description:
    "Conditions générales d'utilisation du site sencourrier.sn : accès au service, obligations des utilisateurs et modération.",
  alternates: { canonical: '/cgu' },
};

export default function TermsPage() {
  return (
    <LegalPage title="Conditions générales d'utilisation" updatedAt="30 septembre 2026">
      <LegalSection title="1. Objet">
        <p>
          Les présentes conditions générales d&apos;utilisation (CGU) régissent l&apos;accès et
          l&apos;usage du site sencourrier.sn et de l&apos;ensemble de ses services : articles,
          podcasts, vidéos, commentaires, espace personnel et newsletters.
        </p>
        <p>
          La consultation du site vaut acceptation pleine et entière des présentes CGU. Si vous
          n&apos;acceptez pas ces conditions, vous devez cesser d&apos;utiliser le service.
        </p>
      </LegalSection>

      <LegalSection title="2. Accès au service">
        <p>
          Le site est accessible gratuitement à tout utilisateur disposant d&apos;un accès à
          Internet. Les frais d&apos;accès (matériel, connexion) restent à la charge de
          l&apos;utilisateur.
        </p>
        <p>
          Certains contenus et fonctionnalités — articles exclusifs, dossiers spéciaux, podcasts
          premium, suppression de la publicité — sont réservés aux abonnés Premium, dans les
          conditions définies par les conditions générales de vente.
        </p>
        <p>
          SENCOURRIER peut suspendre temporairement l&apos;accès au site pour maintenance ou mise à
          jour, sans que cela ouvre droit à indemnité.
        </p>
      </LegalSection>

      <LegalSection title="3. Compte utilisateur">
        <p>
          La création d&apos;un compte est gratuite. Vous vous engagez à fournir des informations
          exactes et à les tenir à jour. Un compte est strictement personnel : le partage
          d&apos;identifiants est interdit et peut entraîner la suspension du compte.
        </p>
        <p>
          Vous êtes responsable de la confidentialité de votre mot de passe. Toute activité
          effectuée depuis votre compte est réputée effectuée par vous, sauf preuve d&apos;une
          utilisation frauduleuse que vous devez signaler sans délai.
        </p>
      </LegalSection>

      <LegalSection title="4. Contenus et commentaires">
        <p>
          Les espaces de commentaires sont modérés a priori. En publiant un commentaire, vous
          garantissez détenir les droits nécessaires et vous accordez à SENCOURRIER une licence non
          exclusive d&apos;affichage sur le site et ses déclinaisons.
        </p>
        <p>Sont notamment interdits :</p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>les propos injurieux, diffamatoires, racistes, sexistes ou discriminatoires ;</li>
          <li>les incitations à la haine, à la violence ou à la commission d&apos;infractions ;</li>
          <li>la diffusion de données personnelles de tiers sans leur consentement ;</li>
          <li>la publicité non sollicitée, le spam et les liens d&apos;affiliation ;</li>
          <li>
            l&apos;usurpation d&apos;identité d&apos;un tiers ou d&apos;un membre de la rédaction ;
          </li>
          <li>la diffusion de contenus protégés par le droit d&apos;auteur sans autorisation.</li>
        </ul>
        <p>
          SENCOURRIER se réserve le droit de refuser, masquer ou supprimer tout contenu contrevenant
          à ces règles, sans préavis ni justification, et de suspendre le compte de son auteur en
          cas de récidive.
        </p>
      </LegalSection>

      <LegalSection title="5. Propriété intellectuelle">
        <p>
          Tous les contenus publiés sur sencourrier.sn sont protégés par le droit d&apos;auteur.
          Toute reproduction ou représentation, totale ou partielle, sans autorisation écrite est
          interdite, à l&apos;exception de la courte citation avec mention de la source et lien vers
          l&apos;article original.
        </p>
        <p>
          L&apos;usage de robots, extracteurs automatiques ou tout autre procédé destiné à collecter
          massivement les contenus est prohibé, sauf accord préalable et notamment dans le cadre
          d&apos;un accès à notre API de contenus.
        </p>
      </LegalSection>

      <LegalSection title="6. Responsabilité">
        <p>
          SENCOURRIER s&apos;efforce d&apos;assurer l&apos;exactitude des informations publiées,
          sans pouvoir garantir l&apos;absence totale d&apos;erreur. Les contenus sont fournis « en
          l&apos;état » et ne constituent pas un conseil professionnel (juridique, financier,
          médical).
        </p>
        <p>
          SENCOURRIER ne saurait être tenu responsable des dommages indirects résultant de
          l&apos;utilisation ou de l&apos;impossibilité d&apos;utiliser le service, ni du contenu
          des sites tiers vers lesquels des liens sont proposés.
        </p>
      </LegalSection>

      <LegalSection title="7. Modification des CGU">
        <p>
          SENCOURRIER peut modifier les présentes CGU à tout moment. Les utilisateurs sont informés
          par une notification sur le site et, pour les titulaires de compte, par email, au moins
          quinze jours avant l&apos;entrée en vigueur. La poursuite de l&apos;utilisation du service
          vaut acceptation des nouvelles conditions.
        </p>
      </LegalSection>

      <LegalSection title="8. Droit applicable et juridiction">
        <p>
          Les présentes CGU sont régies par le droit sénégalais. En cas de litige, les parties
          rechercheront une solution amiable avant toute action judiciaire. À défaut, les tribunaux
          de Dakar seront compétents.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
