# SENCOURRIER — API REST

Base : `/api/v1` — documentation interactive (Swagger) : `/api/docs`.
Authentification : **JWT Bearer** (`Authorization: Bearer <accessToken>`).

---

## 1. Conventions

- Réponses enveloppées : `{ data, meta? }`.
- Erreurs : `{ statusCode, message, error }`.
- Pagination : `?page=1&limit=20` → `meta: { page, limit, total, totalPages }`.
- Dates : ISO 8601 UTC. Fuseau de référence : `Africa/Dakar`.
- Versionnement par préfixe d'URL (`/api/v1`).

---

## 2. Authentification — `/auth`

| Méthode | Chemin | Rôle | Accès |
| --- | --- | --- | --- |
| POST | `/auth/register` | Créer un compte | Public |
| POST | `/auth/login` | Connexion (email + mot de passe) | Public |
| POST | `/auth/refresh` | Renouveler le jeton d'accès | Public (jeton de rafraîchissement) |
| POST | `/auth/logout` | Déconnecter la session courante | Authentifié |
| POST | `/auth/logout-all` | Déconnecter toutes les sessions | Authentifié |
| GET | `/auth/me` | Profil courant | Authentifié |
| GET | `/auth/google` | Démarrer OAuth Google | Public |
| GET | `/auth/google/callback` | Retour OAuth Google | Public |
| POST | `/auth/2fa/setup` | Initialiser la 2FA (TOTP) | Authentifié |
| POST | `/auth/2fa/enable` | Activer la 2FA | Authentifié |
| POST | `/auth/2fa/disable` | Désactiver la 2FA | Authentifié |

---

## 3. Articles — `/articles`

| Méthode | Chemin | Rôle | Accès |
| --- | --- | --- | --- |
| GET | `/articles` | Lister (filtres : rubrique, tag, auteur, dates) | Public |
| GET | `/articles/featured` | Articles à la une | Public |
| GET | `/articles/breaking` | Dernière minute | Public |
| GET | `/articles/popular` | Les plus lus | Public |
| GET | `/articles/slug/:slug` | Article par slug | Public |
| GET | `/articles/slug/:slug/related` | Articles liés | Public |
| GET | `/articles/admin` | Liste complète, tous statuts | Rédaction |
| POST | `/articles` | Créer un article | Journaliste et plus |
| PATCH | `/articles/:id` | Modifier | Auteur / Rédaction |
| PATCH | `/articles/:id/moderate` | Valider ou refuser | Rédaction |
| GET | `/articles/:id/revisions` | Historique des modifications | Rédaction |
| DELETE | `/articles/:id` | Retirer (suppression logique) | Rédaction |

---

## 4. Rubriques et tags

| Méthode | Chemin | Rôle | Accès |
| --- | --- | --- | --- |
| GET | `/categories` | Arborescence complète | Public |
| GET | `/categories/menu` | Rubriques du menu principal | Public |
| GET | `/categories/:slug` | Rubrique et sous-rubriques | Public |
| GET | `/tags` | Tags | Public |
| GET | `/tags/trending` | Tags tendance | Public |
| GET | `/tags/:slug` | Tag | Public |

---

## 5. Auteurs — `/authors`

| Méthode | Chemin | Rôle | Accès |
| --- | --- | --- | --- |
| GET | `/authors` | Liste des journalistes | Public |
| GET | `/authors/featured` | Plumes mises en avant | Public |
| GET | `/authors/:slug` | Profil et productions | Public |

---

## 6. Recherche — `/search`

| Méthode | Chemin | Rôle | Accès |
| --- | --- | --- | --- |
| GET | `/search?q=` | Recherche plein texte, accents ignorés | Public |
| GET | `/search/suggest?q=` | Suggestions de saisie | Public |
| GET | `/search/popular` | Recherches populaires | Public |

Exemple :

```bash
curl -G --data-urlencode "q=senegal" https://api.sencourrier.sn/api/v1/search
# → { "data": [ … ], "meta": { "total": 12, … } }
```

