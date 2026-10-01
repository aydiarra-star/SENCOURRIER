# SENCOURRIER — Schémas UML

Diagrammes de conception. Les sources sont en **Mermaid** (rendus directement
par GitHub) et en **PlantUML** (fichiers `.puml` du même dossier) pour les
diagrammes de classes et de cas d'utilisation.

---

## 1. Cas d'utilisation

```plantuml
@startuml
left to right direction
skinparam packageStyle rectangle

actor "Lecteur" as L
actor "Abonné Premium" as P
actor "Journaliste" as J
actor "Rédacteur en chef" as R
actor "Directeur de publication" as D
actor "Super Admin" as S

rectangle SENCOURRIER {
  L --> (Consulter l'actualité)
  L --> (Rechercher un contenu)
  L --> (S'inscrire / Se connecter)
  L --> (Commenter)
  P --> (Accéder aux contenus exclusifs)
  P --> (Écouter les podcasts premium)
  P --> (Gérer son abonnement)
  J --> (Créer un article)
  J --> (Soumettre pour validation)
  R --> (Valider une publication)
  R --> (Planifier une publication)
  D --> (Publier un communiqué officiel)
  S --> (Gérer les rôles)
  S --> (Superviser l'analytique)
}
@enduml
```

---

## 2. Diagramme de classes — noyau éditorial

```plantuml
@startuml
class User {
  +id: String
  +email: String
  +name: String
  +role: Role
  +subscriptionTier: SubscriptionTier
}

class AuthorProfile {
  +slug: String
  +displayName: String
  +bio: String
  +isActive: Boolean
}

class Article {
  +id: String
  +slug: String
  +title: String
  +excerpt: String
  +bodyHtml: String
  +status: ArticleStatus
  +format: ArticleFormat
  +isBreaking: Boolean
  +isFeatured: Boolean
  +publishedAt: DateTime
}

class ArticleRevision {
  +action: RevisionAction
  +createdAt: DateTime
}

class Category {
  +slug: String
  +name: String
  +parentId: String
  +position: Int
}

class Tag {
  +slug: String
  +name: String
  +usageCount: Int
}

User "1" -- "0..1" AuthorProfile
User "1" -- "0..*" ArticleRevision : rédige
User "1..*" -- "0..*" Article : signe
Article "1" -- "0..*" ArticleRevision
Category "0..1" -- "0..*" Category : parent
Category "1" -- "0..*" Article
Article "0..*" -- "0..*" Tag
@enduml
```

---

## 3. Diagramme de classes — abonnement

```plantuml
@startuml
class SubscriptionPlan {
  +tier: SubscriptionTier
  +name: String
  +priceCents: Int
  +interval: String
}

class Subscription {
  +tier: SubscriptionTier
  +status: SubscriptionStatus
  +startedAt: DateTime
  +currentPeriodEnd: DateTime
}

class Payment {
  +provider: PaymentProvider
  +status: PaymentStatus
  +amountCents: Int
  +externalId: String
}

class Invoice {
  +number: String
  +issuedAt: DateTime
  +pdfUrl: String
}

class User
User "1" -- "0..*" Subscription
SubscriptionPlan "1" -- "0..*" Subscription
Subscription "1" -- "0..*" Payment
Subscription "1" -- "0..*" Invoice
@enduml
```

---

## 4. Séquence — publication d'un article

```mermaid
sequenceDiagram
    autonumber
    actor J as Journaliste
    participant API as API NestJS
    participant DB as PostgreSQL
    participant RD as Redis
    participant WEB as Next.js

    J->>API: POST /api/v1/articles (brouillon)
    API->>DB: Créer Article + ArticleRevision
    API->>RD: Invalider le cache éditorial
    API-->>J: 201 Created

    J->>API: POST /api/v1/articles/:id/submit
    API->>DB: status = IN_REVIEW
    API-->>J: 200 OK

    actor R as Rédacteur en chef
    R->>API: POST /api/v1/articles/:id/publish
    API->>DB: status = PUBLISHED, publishedAt = now()
    API->>DB: Journaliser ArticleRevision
    API->>RD: Invalider cache + purger CDN
    API-->>R: 200 OK

    WEB->>DB: Lecture au prochain rendu (cache CDN expiré)
```

---

## 5. Séquence — recherche insensible aux accents

```mermaid
sequenceDiagram
    autonumber
    actor L as Lecteur
    participant WEB as Next.js
    participant DB as PostgreSQL

    L->>WEB: /recherche?q=senegal
    WEB->>DB: SELECT ... WHERE lower(sencourrier_unaccent(title)) LIKE '%senegal%'
    Note over DB: Bitmap Index Scan sur<br/>articles_title_unaccent_trgm_idx
    DB-->>WEB: 12 articles
    WEB-->>L: Résultats (Sénégal, Senegal, SÉNÉGAL…)
```

---

## 6. Séquence — abonnement premium

```mermaid
sequenceDiagram
    autonumber
    actor P as Lecteur
    participant WEB as Next.js
    participant API as API NestJS
    participant PAY as Stripe / Wave / Orange Money
    participant DB as PostgreSQL

    P->>WEB: Choisir l'offre Premium
    WEB->>API: POST /api/v1/subscriptions/checkout
    API->>PAY: Créer une intention de paiement
    PAY-->>API: Référence + URL de paiement
    API-->>WEB: Redirection
    P->>PAY: Régler
    PAY->>API: POST /api/v1/subscriptions/webhooks/*
    API->>DB: Payment = SUCCEEDED, Subscription = ACTIVE
    API-->>P: Accès premium débloqué
```

---

## 7. Activité — cycle de vie éditorial

```mermaid
stateDiagram-v2
    [*] --> Brouillon
    Brouillon --> Relecture : soumission
    Relecture --> Brouillon : corrections demandées
    Relecture --> Planifié : validation + date future
    Relecture --> Publié : validation immédiate
    Planifié --> Publié : échéance atteinte
    Publié --> Archivé : retrait
    Archivé --> [*]
```

---

## 8. Déploiement

```mermaid
flowchart LR
    subgraph Poste de développement
        DEV[Docker Compose<br/>web + api + postgres + redis]
    end
    subgraph GitHub
        GH[Dépôt + Actions]
    end
    subgraph Azure
        ACR[Azure Container Registry]
        APP[App Service / Container Apps]
    end
    subgraph Cloudflare
        CDN[CDN · WAF · DDoS]
    end
    DEV --> GH --> ACR --> APP --> CDN
```
