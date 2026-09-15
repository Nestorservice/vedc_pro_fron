# VEDC - Système d'Information

## 🔐 Connexion

**Mode Démo Activé** - Vous pouvez vous connecter avec n'importe quel identifiant :

- **Email** : `admin@vedc.cm` (ou n'importe quoi)
- **Mot de passe** : `password123` (ou n'importe quoi)

Le système fonctionne en mode démo avec des données fictives pour permettre de tester toutes les fonctionnalités sans connexion au serveur réel.

## 🎨 Design System

L'application utilise le **Porsche Design System v4** :
- Couleurs : Noir (#000000), Blanc (#FFFFFF), Gris (#F2F4F7)
- Typographie : Inter, bold, uppercase
- Bordures : 2px solides, aucun arrondi
- Animations : 150ms, snappy et techniques

## 📱 PWA (Progressive Web App)

L'application est installable sur votre appareil :
1. Ouvrez l'application dans votre navigateur
2. Cliquez sur "Installer" dans les paramètres ou utilisez le bouton d'installation
3. L'application sera disponible hors ligne

## 🏗️ Architecture

### Structure des fichiers
```
/src
  /components       # Composants UI réutilisables
  /hooks           # Hooks React personnalisés
  /services        # API client et types TypeScript
  /views           # Pages de l'application
/public
  manifest.json    # Configuration PWA
  sw.js            # Service Worker
  icon.svg         # Icône de l'application
```

### Modules principaux
- **Dashboard** : Vue d'ensemble avec statistiques
- **Membres** : Gestion des fiches membres
- **Territoires** : Structure territoriale hiérarchique
- **Serviteurs** : Gestion des serviteurs et grades
- **Transferts** : Suivi des demandes de transfert
- **Rapports** : Rapports et exports
- **Audit** : Journal d'audit des actions
- **Utilisateurs** : Gestion des comptes
- **Paramètres** : Configuration et PWA

## 🔌 API

L'application est configurée pour se connecter à :
- **URL** : `https://vedc-api-production.up.railway.app/api/v1`
- **Mode actuel** : Démo (données fictives)

Pour activer le mode production, modifiez `src/services/api.ts` :
```typescript
const USE_MOCK_DATA = false; // Désactiver le mode démo
```

## 🚀 Développement

```bash
# Installer les dépendances
npm install

# Lancer en développement
npm run dev

# Construire pour production
npm run build

# Prévisualiser la build
npm run preview
```

## 📊 Fonctionnalités

### Authentification
- Connexion avec tokens JWT
- Rafraîchissement automatique des tokens
- Gestion des sessions

### Gestion des données
- Pagination et recherche
- Création, modification, suppression
- Validation des formulaires
- Gestion des erreurs

### Interface utilisateur
- Design responsive (mobile-first)
- Navigation adaptative
- Skeleton loaders
- Notifications toast
- Modales et formulaires

### PWA
- Installation sur l'appareil
- Fonctionnement hors ligne
- Cache intelligent
- Service Worker

## 🎯 Prochaines étapes

1. Connecter à l'API réelle (désactiver USE_MOCK_DATA)
2. Implémenter les uploads de documents
3. Ajouter les exports PDF/Excel
4. Configurer les notifications push
5. Améliorer le cache offline

## 📝 Notes

- L'application utilise des données de démonstration par défaut
- Toutes les actions en mode démo sont simulées
- Les données ne sont pas persistées entre les sessions en mode démo
- Le design suit strictement le Porsche Design System v4