« senegal », « Sénégal » et « SÉNÉGAL » retournent le même jeu de résultats.

---

## 7. Compte utilisateur — `/users`

| Méthode | Chemin | Rôle | Accès |
| --- | --- | --- | --- |
| GET | `/users/me` | Profil | Authentifié |
| PATCH | `/users/me` | Mettre à jour le profil | Authentifié |
| PATCH | `/users/me/preferences` | Préférences (thème, alertes) | Authentifié |
| GET | `/users/me/history` | Historique de lecture | Authentifié |
| POST | `/users/me/history` | Enregistrer une lecture | Authentifié |
| GET | `/users/me/bookmarks` | Articles sauvegardés | Authentifié |
| POST | `/users/me/bookmarks/:articleId` | Sauvegarder / retirer | Authentifié |
| GET | `/users/me/notifications` | Notifications | Authentifié |
| POST | `/users/me/notifications/read` | Marquer comme lues | Authentifié |
| DELETE | `/users/me` | Supprimer le compte (RGPD) | Authentifié |

---

## 8. Abonnements — `/subscriptions`

| Méthode | Chemin | Rôle | Accès |
| --- | --- | --- | --- |
| GET | `/subscriptions/plans` | Offres disponibles | Public |
| POST | `/subscriptions/checkout` | Démarrer un paiement | Authentifié |
| GET | `/subscriptions/me` | Abonnement courant | Authentifié |
| GET | `/subscriptions/me/payments` | Historique de paiement | Authentifié |
| POST | `/subscriptions/:id/cancel` | Résilier | Authentifié |
| POST | `/subscriptions/webhooks/stripe` | Webhook Stripe | Signature Stripe |
| POST | `/subscriptions/webhooks/mobile-money` | Webhook Wave / Orange / Free | Signature opérateur |

---

## 9. Médias — `/media`

| Méthode | Chemin | Rôle | Accès |
| --- | --- | --- | --- |
| POST | `/media/upload` | Téléverser vers Azure Blob Storage | Rédaction |
| GET | `/media` | Bibliothèque | Rédaction |
| PATCH | `/media/:id` | Métadonnées, texte alternatif | Rédaction |
| DELETE | `/media/:id` | Supprimer | Rédaction |

---

## 10. Newsletter — `/newsletter`

| Méthode | Chemin | Rôle | Accès |
| --- | --- | --- | --- |
| POST | `/newsletter/subscribe` | Inscription (double opt-in) | Public |
| GET | `/newsletter/confirm` | Confirmation par jeton | Public |
| GET | `/newsletter/unsubscribe` | Désinscription | Public |
| GET | `/newsletter/stats` | Statistiques | Rédaction |

---

## 11. Analytique — `/analytics`

| Méthode | Chemin | Rôle | Accès |
| --- | --- | --- | --- |
| POST | `/analytics/pageview` | Enregistrer une page vue | Public |
| GET | `/analytics/overview` | Indicateurs clés | Admin |
| GET | `/analytics/timeseries` | Séries temporelles | Admin |
| POST | `/analytics/rollup` | Agrégation journalière | Tâche planifiée |

---

## 12. Contact et supervision

| Méthode | Chemin | Rôle | Accès |
| --- | --- | --- | --- |
| POST | `/contact` | Envoyer un message | Public |
| GET | `/contact` | Consulter les messages | Admin |
| GET | `/health` | État complet | Public |
| GET | `/health/live` | Sonde de vivacité | Public |
| GET | `/health/ready` | Sonde de disponibilité | Public |

---

## 13. Codes de retour

| Code | Signification |
| --- | --- |
| 200 | Succès |
| 201 | Ressource créée |
| 400 | Requête invalide |
| 401 | Authentification requise |
| 403 | Droits insuffisants |
| 404 | Ressource introuvable |
| 409 | Conflit (doublon) |
| 422 | Entité non traitable |
| 429 | Trop de requêtes (limitation) |
| 500 | Erreur serveur |
