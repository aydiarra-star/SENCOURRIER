/**
 * Jeu de données de démonstration SENCOURRIER.
 *
 * Idempotent : le script peut être relancé sans dupliquer les données.
 *   npm run db:seed
 *
 * Les images utilisent picsum.photos (déjà autorisé dans next.config.js) afin
 * que l'aperçu soit visuellement réaliste sans dépendre d'un CDN privé.
 */
import { PrismaClient, Role, ArticleStatus, ArticleFormat, SubscriptionTier } from '../generated/client';
import { CATEGORIES } from '@sencourrier/types';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const img = (seed: string, w = 1600, h = 900) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

/** Calcule le temps de lecture à partir du corps de l'article (200 mots/min). */
function readingMinutes(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

function toHtml(paragraphs: string[]): string {
  return paragraphs.map((p) => `<p>${p}</p>`).join('\n');
}

function daysAgo(n: number, hoursOffset = 0): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(d.getHours() - hoursOffset);
  return d;
}

// ─────────────────────────────────────────────────────────────────────────────
// RÉDACTION
// ─────────────────────────────────────────────────────────────────────────────

const STAFF = [
  {
    email: 'admin@sencourrier.sn',
    displayName: 'Amadou Diarra',
    role: Role.SUPER_ADMIN,
    jobTitle: 'Directeur de publication',
    bio: "Fondateur de SENCOURRIER. Vingt ans de journalisme économique, ancien correspondant pour plusieurs rédactions internationales à Dakar.",
    expertise: ['Économie', 'Politique publique'],
  },
  {
    email: 'redaction@sencourrier.sn',
    displayName: 'Fatou Ndiaye',
    role: Role.EDITOR_IN_CHIEF,
    jobTitle: 'Rédactrice en chef',
    bio: "Rédactrice en chef de SENCOURRIER. Spécialiste des questions politiques et institutionnelles sénégalaises.",
    expertise: ['Politique', 'Institutions'],
  },
  {
    email: 'moussa.fall@sencourrier.sn',
    displayName: 'Moussa Fall',
    role: Role.JOURNALIST,
    jobTitle: 'Journaliste politique',
    bio: "Couvre la présidence, le gouvernement et l'Assemblée nationale depuis dix ans.",
    expertise: ['Politique', 'Élections'],
  },
  {
    email: 'awa.sow@sencourrier.sn',
    displayName: 'Awa Sow',
    role: Role.JOURNALIST,
    jobTitle: 'Journaliste économie',
    bio: "Suit les filières agricoles, la pêche et l'énergie. Passée par la BRVM et le secteur bancaire.",
    expertise: ['Économie', 'Énergie', 'Agriculture'],
  },
  {
    email: 'ibrahima.ba@sencourrier.sn',
    displayName: 'Ibrahima Ba',
    role: Role.JOURNALIST,
    jobTitle: 'Chef de rubrique Sports',
    bio: "Couvre les Lions de la Teranga, la lutte sénégalaise et le sport continental.",
    expertise: ['Football', 'Lutte'],
  },
  {
    email: 'mariama.diallo@sencourrier.sn',
    displayName: 'Mariama Diallo',
    role: Role.JOURNALIST,
    jobTitle: 'Journaliste société',
    bio: "Santé, éducation et questions de société. Enquêtes de terrain à travers les régions.",
    expertise: ['Santé', 'Éducation'],
  },
  {
    email: 'cheikh.gueye@sencourrier.sn',
    displayName: 'Cheikh Gueye',
    role: Role.CORRESPONDENT,
    jobTitle: 'Correspondant — Saint-Louis',
    bio: "Correspondant dans le Nord. Couvre la pêche, le littoral et les collectivités locales.",
    expertise: ['Pêche', 'Régions'],
  },
  {
    email: 'nadia.sy@sencourrier.sn',
    displayName: 'Nadia Sy',
    role: Role.JOURNALIST,
    jobTitle: 'Journaliste technologies',
    bio: "Écosystème tech, intelligence artificielle et cybersécurité en Afrique de l'Ouest.",
    expertise: ['IA', 'Startups'],
  },
  {
    email: 'ousmane.toure@sencourrier.sn',
    displayName: 'Ousmane Touré',
    role: Role.CORRESPONDENT,
    jobTitle: 'Correspondant — Diaspora (Paris)',
    bio: "Suit les communautés sénégalaises d'Europe et les transferts de fonds vers le Sénégal.",
    expertise: ['Diaspora', 'Migrations'],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// ARTICLES DE DÉMONSTRATION
// ─────────────────────────────────────────────────────────────────────────────

interface SeedArticle {
  categorySlug: string;
  authorEmail: string;
  title: string;
  subtitle: string;
  excerpt: string;
  body: string[];
  tags: string[];
  isBreaking?: boolean;
  isFeatured?: boolean;
  isPremium?: boolean;
  format?: ArticleFormat;
  daysAgo: number;
  hoursOffset?: number;
  views: number;
}

const ARTICLES: SeedArticle[] = [
  // ── POLITIQUE ──
  {
    categorySlug: 'politique',
    authorEmail: 'moussa.fall@sencourrier.sn',
    title: "Conseil des ministres : le gouvernement adopte un plan d'urgence pour l'emploi des jeunes",
    subtitle: "Un dispositif de 45 milliards FCFA ciblant 120 000 primo-demandeurs d'emploi sur trois ans",
    excerpt:
      "Réuni au Palais de la République, le Conseil des ministres a adopté mercredi un programme national d'insertion professionnelle des jeunes, assorti d'un fonds de garantie destiné aux très petites entreprises.",
    body: [
      "Le Conseil des ministres a adopté mercredi un plan d'urgence pour l'emploi des jeunes, doté de 45 milliards de francs CFA sur trois exercices budgétaires. Le dispositif vise 120 000 primo-demandeurs d'emploi, avec un objectif affiché de 40 % de femmes parmi les bénéficiaires.",
      "Le texte prévoit trois volets : un fonds de garantie bancaire pour les très petites entreprises, un programme de formation aux métiers numériques porté par les centres de formation professionnelle régionaux, et un dispositif d'apprentissage en entreprise cofinancé par le secteur privé.",
      "« L'enjeu n'est pas seulement le volume d'emplois créés, c'est la qualité de l'insertion », a déclaré le porte-parole du gouvernement devant la presse, précisant que le taux de rétention à dix-huit mois serait l'indicateur principal d'évaluation.",
      "Les organisations patronales ont salué l'initiative tout en s'interrogeant sur le calendrier de décaissement. « La garantie ne suffira pas si les délais bancaires restent ce qu'ils sont », avertit un responsable d'une association sectorielle, qui demande un guichet unique dématérialisé.",
      "Le programme sera piloté par un comité national présidé par le Premier ministre, avec des déclinaisons régionales. Un premier rapport d'exécution est attendu dans six mois devant l'Assemblée nationale.",
    ],
    tags: ['emploi', 'jeunesse', 'gouvernement', 'politique publique'],
    isFeatured: true,
    daysAgo: 0,
    hoursOffset: 3,
    views: 18_420,
  },
  {
    categorySlug: 'politique',
    authorEmail: 'fatou.ndiaye@sencourrier.sn',
    title: "Assemblée nationale : le projet de loi sur le financement des collectivités locales en débat",
    subtitle: "Les députés examinent une réforme attendue depuis la révision du Code général des collectivités",
    excerpt:
      "La commission des finances a entamé l'examen du projet de loi portant réforme du financement des collectivités territoriales, qui doit relever la part des recettes transférées aux communes.",
    body: [
      "La commission des finances de l'Assemblée nationale a ouvert lundi l'examen du projet de loi portant réforme du financement des collectivités territoriales. Le texte prévoit de porter de 25 % à 32 % la part des recettes fiscales transférées aux communes.",
      "L'objectif affiché est de réduire la dépendance des collectivités aux subventions d'équilibre et de leur donner de la visibilité pluriannuelle sur leurs ressources. Le texte introduit à cette fin une programmation budgétaire sur trois ans.",
      "Plusieurs députés ont toutefois demandé des garanties sur la compensation intégrale des transferts de compétences, rappelant que les collectivités assument depuis des années des charges non financées.",
      "Les associations de maires réclament de leur côté un mécanisme de péréquation plus lisible, afin que les communes rurales ne restent pas à l'écart de la dynamique des recettes.",
      "Le vote en séance plénière est attendu à la fin du mois. Le texte devra ensuite être examiné par le Sénat.",
    ],
    tags: ['assemblée nationale', 'collectivités', 'finances publiques'],
    daysAgo: 1,
    views: 9_310,
  },
  {
    categorySlug: 'politique',
    authorEmail: 'moussa.fall@sencourrier.sn',
    title: "Élections : la CENA présente son calendrier pour les prochaines élections locales",
    subtitle: "Le fichier électoral sera révisé à partir du mois prochain dans les 557 communes",
    excerpt:
      "La Commission électorale nationale autonome a détaillé le calendrier de révision du fichier électoral et les modalités d'inscription pour les élections locales à venir.",
    body: [
      "La Commission électorale nationale autonome a présenté le calendrier de révision du fichier électoral, qui débutera le mois prochain dans les 557 communes du pays. Les inscriptions seront possibles dans les centres principaux et secondaires.",
      "La commission annonce un renforcement du dispositif biométrique et la mise en place de commissions départementales chargées de traiter les réclamations sous quinze jours.",
      "Les partis politiques ont été invités à désigner des représentants à chaque niveau. « La transparence du fichier conditionne la crédibilité du scrutin », a souligné un membre de la commission.",
      "Les opérations de révision se dérouleront sur six semaines, avec une prolongation possible dans les zones à faible densité administrative.",
    ],
    tags: ['élections', 'CENA', 'démocratie'],
    daysAgo: 2,
    views: 7_840,
  },

  // ── SOCIÉTÉ ──
  {
    categorySlug: 'societe',
    authorEmail: 'mariama.diallo@sencourrier.sn',
    title: "Santé : le nouvel hôpital de Diamniadio entre en service partiel",
    subtitle: "Six services ouvrent progressivement, avec une capacité cible de 300 lits",
    excerpt:
      "Le nouvel établissement hospitalier de Diamniadio a accueilli ses premiers patients. Six services sur douze sont opérationnels, le reste devant ouvrir d'ici la fin de l'année.",
    body: [
      "Le nouvel hôpital de Diamniadio a accueilli ses premiers patients cette semaine. Six services sur les douze prévus sont opérationnels : urgences, médecine générale, pédiatrie, gynécologie-obstétrique, imagerie et laboratoire.",
      "L'établissement vise une capacité de 300 lits et l'accueil de 1 500 consultations par jour à pleine charge. Le plateau technique comprend un scanner, une IRM et deux salles d'intervention.",
      "« Nous montons en puissance par paliers pour garantir la qualité de prise en charge plutôt que d'ouvrir tout au même moment », explique la direction, qui évoque des difficultés de recrutement sur certains postes spécialisés.",
      "Les syndicats de santé demandent des garanties sur les effectifs infirmiers, estimant que la montée en charge ne pourra se faire sans un plan de recrutement pluriannuel.",
      "L'établissement doit à terme désengorger les structures de Dakar, qui concentrent aujourd'hui l'essentiel des hospitalisations de référence.",
    ],
    tags: ['santé', 'hôpital', 'Diamniadio'],
    isFeatured: true,
    daysAgo: 0,
    hoursOffset: 6,
    views: 12_670,
  },
  {
    categorySlug: 'societe',
    authorEmail: 'mariama.diallo@sencourrier.sn',
    title: "Éducation : la rentrée universitaire marquée par la hausse des effectifs en sciences",
    subtitle: "Les filières scientifiques enregistrent une progression de 18 % des inscriptions",
    excerpt:
      "Les universités publiques enregistrent une hausse notable des inscriptions en filières scientifiques, portée par les nouvelles bourses d'excellence et l'ouverture de licences professionnelles.",
    body: [
      "La rentrée universitaire s'ouvre sur une progression de 18 % des inscriptions en filières scientifiques, une première depuis plusieurs années. Les licences en mathématiques appliquées, informatique et sciences de l'ingénieur sont les plus demandées.",
      "Cette dynamique s'explique en partie par le dispositif de bourses d'excellence mis en place l'an dernier et par l'ouverture de nouvelles licences professionnelles adossées à des entreprises.",
      "Les universités de proximité bénéficient également de la tendance : leurs effectifs progressent de 11 %, ce qui réduit la pression sur les campus de Dakar.",
      "Les syndicats étudiants pointent néanmoins la question des capacités d'accueil, notamment pour les travaux pratiques, et réclament la réhabilitation des laboratoires.",
      "Le ministère annonce un plan d'investissement dans les équipements pédagogiques sur deux ans.",
    ],
    tags: ['éducation', 'université', 'formation'],
    daysAgo: 1,
    hoursOffset: 5,
    views: 6_450,
  },
  {
    categorySlug: 'societe',
    authorEmail: 'cheikh.gueye@sencourrier.sn',
    title: "Environnement : l'érosion côtière s'accélère à Saint-Louis, 400 familles à relocaliser",
    subtitle: "Le trait de côte recule de plus de deux mètres par an dans certains quartiers",
    excerpt:
      "La commune de Saint-Louis fait face à une accélération de l'érosion côtière. Un plan de relocalisation concerne 400 familles installées sur la langue de Barbarie.",
    body: [
      "L'érosion côtière s'accélère à Saint-Louis, où le trait de côte recule de plus de deux mètres par an dans certains secteurs de la langue de Barbarie. Un plan de relocalisation concerne 400 familles.",
      "Les autorités municipales ont identifié trois sites d'accueil à l'intérieur des terres, avec un financement mixte incluant des bailleurs internationaux. La première phase devrait démarrer avant la saison des pluies.",
      "« Ce n'est pas seulement un problème de logement, c'est un problème de moyens d'existence », souligne un représentant des pêcheurs, dont les sites de débarquement sont directement menacés.",
      "Les scientifiques appellent à un suivi régulier du trait de côte et à la restauration des cordons dunaires, seule protection naturelle encore efficace contre la houle.",
      "Le littoral sénégalais, long de 700 kilomètres, concentre près des deux tiers de la population et l'essentiel des activités économiques du pays.",
    ],
    tags: ['environnement', 'littoral', 'Saint-Louis', 'climat'],
    isBreaking: true,
    daysAgo: 0,
    hoursOffset: 1,
    views: 21_890,
  },

  // ── ÉCONOMIE ──
  {
    categorySlug: 'economie',
    authorEmail: 'awa.sow@sencourrier.sn',
    title: "Énergie : le champ gazier Grand Tortue Ahmeyim livre ses premiers volumes",
    subtitle: "Une étape décisive pour la souveraineté énergétique du Sénégal",
    excerpt:
      "Le projet gazier offshore partagé avec la Mauritanie a livré ses premiers volumes commerciaux. Les recettes attendues transforment l'équation budgétaire du pays.",
    body: [
      "Le champ gazier Grand Tortue Ahmeyim a livré ses premiers volumes commerciaux, une étape décisive pour la souveraineté énergétique du Sénégal. Le gisement est exploité conjointement avec la Mauritanie.",
      "Les recettes attendues modifient l'équation budgétaire du pays, avec un cadre de gestion intergénérationnelle destiné à lisser l'impact des fluctuations des prix sur les finances publiques.",
      "Le gaz sera principalement exporté sous forme liquéfiée, avec une part réservée au marché domestique pour l'électricité et l'industrie. Le projet prévoit aussi un volet de contenu local.",
      "« Le vrai défi commence maintenant : former les compétences nationales et industrialiser autour du gaz plutôt que de se contenter de l'exporter brut », estime un économiste de l'Université Cheikh Anta Diop.",
      "Le gouvernement évoque la création d'un fonds souverain et la révision du code pétrolier pour mieux encadrer les futurs contrats.",
    ],
    tags: ['énergie', 'gaz', 'pétrole', 'économie'],
    isFeatured: true,
    daysAgo: 1,
    hoursOffset: 8,
    views: 16_230,
  },
  {
    categorySlug: 'economie',
    authorEmail: 'awa.sow@sencourrier.sn',
    title: "Startups : une fintech dakaroise lève 12 millions de dollars en série A",
    subtitle: "Le tour de table doit financer l'expansion vers quatre pays de la sous-région",
    excerpt:
      "La jeune pousse dakaroise spécialisée dans les paiements marchands a bouclé une levée de 12 millions de dollars, l'une des plus importantes du secteur au Sénégal.",
    body: [
      "Une fintech dakaroise spécialisée dans les paiements marchands a bouclé une levée de 12 millions de dollars en série A, l'une des plus importantes du secteur au Sénégal.",
      "Le tour de table, mené par un fonds panafricain avec la participation d'investisseurs de la diaspora, doit financer l'expansion vers quatre pays de la sous-région et le renforcement de l'équipe technique.",
      "La société revendique 40 000 commerçants actifs et un volume de transactions en progression de 180 % sur un an. Elle vise le seuil de rentabilité opérationnelle d'ici dix-huit mois.",
      "« Le paiement marchand est un marché de volume et de confiance. Notre avantage, c'est l'intégration native avec les solutions de mobile money locales », explique la fondatrice.",
      "L'écosystème sénégalais confirme son dynamisme : plusieurs levées significatives ont été annoncées ces derniers mois dans la logistique, la santé et l'agritech.",
    ],
    tags: ['startups', 'fintech', 'investissement', 'innovation'],
    daysAgo: 2,
    hoursOffset: 4,
    views: 11_050,
  },
  {
    categorySlug: 'economie',
    authorEmail: 'cheikh.gueye@sencourrier.sn',
    title: "Pêche : la campagne de débarquement en baisse de 9 % sur le port de Dakar",
    subtitle: "Les professionnels pointent la raréfaction de la ressource et la hausse du coût du carburant",
    excerpt:
      "Les débarquements enregistrés au port de Dakar reculent de 9 % sur la campagne écoulée, sous l'effet conjugué de la raréfaction de la ressource et de la hausse des coûts d'exploitation.",
    body: [
      "Les débarquements enregistrés au port de Dakar reculent de 9 % sur la campagne écoulée. Les professionnels invoquent la raréfaction de la ressource et la hausse du coût du carburant.",
      "Les pêcheurs artisanaux sont les plus touchés : leurs sorties en mer sont plus longues et moins productives, alors que le prix du carburant a augmenté de près d'un quart en deux ans.",
      "Les organisations professionnelles réclament une subvention ciblée sur le carburant et un renforcement des aires marines protégées pour reconstituer les stocks.",
      "Les autorités annoncent la réactivation des patrouilles conjointes contre la pêche illicite, estimant que la pression étrangère reste l'un des principaux facteurs de surexploitation.",
      "Le secteur fait vivre directement et indirectement près de 600 000 personnes au Sénégal.",
    ],
    tags: ['pêche', 'économie', 'littoral'],
    daysAgo: 3,
    views: 5_780,
  },
  {
    categorySlug: 'economie',
    authorEmail: 'awa.sow@sencourrier.sn',
    title: "Agriculture : une récolte d'arachide excédentaire, mais des prix sous tension",
    subtitle: "La production dépasse les prévisions, l'organisation de la filière reste le point faible",
    excerpt:
      "La campagne arachidière affiche un excédent de production. Les producteurs s'inquiètent toutefois du niveau des prix d'achat au producteur et des capacités de stockage.",
    body: [
      "La campagne arachidière affiche un excédent de production par rapport aux prévisions initiales, porté par une pluviométrie favorable dans le bassin arachidier.",
      "Les producteurs s'inquiètent néanmoins du niveau des prix d'achat au producteur et des capacités de stockage, qui restent le maillon faible de la filière.",
      "Les huiliers se disent contraints par la concurrence des importations d'huile brute et demandent un cadre tarifaire stabilisé sur la campagne.",
      "Les coopératives plaident pour un renforcement des capacités de transformation locale, afin de capter davantage de valeur ajoutée sur le territoire.",
    ],
    tags: ['agriculture', 'arachide', 'filière'],
    daysAgo: 4,
    views: 4_320,
  },

  // ── SPORTS ──
  {
    categorySlug: 'sports',
    authorEmail: 'ibrahima.ba@sencourrier.sn',
    title: "Lions de la Teranga : le Sénégal s'impose 2-0 et valide sa qualification",
    subtitle: "Une victoire maîtrisée au stade Abdoulaye Wade devant 45 000 spectateurs",
    excerpt:
      "Portés par une première période de haute intensité, les Lions ont dominé leur adversaire et composté leur billet pour la phase finale. La défense n'a pas encaissé depuis cinq matchs.",
    body: [
      "Le Sénégal s'est imposé 2-0 au stade Abdoulaye Wade devant 45 000 spectateurs, validant sa qualification pour la phase finale de la compétition continentale.",
      "Les Lions ont ouvert le score à la 23e minute sur un mouvement collectif conclu à l'entrée de la surface, avant de doubler la mise juste avant la pause sur coup de pied arrêté.",
      "La seconde période a été plus gestionnaire, l'équipe préservant sa solidité défensive. Le gardien n'a eu qu'une intervention réellement décisive à effectuer.",
      "« On a respecté le plan de jeu et on a su être patients », a commenté le sélectionneur en conférence de presse, saluant la performance de son milieu de terrain.",
      "Le Sénégal reste invaincu depuis huit rencontres et n'a plus encaissé de but depuis cinq matchs, une série qui place l'équipe parmi les favoris.",
    ],
    tags: ['football', 'Lions de la Teranga', 'sélection'],
    isFeatured: true,
    isBreaking: true,
    daysAgo: 0,
    hoursOffset: 2,
    views: 34_120,
  },
  {
    categorySlug: 'sports',
    authorEmail: 'ibrahima.ba@sencourrier.sn',
    title: "Lutte : le grand combat de l'arène annoncé pour la fin du mois",
    subtitle: "Deux écuries rivales s'affrontent dans une affiche très attendue à Pikine",
    excerpt:
      "Le combat entre les deux champions les plus suivis de la saison de lutte sénégalaise se tiendra à Pikine. Les écuries ont officialisé l'affiche devant la presse.",
    body: [
      "Le combat opposant les deux champions les plus suivis de la saison se tiendra à la fin du mois à Pikine. Les écuries ont officialisé l'affiche devant la presse.",
      "Les deux lutteurs affichent des bilans comparables : invaincus sur leurs trois dernières sorties, ils représentent deux écoles techniques opposées — l'un privilégiant la prise au corps, l'autre les enchaînements rapides.",
      "L'organisation prévoit une capacité d'accueil de 20 000 places et un dispositif de sécurité renforcé, avec une retransmission télévisée en direct.",
      "La lutte reste l'un des spectacles les plus populaires du pays, avec une économie propre : paris, sponsors, merchandising et tournées régionales.",
      "Les promoteurs évoquent une bourse record pour l'affiche, signe de la vitalité commerciale de la discipline.",
    ],
    tags: ['lutte', 'arène', 'Pikine'],
    daysAgo: 1,
    hoursOffset: 3,
    views: 19_760,
  },
  {
    categorySlug: 'sports',
    authorEmail: 'ibrahima.ba@sencourrier.sn',
    title: "Basketball : le Sénégal décroche sa qualification pour le tournoi continental",
    subtitle: "Les Lions du basket renversent un match mal engagé dans le dernier quart-temps",
    excerpt:
      "Menés de douze points à l'entame du dernier quart-temps, les basketteurs sénégalais ont renversé la rencontre pour arracher leur qualification.",
    body: [
      "Menés de douze points à l'entame du dernier quart-temps, les basketteurs sénégalais ont renversé la rencontre pour arracher leur qualification au tournoi continental.",
      "Le tournant du match tient à un changement de défense et à l'entrée en jeu d'un ailier de 21 ans, auteur de trois tirs primés consécutifs.",
      "« On a joué avec nos moyens, sans paniquer. Cette équipe a du caractère », a déclaré le sélectionneur après la rencontre.",
      "La fédération annonce un stage de préparation de six semaines avant la phase finale, avec plusieurs rencontres amicales à l'étranger.",
    ],
    tags: ['basketball', 'sélection', 'compétitions africaines'],
    daysAgo: 3,
    views: 8_940,
  },

  // ── TECHNOLOGIES ──
  {
    categorySlug: 'technologies',
    authorEmail: 'nadia.sy@sencourrier.sn',
    title: "Intelligence artificielle : le Sénégal lance un centre national de recherche appliquée",
    subtitle: "Le centre sera adossé aux universités et aux entreprises du secteur numérique",
    excerpt:
      "Le pays se dote d'un centre national dédié à l'intelligence artificielle appliquée, avec pour priorité la santé, l'agriculture et l'administration publique.",
    body: [
      "Le Sénégal se dote d'un centre national de recherche en intelligence artificielle appliquée, adossé aux universités et aux entreprises du secteur numérique. La structure doit ouvrir ses portes au prochain semestre.",
      "Trois domaines sont prioritaires : l'aide au diagnostic médical, l'optimisation des rendements agricoles et la dématérialisation des services administratifs.",
      "Le financement repose sur un partenariat public-privé et sur des conventions de recherche avec des institutions étrangères. Le centre prévoit de recruter cinquante chercheurs à terme.",
      "« L'enjeu n'est pas de courir après les modèles les plus lourds, mais de constituer des données de qualité adaptées à nos réalités », insiste la directrice scientifique pressentie.",
      "Le texte encadrant le partage des données de santé fait l'objet d'une consultation avec les ordres professionnels et les associations de patients.",
    ],
    tags: ['IA', 'recherche', 'innovation', 'numérique'],
    isFeatured: true,
    daysAgo: 1,
    hoursOffset: 2,
    views: 13_410,
  },
  {
    categorySlug: 'technologies',
    authorEmail: 'nadia.sy@sencourrier.sn',
    title: "Cybersécurité : une campagne de sensibilisation face à la hausse des fraudes en ligne",
    subtitle: "Les signalements ont doublé en un an, principalement sur le mobile money",
    excerpt:
      "Face au doublement des signalements de fraude en ligne, les autorités lancent une campagne nationale de sensibilisation ciblant les usagers du mobile money.",
    body: [
      "Face au doublement des signalements de fraude en ligne en un an, les autorités lancent une campagne nationale de sensibilisation ciblant en priorité les usagers du mobile money.",
      "Les techniques recensées sont variées : hameçonnage par SMS, faux appels du service client, usurpation d'identité d'un proche et faux liens de retrait d'argent.",
      "Les opérateurs télécoms et les banques se sont associés à la campagne, qui repose sur des messages courts diffusés à la radio, sur les réseaux sociaux et dans les agences.",
      "Les experts recommandent l'authentification à deux facteurs sur toutes les transactions et rappellent qu'aucun agent n'a besoin d'un code confidentiel.",
      "Un guichet unique de signalement doit être généralisé, avec un délai de traitement cible de quarante-huit heures.",
    ],
    tags: ['cybersécurité', 'fraude', 'mobile money'],
    daysAgo: 2,
    hoursOffset: 6,
    views: 9_870,
  },
  {
    categorySlug: 'technologies',
    authorEmail: 'nadia.sy@sencourrier.sn',
    title: "Télécoms : le déploiement de la fibre optique accélère dans les régions",
    subtitle: "Objectif de couverture de 90 % des communes d'ici trois ans",
    excerpt:
      "Le programme national de déploiement de la fibre optique franchit une nouvelle étape avec la connexion de plusieurs chefs-lieux de région à haut débit.",
    body: [
      "Le programme national de déploiement de la fibre optique franchit une nouvelle étape avec la connexion de plusieurs chefs-lieux de région. L'objectif affiché est de couvrir 90 % des communes d'ici trois ans.",
      "Le chantier repose sur un réseau dorsal national et sur des boucles métropolitaines. Les zones rurales les plus éloignées seront traitées par satellite en complément.",
      "Les opérateurs soulignent que la demande de bande passante croît de 40 % par an, portée par le télétravail, le streaming et les services publics dématérialisés.",
      "Les collectivités demandent une meilleure articulation avec les projets d'aménagement, pour éviter d'ouvrir les voiries plusieurs fois.",
    ],
    tags: ['télécoms', 'fibre optique', 'numérique'],
    daysAgo: 5,
    views: 5_120,
  },

  // ── FAITS DIVERS ──
  {
    categorySlug: 'faits-divers',
    authorEmail: 'mariama.diallo@sencourrier.sn',
    title: "Justice : ouverture du procès très attendu dans l'affaire de détournement de fonds publics",
    subtitle: "Douze prévenus comparaissent devant la Cour de répression de l'enrichissement illicite",
    excerpt:
      "Le procès de douze prévenus poursuivis pour détournement de fonds publics s'est ouvert devant la Cour de répression de l'enrichissement illicite, dans une affaire suivie de près par l'opinion.",
    body: [
      "Le procès de douze prévenus poursuivis pour détournement de fonds publics s'est ouvert devant la Cour de répression de l'enrichissement illicite. L'affaire porte sur un marché public de plusieurs milliards de francs CFA.",
      "L'accusation soutient que des surfacturations ont été organisées au moyen de sociétés écrans. La défense conteste la méthode d'évaluation du préjudice et demande une expertise indépendante.",
      "Les débats devraient durer plusieurs semaines, avec l'audition de dizaines de témoins et l'examen de pièces comptables volumineuses.",
      "L'affaire est suivie de près par l'opinion, dans un contexte de vigilance accrue sur la transparence des marchés publics et la traçabilité des dépenses.",
      "Le verdict sera susceptible d'appel devant la Cour suprême.",
    ],
    tags: ['justice', 'enquêtes', 'transparence'],
    daysAgo: 1,
    hoursOffset: 7,
    views: 14_230,
  },
  {
    categorySlug: 'faits-divers',
    authorEmail: 'mariama.diallo@sencourrier.sn',
    title: "Sécurité routière : le bilan des accidents en baisse de 14 % après les contrôles renforcés",
    subtitle: "Les autorités annoncent la généralisation des radars sur les axes principaux",
    excerpt:
      "Le nombre d'accidents corporels recule de 14 % sur le semestre, à la suite du renforcement des contrôles et de la sensibilisation des transporteurs.",
    body: [
      "Le nombre d'accidents corporels recule de 14 % sur le semestre, à la suite du renforcement des contrôles routiers et de la sensibilisation des transporteurs.",
      "Les causes principales identifiées restent la vitesse excessive, la fatigue des conducteurs de transport en commun et le mauvais état de certains véhicules.",
      "Les autorités annoncent la généralisation des radars automatiques sur les axes principaux et la mise en place de centres de contrôle technique mobiles.",
      "Les syndicats de transporteurs demandent en contrepartie une amélioration de l'état des routes et un encadrement des amendes perçues sur le terrain.",
    ],
    tags: ['sécurité', 'accidents', 'transports'],
    daysAgo: 2,
    hoursOffset: 9,
    views: 7_650,
  },

  // ── INTERNATIONAL ──
  {
    categorySlug: 'international',
    authorEmail: 'fatou.ndiaye@sencourrier.sn',
    title: "CEDEAO : le sommet des chefs d'État se penche sur la libre circulation des personnes",
    subtitle: "Les discussions portent aussi sur la sécurité régionale et le commerce intracommunautaire",
    excerpt:
      "Réunis en sommet, les dirigeants de la CEDEAO ont abordé la libre circulation des personnes et des biens, ainsi que la coopération en matière de sécurité régionale.",
    body: [
      "Les dirigeants de la CEDEAO se sont réunis en sommet pour examiner la mise en œuvre effective du protocole sur la libre circulation des personnes et des biens.",
      "Plusieurs États ont été appelés à harmoniser leurs procédures aux frontières, alors que des obstacles informels persistent sur certains corridors commerciaux.",
      "Le sommet a également abordé la coopération en matière de sécurité régionale et le renforcement des capacités de la force en attente.",
      "« L'intégration régionale ne progressera que si les citoyens en ressentent les bénéfices concrets », a déclaré un chef d'État en séance plénière.",
      "Les conclusions doivent donner lieu à une feuille de route assortie d'indicateurs de suivi présentés au prochain sommet.",
    ],
    tags: ['CEDEAO', 'Afrique', 'intégration régionale'],
    daysAgo: 2,
    hoursOffset: 3,
    views: 8_230,
  },
  {
    categorySlug: 'international',
    authorEmail: 'fatou.ndiaye@sencourrier.sn',
    title: "Afrique : la zone de libre-échange continentale franchit le cap des 40 pays opérationnels",
    subtitle: "Les échanges intra-africains restent toutefois en deçà du potentiel estimé",
    excerpt:
      "La zone de libre-échange continentale africaine compte désormais plus de quarante pays appliquant effectivement les règles de préférence tarifaire.",
    body: [
      "La zone de libre-échange continentale africaine compte désormais plus de quarante pays appliquant effectivement les règles de préférence tarifaire, une étape présentée comme décisive.",
      "Les échanges intra-africains restent toutefois en deçà du potentiel estimé, faute d'infrastructures de transport, de corridors douaniers efficaces et d'information des opérateurs.",
      "Les experts recommandent de concentrer les efforts sur quelques chaînes de valeur prioritaires : agroalimentaire, pharmacie, logistique et énergie.",
      "Le secteur privé demande une accélération de la numérisation des procédures douanières, principal frein opérationnel identifié par les entreprises exportatrices.",
    ],
    tags: ['Afrique', 'ZLECAf', 'commerce'],
    daysAgo: 6,
    views: 6_100,
  },

  // ── DIASPORA ──
  {
    categorySlug: 'diaspora',
    authorEmail: 'ousmane.toure@sencourrier.sn',
    title: "Diaspora : les transferts de fonds vers le Sénégal atteignent un niveau record",
    subtitle: "Plus de 3 000 milliards FCFA transférés en un an, malgré la hausse des frais",
    excerpt:
      "Les transferts de la diaspora sénégalaise ont atteint un niveau record, dépassant les 3 000 milliards de francs CFA sur douze mois, selon les données de la banque centrale.",
    body: [
      "Les transferts de la diaspora sénégalaise ont atteint un niveau record, dépassant les 3 000 milliards de francs CFA sur douze mois, selon les données de la banque centrale.",
      "Ces flux représentent plus de 10 % du produit intérieur brut et constituent une ressource plus stable que certains investissements directs étrangers.",
      "Les associations de la diaspora dénoncent toutefois le niveau des frais de transfert, qui restent parmi les plus élevés au monde sur certains corridors.",
      "Les opérateurs de transfert numérique gagnent du terrain, avec des coûts sensiblement inférieurs, mais leur adoption reste inégale selon les pays de résidence.",
      "Les économistes plaident pour une meilleure canalisation de ces flux vers l'investissement productif plutôt que vers la consommation immédiate.",
    ],
    tags: ['diaspora', 'transferts', 'économie'],
    isFeatured: true,
    daysAgo: 1,
    hoursOffset: 4,
    views: 10_450,
  },
  {
    categorySlug: 'diaspora',
    authorEmail: 'ousmane.toure@sencourrier.sn',
    title: "France : la communauté sénégalaise se mobilise pour la scolarisation des enfants",
    subtitle: "Un réseau associatif finance des bourses et de l'accompagnement scolaire",
    excerpt:
      "Un collectif d'associations sénégalaises de France lance un programme de bourses et d'accompagnement scolaire destiné aux enfants de familles récemment arrivées.",
    body: [
      "Un collectif d'associations sénégalaises de France lance un programme de bourses et d'accompagnement scolaire destiné aux enfants de familles récemment arrivées.",
      "Le dispositif prévoit un soutien financier, du tutorat assuré par des étudiants bénévoles et une aide administrative pour les familles qui maîtrisent mal le système éducatif français.",
      "Les initiateurs insistent sur la dimension préventive : le décrochage scolaire est identifié comme la principale vulnérabilité des jeunes de la deuxième génération.",
      "Le programme sera expérimenté dans trois villes avant une extension nationale, en partenariat avec des collectivités locales.",
    ],
    tags: ['diaspora', 'France', 'éducation'],
    daysAgo: 4,
    hoursOffset: 2,
    views: 4_890,
  },
  {
    categorySlug: 'diaspora',
    authorEmail: 'ousmane.toure@sencourrier.sn',
    title: "Italie : la régularisation des travailleurs sénégalais au cœur des discussions",
    subtitle: "Les associations demandent un guichet unique pour les demandes en cours",
    excerpt:
      "Les associations de la diaspora sénégalaise en Italie demandent la mise en place d'un guichet unique pour accélérer le traitement des dossiers de régularisation en attente.",
    body: [
      "Les associations de la diaspora sénégalaise en Italie demandent la mise en place d'un guichet unique pour accélérer le traitement des dossiers de régularisation en attente.",
      "Elles estiment que la complexité administrative décourage une partie des travailleurs éligibles, qui renoncent à déposer leur demande dans les délais impartis.",
      "Les secteurs concernés sont principalement l'agriculture, la restauration et l'aide à la personne, où la main-d'œuvre étrangère est structurellement importante.",
      "Les représentants associatifs plaident également pour une meilleure information en langue locale, y compris pour les travailleurs peu alphabétisés.",
    ],
    tags: ['diaspora', 'Italie', 'migrations'],
    daysAgo: 7,
    views: 3_760,
  },

  // ── ARTICLE PREMIUM (dossier spécial) ──
  {
    categorySlug: 'economie',
    authorEmail: 'awa.sow@sencourrier.sn',
    title: "Dossier spécial — Pétrole et gaz : les dix années qui vont transformer le Sénégal",
    subtitle: "Enquête sur les contrats, le contenu local et les risques de la malédiction des ressources",
    excerpt:
      "Comment éviter la malédiction des ressources ? Enquête sur les contrats pétroliers et gaziers, le contenu local, la fiscalité et les choix budgétaires qui détermineront la trajectoire du pays.",
    body: [
      "L'entrée en production des champs pétroliers et gaziers ouvre pour le Sénégal une décennie décisive. Les recettes attendues peuvent financer la transformation structurelle de l'économie — ou reproduire les schémas de dépendance observés ailleurs.",
      "Ce dossier examine les contrats signés, la répartition des revenus entre l'État et les opérateurs, et les marges de manœuvre réelles dont dispose le pays pour renégocier les termes des futurs accords.",
      "Le volet consacré au contenu local montre un écart important entre les ambitions affichées et la réalité des emplois qualifiés occupés par des nationaux. Seule une minorité des postes techniques est aujourd'hui pourvue localement.",
      "Sur le plan budgétaire, les économistes interrogés recommandent une règle de dépense prudente, fondée sur un prix de référence conservateur, et l'alimentation d'un fonds intergénérationnel.",
      "Le dossier se conclut sur les scénarios à dix ans : industrialisation par le gaz, simple rente budgétaire, ou trajectoire intermédiaire. Le choix dépendra moins des ressources que des institutions chargées de les gérer.",
    ],
    tags: ['pétrole', 'gaz', 'enquête', 'économie', 'souveraineté'],
    isPremium: true,
    isFeatured: true,
    format: ArticleFormat.ANALYSIS,
    daysAgo: 2,
    hoursOffset: 1,
    views: 22_340,
  },
  {
    categorySlug: 'politique',
    authorEmail: 'fatou.ndiaye@sencourrier.sn',
    title: "Analyse — Décentralisation : vingt ans après, quel bilan pour les collectivités ?",
    subtitle: "Compétences transférées, ressources insuffisantes : l'écart persistant",
    excerpt:
      "Deux décennies après les lois de décentralisation, le bilan reste contrasté. Analyse des compétences transférées et des ressources réellement mobilisées par les collectivités.",
    body: [
      "Vingt ans après les grandes lois de décentralisation, le bilan reste contrasté. Les collectivités ont vu leurs compétences s'élargir sans que les moyens suivent au même rythme.",
      "Les communes urbaines ont su mobiliser davantage de recettes propres, portées par la fiscalité locale et les droits de stationnement. Les communes rurales restent très dépendantes des transferts de l'État.",
      "Le renforcement des capacités techniques constitue l'autre chantier inachevé : beaucoup de collectivités peinent à monter des projets bancables et à absorber les financements obtenus.",
      "Les pistes d'amélioration convergent : contractualisation pluriannuelle entre l'État et les collectivités, simplification des procédures de passation des marchés et mutualisation des services techniques.",
    ],
    tags: ['décentralisation', 'collectivités', 'analyse'],
    isPremium: true,
    format: ArticleFormat.ANALYSIS,
    daysAgo: 3,
    hoursOffset: 5,
    views: 8_120,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// PODCASTS, VIDÉOS, MÉDIAS
// ─────────────────────────────────────────────────────────────────────────────

const PODCAST_SHOWS = [
  {
    slug: 'le-debrief',
    name: 'Le Débrief',
    tagline: "L'actualité sénégalaise décryptée chaque soir",
    description:
      "Chaque soir, la rédaction revient sur les trois informations qui comptent et reçoit un invité pour les mettre en perspective. Format court, ton direct, sans langue de bois.",
    hostName: 'Fatou Ndiaye',
    category: 'Actualité',
    episodes: [
      { title: "Emploi des jeunes : le plan du gouvernement peut-il fonctionner ?", daysAgo: 0, duration: 1_680 },
      { title: 'Érosion côtière à Saint-Louis : que faire des 400 familles ?', daysAgo: 1, duration: 1_920 },
      { title: "Gaz de Grand Tortue : qui profitera vraiment des recettes ?", daysAgo: 2, duration: 2_040 },
      { title: 'Décentralisation : vingt ans de promesses non tenues', daysAgo: 4, duration: 2_280 },
    ],
  },
  {
    slug: 'grand-format',
    name: 'Grand Format',
    tagline: 'Le magazine des grandes enquêtes',
    description:
      "Un rendez-vous long format consacré aux enquêtes de la rédaction : plusieurs mois d'investigation, des documents et des témoignages, pour comprendre les sujets de fond.",
    hostName: 'Amadou Diarra',
    category: 'Enquêtes',
    episodes: [
      { title: 'Enquête : les coulisses du marché public de plusieurs milliards', daysAgo: 3, duration: 3_120 },
      { title: 'Pêche : comment la ressource s\'épuise sur la Petite Côte', daysAgo: 8, duration: 2_760 },
      { title: 'Foncier à Dakar : la spéculation invisible', daysAgo: 15, duration: 3_360 },
    ],
  },
  {
    slug: 'teranga-tech',
    name: 'Teranga Tech',
    tagline: "L'écosystème numérique africain",
    description:
      "Le rendez-vous des entrepreneurs, ingénieurs et chercheurs qui construisent la tech africaine. Levées de fonds, innovations, politiques publiques et récits d'entrepreneurs.",
    hostName: 'Nadia Sy',
    category: 'Technologies',
    episodes: [
      { title: 'IA appliquée : le Sénégal peut-il créer ses propres modèles ?', daysAgo: 1, duration: 1_980 },
      { title: 'Fintech : les secrets d\'une levée de 12 millions de dollars', daysAgo: 5, duration: 2_400 },
      { title: 'Cybersécurité : pourquoi les fraudes au mobile money explosent', daysAgo: 9, duration: 1_740 },
    ],
  },
  {
    slug: 'les-lions',
    name: 'Les Lions',
    tagline: 'Le podcast qui vit au rythme du sport sénégalais',
    description:
      "Football, lutte, basketball : chaque semaine, décryptage des performances des équipes nationales et du sport local, avec des invités du monde sportif.",
    hostName: 'Ibrahima Ba',
    category: 'Sports',
    episodes: [
      { title: 'Qualification validée : les clés de la victoire des Lions', daysAgo: 0, duration: 1_560 },
      { title: "Lutte : l'affiche du siècle se prépare à Pikine", daysAgo: 2, duration: 1_800 },
    ],
  },
];

const VIDEOS = [
  { slug: 'direct-jt-soir', title: 'Le journal du soir — édition complète', description: "L'intégralité de l'édition du soir : politique, économie, société et sport.", daysAgo: 0, duration: 1_500, isLive: false },
  { slug: 'reportage-saint-louis', title: 'Reportage — Saint-Louis face à la montée des eaux', description: 'Immersion dans les quartiers menacés par l’érosion côtière, avec les habitants et les scientifiques.', daysAgo: 1, duration: 780, isLive: false },
  { slug: 'itw-ministre-emploi', title: "Entretien — le ministre de l'Emploi détaille le plan jeunes", description: 'Vingt minutes d’entretien sur le financement, le calendrier et les critères d’évaluation du dispositif.', daysAgo: 1, duration: 1_260, isLive: false },
  { slug: 'debat-economie', title: 'Débat — Pétrole et gaz : quelles retombées pour les Sénégalais ?', description: 'Trois économistes confrontent leurs analyses sur la gestion des recettes extractives.', daysAgo: 2, duration: 2_700, isLive: false },
  { slug: 'grand-combat-lutte', title: "Lutte — les coulisses de l'arène de Pikine", description: 'Préparation, écuries et ambiance : reportage au plus près du grand combat.', daysAgo: 3, duration: 900, isLive: false },
  { slug: 'teranga-tech-ia', title: 'Teranga Tech — le centre national IA en questions', description: 'Table ronde avec les chercheurs impliqués dans le futur centre national d’intelligence artificielle.', daysAgo: 4, duration: 1_620, isLive: false },
];

const PLANS = [
  {
    tier: SubscriptionTier.FREE,
    name: 'Gratuit',
    description: "L'essentiel de l'actualité sénégalaise, en accès libre et sans limite de consultation.",
    priceAmount: 0,
    interval: 'month',
    features: [
      'Accès à tous les articles standards',
      'Newsletter quotidienne',
      'TV en direct et podcasts publics',
      'Application web progressive (PWA)',
      'Commentaires modérés',
    ],
    isPopular: false,
    position: 0,
  },
  {
    tier: SubscriptionTier.PREMIUM,
    name: 'Premium Mensuel',
    description: 'Tout SENCOURRIER, sans publicité, avec les dossiers exclusifs de la rédaction.',
    priceAmount: 2_500,
    interval: 'month',
    features: [
      'Tous les articles exclusifs et analyses',
      'Suppression totale des publicités',
      'Dossiers spéciaux et enquêtes longues',
      'Podcasts premium et versions intégrales',
      'Newsletter réservée aux abonnés',
      'Accès anticipé aux publications',
      'Archives complètes depuis 2024',
    ],
    isPopular: true,
    position: 1,
  },
  {
    tier: SubscriptionTier.PREMIUM_ANNUAL,
    name: 'Premium Annuel',
    description: "Deux mois offerts par rapport à l'abonnement mensuel, pour les lecteurs fidèles.",
    priceAmount: 25_000,
    interval: 'year',
    features: [
      "Toutes les avantages de l'offre Premium",
      'Économie de 5 000 FCFA par an',
      'Accès aux rencontres avec la rédaction',
      'Version numérique du magazine annuel',
      'Badge abonné sur les commentaires',
    ],
    isPopular: false,
    position: 2,
  },
  {
    tier: SubscriptionTier.PRESS_PRO,
    name: 'Presse Pro',
    description: 'Offre destinée aux entreprises, institutions, ONG et professionnels de l’information.',
    priceAmount: 75_000,
    interval: 'year',
    features: [
      'Tous les avantages Premium',
      'Cinq comptes nominatifs',
      'Licence de reproduction interne',
      'Veille sectorielle personnalisée',
      'Accès à l’API de contenus',
      'Facturation sur bon de commande',
    ],
    isPopular: false,
    position: 3,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// EXÉCUTION
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  console.log('▶ Initialisation du jeu de données SENCOURRIER…');

  // ── Catégories et sous-catégories ──
  let categoryPosition = 0;
  for (const def of CATEGORIES) {
    const parent = await prisma.category.upsert({
      where: { slug: def.slug },
      update: {
        name: def.name,
        shortName: def.shortName,
        description: def.description,
        accent: def.accent,
        priority: def.priority,
        position: categoryPosition,
      },
      create: {
        slug: def.slug,
        name: def.name,
        shortName: def.shortName,
        description: def.description,
        accent: def.accent,
        priority: def.priority,
        position: categoryPosition,
        isActive: true,
        isInMenu: true,
      },
    });

    let subPosition = 0;
    for (const sub of def.subcategories) {
      await prisma.category.upsert({
        where: { slug: sub.slug },
        update: { name: sub.name, description: sub.description, parentId: parent.id, position: subPosition },
        create: {
          slug: sub.slug,
          name: sub.name,
          description: sub.description,
          parentId: parent.id,
          position: subPosition,
          accent: def.accent,
          isActive: true,
          isInMenu: false,
        },
      });
      subPosition += 1;
    }
    categoryPosition += 1;
  }
  console.log(`  ✓ ${CATEGORIES.length} catégories et leurs sous-catégories`);

  // ── Rédactions (utilisateurs + profils auteurs) ──
  const passwordHash = await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD ?? 'SenCourrier!2024', 12);
  const authorsByEmail = new Map<string, { userId: string; profileId: string }>();

  for (const member of STAFF) {
    const user = await prisma.user.upsert({
      where: { email: member.email },
      update: { displayName: member.displayName, role: member.role, emailVerified: new Date() },
      create: {
        email: member.email,
        displayName: member.displayName,
        name: member.displayName,
        role: member.role,
        passwordHash,
        emailVerified: new Date(),
        isActive: true,
        bio: member.bio,
        preferences: { create: { darkMode: false } },
      },
    });

    const slug = member.displayName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const profile = await prisma.authorProfile.upsert({
      where: { userId: user.id },
      update: {
        displayName: member.displayName,
        jobTitle: member.jobTitle,
        bio: member.bio,
        expertise: member.expertise,
        isFeatured: true,
      },
      create: {
        userId: user.id,
        slug,
        displayName: member.displayName,
        jobTitle: member.jobTitle,
        bio: member.bio,
        expertise: member.expertise,
        avatarUrl: img(`avatar-${slug}`, 400, 400),
        isFeatured: true,
      },
    });

    authorsByEmail.set(member.email, { userId: user.id, profileId: profile.id });
  }
  console.log(`  ✓ ${STAFF.length} membres de la rédaction`);

  // ── Lecteur de démonstration ──
  const reader = await prisma.user.upsert({
    where: { email: 'lecteur@sencourrier.sn' },
    update: {},
    create: {
      email: 'lecteur@sencourrier.sn',
      displayName: 'Abdoulaye Mbaye',
      name: 'Abdoulaye Mbaye',
      role: Role.PREMIUM_SUBSCRIBER,
      passwordHash,
      emailVerified: new Date(),
      preferences: {
        create: { preferredCategories: ['politique', 'economie', 'sports'], breakingNewsAlerts: true },
      },
    },
  });
  console.log('  ✓ 1 lecteur de démonstration (compte Premium)');

  // ── Articles ──
  const createdArticles: Array<{ id: string; slug: string; categorySlug: string }> = [];

  for (const a of ARTICLES) {
    const category = await prisma.category.findUnique({ where: { slug: a.categorySlug } });
    if (!category) continue;

    const author = authorsByEmail.get(a.authorEmail);
    if (!author) continue;

    const publishedAt = daysAgo(a.daysAgo, a.hoursOffset ?? 0);
    const slugBase = a.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 70);
    const slug = `${slugBase}-${a.daysAgo}${a.hoursOffset ?? 0}`;

    const bodyHtml = toHtml(a.body);
    const bodyText = a.body.join('\n\n');
    const minutes = readingMinutes(bodyText);
    const wordCount = bodyText.trim().split(/\s+/).length;

    const heroMedia = await prisma.media.create({
      data: {
        type: 'IMAGE',
        provider: 'EXTERNAL',
        url: img(`art-${slug}`, 1600, 900),
        thumbnailUrl: img(`art-${slug}`, 640, 360),
        width: 1600,
        height: 900,
        altText: a.title,
        caption: a.subtitle,
        credit: 'SENCOURRIER',
        mimeType: 'image/jpeg',
      },
    });

    const article = await prisma.article.upsert({
      where: { slug },
      update: {},
      create: {
        slug,
        title: a.title,
        subtitle: a.subtitle,
        excerpt: a.excerpt,
        bodyHtml,
        bodyText,
        format: a.format ?? ArticleFormat.STANDARD,
        status: ArticleStatus.PUBLISHED,
        isPremium: a.isPremium ?? false,
        isBreaking: a.isBreaking ?? false,
        isFeatured: a.isFeatured ?? false,
        readingMinutes: minutes,
        wordCount,
        viewCount: a.views,
        commentCount: 0,
        publishedAt,
        categoryId: category.id,
        heroImageId: heroMedia.id,
        authors: {
          create: [{ userId: author.userId, position: 0, role: 'Auteur' }],
        },
        tags: {
          create: await Promise.all(
            a.tags.map(async (tagName) => {
              const tagSlug = tagName
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '');
              const tag = await prisma.tag.upsert({
                where: { slug: tagSlug },
                update: { usageCount: { increment: 1 } },
                create: { slug: tagSlug, name: tagName },
              });
              return { tagId: tag.id };
            }),
          ),
        },
      },
    });

    createdArticles.push({ id: article.id, slug: article.slug, categorySlug: a.categorySlug });
  }
  console.log(`  ✓ ${createdArticles.length} articles publiés`);

  // ── Commentaires ──
  const commentable = createdArticles.slice(0, 6);
  let commentCount = 0;
  for (const art of commentable) {
    const texts = [
      "Merci pour cet article très complet. On sent le travail de terrain derrière.",
      'Article intéressant, mais j’aurais aimé plus de chiffres sur le financement.',
      'Enfin une analyse posée sur ce sujet. Bravo à la rédaction.',
    ];
    for (const body of texts) {
      await prisma.comment.create({
        data: {
          articleId: art.id,
          body,
          status: 'APPROVED',
          authorName: 'Lecteur SENCOURRIER',
          authorId: reader.id,
          createdAt: daysAgo(0, 2),
        },
      });
      commentCount += 1;
    }
    await prisma.article.update({
      where: { id: art.id },
      data: { commentCount: texts.length },
    });
  }
  console.log(`  ✓ ${commentCount} commentaires approuvés`);

  // ── Podcasts ──
  let episodeCount = 0;
  for (const show of PODCAST_SHOWS) {
    const coverMedia = await prisma.media.create({
      data: {
        type: 'IMAGE',
        provider: 'EXTERNAL',
        url: img(`pod-${show.slug}`, 800, 800),
        thumbnailUrl: img(`pod-${show.slug}`, 400, 400),
        width: 800,
        height: 800,
        altText: show.name,
        mimeType: 'image/jpeg',
      },
    });

    const created = await prisma.podcastShow.upsert({
      where: { slug: show.slug },
      update: { episodeCount: show.episodes.length },
      create: {
        slug: show.slug,
        name: show.name,
        tagline: show.tagline,
        description: show.description,
        hostName: show.hostName,
        category: show.category,
        coverId: coverMedia.id,
        episodeCount: show.episodes.length,
        rssUrl: `https://www.sencourrier.sn/podcasts/${show.slug}/rss.xml`,
      },
    });

    for (const [i, ep] of show.episodes.entries()) {
      const epSlug = `${show.slug}-${ep.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 60)}-${i}`;

      await prisma.podcastEpisode.upsert({
        where: { slug: epSlug },
        update: {},
        create: {
          slug: epSlug,
          showId: created.id,
          title: ep.title,
          description: `${ep.title} — ${show.tagline}. Un épisode de ${Math.round(ep.duration / 60)} minutes présenté par ${show.hostName}.`,
          seasonNumber: 1,
          episodeNumber: i + 1,
          audioUrl: `https://cdn.sencourrier.sn/audio/${epSlug}.mp3`,
          durationSeconds: ep.duration,
          publishedAt: daysAgo(ep.daysAgo),
          coverId: coverMedia.id,
        },
      });
      episodeCount += 1;
    }
  }
  console.log(`  ✓ ${PODCAST_SHOWS.length} émissions et ${episodeCount} épisodes de podcast`);

  // ── Vidéos ──
  for (const v of VIDEOS) {
    const thumb = await prisma.media.create({
      data: {
        type: 'IMAGE',
        provider: 'EXTERNAL',
        url: img(`vid-${v.slug}`, 1280, 720),
        thumbnailUrl: img(`vid-${v.slug}`, 640, 360),
        width: 1280,
        height: 720,
        altText: v.title,
        mimeType: 'image/jpeg',
      },
    });

    await prisma.video.upsert({
      where: { slug: v.slug },
      update: {},
      create: {
        slug: v.slug,
        title: v.title,
        description: v.description,
        provider: 'YOUTUBE',
        embedUrl: `https://www.youtube.com/embed/${v.slug}`,
        durationSeconds: v.duration,
        isLive: v.isLive,
        publishedAt: daysAgo(v.daysAgo),
        thumbnailId: thumb.id,
        viewCount: 5_000 + Math.floor(Math.random() * 40_000),
      },
    });
  }
  console.log(`  ✓ ${VIDEOS.length} vidéos`);

  // ── Formules d'abonnement ──
  for (const plan of PLANS) {
    await prisma.subscriptionPlan.upsert({
      where: { id: `plan-${plan.tier.toLowerCase()}` },
      update: {
        name: plan.name,
        description: plan.description,
        priceAmount: plan.priceAmount,
        features: plan.features,
        isPopular: plan.isPopular,
        position: plan.position,
      },
      create: {
        id: `plan-${plan.tier.toLowerCase()}`,
        tier: plan.tier,
        name: plan.name,
        description: plan.description,
        priceAmount: plan.priceAmount,
        currency: 'XOF',
        interval: plan.interval,
        features: plan.features,
        isPopular: plan.isPopular,
        position: plan.position,
      },
    });
  }
  console.log(`  ✓ ${PLANS.length} formules d'abonnement`);

  // ── Abonnement Premium du lecteur de démonstration ──
  const premiumPlan = await prisma.subscriptionPlan.findUnique({
    where: { id: 'plan-premium' },
  });
  if (premiumPlan) {
    const existing = await prisma.subscription.findFirst({ where: { userId: reader.id } });
    if (!existing) {
      const end = new Date();
      end.setMonth(end.getMonth() + 1);
      await prisma.subscription.create({
        data: {
          userId: reader.id,
          planId: premiumPlan.id,
          tier: SubscriptionTier.PREMIUM,
          status: 'ACTIVE',
          provider: 'WAVE',
          currentPeriodStart: new Date(),
          currentPeriodEnd: end,
        },
      });
    }
  }

  // ── Emplacements publicitaires ──
  const adSlots = [
    { name: 'Leaderboard en-tête', placement: 'HEADER_LEADERBOARD' as const, categorySlug: null },
    { name: 'Pavé haut de colonne', placement: 'SIDEBAR_TOP' as const, categorySlug: null },
    { name: 'Pavé milieu de colonne', placement: 'SIDEBAR_MIDDLE' as const, categorySlug: null },
    { name: 'Encart dans l’article', placement: 'IN_ARTICLE' as const, categorySlug: null },
    { name: 'Bandeau pied de page', placement: 'FOOTER' as const, categorySlug: null },
  ];
  for (const slot of adSlots) {
    const existing = await prisma.adSlot.findFirst({ where: { name: slot.name } });
    if (!existing) {
      await prisma.adSlot.create({
        data: {
          name: slot.name,
          placement: slot.placement,
          imageUrl: img(`ad-${slot.placement}`, 728, 90),
          targetUrl: 'https://www.sencourrier.sn/publicite',
          categorySlug: slot.categorySlug,
          isActive: true,
        },
      });
    }
  }
  console.log(`  ✓ ${adSlots.length} emplacements publicitaires`);

  // ── Abonnés newsletter ──
  const newsletterEmails = [
    'awa.diop@example.sn',
    'moussa.sarr@example.sn',
    'ndeye.faye@example.sn',
  ];
  for (const email of newsletterEmails) {
    await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: {},
      create: {
        email,
        status: 'CONFIRMED',
        interests: ['politique', 'economie'],
        frequency: 'daily',
        confirmedAt: new Date(),
        source: 'seed',
      },
    });
  }

  // ── Tendances ──
  await prisma.tag.updateMany({
    where: { slug: { in: ['emploi', 'gaz', 'littoral', 'football', 'ia'] } },
    data: { isTrending: true },
  });

  // ── Métriques analytiques (30 derniers jours) ──
  for (let i = 0; i < 30; i += 1) {
    const date = daysAgo(i);
    date.setHours(0, 0, 0, 0);
    const visitors = 28_000 + Math.floor(Math.random() * 18_000);
    await prisma.dailyMetric.upsert({
      where: { date },
      update: {},
      create: {
        date,
        visitors,
        pageViews: visitors * 3 + Math.floor(Math.random() * 20_000),
        sessions: Math.floor(visitors * 1.25),
        avgSessionMs: 180_000 + Math.floor(Math.random() * 90_000),
        bounceRate: 0.32 + Math.random() * 0.12,
        newSubscribers: Math.floor(Math.random() * 120),
        canceledSubs: Math.floor(Math.random() * 18),
        revenueXof: 1_200_000 + Math.floor(Math.random() * 900_000),
        adImpressions: visitors * 4,
        adRevenueXof: 400_000 + Math.floor(Math.random() * 350_000),
      },
    });
  }
  console.log('  ✓ 30 jours de métriques analytiques');

  // ── Paramètres du site ──
  await prisma.setting.upsert({
    where: { key: 'site.maintenance' },
    update: {},
    create: { key: 'site.maintenance', value: { enabled: false, message: '' }, group: 'general' },
  });
  await prisma.setting.upsert({
    where: { key: 'seo.defaults' },
    update: {},
    create: {
      key: 'seo.defaults',
      value: { titleTemplate: '%s | SENCOURRIER', defaultDescription: 'Le média numérique de référence du Sénégal' },
      group: 'seo',
    },
  });

  console.log('✅ Jeu de données SENCOURRIER initialisé avec succès.');
  console.log('');
  console.log('   Comptes de démonstration :');
  console.log('   ─────────────────────────────────────────────────');
  console.log(`   Super Admin : ${process.env.SEED_ADMIN_EMAIL ?? 'admin@sencourrier.sn'}`);
  console.log(`   Rédacteur  : redaction@sencourrier.sn`);
  console.log(`   Lecteur    : lecteur@sencourrier.sn`);
  console.log(`   Mot de passe : ${process.env.SEED_ADMIN_PASSWORD ?? 'SenCourrier!2024'}`);
  console.log('');
}

main()
  .catch((error) => {
    console.error('❌ Échec du seed :', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
