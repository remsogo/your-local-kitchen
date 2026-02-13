# README2 - Pourquoi ces ajouts SEO sont utiles

Ce fichier explique l'interet concret des optimisations SEO ajoutees dans le projet.

## 1) Image sociale (`public/og-image.jpg`)

- Utilite: quand quelqu'un partage `https://pizzatiq.fr/` sur WhatsApp, Facebook, X, Discord, etc., la carte d'aperçu affiche une image.
- Sans image valide: apercu pauvre ou parfois vide, donc moins de clics.
- Impact: meilleur taux de clic depuis les partages.

## 2) Balise canonical (`index.html`)

- Utilite: indique l'URL officielle a indexer (`https://pizzatiq.fr/`).
- Evite: dilution SEO si plusieurs variantes d'URL existent (avec/without slash, params, etc.).
- Impact: signal SEO plus propre pour Google.

## 3) Metas Open Graph/Twitter avec URL absolue

- Utilite: les reseaux sociaux recuperent plus fiablement l'image et les infos quand les URLs sont absolues.
- Evite: previews cassees selon la plateforme.
- Impact: meilleur rendu des liens partages.

## 4) Donnees structurees JSON-LD (`Restaurant`)

- Utilite: aide Google a comprendre explicitement:
  - nom du restaurant
  - telephones
  - adresse
  - horaires
  - type de cuisine
- Impact: meilleure comprehension semantique et eligibility accrue aux enrichissements de resultat.

## 5) Sitemap (`public/sitemap.xml`)

- Utilite: donne un point d'entree clair aux robots d'indexation.
- Impact: decouverte plus simple de l'URL principale.

## Remarque importante sur le routing hash (`/#/...`)

Le site utilise actuellement `HashRouter`.
Les URLs avec `#` sont moins ideales pour le SEO classique.

Si un jour vous voulez optimiser davantage le referencement des pages internes (menu, contact, etc.),
il faudra envisager:

1. `BrowserRouter` + fallback serveur adapte.
2. Metas specifiques par page.
3. Eventuellement pre-render/SSR pour les pages strategiques.

## Variables: ou trouver chaque secret

Ces valeurs sont configurees dans GitHub pour le build/deploy.

### 1) `VITE_SUPABASE_URL` (secret GitHub)

- Ou la trouver: dashboard Supabase > votre projet > **Settings** > **API**.
- Valeur a copier: `Project URL`.
- Ou la mettre dans GitHub: repository > **Settings** > **Secrets and variables** > **Actions** > **New repository secret**.

### 2) `VITE_SUPABASE_ANON_KEY` (secret GitHub)

- Ou la trouver: dashboard Supabase > votre projet > **Settings** > **API**.
- Valeur a copier: `anon public` key.
- Ou la mettre dans GitHub: repository > **Settings** > **Secrets and variables** > **Actions** > **New repository secret**.

### 3) `VITE_CLOUDFLARE_BEACON_TOKEN` (secret GitHub, optionnel)

- Ou la trouver: Cloudflare > **Web Analytics** > votre site > **Install / JavaScript snippet**.
- Valeur a copier: `token` du beacon.
- Ou la mettre dans GitHub: repository > **Settings** > **Secrets and variables** > **Actions** > **New repository secret**.

### 4) `VITE_PIZZERIA_PHONE` (variable GitHub, pas secret)

- Valeur: numero affiche sur le site (ex: `06.84.06.93.85`).
- Ou la mettre dans GitHub: repository > **Settings** > **Secrets and variables** > **Actions** > onglet **Variables** > **New repository variable**.
