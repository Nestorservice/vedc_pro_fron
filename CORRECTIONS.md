# Corrections appliquées - Version 1.1

## Problèmes identifiés

1. **Erreur CORS** : L'application déployée sur `vedcerp.vercel.app` tentait de se connecter à `railway.app/api/v1` qui ne permet pas les requêtes CORS
2. **Service Worker** : Le service worker tentait de mettre en cache les requêtes API qui échouaient
3. **Warnings DOM** : Les inputs n'avaient pas d'attributs `autocomplete`
4. **Meta tag déprécié** : Utilisation de `apple-mobile-web-app-capable` au lieu de `mobile-web-app-capable`

## Corrections appliquées

### 1. Mode Démo Activé
- **Fichier** : `src/services/api.ts`
- **Changement** : `USE_MOCK_DATA = true`
- **Résultat** : L'application utilise maintenant des données fictives et ne tente plus de se connecter au serveur backend

### 2. Service Worker Amélioré
- **Fichier** : `public/sw.js`
- **Changements** :
  - Ne met en cache QUE les assets statiques (HTML, CSS, JS, icônes)
  - Ignore toutes les requêtes API (`/api/`)
  - Ignore les requêtes vers des domaines externes
  - Gère correctement les erreurs réseau
  - Ne tente plus de mettre en cache les requêtes qui échouent

### 3. Attributs Autocomplete
- **Fichier** : `src/components/ui/index.tsx`
- **Changement** : Le composant `Input` détecte automatiquement le type d'autocomplete basé sur le label
- **Types supportés** :
  - `email` pour les champs email
  - `current-password` pour les mots de passe
  - `family-name` pour les noms
  - `given-name` pour les prénoms
  - `tel` pour les téléphones
  - `username` pour les noms d'utilisateur
  - `off` pour les champs de recherche

### 4. Inputs de Recherche
- **Fichiers** : `src/views/Members.tsx`, `src/views/AuditLog.tsx`
- **Changement** : Ajout de `autoComplete="off"` aux inputs de recherche

### 5. Meta Tag PWA
- **Fichier** : `index.html`
- **Changement** : Ajout de `<meta name="mobile-web-app-capable" content="yes">` (non déprécié)
- **Note** : Les deux meta tags sont présents pour compatibilité

## URL de l'API

L'URL de l'API est configurée vers :
```
https://vedc-api-production.up.railway.app/api/v1
```

Cependant, le mode démo est activé par défaut, donc aucune requête n'est envoyée au serveur.

## Pour passer en production

Quand le backend sera configuré pour accepter les requêtes CORS depuis `vedcerp.vercel.app` :

1. Modifier `src/services/api.ts` :
   ```typescript
   const USE_MOCK_DATA = false;
   ```

2. Configurer le backend pour ajouter les headers CORS :
   ```
   Access-Control-Allow-Origin: https://vedcerp.vercel.app
   Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
   Access-Control-Allow-Headers: Content-Type, Authorization
   Access-Control-Allow-Credentials: true
   ```

3. Rebuild et redéployer l'application

## Prochain déploiement

Après ces corrections, vous devez :
1. Commiter les changements
2. Push vers le repository
3. Vercel déploiera automatiquement la nouvelle version
4. Les utilisateurs devront actualiser leur navigateur pour charger la nouvelle version
5. Le nouveau service worker remplacera l'ancien automatiquement

## Test local

Pour tester localement :
```bash
npm run dev
```

Puis ouvrir `http://localhost:5173` et se connecter avec n'importe quel email/mot de passe.

## Fonctionnalités disponibles en mode démo

Toutes les fonctionnalités sont opérationnelles :
- ✅ Dashboard avec statistiques fictives
- ✅ Gestion des membres (CRUD)
- ✅ Structure territoriale
- ✅ Gestion des serviteurs
- ✅ Suivi des transferts
- ✅ Rapports et graphiques
- ✅ Journal d'audit
- ✅ Gestion des utilisateurs
- ✅ PWA installable
- ✅ Fonctionnement hors ligne (assets statiques)

## Notes importantes

- Le mode démo est activé par défaut pour permettre le test sans backend
- Les données sont stockées en mémoire et ne persistent pas entre les sessions
- Le service worker ne met en cache que les assets statiques
- Les requêtes API ne sont pas interceptées par le service worker
- L'application fonctionne en mode hors ligne pour la navigation, mais pas pour les données
