# A&B Barber Lounge 2 — Website

Official website for **A&B Barber Lounge 2**, a barber salon located at Perlegade 64, Sønderborg, Denmark.

Live site: [ab-barberlounge2.dk](https://ab-barberlounge2.dk)

---

## Tech Stack

- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS** + **shadcn/ui**
- **React Router** for client-side routing
- Deployed via **GitHub Pages** with **GitHub Actions**

## Features

- Fully configurable via `public/site-config.json` — no code changes needed for content updates
- Settings panel at `/settings` for live preview and one-click publishing
- Instagram embed feed (manual reel URLs in config)
- Google Maps integration for address links
- Tracking code injection (head/footer) via Settings panel
- SEO meta tags, Open Graph, structured data (LocalBusiness schema)
- Responsive — mobile, tablet, desktop
- Forced light color-scheme (no dark mode override)

## Content Management

All site content is managed through `public/site-config.json` or the built-in Settings panel (`/settings`). Changes published via the Settings panel are pushed to GitHub and deployed automatically within ~2 minutes.

## Development

```bash
npm install
npm run dev
```

## Deployment

Pushes to `main` trigger GitHub Actions which builds and deploys to GitHub Pages automatically.
