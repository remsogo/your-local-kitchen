# Pizz'Atiq

Application React + Vite (TypeScript) deployable on GitHub Pages.

## Prerequisites

- Node.js 20+
- npm

## Local setup

```sh
npm install
cp .env.example .env
# then fill .env values
npm run dev
```

## Environment variables

Create `.env` from `.env.example`:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_PIZZERIA_PHONE` (display format, ex: `06 12 34 56 78`)
- `VITE_GA_MEASUREMENT_ID` (optional, Google Analytics 4)

## GitHub Pages deploy

This project is configured for custom domain deployment:

`https://pizzatiq.fr/`

Already configured:

- `HashRouter` to avoid 404 on refresh
- Vite `base` set to `/` for custom domain
- GitHub Actions workflow: `.github/workflows/deploy.yml`
- `public/CNAME` configured with `pizzatiq.fr`

### GitHub steps

1. Add repository secrets:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_GA_MEASUREMENT_ID` (optional)
2. Add repository variable:
   - `VITE_PIZZERIA_PHONE`
3. Push to `main`.
4. In **Settings > Pages** set Source to **GitHub Actions**.
5. Check workflow run: **Deploy to GitHub Pages**.

## Custom domain

DNS and registrar setup is done outside this repo (IONOS side).
