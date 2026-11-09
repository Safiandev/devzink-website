# DevZink Website

The DevZink agency website — AI Agents & Automation, AI Product Engineering, Web & App Development.

**Live:** https://devzink.com

## Hosting — Cloudflare only

This site is hosted **only on Cloudflare** (Worker `devzink`, custom domain `devzink.com`).
This repository is connected to Cloudflare: **every push to `main` deploys automatically**.

- **Netlify is NOT used.** Do not add `netlify.toml`, `vercel.json`, or any Netlify/Vercel config — the Netlify project is dead (no credits) and its files must never be pushed here again. Pushing the old Netlify version once reverted the live site (2026-11-09).
- The Worker script (the `/api/contact` + `/api/consent` backend and the cookie-consent KV binding) lives in the Cloudflare dashboard (`Workers & Pages → devzink → Edit code`). Static files alone do not include it.

## Structure

- `index.html`, `services.html`, `ai-automation.html`, `web-app-development.html`, `work.html`, `about.html`, `contact.html` — the 7 pages (flat root, clean URLs)
- `cookie-consent.js` — consent banner, posts records to `/api/consent`
- `*.woff2` — self-hosted fonts (Clash Display, General Sans, JetBrains Mono)
- `favicon*`, `apple-touch-icon.png`, `logo-512.png`, `og-image.png` — brand assets
- `wf-*.webp`, `image-*.webp` — workflow screenshots
- `robots.txt`, `sitemap.xml`, `site.webmanifest`
- `404.html` — custom not-found page
- `.well-known/security.txt`

No framework, no build step, no external JS/CSS libraries — vanilla HTML/CSS/JS.

## Contact form

`contact.html` posts to `/api/contact` (Cloudflare Worker route). If that request fails, the form falls back to opening the visitor's email app (mailto). The Web3Forms call in the page is disabled (placeholder key). An n8n webhook snippet is included before `</body>` — its URL is `http://localhost:5678/...` and only works on the PC running n8n; replace it with the n8n Production URL before relying on it live.

## Preview locally

```bash
python3 -m http.server 8000
```

then open http://localhost:8000 (note: `/api/contact` and `/api/consent` only work on the live site, not locally).

## License

© 2026 DevZink. All rights reserved — portfolio review only.
