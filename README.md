# Chaly

Application mobile de partage de photos géolocalisées en temps réel. Les utilisateurs prennent des photos, les publient avec une localisation, et interagissent via un feed social (likes, commentaires, classement).

## Contexte du projet

Chaly (anciennement CuiteMap) est une application sociale mobile où les utilisateurs partagent des moments capturés en photo. Chaque publication ("cuite") est associée à une position géographique et peut être visualisée sur une carte interactive. L'application intègre un système de gamification (XP, niveaux, streaks) et une IA qui analyse les photos pour générer des titres et descriptions selon une personnalité choisie par l'utilisateur.

## Fonctionnalités principales

- **Prise de photo en temps réel** via la caméra native (react-native-vision-camera)
- **Publication géolocalisée** avec localisation automatique et adresse
- **Feed vertical scrollable** (type TikTok/BeReal) avec pagination par curseur
- **Carte interactive** (Mapbox) affichant les publications sur leur lieu de prise
- **Interactions sociales** : likes, commentaires, profils publics
- **Classement global** des utilisateurs par nombre de publications
- **Analyse IA des photos** : génération automatique de titres/descriptions avec choix de personnalité (taquin, poétique, aigri, dragueur)
- **Système de gamification** : XP, niveaux, streaks journaliers
- **Notifications push** (expo-notifications)
- **Gestion de profil** : photo, pseudo, description, couleur de fond
- **Niveaux de confidentialité** : publique, amis, clan, privé
- **Authentification par téléphone** (code SMS)

## Architecture du projet

L'application suit une architecture React Native classique avec Expo Router pour la navigation file-based :

```
┌─────────────────────────────────────┐
│            Expo Router              │
│  (navigation file-based + tabs)     │
├─────────────────────────────────────┤
│         Components (UI)             │
│  scroll / profile / addCuite / map  │
├─────────────────────────────────────┤
│     Zustand Stores (état global)    │
│  user / cuites / modal / photo      │
├─────────────────────────────────────┤
│          API Layer (fetch)          │
│   auth / cuites / users / social    │
├─────────────────────────────────────┤
│       Utils & Hooks                 │
│  secureToken / mixpanel / location  │
├─────────────────────────────────────┤
│         API Backend REST            │
│      https://cuitemap.com/api       │
└─────────────────────────────────────┘
```

**Décisions techniques :**

- **Expo Router** pour la navigation file-based avec typed routes
- **Zustand** pour la gestion d'état (léger, sans boilerplate)
- **NativeWind (TailwindCSS)** pour le styling
- **Expo SecureStore** pour le stockage sécurisé des tokens JWT
- **Pagination par curseur** sur les listes (cuites, classement) avec TTL pour éviter les refetch inutiles
- **Biome** comme linter/formatter (remplace ESLint + Prettier)

## Stack technique

| Catégorie        | Technologies                          |
| ---------------- | ------------------------------------- |
| Langage          | TypeScript                            |
| Framework        | React Native 0.76, Expo SDK 52        |
| Navigation       | Expo Router 4 (file-based)            |
| État global      | Zustand 5                             |
| Styling          | NativeWind 4 (TailwindCSS 3)          |
| Caméra           | react-native-vision-camera 4          |
| Carte            | Mapbox (@rnmapbox/maps)               |
| Analytics        | Mixpanel                              |
| Notifications    | expo-notifications                    |
| Auth             | JWT (expo-secure-store)               |
| Linter/Formatter | Biome                                 |
| Tests            | Jest + jest-expo, Testing Library     |
| Build            | EAS Build (Expo Application Services) |
| Déploiement      | Fastlane (iOS + Android)              |
| CI               | GitLab CI (lint)                      |
| Package Manager  | Yarn 1.22                             |
| Ruby             | 3.2.2 (Fastlane)                      |

## Installation

### Prérequis

- Node.js 20.x
- Yarn 1.22
- rbenv + Ruby 3.2.2 (pour Fastlane)
- Xcode (iOS) / Android Studio (Android)
- Un compte Expo (EAS)
- Clé API Mapbox (à configurer dans `app.json`)

### Installation

```bash
# Initialisation complète (yarn + Fastlane)
make init

# Ou installation simple
yarn install
```

### Lancement

```bash
# Démarrer le serveur de développement
yarn start

# Build + run iOS natif
make ios

# Build + run Android natif
make android

# Build EAS development (iOS)
make dev

# Build EAS development (Android)
make dev-android
```

