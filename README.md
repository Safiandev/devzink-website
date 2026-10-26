# DevZink — AI Automation Agency Website

The live website for **DevZink**, an AI automation & Agentic AI agency. A fully static, SEO-friendly build — no framework, no build step.

🌐 **Live:** [devzink.com](https://devzink.com)

## Pages

| Page | File |
|---|---|
| Home | `index.html` |
| About | `about.html` |
| Services | `services.html` |
| Work | `work.html` |
| Contact | `contact.html` |
| AI Automation | `ai-automation.html` |
| Web & App Development | `web-app-development.html` |

## Tech Stack

- **HTML5 · CSS3 · Vanilla JavaScript** — no framework, no build tools
- **GSAP 3.12.5** (CDN) — scroll-driven motion system
- **Vanta.js (NET)** — WebGL hero background

## Highlights

- SEO-friendly static pages with semantic markup
- Motion system: scroll-triggered reveals, animated hero, marquee sections
- Dedicated service pages for AI Automation and Web/App Development
- Fully responsive, hand-tuned CSS — no CSS framework

## Project Structure

```
├── index.html
├── about.html / services.html / work.html / contact.html
├── ai-automation.html
├── web-app-development.html
├── assets/
│   ├── css/
│   ├── js/
│   └── images/
└── .htaccess
```

## Preview Locally

No build step — serve the folder with any static server:

```bash
npx serve .
# or
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Deployment

Deployed as a static site (any static host works — Vercel, Netlify, or shared hosting with the included `.htaccess`). To update the live site, push to `main` and redeploy, or upload the changed files.

## License

© 2026 DevZink. All rights reserved. This code is published for portfolio review only — reuse, redistribution, or commercial use without permission is not allowed.
