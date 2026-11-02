# DevZink — AI Automation Agency Website

The live website for **DevZink**, an AI automation & Agentic AI agency. A fully static, SEO-friendly build — no framework, no build step, no external JS/CSS libraries.

🌐 **Live:** [devzink.com](https://devzink.com)

## Pages

| Page | File | URL |
| --- | --- | --- |
| Home | `index.html` | `/` |
| Services | `services.html` | `/services` |
| AI Automation | `ai-automation.html` | `/ai-automation` |
| Web & App Development | `web-app-development.html` | `/web-app-development` |
| Work | `work.html` | `/work` |
| About | `about.html` | `/about` |
| Contact | `contact.html` | `/contact` |
| Not Found | `404.html` | — |

Clean URLs (`/services` instead of `/services.html`) work via `netlify.toml` on Netlify and `vercel.json` (`cleanUrls`) on Vercel.

## Tech Stack

- **HTML · CSS · Vanilla JavaScript** — hand-written, no framework, no build tools
- **Self-hosted fonts** — Clash Display, General Sans, JetBrains Mono (WOFF2, preloaded)
- **Images** — WebP workflow shots + PNG favicons/OG image
- **Forms** — Netlify Forms contact form (with honeypot spam protection)
- **Booking** — Calendly embeds
- **Analytics** — Google Analytics / Tag Manager
- **Consent** — `cookie-consent.js`

## Highlights

- SEO-first: semantic markup, canonical URLs, hreflang, JSON-LD schema, sitemap + robots, full favicon/manifest set, OG image
- Security headers via `netlify.toml` — HSTS, strict CSP, `X-Frame-Options: DENY`, nosniff, referrer policy
- Smart caching — fonts immutable for a year, images for 30 days, HTML revalidated every time
- Build/config files hidden from the public — requests for `netlify.toml`, `vercel.json`, `package.json` etc. return the 404 page
- Fully responsive, hand-tuned CSS — no CSS framework

## Project Structure

```
├── index.html / about.html / services.html / work.html
├── contact.html / ai-automation.html / web-app-development.html
├── 404.html
├── *.woff2                  # self-hosted fonts
├── *.webp / *.png           # images, favicons, OG image
├── cookie-consent.js
├── netlify.toml             # publish root, redirects, security + cache headers
├── vercel.json              # cleanUrls
├── sitemap.xml / robots.txt / site.webmanifest
├── .well-known/security.txt
└── readme.txt               # hosting notes
```

## Preview Locally

No build step — serve the folder with any static server:

```
npx serve .
# or
python3 -m http.server 8000
```

Then open `http://localhost:8000`. Note: opening the files directly with `file://` will not follow the clean `/page` links — use a local server.

## Deployment

Deployed as a static site. `netlify.toml` sets publish directory to root (`.`) with redirects and headers; `vercel.json` keeps clean URLs working on Vercel. On other hosts (cPanel/Apache), enable MultiViews or add rewrite rules so `/services` serves `services.html`. To update the live site, upload all files in this folder together to the host root.

## License

© 2026 DevZink. All rights reserved. This code is published for portfolio review only — reuse, redistribution, or commercial use without permission is not allowed.