### Configuration

Les variables d'environnement sont définies dans `app.json` sous `expo.extra` :

- `apiUrl` : URL de l'API backend
- `apiKey` : Clé d'API pour l'authentification des requêtes
- `mapboxApiKey` : Clé Mapbox pour la carte

## Structure du repository

```
src/
├── api/                    # Couche d'appels API REST
│   ├── auth/               # Authentification (ping, SMS, token, username)
│   ├── challenges/         # Récupération des challenges
│   ├── cuites/             # CRUD publications (cuites)
│   │   ├── comment/        # Commentaires
│   │   └── like/           # Likes
│   └── users/              # Gestion utilisateurs, classement, profil
├── app/                    # Écrans (Expo Router file-based)
│   ├── (tabs)/             # Navigation par onglets (Feed, Caméra, Profil)
│   ├── loginPage.tsx       # Connexion par téléphone
│   ├── createUsername.tsx   # Création de pseudo
│   ├── map.tsx             # Vue carte
│   ├── friends.tsx         # Classement global
│   ├── settings.tsx        # Paramètres
│   ├── profilePublic.tsx   # Profil d'un autre utilisateur
│   └── photoViewer.tsx     # Visualisation photo plein écran
├── assets/                 # Polices, images, couleurs
├── components/             # Composants UI réutilisables
│   ├── addCuite/           # Prise de photo + prévisualisation
│   ├── commons/            # Header, modales, toast
│   ├── icons/              # Composant d'icônes custom (SVG)
│   ├── infoScreen/         # CGU, RGPD, autorisations, config IA
│   ├── login/              # Formulaires de connexion
│   ├── map/                # Composant carte Mapbox
│   ├── profile/            # Composants profil utilisateur
│   ├── scroll/             # Feed vertical (items, options sociales)
│   └── settings/           # Boutons de paramètres
├── hooks/                  # Hooks custom
│   ├── usePushNotification.ts
│   └── useScrollLogic.ts   # Logique de pagination du feed
├── models/                 # Types/interfaces TypeScript
│   ├── cuites/             # Modèle Cuite
│   ├── stores/             # Interfaces des stores
│   └── users/              # Modèle User
├── store/                  # Stores Zustand
│   ├── user.store.ts       # Utilisateur connecté
│   ├── cuites.store.ts     # Feed de cuites (scroll)
│   ├── userCuites.store.ts # Cuites du profil
│   ├── addCuite.ts         # État de création de cuite
│   ├── auth.store.ts       # État d'authentification
│   ├── modal.store.ts      # État des modales
│   ├── photoState.store.ts # État de la caméra/photo
│   ├── photoViewer.store.ts
│   ├── postId.store.ts     # Post ID via notification
│   └── publicProfile.store.ts
└── utils/                  # Utilitaires
    ├── secureToken.ts      # Stockage JWT (SecureStore)
    ├── mixpanel.ts         # Tracking analytics
    ├── accessLocation.ts   # Géolocalisation
    ├── mediaCompression.ts # Compression d'images
    ├── normalizePhone.ts   # Normalisation numéro de téléphone
    ├── dateFormat.ts       # Formatage de dates
    └── searchAdress.ts     # Recherche d'adresse
```

## Fonctionnement interne

### Flux d'authentification

1. L'utilisateur entre son numéro de téléphone (normalisé internationalement)
2. Un code SMS est envoyé via `POST /authentification/request-code`
3. Le code est vérifié via `POST /authentification/verify-code`
4. Un JWT est stocké dans `expo-secure-store`
5. Au lancement, le token est vérifié via `POST /authentification/verify-token` et rafraîchi automatiquement
6. Si l'utilisateur n'a pas de pseudo, il est redirigé vers la création de username

### Flux de publication

1. L'utilisateur prend une photo via la caméra native
2. La photo est envoyée à l'IA (`POST /pictures/analyse`) qui génère des suggestions de titres/descriptions selon la personnalité choisie
3. L'utilisateur sélectionne un titre, ajoute une description optionnelle
4. La localisation est récupérée automatiquement
5. La publication est envoyée en multipart/form-data (`POST /cuites`)

### Gestion du feed

