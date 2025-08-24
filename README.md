# Times-up

Jeu web (non officiel) inspiré du principe de **Time’s Up!** : une application **React + TypeScript** (Vite) pour créer et jouer avec des listes de cartes, gérées par manches successives et chronomètres. Le dépôt est pensé pour un déploiement simple sur **GitHub Pages**.

> Objectif : une interface légère et rapide à lancer pour des soirées jeux, avec des paquets personnalisables.

---

## ✨ Fonctionnalités (actuelles / prévues)

- Création et gestion de **paquets** / cartes personnalisées
- Parcours en **rounds** (décrire → un mot → mime), chronos et scores
- **Sauvegarde locale** (LocalStorage)
- **UI responsive** avec Tailwind CSS
- Export/Import de paquets **JSON** *(à venir)*
- Multi‑joueurs local (plusieurs écrans) *(à venir)*

---

## 🧱 Stack technique

- **React** + **TypeScript**
- **Vite** (dev server & build)
- **Tailwind CSS**
- **React Router**

---

## 🚀 Démarrage rapide

### Prérequis
- **Node.js 20** (ou supérieur)
- **npm** (ou `pnpm`/`yarn`, adaptez les commandes)

### Installation (client)

```bash
# cloner le dépôt
git clone https://github.com/ThomasTew1579/Times-up.git
cd Times-up

# installer les dépendances (client)
cd client
npm install

# lancer en développement
npm run dev

# (optionnel) build + aperçu
npm run build
npm run preview
```

> Si vous migrez depuis une ancienne config, vérifiez la cohérence Tailwind (v3/v4) et PostCSS.

---

## 📦 Scripts utiles (client)

| Script            | Action                                    |
|-------------------|-------------------------------------------|
| `npm run dev`     | Lance Vite en mode dev                    |
| `npm run build`   | Build de production                       |
| `npm run preview` | Sert le build localement pour vérification |

---

## ⚙️ Configuration Vite pour GitHub Pages

Sur GitHub Pages, l’app est servie sous `https://<user>.github.io/Times-up/`. Il faut **définir la base** du projet :

`client/vite.config.ts`
```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/Times-up/", // <- IMPORTANT pour GitHub Pages
});
```

---

## 🌐 Déploiement via GitHub Actions

Créez le workflow suivant pour builder et publier automatiquement sur Pages quand vous poussez sur `main`.

`.github/workflows/deploy.yml`
```yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: client
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: client/package-lock.json
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: client/dist

  deploy:
    runs-on: ubuntu-latest
    needs: build
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

Puis, dans **Settings → Pages**, sélectionnez **GitHub Actions** comme source.

---

## 📁 Arborescence (simplifiée)

```
Times-up/
├─ client/            # App React/Vite (TypeScript)
│  ├─ src/
│  ├─ index.html
│  ├─ vite.config.ts
│  └─ package.json
├─ serveur/           # (optionnel) POC/API
├─ package.json       # scripts racine (si monorepo)
└─ README.md
```

---

## 🤝 Contribution

Les PR sont bienvenues (petites, ciblées). Ouvrez d’abord une issue pour discuter des changements majeurs.

---

## 📜 Licence

À définir (aucun fichier `LICENSE` pour le moment).
