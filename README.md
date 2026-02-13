# Your Local Kitchen

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
- `VITE_CLOUDFLARE_BEACON_TOKEN` (optional, Cloudflare Web Analytics)

## GitHub Pages deploy

This project is configured for project pages:

`https://<username>.github.io/your-local-kitchen/`

Already configured:

- `HashRouter` to avoid 404 on refresh
- Vite `base` set to `/your-local-kitchen/` in production
- GitHub Actions workflow: `.github/workflows/deploy.yml`

### GitHub steps

1. Add repository secrets:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_CLOUDFLARE_BEACON_TOKEN` (optional)
2. Add repository variable:
   - `VITE_PIZZERIA_PHONE`
3. Push to `main`.
4. In **Settings > Pages** set Source to **GitHub Actions**.
5. Check workflow run: **Deploy to GitHub Pages**.

## Custom domain

Not configured yet. Add `public/CNAME` and DNS records when ready.
