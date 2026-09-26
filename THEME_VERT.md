# Thème Vert & Blanc - Documentation

## 🎨 Palette de Couleurs

Le thème a été transformé de bleu à vert émeraude pour une esthétique plus fraîche et naturelle.

### Couleurs Principales

```css
/* Vert Émeraude - Couleur Principale */
--color-primary: #10B981;           /* Emerald 500 */
--color-primary-dark: #059669;      /* Emerald 600 - Hover */
--color-primary-light: #34D399;     /* Emerald 400 */

/* Variations de Vert */
--color-success: #10B981;           /* Emerald 500 */
```

### Couleurs de Fond

```css
/* Fonds */
--color-background: #F8FAFC;        /* Slate 50 - Fond principal */
--color-surface: #FFFFFF;           /* Blanc - Cartes */

/* Bordures */
--color-border: #E2E8F0;            /* Slate 200 */
--color-border-light: #F1F5F9;      /* Slate 100 */
```

### Couleurs de Texte

```css
/* Texte */
--color-text-primary: #0F172A;      /* Slate 900 - Titre */
--color-text-secondary: #475569;    /* Slate 600 - Sous-titre */
--color-text-muted: #94A3B8;        /* Slate 400 - Texte atténué */
```

### Couleurs d'État

```css
/* États */
--color-warning: #F59E0B;           /* Amber 500 */
--color-danger: #EF4444;            /* Red 500 */
```

## 📊 Graphiques et Visualisations

### Dashboard

- **Stat Cards** : Fond `#ECFDF5` (Emerald 50), texte `#10B981`
- **Graphique en aires** : Ligne `#10B981`, gradient subtil
- **Graphique en barres** : Barres `#10B981`
- **Graphique circulaire** : Palette de verts `#10B981`, `#059669`, `#047857`, `#065F46`

### Reports

- **Lignes** : `#10B981` (entrées), `#059669` (transferts)
- **Barres** : `#10B981`
- **Palette** : `['#10B981', '#059669', '#047857', '#065F46', '#F59E0B', '#34D399']`

### Audit Log

- **Barres** : `#10B981`

## 🧭 Navigation

### Sidebar Desktop

- **Logo** : Gradient `#10B981` → `#059669`
- **Item actif** : Fond `#ECFDF5`, texte `#10B981`
- **Avatar** : Gradient `#10B981` → `#059669`

### Bottom Navigation Mobile

- **Item actif** : Couleur `#10B981`
- **Item inactif** : Couleur `#94A3B8`

### Menu Mobile

- **Item actif** : Fond `#ECFDF5`, texte `#10B981`

## 🔐 Page de Connexion

### Panneau Gauche (Desktop)

- **Gradient** : `#10B981` → `#059669` → `#047857`
- **Logo** : Gradient `#10B981` → `#059669`

### Formulaire

- **Focus ring** : `#10B981` avec opacité 20%
- **Bordure focus** : `#10B981`
- **Bannière info** : Fond `#ECFDF5`, bordure `#A7F3D0`, texte `#065F46`

## 👥 Membres

### Table

- **Avatars** : Gradient `#10B981` → `#059669`
- **Recherche** : Focus ring `#10B981`

## 🔔 Notifications (Toast)

### Types

- **Success** : Fond `#ECFDF5`, bordure `#A7F3D0`, icône `#10B981`
- **Info** : Fond `#ECFDF5`, bordure `#A7F3D0`, icône `#10B981`
- **Warning** : Fond `#FFFBEB`, bordure `#FDE68A`, icône `#F59E0B`
- **Error** : Fond `#FEF2F2`, bordure `#FECACA`, icône `#EF4444`

## 🏷️ Badges

### Variants

- **Info** : Fond `#ECFDF5`, texte `#065F46`, bordure `#A7F3D0`
- **Success** : Fond `#ECFDF5`, texte `#065F46`, bordure `#A7F3D0`
- **Warning** : Fond `#FFFBEB`, texte `#92400E`, bordure `#FDE68A`
- **Danger** : Fond `#FEF2F2`, texte `#991B1B`, bordure `#FECACA`

## 🎯 Boutons

### Primary

- **Background** : `#10B981`
- **Hover** : `#059669`
- **Focus ring** : `#10B981`

### Secondary

- **Background** : `#FFFFFF`
- **Border** : `#E2E8F0`
- **Hover** : Fond `#F8FAFC`, bordure `#CBD5E1`

## 📱 PWA

### Manifest

```json
{
  "theme_color": "#10B981",
  "background_color": "#FFFFFF"
}
```

### Meta Tags

```html
<meta name="theme-color" content="#10B981" />
```

### Icône

- **Background** : `#10B981`
- **Texte** : `#FFFFFF`

## 🎨 Classes Tailwind Utilisées

### Couleurs de Fond

```
bg-[#10B981]    /* Emerald 500 */
bg-[#ECFDF5]    /* Emerald 50 */
bg-[#F0FDF4]    /* Green 50 */
```

### Couleurs de Texte

```
text-[#10B981]  /* Emerald 500 */
text-[#059669]  /* Emerald 600 */
text-[#065F46]  /* Emerald 800 */
```

### Couleurs de Bordure

```
border-[#10B981]  /* Emerald 500 */
border-[#A7F3D0]  /* Emerald 200 */
```

### Focus Ring

```
focus:ring-[#10B981]/20
focus:border-[#10B981]
```

### Gradients

```
bg-gradient-to-br from-[#10B981] to-[#059669]
bg-gradient-to-br from-[#10B981] via-[#059669] to-[#047857]
```

## ✅ Checklist de Migration

- [x] Variables CSS dans `index.css`
- [x] Composants UI (`Button`, `Input`, `Badge`)
- [x] Layout (Sidebar, Bottom Nav)
- [x] Page de connexion
- [x] Dashboard (stats, graphiques)
- [x] Membres (table, avatars)
- [x] Reports (graphiques)
- [x] Servants (graphiques)
- [x] Audit Log (graphiques)
- [x] Toast notifications
- [x] PWA manifest
- [x] Meta tags HTML
- [x] Icône SVG

## 🎯 Résultat

L'application utilise maintenant un thème vert émeraude élégant et professionnel, offrant :

- ✅ Une esthétique fraîche et naturelle
- ✅ Une excellente lisibilité
- ✅ Une cohérence visuelle parfaite
- ✅ Des transitions fluides
- ✅ Une identité visuelle forte
- ✅ Un thème PWA cohérent

## 📝 Notes

- Toutes les couleurs bleues (`#2563EB`, `#1D4ED8`, `#3B82F6`, `#4F46E5`, `#6366F1`) ont été remplacées par des verts émeraude
- Les gradients utilisent maintenant des tons de vert
- Les focus rings et hover states utilisent le vert principal
- Le thème PWA est cohérent avec le thème de l'application
- L'icône de l'application utilise le vert émeraude

---

**Dernière mise à jour** : Thème vert & blanc appliqué avec succès
