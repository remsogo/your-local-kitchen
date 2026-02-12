# Your Local Kitchen

Application React + Vite (TypeScript) prête à être publiée sur GitHub Pages.

## Prérequis

- Node.js 20+
- npm

## Installation locale

```sh
npm install
cp .env.example .env
# puis renseigner les vraies valeurs Supabase dans .env
npm run dev
```

## Variables d'environnement

Créer un fichier `.env` à partir de `.env.example` :

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Déploiement GitHub Pages (classique)

Le projet est configuré pour un déploiement de type **project pages** sur :

`https://<username>.github.io/your-local-kitchen/`

Points déjà configurés :

- `HashRouter` pour éviter les erreurs 404 côté GitHub Pages
- `base` Vite sur `/your-local-kitchen/` en production
- workflow GitHub Actions `.github/workflows/deploy.yml`

### Étapes GitHub

1. Créer les secrets repository :
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
2. Push sur `main`.
3. Dans **Settings > Pages** : Source = **GitHub Actions**.
4. Vérifier le run du workflow **Deploy to GitHub Pages**.

## Domaine personnalisé

Pas encore activé dans ce repo.

Quand vous aurez le domaine, on ajoutera `public/CNAME` et la configuration DNS.
