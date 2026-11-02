Devzink website - 7 pages

Pages: index.html (/), services.html (/services), ai-automation.html (/ai-automation),
web-app-development.html (/web-app-development), work.html (/work), about.html (/about), contact.html (/contact)

Includes 404.html, robots.txt, sitemap.xml, favicons, og-image.png and netlify.toml (security + cache headers).
Upload ALL files in this folder together to the root of your hosting.
- Netlify: drag the folder in. Clean URLs (/services) work automatically, and the contact form also works through Netlify Forms.
- Vercel: vercel.json is included (cleanUrls), so /services etc. work.
- Other hosts (cPanel/Apache): enable "MultiViews" or add rewrite rules so /services serves services.html.

Note: opening the files by double-click (file://) will not follow the /page links. Test on a host, or run a local server in this folder: npx serve .
