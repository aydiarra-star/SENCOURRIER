# SENCOURRIER — Guide utilisateur

Destiné aux lecteurs, aux abonnés et à l'équipe rédactionnelle.

---

## 1. Lecteur

### Lire l'actualité

La page d'accueil ouvre sur la une, puis les rubriques : Politique, Société,
Économie, Sports, Technologies, International, Diaspora, Faits divers. Chaque
carte indique la rubrique, le temps de lecture et l'auteur.

### Suivre l'actualité en continu

- Le bandeau **Dernière minute** défile en haut du site.
- La page **Dernières minutes** regroupe les publications des dernières heures.
- La page **Tendances** met en avant les sujets les plus consultés.

### Rechercher

La recherche est **insensible aux accents et à la casse** : « senegal »,
« Sénégal » et « SÉNÉGAL » donnent le même résultat. Le champ de recherche du
site interroge à la fois les titres, les chapôs et les tags.

### Changer de thème

L'icône de thème bascule entre le mode clair et le mode sombre. Le choix est
mémorisé et appliqué avant le premier rendu, sans clignotement.

### Autres formats

| Page           | Contenu                         |
| -------------- | ------------------------------- |
| **TV Live**    | Diffusion vidéo en direct       |
| **Vidéos**     | Reportages et formats courts    |
| **Podcasts**   | Émissions et épisodes           |
| **Newsletter** | Lettre d'information périodique |

---

## 2. Compte

### Créer un compte

Depuis **Inscription** : adresse électronique et mot de passe, ou connexion
directe avec un compte Google. Un courriel de vérification est envoyé.

### Espace personnel

| Page                | Fonction                                      |
| ------------------- | --------------------------------------------- |
| **Profil**          | Identité, avatar, mot de passe, 2FA           |
| **Tableau de bord** | Articles sauvegardés, historique, préférences |
| **Notifications**   | Alertes, nouveaux articles, newsletters       |

### Préférences

- Thème clair ou sombre
- Alertes « dernière minute »
- Rubriques suivies
- Fréquence des newsletters

### Sécurité du compte

La **double authentification (2FA)** est disponible : un code à usage unique
est demandé à chaque connexion. Des codes de secours sont fournis à l'activation.

### Données personnelles

L'historique de lecture et les favoris peuvent être effacés à tout moment.
La suppression du compte entraîne l'effacement des données personnelles.

---

## 3. Abonnement Premium

| Offre       | Accès                                                                              |
| ----------- | ---------------------------------------------------------------------------------- |
| **Gratuit** | Ensemble de l'actualité, newsletters générales                                     |
| **Premium** | Articles exclusifs, podcasts premium, dossiers spéciaux, navigation sans publicité |

Paiement par **carte bancaire (Stripe)**, **Wave**, **Orange Money** ou
**Free Money**. La résiliation s'effectue depuis l'espace personnel et prend
effet à la fin de la période en cours.

---

## 4. Équipe rédactionnelle

### Rôles

| Rôle                     | Périmètre                                    |
| ------------------------ | -------------------------------------------- |
| Super Admin              | Administration complète, rôles, réglages     |
| Directeur de publication | Validation finale, responsabilité éditoriale |
| Rédacteur en chef        | Affectation, validation, planification       |
| Journaliste              | Rédaction, soumission pour validation        |
| Correspondant            | Rédaction depuis une zone géographique       |
| Community Manager        | Commentaires, réseaux sociaux, modération    |
| Abonné Premium           | Accès aux contenus exclusifs                 |
| Lecteur                  | Accès standard                               |

### Cycle de rédaction

```
Brouillon → Relecture → Planifié → Publié → Archivé
```

1. **Créer** — titre, chapô, corps, rubrique, tags, médias.
2. **Soigner le référencement** — titre SEO, méta-description, image de partage.
3. **Soumettre** — l'article passe en relecture.
4. **Valider ou planifier** — le rédacteur en chef approuve, immédiatement ou à
   une date programmée.
5. **Suivre** — l'historique conserve chaque modification (`ArticleRevision`).

### Gestion des médias

Les médias sont téléversés vers Azure Blob Storage, avec texte alternatif
obligatoire pour l'accessibilité, crédit et légende.

### Modération

Les commentaires passent par une file de modération. Chaque décision est
enregistrée (`CommentModeration`).

### Analytique

Le tableau de bord rédactionnel présente : visiteurs, pages vues, articles les
plus lus, origine du trafic, abonnements, recettes, performance publicitaire et
indicateurs de référencement.

---

## 5. Questions fréquentes

**Le contenu est-il accessible sans compte ?**
Oui. L'actualité générale est ouverte à tous ; le compte apporte les favoris,
l'historique et les préférences.

**Comment signaler une erreur ?**
Par le formulaire de **Contact** ou par courriel à `redaction@sencourrier.sn`.

**Comment se désinscrire de la newsletter ?**
Un lien de désinscription figure au bas de chaque envoi.

**Le site fonctionne-t-il hors ligne ?**
Le site est une application web progressive (PWA) : les pages déjà visitées
restent consultables et le site peut être installé sur l'écran d'accueil.