- Pagination par curseur avec dé-duplication côté client (Set d'IDs)
- TTL de 120 secondes avant refetch automatique du feed
- Scroll vertical plein écran (paging) avec `FlatList` optimisée (`windowSize: 3`, `maxToRenderPerBatch: 2`)
- Pull-to-refresh avec retour haptique

### Sécurité

- Tokens JWT stockés dans `expo-secure-store` (Keychain iOS / Keystore Android)
- Clé API (`x-api-key`) envoyée dans chaque requête
- Vérification du token à chaque lancement de l'application
- Suppression du token en cas d'invalidation (401)

### Analytics

Mixpanel est utilisé pour tracker les événements clés : connexion, prise de photo, utilisation de l'IA, publication de cuite.

## API

L'application communique avec une API REST hébergée sur `cuitemap.com/api`. Toutes les requêtes authentifiées utilisent un header `Authorization: Bearer <token>` et un header `x-api-key`.

### Endpoints principaux

| Méthode | Endpoint                            | Description                                                    |
| ------- | ----------------------------------- | -------------------------------------------------------------- |
| POST    | `/authentification/request-code`    | Envoyer un code SMS                                            |
| POST    | `/authentification/verify-code`     | Vérifier le code SMS                                           |
| POST    | `/authentification/verify-token`    | Vérifier/rafraîchir le JWT                                     |
| GET     | `/authentification/verify-username` | Vérifier la disponibilité d'un pseudo                          |
| GET     | `/authentification/ping`            | Health check du serveur                                        |
| GET     | `/cuites/list`                      | Liste paginée des cuites (`limit`, `cursor`, `type`, `pseudo`) |
| POST    | `/cuites`                           | Créer une cuite (multipart/form-data)                          |
| DELETE  | `/cuites/:id`                       | Supprimer une cuite                                            |
| POST    | `/pictures/analyse`                 | Analyse IA d'une photo (multipart)                             |
| POST    | `/social/cuites/:id/like`           | Liker une cuite                                                |
| DELETE  | `/social/cuites/:id/like`           | Retirer un like                                                |
| POST    | `/social/cuites/:id/comment`        | Commenter une cuite                                            |
| GET     | `/social/cuites/:id/comments`       | Lister les commentaires                                        |
| GET     | `/social/cuites/:id/likes`          | Lister les likes                                               |
| GET     | `/users/global-posts`               | Classement global par publications                             |
| GET     | `/users/:pseudo`                    | Informations d'un utilisateur                                  |
| GET     | `/challenges`                       | Liste des challenges                                           |

## Tests

Le projet utilise **Jest** avec **jest-expo** et **Testing Library React Native**.

```bash
# Lancer les tests en mode watch
yarn test
```

Des tests unitaires existent pour les utilitaires (`dateFormat.test.ts`, `secureToken.test.ts`).

## Lint & Format

```bash
# Linter (Biome)
yarn lint

# Formatter (Biome)
yarn format

# Check + fix automatique
yarn fix
```

La CI GitLab exécute le lint et le format à chaque push.

## Déploiement

```bash
# Build de production + déploiement via Fastlane (iOS + Android)
make prod
```

Le déploiement utilise **EAS Build** pour les builds cloud et **Fastlane** pour la soumission aux stores. Le versioning applicatif est géré côté EAS (`appVersionSource: "remote"`) avec auto-increment en production.

## Améliorations possibles

- **Tests** : couverture de tests très faible, ajouter des tests pour les stores Zustand, les hooks custom et les appels API
- **Gestion d'erreurs** : centraliser la gestion d'erreurs API (actuellement dispersée entre `throw`, `console.error` et retours de types mixtes)
- **Typage API** : les réponses API ne sont pas typées, ajouter des types pour les réponses du backend
- **Offline support** : aucune gestion du mode hors-ligne, les requêtes échouent silencieusement
- **Cache d'images** : utiliser un système de cache plus robuste pour les photos du feed
- **Séparation des responsabilités** : certains écrans contiennent de la logique métier qui pourrait être extraite dans des hooks dédiés (ex: `friends.tsx`)
- **Variables d'environnement** : la clé API et l'URL sont en dur dans `app.json`, migrer vers un système `.env` avec `dotenv` (déjà en devDependencies)
- **Accessibilité** : aucun label d'accessibilité sur les composants interactifs
- **Internationalisation** : l'application est uniquement en français, pas de système i18n en place

## Auteur

Développé par **Kilian Rodrigues** (identifiant package Android : `com.krdgs.app`, organisation Expo : `cuitemap`).
